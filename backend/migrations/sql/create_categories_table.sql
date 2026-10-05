-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert categories
INSERT INTO categories (name) VALUES 
('Music'),
('Fashion'),
('Business'),
('Technology'),
('Travel'),
('Lifestyle'),
('Finance'),
('Sports'),
('Art'),
('Food'),
('Health'),
('Automotive')
ON DUPLICATE KEY UPDATE name=name;
