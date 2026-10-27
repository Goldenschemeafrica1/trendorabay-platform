# Render Deployment Guide for Trendorabay Backend

This guide covers deploying the Trendorabay backend to Render.com.

## Prerequisites

- Render account
- GitHub repository connected to Render
- MySQL database (Render MySQL or external)
- Redis instance (Render Redis or external)

## Step 1: Set Up Database on Render

### Option A: Use Render MySQL

1. Go to Render Dashboard
2. Click "New" → "Database"
3. Choose "MySQL"
4. Name: `trendorabay-db`
5. Database: `trendorabay`
6. User: `trendorabay_user`
7. Region: Choose closest to your users
8. Plan: Free or paid based on needs
9. Click "Create Database"

### Option B: Use External Database

If using an external database (AWS RDS, DigitalOcean, etc.), you'll need the connection details.

## Step 2: Set Up Redis on Render

1. Go to Render Dashboard
2. Click "New" → "Database"
3. Choose "Redis"
4. Name: `trendorabay-redis`
5. Region: Same as database
6. Plan: Free or paid based on needs
7. Click "Create Database"

## Step 3: Deploy Backend to Render

### Create Web Service

1. Go to Render Dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure settings:

**Build & Deploy:**
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node server.js`
- Runtime: Node 18.x or higher

**Environment Variables:**

Add the following environment variables:

```env
NODE_ENV=production
PORT=10000
TRUST_PROXY=true
```

**Database Variables (if using Render MySQL):**
- Render will automatically provide `DATABASE_URL` when you link the database
- Extract from DATABASE_URL or set individually:
  - `DB_HOST` (from DATABASE_URL)
  - `DB_PORT=3306`
  - `DB_USER` (from DATABASE_URL)
  - `DB_PASSWORD` (from DATABASE_URL)
  - `DB_NAME=trendorabay`
  - `DB_CONNECTION_LIMIT=20`
  - `DB_SSL=true` (required for Render MySQL)

**Redis Variables (if using Render Redis):**
- Render will automatically provide `REDIS_URL` when you link the database

**Required Variables:**
- `JWT_SECRET` - Generate a secure random string (use `node scripts/generateJwtSecret.js`)
- `FRONTEND_URL=https://www.trendorabay.com`

**Optional Variables:**
- `CLOUDINARY_CLOUD_NAME` - For image uploads
- `CLOUDINARY_API_KEY` - For image uploads
- `CLOUDINARY_API_SECRET` - For image uploads
- `UPLOADS_PATH=/var/www/trendorabay/uploads` (if using local uploads)
- `MAX_FILE_SIZE=52428800` (50MB)
- `RATE_LIMIT_WINDOW_MS=900000` (15 minutes)
- `RATE_LIMIT_MAX_REQUESTS=100`
- `AUTH_RATE_LIMIT_MAX=5`
- `UPLOAD_RATE_LIMIT_MAX=10`
- `CACHE_TTL=300` (5 minutes)

### Link Database and Redis

1. In your web service settings, scroll to "Databases"
2. Click "Add Database"
3. Select your MySQL database
4. Click "Link"
5. Repeat for Redis

### Health Check

- Health Check Path: `/api/health`

### Auto-Deploy

- Set to `false` initially to test manually

## Step 4: Fix CORS Issues

The backend is already configured to allow `https://www.trendorabay.com` in the CORS middleware. However, you need to ensure:

1. **TRUST_PROXY=true** - This is critical for Render's load balancer
2. **FRONTEND_URL=https://www.trendorabay.com** - Set in environment variables

## Step 5: Troubleshooting 503 Errors

If you're seeing 503 errors, check the following:

### 1. Database Connection

Check Render logs for database connection errors:
- Go to your web service → Logs
- Look for "Database connection failed" messages

**Common fixes:**
- Ensure database is linked to web service
- Check DB_HOST, DB_USER, DB_PASSWORD are correct
- Set `DB_SSL=true` for Render MySQL
- Increase `DB_CONNECTION_LIMIT` if needed

### 2. Redis Connection

Check Redis connection:
- Look for "Redis connection failed" in logs
- Ensure Redis is linked to web service
- Check REDIS_URL is set correctly

### 3. Port Configuration

Ensure PORT is set to `10000` (Render's default) or leave it to Render's default.

### 4. Memory Limits

Render free tier has limited memory (512MB). If you're experiencing crashes:
- Upgrade to a paid plan with more memory
- Reduce `DB_CONNECTION_LIMIT` to 10
- Disable Redis if not critical

## Step 6: Run Migrations

After deployment, you need to run database migrations:

1. Go to your web service → Shell
2. Run: `node database/run_migration.js`

Or use Render CLI:
```bash
render ssh trendorabay-backend
node database/run_migration.js
```

## Step 7: Test Deployment

1. Check health endpoint:
   ```bash
   curl https://trendorabay-platform.onrender.com/api/health
   ```

2. Test API endpoint:
   ```bash
   curl https://trendorabay-platform.onrender.com/api/stories/latest?limit=4
   ```

3. Check CORS from frontend:
   - Open browser console on https://www.trendorabay.com
   - Look for CORS errors
   - Should see successful API calls

## Step 8: Monitor Logs

Regularly check Render logs for errors:
- Go to web service → Logs
- Filter by "Error" or "Warning"
- Look for database/Redis connection issues
- Monitor memory usage

## Common Issues and Solutions

### Issue: CORS errors persist

**Solution:**
1. Verify `FRONTEND_URL=https://www.trendorabay.com` is set
2. Verify `TRUST_PROXY=true` is set
3. Check backend logs for CORS rejection messages
4. Ensure frontend is making requests to correct backend URL

### Issue: 503 Service Unavailable

**Solution:**
1. Check database is running and linked
2. Check Redis is running and linked
3. Verify database credentials are correct
4. Increase `DB_CONNECTION_LIMIT` if connection pool exhausted
5. Check memory usage - may need to upgrade plan

### Issue: Database connection timeout

**Solution:**
1. Set `DB_SSL=true` for Render MySQL
2. Increase `connectTimeout` in database config
3. Check database is in same region as web service
4. Verify firewall allows connections

### Issue: Redis connection failed

**Solution:**
1. Ensure Redis is linked to web service
2. Check REDIS_URL is set correctly
3. If Redis is not critical, the app will fallback to in-memory rate limiting
4. Consider upgrading Redis plan if hitting limits

### Issue: High memory usage

**Solution:**
1. Reduce `DB_CONNECTION_LIMIT` from 20 to 10
2. Disable read replica if not needed
3. Upgrade to paid plan with more memory
4. Monitor for memory leaks

## Environment Variables Reference

Required:
- `NODE_ENV=production`
- `PORT=10000`
- `TRUST_PROXY=true`
- `JWT_SECRET` (generate secure random string)
- `FRONTEND_URL=https://www.trendorabay.com`

Database (if using Render MySQL):
- `DB_HOST` (auto-set when linked)
- `DB_PORT=3306`
- `DB_USER` (auto-set when linked)
- `DB_PASSWORD` (auto-set when linked)
- `DB_NAME=trendorabay`
- `DB_CONNECTION_LIMIT=20`
- `DB_SSL=true`

Redis (if using Render Redis):
- `REDIS_URL` (auto-set when linked)

Optional:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `MAX_FILE_SIZE=52428800`
- `RATE_LIMIT_WINDOW_MS=900000`
- `RATE_LIMIT_MAX_REQUESTS=100`
- `AUTH_RATE_LIMIT_MAX=5`
- `UPLOAD_RATE_LIMIT_MAX=10`
- `CACHE_TTL=300`

## Performance Optimization

1. **Enable Caching**: Use Redis for caching
2. **Connection Pooling**: Already configured with connectionLimit
3. **Compression**: Already enabled with compression middleware
4. **Rate Limiting**: Already configured with Redis rate limiter
5. **Read Replicas**: Configure read replica for read-heavy workloads

## Security Checklist

- [ ] JWT_SECRET is strong and random
- [ ] Database uses SSL/TLS
- [ ] TRUST_PROXY is set to true
- [ ] FRONTEND_URL is set correctly
- [ ] No sensitive data in logs
- [ ] Rate limiting is enabled
- [ ] Security headers are configured
- [ ] Input validation is enabled

## Support

If you encounter issues:
1. Check Render logs first
2. Test database and Redis connections
3. Verify environment variables
4. Check this guide for common issues
5. Review Render documentation: https://render.com/docs
