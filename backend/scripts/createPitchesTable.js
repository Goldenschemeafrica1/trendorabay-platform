import pool from '../config/database.js';

const createPitchesTable = async () => {
  try {
    // Create pitch submissions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pitch_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        topic VARCHAR(255),
        pitch_title VARCHAR(500) NOT NULL,
        pitch_description TEXT NOT NULL,
        author_bio TEXT,
        social_media JSON,
        topics_of_interest JSON,
        previous_publications TEXT,
        experience TEXT,
        status ENUM('pending', 'reviewed', 'accepted', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Pitch submissions table created successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error creating pitches table:', error);
    process.exit(1);
  }
};

createPitchesTable();
