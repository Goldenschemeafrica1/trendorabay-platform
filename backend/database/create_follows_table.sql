-- Create user-author follows table
CREATE TABLE IF NOT EXISTS author_follows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  author_id INT NOT NULL,
  followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_author (user_id, author_id),
  FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_author_id (author_id)
);
