-- Migration: Add country and phone columns to users table
-- Run this migration to add country and phone fields for user registration

-- Add country column if it doesn't exist
ALTER TABLE users
ADD COLUMN IF NOT EXISTS country VARCHAR(10) DEFAULT 'KE' AFTER last_name;

-- Add phone column if it doesn't exist
ALTER TABLE users
ADD COLUMN IF NOT EXISTS phone VARCHAR(20) AFTER country;
