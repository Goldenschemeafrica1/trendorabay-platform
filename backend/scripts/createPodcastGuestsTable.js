import pool from '../config/database.js';

const createPodcastGuestsTable = async () => {
  try {
    // Create podcast_guests table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS podcast_guests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        bio TEXT,
        image_url VARCHAR(500),
        episode_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('podcast_guests table created successfully');
    
    // Migrate unique guests from podcasts table
    const [guests] = await pool.query(`
      SELECT DISTINCT guest 
      FROM podcasts 
      WHERE guest IS NOT NULL AND guest != ''
    `);
    
    console.log(`Found ${guests.length} unique guests to migrate`);
    
    // Insert guests into podcast_guests table
    for (const guest of guests) {
      const [existing] = await pool.query(
        'SELECT id FROM podcast_guests WHERE name = ?',
        [guest.guest]
      );
      
      if (existing.length === 0) {
        await pool.query(
          'INSERT INTO podcast_guests (name) VALUES (?)',
          [guest.guest]
        );
        console.log(`Inserted guest: ${guest.guest}`);
      }
    }
    
    // Update episode_count for each guest
    const [allGuests] = await pool.query('SELECT id, name FROM podcast_guests');
    for (const guest of allGuests) {
      const [count] = await pool.query(
        'SELECT COUNT(*) as count FROM podcasts WHERE guest = ?',
        [guest.name]
      );
      await pool.query(
        'UPDATE podcast_guests SET episode_count = ? WHERE id = ?',
        [count[0].count, guest.id]
      );
    }
    
    console.log('\nMigration completed successfully');
    
    // Display the podcast_guests table
    const [rows] = await pool.query('SELECT * FROM podcast_guests');
    console.log('\npodcast_guests table:');
    console.log(JSON.stringify(rows, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating podcast_guests table:', error);
    process.exit(1);
  }
};

createPodcastGuestsTable();
