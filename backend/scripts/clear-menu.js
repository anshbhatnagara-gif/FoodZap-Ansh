/**
 * Clear Menu Data Script
 * Removes all menu items and categories from database
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function clearMenuData() {
  try {
    console.log('🗑️ Clearing menu data...');
    
    const config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT) || 3306,
      database: 'foodzap'
    };
    
    const connection = await mysql.createConnection(config);
    
    // Disable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Clear menu items first (child table)
    const [itemsResult] = await connection.query('DELETE FROM menu_items');
    console.log(`✅ Cleared ${itemsResult.affectedRows} menu items`);
    
    // Clear menu categories (parent table)
    const [catsResult] = await connection.query('DELETE FROM menu_categories');
    console.log(`✅ Cleared ${catsResult.affectedRows} menu categories`);
    
    // Re-enable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    
    await connection.end();
    console.log('\n✅ All menu data cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing menu data:', error.message);
    process.exit(1);
  }
}

clearMenuData();
