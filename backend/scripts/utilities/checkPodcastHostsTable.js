import pool from '../config/database.js';

const checkPodcastHostsTable = async () => {
  try {
    // Check table structure
    const [columns] = await pool.query('DESCRIBE podcast_hosts');
    console.log('podcast_hosts table structure:');
    columns.forEach(col => {
      console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });
    
    // Get all data
    const [rows] = await pool.query('SELECT * FROM podcast_hosts');
    console.log(`\nTotal podcast hosts: ${rows.length}`);
    console.log('\nAll podcast hosts:');
    console.log(JSON.stringify(rows, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking podcast hosts table:', error);
    process.exit(1);
  }
};

checkPodcastHostsTable();
