-- Add additional image columns to stories table for multiple featured images
ALTER TABLE stories 
ADD COLUMN featured_image_url_2 VARCHAR(500) AFTER featured_image_url,
ADD COLUMN featured_image_url_3 VARCHAR(500) AFTER featured_image_url_2;
