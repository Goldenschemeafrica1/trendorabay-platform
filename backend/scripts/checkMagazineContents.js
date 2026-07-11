import pool from '../config/database.js';

const checkMagazineContents = async () => {
  try {
    const [rows] = await pool.query('SELECT id, title, table_of_contents, contributors FROM magazines LIMIT 5');
    console.log('Magazines with contents:');
    rows.forEach(mag => {
      console.log(`ID: ${mag.id}, Title: ${mag.title}`);
      console.log(`Table of Contents: ${mag.table_of_contents}`);
      console.log(`Contributors: ${mag.contributors}`);
      console.log('---');
    });
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkMagazineContents();
