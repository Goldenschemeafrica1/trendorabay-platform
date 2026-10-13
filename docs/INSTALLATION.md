# Installation Guide

This guide will help you set up the Trendorabay platform on your local machine for development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v16 or higher ([Download](https://nodejs.org/))
- **MySQL**: v8.0 or higher ([Download](https://dev.mysql.com/downloads/mysql/))
- **Redis**: (Optional) for caching ([Download](https://redis.io/download))
- **npm** or **yarn**: Comes with Node.js
- **Git**: For version control ([Download](https://git-scm.com/))

## Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd trendorabay
```

### 2. Backend Setup

#### Navigate to Backend Directory

```bash
cd backend
```

#### Install Dependencies

```bash
npm install
```

This will install all required backend dependencies including:
- express
- mysql2
- redis
- jsonwebtoken
- multer
- cors
- helmet
- joi
- express-validator

#### Configure Environment Variables

```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials and configuration:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=trendorabay
DB_CONNECTION_LIMIT=100

# Redis Configuration (optional but recommended)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Frontend Configuration (for CORS)
FRONTEND_URL=http://localhost:5173

# JWT Configuration (IMPORTANT: Change this in production!)
JWT_SECRET=your_jwt_secret_here_change_in_production
JWT_EXPIRE=7d

# File Upload Configuration
UPLOADS_PATH=/path/to/uploads/directory
MAX_FILE_SIZE=52428800

# Security Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5
UPLOAD_RATE_LIMIT_MAX=10

# Cache Configuration
CACHE_TTL=300
```

#### Set Up MySQL Database

**Option 1: Using the provided schema file**

```bash
mysql -u root -p < config/schema.sql
```

**Option 2: Manual setup**

```sql
-- Log in to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE trendorabay;

-- Use the database
USE trendorabay;

-- Run the schema commands from config/schema.sql
```

#### Run Database Migrations

```bash
node database/run_migration.js
```

This will create additional tables and update the schema with the latest changes.

#### Start the Backend Server

**Development mode (with auto-restart):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The backend server will start on `http://localhost:3001`

#### Verify Backend Installation

Check the health endpoint:

```bash
curl http://localhost:3001/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "uptime": 0.123
}
```

### 3. Frontend Setup

#### Navigate to Frontend Directory

```bash
cd ../frontend
```

#### Install Dependencies

```bash
npm install
```

This will install all required frontend dependencies including:
- react
- react-dom
- react-router-dom
- @reduxjs/toolkit
- react-redux
- axios
- lucide-react
- react-icons
- react-toastify

#### Configure Environment Variables

Create a `.env` file in the frontend directory:

```bash
touch .env
```

Add the following configuration:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

#### Start the Frontend Development Server

```bash
npm run dev
```

The frontend application will start on `http://localhost:5173`

#### Verify Frontend Installation

Open your browser and navigate to `http://localhost:5173`. You should see the Trendorabay landing page with hero section, featured stories, magazines, and community sections.

### 4. Redis Setup (Optional but Recommended)

Redis is used for caching and distributed rate limiting. While the application will work without Redis, it's highly recommended for production use.

#### Install Redis

**macOS:**

```bash
brew install redis
brew services start redis
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt-get update
sudo apt-get install redis-server
sudo systemctl start redis
```

**Windows:**

Download Redis for Windows from [GitHub](https://github.com/microsoftarchive/redis/releases)

#### Verify Redis Installation

```bash
redis-cli ping
```

Expected response: `PONG`

#### Configure Redis in Backend

Ensure your backend `.env` file has:

```env
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
```

## Complete Startup Sequence

For a complete development environment startup:

1. **Start MySQL** (if not running)
2. **Start Redis** (if using)
3. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
4. **Start Frontend Server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```

## Verification Steps

### 1. Check Backend Health

```bash
curl http://localhost:3001/api/health
```

### 2. Check Backend Readiness

```bash
curl http://localhost:3001/api/ready
```

### 3. Test API Endpoints

```bash
# Get all magazines
curl http://localhost:3001/api/magazines

# Get all stories
curl http://localhost:3001/api/stories

# Get all merchandise
curl http://localhost:3001/api/merchandise
```

### 4. Access Frontend

Open your browser and navigate to `http://localhost:5173`

## Common Issues and Solutions

### Database Connection Failed

**Problem:** Backend cannot connect to MySQL

**Solutions:**
1. Ensure MySQL is running: `mysql -u root -p`
2. Verify credentials in `.env` file
3. Check that the database `trendorabay` exists
4. Ensure MySQL is listening on the correct port (default 3306)

### Port Already in Use

**Problem:** Port 3001 or 5173 is already in use

**Solutions:**
1. Change the port in `.env` file (backend) or `vite.config.js` (frontend)
2. Kill the process using the port:
   ```bash
   # Find process on port 3001
   lsof -i :3001
   # Kill the process
   kill -9 <PID>
   ```

### CORS Errors

**Problem:** Frontend cannot connect to backend due to CORS

**Solutions:**
1. Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
2. Check that the frontend is running on the specified URL
3. Verify CORS middleware is configured correctly in `backend/middleware/cors.js`

### Redis Connection Issues

**Problem:** Backend cannot connect to Redis

**Solutions:**
1. Ensure Redis is running: `redis-cli ping`
2. Verify `REDIS_URL` in `.env` file
3. Check firewall settings
4. Note: The application will work without Redis, but without caching

### Module Not Found Errors

**Problem:** Missing node modules

**Solutions:**
1. Delete `node_modules` folder and `package-lock.json`
2. Run `npm install` again
3. Clear npm cache: `npm cache clean --force`

### Build Errors

**Problem:** Frontend build fails

**Solutions:**
1. Ensure all dependencies are installed
2. Check Node.js version (should be v16+)
3. Clear Vite cache: `rm -rf node_modules/.vite`
4. Reinstall dependencies: `rm -rf node_modules && npm install`

## Development Tools

### Recommended VS Code Extensions

- ESLint
- Prettier
- GitLens
- Thunder Client (for API testing)
- MySQL extension
- Redis extension

### API Testing Tools

- **Thunder Client** (VS Code extension)
- **Postman** (standalone application)
- **curl** (command line)

### Database Management Tools

- **MySQL Workbench** (official GUI)
- **DBeaver** (universal database tool)
- **phpMyAdmin** (web-based)

## Next Steps

After successful installation:

1. Review the [API Reference](API_REFERENCE.md) to understand available endpoints
2. Check the [Database Schema](DATABASE_SCHEMA.md) to understand the data structure
3. Read the [Development Guide](DEVELOPMENT_GUIDE.md) for development workflow
4. Explore the [Architecture Documentation](ARCHITECTURE.md) for system design

## Production Setup

For production deployment, please refer to the [Deployment Guide](DEPLOYMENT.md). Production setup requires additional security configurations, environment variable management, and infrastructure considerations.

## Support

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting Documentation](TROUBLESHOOTING.md)
2. Review the error logs in the terminal
3. Check MySQL and Redis logs
4. Open an issue on the repository

## Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Redis Documentation](https://redis.io/docs/)
- [Vite Documentation](https://vite.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
