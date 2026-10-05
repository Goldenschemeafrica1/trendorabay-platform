-- Migration: Update profile_image column to TEXT type
-- Run this migration to allow longer profile image URLs

USE trendorabay;

-- Update profile_image column to TEXT type
ALTER TABLE users 
MODIFY COLUMN profile_image TEXT;
