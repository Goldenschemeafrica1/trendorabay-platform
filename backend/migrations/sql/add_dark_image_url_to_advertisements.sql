-- Add dark mode image URL column to advertisements table
ALTER TABLE advertisements 
ADD COLUMN dark_image_url VARCHAR(500) AFTER mobile_image_url;
