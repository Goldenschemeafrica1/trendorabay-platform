import pool from './database.js';

// Cache for table existence checks
const tableCache = new Map();

/**
 * Check if a table exists in the database
 * Results are cached to avoid repeated SHOW TABLES queries
 */
export const tableExists = async (tableName) => {
  // Return cached result if available
  if (tableCache.has(tableName)) {
    return tableCache.get(tableName);
  }

  try {
    const [result] = await pool.query('SHOW TABLES LIKE ?', [tableName]);
    const exists = result.length > 0;
    tableCache.set(tableName, exists);
    return exists;
  } catch (error) {
    console.error(`Error checking table existence for ${tableName}:`, error);
    return false;
  }
};

/**
 * Validate all required tables at startup
 * This should be called once when the server starts
 */
export const validateTablesAtStartup = async () => {
  const requiredTables = [
    'users',
    'stories',
    'magazines',
    'podcasts',
    'authors',
    'categories',
    'contributors',
    'products',
    'orders',
    'likes',
    'comments',
    'gallery',
    'gallery_likes',
    'login_attempts',
    'advertisement_inquiries',
    'pitch_submissions',
    'podcast_guest_applications',
    'events',
    'team_members',
    'partners'
  ];

  console.log('Validating required tables...');
  const missingTables = [];

  for (const table of requiredTables) {
    try {
      const [result] = await pool.query('SHOW TABLES LIKE ?', [table]);
      const exists = result.length > 0;
      tableCache.set(table, exists);
      
      if (!exists) {
        missingTables.push(table);
        console.warn(`⚠️  Table missing: ${table}`);
      } else {
        console.log(`✅ Table exists: ${table}`);
      }
    } catch (error) {
      console.error(`❌ Error checking table ${table}:`, error.message);
      missingTables.push(table);
    }
  }

  if (missingTables.length > 0) {
    console.warn(`⚠️  ${missingTables.length} tables are missing. Some features may not work.`);
  } else {
    console.log('✅ All required tables validated successfully');
  }

  return { missingTables, allValid: missingTables.length === 0 };
};

/**
 * Get cached table existence status
 */
export const getTableStatus = (tableName) => {
  return tableCache.get(tableName) ?? false;
};
