-- FoodZap MySQL Database Schema
-- Run this to create all tables

CREATE DATABASE IF NOT EXISTS foodzap CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE foodzap;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    role ENUM('customer', 'admin', 'restaurant_owner', 'delivery_partner') DEFAULT 'customer',
    isActive BOOLEAN DEFAULT TRUE,
    isVerified BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
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
CREATE TABLE IF NOT EXISTS restaurants (
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
CREATE TABLE IF NOT EXISTS menu_categories (
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
CREATE TABLE IF NOT EXISTS menu_items (
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
CREATE TABLE IF NOT EXISTS carts (
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
CREATE TABLE IF NOT EXISTS orders (
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
CREATE TABLE IF NOT EXISTS order_status_history (
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
CREATE TABLE IF NOT EXISTS reviews (
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
CREATE TABLE IF NOT EXISTS wallets (
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
CREATE TABLE IF NOT EXISTS wallet_transactions (
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
CREATE TABLE IF NOT EXISTS coupons (
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

-- User Coupons (used coupons tracking)
CREATE TABLE IF NOT EXISTS user_coupons (
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
CREATE TABLE IF NOT EXISTS subscriptions (
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
CREATE TABLE IF NOT EXISTS notifications (
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

-- Delivery Partner Locations (for tracking)
CREATE TABLE IF NOT EXISTS delivery_locations (
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

-- Insert sample data (optional)
-- INSERT INTO users (name, email, phone, password, role) VALUES 
-- ('Admin User', 'admin@foodzap.com', '9999999999', '$2b$10$...', 'admin');

