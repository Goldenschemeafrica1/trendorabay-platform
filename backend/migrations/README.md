# Database Migrations

This directory contains all database migration scripts for the Trendorabay backend.

## Structure

```
migrations/
├── sql/                    # All SQL migration files
│   ├── add_*.sql          # Column additions
│   ├── create_*.sql       # Table creation scripts
│   └── remove_*.sql       # Column removals
├── migrate.js             # Universal migration runner
└── README.md              # This file
```

## Usage

### Using the Universal Migration Runner

```bash
# List all available migrations
node migrations/migrate.js list

# Run a specific migration
node migrations/migrate.js run create_team_table.sql

# Run all migrations in order
node migrations/migrate.js all
```

## Migration Best Practices

1. **Always create a SQL file** for the actual schema changes
2. **Use descriptive names** like `create_table_name.sql` or `add_column_name.sql`
3. **Test migrations** on a development database first
4. **Keep migrations reversible** when possible
5. **Document breaking changes** in migration comments
6. **Use `IF NOT EXISTS`** for safe idempotent migrations

## Available Migrations

### Table Creation
- `create_advertisements_table.sql` - Advertisements table
- `create_advertisement_inquiries_table.sql` - Ad inquiries table
- `create_categories_table.sql` - Categories table
- `create_follows_table.sql` - User follows table
- `create_gallery_table.sql` - Gallery table
- `create_likes_comments_tables.sql` - Likes and comments tables
- `create_login_attempts_table.sql` - Login attempt tracking
- `create_merchandise_table.sql` - Merchandise/products table
- `create_pitch_submissions_table.sql` - Content pitch submissions table
- `create_team_table.sql` - Team members table
- `create_write_applications_table.sql` - Writer applications table

### Column Additions
- `add_article_attachment.sql` - Article attachment column
- `add_badge_columns.sql` - Badge columns for merchandise
- `add_badge_to_merchandise.sql` - Badge column for merchandise
- `add_contributor_follows_table.sql` - Contributor follows table
- `add_contributor_id_to_stories.sql` - Contributor ID in stories
- `add_dark_image_url_to_advertisements.sql` - Dark mode image for ads
- `add_display_section_to_stories.sql` - Display section enum for stories
- `add_magazine_description.sql` - Magazine description column
- `add_magazine_details.sql` - Magazine details columns
- `add_magazine_prices.sql` - Magazine pricing columns
- `add_missing_author_story_fields.sql` - Missing author/story fields
- `add_missing_magazine_columns.sql` - Missing magazine columns
- `add_multiple_story_images.sql` - Multiple story image columns
- `add_performance_indexes.sql` - Performance indexes for all tables
- `add_preview_pages.sql` - Preview pages column
- `add_profile_image_column.sql` - Profile image column
- `add_profile_image_to_users.sql` - Profile image for users
- `add_slug_to_stories.sql` - Slug column for stories
- `add_story_image_columns.sql` - Story image columns
- `add_user_id_to_orders.sql` - User ID in orders
- `add_video_url_to_podcasts.sql` - Video URL for podcasts
- `add_views_to_stories.sql` - View counter for stories

### Column Removals
- `remove_slug_excerpt.sql` - Removed deprecated columns

### Updates
- `update_profile_image_column.sql` - Update profile image column

## Notes

- All SQL files use `CREATE TABLE IF NOT EXISTS` for safety
- Migrations include proper indexing for performance
- Tables use UTF8MB4 character set for full Unicode support
- All tables use InnoDB engine for transaction support
- The migration runner executes SQL files in alphabetical order
- Use `IF NOT EXISTS` to make migrations idempotent and safe to re-run
