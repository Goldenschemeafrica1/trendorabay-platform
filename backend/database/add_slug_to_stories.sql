-- Add slug column to stories table if it doesn't exist
ALTER TABLE stories ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- Update existing stories to generate slugs from titles
UPDATE stories 
SET slug = LOWER(TRIM(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '/', '-'), '_', '-')))
WHERE slug IS NULL OR slug = '';

-- Ensure slug is unique by appending ID if necessary
UPDATE stories s1
SET slug = CONCAT(s1.slug, '-', s1.id)
WHERE s1.id IN (
    SELECT s2.id FROM stories s2
    WHERE s2.slug IN (
        SELECT slug FROM stories GROUP BY slug HAVING COUNT(*) > 1
    )
);
