/**
 * Wallet Routes
 * Routes for wallet operations, subscriptions, and cashback
 */

const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All wallet routes require authentication
router.use(authenticate);

// Wallet balance and info
router.get('/', walletController.getWallet);
router.get('/balance', walletController.checkBalance);

// Wallet transactions
router.get('/transactions', walletController.getTransactions);

// Add money to wallet
router.post('/add-money', walletController.addMoney);

// Auto-recharge settings
router.put('/auto-recharge', walletController.updateAutoRecharge);

// Subscription plans
router.get('/subscription-plans', walletController.getSubscriptionPlans);
router.get('/subscription', walletController.getUserSubscription);
router.post('/subscribe', walletController.subscribe);
router.post('/cancel-subscription', walletController.cancelSubscription);

// Cashback
router.get('/cashback-summary', walletController.getCashbackSummary);
router.post('/process-cashback', walletController.processCashback);

module.exports = router;
