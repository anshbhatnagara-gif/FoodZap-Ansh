-- Loyalty Points System Tables
-- Run this SQL to create loyalty tables in MySQL

-- Main loyalty points table
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
);

-- Loyalty transactions history
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
);

-- Indexes for performance
CREATE INDEX idx_loyalty_user ON loyalty_points(userId);
CREATE INDEX idx_loyalty_tier ON loyalty_points(tier);
CREATE INDEX idx_transactions_user ON loyalty_transactions(userId);
CREATE INDEX idx_transactions_type ON loyalty_transactions(type);
CREATE INDEX idx_transactions_date ON loyalty_transactions(createdAt);

-- Sample tier configuration
-- Bronze: 0-999 points (1x multiplier)
-- Silver: 1000-4999 points (1.25x multiplier)
-- Gold: 5000-9999 points (1.5x multiplier)
-- Platinum: 10000+ points (2x multiplier)

-- Add loyalty points column to orders table (optional)
-- ALTER TABLE orders ADD COLUMN pointsEarned INT DEFAULT 0;
