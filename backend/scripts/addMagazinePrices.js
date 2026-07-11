import pool from '../config/database.js';

const addPriceColumns = async () => {
  try {
    console.log('Adding price columns to magazines table...');
    
    // Add price columns
    await pool.query(`
      ALTER TABLE magazines
      ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) DEFAULT 9.99,
      ADD COLUMN IF NOT EXISTS digital_price DECIMAL(10, 2) DEFAULT 9.99,
      ADD COLUMN IF NOT EXISTS print_price DECIMAL(10, 2) DEFAULT 13.99,
      ADD COLUMN IF NOT EXISTS subscription_price DECIMAL(10, 2) DEFAULT 99.99
    `);
    
    console.log('Price columns added successfully!');
    
    // Update existing magazines with default prices
    await pool.query(`
      UPDATE magazines 
      SET price = 9.99, 
          digital_price = 9.99, 
          print_price = 13.99, 
          subscription_price = 99.99 
      WHERE price IS NULL 
         OR digital_price IS NULL 
         OR print_price IS NULL 
         OR subscription_price IS NULL
    `);
    
    console.log('Existing magazines updated with default prices!');
    
    // Verify the columns were added
    const [columns] = await pool.query(`
      SHOW COLUMNS FROM magazines LIKE '%price%'
    `);
    console.log('Price columns in database:', columns.map(col => col.Field));
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding price columns:', error);
    process.exit(1);
  }
};

addPriceColumns();
