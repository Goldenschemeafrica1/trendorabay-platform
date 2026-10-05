-- Add user_id column to orders table if it doesn't exist
USE trendorabay;

-- Check if column exists, if not add it
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS user_id INT AFTER id;

-- Add foreign key constraint if it doesn't exist
ALTER TABLE orders 
ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
