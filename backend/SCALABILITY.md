# Scalability Implementation Guide

## Overview
This document describes the scalability improvements implemented to handle high traffic loads.

## Implemented Features

### 1. Redis Caching Layer
- **Location**: `config/redis.js`
- **Features**:
  - Distributed caching across multiple server instances
  - Automatic reconnection strategy
  - Graceful fallback when Redis is unavailable
  - Cache helpers: `cacheGet`, `cacheSet`, `cacheDel`, `cacheDelPattern`

### 2. Distributed Rate Limiting
- **Location**: `middleware/redisRateLimiter.js`
- **Features**:
  - Redis-based rate limiting for horizontal scaling
  - Per-IP request tracking
  - Configurable windows and limits
  - Rate limit headers in responses
  - Fallback to no limiting if Redis unavailable

### 3. Query Caching
- **Location**: `middleware/cacheMiddleware.js`
- **Features**:
  - Automatic caching of GET requests
  - Configurable TTL (default 5 minutes)
  - Cache invalidation on mutations
  - Cache hit/miss headers

### 4. Database Connection Pooling
- **Location**: `config/database.js`
- **Features**:
  - Primary and read replica connection pools
  - Configurable limits via `DB_CONNECTION_LIMIT` and `DB_READ_REPLICA_CONNECTION_LIMIT`
  - Connection timeout settings
  - Keep-alive enabled

### 5. Read Replica Routing
- **Location**: `config/database.js`
- **Features**:
  - Automatic routing of `SELECT` queries to read replicas
  - `SELECT ... FOR UPDATE` and all writes stay on the primary
  - Falls back to primary if no read replica is configured
  - No route changes required; existing `pool.query` calls use the routing proxy

### 6. Response Compression
- **Location**: `server.js`
- **Features**:
  - Gzip compression for all responses
  - Reduced bandwidth usage
  - Faster page loads

### 7. Health Check Endpoints
- **Location**: `server.js`
- **Endpoints**:
  - `/api/health` - Basic health check with database status
  - `/api/ready` - Readiness check for load balancers/Kubernetes

### 8. CDN-Ready Cache Headers
- **Location**: `server.js` and `middleware/cacheMiddleware.js`
- **Features**:
  - Long-lived `Cache-Control` and `CDN-Cache-Control` for static uploads and frontend `dist` assets
  - `no-cache` for `index.html` so SPAs stay fresh
  - `stale-while-revalidate` for cached API responses
  - `Vary: Accept-Encoding` for compressed responses

### 9. Monitoring and Metrics
- **Location**: `config/metrics.js`, `server.js`, `config/database.js`, `middleware/cacheMiddleware.js`, `config/redis.js`
- **Features**:
  - Request duration/status APM metrics exposed via `/api/metrics`
  - Database query analysis with slow query logging
  - Redis performance stats from `INFO`
  - Cache hit/miss ratio tracking

### 10. Queue System
- **Location**: `config/queue.js`, `workers/queueWorker.js`, `services/queueService.js`
- **Features**:
  - Bull job queue backed by Redis
  - Processors for `email`, `image-processing`, and `heavy-processing`
  - `services/queueService.js` helpers to offload work from request handlers
  - Workers start with the server and log job lifecycle

## Configuration

### Environment Variables
Add these to your `.env` file:

```env
# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Database Connection Pool
DB_CONNECTION_LIMIT=100

# Cache Configuration
CACHE_TTL=300
```

### Redis Setup
1. Install Redis: `brew install redis` (macOS) or `sudo apt-get install redis-server` (Linux)
2. Start Redis: `redis-server`
3. Verify connection: `redis-cli ping`

## Current Capacity Estimates

### Before Scaling
- Concurrent users: ~100-500
- Daily active users: ~1,000-5,000
- Database connections: 50

### After Scaling
- Concurrent users: ~1,000-5,000
- Daily active users: ~10,000-50,000
- Database connections: 100
- Cache hit rate: ~60-80% (estimated)

## Next Steps for Massive Scale

### 1. Horizontal Scaling
- Deploy multiple app instances behind a load balancer
- Use Nginx or HAProxy as load balancer
- Configure sticky sessions if needed

### 2. Database Scaling
- ✅ **Read replica routing** for read-heavy queries — implemented in `config/database.js`
- ✅ **Connection pooling** at the application level — primary and read replica pools with configurable limits
- **Database sharding** for massive datasets (future consideration):
  - Use range or hash sharding on `user_id`/`tenant_id` to distribute load
  - Add a shard router in `config/database.js` to pick connections by shard key
  - Keep cross-shard aggregation/OLAP in a separate read pool or data warehouse

### 3. CDN Implementation
- ✅ Cache headers configured for static assets (`/uploads`, `frontend/dist`) and cached API responses
- Use a CDN origin (Cloudflare/CloudFront) pointing at the backend for static + API traffic
- Cloudflare: use `CDN-Cache-Control`; CloudFront: use `Cache-Control` plus origin TTL overrides
- Keep `index.html` uncached; cache hashed build assets and `/uploads` for 1 year

### 4. Monitoring
- ✅ APM request metrics exposed on `/api/metrics`
- ✅ Database query analysis with slow-query logging
- ✅ Redis performance stats from `INFO`
- ✅ Cache hit/miss ratio tracking

### 5. Queue System
- ✅ Bull job queue configured with Redis
- ✅ Background workers for `email`, `image-processing`, and `heavy-processing`
- ✅ Service helpers to enqueue jobs from request handlers
- Replace simulated processors with real transports (SendGrid, AWS SES, Sharp, Cloudinary)

## Testing Scalability

### Load Testing Tools
- Apache Bench (ab)
- JMeter
- k6
- Artillery

### Example Load Test
```bash
# Install k6
brew install k6

# Run load test
k6 run --vus 100 --duration 5m load-test.js
```

## Monitoring Commands

### Redis Monitoring
```bash
# Check Redis stats
redis-cli INFO stats

# Monitor Redis in real-time
redis-cli MONITOR

# Check memory usage
redis-cli INFO memory
```

### Database Monitoring
```bash
# Check connection count
mysql -e "SHOW STATUS LIKE 'Threads_connected'"

# Check slow queries
mysql -e "SHOW STATUS LIKE 'Slow_queries'"
```

## Troubleshooting

### Redis Connection Issues
- Check if Redis is running: `redis-cli ping`
- Verify REDIS_URL in .env
- Check firewall settings
- Review Redis logs

### Cache Not Working
- Verify Redis connection
- Check cache headers in responses
- Review cache middleware logs
- Ensure cache TTL is appropriate

### High Database Load
- Increase DB_CONNECTION_LIMIT
- Add more database indexes
- Implement read replicas
- Review slow query log

## Security Considerations

- Redis should be secured with password in production
- Use Redis over SSL in production
- Implement Redis ACLs
- Monitor Redis for unauthorized access
