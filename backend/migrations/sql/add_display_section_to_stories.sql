-- Add display_section column to stories table
ALTER TABLE stories ADD COLUMN display_section ENUM('featured', 'horizontal', 'must_read', 'text_only') DEFAULT 'featured' AFTER status;
