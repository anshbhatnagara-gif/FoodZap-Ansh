/**
 * Loyalty Routes
 * Endpoints for loyalty points and rewards
 */

const express = require('express');
const router = express.Router();
const loyaltyController = require('../controllers/loyalty.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Get user's loyalty points and stats
router.get('/points', loyaltyController.getMyPoints);

// Get transaction history
router.get('/history', loyaltyController.getTransactionHistory);

// Redeem points for discount
router.post('/redeem', loyaltyController.redeemPoints);

// Calculate potential points for order
router.post('/calculate', loyaltyController.calculatePotentialPoints);

// Get leaderboard
router.get('/leaderboard', loyaltyController.getLeaderboard);

module.exports = router;
