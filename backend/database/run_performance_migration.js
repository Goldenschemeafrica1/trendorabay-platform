import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const runMigration = async () => {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'trendorabay',
      multipleStatements: true
    });

    console.log('Running performance indexes migration...');

    const migrationPath = path.join(process.cwd(), 'database/migrations/add_performance_indexes.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Remove comments and split into individual statements
    const cleanedSql = sql.split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');
    
    const statements = cleanedSql.split(';').filter(s => s.trim().length > 0);

    for (const statement of statements) {
      try {
        await pool.query(statement);
        console.log(`✅ Executed: ${statement.substring(0, 50)}...`);
      } catch (error) {
        // Skip errors for indexes that already exist or tables that don't exist
        if (error.code === 'ER_DUP_KEYNAME' || error.code === 'ER_TABLE_MISSING_LOCKED' || error.code === 'ER_NO_SUCH_TABLE' || error.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  Skipping (already exists or table missing): ${statement.substring(0, 50)}...`);
        } else {
          console.error('Error executing statement:', error.message);
          console.error('Statement:', statement);
          throw error;
        }
      }
    }

    console.log('✅ Performance indexes migration completed successfully');

    await pool.end();
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
};

runMigration();
