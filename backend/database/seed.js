/**
 * FoodZap Database Seed Script
 * Run: node database/seed.js
 * This will reset and seed the entire database
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const DB_URL = process.env.DATABASE_URL || 'mysql://root:ansh@2007@localhost:3306/foodzap';

async function seed() {
  let connection;
  try {
    // Parse connection
    const url = new URL(DB_URL);
    const config = {
      host: url.hostname,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace('/', ''),
      port: parseInt(url.port) || 3306,
      multipleStatements: true
    };

    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL');

    // STEP 1: Drop all tables
    console.log('\n🗑️  Dropping all tables...');
    await connection.execute(`SET FOREIGN_KEY_CHECKS = 0`);
    const tables = [
      'loyalty_transactions', 'loyalty_points', 'delivery_locations',
      'notifications', 'subscriptions', 'user_coupons', 'coupons',
      'wallet_transactions', 'wallets', 'reviews', 'order_status_history',
      'orders', 'carts', 'menu_items', 'menu_categories', 'restaurants',
      'addresses', 'users'
    ];
    for (const t of tables) {
      await connection.execute(`DROP TABLE IF EXISTS ${t}`);
      process.stdout.write('.');
    }
    await connection.execute(`SET FOREIGN_KEY_CHECKS = 1`);
    console.log(' Done!');

    // STEP 2: Create tables
    console.log('\n📦 Creating tables...');

    await connection.execute(`CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      phone VARCHAR(20),
      password VARCHAR(255) NOT NULL,
      avatar VARCHAR(255),
      role ENUM('customer','admin','restaurant_owner','delivery_partner') DEFAULT 'customer',
      isActive BOOLEAN DEFAULT TRUE,
      isVerified BOOLEAN DEFAULT FALSE,
      googleId VARCHAR(255),
      lastLogin TIMESTAMP NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email), INDEX idx_phone (phone), INDEX idx_googleId (googleId), INDEX idx_role (role)
    ) ENGINE=InnoDB`);

    await connection.execute(`CREATE TABLE addresses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL, label VARCHAR(50), street VARCHAR(255), city VARCHAR(100),
      state VARCHAR(100), pincode VARCHAR(10), landmark VARCHAR(100),
      latitude DECIMAL(10,8), longitude DECIMAL(11,8), isDefault BOOLEAN DEFAULT FALSE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE, INDEX idx_userId (userId)
    ) ENGINE=InnoDB`);

    await connection.execute(`CREATE TABLE restaurants (
      id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL, description TEXT,
      cuisine JSON, address TEXT, phone VARCHAR(20), email VARCHAR(100), ownerId INT,
      images JSON, rating DECIMAL(2,1) DEFAULT 0, ratingCount INT DEFAULT 0, priceForTwo INT,
      deliveryTimeMin INT, deliveryTimeMax INT, latitude DECIMAL(10,8), longitude DECIMAL(11,8),
      isOpen BOOLEAN DEFAULT TRUE, isActive BOOLEAN DEFAULT TRUE, isPureVeg BOOLEAN DEFAULT FALSE,
      offers JSON, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (ownerId) REFERENCES users(id), INDEX idx_rating (rating), INDEX idx_isOpen (isOpen)
    ) ENGINE=InnoDB`);

    await connection.execute(`CREATE TABLE menu_categories (
      id INT AUTO_INCREMENT PRIMARY KEY, restaurantId INT NOT NULL, name VARCHAR(100) NOT NULL,
      description TEXT, sortOrder INT DEFAULT 0, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE, INDEX idx_restaurantId (restaurantId)
    ) ENGINE=InnoDB`);

    await connection.execute(`CREATE TABLE menu_items (
      id INT AUTO_INCREMENT PRIMARY KEY, restaurantId INT NOT NULL, categoryId INT NOT NULL,
      name VARCHAR(100) NOT NULL, description TEXT, price DECIMAL(10,2) NOT NULL,
      isVeg BOOLEAN DEFAULT TRUE, isBestseller BOOLEAN DEFAULT FALSE, isAvailable BOOLEAN DEFAULT TRUE,
      image VARCHAR(255), rating DECIMAL(2,1) DEFAULT 0, variants JSON, tags JSON,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE,
      FOREIGN KEY (categoryId) REFERENCES menu_categories(id) ON DELETE CASCADE,
      INDEX idx_restaurantId (restaurantId), INDEX idx_categoryId (categoryId)
    ) ENGINE=InnoDB`);

    await connection.execute(`CREATE TABLE carts (
      id INT AUTO_INCREMENT PRIMARY KEY, userId INT NOT NULL, restaurantId INT NOT NULL,
      items JSON NOT NULL, totalAmount DECIMAL(10,2) DEFAULT 0,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (restaurantId) REFERENCES restaurants(id),
      UNIQUE KEY unique_user_cart (userId), INDEX idx_userId (userId)
    ) ENGINE=InnoDB`);

    await connection.execute(`CREATE TABLE orders (
      id INT AUTO_INCREMENT PRIMARY KEY, orderNumber VARCHAR(20) UNIQUE NOT NULL,
      userId INT NOT NULL, restaurantId INT NOT NULL, items JSON NOT NULL,
      totalAmount DECIMAL(10,2) NOT NULL, discountAmount DECIMAL(10,2) DEFAULT 0,
      deliveryCharge DECIMAL(10,2) DEFAULT 0, taxAmount DECIMAL(10,2) DEFAULT 0,
      finalAmount DECIMAL(10,2) NOT NULL,
      status ENUM('pending','confirmed','preparing','ready','out_for_delivery','delivered','cancelled') DEFAULT 'pending',
      paymentStatus ENUM('pending','completed','failed','refunded') DEFAULT 'pending',
      paymentMethod VARCHAR(50), paymentId VARCHAR(100), deliveryAddress JSON NOT NULL,
      deliveryPartnerId INT, estimatedDeliveryTime TIMESTAMP, actualDeliveryTime TIMESTAMP,
      specialInstructions TEXT, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id), FOREIGN KEY (restaurantId) REFERENCES restaurants(id),
      FOREIGN KEY (deliveryPartnerId) REFERENCES users(id),
      INDEX idx_userId (userId), INDEX idx_status (status)
    ) ENGINE=InnoDB`);

    await connection.execute(`CREATE TABLE order_status_history (
      id INT AUTO_INCREMENT PRIMARY KEY, orderId INT NOT NULL, status VARCHAR(50) NOT NULL,
      notes TEXT, createdBy INT, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE, INDEX idx_orderId (orderId)
    ) ENGINE=InnoDB`);

    await connection.execute(`CREATE TABLE reviews (
      id INT AUTO_INCREMENT PRIMARY KEY, userId INT NOT NULL, restaurantId INT, orderId INT,
      rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5), comment TEXT, images JSON,
      isVerified BOOLEAN DEFAULT FALSE, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE,
      FOREIGN KEY (orderId) REFERENCES orders(id)
    ) ENGINE=InnoDB`);

    await connection.execute(`CREATE TABLE wallets (
      id INT AUTO_INCREMENT PRIMARY KEY, userId INT UNIQUE NOT NULL,
      balance DECIMAL(10,2) DEFAULT 0, currency VARCHAR(3) DEFAULT 'INR',
      isActive BOOLEAN DEFAULT TRUE, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`);

    await connection.execute(`CREATE TABLE wallet_transactions (
      id INT AUTO_INCREMENT PRIMARY KEY, walletId INT NOT NULL,
      type ENUM('credit','debit') NOT NULL, amount DECIMAL(10,2) NOT NULL,
      balanceAfter DECIMAL(10,2) NOT NULL, description VARCHAR(255),
      referenceType VARCHAR(50), referenceId INT, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (walletId) REFERENCES wallets(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`);

    await connection.execute(`CREATE TABLE coupons (
      id INT AUTO_INCREMENT PRIMARY KEY, code VARCHAR(50) UNIQUE NOT NULL, description TEXT,
      discountType ENUM('percentage','fixed') NOT NULL, discountValue DECIMAL(10,2) NOT NULL,
      minOrderAmount DECIMAL(10,2) DEFAULT 0, maxDiscountAmount DECIMAL(10,2),
      validFrom TIMESTAMP, validUntil TIMESTAMP, usageLimit INT, usageCount INT DEFAULT 0,
      isActive BOOLEAN DEFAULT TRUE, applicableRestaurants JSON, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB`);

    await connection.execute(`CREATE TABLE user_coupons (
      id INT AUTO_INCREMENT PRIMARY KEY, userId INT NOT NULL, couponId INT NOT NULL,
      orderId INT, usedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (couponId) REFERENCES coupons(id) ON DELETE CASCADE,
      FOREIGN KEY (orderId) REFERENCES orders(id), UNIQUE KEY unique_user_coupon (userId, couponId)
    ) ENGINE=InnoDB`);

    await connection.execute(`CREATE TABLE notifications (
      id INT AUTO_INCREMENT PRIMARY KEY, userId INT NOT NULL,
      type ENUM('order','promo','system','delivery') NOT NULL,
      title VARCHAR(200) NOT NULL, message TEXT NOT NULL, data JSON,
      isRead BOOLEAN DEFAULT FALSE, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`);

    await connection.execute(`CREATE TABLE delivery_locations (
      id INT AUTO_INCREMENT PRIMARY KEY, deliveryPartnerId INT NOT NULL, orderId INT NOT NULL,
      latitude DECIMAL(10,8) NOT NULL, longitude DECIMAL(11,8) NOT NULL, accuracy DECIMAL(5,2),
      recordedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (deliveryPartnerId) REFERENCES users(id),
      FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`);

    await connection.execute(`CREATE TABLE loyalty_points (
      id INT PRIMARY KEY AUTO_INCREMENT, userId INT NOT NULL,
      totalPoints INT DEFAULT 0, availablePoints INT DEFAULT 0,
      redeemedPoints INT DEFAULT 0, lifetimePoints INT DEFAULT 0,
      tier VARCHAR(20) DEFAULT 'bronze', createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_user (userId), FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`);

    await connection.execute(`CREATE TABLE loyalty_transactions (
      id INT PRIMARY KEY AUTO_INCREMENT, userId INT NOT NULL,
      type ENUM('earned','redeemed','expired','bonus') NOT NULL, points INT NOT NULL,
      orderId INT NULL, description VARCHAR(255), createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE SET NULL
    ) ENGINE=InnoDB`);

    console.log('✅ All 18 tables created');

    // STEP 3: Generate REAL bcrypt hash
    console.log('\n🔐 Generating password hash...');
    const hash = await bcrypt.hash('password123', 10);
    const verify = await bcrypt.compare('password123', hash);
    console.log(`   Hash: ${hash.substring(0, 30)}...`);
    console.log(`   Verify: ${verify ? '✅ PASS' : '❌ FAIL'}`);

    // STEP 4: Insert seed data using helper
    const insertBatch = async (sql, rows) => {
      for (const row of rows) {
        await connection.execute(sql, row);
      }
    };

    console.log('\n👥 Inserting users...');
    await insertBatch(`INSERT INTO users (name, email, phone, password, role, isVerified, isActive, avatar, googleId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      ['Test User', 'test@test.com', '9876543210', hash, 'customer', 1, 1, null, null],
      ['John Doe', 'john@gmail.com', '9876543211', hash, 'customer', 1, 1, null, null],
      ['Jane Smith', 'jane@gmail.com', '9876543212', hash, 'customer', 1, 1, null, null],
      ['Admin User', 'admin@foodzap.com', '9999999999', hash, 'admin', 1, 1, null, null],
      ['Restaurant Owner', 'owner@restaurant.com', '8888888888', hash, 'restaurant_owner', 1, 1, null, null],
      ['Delivery Partner', 'delivery@foodzap.com', '7777777777', hash, 'delivery_partner', 1, 1, null, null],
      ['Google User', 'googleuser@gmail.com', null, hash, 'customer', 1, 1, 'https://lh3.googleusercontent.com/a/default-user', 'google-oauth-123456789'],
    ]);

    console.log('🏠 Inserting addresses...');
    await insertBatch(`INSERT INTO addresses (userId, label, street, city, state, pincode, landmark, latitude, longitude, isDefault) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      [1, 'Home', '123 Main Street, Koramangala', 'Bangalore', 'Karnataka', '560034', 'Near Metro Station', 12.9352, 77.6245, 1],
      [1, 'Office', '456 Tech Park, Whitefield', 'Bangalore', 'Karnataka', '560066', 'Near ITPL', 12.9698, 77.7499, 0],
      [2, 'Home', '789 Residential Area, HSR Layout', 'Bangalore', 'Karnataka', '560102', 'Near BDA Complex', 12.9115, 77.6512, 1],
      [3, 'Home', '321 Garden Apartments, Indiranagar', 'Bangalore', 'Karnataka', '560038', 'Near 100 Feet Road', 12.9719, 77.6412, 1],
    ]);

    console.log('🏪 Inserting restaurants...');
    await insertBatch(`INSERT INTO restaurants (name, description, cuisine, address, phone, email, ownerId, images, rating, ratingCount, priceForTwo, deliveryTimeMin, deliveryTimeMax, latitude, longitude, isOpen, isActive, isPureVeg, offers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      ['Biryani House', 'Best Hyderabadi biryani in town', JSON.stringify(['Hyderabadi', 'North Indian', 'Biryani']), 'Biryani Street, Koramangala, Bangalore 560034', '080-12345678', 'biryani@house.com', 5, JSON.stringify(['https://example.com/biryani1.jpg']), 4.5, 1200, 400, 30, 45, 12.9352, 77.6245, 1, 1, 0, JSON.stringify([{type:'discount',description:'20% OFF',code:'BIRYANI20'}])],
      ['Pizza Palace', 'Authentic Italian pizzas', JSON.stringify(['Italian', 'Pizza', 'Fast Food']), 'Pizza Lane, Whitefield, Bangalore 560066', '080-23456789', 'pizza@palace.com', 5, JSON.stringify(['https://example.com/pizza1.jpg']), 4.3, 850, 350, 25, 35, 12.9698, 77.7499, 1, 1, 0, JSON.stringify([{type:'freebie',description:'Free garlic bread',code:'PIZZAFREE'}])],
      ['Burger King', 'Juicy burgers and fries', JSON.stringify(['American', 'Burgers', 'Fast Food']), 'Burger Boulevard, HSR Layout, Bangalore 560102', '080-34567890', 'burger@king.com', 5, JSON.stringify(['https://example.com/burger1.jpg']), 4.2, 2100, 300, 20, 30, 12.9115, 77.6512, 1, 1, 0, JSON.stringify([{type:'discount',description:'Buy 1 Get 1 Free',code:'BURGERBOGO'}])],
    ]);

    console.log('📂 Inserting menu categories...');
    await insertBatch(`INSERT INTO menu_categories (restaurantId, name, description, sortOrder) VALUES (?, ?, ?, ?)`, [
      [1, 'Biryani', 'Hyderabadi style biryanis', 1],
      [1, 'Kebabs', 'Grilled kebabs', 2],
      [1, 'Starters', 'Appetizers', 3],
      [2, 'Pizza', 'Italian pizzas', 1],
      [2, 'Sides', 'Garlic bread, wings', 2],
      [3, 'Burgers', 'Beef, chicken, veggie', 1],
      [3, 'Fries', 'Fries and sides', 2],
    ]);

    console.log('🍔 Inserting menu items...');
    await insertBatch(`INSERT INTO menu_items (restaurantId, categoryId, name, description, price, isVeg, isBestseller, isAvailable, image, rating, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      [1, 1, 'Hyderabadi Chicken Biryani', 'Authentic hyderabadi biryani with chicken', 299.00, 0, 1, 1, 'https://example.com/chicken-biryani.jpg', 4.5, JSON.stringify(['spicy','popular'])],
      [1, 1, 'Veg Biryani', 'Fresh vegetables in biryani', 249.00, 1, 1, 1, 'https://example.com/veg-biryani.jpg', 4.3, JSON.stringify(['vegetarian'])],
      [1, 1, 'Mutton Biryani', 'Tender mutton in basmati rice', 399.00, 0, 0, 1, 'https://example.com/mutton-biryani.jpg', 4.7, JSON.stringify(['premium'])],
      [1, 2, 'Chicken Seekh Kebab', 'Minced chicken grilled kebabs', 249.00, 0, 0, 1, 'https://example.com/seekh-kebab.jpg', 4.4, JSON.stringify(['grilled'])],
      [1, 3, 'Paneer Tikka', 'Cottage cheese marinated and grilled', 229.00, 1, 1, 1, 'https://example.com/paneer-tikka.jpg', 4.5, JSON.stringify(['vegetarian','popular'])],
      [2, 4, 'Margherita Pizza', 'Classic tomato and cheese pizza', 249.00, 1, 1, 1, 'https://example.com/margherita.jpg', 4.3, JSON.stringify(['classic'])],
      [2, 4, 'Pepperoni Pizza', 'Spicy pepperoni with mozzarella', 349.00, 0, 1, 1, 'https://example.com/pepperoni.jpg', 4.5, JSON.stringify(['spicy','popular'])],
      [2, 5, 'Garlic Bread', 'Toasted garlic bread with cheese', 149.00, 1, 1, 1, 'https://example.com/garlic-bread.jpg', 4.4, JSON.stringify(['sides'])],
      [3, 6, 'Classic Burger', 'Beef patty with fresh veggies', 199.00, 0, 1, 1, 'https://example.com/classic-burger.jpg', 4.2, JSON.stringify(['popular'])],
      [3, 6, 'Veg Burger', 'Veg patty with cheese', 169.00, 1, 1, 1, 'https://example.com/veg-burger.jpg', 4.1, JSON.stringify(['vegetarian'])],
      [3, 7, 'French Fries', 'Crispy golden fries', 99.00, 1, 1, 1, 'https://example.com/fries.jpg', 4.3, JSON.stringify(['sides'])],
    ]);

    console.log('🛒 Inserting carts...');
    await insertBatch(`INSERT INTO carts (userId, restaurantId, items, totalAmount) VALUES (?, ?, ?, ?)`, [
      [1, 1, JSON.stringify([{menuItemId:1,name:'Hyderabadi Chicken Biryani',quantity:1,price:299}]), 299.00],
      [2, 2, JSON.stringify([{menuItemId:6,name:'Margherita Pizza',quantity:1,price:249}]), 249.00],
    ]);

    console.log('📦 Inserting orders...');
    await insertBatch(`INSERT INTO orders (orderNumber, userId, restaurantId, items, totalAmount, discountAmount, deliveryCharge, taxAmount, finalAmount, status, paymentStatus, paymentMethod, deliveryAddress, deliveryPartnerId, specialInstructions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      ['ORD-2024-001', 1, 1, JSON.stringify([{menuItemId:1,name:'Chicken Biryani',quantity:2,price:299}]), 598.00, 0, 30.00, 60.00, 688.00, 'delivered', 'completed', 'online', JSON.stringify({street:'123 Main Street, Koramangala',city:'Bangalore',pincode:'560034'}), 6, 'Extra spicy please'],
      ['ORD-2024-002', 2, 2, JSON.stringify([{menuItemId:6,name:'Margherita Pizza',quantity:1,price:249}]), 249.00, 0, 25.00, 25.00, 299.00, 'delivered', 'completed', 'online', JSON.stringify({street:'789 HSR Layout',city:'Bangalore',pincode:'560102'}), 6, null],
      ['ORD-2024-003', 1, 3, JSON.stringify([{menuItemId:9,name:'Classic Burger',quantity:1,price:199}]), 199.00, 0, 20.00, 20.00, 239.00, 'preparing', 'completed', 'online', JSON.stringify({street:'123 Main Street',city:'Bangalore',pincode:'560034'}), null, 'No onions'],
    ]);

    console.log('⭐ Inserting reviews...');
    await insertBatch(`INSERT INTO reviews (userId, restaurantId, orderId, rating, comment, isVerified) VALUES (?, ?, ?, ?, ?, ?)`, [
      [1, 1, 1, 5, 'Amazing biryani!', 1],
      [2, 2, 2, 4, 'Good pizza, fast delivery.', 1],
    ]);

    console.log('💰 Inserting wallets...');
    await insertBatch(`INSERT INTO wallets (userId, balance, currency, isActive) VALUES (?, ?, ?, ?)`, [
      [1, 500.00, 'INR', 1],
      [2, 750.00, 'INR', 1],
      [3, 0.00, 'INR', 1],
    ]);

    console.log('🎟️ Inserting coupons...');
    await insertBatch(`INSERT INTO coupons (code, description, discountType, discountValue, minOrderAmount, maxDiscountAmount, validFrom, validUntil, usageLimit, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      ['WELCOME20', '20% off on first order', 'percentage', 20.00, 200.00, 100.00, new Date(), new Date(Date.now() + 30*24*60*60*1000), 100, 1],
      ['FLAT50', 'Flat 50 off above 300', 'fixed', 50.00, 300.00, 50.00, new Date(), new Date(Date.now() + 30*24*60*60*1000), 50, 1],
    ]);

    console.log('🔔 Inserting notifications...');
    await insertBatch(`INSERT INTO notifications (userId, type, title, message, isRead) VALUES (?, ?, ?, ?, ?)`, [
      [1, 'order', 'Order Delivered', 'Your order ORD-2024-001 has been delivered', 1],
      [1, 'promo', 'Special Offer', 'Get 20% off with code WELCOME20', 0],
      [2, 'order', 'Order Confirmed', 'Your order ORD-2024-002 is being prepared', 1],
    ]);

    console.log('🏆 Inserting loyalty points...');
    await insertBatch(`INSERT INTO loyalty_points (userId, totalPoints, availablePoints, redeemedPoints, lifetimePoints, tier) VALUES (?, ?, ?, ?, ?, ?)`, [
      [1, 550, 550, 0, 550, 'silver'],
      [2, 720, 720, 0, 720, 'silver'],
      [3, 150, 150, 0, 150, 'bronze'],
      [4, 1000, 1000, 0, 1000, 'gold'],
      [5, 300, 250, 50, 300, 'bronze'],
      [6, 200, 200, 0, 200, 'bronze'],
      [7, 50, 50, 0, 50, 'bronze'],
    ]);

    console.log('💎 Inserting loyalty transactions...');
    await insertBatch(`INSERT INTO loyalty_transactions (userId, type, points, orderId, description) VALUES (?, ?, ?, ?, ?)`, [
      [1, 'earned', 100, 1, 'Points for order ORD-2024-001'],
      [1, 'bonus', 50, null, 'Welcome bonus'],
      [2, 'earned', 200, 2, 'Points for order ORD-2024-002'],
      [2, 'bonus', 100, null, 'Signup bonus'],
      [3, 'earned', 100, null, 'First order bonus'],
      [7, 'bonus', 50, null, 'Google signup bonus'],
    ]);

    // STEP 5: Verify
    console.log('\n📊 Data verification:');
    const [counts] = await connection.execute(`
      SELECT 'Users' as t, COUNT(*) as c FROM users
      UNION ALL SELECT 'Addresses', COUNT(*) FROM addresses
      UNION ALL SELECT 'Restaurants', COUNT(*) FROM restaurants
      UNION ALL SELECT 'Menu Categories', COUNT(*) FROM menu_categories
      UNION ALL SELECT 'Menu Items', COUNT(*) FROM menu_items
      UNION ALL SELECT 'Carts', COUNT(*) FROM carts
      UNION ALL SELECT 'Orders', COUNT(*) FROM orders
      UNION ALL SELECT 'Reviews', COUNT(*) FROM reviews
      UNION ALL SELECT 'Wallets', COUNT(*) FROM wallets
      UNION ALL SELECT 'Coupons', COUNT(*) FROM coupons
      UNION ALL SELECT 'Notifications', COUNT(*) FROM notifications
      UNION ALL SELECT 'Loyalty Points', COUNT(*) FROM loyalty_points
      UNION ALL SELECT 'Loyalty Transactions', COUNT(*) FROM loyalty_transactions
    `);
    for (const row of counts) {
      console.log(`   ${row.t}: ${row.c}`);
    }

    // Test login
    console.log('\n🔐 Testing login with test@test.com / password123...');
    const [users] = await connection.execute(`SELECT * FROM users WHERE email = ?`, ['test@test.com']);
    if (users.length > 0) {
      const match = await bcrypt.compare('password123', users[0].password);
      console.log(`   Result: ${match ? '✅ PASSWORD MATCHES!' : '❌ PASSWORD MISMATCH!'}`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('   Email: test@test.com | Phone: 9876543210 | Password: password123');
    console.log('   Email: john@gmail.com | Phone: 9876543211 | Password: password123');
    console.log('   Email: admin@foodzap.com | Phone: 9999999999 | Password: password123');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.sql) console.error('   SQL:', error.sql.substring(0, 200));
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

seed();
