-- Add indexes to optimize story queries
-- These indexes will significantly improve query performance

-- Index on slug for fast story lookups by slug
CREATE INDEX IF NOT EXISTS idx_stories_slug ON stories(slug);

-- Index on status for filtering published stories
CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status);

-- Index on featured for filtering featured stories
CREATE INDEX IF NOT EXISTS idx_stories_featured ON stories(featured);

-- Index on created_at for ordering by date
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);

-- Index on category_id for filtering by category
CREATE INDEX IF NOT EXISTS idx_stories_category_id ON stories(category_id);

-- Index on author_id for filtering by author
CREATE INDEX IF NOT EXISTS idx_stories_author_id ON stories(author_id);

-- Composite index for published stories ordered by date (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_stories_status_created_at ON stories(status, created_at DESC);

-- Composite index for featured published stories
CREATE INDEX IF NOT EXISTS idx_stories_featured_status ON stories(featured, status);

-- Index on likes table for story_id
CREATE INDEX IF NOT EXISTS idx_likes_story_id ON likes(story_id);

-- Index on comments table for story_id
CREATE INDEX IF NOT EXISTS idx_comments_story_id ON comments(story_id);
