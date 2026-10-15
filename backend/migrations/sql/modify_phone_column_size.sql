-- Migration: Modify phone column to accommodate international numbers
-- Run this migration to increase phone column size for international numbers

ALTER TABLE users
MODIFY COLUMN phone VARCHAR(30);
