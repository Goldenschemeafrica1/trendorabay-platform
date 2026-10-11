-- Add opportunity categories to the database
-- This migration ensures the categories are available for filtering

-- Insert the new categories if they don't exist
INSERT IGNORE INTO opportunities (title, category, status, short_description, created_at)
VALUES
  ('Jobs Template', 'Jobs', 'draft', 'Template for Jobs category', NOW()),
  ('Internships Template', 'Internships', 'draft', 'Template for Internships category', NOW()),
  ('Scholarships Template', 'Scholarships', 'draft', 'Template for Scholarships category', NOW()),
  ('Grants Template', 'Grants', 'draft', 'Template for Grants category', NOW()),
  ('Fellowships Template', 'Fellowships', 'draft', 'Template for Fellowships category', NOW()),
  ('Competitions Template', 'Competitions', 'draft', 'Template for Competitions category', NOW()),
  ('Events Template', 'Events', 'draft', 'Template for Events category', NOW()),
  ('Training Template', 'Training', 'draft', 'Template for Training category', NOW()),
  ('Courses Template', 'Courses', 'draft', 'Template for Courses category', NOW()),
  ('Volunteering Template', 'Volunteering', 'draft', 'Template for Volunteering category', NOW());

-- Clean up the template entries (optional - remove this if you want to keep them)
-- DELETE FROM opportunities WHERE title LIKE '% Template' AND status = 'draft';
