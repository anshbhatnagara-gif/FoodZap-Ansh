/**
 * Order Routes
 */

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All order routes require authentication
router.use(authenticate);

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/track/:id', orderController.trackOrder);
router.get('/:id', orderController.getOrder);
router.put('/:id/cancel', orderController.cancelOrder);
router.post('/:id/rate', orderController.rateOrder);
router.post('/:id/reorder', orderController.reorder);

module.exports = router;
