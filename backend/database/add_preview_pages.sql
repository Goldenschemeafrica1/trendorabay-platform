-- Add preview_pages column to magazines table
USE trendorabay;

ALTER TABLE magazines ADD COLUMN preview_pages TEXT AFTER pdf_url;
