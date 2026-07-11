import pool from '../config/database.js';

const createEventsTable = async () => {
  try {
    // Drop existing table if it exists
    await pool.query('DROP TABLE IF EXISTS events');
    console.log('Dropped existing events table');

    // Create events table with correct schema
    await pool.query(`
      CREATE TABLE events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        event_date DATE NOT NULL,
        event_time VARCHAR(50),
        location VARCHAR(255),
        event_type ENUM('In-Person', 'Virtual', 'Hybrid') DEFAULT 'In-Person',
        image_url VARCHAR(500),
        category VARCHAR(100),
        attendees INT DEFAULT 0,
        price VARCHAR(50),
        featured TINYINT(1) DEFAULT 0,
        status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Events table created successfully');

    // Insert sample events
    await pool.query(`
      INSERT INTO events (title, description, event_date, event_time, location, event_type, image_url, category, attendees, price, featured) VALUES
      ('African Tech Summit 2024', 'Join us for the biggest tech gathering in Africa, featuring startups, investors, and industry leaders from across the continent.', '2024-03-15', '9:00 AM - 6:00 PM', 'Nairobi, Kenya', 'Hybrid', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop', 'Technology', 500, 'Free', 1),
      ('Fashion Week Africa', 'Celebrating African fashion designers and showcasing the latest trends from across the continent.', '2024-03-22', '2:00 PM - 8:00 PM', 'Lagos, Nigeria', 'In-Person', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop', 'Fashion', 300, '$25', 0),
      ('Wellness & Mindfulness Workshop', 'A virtual workshop focusing on mental health, traditional African healing practices, and modern wellness techniques.', '2024-03-28', '10:00 AM - 1:00 PM', 'Online', 'Virtual', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop', 'Wellness', 150, 'Free', 0)
    `);
    console.log('Sample events inserted successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error creating events table:', error);
    process.exit(1);
  }
};

createEventsTable();
