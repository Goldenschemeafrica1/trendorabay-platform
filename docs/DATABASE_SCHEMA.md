# Database Schema

Complete database schema documentation for the Trendorabay Platform.

## Overview

Trendorabay uses MySQL as its primary database. The schema consists of 17 main tables supporting content management, e-commerce, community features, and business operations.

## Database Configuration

- **Database Name**: `trendorabay`
- **Character Set**: UTF-8
- **Collation**: utf8_general_ci
- **Connection Pool**: 100 connections
- **Connection Timeout**: 60 seconds

## Entity Relationship Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    users    │     │   authors   │     │   stories   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   │                   │
       └───────────────────┴───────────────────┘
                           │
                           │
                  ┌────────┴────────┐
                  │                 │
           ┌──────┴──────┐   ┌─────┴─────┐
           │   orders    │   │  likes    │
           └─────────────┘   └───────────┘
```

## Tables

### users

User accounts and authentication information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| username | VARCHAR(100) | UNIQUE | User's username |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| password | VARCHAR(255) | NOT NULL | Hashed password (bcrypt) |
| first_name | VARCHAR(100) | NULL | User's first name |
| last_name | VARCHAR(100) | NULL | User's last name |
| role | ENUM('user','admin') | DEFAULT 'user' | User role |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update time |

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE KEY (username)
- UNIQUE KEY (email)

**Relationships**:
- One-to-many with orders (user_id → orders.user_id)

---

### authors

Content authors and writers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique author identifier |
| name | VARCHAR(255) | NOT NULL | Author's full name |
| bio | TEXT | NULL | Author biography |
| avatar_url | VARCHAR(500) | NULL | Profile image URL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |

**Indexes**:
- PRIMARY KEY (id)

**Relationships**:
- One-to-many with stories (id → stories.author_id)

---

### contributors

Community contributors with detailed profiles.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique contributor identifier |
| name | VARCHAR(255) | NOT NULL | Contributor's full name |
| email | VARCHAR(255) | UNIQUE | Email address |
| bio | TEXT | NULL | Biography |
| role | VARCHAR(255) | NULL | Role/title |
| role_type | VARCHAR(50) | NULL | Type of role |
| avatar | VARCHAR(500) | NULL | Profile image URL |
| cover_image | VARCHAR(500) | NULL | Cover image URL |
| expertise | JSON | NULL | Areas of expertise |
| twitter | VARCHAR(100) | NULL | Twitter handle |
| instagram | VARCHAR(100) | NULL | Instagram handle |
| linkedin | VARCHAR(100) | NULL | LinkedIn profile |
| followers | INT | DEFAULT 0 | Follower count |
| featured | TINYINT(1) | DEFAULT 0 | Featured flag |
| achievements | JSON | NULL | List of achievements |
| status | ENUM('active','inactive') | DEFAULT 'active' | Account status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update time |

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE KEY (email)

**Relationships**:
- One-to-many with contributor_follows (id → contributor_follows.contributor_id)

---

### categories

Content categorization system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique category identifier |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Category name |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE KEY (name)

**Predefined Categories**:
- Music
- Fashion
- Business
- Technology
- Travel
- Lifestyle
- Finance
- Sports
- Art
- Food
- Health
- Automotive

---

### stories

Blog posts and articles.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique story identifier |
| title | VARCHAR(255) | NOT NULL | Story title |
| content | LONGTEXT | NULL | Story content (HTML/Markdown) |
| featured_image_url | VARCHAR(500) | NULL | Featured image URL |
| author_id | INT | NULL, FOREIGN KEY | Reference to authors |
| category_id | INT | NULL, FOREIGN KEY | Reference to categories |
| status | ENUM('draft','published') | DEFAULT 'draft' | Publication status |
| featured | TINYINT(1) | DEFAULT 0 | Featured flag |
| published_at | TIMESTAMP | NULL | Publication date |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update time |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (author_id)
- INDEX (category_id)
- INDEX (status)
- INDEX (featured)

**Relationships**:
- Many-to-one with authors (author_id → authors.id)
- Many-to-one with categories (category_id → categories.id)
- One-to-many with likes (id → likes.story_id)
- One-to-many with comments (id → comments.story_id)
- One-to-many with shares (id → shares.story_id)

---

### magazines

Digital magazine publications.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique magazine identifier |
| title | VARCHAR(255) | NOT NULL | Magazine title |
| description | TEXT | NULL | Magazine description |
| cover_image | VARCHAR(500) | NULL | Cover image URL |
| category | VARCHAR(100) | NULL | Magazine category |
| issue_number | VARCHAR(50) | NULL | Issue number |
| pdf_url | VARCHAR(500) | NULL | PDF file URL |
| preview_pages | TEXT | NULL | Preview pages URL |
| price | DECIMAL(10,2) | NULL | Magazine price |
| table_of_contents | TEXT | NULL | Table of contents (JSON or text) |
| contributor_ids | TEXT | NULL | Comma-separated contributor IDs |
| published | BOOLEAN | DEFAULT false | Published status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update time |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (category)
- INDEX (published)

---

### podcasts

Audio and video podcast episodes.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique podcast identifier |
| title | VARCHAR(255) | NOT NULL | Podcast title |
| description | TEXT | NULL | Podcast description |
| cover_image | VARCHAR(500) | NULL | Cover image URL |
| audio_url | VARCHAR(500) | NOT NULL | Audio file URL |
| video_file_url | VARCHAR(500) | NULL | Video file URL |
| duration | INT | NULL | Duration in seconds |
| host | VARCHAR(255) | NULL | Host name |
| category | VARCHAR(100) | NULL | Podcast category |
| published | BOOLEAN | DEFAULT false | Published status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update time |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (category)
- INDEX (published)

---

### merchandise

E-commerce product catalog.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique product identifier |
| name | VARCHAR(255) | NOT NULL | Product name |
| description | TEXT | NULL | Product description |
| price | DECIMAL(10,2) | NOT NULL | Product price |
| image_url | VARCHAR(500) | NULL | Product image URL |
| category | VARCHAR(100) | NULL | Product category |
| stock_quantity | INT | DEFAULT 0 | Available stock |
| sizes | VARCHAR(255) | NULL | Available sizes |
| available | BOOLEAN | DEFAULT true | Availability status |
| badge | VARCHAR(50) | NULL | Product badge (New, Sale, etc.) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update time |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (category)
- INDEX (available)

---

### orders

Customer orders and purchases.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique order identifier |
| user_id | INT | NULL, FOREIGN KEY | Reference to users |
| items | JSON | NULL | Order items (JSON array) |
| total_amount | DECIMAL(10,2) | NOT NULL | Total order amount |
| shipping_address | JSON | NULL | Shipping address (JSON) |
| payment_status | ENUM('pending','paid','failed','refunded') | DEFAULT 'pending' | Payment status |
| order_status | ENUM('pending','processing','shipped','delivered','cancelled') | DEFAULT 'pending' | Order status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Order creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update time |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (user_id)
- INDEX (payment_status)
- INDEX (order_status)

**Relationships**:
- Many-to-one with users (user_id → users.id)

---

### likes

User likes on stories.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique like identifier |
| user_id | INT | NULL | User who liked |
| story_id | INT | NULL | Story that was liked |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Like creation time |

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE KEY unique_like (user_id, story_id)

**Relationships**:
- Many-to-one with users (user_id → users.id)
- Many-to-one with stories (story_id → stories.id)

---

### comments

User comments on stories.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique comment identifier |
| user_id | INT | NULL | User who commented |
| story_id | INT | NULL | Story being commented on |
| content | TEXT | NOT NULL | Comment content |
| parent_id | INT | NULL | Parent comment ID (for replies) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Comment creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update time |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (user_id)
- INDEX (story_id)
- INDEX (parent_id)

**Relationships**:
- Many-to-one with users (user_id → users.id)
- Many-to-one with stories (story_id → stories.id)
- Self-referencing (parent_id → comments.id for nested comments)

---

### shares

Story share tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique share identifier |
| story_id | INT | NULL | Story being shared |
| user_id | INT | NULL | User who shared |
| platform | VARCHAR(50) | NULL | Platform (twitter, facebook, etc.) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Share creation time |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (story_id)
- INDEX (user_id)

**Relationships**:
- Many-to-one with stories (story_id → stories.id)
- Many-to-one with users (user_id → users.id)

---

### advertisements

Advertisement management.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique ad identifier |
| title | VARCHAR(255) | NOT NULL | Ad title |
| image_url | VARCHAR(500) | NOT NULL | Ad image URL |
| link_url | VARCHAR(500) | NULL | Destination link |
| position | ENUM('horizontal','vertical','banner') | DEFAULT 'horizontal' | Ad position |
| status | ENUM('active','inactive') | DEFAULT 'active' | Ad status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Ad creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update time |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (position)
- INDEX (status)

---

### contact_messages

Contact form submissions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique message identifier |
| name | VARCHAR(255) | NOT NULL | Sender's name |
| email | VARCHAR(255) | NOT NULL | Sender's email |
| subject | VARCHAR(255) | NULL | Message subject |
| message | TEXT | NOT NULL | Message content |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Message creation time |

**Indexes**:
- PRIMARY KEY (id)

---

### advertisement_inquiries

Advertisement partnership inquiries.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique inquiry identifier |
| name | VARCHAR(255) | NOT NULL | Contact name |
| email | VARCHAR(255) | NOT NULL | Contact email |
| company | VARCHAR(255) | NULL | Company name |
| message | TEXT | NOT NULL | Inquiry message |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Inquiry creation time |

**Indexes**:
- PRIMARY KEY (id)

---

### partnership_proposals

Business partnership proposals.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique proposal identifier |
| name | VARCHAR(255) | NOT NULL | Contact name |
| email | VARCHAR(255) | NOT NULL | Contact email |
| company | VARCHAR(255) | NULL | Company name |
| proposal_type | VARCHAR(50) | NULL | Type of partnership |
| message | TEXT | NOT NULL | Proposal message |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Proposal creation time |

**Indexes**:
- PRIMARY KEY (id)

---

### pitch_submissions

Content pitch submissions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique pitch identifier |
| name | VARCHAR(255) | NOT NULL | Submitter name |
| email | VARCHAR(255) | NOT NULL | Submitter email |
| title | VARCHAR(255) | NOT NULL | Story title |
| category | VARCHAR(100) | NULL | Story category |
| summary | TEXT | NULL | Story summary |
| content | TEXT | NULL | Full pitch content |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Pitch creation time |

**Indexes**:
- PRIMARY KEY (id)

---

### podcast_guests

Podcast guest information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique guest identifier |
| name | VARCHAR(255) | NOT NULL | Guest name |
| bio | TEXT | NULL | Guest biography |
| avatar_url | VARCHAR(500) | NULL | Profile image URL |
| social_media | VARCHAR(255) | NULL | Social media links |
| featured | TINYINT(1) | DEFAULT 0 | Featured flag |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |

**Indexes**:
- PRIMARY KEY (id)

---

### podcast_guest_applications

Podcast guest applications.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique application identifier |
| name | VARCHAR(255) | NOT NULL | Applicant name |
| email | VARCHAR(255) | NOT NULL | Applicant email |
| topic | VARCHAR(255) | NULL | Proposed topic |
| bio | TEXT | NULL | Applicant biography |
| social_media | VARCHAR(255) | NULL | Social media links |
| status | ENUM('pending','approved','rejected') | DEFAULT 'pending' | Application status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Application creation time |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (status)

---

### events

Event management.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique event identifier |
| title | VARCHAR(255) | NOT NULL | Event title |
| description | TEXT | NULL | Event description |
| date | DATE | NULL | Event date |
| time | TIME | NULL | Event time |
| location | VARCHAR(255) | NULL | Event location |
| image_url | VARCHAR(500) | NULL | Event image URL |
| registration_url | VARCHAR(500) | NULL | Registration link |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Event creation time |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (date)

---

### author_follows

Author following system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique follow identifier |
| user_id | INT | NULL | User following |
| author_id | INT | NULL | Author being followed |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Follow creation time |

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE KEY unique_follow (user_id, author_id)

**Relationships**:
- Many-to-one with users (user_id → users.id)
- Many-to-one with authors (author_id → authors.id)

---

### contributor_follows

Contributor following system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique follow identifier |
| user_id | INT | NULL | User following |
| contributor_id | INT | NULL | Contributor being followed |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Follow creation time |

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE KEY unique_follow (user_id, contributor_id)

**Relationships**:
- Many-to-one with users (user_id → users.id)
- Many-to-one with contributors (contributor_id → contributors.id)

---

## Database Relationships

### Primary Relationships

1. **Users → Orders**: One user can have many orders
2. **Authors → Stories**: One author can write many stories
3. **Categories → Stories**: One category can have many stories
4. **Users → Likes**: One user can like many stories
5. **Stories → Likes**: One story can be liked by many users
6. **Users → Comments**: One user can comment on many stories
7. **Stories → Comments**: One story can have many comments
8. **Users → Author Follows**: One user can follow many authors
9. **Users → Contributor Follows**: One user can follow many contributors

### Cascade Rules

- **ON DELETE SET NULL**: Used for foreign keys where related records should remain
- **ON DELETE CASCADE**: Not used to preserve data integrity
- **ON UPDATE CASCADE**: Not used (IDs are never updated)

---

## Data Types

### Common Data Types

- **INT**: Integer numbers (auto-increment for IDs)
- **VARCHAR(n)**: Variable-length strings
- **TEXT**: Large text content
- **LONGTEXT**: Very large text content (for story content)
- **BOOLEAN**: True/false values
- **DECIMAL(10,2)**: Decimal numbers with 2 decimal places (for prices)
- **ENUM**: Enumeration of allowed values
- **TIMESTAMP**: Date and time
- **DATE**: Date only
- **TIME**: Time only
- **JSON**: JSON data (for flexible data structures)

---

## Indexes

### Performance Indexes

- All foreign keys have indexes
- Frequently queried fields (status, category, published) have indexes
- Unique constraints on email and username fields
- Composite indexes for common query patterns

### Index Maintenance

Indexes are automatically maintained by MySQL. Regular maintenance tasks:

```sql
-- Analyze tables for query optimization
ANALYZE TABLE stories;

-- Optimize tables
OPTIMIZE TABLE stories;

-- Check index usage
SHOW INDEX FROM stories;
```

---

## Migration History

### Initial Schema (config/schema.sql)
- Core tables: users, authors, contributors, stories, magazines, podcasts, merchandise, orders

### Database Migrations

1. **create_categories_table.sql** - Added categories table
2. **create_advertisements_table.sql** - Added advertisements table
3. **create_likes_comments_tables.sql** - Added social engagement tables
4. **add_magazine_description.sql** - Added description field to magazines
5. **add_magazine_details.sql** - Added pricing and contributor fields to magazines
6. **add_magazine_prices.sql** - Added price field to magazines
7. **add_preview_pages.sql** - Added preview pages to magazines
8. **add_video_url_to_podcasts.sql** - Added video file URL to podcasts
9. **add_contributor_id_to_stories.sql** - Added contributor relationship to stories
10. **add_user_id_to_orders.sql** - Added user relationship to orders
11. **add_badge_columns.js** - Added badge field to merchandise
12. **add_badge_to_merchandise.sql** - Added badge column to merchandise
13. **add_profile_image_to_users.sql** - Added profile image to users
14. **add_contributor_follows_table.sql** - Added contributor follows table
15. **add_missing_author_story_fields.sql** - Added missing fields to stories
16. **add_article_attachment.sql** - Added attachment support for stories

---

## Backup and Restore

### Backup Database

```bash
# Full backup
mysqldump -u root -p trendorabay > trendorabay_backup_$(date +%Y%m%d).sql

# Backup specific tables
mysqldump -u root -p trendorabay stories magazines > content_backup.sql
```

### Restore Database

```bash
# Restore from backup
mysql -u root -p trendorabay < trendorabay_backup_20240101.sql

# Restore specific tables
mysql -u root -p trendorabay < content_backup.sql
```

### Automated Backup Script

```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u root -p$DB_PASSWORD trendorabay > $BACKUP_DIR/trendorabay_$DATE.sql
# Keep last 7 days of backups
find $BACKUP_DIR -name "trendorabay_*.sql" -mtime +7 -delete
```

---

## Query Optimization

### Common Query Patterns

1. **Get published stories with pagination**
```sql
SELECT s.*, a.name as author_name, c.name as category_name
FROM stories s
LEFT JOIN authors a ON s.author_id = a.id
LEFT JOIN categories c ON s.category_id = c.id
WHERE s.status = 'published'
ORDER BY s.created_at DESC
LIMIT 12 OFFSET 0;
```

2. **Get user's order history**
```sql
SELECT * FROM orders
WHERE user_id = ?
ORDER BY created_at DESC;
```

3. **Search stories**
```sql
SELECT * FROM stories
WHERE title LIKE ? OR content LIKE ?
AND status = 'published'
ORDER BY created_at DESC;
```

### Slow Query Analysis

```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- View slow queries
SELECT * FROM mysql.slow_log;
```

---

## Security Considerations

### Password Security
- User passwords are hashed using bcrypt
- Never store plain text passwords
- Use strong password policies

### SQL Injection Prevention
- Use parameterized queries (prepared statements)
- Never concatenate user input into SQL queries
- Validate and sanitize all inputs

### Data Privacy
- Implement proper access controls
- Log database access for auditing
- Regular security audits

---

## Monitoring and Maintenance

### Database Health Checks

```sql
-- Check connection count
SHOW STATUS LIKE 'Threads_connected';

-- Check database size
SELECT 
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'trendorabay'
GROUP BY table_schema;

-- Check table sizes
SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'trendorabay'
ORDER BY (data_length + index_length) DESC;
```

### Regular Maintenance Tasks

1. **Weekly**: Analyze tables for query optimization
2. **Monthly**: Optimize tables and rebuild indexes
3. **Quarterly**: Review and update indexes based on query patterns
4. **Annually**: Archive old data if needed

---

## Future Enhancements

### Planned Schema Changes

1. **Full-text search index** on stories table for better search performance
2. **Partitioning** large tables (stories, orders) by date
3. **Read replicas** for scaling read operations
4. **Audit logging table** to track data changes
5. **Soft delete implementation** for better data recovery

### Performance Improvements

1. Add composite indexes for complex queries
2. Implement database caching at application level
3. Consider NoSQL for specific use cases (sessions, cache)
4. Implement database sharding for massive scale
