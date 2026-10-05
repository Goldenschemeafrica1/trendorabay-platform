-- Add views column to stories table
ALTER TABLE stories ADD COLUMN views INT DEFAULT 0 AFTER featured;
