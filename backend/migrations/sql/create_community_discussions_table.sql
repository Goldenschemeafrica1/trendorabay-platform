-- Community discussions table
CREATE TABLE IF NOT EXISTS community_discussions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  community_id BIGINT UNSIGNED NOT NULL,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  tag VARCHAR(50),
  views INT UNSIGNED DEFAULT 0,
  status ENUM('active', 'archived', 'deleted') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_community (community_id),
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Community discussion replies table
CREATE TABLE IF NOT EXISTS community_discussion_replies (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  discussion_id BIGINT UNSIGNED NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_discussion (discussion_id),
  INDEX idx_user (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
