-- Create write_applications table
CREATE TABLE IF NOT EXISTS write_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50),
  location VARCHAR(255) NOT NULL,
  short_bio TEXT NOT NULL,
  areas_of_interest JSON,
  writing_experience TEXT NOT NULL,
  portfolio_url VARCHAR(500),
  social_media_links JSON,
  writing_sample_url VARCHAR(500),
  why_write_for_trendorabay TEXT NOT NULL,
  agree_to_guidelines TINYINT(1) DEFAULT 0,
  status ENUM('pending', 'reviewed', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
