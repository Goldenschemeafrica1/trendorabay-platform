-- Add indexes to improve query performance on stories table
-- These indexes will speed up common queries used in the application

-- Index for status and display_section filtering (used in homepage queries)
CREATE INDEX IF NOT EXISTS idx_stories_status_display_section ON stories(status, display_section);

-- Index for created_at ordering (used in most list queries)
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_stories_category_id ON stories(category_id);

-- Index for author filtering
CREATE INDEX IF NOT EXISTS idx_stories_author_id ON stories(author_id);

-- Index for featured stories
CREATE INDEX IF NOT EXISTS idx_stories_featured ON stories(featured);

-- Index for slug lookups
CREATE INDEX IF NOT EXISTS idx_stories_slug ON stories(slug);

-- Index for opportunities table
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_category ON opportunities(category);
CREATE INDEX IF NOT EXISTS idx_opportunities_created_at ON opportunities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_opportunities_featured ON opportunities(featured);

-- Index for magazines table
CREATE INDEX IF NOT EXISTS idx_magazines_category_id ON magazines(category_id);
CREATE INDEX IF NOT EXISTS idx_magazines_created_at ON magazines(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_magazines_is_featured ON magazines(is_featured);

-- Index for communities table
CREATE INDEX IF NOT EXISTS idx_communities_category ON communities(category);
CREATE INDEX IF NOT EXISTS idx_communities_status ON communities(status);
CREATE INDEX IF NOT EXISTS idx_communities_slug ON communities(slug);

-- Index for community_posts table
CREATE INDEX IF NOT EXISTS idx_community_posts_community_id ON community_posts(community_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);

-- Index for community_discussions table
CREATE INDEX IF NOT EXISTS idx_community_discussions_community_id ON community_discussions(community_id);
CREATE INDEX IF NOT EXISTS idx_community_discussions_created_at ON community_discussions(created_at DESC);
