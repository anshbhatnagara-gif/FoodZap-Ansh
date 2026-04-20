/**
 * Wallet Model - MySQL Version
 * User wallet for in-app payments, cashback, and rewards
 */

const { db } = require('../config/database');

class WalletModel {
  // Get or create wallet for user
  static async getOrCreate(userId) {
    const sql = `SELECT * FROM wallets WHERE userId = ?`;
    const wallets = await db.query(sql, [userId]);
    
    if (wallets[0]) return wallets[0];
    
    // Create wallet
    await db.query(`INSERT INTO wallets (userId, balance) VALUES (?, 0)`, [userId]);
    const newWallets = await db.query(sql, [userId]);
    return newWallets[0];
  }

  // Get balance
  static async getBalance(userId) {
    const wallet = await this.getOrCreate(userId);
    return wallet.balance;
  }

  // Add money (credit)
  static async addMoney(userId, amount, description = 'Added money', referenceType = null, referenceId = null) {
    if (amount <= 0) throw new Error('Amount must be greater than 0');
    
    const wallet = await this.getOrCreate(userId);
    const balanceAfter = parseFloat(wallet.balance) + amount;
    
    // Update balance
    await db.query(`UPDATE wallets SET balance = ? WHERE userId = ?`, [balanceAfter, userId]);
    
    // Add transaction
    const sql = `INSERT INTO wallet_transactions (walletId, type, amount, balanceAfter, description, referenceType, referenceId) 
                 VALUES (?, 'credit', ?, ?, ?, ?, ?)`;
    await db.query(sql, [wallet.id, amount, balanceAfter, description, referenceType, referenceId]);
    
    return { balance: balanceAfter, amount, type: 'credit' };
  }

  // Deduct money (debit)
  static async deductMoney(userId, amount, description = 'Payment', referenceType = null, referenceId = null) {
    if (amount <= 0) throw new Error('Amount must be greater than 0');
    
    const wallet = await this.getOrCreate(userId);
    if (parseFloat(wallet.balance) < amount) throw new Error('Insufficient balance');
    
    const balanceAfter = parseFloat(wallet.balance) - amount;
    
    // Update balance
    await db.query(`UPDATE wallets SET balance = ? WHERE userId = ?`, [balanceAfter, userId]);
    
    // Add transaction
    const sql = `INSERT INTO wallet_transactions (walletId, type, amount, balanceAfter, description, referenceType, referenceId) 
                 VALUES (?, 'debit', ?, ?, ?, ?, ?)`;
    await db.query(sql, [wallet.id, amount, balanceAfter, description, referenceType, referenceId]);
    
    return { balance: balanceAfter, amount, type: 'debit' };
  }

  // Add cashback
  static async addCashback(userId, amount, description = 'Cashback', referenceType = null, referenceId = null) {
    if (amount <= 0) throw new Error('Cashback amount must be greater than 0');
    
    const wallet = await this.getOrCreate(userId);
    const balanceAfter = parseFloat(wallet.balance) + amount;
    
    await db.query(`UPDATE wallets SET balance = ? WHERE userId = ?`, [balanceAfter, userId]);
    
    const sql = `INSERT INTO wallet_transactions (walletId, type, amount, balanceAfter, description, referenceType, referenceId) 
                 VALUES (?, 'credit', ?, ?, ?, ?, ?)`;
    await db.query(sql, [wallet.id, amount, balanceAfter, `Cashback: ${description}`, referenceType, referenceId]);
    
    return { balance: balanceAfter, amount, type: 'cashback' };
  }

  // Refund
  static async refund(userId, amount, description = 'Refund', referenceType = null, referenceId = null) {
    if (amount <= 0) throw new Error('Refund amount must be greater than 0');
    
    const wallet = await this.getOrCreate(userId);
    const balanceAfter = parseFloat(wallet.balance) + amount;
    
    await db.query(`UPDATE wallets SET balance = ? WHERE userId = ?`, [balanceAfter, userId]);
    
    const sql = `INSERT INTO wallet_transactions (walletId, type, amount, balanceAfter, description, referenceType, referenceId) 
                 VALUES (?, 'credit', ?, ?, ?, ?, ?)`;
    await db.query(sql, [wallet.id, amount, balanceAfter, `Refund: ${description}`, referenceType, referenceId]);
    
    return { balance: balanceAfter, amount, type: 'refund' };
  }

  // Get transaction history
  static async getTransactions(userId, page = 1, limit = 20) {
    const wallet = await this.getOrCreate(userId);
    const offset = (page - 1) * limit;
    
    const sql = `SELECT * FROM wallet_transactions WHERE walletId = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    const transactions = await db.query(sql, [wallet.id, limit, offset]);
    
    const countSql = `SELECT COUNT(*) as count FROM wallet_transactions WHERE walletId = ?`;
    const countResult = await db.query(countSql, [wallet.id]);
    
    return {
      transactions,
      total: countResult[0].count,
      page,
      limit,
      totalPages: Math.ceil(countResult[0].count / limit)
    };
  }

  // Get wallet stats
  static async getStats(userId) {
    const wallet = await this.getOrCreate(userId);
    
    const creditSql = `SELECT COALESCE(SUM(amount), 0) as total FROM wallet_transactions WHERE walletId = ? AND type = 'credit'`;
    const debitSql = `SELECT COALESCE(SUM(amount), 0) as total FROM wallet_transactions WHERE walletId = ? AND type = 'debit'`;
    
    const credits = await db.query(creditSql, [wallet.id]);
    const debits = await db.query(debitSql, [wallet.id]);
    
    return {
      currentBalance: parseFloat(wallet.balance),
      totalCredited: parseFloat(credits[0].total),
      totalDebited: parseFloat(debits[0].total)
    };
  }
}

module.exports = WalletModel;
