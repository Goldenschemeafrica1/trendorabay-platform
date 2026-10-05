-- Add badge columns to merchandise table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS badge VARCHAR(100) DEFAULT NULL;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS badge_color VARCHAR(50) DEFAULT NULL;
