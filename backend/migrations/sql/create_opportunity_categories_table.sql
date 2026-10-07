-- Create opportunity categories table
CREATE TABLE IF NOT EXISTS opportunity_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert the new categories
INSERT INTO opportunity_categories (name, slug, description, icon, color) VALUES
('Jobs', 'jobs', 'Full-time and part-time job opportunities', '💼', '#a05a00'),
('Internships', 'internships', 'Internship programs for students and graduates', '🎓', '#0a5a8a'),
('Scholarships', 'scholarships', 'Scholarship opportunities for education', '📚', '#8a0a4a'),
('Grants', 'grants', 'Funding grants for projects and initiatives', '💰', '#1a7a3c'),
('Fellowships', 'fellowships', 'Fellowship programs for professionals', '🤝', '#4a8a0a'),
('Competitions', 'competitions', 'Competitions and challenges', '🏆', '#8a5a0a'),
('Events', 'events', 'Conferences, workshops and events', '📅', '#0a4a8a'),
('Training', 'training', 'Training programs and workshops', '📖', '#6a0a8a'),
('Courses', 'courses', 'Online and offline courses', '🎓', '#0a8a4a'),
('Volunteering', 'volunteering', 'Volunteer opportunities', '❤️', '#8a0a0a');

-- Add index on slug for faster lookups
CREATE INDEX idx_opportunity_categories_slug ON opportunity_categories(slug);
