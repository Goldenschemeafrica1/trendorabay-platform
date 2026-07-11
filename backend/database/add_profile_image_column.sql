-- Migration: Add profile_image column to users table
-- Run this migration to add the missing profile_image column to existing databases

USE trendorabay;

-- Add profile_image column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500) AFTER last_name;
