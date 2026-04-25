-- COMPLETE MYSQL FIX - FoodZap Backend
-- Run this entire file in MySQL Workbench to fix all database issues

-- ============================================================================
-- PART 1: FIX USERS TABLE (Add missing columns for Google Auth)
-- ============================================================================

-- Add googleId column for Google OAuth
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS googleId VARCHAR(255) NULL;

-- Add lastLogin column to track last login time
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS lastLogin TIMESTAMP NULL;

-- Create index for faster Google login lookups
CREATE INDEX IF NOT EXISTS idx_googleId ON users(googleId);

-- ============================================================================
-- PART 2: CREATE LOYALTY POINTS TABLES
-- ============================================================================

-- Loyalty Points Table (stores user points and tier)
CREATE TABLE IF NOT EXISTS loyalty_points (
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

-- Loyalty Transactions Table (history of points earned/redeemed)
CREATE TABLE IF NOT EXISTS loyalty_transactions (
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

-- Indexes for loyalty tables
CREATE INDEX IF NOT EXISTS idx_loyalty_user ON loyalty_points(userId);
CREATE INDEX IF NOT EXISTS idx_loyalty_tier ON loyalty_points(tier);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON loyalty_transactions(userId);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON loyalty_transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON loyalty_transactions(createdAt);

-- ============================================================================
-- PART 3: VERIFY FIX
-- ============================================================================

-- Check users table columns
DESCRIBE users;

-- Check all tables
SHOW TABLES;

-- Success message
SELECT 'Database fix completed successfully!' AS message;
