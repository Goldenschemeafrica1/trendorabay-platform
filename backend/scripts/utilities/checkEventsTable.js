import pool from '../config/database.js';

const checkEventsTable = async () => {
  try {
    // Check if table exists
    const [tables] = await pool.query("SHOW TABLES LIKE 'events'");
    console.log('Tables found:', tables);

    if (tables.length === 0) {
      console.log('Events table does not exist');
      return;
    }

    // Check table structure
    const [columns] = await pool.query("DESCRIBE events");
    console.log('Events table columns:', columns);

    process.exit(0);
  } catch (error) {
    console.error('Error checking events table:', error);
    process.exit(1);
  }
};

checkEventsTable();
