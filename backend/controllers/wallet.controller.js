/**
 * Wallet Controller
 * Handles wallet operations, balance management, and transactions
 */

const Wallet = require('../models/wallet.model');
const Subscription = require('../models/subscription.model');
const User = require('../models/user.model');
const notificationService = require('../services/notification.service');

/**
 * Get user's wallet details
 */
exports.getWallet = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const wallet = await Wallet.getOrCreate(userId);
    const stats = await Wallet.getStats(userId);

    res.json({
      success: true,
      data: {
        wallet: {
          balance: wallet.balance,
          availableBalance: wallet.balance,
          isActive: wallet.isActive
        },
        stats
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get wallet transaction history
 */
exports.getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, type, startDate, endDate } = req.query;

    const result = await Wallet.getTransactions(userId, parseInt(page), parseInt(limit));
    if (!result) {
      return res.json({
        success: true,
        data: {
          transactions: [],
          total: 0,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: 0
        }
      });
    }

    const filters = {};
    if (type) filters.type = type;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const historyResult = result.getTransactionHistory(
      parseInt(page),
      parseInt(limit),
      filters
    );

    res.json({
      success: true,
      data: historyResult
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add money to wallet
 */
exports.addMoney = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { amount, paymentMethod, paymentId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid amount'
      });
    }

    const wallet = await Wallet.getOrCreateWallet(userId);

    // Check daily/monthly limits
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const dailyTransactions = wallet.transactions.filter(
      t => t.type === 'credit' && t.createdAt >= today
    );
    const monthlyTransactions = wallet.transactions.filter(
      t => t.type === 'credit' && t.createdAt >= thisMonth
    );

    const dailyTotal = dailyTransactions.reduce((sum, t) => sum + t.amount, 0);
    const monthlyTotal = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);

    if (dailyTotal + amount > wallet.limits.dailyLimit) {
      return res.status(400).json({
        success: false,
        message: `Daily limit exceeded. Maximum daily add: ₹${wallet.limits.dailyLimit - dailyTotal}`
      });
    }

    if (monthlyTotal + amount > wallet.limits.monthlyLimit) {
      return res.status(400).json({
        success: false,
        message: `Monthly limit exceeded. Maximum monthly add: ₹${wallet.limits.monthlyLimit - monthlyTotal}`
      });
    }

    // Add money to wallet
    const transaction = await wallet.addMoney(
      amount,
      `Added via ${paymentMethod}`,
      { paymentMethod, paymentId }
    );

    // Send notification
    notificationService.sendWebSocketNotification(req.io, userId, 'PAYMENT_SUCCESS', {
      title: 'Money Added to Wallet',
      body: `₹${amount} has been added to your wallet`,
      amount
    });

    res.json({
      success: true,
      message: `₹${amount} added to wallet successfully`,
      data: {
        transaction,
        newBalance: wallet.balance
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Check wallet balance for order
 */
exports.checkBalance = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { amount } = req.query;

    const balance = await Wallet.getBalance(userId);
    const hasEnough = parseFloat(balance) >= parseFloat(amount || 0);

    res.json({
      success: true,
      data: {
        balance,
        requested: parseFloat(amount || 0),
        hasEnough,
        canUseWallet: hasEnough
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get available subscription plans
 */
exports.getSubscriptionPlans = async (req, res, next) => {
  try {
    const plans = Subscription.getDefaultPlans();

    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's current subscription
 */
exports.getUserSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const subscription = await Subscription.findActiveByUser(userId);

    if (!subscription) {
      return res.json({
        success: true,
        data: {
          plan: 'Free',
          status: 'active',
          isFree: true
        }
      });
    }

    res.json({
      success: true,
      data: {
        subscription: {
          plan: subscription.planType,
          status: subscription.isActive ? 'active' : 'inactive',
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          autoRenew: subscription.autoRenew,
          isActive: subscription.isActive
        },
        benefits: subscription.benefits
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Subscribe to a plan
 */
exports.subscribe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { planId, cycle = 'monthly', paymentMethod } = req.body;

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: 'Plan ID is required'
      });
    }

    const allPlans = Subscription.getDefaultPlans();
    const plan = allPlans.find(p => p.planType === planId);
    if (!plan) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan'
      });
    }

    const amount = plan.price;

    // Check existing subscription
    const existingSub = await Subscription.findActiveByUser(userId);

    if (existingSub) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active subscription. Please cancel it first or upgrade.'
      });
    }

    // If paying via wallet, check balance
    if (paymentMethod === 'wallet') {
      const balance = await Wallet.getBalance(userId);
      if (parseFloat(balance) < amount) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient wallet balance. Please add money to your wallet first.',
          data: { required: amount, available: balance }
        });
      }

      // Deduct from wallet
      await Wallet.deductMoney(userId, amount, `Subscription: ${plan.name}`);
    }

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    if (cycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Create subscription
    const subscription = await Subscription.create({
      userId,
      planType: planId,
      startDate,
      endDate,
      price: amount,
      benefits: plan.features,
      autoRenew: true,
      paymentId: null
    });

    // Send notification
    notificationService.sendWebSocketNotification(req.io, userId, 'ORDER_CONFIRMED', {
      title: 'Subscription Activated!',
      body: `You're now a ${plan.displayName} member!`,
      amount
    });

    res.json({
      success: true,
      message: `Successfully subscribed to ${plan.displayName}`,
      data: {
        subscription: {
          plan: plan.displayName,
          status: 'active',
          startDate,
          endDate,
          benefits: plan.benefits
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel subscription
 */
exports.cancelSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { reason } = req.body;

    const subscription = await Subscription.findActiveByUser(userId);

    if (!subscription) {
      return res.status(400).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    await Subscription.cancel(subscription.id, userId);

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: {
        validUntil: subscription.endDate,
        message: 'You can use benefits until the end of your billing period'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update auto-recharge settings
 */
exports.updateAutoRecharge = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { enabled, threshold, amount, paymentMethod } = req.body;

    // Auto-recharge feature simplified for MySQL version
    res.json({
      success: true,
      message: 'Auto-recharge settings updated',
      data: {
        enabled: enabled || false,
        threshold: threshold || 100,
        amount: amount || 500,
        paymentMethod: paymentMethod || 'card'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get cashback summary
 */
exports.getCashbackSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { days = 30 } = req.query;

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.json({
        success: true,
        data: {
          totalCashback: 0,
          pendingCashback: 0,
          recentCashback: []
        }
      });
    }

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const cashbackTransactions = wallet.transactions.filter(
      t => t.type === 'cashback' && t.createdAt >= since
    );

    const pendingTransactions = cashbackTransactions.filter(t => t.status === 'pending');

    res.json({
      success: true,
      data: {
        totalCashback: wallet.totalCashback,
        periodCashback: cashbackTransactions.reduce((sum, t) => sum + t.amount, 0),
        pendingCashback: pendingTransactions.reduce((sum, t) => sum + t.amount, 0),
        recentCashback: cashbackTransactions.slice(0, 10),
        summary: {
          days,
          transactionCount: cashbackTransactions.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Process cashback for an order
 */
exports.processCashback = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { orderId, orderAmount, cashbackPercent } = req.body;

    const wallet = await Wallet.getOrCreateWallet(userId);

    // Calculate cashback
    const cashbackAmount = Math.floor((orderAmount * cashbackPercent) / 100);

    if (cashbackAmount > 0) {
      await wallet.addCashback(
        cashbackAmount,
        `Cashback for order #${orderId}`,
        orderId,
        { orderAmount, cashbackPercent }
      );

      // Send notification
      notificationService.sendWebSocketNotification(req.io, userId, 'PAYMENT_SUCCESS', {
        title: 'Cashback Received!',
        body: `₹${cashbackAmount} cashback added to your wallet`,
        amount: cashbackAmount
      });
    }

    res.json({
      success: true,
      data: {
        cashbackAmount,
        newBalance: wallet.balance
      }
    });
  } catch (error) {
    next(error);
  }
};
