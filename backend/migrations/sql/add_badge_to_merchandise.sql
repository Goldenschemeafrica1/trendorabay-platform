-- Add badge and badge_color columns to merchandise table
USE trendorabay;

ALTER TABLE merchandise 
ADD COLUMN badge VARCHAR(100) DEFAULT NULL,
ADD COLUMN badge_color VARCHAR(50) DEFAULT NULL;
