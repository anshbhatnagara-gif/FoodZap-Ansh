/**
 * Coupon Model - MySQL Version
 * Handles discount coupons and offers
 */

const { db } = require('../config/database');

class CouponModel {
  // Create coupon
  static async create(data) {
    const { code, description, discountType, discountValue, minOrderAmount,
            maxDiscountAmount, validFrom, validUntil, usageLimit, applicableRestaurants } = data;
    
    const sql = `INSERT INTO coupons 
      (code, description, discountType, discountValue, minOrderAmount, maxDiscountAmount, 
       validFrom, validUntil, usageLimit, applicableRestaurants) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const params = [
      code.toUpperCase(), description || null, discountType, discountValue,
      minOrderAmount || 0, maxDiscountAmount || null,
      validFrom, validUntil, usageLimit || null,
      JSON.stringify(applicableRestaurants || [])
    ];
    
    const result = await db.query(sql, params);
    return this.findById(result.insertId);
  }

  // Find by ID
  static async findById(id) {
    const sql = `SELECT * FROM coupons WHERE id = ?`;
    const coupons = await db.query(sql, [id]);
    if (!coupons[0]) return null;
    return this._parseCoupon(coupons[0]);
  }

  // Find by code
  static async findByCode(code) {
    const sql = `SELECT * FROM coupons WHERE code = ?`;
    const coupons = await db.query(sql, [code.toUpperCase()]);
    if (!coupons[0]) return null;
    return this._parseCoupon(coupons[0]);
  }

  // Find all active coupons
  static async findActive(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const sql = `SELECT * FROM coupons WHERE isActive = true AND validUntil > NOW() 
                 ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    const coupons = await db.query(sql, [limit, offset]);
    return coupons.map(c => this._parseCoupon(c));
  }

  // Validate coupon
  static async validate(code, orderValue, userId = null) {
    const coupon = await this.findByCode(code);
    
    if (!coupon) return { valid: false, reason: 'Invalid coupon code' };
    if (!coupon.isActive) return { valid: false, reason: 'Coupon is inactive' };
    if (new Date() < new Date(coupon.validFrom)) return { valid: false, reason: 'Coupon not yet valid' };
    if (new Date() > new Date(coupon.validUntil)) return { valid: false, reason: 'Coupon expired' };
    if (orderValue < coupon.minOrderAmount) return { valid: false, reason: `Minimum order ₹${coupon.minOrderAmount} required` };
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return { valid: false, reason: 'Coupon usage limit reached' };
    
    // Check per-user usage
    if (userId) {
      const userUsage = await db.query(`SELECT COUNT(*) as count FROM user_coupons WHERE userId = ? AND couponId = ?`, [userId, coupon.id]);
      if (userUsage[0].count > 0) return { valid: false, reason: 'Coupon already used' };
    }
    
    const discount = this.calculateDiscount(coupon, orderValue);
    return { valid: true, coupon, discount };
  }

  // Calculate discount
  static calculateDiscount(coupon, orderValue) {
    let discount = 0;
    
    if (coupon.discountType === 'percentage') {
      discount = (orderValue * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);
    } else if (coupon.discountType === 'fixed') {
      discount = coupon.discountValue;
    }
    
    return Math.min(discount, orderValue);
  }

  // Apply coupon (record usage)
  static async applyCoupon(code, userId, orderId) {
    const coupon = await this.findByCode(code);
    if (!coupon) return null;
    
    // Increment usage count
    await db.query(`UPDATE coupons SET usageCount = usageCount + 1 WHERE id = ?`, [coupon.id]);
    
    // Record user usage
    await db.query(`INSERT INTO user_coupons (userId, couponId, orderId) VALUES (?, ?, ?)`, [userId, coupon.id, orderId]);
    
    return coupon;
  }

  // Update coupon
  static async update(id, updateData) {
    const allowedFields = ['description', 'discountType', 'discountValue', 'minOrderAmount',
                           'maxDiscountAmount', 'validFrom', 'validUntil', 'usageLimit', 'isActive', 'applicableRestaurants'];
    const updates = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        if (key === 'applicableRestaurants') {
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
    await db.query(`UPDATE coupons SET ${updates.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  // Delete coupon
  static async delete(id) {
    await db.query(`DELETE FROM coupons WHERE id = ?`, [id]);
    return { deleted: true };
  }

  // Parse JSON fields
  static _parseCoupon(row) {
    if (!row) return null;
    try {
      row.applicableRestaurants = typeof row.applicableRestaurants === 'string' ? JSON.parse(row.applicableRestaurants) : (row.applicableRestaurants || []);
    } catch (e) { row.applicableRestaurants = []; }
    return row;
  }
}

module.exports = CouponModel;
