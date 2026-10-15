-- Performance optimization indexes for Trendorabay database
-- This migration adds critical indexes to improve query performance

-- Stories table - add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_stories_status_created_at ON stories(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_status_featured_created_at ON stories(status, featured, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_display_section_status ON stories(display_section, status);
CREATE INDEX IF NOT EXISTS idx_stories_author_id_status ON stories(author_id, status);
CREATE INDEX IF NOT EXISTS idx_stories_category_id_status ON stories(category_id, status);

-- Optimize slug lookups (faster than full table scan)
CREATE INDEX IF NOT EXISTS idx_stories_slug_status ON stories(slug, status);

-- Views ordering index for popular stories
CREATE INDEX IF NOT EXISTS idx_stories_views_status ON stories(views DESC, status);

-- Magazines table - add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_magazines_status_created_at ON magazines(published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_magazines_category_id ON magazines(category_id);
CREATE INDEX IF NOT EXISTS idx_magazines_slug_status ON magazines(slug, published);

-- Opportunities table - add indexes for filtering and sorting
CREATE INDEX IF NOT EXISTS idx_opportunities_status_created_at ON opportunities(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_opportunities_category_status ON opportunities(category, status);
CREATE INDEX IF NOT EXISTS idx_opportunities_featured_status ON opportunities(featured, status);
CREATE INDEX IF NOT EXISTS idx_opportunities_country_status ON opportunities(country, status);
CREATE INDEX IF NOT EXISTS idx_opportunities_type_status ON opportunities(opportunity_type, status);
CREATE INDEX IF NOT EXISTS idx_opportunities_slug_status ON opportunities(slug, status);

-- Authors table - add index for name lookups
CREATE INDEX IF NOT EXISTS idx_authors_name ON authors(name);

-- Categories table - add index for slug lookups
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Communities table - optimize member_count sorting
CREATE INDEX IF NOT EXISTS idx_communities_member_count_status ON communities(member_count DESC, status);

-- Contributors table - optimize featured/active queries
CREATE INDEX IF NOT EXISTS idx_contributors_featured_status ON contributors(featured, status, created_at DESC);

-- Podcasts table - add indexes for filtering
CREATE INDEX IF NOT EXISTS idx_podcasts_published_created_at ON podcasts(published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_podcasts_category_published ON podcasts(category, published);

-- Likes table - optimize likeable lookups
CREATE INDEX IF NOT EXISTS idx_likes_likeable_type_id_created ON likes(likeable_type, likeable_id, created_at DESC);

-- Comments table - optimize commentable lookups
CREATE INDEX IF NOT EXISTS idx_comments_commentable_type_id_status ON comments(commentable_type, commentable_id, status, created_at DESC);

-- Gallery table - optimize status and category queries
CREATE INDEX IF NOT EXISTS idx_gallery_status_category_created ON gallery(status, category, created_at DESC);
