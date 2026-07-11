import pool from '../config/database.js';

async function createTeamTable() {
  try {
    console.log('Creating team table...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS team (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        avatar VARCHAR(500),
        bio TEXT,
        status VARCHAR(50) DEFAULT 'active',
        email VARCHAR(255),
        linkedin VARCHAR(500),
        twitter VARCHAR(500),
        instagram VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Team table created successfully');

    // Insert sample team members
    await pool.query(`
      INSERT INTO team (name, role, avatar, bio, status) VALUES
      ('Amina Johnson', 'Founder & Editor-in-Chief', '/images/team/amina-johnson.jpg', 'Award-winning journalist with 15+ years of experience covering African culture and development.', 'active'),
      ('Kofi Mensah', 'Creative Director', '/images/team/kofi-mensah.jpg', 'Visual artist and designer specializing in contemporary African aesthetics and brand development.', 'active'),
      ('Zara Patel', 'Community Manager', '/images/team/zara-patel.jpg', 'Community builder passionate about creating inclusive spaces for cultural exchange and dialogue.', 'active'),
      ('David Okafor', 'Business Development', '/images/team/david-okafor.jpg', 'Entrepreneur focused on sustainable business models for creative and cultural enterprises.', 'active')
    `);
    console.log('✓ Sample team members inserted successfully');

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

createTeamTable();
