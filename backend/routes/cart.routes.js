/**
 * Cart Routes
 */

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All cart routes require authentication
router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/item/:itemId', cartController.updateQuantity);
router.delete('/item/:itemId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);
router.post('/coupon', cartController.applyCoupon);
router.delete('/coupon', cartController.removeCoupon);

module.exports = router;
