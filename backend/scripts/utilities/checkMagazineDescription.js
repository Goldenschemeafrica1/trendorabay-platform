import pool from '../config/database.js';

const checkMagazineDescription = async () => {
  try {
    const [rows] = await pool.query('SELECT id, title, description FROM magazines LIMIT 5');
    console.log('Magazines with description:');
    rows.forEach(mag => {
      console.log(`ID: ${mag.id}, Title: ${mag.title}, Description: ${mag.description}`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkMagazineDescription();
