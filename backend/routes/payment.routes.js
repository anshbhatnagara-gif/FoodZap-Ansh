/**
 * Payment Routes
 */

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Public route to get key
router.get('/key', paymentController.getKey);

// Protected routes
router.use(authenticate);

router.post('/create-order', paymentController.createPaymentOrder);
router.post('/order', paymentController.createPaymentOrder); // Alias for frontend
router.post('/verify', paymentController.verifyPayment);
router.post('/failed', paymentController.paymentFailed);
router.get('/:orderId', paymentController.getPaymentDetails);

// Admin only route (add middleware for admin check)
router.post('/refund', paymentController.processRefund);

module.exports = router;
