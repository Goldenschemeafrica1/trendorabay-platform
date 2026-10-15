-- Migration: Add phone column to users table
-- Run this migration to add phone field for user registration

ALTER TABLE users
ADD COLUMN IF NOT EXISTS phone VARCHAR(30) AFTER country;
