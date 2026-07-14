-- Performance optimization indexes
-- Run this migration to improve query performance

-- Stories table indexes
CREATE INDEX idx_stories_status ON stories(status);
CREATE INDEX idx_stories_category_id ON stories(category_id);
CREATE INDEX idx_stories_author_id ON stories(author_id);
CREATE INDEX idx_stories_featured ON stories(featured);
CREATE INDEX idx_stories_published_at ON stories(published_at);
CREATE INDEX idx_stories_created_at ON stories(created_at);
CREATE INDEX idx_stories_status_featured ON stories(status, featured);

-- Podcasts table indexes
CREATE INDEX idx_podcasts_status ON podcasts(status);
CREATE INDEX idx_podcasts_category_id ON podcasts(category_id);
CREATE INDEX idx_podcasts_trending ON podcasts(trending);
CREATE INDEX idx_podcasts_published_at ON podcasts(published_at);
CREATE INDEX idx_podcasts_series ON podcasts(series);
CREATE INDEX idx_podcasts_status_trending ON podcasts(status, trending);

-- Contributors table indexes
CREATE INDEX idx_contributors_status ON contributors(status);
CREATE INDEX idx_contributors_featured ON contributors(featured);
CREATE INDEX idx_contributors_created_at ON contributors(created_at);

-- Magazines table indexes
CREATE INDEX idx_magazines_created_at ON magazines(created_at);

-- Contributor follows table indexes
CREATE INDEX idx_contributor_follows_contributor_id ON contributor_follows(contributor_id);
CREATE INDEX idx_contributor_follows_user_id ON contributor_follows(user_id);
CREATE INDEX idx_contributor_follows_unique ON contributor_follows(user_id, contributor_id);

-- Full-text search indexes for search functionality
CREATE FULLTEXT INDEX ft_stories_title_content ON stories(title, content);
CREATE FULLTEXT INDEX ft_contributors_name_bio ON contributors(name, bio);
CREATE FULLTEXT INDEX ft_magazines_title ON magazines(title);
