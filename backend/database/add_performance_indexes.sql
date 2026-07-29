-- Performance optimization indexes for frequently queried columns
-- Run this migration to improve query performance in production

-- Indexes for magazines table
CREATE INDEX IF NOT EXISTS idx_magazines_slug ON magazines(slug);
CREATE INDEX IF NOT EXISTS idx_magazines_category_id ON magazines(category_id);
CREATE INDEX IF NOT EXISTS idx_magazines_created_at ON magazines(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_magazines_title ON magazines(title);

-- Indexes for stories table
CREATE INDEX IF NOT EXISTS idx_stories_slug ON stories(slug);
CREATE INDEX IF NOT EXISTS idx_stories_category_id ON stories(category_id);
CREATE INDEX IF NOT EXISTS idx_stories_author_id ON stories(author_id);
CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status);
CREATE INDEX IF NOT EXISTS idx_stories_featured ON stories(featured);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_published_at ON stories(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_views ON stories(views DESC);

-- Composite index for stories filtering (common query pattern)
CREATE INDEX IF NOT EXISTS idx_stories_status_created ON stories(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_category_status ON stories(category_id, status, created_at DESC);

-- Indexes for authors table
CREATE INDEX IF NOT EXISTS idx_authors_name ON authors(name);

-- Indexes for contributors table
CREATE INDEX IF NOT EXISTS idx_contributors_status ON contributors(status);

-- Indexes for products table (merchandise)
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Index for login_attempts table (if exists)
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_locked_until ON login_attempts(locked_until);
