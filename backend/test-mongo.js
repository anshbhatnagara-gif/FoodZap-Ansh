/**
 * Quick MongoDB Connection Test
 */
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodzap';

console.log('Testing MongoDB connection...');
console.log('URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB CONNECTED SUCCESSFULLY!');
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('Host:', mongoose.connection.host);
    console.log('Port:', mongoose.connection.port);
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ MongoDB CONNECTION FAILED!');
    console.log('Error:', err.message);
    console.log('\n📋 To fix this:');
    console.log('   Option 1: Install MongoDB locally');
    console.log('      Download: https://www.mongodb.com/try/download/community');
    console.log('      mkdir C:\data\db');
    console.log('      mongod');
    console.log('\n   Option 2: Use MongoDB Atlas (Cloud - Free)');
    console.log('      Sign up: https://www.mongodb.com/atlas');
    console.log('      Get connection string and update .env file');
    process.exit(1);
  });
