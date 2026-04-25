/**
 * Payment Controller
 * Handles payment processing with Razorpay
 * MySQL Compatible Version
 */

const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/order.model');
const { db } = require('../config/database');

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

    const order = await Order.findById(orderId);

    if (!order || order.userId != userId) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed'
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(order.finalAmount * 100), // Convert to paise
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        orderId: order.id.toString(),
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

    // Update order payment status using SQL
    await db.query(
      `UPDATE orders SET paymentStatus = 'completed', paymentId = ?, paidAt = NOW() WHERE id = ?`,
      [razorpay_payment_id, orderId]
    );
    
    const updatedOrder = await Order.findById(orderId);

    // Emit payment confirmation
    req.io.to(`order-${orderId}`).emit('payment-completed', {
      orderId: updatedOrder.orderNumber,
      transactionId: razorpay_payment_id
    });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderId: updatedOrder.orderNumber,
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

    await db.query(
      `UPDATE orders SET paymentStatus = 'failed', paymentError = ? WHERE id = ? AND userId = ?`,
      [error, orderId, userId]
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

    const order = await Order.findById(orderId);

    if (!order || order.userId != userId) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: {
        status: order.paymentStatus,
        transactionId: order.paymentId,
        paidAt: order.paidAt
      }
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

    if (!order || order.paymentStatus !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Order not found or payment not completed'
      });
    }

    const refundAmount = amount || order.finalAmount;

    // Create refund in Razorpay
    const refund = await razorpay.payments.refund(order.paymentId, {
      amount: Math.round(refundAmount * 100),
      notes: { reason }
    });

    // Update order using SQL
    await db.query(
      `UPDATE orders SET paymentStatus = 'refunded', refundAmount = ?, refundReason = ?, refundStatus = 'completed' WHERE id = ?`,
      [refundAmount, reason, orderId]
    );

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
