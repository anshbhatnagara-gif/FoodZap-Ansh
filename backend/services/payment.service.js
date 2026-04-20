/**
 * Payment Service
 * Handles Razorpay payment integration
 */

const razorpay = require('../config/razorpay');
const crypto = require('crypto');

/**
 * Create a new Razorpay order
 */
const createOrder = async (amount, currency = 'INR', receipt, notes = {}) => {
  try {
    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt,
      notes
    };

    const order = await razorpay.orders.create(options);
    
    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt
    };
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    return {
      success: false,
      message: error.message || 'Failed to create payment order'
    };
  }
};

/**
 * Verify payment signature
 */
const verifyPayment = (orderId, paymentId, signature) => {
  try {
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === signature;

    return {
      success: isAuthentic,
      message: isAuthentic ? 'Payment verified' : 'Invalid signature'
    };
  } catch (error) {
    console.error('Payment Verification Error:', error);
    return {
      success: false,
      message: 'Payment verification failed'
    };
  }
};

/**
 * Capture payment (for manual capture)
 */
const capturePayment = async (paymentId, amount) => {
  try {
    const payment = await razorpay.payments.capture(paymentId, amount * 100);
    return {
      success: true,
      payment
    };
  } catch (error) {
    console.error('Payment Capture Error:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Refund payment
 */
const refundPayment = async (paymentId, amount = null) => {
  try {
    const options = {};
    if (amount) {
      options.amount = amount * 100;
    }

    const refund = await razorpay.payments.refund(paymentId, options);
    return {
      success: true,
      refund
    };
  } catch (error) {
    console.error('Refund Error:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Get payment details
 */
const getPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return {
      success: true,
      payment
    };
  } catch (error) {
    console.error('Fetch Payment Error:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Create customer for saved cards
 */
const createCustomer = async (name, email, phone) => {
  try {
    const customer = await razorpay.customers.create({
      name,
      email,
      contact: phone
    });
    return {
      success: true,
      customerId: customer.id
    };
  } catch (error) {
    console.error('Create Customer Error:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  capturePayment,
  refundPayment,
  getPaymentDetails,
  createCustomer
};
