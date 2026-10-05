-- Add additional image columns to stories table for multiple featured images
-- Run this SQL in your MySQL client to add the missing columns

-- Add second image column
ALTER TABLE stories 
ADD COLUMN featured_image_url_2 VARCHAR(500) AFTER featured_image_url;

-- Add third image column  
ALTER TABLE stories 
ADD COLUMN featured_image_url_3 VARCHAR(500) AFTER featured_image_url_2;

-- Add fourth image column
ALTER TABLE stories 
ADD COLUMN featured_image_url_4 VARCHAR(500) AFTER featured_image_url_3;
