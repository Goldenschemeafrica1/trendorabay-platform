# TRENDORABAY PLATFORM - COMPLETE DOCUMENTATION

---

# Table of Contents

1. [Project Overview](#project-overview)
2. [Installation Guide](#installation-guide)
3. [API Reference](#api-reference)
4. [Database Schema](#database-schema)
5. [System Architecture](#system-architecture)
6. [Deployment Guide](#deployment-guide)
7. [Development Guide](#development-guide)
8. [Contributing Guidelines](#contributing-guidelines)
9. [Troubleshooting Guide](#troubleshooting-guide)

---

# PROJECT OVERVIEW

## Description

A comprehensive digital media platform featuring magazines, stories, podcasts, and e-commerce functionality focused on African content and culture.

## Features

### Content Management
- **Digital Magazines**: Full magazine platform with categories, pricing, PDF previews, and table of contents
- **Stories & Articles**: Content management with authors, categories, search, and featured content
- **Podcasts**: Audio/video content with hosts, guests, and episode management

### E-Commerce
- **Merchandise Store**: Product catalog with categories, pricing, and inventory management
- **Shopping Cart**: Persistent cart with localStorage integration
- **Checkout System**: Order processing with payment integration
- **Order Management**: Order tracking and status updates

### Community & Engagement
- **Contributor System**: Community contributors with profiles, expertise, and social media links
- **Social Features**: Likes, comments, and shares on stories
- **Follow System**: Follow authors and contributors
- **Events**: Event management and display

### Business Tools
- **Advertisements**: Ad management with different positions (horizontal, vertical, banner)
- **Partnerships**: Business partnership proposals and management
- **Inquiries**: Advertisement inquiry system
- **Content Pitches**: Story pitch submissions

## Tech Stack

### Backend
- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js
- **Database**: MySQL with connection pooling (100 connections)
- **Caching**: Redis with automatic fallback
- **Authentication**: JWT-based authentication
- **File Upload**: Multer with memory storage (50MB limit)
- **Security**: Helmet, CORS, rate limiting, input sanitization

### Frontend
- **Framework**: React 19.2.0 with Vite 7.3.1
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **UI Components**: Lucide React, React Icons
- **Notifications**: React Toastify
- **Analytics**: Vercel Analytics
- **Security**: DOMPurify for XSS protection

## Project Structure

```
trendorabay/
├── backend/                 # Backend API
│   ├── config/             # Configuration files
│   ├── database/           # Database migrations
│   ├── middleware/         # Express middleware
│   ├── routes/             # API routes
│   ├── scripts/            # Utility scripts
│   └── server.js           # Main server file
├── frontend/               # Frontend React application
│   ├── public/             # Static assets
│   └── src/
│       ├── components/     # React components
│       ├── pages/          # Page components
│       ├── services/       # API services
│       ├── store/          # Redux store
│       ├── hooks/          # Custom hooks
│       └── utils/          # Utility functions
└── docs/                   # Documentation
```

---

# INSTALLATION GUIDE

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js v16 or higher
- MySQL v8.0 or higher
- Redis (optional, for caching)
- npm or yarn
- Git

## Backend Setup

### Navigate to Backend Directory

```bash
cd backend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

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

### Set Up MySQL Database

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

### Run Database Migrations

```bash
node database/run_migration.js
```

### Start the Backend Server

**Development mode (with auto-restart):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The backend server will start on `http://localhost:3001`

### Verify Backend Installation

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

## Frontend Setup

### Navigate to Frontend Directory

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the frontend directory:

```bash
touch .env
```

Add the following configuration:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### Start the Frontend Development Server

```bash
npm run dev
```

The frontend application will start on `http://localhost:5173`

### Verify Frontend Installation

Open your browser and navigate to `http://localhost:5173`. You should see the Trendorabay homepage.

## Redis Setup (Optional but Recommended)

Redis is used for caching and distributed rate limiting.

### Install Redis

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

Download Redis for Windows from GitHub releases

### Verify Redis Installation

```bash
redis-cli ping
```

Expected response: `PONG`

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

---

# API REFERENCE

## Base URL

```
Development: http://localhost:3001/api
Production: https://your-domain.com/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error Type",
  "details": "Detailed error message"
}
```

## Rate Limiting

- **General Rate Limit**: 100 requests per 15 minutes per IP
- **Authentication Rate Limit**: 5 requests per 15 minutes per IP
- **Upload Rate Limit**: 10 requests per 15 minutes per IP

## Health Check

### Check Server Health

```http
GET /api/health
```

**Response**:

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "uptime": 123.456
}
```

## Magazines API

### Get All Magazines

```http
GET /api/magazines
```

**Query Parameters**: category, page, limit

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Tech Trends 2024",
      "description": "Latest technology trends",
      "cover_image": "https://example.com/cover.jpg",
      "category": "Technology",
      "issue_number": "Vol 1",
      "pdf_url": "https://example.com/magazine.pdf",
      "price": 9.99,
      "published": true
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 12,
    "totalPages": 5
  }
}
```

### Get Magazine by ID

```http
GET /api/magazines/:id
```

### Create Magazine

```http
POST /api/magazines
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Update Magazine

```http
PUT /api/magazines/:id
Authorization: Bearer <token>
```

### Delete Magazine

```http
DELETE /api/magazines/:id
Authorization: Bearer <token>
```

## Stories API

### Get All Stories

```http
GET /api/stories
```

**Query Parameters**: category, author, search, page, limit, featured, status

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "The Future of AI",
      "content": "Artificial intelligence is changing everything...",
      "featured_image_url": "https://example.com/image.jpg",
      "author_name": "John Doe",
      "category_name": "Technology",
      "status": "published",
      "featured": true
    }
  ]
}
```

### Get Story by ID

```http
GET /api/stories/:id
```

### Create Story

```http
POST /api/stories
Authorization: Bearer <token>
```

### Update Story

```http
PUT /api/stories/:id
Authorization: Bearer <token>
```

### Delete Story

```http
DELETE /api/stories/:id
Authorization: Bearer <token>
```

## Podcasts API

### Get All Podcasts

```http
GET /api/podcasts
```

### Get Podcast by ID

```http
GET /api/podcasts/:id
```

### Create Podcast

```http
POST /api/podcasts
Authorization: Bearer <token>
```

## Merchandise API

### Get All Merchandise

```http
GET /api/merchandise
```

### Get Merchandise by ID

```http
GET /api/merchandise/:id
```

### Create Merchandise

```http
POST /api/merchandise
Authorization: Bearer <token>
```

## Orders API

### Get All Orders

```http
GET /api/orders
Authorization: Bearer <token>
```

### Create Order

```http
POST /api/orders
Authorization: Bearer <token>
```

### Update Order Status

```http
PATCH /api/orders/:id/status
Authorization: Bearer <token>
```

## Users API

### Register User

```http
POST /api/users/register
```

**Request Body**:

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Login User

```http
POST /api/users/login
```

**Request Body**:

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

---

# DATABASE SCHEMA

## Overview

Trendorabay uses MySQL as its primary database with 17 main tables supporting content management, e-commerce, community features, and business operations.

## Database Configuration

- **Database Name**: `trendorabay`
- **Character Set**: UTF-8
- **Connection Pool**: 100 connections

## Core Tables

### users

User accounts and authentication information.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| username | VARCHAR(100) | User's username |
| email | VARCHAR(255) | User's email address |
| password | VARCHAR(255) | Hashed password |
| first_name | VARCHAR(100) | First name |
| last_name | VARCHAR(100) | Last name |
| role | ENUM('user','admin') | User role |
| created_at | TIMESTAMP | Account creation time |

### authors

Content authors and writers.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| name | VARCHAR(255) | Author's full name |
| bio | TEXT | Author biography |
| avatar_url | VARCHAR(500) | Profile image URL |

### stories

Blog posts and articles.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| title | VARCHAR(255) | Story title |
| content | LONGTEXT | Story content |
| featured_image_url | VARCHAR(500) | Featured image URL |
| author_id | INT | Reference to authors |
| category_id | INT | Reference to categories |
| status | ENUM('draft','published') | Publication status |
| featured | TINYINT(1) | Featured flag |

### magazines

Digital magazine publications.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| title | VARCHAR(255) | Magazine title |
| description | TEXT | Magazine description |
| cover_image | VARCHAR(500) | Cover image URL |
| category | VARCHAR(100) | Magazine category |
| pdf_url | VARCHAR(500) | PDF file URL |
| price | DECIMAL(10,2) | Magazine price |
| published | BOOLEAN | Published status |

### podcasts

Audio and video podcast episodes.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| title | VARCHAR(255) | Podcast title |
| description | TEXT | Podcast description |
| audio_url | VARCHAR(500) | Audio file URL |
| video_file_url | VARCHAR(500) | Video file URL |
| duration | INT | Duration in seconds |
| published | BOOLEAN | Published status |

### merchandise

E-commerce product catalog.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| name | VARCHAR(255) | Product name |
| description | TEXT | Product description |
| price | DECIMAL(10,2) | Product price |
| image_url | VARCHAR(500) | Product image URL |
| category | VARCHAR(100) | Product category |
| stock_quantity | INT | Available stock |
| available | BOOLEAN | Availability status |

### orders

Customer orders and purchases.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| user_id | INT | Reference to users |
| items | JSON | Order items |
| total_amount | DECIMAL(10,2) | Total order amount |
| payment_status | ENUM('pending','paid','failed','refunded') | Payment status |
| order_status | ENUM('pending','processing','shipped','delivered','cancelled') | Order status |

## Database Relationships

- **Users → Orders**: One user can have many orders
- **Authors → Stories**: One author can write many stories
- **Categories → Stories**: One category can have many stories
- **Users → Likes**: One user can like many stories
- **Stories → Comments**: One story can have many comments

---

# SYSTEM ARCHITECTURE

## High-Level Architecture

```
User Layer (Web Browser)
         ↓
Frontend Layer (React + Vite + Redux)
         ↓
API Gateway (Express.js Server)
         ↓
    ┌────┴────┐
    ↓         ↓
Data Layer  Cache Layer
(MySQL)    (Redis)
```

## Frontend Architecture

### Technology Stack

- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.3.1
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **HTTP Client**: Axios

### Component Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components
│   ├── magazines/       # Magazine components
│   ├── stories/         # Story components
│   └── merchandise/     # E-commerce components
├── pages/               # Page-level components
├── services/            # API service layer
├── store/               # Redux state management
└── hooks/               # Custom React hooks
```

## Backend Architecture

### Technology Stack

- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js
- **Database**: MySQL with mysql2
- **Caching**: Redis
- **Authentication**: JWT
- **File Upload**: Multer

### Server Structure

```
backend/
├── config/               # Configuration files
├── middleware/           # Express middleware
├── routes/               # API routes
├── database/             # Database migrations
└── server.js             # Main server file
```

### Middleware Stack

```
Request → Security → CORS → Compression → 
Rate Limiting → Body Parsing → Input Sanitization → 
Route Handler → Error Handler → Response
```

## Security Architecture

### Security Layers

1. **Network Security**: HTTPS/TLS, Firewall, DDoS protection
2. **Application Security**: Helmet, CORS, Rate limiting, Input validation
3. **Authentication**: JWT-based with 7-day expiration
4. **Data Security**: Password hashing, SQL injection prevention, XSS protection

## Scalability Architecture

### Horizontal Scaling

Load balancer distributing requests across multiple server instances with shared Redis cache and read replicas for database.

### Performance Optimizations

1. **Connection Pooling**: 100 concurrent database connections
2. **Caching**: Multi-level caching (Redis, application, browser)
3. **Code Splitting**: Lazy loading and dynamic imports
4. **Compression**: Gzip compression for all responses

---

# DEPLOYMENT GUIDE

## Frontend Deployment (Vercel)

### Prerequisites

- Vercel account
- GitHub repository connected to Vercel

### Deployment Steps

1. Configure environment variables in Vercel:
   ```env
   VITE_API_BASE_URL=https://api.yourdomain.com/api
   ```

2. Deploy via Vercel Dashboard:
   - Import GitHub repository
   - Configure build settings
   - Deploy

3. Configure custom domain in Vercel

## Backend Deployment (AWS EC2)

### Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server

# Install Redis
sudo apt install -y redis-server
sudo systemctl enable redis

# Install PM2
sudo npm install -g pm2
```

### Application Setup

```bash
# Clone repository
cd /var/www
git clone https://github.com/your-username/trendorabay.git
cd trendorabay/backend

# Install dependencies
npm install --production

# Configure environment variables
nano .env
```

### Database Setup

```bash
# Create database and user
mysql -u root -p
```

```sql
CREATE DATABASE trendorabay;
CREATE USER 'trendorabay_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON trendorabay.* TO 'trendorabay_user'@'localhost';
FLUSH PRIVILEGES;
```

### Start Application

```bash
# Start with PM2
pm2 start server.js --name "trendorabay-backend"
pm2 startup
pm2 save
```

### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

### SSL Certificate

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

## Backup Strategy

### Database Backups

```bash
#!/bin/bash
BACKUP_DIR="/backups/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

mysqldump -u trendorabay_user -p$DB_PASSWORD trendorabay > $BACKUP_DIR/trendorabay_$DATE.sql
gzip $BACKUP_DIR/trendorabay_$DATE.sql

# Keep last 7 days
find $BACKUP_DIR -name "trendorabay_*.sql.gz" -mtime +7 -delete
```

---

# DEVELOPMENT GUIDE

## Git Workflow

### Branch Strategy

- `main` - Production code
- `develop` - Development code
- `feature/*` - New features
- `bugfix/*` - Bug fixes

### Commit Messages

Follow Conventional Commits:

```
feat: add user authentication
fix: resolve login error
docs: update API documentation
style: format code with prettier
```

## Coding Standards

### JavaScript/Node.js

- Use ES6+ features
- Use `const` and `let`, avoid `var`
- Use arrow functions for callbacks
- Use async/await for asynchronous code
- Handle errors appropriately

### React

- Use functional components with hooks
- Destructure props
- Use meaningful component names
- Follow React best practices

## API Development

### Creating New Endpoints

1. Create route file in `backend/routes/`
2. Register route in `server.js`
3. Add authentication if needed
4. Add validation
5. Test endpoints

## Frontend Development

### Creating Components

1. Create component file
2. Create styles file
3. Use component in app
4. Test functionality

## Testing

### Frontend Testing

```bash
cd frontend
npm test              # Watch mode
npm run test:run      # Run once
npm run test:coverage # With coverage
```

---

# CONTRIBUTING GUIDELINES

## Code of Conduct

Be respectful and constructive in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Submit a pull request

## Pull Request Process

1. Update your branch with latest changes
2. Run tests
3. Create pull request
4. Address review feedback
5. Merge after approval

## Coding Standards

- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly

---

# TROUBLESHOOTING GUIDE

## Backend Issues

### Server Won't Start

**Solutions**:
- Check if port 3001 is in use
- Install missing dependencies
- Check environment variables
- Verify database connection

### Database Connection Failed

**Solutions**:
- Start MySQL service
- Verify database exists
- Check credentials in .env
- Test connection manually

## Frontend Issues

### Development Server Won't Start

**Solutions**:
- Check if port 5173 is in use
- Install dependencies
- Check Vite configuration

### API Connection Errors

**Solutions**:
- Verify backend is running
- Check API URL in .env
- Check for CORS errors

## Database Issues

### Slow Queries

**Solutions**:
- Add indexes
- Optimize queries
- Use pagination
- Enable caching

## Deployment Issues

### Build Fails

**Solutions**:
- Check build logs
- Set environment variables
- Test build locally

## Getting Help

If issues persist:
- Check documentation
- Search existing issues
- Create a new issue with details
- Include error messages and logs

---

## Contact & Support

For additional support:
- Email: support@trendorabay.com
- Website: https://trendorabay.com
- Documentation: /docs/

---

**Trendorabay Platform Documentation - Complete Guide**
*Version 1.0 - 2024*
