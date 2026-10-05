import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SQL_DIR = path.join(__dirname, 'sql');

/**
 * Run a specific migration by name
 */
async function runMigration(migrationName) {
  try {
    const migrationFile = path.join(SQL_DIR, migrationName);
    
    if (!fs.existsSync(migrationFile)) {
      console.error(`❌ Migration file not found: ${migrationFile}`);
      process.exit(1);
    }

    const sql = fs.readFileSync(migrationFile, 'utf8');
    console.log(`📜 Running migration: ${migrationName}`);
    
    await pool.query(sql);
    console.log(`✅ Migration completed: ${migrationName}`);
  } catch (error) {
    console.error(`❌ Migration failed: ${migrationName}`);
    console.error(error.message);
    process.exit(1);
  }
}

/**
 * List all available migrations
 */
function listMigrations() {
  if (!fs.existsSync(SQL_DIR)) {
    console.log('No migrations directory found');
    return;
  }

  const files = fs.readdirSync(SQL_DIR).filter(f => f.endsWith('.sql'));
  
  if (files.length === 0) {
    console.log('No SQL migration files found');
    return;
  }

  console.log('Available migrations:');
  files.forEach(file => console.log(`  - ${file}`));
}

/**
 * Run all migrations in order
 */
async function runAllMigrations() {
  if (!fs.existsSync(SQL_DIR)) {
    console.log('No migrations directory found');
    return;
  }

  const files = fs.readdirSync(SQL_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort(); // Run in alphabetical order

  if (files.length === 0) {
    console.log('No SQL migration files found');
    return;
  }

  console.log(`🚀 Running ${files.length} migrations...\n`);

  for (const file of files) {
    await runMigration(file);
    console.log();
  }

  console.log('✅ All migrations completed successfully');
}

// CLI interface
const command = process.argv[2];

switch (command) {
  case 'list':
    listMigrations();
    break;
  case 'run':
    const migrationName = process.argv[3];
    if (!migrationName) {
      console.error('Usage: node migrate.js run <migration-file.sql>');
      process.exit(1);
    }
    runMigration(migrationName).then(() => process.exit(0));
    break;
  case 'all':
    runAllMigrations().then(() => process.exit(0));
    break;
  default:
    console.log('Migration Runner');
    console.log('');
    console.log('Usage:');
    console.log('  node migrate.js list              - List all available migrations');
    console.log('  node migrate.js run <file.sql>    - Run a specific migration');
    console.log('  node migrate.js all               - Run all migrations');
    console.log('');
    listMigrations();
}
