const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedRestaurants() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('🌱 Seeding restaurants and menu data...');

    // Clear existing data
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE orders');
    await connection.query('TRUNCATE TABLE menu_items');
    await connection.query('TRUNCATE TABLE menu_categories');
    await connection.query('TRUNCATE TABLE restaurants');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    // Insert Restaurants
    const restaurants = [
      {
        name: 'Pizza Hut',
        description: 'World famous pizzas with authentic Italian flavors',
        cuisine: JSON.stringify(['Italian', 'Pizza']),
        rating: 4.5,
        deliveryTimeMin: 30,
        deliveryTimeMax: 40,
        priceForTwo: 500,
        images: JSON.stringify(['https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400']),
        address: '123 Pizza Street, Connaught Place, New Delhi',
        latitude: 28.6315,
        longitude: 77.2167,
        isOpen: true,
        isActive: true
      },
      {
        name: 'Burger King',
        description: 'Flame-grilled burgers and crispy fries',
        cuisine: JSON.stringify(['American', 'Burger']),
        rating: 4.3,
        deliveryTimeMin: 25,
        deliveryTimeMax: 35,
        priceForTwo: 450,
        images: JSON.stringify(['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400']),
        address: '456 Burger Lane, Nehru Place, New Delhi',
        latitude: 28.5485,
        longitude: 77.2513,
        isOpen: true,
        isActive: true
      },
      {
        name: 'Biryani House',
        description: 'Authentic Hyderabadi biryani with rich flavors',
        cuisine: JSON.stringify(['Indian', 'Biryani']),
        rating: 4.7,
        deliveryTimeMin: 35,
        deliveryTimeMax: 45,
        priceForTwo: 600,
        images: JSON.stringify(['https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400']),
        address: '789 Spice Road, Jama Masjid, New Delhi',
        latitude: 28.6426,
        longitude: 77.2332,
        isOpen: true,
        isActive: true
      },
      {
        name: 'Chinese Wok',
        description: 'Authentic Chinese cuisine with bold flavors',
        cuisine: JSON.stringify(['Chinese', 'Asian']),
        rating: 4.2,
        deliveryTimeMin: 30,
        deliveryTimeMax: 40,
        priceForTwo: 500,
        images: JSON.stringify(['https://images.unsplash.com/photo-1552611052-33e04de081de?w=400']),
        address: '321 Dragon Street, Rajouri Garden, New Delhi',
        latitude: 28.6454,
        longitude: 77.1133,
        isOpen: true,
        isActive: true
      },
      {
        name: 'Domino\'s Pizza',
        description: 'Fresh hot pizza delivered in 30 minutes',
        cuisine: JSON.stringify(['Italian', 'Pizza']),
        rating: 4.4,
        deliveryTimeMin: 30,
        deliveryTimeMax: 40,
        priceForTwo: 550,
        images: JSON.stringify(['https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400']),
        address: '654 Domino Avenue, Saket, New Delhi',
        latitude: 28.5255,
        longitude: 77.2064,
        isOpen: true,
        isActive: true
      },
      {
        name: 'KFC',
        description: 'Finger lickin\' good chicken',
        cuisine: JSON.stringify(['American', 'Chicken']),
        rating: 4.3,
        deliveryTimeMin: 25,
        deliveryTimeMax: 35,
        priceForTwo: 500,
        images: JSON.stringify(['https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400']),
        address: '987 Chicken Street, Karol Bagh, New Delhi',
        latitude: 28.6514,
        longitude: 77.1909,
        isOpen: true,
        isActive: true
      },
      {
        name: 'Haldiram\'s',
        description: 'Authentic Indian sweets and snacks',
        cuisine: JSON.stringify(['Indian', 'Sweets']),
        rating: 4.6,
        deliveryTimeMin: 30,
        deliveryTimeMax: 40,
        priceForTwo: 400,
        images: JSON.stringify(['https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400']),
        address: '147 Sweet Lane, Chandni Chowk, New Delhi',
        latitude: 28.6562,
        longitude: 77.2310,
        isOpen: true,
        isActive: true
      },
      {
        name: 'Subway',
        description: 'Fresh sandwiches and salads',
        cuisine: JSON.stringify(['American', 'Sandwich']),
        rating: 4.1,
        deliveryTimeMin: 20,
        deliveryTimeMax: 30,
        priceForTwo: 350,
        images: JSON.stringify(['https://images.unsplash.com/photo-1558998519-3ea4c876c696?w=400']),
        address: '258 Sandwich Street, Vasant Kunj, New Delhi',
        latitude: 28.5314,
        longitude: 77.1660,
        isOpen: true,
        isActive: true
      }
    ];

    for (const restaurant of restaurants) {
      const [result] = await connection.query(
        'INSERT INTO restaurants (name, description, cuisine, rating, deliveryTimeMin, deliveryTimeMax, priceForTwo, images, address, latitude, longitude, isOpen, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [restaurant.name, restaurant.description, restaurant.cuisine, restaurant.rating, restaurant.deliveryTimeMin, restaurant.deliveryTimeMax, restaurant.priceForTwo, restaurant.images, restaurant.address, restaurant.latitude, restaurant.longitude, restaurant.isOpen, restaurant.isActive]
      );
      restaurant.id = result.insertId;
      console.log(`✅ Added restaurant: ${restaurant.name}`);
    }

    // Insert Menu Categories and Items for each restaurant
    const menuData = [
      // Pizza Hut
      {
        restaurantId: restaurants[0].id,
        categories: [
          {
            name: 'Pizzas',
            items: [
              { name: 'Margherita Pizza', description: 'Classic cheese and tomato', price: 299, image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200', is_veg: true, is_available: true },
              { name: 'Pepperoni Pizza', description: 'Spicy pepperoni with cheese', price: 399, image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200', is_veg: false, is_available: true },
              { name: 'Veggie Supreme', description: 'Loaded with vegetables', price: 349, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200', is_veg: true, is_available: true },
              { name: 'Chicken Tikka Pizza', description: 'Indian spiced chicken', price: 449, image_url: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=200', is_veg: false, is_available: true }
            ]
          },
          {
            name: 'Sides',
            items: [
              { name: 'Garlic Bread', description: 'Crispy garlic bread', price: 149, image_url: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=200', is_veg: true, is_available: true },
              { name: 'Cheese Sticks', description: 'Mozzarella sticks', price: 199, image_url: 'https://images.unsplash.com/photo-1573247128204-8f6ea8f5c8f9?w=200', is_veg: true, is_available: true }
            ]
          }
        ]
      },
      // Burger King
      {
        restaurantId: restaurants[1].id,
        categories: [
          {
            name: 'Burgers',
            items: [
              { name: 'Whopper', description: 'Flame-grilled beef patty', price: 249, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200', is_veg: false, is_available: true },
              { name: 'Veggie Burger', description: 'Plant-based patty', price: 199, image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=200', is_veg: true, is_available: true },
              { name: 'Chicken Royale', description: 'Crispy chicken patty', price: 229, image_url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=200', is_veg: false, is_available: true }
            ]
          },
          {
            name: 'Sides',
            items: [
              { name: 'French Fries', description: 'Golden crispy fries', price: 99, image_url: 'https://images.unsplash.com/photo-1573080496987-a199f8cd75c9?w=200', is_veg: true, is_available: true },
              { name: 'Onion Rings', description: 'Crispy onion rings', price: 129, image_url: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=200', is_veg: true, is_available: true }
            ]
          }
        ]
      },
      // Biryani House
      {
        restaurantId: restaurants[2].id,
        categories: [
          {
            name: 'Biryani',
            items: [
              { name: 'Hyderabadi Chicken Biryani', description: 'Authentic dum biryani', price: 349, image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200', is_veg: false, is_available: true },
              { name: 'Mutton Biryani', description: 'Tender mutton with rice', price: 449, image_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200', is_veg: false, is_available: true },
              { name: 'Veg Biryani', description: 'Mixed vegetables with rice', price: 249, image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=200', is_veg: true, is_available: true }
            ]
          },
          {
            name: 'Starters',
            items: [
              { name: 'Chicken 65', description: 'Spicy chicken fry', price: 199, image_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=200', is_veg: false, is_available: true },
              { name: 'Paneer Tikka', description: 'Grilled cottage cheese', price: 179, image_url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=200', is_veg: true, is_available: true }
            ]
          }
        ]
      },
      // Chinese Wok
      {
        restaurantId: restaurants[3].id,
        categories: [
          {
            name: 'Main Course',
            items: [
              { name: 'Veg Fried Rice', description: 'Stir-fried rice with vegetables', price: 199, image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200', is_veg: true, is_available: true },
              { name: 'Chicken Manchurian', description: 'Indo-Chinese chicken balls', price: 249, image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200', is_veg: false, is_available: true },
              { name: 'Hakka Noodles', description: 'Stir-fried noodles', price: 179, image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200', is_veg: true, is_available: true }
            ]
          },
          {
            name: 'Appetizers',
            items: [
              { name: 'Spring Rolls', description: 'Crispy vegetable rolls', price: 149, image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200', is_veg: true, is_available: true },
              { name: 'Dim Sums', description: 'Steamed dumplings', price: 199, image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=200', is_veg: true, is_available: true }
            ]
          }
        ]
      },
      // Domino's
      {
        restaurantId: restaurants[4].id,
        categories: [
          {
            name: 'Pizzas',
            items: [
              { name: 'Farmhouse Pizza', description: 'Loaded with veggies', price: 349, image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200', is_veg: true, is_available: true },
              { name: 'Peppy Paneer', description: 'Spicy paneer pizza', price: 399, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200', is_veg: true, is_available: true },
              { name: 'Chicken Dominator', description: 'Triple chicken feast', price: 499, image_url: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=200', is_veg: false, is_available: true }
            ]
          },
          {
            name: 'Sides',
            items: [
              { name: 'Breadsticks', description: 'Garlic breadsticks', price: 129, image_url: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=200', is_veg: true, is_available: true },
              { name: 'Potato Wedges', description: 'Crispy potato wedges', price: 149, image_url: 'https://images.unsplash.com/photo-1573080496987-a199f8cd75c9?w=200', is_veg: true, is_available: true }
            ]
          }
        ]
      },
      // KFC
      {
        restaurantId: restaurants[5].id,
        categories: [
          {
            name: 'Chicken',
            items: [
              { name: 'Bucket Chicken', description: '6 pieces crispy chicken', price: 499, image_url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200', is_veg: false, is_available: true },
              { name: 'Zinger Burger', description: 'Crispy chicken burger', price: 179, image_url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=200', is_veg: false, is_available: true },
              { name: 'Popcorn Chicken', description: 'Bite-sized chicken pieces', price: 149, image_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=200', is_veg: false, is_available: true }
            ]
          },
          {
            name: 'Sides',
            items: [
              { name: 'Fries', description: 'Classic french fries', price: 89, image_url: 'https://images.unsplash.com/photo-1573080496987-a199f8cd75c9?w=200', is_veg: true, is_available: true },
              { name: 'Coleslaw', description: 'Fresh cabbage salad', price: 69, image_url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=200', is_veg: true, is_available: true }
            ]
          }
        ]
      },
      // Haldiram's
      {
        restaurantId: restaurants[6].id,
        categories: [
          {
            name: 'Sweets',
            items: [
              { name: 'Rasgulla', description: 'Soft syrupy balls', price: 199, image_url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=200', is_veg: true, is_available: true },
              { name: 'Gulab Jamun', description: 'Sweet milk balls', price: 179, image_url: 'https://images.unsplash.com/photo-1666196047570-8a4f0df7e72f?w=200', is_veg: true, is_available: true },
              { name: 'Kaju Katli', description: 'Cashew fudge', price: 299, image_url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=200', is_veg: true, is_available: true }
            ]
          },
          {
            name: 'Snacks',
            items: [
              { name: 'Samosa', description: 'Crispy potato pastry', price: 49, image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200', is_veg: true, is_available: true },
              { name: 'Kachori', description: 'Spicy lentil pastry', price: 59, image_url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=200', is_veg: true, is_available: true }
            ]
          }
        ]
      },
      // Subway
      {
        restaurantId: restaurants[7].id,
        categories: [
          {
            name: 'Subs',
            items: [
              { name: 'Veggie Delight', description: 'Fresh vegetable sub', price: 199, image_url: 'https://images.unsplash.com/photo-1558998519-3ea4c876c696?w=200', is_veg: true, is_available: true },
              { name: 'Chicken Teriyaki', description: 'Sweet chicken sub', price: 249, image_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=200', is_veg: false, is_available: true },
              { name: 'Italian BMT', description: 'Pepperoni, ham, salami', price: 279, image_url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=200', is_veg: false, is_available: true }
            ]
          },
          {
            name: 'Salads',
            items: [
              { name: 'Caesar Salad', description: 'Fresh lettuce with dressing', price: 179, image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200', is_veg: true, is_available: true },
              { name: 'Greek Salad', description: 'Feta cheese and olives', price: 199, image_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200', is_veg: true, is_available: true }
            ]
          }
        ]
      }
    ];

    for (const menu of menuData) {
      for (const category of menu.categories) {
        const [catResult] = await connection.query(
          'INSERT INTO menu_categories (restaurantId, name, sortOrder) VALUES (?, ?, ?)',
          [menu.restaurantId, category.name, 0]
        );
        
        for (const item of category.items) {
          await connection.query(
            'INSERT INTO menu_items (restaurantId, categoryId, name, description, price, image, isVeg, isAvailable, isBestseller, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [menu.restaurantId, catResult.insertId, item.name, item.description, item.price, item.image_url, item.is_veg, item.is_available, false, 4.0]
          );
        }
        console.log(`  ✅ Added category: ${category.name} with ${category.items.length} items`);
      }
    }

    console.log('✅ Seed data added successfully!');
    console.log(`📊 Stats: ${restaurants.length} restaurants, ${menuData.length} menus with categories and items`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await connection.end();
  }
}

seedRestaurants();

