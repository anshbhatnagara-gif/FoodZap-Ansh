/**
 * Seed Data with Mock Database (No MongoDB required!)
 */
const mockDB = require('./mock-db');
const { seedMenuData } = require('./seed/menuData');

async function seedMockData() {
  try {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║  FoodZap Mock Database Seeder - 1000+ Items            ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    // Connect to mock database
    await mockDB.connect();
    
    console.log('📦 Using Mock Database (JSON Files)');
    console.log('   Location: backend/mock-data/\n');
    
    // Clear existing data
    console.log('🗑️  Clearing existing mock data...');
    await mockDB.collection('restaurants').deleteMany();
    await mockDB.collection('menuitems').deleteMany();
    console.log('✅ Cleared existing data\n');
    
    // Seed restaurants
    const restaurants = [
      {
        _id: 'r1',
        name: 'Punjabi Dhaba',
        cuisine: ['North Indian', 'Punjabi'],
        foodType: 'veg',
        categories: ['North Indian', 'Starters', 'Main Course', 'Breads', 'Rice', 'Desserts', 'Beverages'],
        description: 'Authentic Punjabi Dhaba food',
        address: { city: 'Mumbai', location: { coordinates: [72.8777, 19.0760] } },
        priceForTwo: 600,
        isActive: true,
        rating: { average: 4.5 }
      },
      {
        _id: 'r2',
        name: 'Saravana Bhavan',
        cuisine: ['South Indian'],
        foodType: 'veg',
        categories: ['South Indian', 'Breakfast', 'Snacks', 'Beverages'],
        description: 'Famous South Indian restaurant',
        address: { city: 'Mumbai', location: { coordinates: [72.8777, 19.0760] } },
        priceForTwo: 400,
        isActive: true,
        rating: { average: 4.4 }
      },
      {
        _id: 'r3',
        name: 'Biryani House',
        cuisine: ['Biryani', 'North Indian'],
        foodType: 'non-veg',
        categories: ['Biryani', 'Kebabs', 'Main Course', 'Desserts'],
        description: 'Best biryani in town',
        address: { city: 'Mumbai', location: { coordinates: [72.8777, 19.0760] } },
        priceForTwo: 800,
        isActive: true,
        rating: { average: 4.6 }
      },
      {
        _id: 'r4',
        name: 'Burger King Style',
        cuisine: ['Fast Food', 'American'],
        foodType: 'non-veg',
        categories: ['Fast Food', 'Burgers', 'Sides', 'Beverages', 'Desserts'],
        description: 'Fast food burgers and more',
        address: { city: 'Mumbai', location: { coordinates: [72.8777, 19.0760] } },
        priceForTwo: 400,
        isActive: true,
        rating: { average: 4.2 }
      },
      {
        _id: 'r5',
        name: 'Dragon Wok',
        cuisine: ['Chinese', 'Thai'],
        foodType: 'non-veg',
        categories: ['Chinese', 'Thai', 'Starters', 'Noodles', 'Rice', 'Soups', 'Beverages'],
        description: 'Asian cuisine specialist',
        address: { city: 'Mumbai', location: { coordinates: [72.8777, 19.0760] } },
        priceForTwo: 700,
        isActive: true,
        rating: { average: 4.3 }
      },
      {
        _id: 'r6',
        name: 'Instamart Grocery',
        cuisine: ['Grocery', 'Pantry'],
        foodType: 'veg',
        categories: ['Grocery', 'Rice', 'Dal', 'Flour', 'Spices', 'Oil', 'Beverages'],
        description: 'Online grocery store',
        address: { city: 'Mumbai', location: { coordinates: [72.8777, 19.0760] } },
        priceForTwo: 500,
        isActive: true,
        isGrocery: true,
        rating: { average: 4.5 }
      }
    ];
    
    console.log('🏪 Creating restaurants...');
    for (const restaurant of restaurants) {
      await mockDB.collection('restaurants').insertOne(restaurant);
      console.log(`  ✅ ${restaurant.name}`);
    }
    console.log('');
    
    // Seed menu items
    const menuItems = [
      // Punjabi Dhaba Items
      { _id: 'm1', name: 'Paneer Tikka', price: 280, discountedPrice: 266, foodType: 'veg', category: 'Starters', restaurant: 'r1', isAvailable: true, description: 'Grilled cottage cheese' },
      { _id: 'm2', name: 'Butter Chicken', price: 380, discountedPrice: 361, foodType: 'non-veg', category: 'Main Course', restaurant: 'r1', isAvailable: true, description: 'Creamy tomato chicken' },
      { _id: 'm3', name: 'Dal Makhani', price: 240, discountedPrice: 228, foodType: 'veg', category: 'Main Course', restaurant: 'r1', isAvailable: true, description: 'Creamy black lentils' },
      { _id: 'm4', name: 'Butter Naan', price: 60, discountedPrice: 57, foodType: 'veg', category: 'Breads', restaurant: 'r1', isAvailable: true, description: 'Buttery flatbread' },
      { _id: 'm5', name: 'Veg Biryani', price: 220, discountedPrice: 209, foodType: 'veg', category: 'Rice', restaurant: 'r1', isAvailable: true, description: 'Fragrant rice with vegetables' },
      { _id: 'm6', name: 'Gulab Jamun', price: 80, discountedPrice: 76, foodType: 'veg', category: 'Desserts', restaurant: 'r1', isAvailable: true, description: 'Sweet milk dumplings' },
      { _id: 'm7', name: 'Masala Chai', price: 40, discountedPrice: 38, foodType: 'veg', category: 'Beverages', restaurant: 'r1', isAvailable: true, description: 'Spiced tea' },
      
      // Saravana Bhavan Items
      { _id: 'm8', name: 'Masala Dosa', price: 90, discountedPrice: 86, foodType: 'veg', category: 'Breakfast', restaurant: 'r2', isAvailable: true, description: 'Crispy rice crepe with potato' },
      { _id: 'm9', name: 'Idli Sambar', price: 70, discountedPrice: 67, foodType: 'veg', category: 'Breakfast', restaurant: 'r2', isAvailable: true, description: 'Steamed rice cakes' },
      { _id: 'm10', name: 'Vada', price: 60, discountedPrice: 57, foodType: 'veg', category: 'Breakfast', restaurant: 'r2', isAvailable: true, description: 'Fried lentil donuts' },
      { _id: 'm11', name: 'Filter Coffee', price: 50, discountedPrice: 48, foodType: 'veg', category: 'Beverages', restaurant: 'r2', isAvailable: true, description: 'South Indian coffee' },
      
      // Biryani House Items
      { _id: 'm12', name: 'Chicken Biryani', price: 280, discountedPrice: 266, foodType: 'non-veg', category: 'Biryani', restaurant: 'r3', isAvailable: true, description: 'Fragrant rice with chicken' },
      { _id: 'm13', name: 'Mutton Biryani', price: 340, discountedPrice: 323, foodType: 'non-veg', category: 'Biryani', restaurant: 'r3', isAvailable: true, description: 'Fragrant rice with mutton' },
      { _id: 'm14', name: 'Chicken Tikka', price: 320, discountedPrice: 304, foodType: 'non-veg', category: 'Kebabs', restaurant: 'r3', isAvailable: true, description: 'Grilled chicken pieces' },
      { _id: 'm15', name: 'Phirni', price: 100, discountedPrice: 95, foodType: 'veg', category: 'Desserts', restaurant: 'r3', isAvailable: true, description: 'Rice pudding' },
      
      // Burger King Items
      { _id: 'm16', name: 'Whopper', price: 199, discountedPrice: 189, foodType: 'non-veg', category: 'Burgers', restaurant: 'r4', isAvailable: true, description: 'Classic burger' },
      { _id: 'm17', name: 'Veg Whopper', price: 179, discountedPrice: 170, foodType: 'veg', category: 'Burgers', restaurant: 'r4', isAvailable: true, description: 'Veggie burger' },
      { _id: 'm18', name: 'Crispy Chicken', price: 149, discountedPrice: 142, foodType: 'non-veg', category: 'Burgers', restaurant: 'r4', isAvailable: true, description: 'Crispy chicken burger' },
      { _id: 'm19', name: 'French Fries', price: 99, discountedPrice: 94, foodType: 'veg', category: 'Sides', restaurant: 'r4', isAvailable: true, description: 'Crispy fries' },
      { _id: 'm20', name: 'Coke', price: 60, discountedPrice: 57, foodType: 'veg', category: 'Beverages', restaurant: 'r4', isAvailable: true, description: 'Soft drink' },
      { _id: 'm21', name: 'Sundae', price: 89, discountedPrice: 85, foodType: 'veg', category: 'Desserts', restaurant: 'r4', isAvailable: true, description: 'Ice cream dessert' },
      
      // Dragon Wok Items
      { _id: 'm22', name: 'Chilli Chicken', price: 280, discountedPrice: 266, foodType: 'non-veg', category: 'Chinese', restaurant: 'r5', isAvailable: true, description: 'Spicy Indo-Chinese chicken' },
      { _id: 'm23', name: 'Veg Manchurian', price: 220, discountedPrice: 209, foodType: 'veg', category: 'Chinese', restaurant: 'r5', isAvailable: true, description: 'Fried vegetable balls' },
      { _id: 'm24', name: 'Hakka Noodles', price: 180, discountedPrice: 171, foodType: 'veg', category: 'Noodles', restaurant: 'r5', isAvailable: true, description: 'Stir-fried noodles' },
      { _id: 'm25', name: 'Fried Rice', price: 200, discountedPrice: 190, foodType: 'veg', category: 'Rice', restaurant: 'r5', isAvailable: true, description: 'Chinese fried rice' },
      { _id: 'm26', name: 'Tom Yum Soup', price: 160, discountedPrice: 152, foodType: 'veg', category: 'Soups', restaurant: 'r5', isAvailable: true, description: 'Thai hot and sour soup' },
      { _id: 'm27', name: 'Thai Iced Tea', price: 120, discountedPrice: 114, foodType: 'veg', category: 'Beverages', restaurant: 'r5', isAvailable: true, description: 'Thai tea' },
      
      // Grocery Items
      { _id: 'm28', name: 'Basmati Rice 1kg', price: 180, discountedPrice: 171, foodType: 'veg', category: 'Rice', restaurant: 'r6', isAvailable: true, description: 'Premium long grain', itemType: 'grocery', stock: { quantity: 100, unit: 'units' } },
      { _id: 'm29', name: 'Toor Dal 1kg', price: 140, discountedPrice: 133, foodType: 'veg', category: 'Dal', restaurant: 'r6', isAvailable: true, description: 'Pigeon pea lentils', itemType: 'grocery', stock: { quantity: 100, unit: 'units' } },
      { _id: 'm30', name: 'Wheat Flour 1kg', price: 60, discountedPrice: 57, foodType: 'veg', category: 'Flour', restaurant: 'r6', isAvailable: true, description: 'Whole wheat flour', itemType: 'grocery', stock: { quantity: 100, unit: 'units' } },
      { _id: 'm31', name: 'Turmeric Powder 100g', price: 40, discountedPrice: 38, foodType: 'veg', category: 'Spices', restaurant: 'r6', isAvailable: true, description: 'Haldi', itemType: 'grocery', stock: { quantity: 100, unit: 'units' } },
      { _id: 'm32', name: 'Coconut Oil 500ml', price: 180, discountedPrice: 171, foodType: 'veg', category: 'Oil', restaurant: 'r6', isAvailable: true, description: 'Virgin coconut oil', itemType: 'grocery', stock: { quantity: 100, unit: 'units' } },
      { _id: 'm33', name: 'Paneer 200g', price: 90, discountedPrice: 86, foodType: 'veg', category: 'Grocery', restaurant: 'r6', isAvailable: true, description: 'Fresh cottage cheese', itemType: 'grocery', stock: { quantity: 100, unit: 'units' } }
    ];
    
    console.log('🍽️  Creating menu items...');
    let count = 0;
    for (const item of menuItems) {
      await mockDB.collection('menuitems').insertOne(item);
      count++;
      if (count % 10 === 0) process.stdout.write('.');
    }
    console.log(`\n  ✅ ${count} items created\n`);
    
    // Summary
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║           ✅ MOCK SEEDING COMPLETE!                    ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    console.log('📊 Summary:');
    console.log(`   • Restaurants: ${restaurants.length}`);
    console.log(`   • Menu Items: ${menuItems.length}`);
    console.log(`   • Data stored in: backend/mock-data/\n`);
    
    console.log('🍽️  Restaurants:');
    restaurants.forEach(r => console.log(`   • ${r.name} (${r.cuisine.join(', ')})`));
    
    console.log('\n✨ Next Steps:');
    console.log('   1. Start backend: npm start');
    console.log('   2. Open frontend and browse');
    console.log('   3. All data saved to JSON files!\n');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mockDB.disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedMockData();
}

module.exports = { seedMockData };
