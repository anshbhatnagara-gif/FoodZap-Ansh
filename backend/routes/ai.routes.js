/**
 * AI Routes
 * Routes for AI-powered features
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');

// Public routes
router.get('/trending', aiController.getTrendingSuggestions);
router.get('/search-suggestions', optionalAuth, aiController.getSearchSuggestions);
router.post('/chat', optionalAuth, aiController.chat);

// Protected routes (require authentication)
router.post('/suggest', authenticate, aiController.suggestByMood);
router.get('/recommendations', authenticate, aiController.getPersonalizedRecommendations);

// Advanced AI recommendations
router.get('/smart-recommendations', authenticate, aiController.getSmartRecommendations);
router.get('/order-again', authenticate, aiController.getOrderAgain);

// Predictive features
router.post('/eta', authenticate, aiController.calculateETA);
router.get('/optimal-times', authenticate, aiController.getOptimalTimes);

// Restaurant-specific AI features
router.get('/restaurant/:restaurantId/combinations', aiController.getMenuCombinations);
router.get('/restaurant/:restaurantId/demand-predict', authenticate, aiController.predictDemand);

module.exports = router;
