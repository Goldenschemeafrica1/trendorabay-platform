-- Add profile_image column to users table
USE trendorabay;

-- First drop the column if it exists with wrong size
ALTER TABLE users DROP COLUMN IF EXISTS profile_image;

-- Add profile_image column with TEXT type to handle large base64 strings
ALTER TABLE users 
ADD COLUMN profile_image TEXT AFTER last_name;
