-- ============================================================================
-- FOODZAP - COMPLETE DATABASE RESET & SEED
-- Run this entire file in MySQL Workbench (File -> Open SQL Script -> Execute)
-- This will DELETE all data and recreate everything from scratch
-- ============================================================================

CREATE DATABASE IF NOT EXISTS foodzap CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE foodzap;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- STEP 1: DROP ALL TABLES (Clean Slate)
-- ============================================================================
DROP TABLE IF EXISTS loyalty_transactions;
DROP TABLE IF EXISTS loyalty_points;
DROP TABLE IF EXISTS delivery_locations;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS user_coupons;
DROP TABLE IF EXISTS coupons;
DROP TABLE IF EXISTS wallet_transactions;
DROP TABLE IF EXISTS wallets;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS order_status_history;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS menu_categories;
DROP TABLE IF EXISTS restaurants;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- STEP 2: CREATE ALL TABLES (Exact match with schema.sql)
-- ============================================================================

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    role ENUM('customer', 'admin', 'restaurant_owner', 'delivery_partner') DEFAULT 'customer',
    isActive BOOLEAN DEFAULT TRUE,
    isVerified BOOLEAN DEFAULT FALSE,
    googleId VARCHAR(255),
    lastLogin TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_googleId (googleId),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- Addresses table
CREATE TABLE addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    label VARCHAR(50),
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    landmark VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    isDefault BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_userId (userId)
) ENGINE=InnoDB;

-- Restaurants table
CREATE TABLE restaurants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    cuisine JSON,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    ownerId INT,
    images JSON,
    rating DECIMAL(2, 1) DEFAULT 0,
    ratingCount INT DEFAULT 0,
    priceForTwo INT,
    deliveryTimeMin INT,
    deliveryTimeMax INT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    isOpen BOOLEAN DEFAULT TRUE,
    isActive BOOLEAN DEFAULT TRUE,
    isPureVeg BOOLEAN DEFAULT FALSE,
    offers JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ownerId) REFERENCES users(id),
    INDEX idx_rating (rating),
    INDEX idx_isOpen (isOpen)
) ENGINE=InnoDB;

-- Menu Categories table
CREATE TABLE menu_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurantId INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    sortOrder INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE,
    INDEX idx_restaurantId (restaurantId)
) ENGINE=InnoDB;

-- Menu Items table
CREATE TABLE menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurantId INT NOT NULL,
    categoryId INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    isVeg BOOLEAN DEFAULT TRUE,
    isBestseller BOOLEAN DEFAULT FALSE,
    isAvailable BOOLEAN DEFAULT TRUE,
    image VARCHAR(255),
    rating DECIMAL(2, 1) DEFAULT 0,
    variants JSON,
    tags JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (categoryId) REFERENCES menu_categories(id) ON DELETE CASCADE,
    INDEX idx_restaurantId (restaurantId),
    INDEX idx_categoryId (categoryId),
    INDEX idx_isVeg (isVeg),
    INDEX idx_isBestseller (isBestseller)
) ENGINE=InnoDB;

-- Cart table
CREATE TABLE carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    restaurantId INT NOT NULL,
    items JSON NOT NULL,
    totalAmount DECIMAL(10, 2) DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurantId) REFERENCES restaurants(id),
    UNIQUE KEY unique_user_cart (userId),
    INDEX idx_userId (userId)
) ENGINE=InnoDB;

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderNumber VARCHAR(20) UNIQUE NOT NULL,
    userId INT NOT NULL,
    restaurantId INT NOT NULL,
    items JSON NOT NULL,
    totalAmount DECIMAL(10, 2) NOT NULL,
    discountAmount DECIMAL(10, 2) DEFAULT 0,
    deliveryCharge DECIMAL(10, 2) DEFAULT 0,
    taxAmount DECIMAL(10, 2) DEFAULT 0,
    finalAmount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
    paymentStatus ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    paymentMethod VARCHAR(50),
    paymentId VARCHAR(100),
    deliveryAddress JSON NOT NULL,
    deliveryPartnerId INT,
    estimatedDeliveryTime TIMESTAMP,
    actualDeliveryTime TIMESTAMP,
    specialInstructions TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (restaurantId) REFERENCES restaurants(id),
    FOREIGN KEY (deliveryPartnerId) REFERENCES users(id),
    INDEX idx_userId (userId),
    INDEX idx_restaurantId (restaurantId),
    INDEX idx_status (status),
    INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB;

-- Order Status History
CREATE TABLE order_status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    createdBy INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_orderId (orderId)
) ENGINE=InnoDB;

-- Reviews table
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    restaurantId INT,
    orderId INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    images JSON,
    isVerified BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (orderId) REFERENCES orders(id),
    INDEX idx_restaurantId (restaurantId),
    INDEX idx_orderId (orderId)
) ENGINE=InnoDB;

-- Wallet table
CREATE TABLE wallets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT UNIQUE NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'INR',
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_userId (userId)
) ENGINE=InnoDB;

-- Wallet Transactions
CREATE TABLE wallet_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    walletId INT NOT NULL,
    type ENUM('credit', 'debit') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    balanceAfter DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255),
    referenceType VARCHAR(50),
    referenceId INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (walletId) REFERENCES wallets(id) ON DELETE CASCADE,
    INDEX idx_walletId (walletId),
    INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB;

-- Coupons table
CREATE TABLE coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discountType ENUM('percentage', 'fixed') NOT NULL,
    discountValue DECIMAL(10, 2) NOT NULL,
    minOrderAmount DECIMAL(10, 2) DEFAULT 0,
    maxDiscountAmount DECIMAL(10, 2),
    validFrom TIMESTAMP,
    validUntil TIMESTAMP,
    usageLimit INT,
    usageCount INT DEFAULT 0,
    isActive BOOLEAN DEFAULT TRUE,
    applicableRestaurants JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_isActive (isActive),
    INDEX idx_validUntil (validUntil)
) ENGINE=InnoDB;

-- User Coupons
CREATE TABLE user_coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    couponId INT NOT NULL,
    orderId INT,
    usedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (couponId) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (orderId) REFERENCES orders(id),
    UNIQUE KEY unique_user_coupon (userId, couponId),
    INDEX idx_userId (userId)
) ENGINE=InnoDB;

-- Subscriptions table
CREATE TABLE subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    planType ENUM('basic', 'premium', 'gold') NOT NULL,
    startDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    endDate TIMESTAMP NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    benefits JSON,
    isActive BOOLEAN DEFAULT TRUE,
    autoRenew BOOLEAN DEFAULT FALSE,
    paymentId VARCHAR(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_userId (userId),
    INDEX idx_isActive (isActive),
    INDEX idx_endDate (endDate)
) ENGINE=InnoDB;

-- Notifications table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    type ENUM('order', 'promo', 'system', 'delivery') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSON,
    isRead BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_userId (userId),
    INDEX idx_isRead (isRead),
    INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB;

-- Delivery Partner Locations
CREATE TABLE delivery_locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    deliveryPartnerId INT NOT NULL,
    orderId INT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy DECIMAL(5, 2),
    recordedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deliveryPartnerId) REFERENCES users(id),
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_orderId (orderId),
    INDEX idx_recordedAt (recordedAt)
) ENGINE=InnoDB;

-- Loyalty Points Table
CREATE TABLE loyalty_points (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    totalPoints INT DEFAULT 0,
    availablePoints INT DEFAULT 0,
    redeemedPoints INT DEFAULT 0,
    lifetimePoints INT DEFAULT 0,
    tier VARCHAR(20) DEFAULT 'bronze',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user (userId),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Loyalty Transactions Table
CREATE TABLE loyalty_transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    type ENUM('earned', 'redeemed', 'expired', 'bonus') NOT NULL,
    points INT NOT NULL,
    orderId INT NULL,
    description VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================================
-- STEP 3: INSERT SEED DATA
-- ============================================================================

-- USERS (7 test users)
-- Password for all: 'password123' (bcrypt hash)
INSERT INTO users (name, email, phone, password, role, isVerified, isActive, avatar, googleId, createdAt) VALUES 
('Test User', 'test@test.com', '9876543210', '$2a$10$/39/svDB0m09c4yotGHBPOcqBbkf63M9ZN67aZpyizJY8MVbHhgLC', 'customer', TRUE, TRUE, NULL, NULL, NOW()),
('John Doe', 'john@gmail.com', '9876543211', '$2a$10$/39/svDB0m09c4yotGHBPOcqBbkf63M9ZN67aZpyizJY8MVbHhgLC', 'customer', TRUE, TRUE, NULL, NULL, NOW()),
('Jane Smith', 'jane@gmail.com', '9876543212', '$2a$10$/39/svDB0m09c4yotGHBPOcqBbkf63M9ZN67aZpyizJY8MVbHhgLC', 'customer', TRUE, TRUE, NULL, NULL, NOW()),
('Admin User', 'admin@foodzap.com', '9999999999', '$2a$10$/39/svDB0m09c4yotGHBPOcqBbkf63M9ZN67aZpyizJY8MVbHhgLC', 'admin', TRUE, TRUE, NULL, NULL, NOW()),
('Restaurant Owner', 'owner@restaurant.com', '8888888888', '$2a$10$/39/svDB0m09c4yotGHBPOcqBbkf63M9ZN67aZpyizJY8MVbHhgLC', 'restaurant_owner', TRUE, TRUE, NULL, NULL, NOW()),
('Delivery Partner', 'delivery@foodzap.com', '7777777777', '$2a$10$/39/svDB0m09c4yotGHBPOcqBbkf63M9ZN67aZpyizJY8MVbHhgLC', 'delivery_partner', TRUE, TRUE, NULL, NULL, NOW()),
('Google User', 'googleuser@gmail.com', NULL, '$2a$10$/39/svDB0m09c4yotGHBPOcqBbkf63M9ZN67aZpyizJY8MVbHhgLC', 'customer', TRUE, TRUE, 'https://lh3.googleusercontent.com/a/default-user', 'google-oauth-123456789', NOW());

-- ADDRESSES
INSERT INTO addresses (userId, label, street, city, state, pincode, landmark, latitude, longitude, isDefault, createdAt) VALUES 
(1, 'Home', '123 Main Street, Koramangala', 'Bangalore', 'Karnataka', '560034', 'Near Metro Station', 12.9352, 77.6245, TRUE, NOW()),
(1, 'Office', '456 Tech Park, Whitefield', 'Bangalore', 'Karnataka', '560066', 'Near ITPL', 12.9698, 77.7499, FALSE, NOW()),
(2, 'Home', '789 Residential Area, HSR Layout', 'Bangalore', 'Karnataka', '560102', 'Near BDA Complex', 12.9115, 77.6512, TRUE, NOW()),
(3, 'Home', '321 Garden Apartments, Indiranagar', 'Bangalore', 'Karnataka', '560038', 'Near 100 Feet Road', 12.9719, 77.6412, TRUE, NOW());

-- RESTAURANTS (3 restaurants, ownerId references user 5 = Restaurant Owner)
INSERT INTO restaurants (name, description, cuisine, address, phone, email, ownerId, images, rating, ratingCount, priceForTwo, deliveryTimeMin, deliveryTimeMax, latitude, longitude, isOpen, isActive, isPureVeg, offers, createdAt) VALUES 
('Biryani House', 'Best Hyderabadi biryani in town', JSON_ARRAY('Hyderabadi', 'North Indian', 'Biryani'), 'Biryani Street, Koramangala, Bangalore, Karnataka 560034', '080-12345678', 'biryani@house.com', 5, JSON_ARRAY('https://example.com/biryani1.jpg', 'https://example.com/biryani2.jpg'), 4.5, 1200, 400, 30, 45, 12.9352, 77.6245, TRUE, TRUE, FALSE, JSON_ARRAY(JSON_OBJECT('type', 'discount', 'description', '20% OFF on first order', 'code', 'BIRYANI20')), NOW()),
('Pizza Palace', 'Authentic Italian pizzas', JSON_ARRAY('Italian', 'Pizza', 'Fast Food'), 'Pizza Lane, Whitefield, Bangalore, Karnataka 560066', '080-23456789', 'pizza@palace.com', 5, JSON_ARRAY('https://example.com/pizza1.jpg'), 4.3, 850, 350, 25, 35, 12.9698, 77.7499, TRUE, TRUE, FALSE, JSON_ARRAY(JSON_OBJECT('type', 'freebie', 'description', 'Free garlic bread', 'code', 'PIZZAFREE')), NOW()),
('Burger King', 'Juicy burgers and fries', JSON_ARRAY('American', 'Burgers', 'Fast Food'), 'Burger Boulevard, HSR Layout, Bangalore, Karnataka 560102', '080-34567890', 'burger@king.com', 5, JSON_ARRAY('https://example.com/burger1.jpg'), 4.2, 2100, 300, 20, 30, 12.9115, 77.6512, TRUE, TRUE, FALSE, JSON_ARRAY(JSON_OBJECT('type', 'discount', 'description', 'Buy 1 Get 1 Free', 'code', 'BURGERBOGO')), NOW());

-- MENU CATEGORIES
INSERT INTO menu_categories (restaurantId, name, description, sortOrder, createdAt) VALUES 
(1, 'Biryani', 'Hyderabadi style biryanis', 1, NOW()),
(1, 'Kebabs', 'Grilled kebabs', 2, NOW()),
(1, 'Starters', 'Appetizers', 3, NOW()),
(2, 'Pizza', 'Italian pizzas', 1, NOW()),
(2, 'Sides', 'Garlic bread, wings', 2, NOW()),
(3, 'Burgers', 'Beef, chicken, veggie', 1, NOW()),
(3, 'Fries', 'Fries and sides', 2, NOW());

-- MENU ITEMS
INSERT INTO menu_items (restaurantId, categoryId, name, description, price, isVeg, isBestseller, isAvailable, image, rating, variants, tags, createdAt) VALUES 
(1, 1, 'Hyderabadi Chicken Biryani', 'Authentic hyderabadi style biryani with chicken', 299.00, FALSE, TRUE, TRUE, 'https://example.com/chicken-biryani.jpg', 4.5, NULL, JSON_ARRAY('spicy', 'popular'), NOW()),
(1, 1, 'Veg Biryani', 'Fresh vegetables and paneer in biryani', 249.00, TRUE, TRUE, TRUE, 'https://example.com/veg-biryani.jpg', 4.3, NULL, JSON_ARRAY('vegetarian'), NOW()),
(1, 1, 'Mutton Biryani', 'Tender mutton pieces in aromatic basmati rice', 399.00, FALSE, FALSE, TRUE, 'https://example.com/mutton-biryani.jpg', 4.7, NULL, JSON_ARRAY('spicy', 'premium'), NOW()),
(1, 2, 'Chicken Seekh Kebab', 'Minced chicken kebabs grilled to perfection', 249.00, FALSE, FALSE, TRUE, 'https://example.com/seekh-kebab.jpg', 4.4, NULL, JSON_ARRAY('grilled'), NOW()),
(1, 3, 'Paneer Tikka', 'Cottage cheese marinated and grilled', 229.00, TRUE, TRUE, TRUE, 'https://example.com/paneer-tikka.jpg', 4.5, NULL, JSON_ARRAY('vegetarian', 'popular'), NOW()),
(2, 4, 'Margherita Pizza', 'Classic tomato and cheese pizza', 249.00, TRUE, TRUE, TRUE, 'https://example.com/margherita.jpg', 4.3, NULL, JSON_ARRAY('classic'), NOW()),
(2, 4, 'Pepperoni Pizza', 'Spicy pepperoni with mozzarella', 349.00, FALSE, TRUE, TRUE, 'https://example.com/pepperoni.jpg', 4.5, NULL, JSON_ARRAY('spicy', 'popular'), NOW()),
(2, 5, 'Garlic Bread', 'Toasted garlic bread with cheese', 149.00, TRUE, TRUE, TRUE, 'https://example.com/garlic-bread.jpg', 4.4, NULL, JSON_ARRAY('sides'), NOW()),
(3, 6, 'Classic Burger', 'Beef patty with fresh veggies', 199.00, FALSE, TRUE, TRUE, 'https://example.com/classic-burger.jpg', 4.2, NULL, JSON_ARRAY('popular'), NOW()),
(3, 6, 'Veg Burger', 'Veg patty with cheese', 169.00, TRUE, TRUE, TRUE, 'https://example.com/veg-burger.jpg', 4.1, NULL, JSON_ARRAY('vegetarian'), NOW()),
(3, 7, 'French Fries', 'Crispy golden fries', 99.00, TRUE, TRUE, TRUE, 'https://example.com/fries.jpg', 4.3, NULL, JSON_ARRAY('sides'), NOW());

-- CARTS
INSERT INTO carts (userId, restaurantId, items, totalAmount, createdAt, updatedAt) VALUES 
(1, 1, JSON_ARRAY(JSON_OBJECT('menuItemId', 1, 'name', 'Hyderabadi Chicken Biryani', 'quantity', 1, 'price', 299)), 299.00, NOW(), NOW()),
(2, 2, JSON_ARRAY(JSON_OBJECT('menuItemId', 6, 'name', 'Margherita Pizza', 'quantity', 1, 'price', 249)), 249.00, NOW(), NOW());

-- ORDERS
INSERT INTO orders (orderNumber, userId, restaurantId, items, totalAmount, discountAmount, deliveryCharge, taxAmount, finalAmount, status, paymentStatus, paymentMethod, deliveryAddress, deliveryPartnerId, specialInstructions, createdAt, updatedAt) VALUES 
('ORD-2024-001', 1, 1, JSON_ARRAY(JSON_OBJECT('menuItemId', 1, 'name', 'Hyderabadi Chicken Biryani', 'quantity', 2, 'price', 299)), 598.00, 0, 30.00, 60.00, 688.00, 'delivered', 'completed', 'online', JSON_OBJECT('street', '123 Main Street, Koramangala', 'city', 'Bangalore', 'state', 'Karnataka', 'pincode', '560034', 'latitude', 12.9352, 'longitude', 77.6245), 6, 'Extra spicy please', NOW(), NOW()),
('ORD-2024-002', 2, 2, JSON_ARRAY(JSON_OBJECT('menuItemId', 6, 'name', 'Margherita Pizza', 'quantity', 1, 'price', 249)), 249.00, 0, 25.00, 25.00, 299.00, 'delivered', 'completed', 'online', JSON_OBJECT('street', '789 Residential Area, HSR Layout', 'city', 'Bangalore', 'state', 'Karnataka', 'pincode', '560102', 'latitude', 12.9115, 'longitude', 77.6512), 6, NULL, NOW(), NOW()),
('ORD-2024-003', 1, 3, JSON_ARRAY(JSON_OBJECT('menuItemId', 9, 'name', 'Classic Burger', 'quantity', 1, 'price', 199)), 199.00, 0, 20.00, 20.00, 239.00, 'preparing', 'completed', 'online', JSON_OBJECT('street', '123 Main Street, Koramangala', 'city', 'Bangalore', 'state', 'Karnataka', 'pincode', '560034', 'latitude', 12.9352, 'longitude', 77.6245), NULL, 'No onions', NOW(), NOW());

-- ORDER STATUS HISTORY
INSERT INTO order_status_history (orderId, status, notes, createdBy, createdAt) VALUES 
(1, 'pending', 'Order placed', 1, NOW()),
(1, 'confirmed', 'Order confirmed by restaurant', 5, NOW()),
(1, 'preparing', 'Food is being prepared', 5, NOW()),
(1, 'delivered', 'Order delivered successfully', 6, NOW()),
(2, 'pending', 'Order placed', 2, NOW()),
(2, 'delivered', 'Order delivered', 6, NOW()),
(3, 'pending', 'Order placed', 1, NOW()),
(3, 'preparing', 'Food is being prepared', 5, NOW());

-- REVIEWS
INSERT INTO reviews (userId, restaurantId, orderId, rating, comment, images, isVerified, createdAt) VALUES 
(1, 1, 1, 5, 'Amazing biryani! Will order again.', NULL, TRUE, NOW()),
(2, 2, 2, 4, 'Good pizza, fast delivery.', NULL, TRUE, NOW());

-- WALLETS
INSERT INTO wallets (userId, balance, currency, isActive, createdAt, updatedAt) VALUES 
(1, 500.00, 'INR', TRUE, NOW(), NOW()),
(2, 750.00, 'INR', TRUE, NOW(), NOW()),
(3, 0.00, 'INR', TRUE, NOW(), NOW());

-- WALLET TRANSACTIONS
INSERT INTO wallet_transactions (walletId, type, amount, balanceAfter, description, referenceType, referenceId, createdAt) VALUES 
(1, 'credit', 500.00, 500.00, 'Initial wallet balance', 'topup', NULL, NOW()),
(2, 'credit', 750.00, 750.00, 'Initial wallet balance', 'topup', NULL, NOW());

-- COUPONS
INSERT INTO coupons (code, description, discountType, discountValue, minOrderAmount, maxDiscountAmount, validFrom, validUntil, usageLimit, usageCount, isActive, applicableRestaurants, createdAt) VALUES 
('WELCOME20', '20% off on first order', 'percentage', 20.00, 200.00, 100.00, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 100, 0, TRUE, NULL, NOW()),
('FLAT50', 'Flat 50 off on orders above 300', 'fixed', 50.00, 300.00, 50.00, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 50, 0, TRUE, NULL, NOW()),
('BIRYANI20', '20% off on Biryani House', 'percentage', 20.00, 200.00, 80.00, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), 30, 0, TRUE, JSON_ARRAY(1), NOW());

-- NOTIFICATIONS
INSERT INTO notifications (userId, type, title, message, data, isRead, createdAt) VALUES 
(1, 'order', 'Order Delivered', 'Your order ORD-2024-001 has been delivered', JSON_OBJECT('orderId', 1), TRUE, NOW()),
(1, 'promo', 'Special Offer', 'Get 20% off on next order with code WELCOME20', NULL, FALSE, NOW()),
(2, 'order', 'Order Confirmed', 'Your order ORD-2024-002 is being prepared', JSON_OBJECT('orderId', 2), TRUE, NOW());

-- LOYALTY POINTS
INSERT INTO loyalty_points (userId, totalPoints, availablePoints, redeemedPoints, lifetimePoints, tier, createdAt, updatedAt) VALUES 
(1, 550, 550, 0, 550, 'silver', NOW(), NOW()),
(2, 720, 720, 0, 720, 'silver', NOW(), NOW()),
(3, 150, 150, 0, 150, 'bronze', NOW(), NOW()),
(4, 1000, 1000, 0, 1000, 'gold', NOW(), NOW()),
(5, 300, 250, 50, 300, 'bronze', NOW(), NOW()),
(6, 200, 200, 0, 200, 'bronze', NOW(), NOW()),
(7, 50, 50, 0, 50, 'bronze', NOW(), NOW());

-- LOYALTY TRANSACTIONS
INSERT INTO loyalty_transactions (userId, type, points, orderId, description, createdAt) VALUES 
(1, 'earned', 100, 1, 'Points for order ORD-2024-001', NOW()),
(1, 'bonus', 50, NULL, 'Welcome bonus', NOW()),
(2, 'earned', 200, 2, 'Points for order ORD-2024-002', NOW()),
(2, 'bonus', 100, NULL, 'Signup bonus', NOW()),
(3, 'earned', 100, NULL, 'First order bonus', NOW()),
(7, 'bonus', 50, NULL, 'Google signup bonus', NOW());

-- ============================================================================
-- STEP 4: VERIFY DATA
-- ============================================================================

SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'Addresses', COUNT(*) FROM addresses
UNION ALL SELECT 'Restaurants', COUNT(*) FROM restaurants
UNION ALL SELECT 'Menu Categories', COUNT(*) FROM menu_categories
UNION ALL SELECT 'Menu Items', COUNT(*) FROM menu_items
UNION ALL SELECT 'Carts', COUNT(*) FROM carts
UNION ALL SELECT 'Orders', COUNT(*) FROM orders
UNION ALL SELECT 'Order Status History', COUNT(*) FROM order_status_history
UNION ALL SELECT 'Reviews', COUNT(*) FROM reviews
UNION ALL SELECT 'Wallets', COUNT(*) FROM wallets
UNION ALL SELECT 'Coupons', COUNT(*) FROM coupons
UNION ALL SELECT 'Notifications', COUNT(*) FROM notifications
UNION ALL SELECT 'Loyalty Points', COUNT(*) FROM loyalty_points
UNION ALL SELECT 'Loyalty Transactions', COUNT(*) FROM loyalty_transactions;

-- Show test users
SELECT id, name, email, phone, role, isVerified, googleId FROM users ORDER BY id;

SELECT 'SUCCESS! Database reset and seeded correctly.' as message;
