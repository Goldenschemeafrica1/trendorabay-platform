import pool from '../config/database.js';

async function checkTableStructure() {
  const tables = ['magazines', 'podcasts', 'likes', 'comments', 'gallery'];

  for (const table of tables) {
    try {
      const [rows] = await pool.query(`DESCRIBE ${table}`);
      console.log(`\n=== ${table.toUpperCase()} ===`);
      rows.forEach(row => {
        console.log(`  ${row.Field}: ${row.Type} ${row.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${row.Key ? `(${row.Key})` : ''}`);
      });
    } catch (error) {
      console.log(`\n=== ${table.toUpperCase()} ===`);
      console.log(`  Error: ${error.message}`);
    }
  }

  process.exit(0);
}

checkTableStructure().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
