/**
 * Subscription Model - MySQL Version
 * FoodZap Pro/Premium subscription plans
 */

const { db } = require('../config/database');

class SubscriptionModel {
  // Create subscription
  static async create(data) {
    const { userId, planType, startDate, endDate, price, benefits, autoRenew, paymentId } = data;
    
    const sql = `INSERT INTO subscriptions 
      (userId, planType, startDate, endDate, price, benefits, autoRenew, paymentId) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const params = [
      userId, planType, startDate || new Date(), endDate,
      price, JSON.stringify(benefits || {}), autoRenew || false, paymentId || null
    ];
    
    const result = await db.query(sql, params);
    return this.findById(result.insertId);
  }

  // Find by ID
  static async findById(id) {
    const sql = `SELECT * FROM subscriptions WHERE id = ?`;
    const subs = await db.query(sql, [id]);
    if (!subs[0]) return null;
    return this._parseSub(subs[0]);
  }

  // Find active subscription by user
  static async findActiveByUser(userId) {
    const sql = `SELECT * FROM subscriptions WHERE userId = ? AND isActive = true AND endDate > NOW() ORDER BY createdAt DESC LIMIT 1`;
    const subs = await db.query(sql, [userId]);
    if (!subs[0]) return null;
    return this._parseSub(subs[0]);
  }

  // Find all subscriptions by user
  static async findByUser(userId) {
    const sql = `SELECT * FROM subscriptions WHERE userId = ? ORDER BY createdAt DESC`;
    const subs = await db.query(sql, [userId]);
    return subs.map(s => this._parseSub(s));
  }

  // Cancel subscription
  static async cancel(id, userId) {
    await db.query(`UPDATE subscriptions SET isActive = false, autoRenew = false WHERE id = ? AND userId = ?`, [id, userId]);
    return this.findById(id);
  }

  // Update subscription
  static async update(id, updateData) {
    const allowedFields = ['planType', 'endDate', 'price', 'benefits', 'isActive', 'autoRenew', 'paymentId'];
    const updates = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        if (key === 'benefits') {
          updates.push(`${key} = ?`);
          values.push(JSON.stringify(value));
        } else {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }
    }
    
    if (updates.length === 0) return null;
    values.push(id);
    await db.query(`UPDATE subscriptions SET ${updates.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  // Check if user has active subscription
  static async hasActiveSubscription(userId) {
    const sub = await this.findActiveByUser(userId);
    return sub !== null;
  }

  // Get default plans
  static getDefaultPlans() {
    return [
      {
        planType: 'basic',
        name: 'FoodZap Free',
        price: 0,
        features: ['Standard Delivery', 'Basic Support']
      },
      {
        planType: 'premium',
        name: 'FoodZap Pro',
        price: 49,
        features: ['Free Delivery (10/month)', '5% Discount', 'Priority Support', 'Faster Delivery']
      },
      {
        planType: 'gold',
        name: 'FoodZap Premium',
        price: 99,
        features: ['Unlimited Free Delivery', '10% Discount', '5% Cashback', 'Priority Delivery', '24/7 Support', 'Exclusive Deals']
      }
    ];
  }

  // Parse JSON fields
  static _parseSub(row) {
    if (!row) return null;
    try {
      row.benefits = typeof row.benefits === 'string' ? JSON.parse(row.benefits) : (row.benefits || {});
    } catch (e) { row.benefits = {}; }
    return row;
  }
}

module.exports = SubscriptionModel;
