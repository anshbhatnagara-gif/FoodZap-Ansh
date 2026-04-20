/**
 * Review Model - MySQL Version
 * Handles restaurant and food item reviews with ratings
 */

const { db } = require('../config/database');

class ReviewModel {
  // Create review
  static async create(data) {
    const { userId, restaurantId, orderId, rating, comment, images } = data;
    
    const sql = `INSERT INTO reviews (userId, restaurantId, orderId, rating, comment, images) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [
      userId, restaurantId || null, orderId || null,
      rating, comment || null, JSON.stringify(images || [])
    ];
    
    const result = await db.query(sql, params);
    
    // Update restaurant rating
    if (restaurantId) {
      await this._updateRestaurantRating(restaurantId);
    }
    
    return this.findById(result.insertId);
  }

  // Find by ID
  static async findById(id) {
    const sql = `SELECT r.*, u.name as userName, u.avatar as userAvatar 
                 FROM reviews r 
                 LEFT JOIN users u ON r.userId = u.id 
                 WHERE r.id = ?`;
    const reviews = await db.query(sql, [id]);
    if (!reviews[0]) return null;
    return this._parseReview(reviews[0]);
  }

  // Find by restaurant
  static async findByRestaurant(restaurantId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const sql = `SELECT r.*, u.name as userName, u.avatar as userAvatar 
                 FROM reviews r 
                 LEFT JOIN users u ON r.userId = u.id 
                 WHERE r.restaurantId = ? 
                 ORDER BY r.createdAt DESC LIMIT ? OFFSET ?`;
    const reviews = await db.query(sql, [restaurantId, limit, offset]);
    return reviews.map(r => this._parseReview(r));
  }

  // Find by user
  static async findByUser(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const sql = `SELECT r.*, res.name as restaurantName 
                 FROM reviews r 
                 LEFT JOIN restaurants res ON r.restaurantId = res.id 
                 WHERE r.userId = ? 
                 ORDER BY r.createdAt DESC LIMIT ? OFFSET ?`;
    const reviews = await db.query(sql, [userId, limit, offset]);
    return reviews.map(r => this._parseReview(r));
  }

  // Update review
  static async update(id, updateData) {
    const allowedFields = ['rating', 'comment', 'images', 'isVerified'];
    const updates = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        if (key === 'images') {
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
    await db.query(`UPDATE reviews SET ${updates.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  // Delete review
  static async delete(id) {
    const review = await this.findById(id);
    await db.query(`DELETE FROM reviews WHERE id = ?`, [id]);
    
    if (review && review.restaurantId) {
      await this._updateRestaurantRating(review.restaurantId);
    }
    return { deleted: true };
  }

  // Get average rating for restaurant
  static async getAverageRating(restaurantId) {
    const sql = `SELECT AVG(rating) as average, COUNT(*) as count 
                 FROM reviews WHERE restaurantId = ?`;
    const result = await db.query(sql, [restaurantId]);
    return {
      average: parseFloat(result[0].average) || 0,
      count: result[0].count || 0
    };
  }

  // Update restaurant rating aggregate
  static async _updateRestaurantRating(restaurantId) {
    const stats = await this.getAverageRating(restaurantId);
    await db.query(`UPDATE restaurants SET rating = ?, ratingCount = ? WHERE id = ?`, 
      [stats.average.toFixed(1), stats.count, restaurantId]);
  }

  // Parse JSON fields
  static _parseReview(row) {
    if (!row) return null;
    try {
      row.images = typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || []);
    } catch (e) { row.images = []; }
    return row;
  }
}

module.exports = ReviewModel;
