/**
 * Loyalty Controller
 * Handles loyalty points, rewards, and tier management
 */

const Loyalty = require('../models/loyalty.model');
const Order = require('../models/order.model');

/**
 * Get user's loyalty points and stats
 */
exports.getMyPoints = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const points = await Loyalty.getUserPoints(userId);
    const benefits = Loyalty.getTierBenefits(points.tier);
    const recentTransactions = await Loyalty.getTransactionHistory(userId, 10);

    res.json({
      success: true,
      data: {
        points: {
          available: points.availablePoints,
          lifetime: points.lifetimePoints,
          redeemed: points.redeemedPoints
        },
        tier: {
          current: points.tier,
          benefits,
          nextTier: getNextTierInfo(points.tier, points.lifetimePoints)
        },
        recentTransactions
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Redeem points for discount
 */
exports.redeemPoints = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { points, orderId } = req.body;

    if (!points || points < 100) {
      return res.status(400).json({
        success: false,
        message: 'Minimum 100 points required to redeem'
      });
    }

    // Calculate discount (1 point = ₹0.50)
    const discountAmount = points * 0.5;

    const result = await Loyalty.redeemPoints(
      userId, 
      points, 
      `Redeemed for Order #${orderId || 'future order'}`
    );

    res.json({
      success: true,
      message: `${points} points redeemed successfully`,
      data: {
        pointsRedeemed: result.pointsRedeemed,
        discountAmount,
        discountCode: `LOYALTY_${Date.now()}`,
        expiresIn: '24 hours'
      }
    });
  } catch (error) {
    if (error.message === 'Insufficient points') {
      return res.status(400).json({
        success: false,
        message: 'Insufficient loyalty points'
      });
    }
    next(error);
  }
};

/**
 * Get transaction history
 */
exports.getTransactionHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const transactions = await Loyalty.getTransactionHistory(userId, parseInt(limit));

    res.json({
      success: true,
      data: {
        transactions: transactions.map(t => ({
          id: t.id,
          type: t.type,
          points: t.points,
          description: t.description,
          orderId: t.orderId,
          date: t.createdAt
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get leaderboard (top customers)
 */
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const leaderboard = await Loyalty.getLeaderboard(parseInt(limit));

    res.json({
      success: true,
      data: {
        leaderboard: leaderboard.map((user, index) => ({
          rank: index + 1,
          name: user.name,
          tier: user.tier,
          lifetimePoints: user.lifetimePoints,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Calculate potential points for an order
 */
exports.calculatePotentialPoints = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { orderAmount } = req.body;

    const userPoints = await Loyalty.getUserPoints(userId);
    const benefits = Loyalty.getTierBenefits(userPoints.tier);

    const basePoints = Loyalty.calculateOrderPoints(orderAmount);
    const bonusPoints = Math.floor(basePoints * (benefits.pointsMultiplier - 1));
    const totalPoints = basePoints + bonusPoints;

    res.json({
      success: true,
      data: {
        orderAmount,
        basePoints,
        tierMultiplier: benefits.pointsMultiplier,
        bonusPoints,
        totalPoints,
        tier: userPoints.tier
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to get next tier info
function getNextTierInfo(currentTier, lifetimePoints) {
  const tiers = [
    { name: 'bronze', minPoints: 0 },
    { name: 'silver', minPoints: 1000 },
    { name: 'gold', minPoints: 5000 },
    { name: 'platinum', minPoints: 10000 }
  ];

  const currentIndex = tiers.findIndex(t => t.name === currentTier);
  const nextTier = tiers[currentIndex + 1];

  if (!nextTier) {
    return { name: null, pointsNeeded: 0, message: 'You are at the highest tier!' };
  }

  const pointsNeeded = nextTier.minPoints - lifetimePoints;

  return {
    name: nextTier.name,
    pointsNeeded: Math.max(0, pointsNeeded),
    progress: Math.min(100, Math.round((lifetimePoints / nextTier.minPoints) * 100))
  };
}

/**
 * Webhook: Award points when order is completed (called internally)
 */
exports.awardPointsForOrder = async (userId, orderId, orderAmount) => {
  try {
    const points = Loyalty.calculateOrderPoints(orderAmount);
    
    await Loyalty.addPoints(
      userId,
      points,
      orderId,
      `Points earned for order #${orderId}`
    );

    console.log(`✅ Awarded ${points} points to user ${userId} for order ${orderId}`);
    return { success: true, points };
  } catch (error) {
    console.error('Error awarding points:', error);
    return { success: false, error: error.message };
  }
};
