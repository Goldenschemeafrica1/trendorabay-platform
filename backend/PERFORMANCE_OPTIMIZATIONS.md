# Database Performance Optimizations

This document describes the performance optimizations implemented for the Trendorabay backend.

## Security Overview

**Important**: The query monitoring endpoints are **protected** and require authentication in production. All SQL queries are sanitized before being returned - sensitive data (passwords, tokens, API keys) is never exposed.

## Overview

The following optimizations have been implemented to address slow database queries and improve overall application performance:

1. **Database Indexes** - Added composite indexes for frequently queried columns
2. **Redis Caching** - Implemented caching for frequently accessed data
3. **Query Monitoring** - Added real-time query performance tracking
4. **Missing Table** - Created the missing `gallery_likes` table

## Database Indexes

### Stories Table
- `idx_stories_status_created_at` - Optimizes queries filtering by status and ordering by date
- `idx_stories_status_featured_created_at` - Optimizes featured story queries
- `idx_stories_display_section_status` - Optimizes homepage section queries
- `idx_stories_author_id_status` - Optimizes author-based queries
- `idx_stories_category_id_status` - Optimizes category-based queries
- `idx_stories_slug_status` - Optimizes slug lookups
- `idx_stories_views_status` - Optimizes popular stories queries

### Magazines Table
- `idx_magazines_created_at` - Optimizes ordering by creation date
- `idx_magazines_category_id` - Optimizes category filtering
- `idx_magazines_slug` - Optimizes slug lookups

### Opportunities Table
- `idx_opportunities_status_created_at` - Optimizes status filtering and date ordering
- `idx_opportunities_category_status` - Optimizes category filtering
- `idx_opportunities_featured_status` - Optimizes featured queries
- `idx_opportunities_country_status` - Optimizes country filtering
- `idx_opportunities_type_status` - Optimizes opportunity type filtering
- `idx_opportunities_slug_status` - Optimizes slug lookups

### Other Tables
- Authors, Categories, Communities, Contributors, Podcasts, Likes, Comments, Gallery - Added indexes for common query patterns

## Redis Caching

### Cache Strategy

Caching is implemented at two levels:

1. **Middleware Level** - HTTP response caching using `cache()` middleware
2. **Service Level** - Data caching within service methods

### Cached Endpoints

#### Stories
- `/api/stories/homepage` - 5 minutes TTL
- `/api/stories/latest` - 5 minutes TTL
- `/api/stories/:id` - 10 minutes TTL
- Individual story lookups by ID or slug - 10 minutes TTL

#### Magazines
- `/api/magazines` - 10 minutes TTL
- `/api/magazines/:slug` - 10 minutes TTL
- `/api/magazines/search` - 5 minutes TTL
- `/api/magazines/category/:category` - 10 minutes TTL
- `/api/magazines/featured` - 10 minutes TTL

#### Opportunities
- `/api/opportunities` - 5 minutes TTL
- `/api/opportunities/work-types` - 1 hour TTL
- `/api/opportunities/categories` - 1 hour TTL

### Cache Invalidation

Cache is automatically invalidated when:
- Stories are created, updated, or deleted
- Opportunities are created or updated
- Using `invalidateCache()` middleware on mutation endpoints

## Query Monitoring

### Security Notice

The query monitoring endpoints are **protected** and require authentication:

- **Development**: Accessible without authentication (when `NODE_ENV=development`)
- **Production**: Requires either:
  - Admin JWT token (user with `role: 'admin'`)
  - Admin API key (set via `ADMIN_API_KEY` environment variable)

### Monitoring Endpoints

#### Query Performance Report (Protected)
```
GET /api/query-performance
Headers:
  - Authorization: Bearer <admin-jwt-token>
  OR
  - X-Admin-Key: <admin-api-key>
```

Returns:
- Summary statistics (total queries, total duration, slow query count)
- Top 20 slowest queries by average duration (SQL sanitized)
- Recent slow queries (>1000ms) (SQL sanitized)
- Redis cache statistics (hit rate, memory usage, etc.)

**Note**: All SQL queries are sanitized before being returned. Sensitive data like passwords, tokens, and API keys are replaced with `***`.

#### Reset Monitoring Stats (Admin Only)
```
POST /api/query-performance/reset
Headers:
  - Authorization: Bearer <admin-jwt-token>
  OR
  - X-Admin-Key: <admin-api-key>
```

Resets query monitoring statistics. Requires admin authentication.

### Setting Up Admin Access

#### Option 1: Admin API Key (Recommended for Monitoring)
Add to your `.env` file:
```bash
ADMIN_API_KEY=your-secure-random-key-here
```

Then access monitoring with:
```bash
curl -H "X-Admin-Key: your-secure-random-key-here" http://localhost:10000/api/query-performance
```

#### Option 2: Admin JWT Token
Use an existing admin user's JWT token:
```bash
curl -H "Authorization: Bearer <admin-jwt-token>" http://localhost:10000/api/query-performance
```

### Slow Query Threshold

Queries taking longer than 1000ms (1 second) are flagged as slow and logged to the console.

### Monitoring in Code

```javascript
import queryMonitor from './config/queryMonitor.js';

// Get performance report
const report = queryMonitor.getReport();
console.log(report);

// Log report to console
queryMonitor.logReport();

// Reset stats
queryMonitor.reset();
```

## Missing Table

### Gallery Likes Table

The `gallery_likes` table was missing from the database. It has been created with the following structure:

```sql
CREATE TABLE gallery_likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  gallery_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_gallery_like (user_id, gallery_id),
  INDEX idx_gallery (gallery_id),
  INDEX idx_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (gallery_id) REFERENCES gallery(id) ON DELETE CASCADE
);
```

## Running Migrations

### Create Missing Table
```bash
cd backend
node migrations/migrate.js run create_gallery_likes_table.sql
```

### Create Performance Indexes
```bash
cd backend
node migrations/run-performance-indexes.js
```

### Check Table Structure
```bash
cd backend
node migrations/check-table-structure.js
```

## Expected Performance Improvements

### Before Optimization
- Stories queries: 1.5-9+ seconds
- Magazines queries: 1.3-2.4+ seconds
- Opportunities queries: 0.5-6.6+ seconds
- DESCRIBE operations: 1.4+ seconds

### After Optimization
- Stories queries: <100ms (with cache: <10ms)
- Magazines queries: <100ms (with cache: <10ms)
- Opportunities queries: <100ms (with cache: <10ms)
- DESCRIBE operations: <50ms

## Monitoring Recommendations

1. **Check Query Performance Regularly**
   ```bash
   # Development (no auth required)
   curl http://localhost:10000/api/query-performance
   
   # Production (requires admin key or token)
   curl -H "X-Admin-Key: $ADMIN_API_KEY" http://localhost:10000/api/query-performance
   ```

2. **Monitor Redis Cache Hit Rate**
   - Aim for >80% hit rate
   - If hit rate is low, consider increasing TTLs
   - Check via `/api/query-performance` endpoint

3. **Review Slow Queries**
   - Check the `/api/query-performance` endpoint daily
   - Optimize queries that consistently appear in the slow query list
   - **All SQL is sanitized** - sensitive data is never exposed

4. **Database Connection Pool**
   - Monitor connection pool usage
   - Adjust `DB_CONNECTION_LIMIT` if needed (default: 20)

5. **Security Best Practices**
   - Never expose the query monitoring endpoint publicly without authentication
   - Use strong `ADMIN_API_KEY` in production
   - Rotate admin keys regularly
   - Monitor access logs for suspicious activity

## Troubleshooting

### Cache Not Working
- Check Redis connection: `GET /api/redis-health`
- Verify `ENABLE_REDIS` is not set to `false`
- Check Redis logs for connection errors

### Queries Still Slow
- Verify indexes were created: `SHOW INDEX FROM stories;`
- Check if query is using indexes: `EXPLAIN SELECT ...`
- Consider adding more specific indexes for slow queries

### High Memory Usage
- Redis may be using too much memory
- Consider reducing cache TTLs
- Monitor with: `GET /api/query-performance` (includes Redis stats)

## Future Optimizations

1. **Read Replicas** - Configure read replicas for better read scaling
2. **Query Optimization** - Refactor complex queries to use simpler patterns
3. **Connection Pooling** - Tune connection pool settings based on load
4. **Database Sharding** - Consider sharding for very large datasets
5. **Materialized Views** - Create materialized views for complex aggregations
