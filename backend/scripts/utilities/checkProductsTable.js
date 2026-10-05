import pool from '../config/database.js';

const checkProductsTable = async () => {
  try {
    // Check if table exists
    const [tables] = await pool.query("SHOW TABLES LIKE 'products'");
    console.log('Tables found:', tables);

    if (tables.length === 0) {
      console.log('Products table does not exist');
      return;
    }

    // Check table structure
    const [columns] = await pool.query("DESCRIBE products");
    console.log('Products table columns:', columns);

    // Check if there's data
    const [rows] = await pool.query("SELECT COUNT(*) as count FROM products");
    console.log('Products count:', rows[0].count);

    // Get sample data
    const [products] = await pool.query("SELECT * FROM products LIMIT 5");
    console.log('Sample products:', products);

    process.exit(0);
  } catch (error) {
    console.error('Error checking products table:', error);
    process.exit(1);
  }
};

checkProductsTable();
