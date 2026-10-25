CREATE TABLE IF NOT EXISTS saved_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  item_type VARCHAR(50) NOT NULL,
  item_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  source VARCHAR(255),
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_type (item_type),
  UNIQUE KEY unique_user_item (user_id, item_type, item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
