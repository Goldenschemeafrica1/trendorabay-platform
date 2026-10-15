-- Migration: Add country column to users table
-- Run this migration to add country field for user registration

ALTER TABLE users
ADD COLUMN IF NOT EXISTS country VARCHAR(10) DEFAULT 'KE' AFTER last_name;
