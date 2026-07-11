import pool from '../config/database.js';

const addDetailColumns = async () => {
  try {
    console.log('Adding detail columns to magazines table...');
    
    // Add detail columns
    await pool.query(`
      ALTER TABLE magazines
      ADD COLUMN IF NOT EXISTS pages INT DEFAULT 100,
      ADD COLUMN IF NOT EXISTS language VARCHAR(50) DEFAULT 'English',
      ADD COLUMN IF NOT EXISTS publisher VARCHAR(255) DEFAULT 'Trendorabay',
      ADD COLUMN IF NOT EXISTS rating DECIMAL(3, 2) DEFAULT 4.5,
      ADD COLUMN IF NOT EXISTS review_count INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS table_of_contents JSON,
      ADD COLUMN IF NOT EXISTS contributors JSON,
      ADD COLUMN IF NOT EXISTS reviews JSON,
      ADD COLUMN IF NOT EXISTS publish_date DATE
    `);
    
    console.log('Detail columns added successfully!');
    
    // Update existing magazines with default values
    await pool.query(`
      UPDATE magazines 
      SET pages = 100, 
          language = 'English', 
          publisher = 'Trendorabay',
          rating = 4.5,
          review_count = 0,
          publish_date = created_at
      WHERE pages IS NULL 
         OR language IS NULL 
         OR publisher IS NULL 
         OR rating IS NULL 
         OR review_count IS NULL
         OR publish_date IS NULL
    `);
    
    console.log('Existing magazines updated with default values!');
    
    // Verify the columns were added
    const [columns] = await pool.query(`
      SHOW COLUMNS FROM magazines
    `);
    console.log('All columns in database:', columns.map(col => col.Field));
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding detail columns:', error);
    process.exit(1);
  }
};

addDetailColumns();
