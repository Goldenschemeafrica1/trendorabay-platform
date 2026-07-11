-- Add description column to magazines table
USE trendorabay;

ALTER TABLE magazines ADD COLUMN IF NOT EXISTS description TEXT AFTER title;
