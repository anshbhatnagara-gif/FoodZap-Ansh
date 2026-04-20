/**
 * FoodZap Database Seeder - Main Entry Point
 * Seeds 1000+ food items from all cuisines
 * 
 * Usage:
 *   node seed/index.js          - Seed all data
 *   node seed/menuData.js       - Seed main menu data only
 *   node seed/extendedMenu.js   - Seed extended menu data only
 */

const mongoose = require('mongoose');
const { seedMenuData } = require('./menuData');
const { seedExtendedMenuData } = require('./extendedMenu');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodzap';

async function seedAll() {
  try {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║        FoodZap Database Seeder - 1000+ Items           ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Seed main menu data (Indian cuisines, Fast Food, etc.)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('PHASE 1: Main Menu Data');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    await seedMenuData();
    
    // Seed extended menu data (International cuisines, Grocery)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('PHASE 2: Extended Menu Data');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    await seedExtendedMenuData();
    
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║              ✅ SEEDING COMPLETE!                      ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    console.log('📊 Summary:');
    console.log('   • 30+ Restaurants created');
    console.log('   • 1000+ Food items added');
    console.log('   • All Indian regions covered (North, South, East, West)');
    console.log('   • International cuisines (Japanese, Korean, Thai, Mexican, Italian)');
    console.log('   • Fast Food (Burgers, Pizza, Rolls, Momos, Noodles)');
    console.log('   • Grocery items (Rice, Dal, Spices, Oils)');
    console.log('   • Beverages (Chai, Coffee, Juices, Lassi)');
    console.log('   • Desserts (Indian Sweets, Ice Cream, Cakes)');
    
    console.log('\n🏪 Restaurant Categories:');
    console.log('   • North Indian (Punjabi, Mughlai, Rajasthani, Kashmiri)');
    console.log('   • South Indian (Tamil, Kerala, Andhra, Karnataka)');
    console.log('   • East Indian (Bengali, Odia, Assamese)');
    console.log('   • West Indian (Gujarati, Maharashtrian, Goan)');
    console.log('   • Fast Food Chains');
    console.log('   • International (Chinese, Japanese, Korean, Thai, Italian, Mexican)');
    console.log('   • Biryani & Kebab Houses');
    console.log('   • Chaat & Street Food');
    console.log('   • Beverage & Dessert Shops');
    console.log('   • Grocery (Instamart)');
    
    console.log('\n🍽️ Food Categories:');
    console.log('   • Starters & Appetizers (200+ items)');
    console.log('   • Main Course Curries (300+ items)');
    console.log('   • Breads & Rotis (50+ varieties)');
    console.log('   • Rice & Biryani (100+ varieties)');
    console.log('   • South Indian (100+ items)');
    console.log('   • Fast Food (200+ items)');
    console.log('   • Chinese (150+ items)');
    console.log('   • Japanese (100+ items)');
    console.log('   • Korean (50+ items)');
    console.log('   • Thai (50+ items)');
    console.log('   • Beverages (200+ items)');
    console.log('   • Desserts (300+ items)');
    console.log('   • Grocery (150+ items)');
    
    console.log('\n✨ Next Steps:');
    console.log('   1. Start the backend server: npm start');
    console.log('   2. Open frontend and browse restaurants');
    console.log('   3. Explore different cuisines and order!');
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Database connection closed.');
  }
}

// Run if called directly
if (require.main === module) {
  seedAll().then(() => process.exit(0));
}

module.exports = { seedAll };
