/**
 * Cart Model - MySQL Version
 * Stores user's shopping cart items
 */

const { db } = require('../config/database');

class CartModel {
  // Get or create cart for user
  static async getOrCreate(userId, restaurantId = null) {
    let sql = `SELECT * FROM carts WHERE userId = ?`;
    const carts = await db.query(sql, [userId]);
    
    if (carts[0]) {
      const cart = this._parseCart(carts[0]);
      // Update restaurant if different
      if (restaurantId && cart.restaurantId !== restaurantId) {
        await db.query(`UPDATE carts SET restaurantId = ?, items = '[]', totalAmount = 0 WHERE userId = ?`, [restaurantId, userId]);
        cart.restaurantId = restaurantId;
        cart.items = [];
        cart.totalAmount = 0;
      }
      return cart;
    }
    
    // Create new cart
    const insertSql = `INSERT INTO carts (userId, restaurantId, items, totalAmount) VALUES (?, ?, '[]', 0)`;
    await db.query(insertSql, [userId, restaurantId]);
    return this.getOrCreate(userId, restaurantId);
  }

  // Add item to cart
  static async addItem(userId, item) {
    const cart = await this.getOrCreate(userId, item.restaurantId);
    const items = cart.items || [];
    
    // Check if item already exists
    const existingIndex = items.findIndex(i => 
      i.menuItemId === item.menuItemId && 
      JSON.stringify(i.variant) === JSON.stringify(item.variant)
    );
    
    if (existingIndex >= 0) {
      items[existingIndex].quantity += (item.quantity || 1);
    } else {
      items.push({
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        variant: item.variant || null,
        addons: item.addons || [],
        specialInstructions: item.specialInstructions || null
      });
    }
    
    const totalAmount = this._calculateTotal(items);
    await db.query(`UPDATE carts SET items = ?, totalAmount = ? WHERE userId = ?`, 
      [JSON.stringify(items), totalAmount, userId]);
    
    return this.getOrCreate(userId);
  }

  // Update item quantity
  static async updateItemQuantity(userId, menuItemId, quantity) {
    const cart = await this.getOrCreate(userId);
    const items = cart.items || [];
    
    const index = items.findIndex(i => i.menuItemId === menuItemId);
    if (index === -1) return null;
    
    if (quantity <= 0) {
      items.splice(index, 1);
    } else {
      items[index].quantity = quantity;
    }
    
    const totalAmount = this._calculateTotal(items);
    await db.query(`UPDATE carts SET items = ?, totalAmount = ? WHERE userId = ?`, 
      [JSON.stringify(items), totalAmount, userId]);
    
    return this.getOrCreate(userId);
  }

  // Remove item from cart
  static async removeItem(userId, menuItemId) {
    return this.updateItemQuantity(userId, menuItemId, 0);
  }

  // Clear cart
  static async clear(userId) {
    await db.query(`UPDATE carts SET items = '[]', totalAmount = 0 WHERE userId = ?`, [userId]);
    return this.getOrCreate(userId);
  }

  // Delete cart
  static async delete(userId) {
    await db.query(`DELETE FROM carts WHERE userId = ?`, [userId]);
    return { deleted: true };
  }

  // Calculate totals
  static _calculateTotal(items) {
    let total = 0;
    for (const item of items) {
      let itemPrice = item.price || 0;
      if (item.variant && item.variant.price) itemPrice = item.variant.price;
      const addonsTotal = (item.addons || []).reduce((sum, a) => sum + (a.price || 0), 0);
      total += (itemPrice + addonsTotal) * (item.quantity || 1);
    }
    return total;
  }

  // Get cart summary with fees
  static async getCartSummary(userId) {
    const cart = await this.getOrCreate(userId);
    const itemsTotal = cart.totalAmount || 0;
    const deliveryFee = itemsTotal > 500 ? 0 : 40;
    const platformFee = 5;
    const gst = Math.round(itemsTotal * 0.05);
    
    return {
      ...cart,
      itemsTotal,
      deliveryFee,
      platformFee,
      gst,
      totalAmount: itemsTotal + deliveryFee + platformFee + gst,
      itemCount: (cart.items || []).reduce((sum, i) => sum + (i.quantity || 1), 0)
    };
  }

  // Parse JSON fields
  static _parseCart(row) {
    if (!row) return null;
    try {
      row.items = typeof row.items === 'string' ? JSON.parse(row.items) : (row.items || []);
    } catch (e) { row.items = []; }
    return row;
  }
}

module.exports = CartModel;
