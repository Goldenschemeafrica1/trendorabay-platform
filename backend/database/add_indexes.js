import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const addIndexes = async () => {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'trendorabay',
      ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
      } : false
    });

    console.log('Adding performance indexes...');

    const indexes = [
      // Stories table indexes
      'CREATE INDEX idx_stories_status ON stories(status)',
      'CREATE INDEX idx_stories_category_id ON stories(category_id)',
      'CREATE INDEX idx_stories_author_id ON stories(author_id)',
      'CREATE INDEX idx_stories_featured ON stories(featured)',
      'CREATE INDEX idx_stories_published_at ON stories(published_at)',
      'CREATE INDEX idx_stories_created_at ON stories(created_at)',
      'CREATE INDEX idx_stories_status_featured ON stories(status, featured)',
      'CREATE INDEX idx_stories_slug ON stories(slug)',
      
      // Podcasts table indexes
      'CREATE INDEX idx_podcasts_status ON podcasts(status)',
      'CREATE INDEX idx_podcasts_category_id ON podcasts(category_id)',
      'CREATE INDEX idx_podcasts_trending ON podcasts(trending)',
      'CREATE INDEX idx_podcasts_published_at ON podcasts(published_at)',
      'CREATE INDEX idx_podcasts_series ON podcasts(series)',
      'CREATE INDEX idx_podcasts_status_trending ON podcasts(status, trending)',
      
      // Contributors table indexes
      'CREATE INDEX idx_contributors_status ON contributors(status)',
      'CREATE INDEX idx_contributors_featured ON contributors(featured)',
      'CREATE INDEX idx_contributors_created_at ON contributors(created_at)',
      
      // Magazines table indexes
      'CREATE INDEX idx_magazines_created_at ON magazines(created_at)',
      'CREATE INDEX idx_magazines_slug ON magazines(slug)',
      
      // Contributor follows table indexes
      'CREATE INDEX idx_contributor_follows_contributor_id ON contributor_follows(contributor_id)',
      'CREATE INDEX idx_contributor_follows_user_id ON contributor_follows(user_id)',
      'CREATE INDEX idx_contributor_follows_unique ON contributor_follows(user_id, contributor_id)',
    ];

    for (const index of indexes) {
      try {
        await pool.query(index);
        console.log(`✅ Created: ${index}`);
      } catch (error) {
        if (error.code === 'ER_DUP_KEYNAME' || error.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  Already exists: ${index}`);
        } else if (error.code === 'ER_NO_SUCH_TABLE') {
          console.log(`⚠️  Table doesn't exist: ${index}`);
        } else {
          console.error(`❌ Error creating index: ${index}`);
          console.error(`Error code: ${error.code}`);
          console.error(`Error message: ${error.message}`);
          console.error(`Full error:`, error);
        }
      }
    }

    console.log('✅ Performance indexes migration completed');

    await pool.end();
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
};

addIndexes();
