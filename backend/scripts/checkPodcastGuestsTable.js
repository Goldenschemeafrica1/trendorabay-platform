import pool from '../config/database.js';

const checkPodcastGuestsTable = async () => {
  try {
    // Check if podcast_guests table exists
    const [tables] = await pool.query("SHOW TABLES LIKE 'podcast_%'");
    console.log('Podcast-related tables:', tables.map(t => Object.values(t)[0]));
    
    // Check if podcast_guests table exists and its structure
    try {
      const [columns] = await pool.query('DESCRIBE podcast_guests');
      console.log('\npodcast_guests table structure:');
      columns.forEach(col => {
        console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
      });
      
      // Get sample data
      const [rows] = await pool.query('SELECT * FROM podcast_guests LIMIT 5');
      console.log('\nSample data:');
      console.log(JSON.stringify(rows, null, 2));
    } catch (error) {
      console.log('\npodcast_guests table does not exist');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking podcast guests table:', error);
    process.exit(1);
  }
};

checkPodcastGuestsTable();
