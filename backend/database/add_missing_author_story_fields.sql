-- Add role column to authors table
ALTER TABLE authors ADD COLUMN IF NOT EXISTS role VARCHAR(100) DEFAULT 'Author';

-- Add read_time column to stories table
ALTER TABLE stories ADD COLUMN IF NOT EXISTS read_time VARCHAR(50) DEFAULT '5 min read';

-- Add views column to stories table
ALTER TABLE stories ADD COLUMN IF NOT EXISTS views INT DEFAULT 0;
