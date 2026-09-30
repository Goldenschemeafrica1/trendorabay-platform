import 'dotenv/config';
import pool from '../config/database.js';

async function addStorySlugTrigger() {
  try {
    console.log('Adding trigger to ensure stories always have slugs...');

    // Drop the trigger if it exists (to avoid errors on re-run)
    try {
      await pool.query('DROP TRIGGER before_story_insert_generate_slug');
    } catch (e) {
      // Trigger doesn't exist, ignore error
    }
    try {
      await pool.query('DROP TRIGGER before_story_update_generate_slug');
    } catch (e) {
      // Trigger doesn't exist, ignore error
    }

    // Create a trigger for INSERT
    await pool.query(`
      CREATE TRIGGER before_story_insert_generate_slug
      BEFORE INSERT ON stories
      FOR EACH ROW
      BEGIN
        IF NEW.slug IS NULL OR NEW.slug = '' THEN
          SET NEW.slug = LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(NEW.title, ' ', '-'), '&', '-'), ',', '-'), ':', '-'), ';', '-'), '!', '-'), '?', '-'), '/', '-'), '\\'', '-'), '"', '-'));
          SET NEW.slug = TRIM(BOTH '-' FROM NEW.slug);
          IF NEW.slug = '' OR NEW.slug IS NULL THEN
            SET NEW.slug = CONCAT('story-', NEW.id);
          END IF;
        END IF;
      END
    `);

    console.log('✓ INSERT trigger created');

    // Create a trigger for UPDATE (in case title changes and slug becomes null)
    await pool.query(`
      CREATE TRIGGER before_story_update_generate_slug
      BEFORE UPDATE ON stories
      FOR EACH ROW
      BEGIN
        IF NEW.slug IS NULL OR NEW.slug = '' THEN
          SET NEW.slug = LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(NEW.title, ' ', '-'), '&', '-'), ',', '-'), ':', '-'), ';', '-'), '!', '-'), '?', '-'), '/', '-'), '\\'', '-'), '"', '-'));
          SET NEW.slug = TRIM(BOTH '-' FROM NEW.slug);
          IF NEW.slug = '' OR NEW.slug IS NULL THEN
            SET NEW.slug = CONCAT('story-', NEW.id);
          END IF;
        END IF;
      END
    `);

    console.log('✓ UPDATE trigger created');
    console.log('\nTriggers added successfully! Stories will now always have slugs.');
  } catch (error) {
    console.error('Error adding triggers:', error.message);
    process.exit(1);
  }
}

addStorySlugTrigger().then(() => {
  console.log('Script completed successfully.');
  process.exit(0);
});
