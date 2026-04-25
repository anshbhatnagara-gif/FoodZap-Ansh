/**
 * User Model - MySQL Version
 * Handles customers, delivery partners, restaurant owners, and admins
 */

const { db } = require('../config/database');
const bcrypt = require('bcryptjs');

class UserModel {
  // Create new user
  static async create(userData) {
    const { name, email, phone, password, role = 'customer', avatar = null, googleId = null, isVerified = false } = userData;
    
    // Hash password (if provided, otherwise null for Google users)
    let hashedPassword = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }
    
    const sql = `INSERT INTO users (name, email, phone, password, role, avatar, googleId, isVerified) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const result = await db.query(sql, [name, email, phone || null, hashedPassword, role, avatar, googleId, isVerified]);
    
    return { id: result.insertId, name, email, phone, role, avatar, googleId, isVerified };
  }

  // Find user by ID
  static async findById(id) {
    const sql = `SELECT id, name, email, phone, role, avatar, isActive, isVerified, createdAt 
                 FROM users WHERE id = ?`;
    const users = await db.query(sql, [id]);
    return users[0] || null;
  }

  // Find user by email (with password for login)
  static async findByEmail(email) {
    const sql = `SELECT * FROM users WHERE email = ?`;
    const users = await db.query(sql, [email]);
    return users[0] || null;
  }

  // Find user by phone (with password for login)
  static async findByPhone(phone) {
    const sql = `SELECT * FROM users WHERE phone = ?`;
    const users = await db.query(sql, [phone]);
    return users[0] || null;
  }

  // Find user by Google ID
  static async findByGoogleId(googleId) {
    const sql = `SELECT * FROM users WHERE googleId = ?`;
    const users = await db.query(sql, [googleId]);
    return users[0] || null;
  }

  // Update user
  static async update(id, updateData) {
    const allowedFields = ['name', 'phone', 'avatar', 'role', 'isActive', 'isVerified', 'googleId', 'lastLogin'];
    const updates = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (updates.length === 0) return null;
    
    values.push(id);
    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    await db.query(sql, values);
    
    return this.findById(id);
  }

  // Alias for update (for compatibility)
  static async updateById(id, updateData) {
    return this.update(id, updateData);
  }

  // Delete user
  static async delete(id) {
    const sql = `DELETE FROM users WHERE id = ?`;
    await db.query(sql, [id]);
    return { deleted: true };
  }

  // Get all users with pagination
  static async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const sql = `SELECT id, name, email, phone, role, isActive, createdAt 
                 FROM users ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    return await db.query(sql, [limit, offset]);
  }

  // Count total users
  static async count() {
    const sql = `SELECT COUNT(*) as count FROM users`;
    const result = await db.query(sql);
    return result[0].count;
  }

  // Compare password
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Get user addresses
  static async getAddresses(userId) {
    const sql = `SELECT * FROM addresses WHERE userId = ? ORDER BY isDefault DESC`;
    return await db.query(sql, [userId]);
  }

  // Add address
  static async addAddress(userId, addressData) {
    const { label, street, city, state, pincode, landmark, latitude, longitude, isDefault = false } = addressData;
    
    if (isDefault) {
      // Remove default from other addresses
      await db.query(`UPDATE addresses SET isDefault = false WHERE userId = ?`, [userId]);
    }
    
    const sql = `INSERT INTO addresses (userId, label, street, city, state, pincode, landmark, latitude, longitude, isDefault) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const result = await db.query(sql, [userId, label, street, city, state, pincode, landmark, latitude, longitude, isDefault]);
    
    return { id: result.insertId, ...addressData };
  }

  // Update address
  static async updateAddress(addressId, userId, addressData) {
    const allowedFields = ['label', 'street', 'city', 'state', 'pincode', 'landmark', 'latitude', 'longitude', 'isDefault'];
    const updates = [];
    const values = [];
    
    for (const [key, value] of Object.entries(addressData)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (updates.length === 0) return null;
    
    if (addressData.isDefault) {
      await db.query(`UPDATE addresses SET isDefault = false WHERE userId = ?`, [userId]);
    }
    
    values.push(addressId, userId);
    const sql = `UPDATE addresses SET ${updates.join(', ')} WHERE id = ? AND userId = ?`;
    await db.query(sql, values);
    
    const addresses = await db.query(`SELECT * FROM addresses WHERE id = ?`, [addressId]);
    return addresses[0];
  }

  // Delete address
  static async deleteAddress(addressId, userId) {
    const sql = `DELETE FROM addresses WHERE id = ? AND userId = ?`;
    await db.query(sql, [addressId, userId]);
    return { deleted: true };
  }

  // Search users
  static async search(query) {
    const sql = `SELECT id, name, email, phone, role FROM users 
                 WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?`;
    const searchTerm = `%${query}%`;
    return await db.query(sql, [searchTerm, searchTerm, searchTerm]);
  }
}

module.exports = UserModel;
