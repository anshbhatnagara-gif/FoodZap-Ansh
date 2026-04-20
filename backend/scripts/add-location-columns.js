const mysql = require('mysql2/promise');
require('dotenv').config();

async function addLocationColumns() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('🔄 Adding latitude/longitude columns to restaurants table...');

    // Check if columns already exist
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'restaurants' AND COLUMN_NAME IN ('latitude', 'longitude')
    `, [process.env.DB_NAME]);

    if (columns.length >= 2) {
      console.log('✅ Columns already exist');
      return;
    }

    // Add latitude column
    await connection.query(`
      ALTER TABLE restaurants 
      ADD COLUMN latitude DECIMAL(10, 8) AFTER deliveryTimeMax
    `);
    console.log('✅ Added latitude column');

    // Add longitude column
    await connection.query(`
      ALTER TABLE restaurants 
      ADD COLUMN longitude DECIMAL(11, 8) AFTER latitude
    `);
    console.log('✅ Added longitude column');

    console.log('✅ Location columns added successfully!');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('✅ Columns already exist');
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    await connection.end();
  }
}

addLocationColumns();
