-- Add contributor_id column to stories table
ALTER TABLE stories ADD COLUMN contributor_id INT NULL;

-- Add foreign key constraint
ALTER TABLE stories ADD CONSTRAINT fk_stories_contributor 
FOREIGN KEY (contributor_id) REFERENCES contributors(id) ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX idx_stories_contributor_id ON stories(contributor_id);
