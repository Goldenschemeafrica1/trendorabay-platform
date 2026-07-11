import pool from '../../config/database.js';

async function addVideoUrlColumn() {
  try {
    const connection = await pool.getConnection();
    
    // Check if column already exists
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'podcasts' 
      AND COLUMN_NAME = 'video_file_url'
      AND TABLE_SCHEMA = DATABASE()
    `);
    
    if (columns.length > 0) {
      console.log('Column video_file_url already exists in podcasts table');
      connection.release();
      return;
    }
    
    // Add the column
    await connection.query(`
      ALTER TABLE podcasts 
      ADD COLUMN video_file_url VARCHAR(500) AFTER audio_file_url
    `);
    
    console.log('Successfully added video_file_url column to podcasts table');
    connection.release();
  } catch (error) {
    console.error('Error adding video_file_url column:', error);
    throw error;
  }
}

addVideoUrlColumn()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
