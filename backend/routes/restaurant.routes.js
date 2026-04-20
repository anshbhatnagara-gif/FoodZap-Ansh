/**
 * Restaurant Routes
 */

const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');

// Public routes
router.get('/', optionalAuth, restaurantController.getRestaurants);
router.get('/popular', restaurantController.getPopularRestaurants);
router.get('/featured', restaurantController.getFeaturedRestaurants);
router.get('/:id', optionalAuth, restaurantController.getRestaurant);
router.get('/:id/menu', restaurantController.getMenu);
router.get('/:id/reviews', restaurantController.getReviews);

// Protected routes
router.post('/:id/reviews', authenticate, restaurantController.addReview);

module.exports = router;
