import pool from '../config/database.js';

const indexes = [
  // Stories table - add composite indexes for common query patterns
  'CREATE INDEX IF NOT EXISTS idx_stories_status_created_at ON stories(status, created_at DESC)',
  'CREATE INDEX IF NOT EXISTS idx_stories_status_featured_created_at ON stories(status, featured, created_at DESC)',
  'CREATE INDEX IF NOT EXISTS idx_stories_display_section_status ON stories(display_section, status)',
  'CREATE INDEX IF NOT EXISTS idx_stories_author_id_status ON stories(author_id, status)',
  'CREATE INDEX IF NOT EXISTS idx_stories_category_id_status ON stories(category_id, status)',
  'CREATE INDEX IF NOT EXISTS idx_stories_slug_status ON stories(slug, status)',
  'CREATE INDEX IF NOT EXISTS idx_stories_views_status ON stories(views DESC, status)',

  // Magazines table - add indexes for frequently queried columns
  'CREATE INDEX IF NOT EXISTS idx_magazines_created_at ON magazines(created_at DESC)',
  'CREATE INDEX IF NOT EXISTS idx_magazines_category_id ON magazines(category_id)',
  'CREATE INDEX IF NOT EXISTS idx_magazines_slug ON magazines(slug)',

  // Opportunities table - add indexes for filtering and sorting
  'CREATE INDEX IF NOT EXISTS idx_opportunities_status_created_at ON opportunities(status, created_at DESC)',
  'CREATE INDEX IF NOT EXISTS idx_opportunities_category_status ON opportunities(category, status)',
  'CREATE INDEX IF NOT EXISTS idx_opportunities_featured_status ON opportunities(featured, status)',
  'CREATE INDEX IF NOT EXISTS idx_opportunities_country_status ON opportunities(country, status)',
  'CREATE INDEX IF NOT EXISTS idx_opportunities_type_status ON opportunities(opportunity_type, status)',
  'CREATE INDEX IF NOT EXISTS idx_opportunities_slug_status ON opportunities(slug, status)',

  // Authors table - add index for name lookups
  'CREATE INDEX IF NOT EXISTS idx_authors_name ON authors(name)',

  // Categories table - add index for slug lookups
  'CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug)',

  // Communities table - optimize member_count sorting
  'CREATE INDEX IF NOT EXISTS idx_communities_member_count_status ON communities(member_count DESC, status)',

  // Contributors table - optimize featured/active queries
  'CREATE INDEX IF NOT EXISTS idx_contributors_featured_status ON contributors(featured, status, created_at DESC)',

  // Podcasts table - add indexes for filtering
  'CREATE INDEX IF NOT EXISTS idx_podcasts_status_created_at ON podcasts(status, created_at DESC)',
  'CREATE INDEX IF NOT EXISTS idx_podcasts_category_id_status ON podcasts(category_id, status)',

  // Likes table - optimize lookups by story/podcast/magazine
  'CREATE INDEX IF NOT EXISTS idx_likes_story_id ON likes(story_id)',
  'CREATE INDEX IF NOT EXISTS idx_likes_podcast_id ON likes(podcast_id)',
  'CREATE INDEX IF NOT EXISTS idx_likes_magazine_id ON likes(magazine_id)',
  'CREATE INDEX IF NOT EXISTS idx_likes_user_id_created ON likes(user_id, created_at DESC)',

  // Comments table - optimize story lookups
  'CREATE INDEX IF NOT EXISTS idx_comments_story_id ON comments(story_id)',
  'CREATE INDEX IF NOT EXISTS idx_comments_user_id_created ON comments(user_id, created_at DESC)',

  // Gallery table - optimize category and featured queries
  'CREATE INDEX IF NOT EXISTS idx_gallery_category_featured ON gallery(category, featured, created_at DESC)',
];

async function runIndexes() {
  console.log('🚀 Creating performance indexes...\n');

  for (let i = 0; i < indexes.length; i++) {
    const sql = indexes[i];
    try {
      await pool.query(sql);
      console.log(`✅ ${i + 1}/${indexes.length}: ${sql.substring(0, 80)}...`);
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME' || error.message.includes('Duplicate key name')) {
        console.log(`⏭️  ${i + 1}/${indexes.length}: Index already exists - ${sql.substring(0, 80)}...`);
      } else {
        console.error(`❌ ${i + 1}/${indexes.length}: ${error.message}`);
        console.error(`   SQL: ${sql}`);
      }
    }
  }

  console.log('\n✅ Performance index creation completed');
  process.exit(0);
}

runIndexes().catch(error => {
  console.error('❌ Failed to create indexes:', error);
  process.exit(1);
});
