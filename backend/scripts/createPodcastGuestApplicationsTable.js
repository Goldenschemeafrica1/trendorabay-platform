import pool from '../config/database.js';

const createPodcastGuestApplicationsTable = async () => {
  try {
    // Create podcast_guest_applications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS podcast_guest_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        bio TEXT NOT NULL,
        topic TEXT NOT NULL,
        social_media TEXT,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('podcast_guest_applications table created successfully');
    
    // Display the table structure
    const [rows] = await pool.query('DESCRIBE podcast_guest_applications');
    console.log('\npodcast_guest_applications table structure:');
    console.log(JSON.stringify(rows, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating podcast_guest_applications table:', error);
    process.exit(1);
  }
};

createPodcastGuestApplicationsTable();
