/**
 * Loyalty/Rewards Model - MySQL Version
 * Manages customer loyalty points and rewards
 */

const { db } = require('../config/database');

class LoyaltyModel {
  // Get user's loyalty points and stats
  static async getUserPoints(userId) {
    const sql = `SELECT * FROM loyalty_points WHERE userId = ?`;
    const result = await db.query(sql, [userId]);
    
    if (!result[0]) {
      // Create initial record if doesn't exist
      await this.createUserPoints(userId);
      return {
        userId,
        totalPoints: 0,
        availablePoints: 0,
        redeemedPoints: 0,
        tier: 'bronze',
        lifetimePoints: 0
      };
    }
    
    return result[0];
  }

  // Create initial loyalty record for user
  static async createUserPoints(userId) {
    const sql = `INSERT IGNORE INTO loyalty_points (userId, totalPoints, availablePoints, redeemedPoints, tier, lifetimePoints) 
                 VALUES (?, 0, 0, 0, 'bronze', 0)`;
    await db.query(sql, [userId]);
    return this.getUserPoints(userId);
  }

  // Add points (when order is placed)
  static async addPoints(userId, points, orderId, description) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Update loyalty points
      await connection.execute(
        `UPDATE loyalty_points 
         SET availablePoints = availablePoints + ?, 
             lifetimePoints = lifetimePoints + ?,
             totalPoints = totalPoints + ?,
             updatedAt = NOW()
         WHERE userId = ?`,
        [points, points, points, userId]
      );

      // Record transaction
      await connection.execute(
        `INSERT INTO loyalty_transactions (userId, type, points, orderId, description, createdAt) 
         VALUES (?, 'earned', ?, ?, ?, NOW())`,
        [userId, points, orderId, description]
      );

      // Check and update tier
      await this.checkAndUpdateTier(connection, userId);

      await connection.commit();
      return { success: true, pointsAdded: points };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Redeem points
  static async redeemPoints(userId, points, description = 'Points redeemed') {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Check available points
      const [userPoints] = await connection.execute(
        `SELECT availablePoints FROM loyalty_points WHERE userId = ?`,
        [userId]
      );

      if (!userPoints || userPoints.availablePoints < points) {
        throw new Error('Insufficient points');
      }

      // Deduct points
      await connection.execute(
        `UPDATE loyalty_points 
         SET availablePoints = availablePoints - ?, 
             redeemedPoints = redeemedPoints + ?,
             updatedAt = NOW()
         WHERE userId = ?`,
        [points, points, userId]
      );

      // Record transaction
      await connection.execute(
        `INSERT INTO loyalty_transactions (userId, type, points, description, createdAt) 
         VALUES (?, 'redeemed', ?, ?, NOW())`,
        [userId, -points, description]
      );

      await connection.commit();
      return { success: true, pointsRedeemed: points };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Check and update user tier based on lifetime points
  static async checkAndUpdateTier(connection, userId) {
    const [userData] = await connection.execute(
      `SELECT lifetimePoints FROM loyalty_points WHERE userId = ?`,
      [userId]
    );

    if (!userData) return;

    const lifetime = userData.lifetimePoints;
    let newTier = 'bronze';

    if (lifetime >= 10000) newTier = 'platinum';
    else if (lifetime >= 5000) newTier = 'gold';
    else if (lifetime >= 1000) newTier = 'silver';

    await connection.execute(
      `UPDATE loyalty_points SET tier = ? WHERE userId = ?`,
      [newTier, userId]
    );
  }

  // Get transaction history
  static async getTransactionHistory(userId, limit = 20) {
    const sql = `SELECT * FROM loyalty_transactions 
                 WHERE userId = ? 
                 ORDER BY createdAt DESC 
                 LIMIT ?`;
    return await db.query(sql, [userId, limit]);
  }

  // Calculate points for an order (1 point per ₹10 spent)
  static calculateOrderPoints(orderAmount) {
    return Math.floor(orderAmount / 10);
  }

  // Get tier benefits
  static getTierBenefits(tier) {
    const benefits = {
      bronze: {
        name: 'Bronze',
        pointsMultiplier: 1,
        prioritySupport: false,
        freeDeliveryThreshold: 500,
        discount: 0
      },
      silver: {
        name: 'Silver',
        pointsMultiplier: 1.25,
        prioritySupport: false,
        freeDeliveryThreshold: 400,
        discount: 5
      },
      gold: {
        name: 'Gold',
        pointsMultiplier: 1.5,
        prioritySupport: true,
        freeDeliveryThreshold: 300,
        discount: 10
      },
      platinum: {
        name: 'Platinum',
        pointsMultiplier: 2,
        prioritySupport: true,
        freeDeliveryThreshold: 0,
        discount: 15
      }
    };
    return benefits[tier] || benefits.bronze;
  }

  // Get leaderboard (top customers)
  static async getLeaderboard(limit = 10) {
    const sql = `SELECT lp.*, u.name, u.email 
                 FROM loyalty_points lp
                 JOIN users u ON lp.userId = u.id
                 ORDER BY lp.lifetimePoints DESC
                 LIMIT ?`;
    return await db.query(sql, [limit]);
  }
}

module.exports = LoyaltyModel;
