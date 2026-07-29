import mysql from 'mysql2/promise';
import 'dotenv/config';

// Run performance indexes migration
const runMigration = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'trendorabay',
    multipleStatements: true,
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
    } : false
  });

  try {
    console.log('Running performance indexes migration...');

    // Read and execute the SQL file
    const fs = await import('fs');
    const path = await import('path');
    const sqlFile = path.join(process.cwd(), 'database', 'add_performance_indexes.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    await connection.query(sql);
    console.log('✅ Performance indexes created successfully!');
    console.log('Your database queries should now be significantly faster.');
  } catch (error) {
    console.error('❌ Error running migration:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
};

runMigration().catch(console.error);
