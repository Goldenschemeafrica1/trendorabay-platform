-- Add detailed magazine fields to the magazines table
USE trendorabay;

ALTER TABLE magazines
ADD COLUMN IF NOT EXISTS pages INT DEFAULT 100,
ADD COLUMN IF NOT EXISTS language VARCHAR(50) DEFAULT 'English',
ADD COLUMN IF NOT EXISTS publisher VARCHAR(255) DEFAULT 'Trendorabay',
ADD COLUMN IF NOT EXISTS rating DECIMAL(3, 2) DEFAULT 4.5,
ADD COLUMN IF NOT EXISTS review_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS table_of_contents JSON,
ADD COLUMN IF NOT EXISTS contributors JSON,
ADD COLUMN IF NOT EXISTS reviews JSON,
ADD COLUMN IF NOT EXISTS publish_date DATE;

-- Update existing magazines with default values
UPDATE magazines 
SET pages = 100, 
    language = 'English', 
    publisher = 'Trendorabay',
    rating = 4.5,
    review_count = 0,
    publish_date = created_at
WHERE pages IS NULL 
   OR language IS NULL 
   OR publisher IS NULL 
   OR rating IS NULL 
   OR review_count IS NULL
   OR publish_date IS NULL;
