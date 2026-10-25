import pool from '../config/database.js';

const indexes = [
  // Stories indexes
  'CREATE INDEX IF NOT EXISTS idx_stories_status_display_section ON stories(status, display_section)',
  'CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC)',
  'CREATE INDEX IF NOT EXISTS idx_stories_category_id ON stories(category_id)',
  'CREATE INDEX IF NOT EXISTS idx_stories_author_id ON stories(author_id)',
  'CREATE INDEX IF NOT EXISTS idx_stories_featured ON stories(featured)',
  'CREATE INDEX IF NOT EXISTS idx_stories_slug ON stories(slug)',
  
  // Opportunities indexes
  'CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(status)',
  'CREATE INDEX IF NOT EXISTS idx_opportunities_category ON opportunities(category)',
  'CREATE INDEX IF NOT EXISTS idx_opportunities_created_at ON opportunities(created_at DESC)',
  'CREATE INDEX IF NOT EXISTS idx_opportunities_featured ON opportunities(featured)',
  
  // Magazines indexes
  'CREATE INDEX IF NOT EXISTS idx_magazines_category_id ON magazines(category_id)',
  'CREATE INDEX IF NOT EXISTS idx_magazines_created_at ON magazines(created_at DESC)',
  'CREATE INDEX IF NOT EXISTS idx_magazines_featured ON magazines(featured)',
  
  // Communities indexes
  'CREATE INDEX IF NOT EXISTS idx_communities_category ON communities(category)',
  'CREATE INDEX IF NOT EXISTS idx_communities_status ON communities(status)',
  'CREATE INDEX IF NOT EXISTS idx_communities_slug ON communities(slug)',
  
  // Community posts indexes
  'CREATE INDEX IF NOT EXISTS idx_community_posts_community_id ON community_posts(community_id)',
  'CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC)',
  
  // Community discussions indexes
  'CREATE INDEX IF NOT EXISTS idx_community_discussions_community_id ON community_discussions(community_id)',
  'CREATE INDEX IF NOT EXISTS idx_community_discussions_created_at ON community_discussions(created_at DESC)',
];

async function addIndexes() {
  console.log('Adding performance indexes...');
  
  for (let i = 0; i < indexes.length; i++) {
    try {
      await pool.query(indexes[i]);
      console.log(`✓ Index ${i + 1}/${indexes.length} created`);
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME' || error.code === 'ER_KEY_FILE_EXISTS') {
        console.log(`- Index ${i + 1}/${indexes.length} already exists`);
      } else {
        console.error(`✗ Index ${i + 1}/${indexes.length} failed:`, error.message);
      }
    }
  }
  
  console.log('Performance indexes migration completed');
  process.exit(0);
}

addIndexes().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
