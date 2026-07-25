import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('Starting database migration...');
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '../database/migrations/add_performance_indexes.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolon to get individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        await pool.query(statement);
        console.log(`✓ Statement ${i + 1} executed successfully`);
      } catch (error) {
        // Ignore duplicate index errors (index already exists)
        if (error.code === 'ER_DUP_KEYNAME' || error.code === 'ER_DUP_INDEX') {
          console.log(`⊘ Statement ${i + 1} skipped (index already exists)`);
        } else {
          console.error(`✗ Statement ${i + 1} failed:`, error.message);
          throw error;
        }
      }
    }
    
    console.log('✅ Migration completed successfully!');
    console.log('Performance indexes have been applied to the database.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
