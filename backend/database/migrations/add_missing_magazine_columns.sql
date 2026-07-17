-- Add missing columns to magazines table for consistency with routes
USE trendorabay;

-- Add cover_image_url column (alias for cover_image)
ALTER TABLE magazines ADD COLUMN IF NOT EXISTS cover_image_url VARCHAR(500) AFTER cover_image;

-- Add category_id column (alias for category)
ALTER TABLE magazines ADD COLUMN IF NOT EXISTS category_id INT AFTER category;

-- Add slug column for URL-friendly identifiers
ALTER TABLE magazines ADD COLUMN IF NOT EXISTS slug VARCHAR(255) AFTER title;

-- Add price columns
ALTER TABLE magazines ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) DEFAULT 9.99;
ALTER TABLE magazines ADD COLUMN IF NOT EXISTS digital_price DECIMAL(10, 2) DEFAULT 9.99;
ALTER TABLE magazines ADD COLUMN IF NOT EXISTS print_price DECIMAL(10, 2) DEFAULT 13.99;
ALTER TABLE magazines ADD COLUMN IF NOT EXISTS subscription_price DECIMAL(10, 2) DEFAULT 99.99;

-- Copy data from old columns to new columns for backward compatibility
UPDATE magazines SET cover_image_url = cover_image WHERE cover_image_url IS NULL AND cover_image IS NOT NULL;
UPDATE magazines SET category_id = CAST(category AS SIGNED) WHERE category_id IS NULL AND category IS NOT NULL AND category REGEXP '^[0-9]+$';

-- Generate slugs from titles for existing magazines
UPDATE magazines SET slug = LOWER(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '/', '-'), '--', '-')) WHERE slug IS NULL;
