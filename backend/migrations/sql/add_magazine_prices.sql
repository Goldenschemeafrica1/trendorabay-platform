-- Add price fields to magazines table
USE trendorabay;

ALTER TABLE magazines
ADD COLUMN price DECIMAL(10, 2) DEFAULT 9.99,
ADD COLUMN digital_price DECIMAL(10, 2) DEFAULT 9.99,
ADD COLUMN print_price DECIMAL(10, 2) DEFAULT 13.99,
ADD COLUMN subscription_price DECIMAL(10, 2) DEFAULT 99.99;

-- Update existing magazines with default prices
UPDATE magazines SET price = 9.99 WHERE price IS NULL;
UPDATE magazines SET digital_price = 9.99 WHERE digital_price IS NULL;
UPDATE magazines SET print_price = 13.99 WHERE print_price IS NULL;
UPDATE magazines SET subscription_price = 99.99 WHERE subscription_price IS NULL;
