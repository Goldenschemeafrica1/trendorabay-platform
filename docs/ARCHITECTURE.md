# System Architecture

Complete system architecture documentation for the Trendorabay Platform.

## Overview

Trendorabay follows a modern monolithic architecture with clear separation between frontend and backend. The system is designed for scalability, maintainability, and performance.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Layer                          │
│  (Web Browser - Chrome, Firefox, Safari, Edge)              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Frontend Layer                         │
│  React 19.2.0 + Vite 7.3.1 + Redux Toolkit                 │
│  - Component-based UI                                        │
│  - Client-side routing                                       │
│  - State management                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       API Gateway                           │
│  Express.js Server (Port 3001)                              │
│  - RESTful API                                               │
│  - Authentication & Authorization                           │
│  - Rate Limiting                                             │
│  - Request Validation                                        │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌───────────────────────┐       ┌───────────────────────┐
│   Data Layer          │       │   Cache Layer         │
│  - MySQL Database     │       │  - Redis              │
│  - Connection Pool    │       │  - Query Caching      │
│  - Data Persistence   │       │  - Rate Limiting      │
└───────────────────────┘       └───────────────────────┘
```

## Frontend Architecture

### Technology Stack

- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.3.1
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM 7.13.0
- **HTTP Client**: Axios 1.18.1
- **UI Components**: Lucide React, React Icons
- **Notifications**: React Toastify 11.0.5
- **Security**: DOMPurify 3.4.10

### Component Architecture

```
src/
├── components/           # Reusable UI components
│   ├── ads/            # Google AdSense components
│   ├── cart/           # Shopping cart components
│   ├── common/          # Shared components (Header, Footer, etc.)
│   ├── events/          # Events components
│   ├── landing/         # Landing page components
│   │   ├── HeroSection.jsx
│   │   ├── MagazineSection.jsx
│   │   ├── CommunityCard.jsx
│   │   └── ...
│   ├── magazines/       # Magazine-specific components
│   ├── merchandise/     # E-commerce components
│   ├── opportunities/   # Opportunities components
│   └── forms/           # Form components
├── pages/               # Page-level components
│   ├── AboutPage/       # About page
│   ├── AdvertisePage/   # Advertising page
│   ├── CheckoutPage/    # Checkout process
│   ├── CommunityPage/   # Community features
│   ├── ContactPage/     # Contact page
│   ├── DonatePage/      # Donation page
│   ├── ForgotPasswordPage/ # Password recovery
│   ├── GalleryPage/     # Photo gallery
│   ├── LandingPage/     # Landing page
│   ├── Legal/           # Legal pages (Terms, Privacy)
│   ├── LoginPage/       # User login
│   ├── MagazinesPage/   # Magazines listing & detail
│   ├── MissionPage/     # Mission statement
│   ├── MusicPage/       # Music community
│   ├── NotFoundPage/    # 404 page
│   ├── OpportunityDetailPage/ # Opportunity details
│   ├── OrdersPage/      # User orders
│   ├── PartnerPage/     # Partner program
│   ├── ProfilePage/     # User profile
│   ├── SearchPage/      # Search functionality
│   ├── SettingsPage/    # User settings
│   ├── SignupPage/      # User registration
│   ├── StoriesPage/     # Stories listing & detail
│   ├── StorePage/       # E-commerce store
│   ├── SubscribePage/   # Subscription page
│   └── WritersPage/     # Writers/contributors
├── services/            # API service layer
├── store/               # Redux state management
│   ├── slices/          # Redux slices
│   └── hooks/           # Custom hooks
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
└── styles/              # Global styles
```

### State Management

**Redux Store Structure**:

```javascript
{
  cart: {
    items: [],
    total: 0,
    isDrawerOpen: false
  },
  magazines: {
    items: [],
    currentMagazine: null,
    loading: false
  },
  merch: {
    products: [],
    currentProduct: null,
    loading: false
  },
  stories: {
    stories: [],
    currentStory: null,
    loading: false
  },
  ui: {
    isLoading: false,
    modalOpen: false,
    notifications: []
  }
}
```

### Routing Architecture

**Route Structure**:

```javascript
/                           # Home page
/magazines                  # Magazines listing
/magazines/:id              # Magazine detail
/magazines/category/:cat    # Category filter
/stories                    # Stories listing
/stories/:id                # Story detail
/stories/latest             # Latest stories
/author/:id                 # Author page
/store                      # Product listing
/merchandise/:id            # Product detail
/cart                       # Shopping cart
/checkout                   # Checkout process
/podcast                    # Podcasts listing
/podcast/:id                # Podcast detail
/community                  # Community hub
/events                     # Events listing
/login                      # User login
/signup                     # User registration
/profile                    # User profile
/orders                     # Order history
```

### Component Communication

1. **Parent to Child**: Props
2. **Child to Parent**: Callback functions
3. **Global State**: Redux store
4. **Context**: React Context for theme, auth
5. **API Calls**: Service layer with Axios

### Performance Optimizations

1. **Code Splitting**: Vite automatic code splitting
2. **Lazy Loading**: React.lazy() for route components
3. **Memoization**: React.memo for expensive components
4. **Debouncing**: For search and form inputs
5. **Image Optimization**: Lazy loading for images
6. **Bundle Optimization**: Manual chunks (vendor, redux, ui)

### Security Features

1. **XSS Protection**: DOMPurify for user-generated content
2. **CSRF Protection**: Token-based authentication
3. **Input Validation**: Form validation before submission
4. **Secure Headers**: Content Security Policy
5. **API Security**: JWT tokens for protected routes

## Backend Architecture

### Technology Stack

- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js 4.18.2
- **Database**: MySQL 8.0+ with mysql2
- **Caching**: Redis 6.1.0
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer 2.2.0
- **Validation**: Joi 17.11.0, express-validator 7.3.2
- **Security**: Helmet 8.2.0, cors 2.8.5
- **Rate Limiting**: express-rate-limit 8.5.2

### Server Structure

```
backend/
├── config/               # Configuration files
│   ├── database.js       # Database connection
│   ├── redis.js          # Redis configuration
│   └── schema.sql        # Database schema
├── middleware/           # Express middleware
│   ├── auth.js           # JWT authentication
│   ├── cors.js           # CORS configuration
│   ├── errorHandler.js   # Error handling
│   ├── rateLimiter.js    # Rate limiting
│   ├── redisRateLimiter.js # Redis-based rate limiting
│   ├── security.js       # Security headers
│   ├── validator.js      # Input validation
│   └── cacheMiddleware.js # Query caching
├── routes/               # API routes
│   ├── magazines.js      # Magazine endpoints
│   ├── stories.js        # Story endpoints
│   ├── podcasts.js       # Podcast endpoints
│   ├── merchandise.js    # Product endpoints
│   ├── orders.js         # Order endpoints
│   ├── users.js          # User endpoints
│   ├── contributors.js   # Contributor endpoints
│   └── ...               # Other routes
├── database/             # Database migrations
├── scripts/              # Utility scripts
└── server.js             # Main server file
```

### Middleware Stack

```javascript
Request → Security Middleware → CORS → Compression → 
Rate Limiting → Body Parsing → Input Sanitization → 
Route Handler → Error Handler → Response
```

### API Design Principles

1. **RESTful Design**: Standard HTTP methods (GET, POST, PUT, DELETE)
2. **Resource-Based URLs**: `/api/resource/:id`
3. **HTTP Status Codes**: Proper status codes for responses
4. **JSON Format**: Consistent JSON request/response format
5. **Versioning**: URL-based versioning for future updates
6. **Pagination**: Consistent pagination for list endpoints
7. **Filtering**: Query parameters for filtering and sorting
8. **Error Handling**: Consistent error response format

### Database Architecture

**Connection Pool Configuration**:

```javascript
{
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 100,
  waitForConnections: true,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
}
```

**Query Patterns**:

1. **Prepared Statements**: Parameterized queries for security
2. **Connection Pooling**: Reuse database connections
3. **Index Optimization**: Strategic indexes for performance
4. **Transaction Management**: For complex operations
5. **Query Caching**: Redis caching for frequent queries

### Caching Strategy

**Multi-Level Caching**:

1. **Redis Cache**: Distributed caching layer
   - Query result caching (5-minute TTL)
   - Rate limiting data
   - Session storage

2. **Application Cache**: In-memory caching
   - Contributor data (5-minute TTL)
   - Frequently accessed data

3. **Browser Cache**: HTTP caching headers
   - Static assets (images, CSS, JS)
   - API responses (Cache-Control headers)

**Cache Invalidation**:

- Time-based expiration (TTL)
- Manual invalidation on data updates
- Pattern-based invalidation for bulk updates

### Security Architecture

**Security Layers**:

1. **Network Security**
   - HTTPS/TLS encryption
   - Firewall rules
   - DDoS protection

2. **Application Security**
   - Helmet.js for security headers
   - CORS configuration
   - Rate limiting
   - Input validation and sanitization

3. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control
   - Token expiration (7 days)
   - Secure token storage

4. **Data Security**
   - Password hashing (bcrypt)
   - SQL injection prevention
   - XSS protection
   - CSRF protection

**Security Headers**:

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

### File Upload Architecture

**Upload Flow**:

```
Client → Multer Middleware → Validation → 
Memory Storage → Database → Serve via Static Route
```

**File Upload Configuration**:

```javascript
{
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif',
      'audio/mpeg', 'video/mp4', 'application/pdf'
    ];
    cb(null, allowedTypes.includes(file.mimetype));
  }
}
```

### Error Handling Architecture

**Error Handling Flow**:

```
Route Handler → Next(error) → Error Handler → 
Error Type Detection → Appropriate Response → Log Error
```

**Error Types**:

1. **Validation Errors**: 400 Bad Request
2. **Authentication Errors**: 401 Unauthorized
3. **Authorization Errors**: 403 Forbidden
4. **Not Found Errors**: 404 Not Found
5. **Conflict Errors**: 409 Conflict
6. **Server Errors**: 500 Internal Server Error

## Data Flow Architecture

### Request Flow

```
1. User Action (Frontend)
2. Component Dispatches Action (Redux)
3. Service Layer Makes API Call (Axios)
4. API Request to Backend (Express)
5. Middleware Processing
6. Route Handler
7. Database Query
8. Response Processing
9. Cache Update (if applicable)
10. Response to Frontend
11. Redux State Update
12. Component Re-render
```

### Data Flow Examples

**User Login Flow**:

```
1. User enters credentials
2. Frontend validates input
3. POST /api/users/login
4. Backend validates credentials
5. JWT token generated
6. Token stored in localStorage
7. User redirected to dashboard
8. Protected routes check token
```

**Purchase Flow**:

```
1. User adds items to cart (Redux state)
2. Cart persisted to localStorage
3. User proceeds to checkout
4. POST /api/orders
5. Order created in database
6. Payment processed
7. Order status updated
8. User redirected to success page
9. Order confirmation sent
```

## Scalability Architecture

### Horizontal Scaling

**Load Balancer Setup**:

```
                    ┌─────────────┐
                    │ Load Balancer│
                    └─────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ Server 1 │    │ Server 2 │    │ Server 3 │
    └──────────┘    └──────────┘    └──────────┘
          │                │                │
          └────────────────┼────────────────┘
                           ▼
                    ┌─────────────┐
                    │   Redis     │
                    └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   MySQL     │
                    └─────────────┘
```

### Database Scaling

**Read Replicas**:

```
              ┌─────────────┐
              │   Master    │ (Write)
              └─────────────┘
                     │
      ┌──────────────┼──────────────┐
      ▼              ▼              ▼
┌──────────┐   ┌──────────┐   ┌──────────┐
│ Replica 1│   │ Replica 2│   │ Replica 3│ (Read)
└──────────┘   └──────────┘   └──────────┘
```

### Caching Strategy

**Cache Hierarchy**:

1. **L1 Cache**: Application memory (fastest, smallest)
2. **L2 Cache**: Redis (fast, medium size)
3. **L3 Cache**: Database (slowest, largest)

**Cache Patterns**:

- **Cache-Aside**: Application manages cache
- **Write-Through**: Write to cache and database
- **Write-Back**: Write to cache, async to database
- **Cache-Invalidation**: Time-based and event-based

## Performance Architecture

### Frontend Performance

1. **Code Splitting**: Lazy load routes and components
2. **Tree Shaking**: Remove unused code
3. **Minification**: Minify JavaScript and CSS
4. **Image Optimization**: Compress and lazy load images
5. **Bundle Size**: Optimize bundle size with code splitting
6. **CDN**: Serve static assets via CDN

### Backend Performance

1. **Connection Pooling**: Reuse database connections
2. **Query Optimization**: Optimize SQL queries
3. **Indexing**: Strategic database indexes
4. **Caching**: Multi-level caching strategy
5. **Compression**: Gzip compression for responses
6. **Rate Limiting**: Prevent abuse and ensure fair usage

### Performance Monitoring

**Key Metrics**:

- Response time (p50, p95, p99)
- Error rate
- Throughput (requests per second)
- Database query time
- Cache hit rate
- Memory usage
- CPU usage

## Deployment Architecture

### Development Environment

```
Local Machine → Git → Local Development
- Hot module replacement
- Source maps
- Debug mode
```

### Production Environment

```
Git → CI/CD → Build → Deploy
- Minified bundles
- Source maps disabled
- Production configuration
- Environment variables
```

### Infrastructure

**Recommended Setup**:

- **Frontend**: Vercel or Netlify
- **Backend**: AWS EC2, Heroku, or DigitalOcean
- **Database**: AWS RDS or managed MySQL
- **Cache**: AWS ElastiCache or managed Redis
- **CDN**: Cloudflare or AWS CloudFront
- **Load Balancer**: AWS ALB or Nginx

## Monitoring Architecture

### Logging Strategy

**Log Levels**:

1. **Error**: Critical errors requiring immediate attention
2. **Warn**: Warning messages for potential issues
3. **Info**: Informational messages
4. **Debug**: Detailed debugging information

**Log Destinations**:

- Console output (development)
- File logging (production)
- Log aggregation service (e.g., ELK Stack)
- Cloud logging (e.g., AWS CloudWatch)

### Health Checks

**Health Check Endpoints**:

- `/api/health` - Basic health check
- `/api/ready` - Readiness check for load balancers
- Database connection status
- Redis connection status
- Disk space check
- Memory usage check

### Monitoring Tools

**Recommended Tools**:

- **Application Performance Monitoring**: New Relic, Datadog
- **Error Tracking**: Sentry, Rollbar
- **Log Management**: ELK Stack, Splunk
- **Uptime Monitoring**: Pingdom, UptimeRobot
- **Database Monitoring**: MySQL Enterprise Monitor

## Development Workflow

### Git Workflow

**Branch Strategy**:

- `main` - Production code
- `develop` - Development code
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Emergency fixes

### Code Review Process

1. Create feature branch
2. Make changes and commit
3. Push to remote
4. Create pull request
5. Code review
6. Address feedback
7. Merge to develop
8. Deploy to staging
9. Test
10. Merge to main
11. Deploy to production

## Security Architecture

### Threat Model

**Common Threats**:

1. **SQL Injection**: Prevented with parameterized queries
2. **XSS Attacks**: Prevented with input sanitization and DOMPurify
3. **CSRF Attacks**: Prevented with JWT tokens
4. **DDoS Attacks**: Mitigated with rate limiting
5. **Brute Force**: Prevented with rate limiting and account lockout
6. **Data Breaches**: Prevented with encryption and access controls

### Security Best Practices

1. **Principle of Least Privilege**: Minimal access required
2. **Defense in Depth**: Multiple security layers
3. **Security by Design**: Built into architecture
4. **Regular Updates**: Keep dependencies updated
5. **Security Audits**: Regular security reviews
6. **Incident Response**: Plan for security incidents

## Future Architecture Enhancements

### Planned Improvements

1. **Microservices**: Split into microservices for better scalability
2. **Event-Driven Architecture**: Implement message queues
3. **GraphQL**: Alternative to REST for flexible queries
4. **Real-time Features**: WebSockets for live updates
5. **CDN Integration**: Global content delivery
6. **Database Sharding**: Horizontal database scaling
7. **API Gateway**: Centralized API management
8. **Service Mesh**: Microservices communication

### Technology Roadmap

**Short-term** (3-6 months):
- Enhanced testing coverage
- API documentation with Swagger
- Comprehensive monitoring
- Background job processing

**Medium-term** (6-12 months):
- Microservices architecture
- Event-driven architecture
- Real-time features
- Mobile API

**Long-term** (12+ months):
- GraphQL API
- Service mesh
- Advanced caching strategies
- Machine learning integration
