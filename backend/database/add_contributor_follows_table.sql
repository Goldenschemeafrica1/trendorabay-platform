-- Create contributor_follows table
USE trendorabay;

CREATE TABLE IF NOT EXISTS contributor_follows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  contributor_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_follow (user_id, contributor_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (contributor_id) REFERENCES contributors(id) ON DELETE CASCADE
);
