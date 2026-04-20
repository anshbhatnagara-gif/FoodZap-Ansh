/**
 * Database Initialization Script
 * Creates all tables from schema.sql
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function initDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    const config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT) || 3306,
      multipleStatements: true  // Allow multiple statements
    };
    
    // Create connection without database
    const connection = await mysql.createConnection(config);
    
    // Create database
    try {
      await connection.query('CREATE DATABASE IF NOT EXISTS foodzap CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
      console.log('✅ Database created');
    } catch (e) {
      console.log('⚠️ Database may already exist');
    }
    
    await connection.query('USE foodzap');
    console.log('✅ Using foodzap database');
    
    // Disable foreign key checks to allow creating tables in any order
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Extract CREATE TABLE statements using regex
    const tableMatches = schema.match(/CREATE TABLE[\s\S]*?ENGINE=InnoDB;/gi) || [];
    
    console.log(`📋 Found ${tableMatches.length} tables to create`);
    
    // Execute each statement
    let success = 0;
    let failed = [];
    
    for (let i = 0; i < tableMatches.length; i++) {
      const statement = tableMatches[i];
      try {
        await connection.query(statement);
        success++;
        process.stdout.write(`\r✅ Progress: ${i + 1}/${tableMatches.length} tables`);
      } catch (error) {
        // Extract table name from error or statement
        const tableMatch = statement.match(/CREATE TABLE IF NOT EXISTS (\w+)/i);
        const tableName = tableMatch ? tableMatch[1] : 'unknown';
        
        if (error.code === 'ER_TABLE_EXISTS_ERROR') {
          // Already exists, count as success
          success++;
        } else {
          failed.push({ table: tableName, error: error.message.substring(0, 80) });
        }
      }
    }
    
    // Re-enable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    
    await connection.end();
    console.log(`\n\n✅ Database ready! ${success}/${tableMatches.length} tables created successfully`);
    
    if (failed.length > 0) {
      console.log(`\n⚠️ Failed tables:`);
      failed.forEach(f => console.log(`   - ${f.table}: ${f.error}`));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
}

initDatabase();
