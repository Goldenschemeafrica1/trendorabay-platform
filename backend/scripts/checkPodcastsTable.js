import pool from '../config/database.js';

const checkPodcastsTable = async () => {
  try {
    // Get table structure
    const [columns] = await pool.query('DESCRIBE podcasts');
    console.log('Podcasts table structure:');
    columns.forEach(col => {
      console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });
    
    // Get sample data
    const [rows] = await pool.query('SELECT * FROM podcasts LIMIT 3');
    console.log('\nSample data:');
    console.log(JSON.stringify(rows, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking podcasts table:', error);
    process.exit(1);
  }
};

checkPodcastsTable();
