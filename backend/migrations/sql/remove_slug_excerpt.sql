-- Migration to remove slug and excerpt columns from stories table
USE trendorabay;

-- Remove slug column
ALTER TABLE stories DROP COLUMN IF EXISTS slug;

-- Remove excerpt column  
ALTER TABLE stories DROP COLUMN IF EXISTS excerpt;
