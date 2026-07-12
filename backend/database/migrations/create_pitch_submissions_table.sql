-- Create pitch_submissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS pitch_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  topic VARCHAR(255),
  pitch_title VARCHAR(500) NOT NULL,
  pitch_description TEXT,
  author_bio TEXT,
  social_media JSON,
  topics_of_interest JSON,
  previous_publications TEXT,
  experience TEXT,
  article_attachment VARCHAR(500),
  status ENUM('pending', 'reviewed', 'accepted', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
