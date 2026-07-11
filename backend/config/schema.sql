-- Create database
CREATE DATABASE IF NOT EXISTS trendorabay;
USE trendorabay;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  profile_image TEXT,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Authors table
CREATE TABLE IF NOT EXISTS authors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contributors table
CREATE TABLE IF NOT EXISTS contributors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  bio TEXT,
  role VARCHAR(255),
  role_type VARCHAR(50),
  avatar VARCHAR(500),
  cover_image VARCHAR(500),
  expertise JSON,
  twitter VARCHAR(100),
  instagram VARCHAR(100),
  linkedin VARCHAR(100),
  followers INT DEFAULT 0,
  featured TINYINT(1) DEFAULT 0,
  achievements JSON,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Stories table
CREATE TABLE IF NOT EXISTS stories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT,
  featured_image_url VARCHAR(500),
  author_id INT,
  category_id INT,
  status ENUM('draft', 'published') DEFAULT 'draft',
  featured TINYINT(1) DEFAULT 0,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Magazines table
CREATE TABLE IF NOT EXISTS magazines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image VARCHAR(500),
  category VARCHAR(100),
  issue_number VARCHAR(50),
  pdf_url VARCHAR(500),
  preview_pages TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Podcasts table
CREATE TABLE IF NOT EXISTS podcasts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image VARCHAR(500),
  audio_url VARCHAR(500) NOT NULL,
  video_file_url VARCHAR(500),
  duration INT,
  host VARCHAR(255),
  category VARCHAR(100),
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Merchandise table
CREATE TABLE IF NOT EXISTS merchandise (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(100),
  stock_quantity INT DEFAULT 0,
  sizes VARCHAR(255),
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  items JSON,
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address JSON,
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  order_status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert sample data (optional)
-- Uncomment the lines below to insert sample data

-- INSERT INTO authors (name, bio) VALUES ('John Doe', 'Tech writer and journalist');
-- INSERT INTO authors (name, bio) VALUES ('Jane Smith', 'Culture and lifestyle editor');

-- INSERT INTO magazines (title, description, category, issue_number, published) 
-- VALUES ('Tech Trends 2024', 'Latest technology trends', 'Technology', 'Vol 1', true);

-- INSERT INTO stories (title, content, excerpt, author_id, category, published) 
-- VALUES ('The Future of AI', 'Artificial intelligence is changing everything...', 'AI overview', 1, 'Technology', true);

-- INSERT INTO merchandise (name, description, price, category, stock_quantity, available) 
-- VALUES ('Trendorabay T-Shirt', 'Premium cotton t-shirt', 29.99, 'Clothing', 50, true);
