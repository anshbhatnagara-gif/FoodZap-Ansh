/**
 * Menu Item Model - MySQL Version
 * Stores food items for restaurants and grocery products
 */

const { db } = require('../config/database');

class MenuModel {
  // Create menu item
  static async create(data) {
    const { restaurantId, categoryId, name, description, price, isVeg, 
            isBestseller, image, rating, variants, tags } = data;
    
    const sql = `INSERT INTO menu_items 
      (restaurantId, categoryId, name, description, price, isVeg, isBestseller, image, rating, variants, tags) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const params = [
      restaurantId, categoryId || null, name, description, price,
      isVeg !== undefined ? isVeg : true, isBestseller || false,
      image || null, rating || 0,
      JSON.stringify(variants || []), JSON.stringify(tags || [])
    ];
    
    const result = await db.query(sql, params);
    return this.findById(result.insertId);
  }

  // Find by ID
  static async findById(id) {
    const sql = `SELECT * FROM menu_items WHERE id = ?`;
    const items = await db.query(sql, [id]);
    if (!items[0]) return null;
    return this._parseItem(items[0]);
  }

  // Find by restaurant
  static async findByRestaurant(restaurantId, filters = {}) {
    const { isVeg, isBestseller, categoryId } = filters;
    
    let sql = `SELECT * FROM menu_items WHERE restaurantId = ?`;
    const params = [restaurantId];
    
    if (isVeg !== undefined) { sql += ` AND isVeg = ?`; params.push(isVeg); }
    if (isBestseller) { sql += ` AND isBestseller = true`; }
    if (categoryId) { sql += ` AND categoryId = ?`; params.push(categoryId); }
    
    sql += ` ORDER BY isBestseller DESC, rating DESC`;
    const items = await db.query(sql, params);
    return items.map(i => this._parseItem(i));
  }

  // Find by category
  static async findByCategory(categoryId) {
    const sql = `SELECT * FROM menu_items WHERE categoryId = ? ORDER BY rating DESC`;
    const items = await db.query(sql, [categoryId]);
    return items.map(i => this._parseItem(i));
  }

  // Get bestsellers
  static async getBestsellers(restaurantId = null, limit = 10) {
    let sql = `SELECT * FROM menu_items WHERE isBestseller = true`;
    const params = [];
    if (restaurantId) { sql += ` AND restaurantId = ?`; params.push(restaurantId); }
    sql += ` ORDER BY rating DESC LIMIT ?`;
    params.push(limit);
    const items = await db.query(sql, params);
    return items.map(i => this._parseItem(i));
  }

  // Search items
  static async search(query, limit = 20) {
    const searchTerm = `%${query}%`;
    const sql = `SELECT * FROM menu_items 
                 WHERE name LIKE ? OR description LIKE ? 
                 ORDER BY rating DESC LIMIT ?`;
    const items = await db.query(sql, [searchTerm, searchTerm, limit]);
    return items.map(i => this._parseItem(i));
  }

  // Update item
  static async update(id, updateData) {
    const allowedFields = ['name', 'description', 'price', 'isVeg', 'isBestseller', 
                           'isAvailable', 'image', 'rating', 'variants', 'tags', 'categoryId'];
    const updates = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        if (['variants', 'tags'].includes(key)) {
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
    await db.query(`UPDATE menu_items SET ${updates.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  // Delete item
  static async delete(id) {
    await db.query(`DELETE FROM menu_items WHERE id = ?`, [id]);
    return { deleted: true };
  }

  // Parse JSON fields
  static _parseItem(row) {
    if (!row) return null;
    try {
      row.variants = typeof row.variants === 'string' ? JSON.parse(row.variants) : (row.variants || []);
      row.tags = typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || []);
    } catch (e) {}
    return row;
  }
}

module.exports = MenuModel;
