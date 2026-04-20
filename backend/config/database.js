/**
 * MySQL Database Configuration
 * Replaces MongoDB/Mongoose with MySQL
 */

const mysql = require('mysql2/promise');

// Parse DATABASE_URL if provided, otherwise use individual variables
function getDbConfig() {
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      return {
        host: url.hostname || 'localhost',
        user: decodeURIComponent(url.username) || 'root',
        password: decodeURIComponent(url.password) || '',
        database: url.pathname?.replace('/', '') || 'foodzap',
        port: parseInt(url.port) || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
      };
    } catch (error) {
      console.error('Invalid DATABASE_URL, falling back to individual variables');
    }
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'foodzap',
    port: parseInt(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  };
}

// Database configuration
const dbConfig = getDbConfig();

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Database helper class
class Database {
  constructor() {
    this.pool = pool;
  }

  // Get connection from pool
  async getConnection() {
    return await this.pool.getConnection();
  }

  // Execute query
  async query(sql, params) {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }

  // Execute transaction
  async transaction(queries) {
    const connection = await this.getConnection();
    try {
      await connection.beginTransaction();
      const results = [];
      for (const { sql, params } of queries) {
        const [result] = await connection.execute(sql, params);
        results.push(result);
      }
      await connection.commit();
      return results;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Test connection
  async testConnection() {
    try {
      const connection = await this.getConnection();
      await connection.ping();
      connection.release();
      console.log('✅ MySQL Connected Successfully');
      return true;
    } catch (error) {
      console.error('❌ MySQL Connection Error:', error.message);
      return false;
    }
  }
}

// Export singleton instance
const db = new Database();

module.exports = { db, pool, mysql };
