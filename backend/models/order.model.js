/**
 * Order Model - MySQL Version
 * Handles food orders and grocery orders with complete lifecycle
 */

const { db } = require('../config/database');

class OrderModel {
  // Generate unique order number
  static _generateOrderNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `FZ${timestamp}${random}`;
  }

  // Create order
  static async create(data) {
    const { userId, restaurantId, items, totalAmount, discountAmount, deliveryCharge,
            taxAmount, finalAmount, paymentMethod, paymentId, deliveryAddress,
            specialInstructions } = data;
    
    const orderNumber = this._generateOrderNumber();
    const sql = `INSERT INTO orders 
      (orderNumber, userId, restaurantId, items, totalAmount, discountAmount, 
       deliveryCharge, taxAmount, finalAmount, paymentMethod, paymentId, 
       deliveryAddress, specialInstructions, status, paymentStatus) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')`;
    
    const params = [
      orderNumber, userId, restaurantId,
      JSON.stringify(items || []),
      totalAmount, discountAmount || 0, deliveryCharge || 0,
      taxAmount || 0, finalAmount, paymentMethod || 'cod',
      paymentId || null, JSON.stringify(deliveryAddress || {}),
      specialInstructions || null
    ];
    
    const result = await db.query(sql, params);
    
    // Add initial status to history
    await db.query(`INSERT INTO order_status_history (orderId, status, notes) VALUES (?, 'pending', 'Order placed')`, [result.insertId]);
    
    return this.findById(result.insertId);
  }

  // Find by ID
  static async findById(id) {
    const sql = `SELECT * FROM orders WHERE id = ?`;
    const orders = await db.query(sql, [id]);
    if (!orders[0]) return null;
    return this._parseOrder(orders[0]);
  }

  // Find by order number
  static async findByOrderNumber(orderNumber) {
    const sql = `SELECT * FROM orders WHERE orderNumber = ?`;
    const orders = await db.query(sql, [orderNumber]);
    if (!orders[0]) return null;
    return this._parseOrder(orders[0]);
  }

  // Find by user
  static async findByUser(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const sql = `SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    const orders = await db.query(sql, [userId, limit, offset]);
    return orders.map(o => this._parseOrder(o));
  }

  // Find by restaurant
  static async findByRestaurant(restaurantId, status = null) {
    let sql = `SELECT * FROM orders WHERE restaurantId = ?`;
    const params = [restaurantId];
    if (status) { sql += ` AND status = ?`; params.push(status); }
    sql += ` ORDER BY createdAt DESC`;
    const orders = await db.query(sql, params);
    return orders.map(o => this._parseOrder(o));
  }

  // Update order status
  static async updateStatus(id, status, notes = null) {
    await db.query(`UPDATE orders SET status = ? WHERE id = ?`, [status, id]);
    
    // Add to status history
    await db.query(`INSERT INTO order_status_history (orderId, status, notes) VALUES (?, ?, ?)`, [id, status, notes]);
    
    // Update payment status if delivered
    if (status === 'delivered') {
      await db.query(`UPDATE orders SET paymentStatus = 'completed', actualDeliveryTime = NOW() WHERE id = ?`, [id]);
    }
    if (status === 'cancelled') {
      await db.query(`UPDATE orders SET paymentStatus = 'refunded' WHERE id = ? AND paymentMethod != 'cod'`, [id]);
    }
    
    return this.findById(id);
  }

  // Assign delivery partner
  static async assignDeliveryPartner(orderId, partnerId) {
    await db.query(`UPDATE orders SET deliveryPartnerId = ? WHERE id = ?`, [partnerId, orderId]);
    return this.findById(orderId);
  }

  // Update order
  static async update(id, updateData) {
    const allowedFields = ['paymentMethod', 'paymentId', 'paymentStatus', 'specialInstructions', 'estimatedDeliveryTime'];
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
    await db.query(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  // Get status history
  static async getStatusHistory(orderId) {
    const sql = `SELECT * FROM order_status_history WHERE orderId = ? ORDER BY createdAt ASC`;
    return await db.query(sql, [orderId]);
  }

  // Count orders
  static async count(filters = {}) {
    let sql = `SELECT COUNT(*) as count FROM orders WHERE 1=1`;
    const params = [];
    if (filters.status) { sql += ` AND status = ?`; params.push(filters.status); }
    if (filters.userId) { sql += ` AND userId = ?`; params.push(filters.userId); }
    const result = await db.query(sql, params);
    return result[0].count;
  }

  // Parse JSON fields
  static _parseOrder(row) {
    if (!row) return null;
    try {
      row.items = typeof row.items === 'string' ? JSON.parse(row.items) : (row.items || []);
      row.deliveryAddress = typeof row.deliveryAddress === 'string' ? JSON.parse(row.deliveryAddress) : (row.deliveryAddress || {});
    } catch (e) {}
    return row;
  }
}

module.exports = OrderModel;
