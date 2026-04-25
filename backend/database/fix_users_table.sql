-- Fix Users Table - Add Missing Columns
-- Run this in MySQL Workbench or MySQL CLI

-- Check if columns exist, add if missing
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS googleId VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS isVerified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS lastLogin TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS isActive BOOLEAN DEFAULT TRUE;

-- Create index for googleId (for faster Google login lookup)
CREATE INDEX IF NOT EXISTS idx_googleId ON users(googleId);

-- Verify columns added
DESCRIBE users;
