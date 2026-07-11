# Troubleshooting Guide

Common issues and solutions for the Trendorabay Platform.

## Table of Contents

- [Backend Issues](#backend-issues)
- [Frontend Issues](#frontend-issues)
- [Database Issues](#database-issues)
- [Redis Issues](#redis-issues)
- [Deployment Issues](#deployment-issues)
- [Performance Issues](#performance-issues)
- [Security Issues](#security-issues)
- [Getting Help](#getting-help)

## Backend Issues

### Server Won't Start

**Symptoms**: Backend server fails to start or crashes immediately

**Possible Causes**:
- Port already in use
- Missing dependencies
- Environment variables not configured
- Database connection failure

**Solutions**:

1. **Check if port is in use**
   ```bash
   # macOS/Linux
   lsof -i :3001
   
   # Kill the process
   kill -9 <PID>
   ```

2. **Install missing dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Check environment variables**
   ```bash
   cd backend
   cat .env
   # Ensure all required variables are set
   ```

4. **Check database connection**
   ```bash
   mysql -u root -p trendorabay
   # If connection fails, check MySQL is running
   sudo systemctl status mysql
   ```

### Database Connection Failed

**Symptoms**: "Database connection failed" error in console

**Possible Causes**:
- MySQL not running
- Incorrect database credentials
- Database doesn't exist
- Network connectivity issues

**Solutions**:

1. **Start MySQL**
   ```bash
   # macOS
   brew services start mysql
   
   # Linux
   sudo systemctl start mysql
   
   # Windows
   # Start MySQL service from Services
   ```

2. **Verify database exists**
   ```bash
   mysql -u root -p
   SHOW DATABASES;
   # If trendorabay doesn't exist, create it:
   CREATE DATABASE trendorabay;
   ```

3. **Check credentials in .env**
   ```bash
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=trendorabay
   ```

4. **Test connection manually**
   ```bash
   mysql -u root -p -h localhost trendorabay
   ```

### Module Not Found Errors

**Symptoms**: "Error: Cannot find module 'module-name'"

**Possible Causes**:
- Dependencies not installed
- Node modules corrupted
- Incorrect import paths

**Solutions**:

1. **Reinstall dependencies**
   ```bash
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check import paths**
   ```javascript
   // Correct
   import pool from '../config/database.js';
   
   // Incorrect
   import pool from './config/database.js';
   ```

3. **Clear npm cache**
   ```bash
   npm cache clean --force
   npm install
   ```

### CORS Errors

**Symptoms**: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Possible Causes**:
- Frontend URL not configured in backend
- CORS middleware not working
- Wrong protocol (http vs https)

**Solutions**:

1. **Check FRONTEND_URL in .env**
   ```bash
   # Backend .env
   FRONTEND_URL=http://localhost:5173
   ```

2. **Ensure both are using same protocol**
   ```bash
   # Both should be http:// or both https://
   ```

3. **Check CORS middleware**
   ```javascript
   // backend/middleware/cors.js
   const corsMiddleware = (req, res, next) => {
     res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
     next();
   };
   ```

### JWT Authentication Errors

**Symptoms**: "Token is not valid" or "No authentication token"

**Possible Causes**:
- JWT_SECRET not set
- Token expired
- Invalid token format

**Solutions**:

1. **Set JWT_SECRET in .env**
   ```bash
   JWT_SECRET=your_very_secure_secret_here
   ```

2. **Check token format**
   ```javascript
   // Correct
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   // Incorrect
   Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Check token expiration**
   ```bash
   # Default is 7 days, check JWT_EXPIRE in .env
   JWT_EXPIRE=7d
   ```

## Frontend Issues

### Development Server Won't Start

**Symptoms**: Vite dev server fails to start

**Possible Causes**:
- Port already in use
- Missing dependencies
- Incorrect configuration

**Solutions**:

1. **Check if port is in use**
   ```bash
   # macOS/Linux
   lsof -i :5173
   
   # Kill the process
   kill -9 <PID>
   
   # Or use different port
   npm run dev -- --port 3000
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Check vite.config.js**
   ```javascript
   export default defineConfig({
     server: {
       host: '0.0.0.0',
       port: 5173
     }
   });
   ```

### Build Errors

**Symptoms**: "Build failed with errors"

**Possible Causes**:
- Syntax errors in code
- Missing dependencies
- TypeScript errors (if using TS)

**Solutions**:

1. **Check error logs**
   ```bash
   npm run build
   # Review the error messages
   ```

2. **Fix syntax errors**
   ```javascript
   // Common issues
   - Missing closing braces
   - Incorrect imports
   - Typos in variable names
   ```

3. **Clear Vite cache**
   ```bash
   rm -rf node_modules/.vite
   npm run build
   ```

### API Connection Errors

**Symptoms**: "Network Error" or "Connection refused"

**Possible Causes**:
- Backend not running
- Wrong API URL
- CORS issues
- Network connectivity

**Solutions**:

1. **Check if backend is running**
   ```bash
   curl http://localhost:3001/api/health
   ```

2. **Check API URL in .env**
   ```bash
   # Frontend .env
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

3. **Check browser console for CORS errors**
   ```javascript
   // Open browser DevTools (F12)
   // Check Console tab
   ```

### React Errors

**Symptoms**: "React Error: ...", "Uncaught Error"

**Possible Causes**:
- Component errors
- State management issues
- Incorrect props

**Solutions**:

1. **Check React DevTools**
   - Install React DevTools extension
   - Inspect component state and props

2. **Check error boundaries**
   ```javascript
   class ErrorBoundary extends React.Component {
     state = { hasError: false };
     
     static getDerivedStateFromError(error) {
       return { hasError: true };
     }
     
     render() {
       if (this.state.hasError) {
         return <div>Something went wrong.</div>;
       }
       return this.props.children;
     }
   }
   ```

3. **Check for undefined values**
   ```javascript
   // Add null checks
   {user && user.name && <div>{user.name}</div>}
   
   // Or use optional chaining
   <div>{user?.name}</div>
   ```

### State Management Issues

**Symptoms**: Redux state not updating, actions not working

**Possible Causes**:
- Incorrect action dispatching
- Reducer not handling action
- State not connected properly

**Solutions**:

1. **Check Redux DevTools**
   - Install Redux DevTools extension
   - Inspect state changes and actions

2. **Verify action dispatching**
   ```javascript
   const dispatch = useDispatch();
   dispatch(fetchData());
   ```

3. **Check reducer**
   ```javascript
   const mySlice = createSlice({
     name: 'myData',
     initialState,
     reducers: {
       fetchDataSuccess: (state, action) => {
         state.data = action.payload;
       }
     }
   });
   ```

4. **Check component connection**
   ```javascript
   const data = useSelector(state => state.myData.data);
   ```

## Database Issues

### Slow Queries

**Symptoms**: API responses are slow, database queries taking long time

**Possible Causes**:
- Missing indexes
- Large datasets
- Inefficient queries

**Solutions**:

1. **Add indexes**
   ```sql
   CREATE INDEX idx_story_category ON stories(category_id);
   CREATE INDEX idx_story_author ON stories(author_id);
   ```

2. **Optimize queries**
   ```javascript
   // Bad - SELECT *
   const [rows] = await pool.query('SELECT * FROM stories');
   
   // Good - SELECT specific columns
   const [rows] = await pool.query('SELECT id, title, created_at FROM stories');
   ```

3. **Use pagination**
   ```javascript
   const [rows] = await pool.query(
     'SELECT * FROM stories LIMIT ? OFFSET ?',
     [limit, offset]
   );
   ```

4. **Enable query cache**
   ```javascript
   // Use Redis caching
   import { cacheGet, cacheSet } from '../config/redis.js';
   ```

### Connection Pool Exhausted

**Symptoms**: "Connection pool exhausted" error

**Possible Causes**:
- Too many connections
- Connections not released
- Pool size too small

**Solutions**:

1. **Increase pool size**
   ```javascript
   // backend/config/database.js
   const pool = mysql.createPool({
     connectionLimit: 200, // Increase from 100
     // ... other config
   });
   ```

2. **Check for connection leaks**
   ```javascript
   // Always release connections
   const connection = await pool.getConnection();
   try {
     // Use connection
   } finally {
     connection.release();
   }
   ```

3. **Monitor connection count**
   ```sql
   SHOW STATUS LIKE 'Threads_connected';
   ```

### Database Migration Errors

**Symptoms**: Migration scripts fail to run

**Possible Causes**:
- SQL syntax errors
- Table already exists
- Permission issues

**Solutions**:

1. **Check SQL syntax**
   ```bash
   # Test SQL manually
   mysql -u root -p trendorabay < migration.sql
   ```

2. **Handle existing tables**
   ```sql
   -- Use IF NOT EXISTS
   CREATE TABLE IF NOT EXISTS users (...);
   
   -- Or drop and recreate (be careful!)
   DROP TABLE IF EXISTS users;
   CREATE TABLE users (...);
   ```

3. **Check permissions**
   ```sql
   GRANT ALL PRIVILEGES ON trendorabay.* TO 'username'@'localhost';
   FLUSH PRIVILEGES;
   ```

## Redis Issues

### Redis Connection Failed

**Symptoms**: "Redis connection failed" error

**Possible Causes**:
- Redis not running
- Wrong Redis URL
- Firewall blocking connection

**Solutions**:

1. **Start Redis**
   ```bash
   # macOS
   brew services start redis
   
   # Linux
   sudo systemctl start redis
   
   # Windows
   # Start Redis server
   redis-server
   ```

2. **Check Redis URL**
   ```bash
   # Backend .env
   REDIS_URL=redis://localhost:6379
   ```

3. **Test Redis connection**
   ```bash
   redis-cli ping
   # Should return: PONG
   ```

4. **Check firewall**
   ```bash
   # Allow Redis port
   sudo ufw allow 6379
   ```

### Cache Not Working

**Symptoms**: Data not being cached, cache misses

**Possible Causes**:
- Redis not connected
- Cache TTL too short
- Cache keys not matching

**Solutions**:

1. **Verify Redis is working**
   ```bash
   redis-cli
   SET test "hello"
   GET test
   # Should return: "hello"
   ```

2. **Check cache TTL**
   ```javascript
   // Increase cache time
   await cacheSet(key, value, 600); // 10 minutes instead of 5
   ```

3. **Check cache key format**
   ```javascript
   // Ensure keys are consistent
   const cacheKey = `stories:${categoryId}:${page}`;
   ```

4. **Monitor cache performance**
   ```bash
   redis-cli INFO stats
   ```

## Deployment Issues

### Build Fails on Deployment

**Symptoms**: Build process fails during deployment

**Possible Causes**:
- Missing dependencies
- Environment variables not set
- Build configuration issues

**Solutions**:

1. **Check build logs**
   ```bash
   # Review deployment logs for specific errors
   ```

2. **Set environment variables**
   ```bash
   # Vercel
   # Set in Vercel dashboard
   
   # Heroku
   heroku config:set VARIABLE_NAME=value
   
   # AWS
   # Set in EC2 user data or environment
   ```

3. **Test build locally**
   ```bash
   npm run build
   # If build fails locally, fix before deploying
   ```

### Server Crashes After Deployment

**Symptoms**: Application crashes after successful deployment

**Possible Causes**:
- Runtime errors
- Missing production dependencies
- Memory issues

**Solutions**:

1. **Check server logs**
   ```bash
   # PM2 logs
   pm2 logs trendorabay-backend
   
   # Nginx logs
   sudo tail -f /var/log/nginx/error.log
   ```

2. **Install production dependencies**
   ```bash
   npm install --production
   ```

3. **Monitor memory usage**
   ```bash
   pm2 monit
   # Or
   htop
   ```

4. **Set up process manager**
   ```bash
   # Use PM2 for auto-restart
   pm2 start server.js --name "trendorabay-backend"
   pm2 startup
   pm2 save
   ```

### SSL Certificate Issues

**Symptoms**: HTTPS not working, certificate errors

**Possible Causes**:
- Certificate not installed
- Certificate expired
- Domain mismatch

**Solutions**:

1. **Install SSL certificate**
   ```bash
   # Let's Encrypt with Certbot
   sudo certbot --nginx -d yourdomain.com
   ```

2. **Renew expired certificate**
   ```bash
   sudo certbot renew
   ```

3. **Check Nginx configuration**
   ```nginx
   server {
       listen 443 ssl http2;
       server_name yourdomain.com;
       
       ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
   }
   ```

## Performance Issues

### Slow Page Load Times

**Symptoms**: Frontend pages load slowly

**Possible Causes**:
- Large bundle sizes
- Unoptimized images
- Slow API responses
- No caching

**Solutions**:

1. **Optimize bundle size**
   ```bash
   # Analyze bundle
   npm run build
   # Check dist folder size
   ```

2. **Enable code splitting**
   ```javascript
   import { lazy, Suspense } from 'react';
   const LazyComponent = lazy(() => import('./LazyComponent'));
   ```

3. **Optimize images**
   ```javascript
   // Use lazy loading
   <img src="image.jpg" loading="lazy" alt="Description" />
   
   // Use next-gen formats (WebP)
   ```

4. **Enable caching**
   ```javascript
   // Use Redis for API caching
   import { cacheGet, cacheSet } from '../config/redis.js';
   ```

### High Memory Usage

**Symptoms**: Application using excessive memory

**Possible Causes**:
- Memory leaks
- Large data sets loaded
- Inefficient algorithms

**Solutions**:

1. **Monitor memory usage**
   ```bash
   # PM2
   pm2 monit
   
   # System
   free -m
   ```

2. **Check for memory leaks**
   ```javascript
   // Ensure event listeners are cleaned up
   useEffect(() => {
     const handleResize = () => { ... };
     window.addEventListener('resize', handleResize);
     
     return () => {
       window.removeEventListener('resize', handleResize);
     };
   }, []);
   ```

3. **Paginate large datasets**
   ```javascript
   // Don't load all data at once
   const [rows] = await pool.query(
     'SELECT * FROM stories LIMIT ? OFFSET ?',
     [limit, offset]
   );
   ```

## Security Issues

### SQL Injection Vulnerabilities

**Symptoms**: Potential SQL injection points in code

**Possible Causes**:
- Concatenating user input into SQL queries
- Not using parameterized queries

**Solutions**:

1. **Use parameterized queries**
   ```javascript
   // Bad
   const query = `SELECT * FROM users WHERE id = ${userId}`;
   
   // Good
   const [rows] = await pool.query(
     'SELECT * FROM users WHERE id = ?',
     [userId]
   );
   ```

2. **Validate input**
   ```javascript
   import { body, validationResult } from 'express-validator';
   
   router.post('/', [
   body('email').isEmail(),
   body('password').isLength({ min: 8 })
   ], (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
   });
   ```

### XSS Vulnerabilities

**Symptoms**: Potential XSS attack vectors

**Possible Causes**:
- Rendering unsanitized user input
- Not using DOMPurify

**Solutions**:

1. **Sanitize user input**
   ```javascript
   import DOMPurify from 'dompurify';
   
   const cleanContent = DOMPurify.sanitize(userContent);
   ```

2. **Use React's built-in escaping**
   ```javascript
   // React automatically escapes JSX content
   <div>{userContent}</div>
   
   // For dangerouslySetInnerHTML (use sparingly)
   <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />
   ```

### Authentication Bypass

**Symptoms**: Users can access protected routes without authentication

**Possible Causes**:
- Missing authentication middleware
- JWT not validated properly

**Solutions**:

1. **Add authentication middleware**
   ```javascript
   import auth from '../middleware/auth.js';
   
   router.get('/protected', auth, (req, res) => {
     // Protected route
   });
   ```

2. **Validate JWT on each request**
   ```javascript
   const auth = (req, res, next) => {
     const token = req.header('Authorization')?.replace('Bearer ', '');
     if (!token) {
       return res.status(401).json({ error: 'No token provided' });
     }
     // Validate token
   };
   ```

## Getting Help

### When to Ask for Help

- You've tried the solutions above and the issue persists
- You're unsure about the cause of the problem
- You need clarification on documentation
- You've found a bug that needs reporting

### How to Get Help

1. **Check Documentation**
   - Review all documentation files
   - Search for similar issues

2. **Search Existing Issues**
   - Check GitHub issues
   - Look for similar problems

3. **Create a New Issue**
   - Use the issue template
   - Provide detailed information
   - Include error messages and logs
   - Describe steps to reproduce

4. **Join Community Discussions**
   - Ask questions in discussions
   - Be specific and provide context

### Information to Include

When asking for help, include:

- **Error messages**: Full error text
- **Steps to reproduce**: What you did before the error
- **Environment**: OS, Node.js version, browser
- **Configuration**: Relevant config files (redact sensitive info)
- **Logs**: Relevant log output
- **Screenshots**: If applicable

### Debugging Tips

1. **Enable Debug Mode**
   ```bash
   # Backend
   NODE_ENV=development npm run dev
   
   # Frontend
   # Use browser DevTools
   ```

2. **Add Logging**
   ```javascript
   console.log('Debug info:', data);
   console.error('Error:', error);
   ```

3. **Use Breakpoints**
   - Set breakpoints in VS Code
   - Use browser DevTools debugger
   - Step through code execution

4. **Isolate the Problem**
   - Test components individually
   - Simplify the code
   - Remove recent changes

## Prevention

### Best Practices to Avoid Issues

1. **Regular Updates**
   - Keep dependencies updated
   - Update Node.js regularly
   - Apply security patches

2. **Testing**
   - Write tests for new features
   - Run tests before committing
   - Test in staging environment

3. **Monitoring**
   - Set up error tracking (Sentry)
   - Monitor application performance
   - Review logs regularly

4. **Backup**
   - Regular database backups
   - Backup configuration files
   - Version control for all code

5. **Documentation**
   - Document changes
   - Update README
   - Keep API docs current

---

If you continue to experience issues after trying these solutions, please don't hesitate to reach out for help through the channels mentioned above.
