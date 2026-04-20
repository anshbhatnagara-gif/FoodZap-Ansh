/**
 * Restaurant Model - MySQL Version
 * Stores restaurant information, ratings, and operational details
 */

const { db } = require('../config/database');

class RestaurantModel {
  // Create restaurant
  static async create(data) {
    const { name, description, cuisine, address, phone, email, ownerId, images,
            priceForTwo, deliveryTimeMin, deliveryTimeMax, isPureVeg, offers } = data;
    
    const sql = `INSERT INTO restaurants 
      (name, description, cuisine, address, phone, email, ownerId, images, 
       priceForTwo, deliveryTimeMin, deliveryTimeMax, isPureVeg, offers) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const params = [
      name, description, 
      JSON.stringify(cuisine || []), 
      JSON.stringify(address || {}), 
      phone, email, ownerId, 
      JSON.stringify(images || {}), 
      priceForTwo || 300, 
      deliveryTimeMin || 30, 
      deliveryTimeMax || 45, 
      isPureVeg || false, 
      JSON.stringify(offers || [])
    ];
    
    const result = await db.query(sql, params);
    return this.findById(result.insertId);
  }

  // Find by ID
  static async findById(id) {
    const sql = `SELECT * FROM restaurants WHERE id = ?`;
    const restaurants = await db.query(sql, [id]);
    if (!restaurants[0]) return null;
    return this._parseRestaurant(restaurants[0]);
  }

  // Find all with filters
  static async findAll(filters = {}) {
    const { cuisine, isPureVeg, isOpen, page = 1, limit = 20, sort = 'rating' } = filters;
    const offset = (page - 1) * limit;
    
    let sql = `SELECT * FROM restaurants WHERE 1=1`;
    const params = [];
    
    if (cuisine) {
      sql += ` AND JSON_CONTAINS(cuisine, ?)`;
      params.push(JSON.stringify(cuisine));
    }
    if (isPureVeg !== undefined) {
      sql += ` AND isPureVeg = ?`;
      params.push(isPureVeg);
    }
    if (isOpen !== undefined) {
      sql += ` AND isOpen = ?`;
      params.push(isOpen);
    }
    
    // Sort
    if (sort === 'rating') sql += ` ORDER BY rating DESC`;
    else if (sort === 'price') sql += ` ORDER BY priceForTwo ASC`;
    else sql += ` ORDER BY createdAt DESC`;
    
    sql += ` LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
    
    const restaurants = await db.query(sql, params);
    return restaurants.map(r => this._parseRestaurant(r));
  }

  // Update restaurant
  static async update(id, updateData) {
    const allowedFields = ['name', 'description', 'cuisine', 'address', 'phone', 
                           'email', 'images', 'rating', 'ratingCount', 'priceForTwo',
                           'deliveryTimeMin', 'deliveryTimeMax', 'isPureVeg', 'offers',
                           'isOpen', 'isActive'];
    const updates = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        if (['cuisine', 'address', 'images', 'offers'].includes(key)) {
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
    await db.query(`UPDATE restaurants SET ${updates.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  // Delete restaurant
  static async delete(id) {
    await db.query(`DELETE FROM restaurants WHERE id = ?`, [id]);
    return { deleted: true };
  }

  // Count restaurants
  static async count(filters = {}) {
    let sql = `SELECT COUNT(*) as count FROM restaurants WHERE 1=1`;
    const params = [];
    
    if (filters.isPureVeg !== undefined) {
      sql += ` AND isPureVeg = ?`;
      params.push(filters.isPureVeg);
    }
    
    const result = await db.query(sql, params);
    return result[0].count;
  }

  // Search restaurants
  static async search(query, limit = 10) {
    const searchTerm = `%${query}%`;
    const sql = `SELECT * FROM restaurants 
                 WHERE name LIKE ? OR description LIKE ? 
                 OR JSON_CONTAINS(cuisine, ?)
                 ORDER BY rating DESC LIMIT ?`;
    const cuisineSearch = `"${query}"`;
    const restaurants = await db.query(sql, [searchTerm, searchTerm, cuisineSearch, limit]);
    return restaurants.map(r => this._parseRestaurant(r));
  }

  // Parse JSON fields
  static _parseRestaurant(row) {
    if (!row) return null;
    try {
      row.cuisine = typeof row.cuisine === 'string' ? JSON.parse(row.cuisine) : row.cuisine;
      row.address = typeof row.address === 'string' ? JSON.parse(row.address) : row.address;
      row.images = typeof row.images === 'string' ? JSON.parse(row.images) : row.images;
      row.offers = typeof row.offers === 'string' ? JSON.parse(row.offers) : row.offers;
    } catch (e) {}
    return row;
  }
}

module.exports = RestaurantModel;
