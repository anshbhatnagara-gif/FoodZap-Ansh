/**
 * Payment Controller
 * Handles payment processing with Razorpay
 */

const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/order.model');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * Create payment order
 */
exports.createPaymentOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.payment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed'
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(order.pricing.totalAmount * 100), // Convert to paise
      currency: 'INR',
      receipt: order.orderId,
      notes: {
        orderId: order._id.toString(),
        userId: userId.toString()
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify payment
 */
exports.verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Update order payment status
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        'payment.status': 'completed',
        'payment.transactionId': razorpay_payment_id,
        'payment.paidAt': new Date()
      },
      { new: true }
    );

    // Emit payment confirmation
    req.io.to(`order-${order._id}`).emit('payment-completed', {
      orderId: order.orderId,
      transactionId: razorpay_payment_id
    });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderId: order.orderId,
        paymentId: razorpay_payment_id,
        status: 'completed'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle payment failure
 */
exports.paymentFailed = async (req, res, next) => {
  try {
    const { orderId, error } = req.body;
    const userId = req.user.id;

    await Order.findOneAndUpdate(
      { _id: orderId, user: userId },
      {
        'payment.status': 'failed',
        'payment.error': error
      }
    );

    res.json({
      success: true,
      message: 'Payment failure recorded'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get payment details
 */
exports.getPaymentDetails = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne(
      { _id: orderId, user: userId },
      'orderId pricing.payment payment'
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order.payment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Process refund
 */
exports.processRefund = async (req, res, next) => {
  try {
    const { orderId, amount, reason } = req.body;

    const order = await Order.findById(orderId);

    if (!order || order.payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Order not found or payment not completed'
      });
    }

    const refundAmount = amount || order.pricing.totalAmount;

    // Create refund in Razorpay
    const refund = await razorpay.payments.refund(order.payment.transactionId, {
      amount: Math.round(refundAmount * 100),
      notes: { reason }
    });

    // Update order
    order.payment.status = 'refunded';
    order.payment.refundAmount = refundAmount;
    order.payment.refundReason = reason;
    order.cancellation.refundStatus = 'completed';
    await order.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refundId: refund.id,
        amount: refundAmount,
        status: refund.status
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Razorpay key
 */
exports.getKey = async (req, res, next) => {
  try {
    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    next(error);
  }
};
