# Code Organization Guide

This document describes the code organization patterns used in the Trendorabay backend to make the codebase human-manageable.

## Architecture Overview

The backend follows a layered architecture with clear separation of concerns:

```
backend/
├── config/          # Configuration files (database, redis, etc.)
├── middleware/      # Express middleware
├── routes/          # API route handlers (thin controllers)
├── services/        # Business logic layer
├── utils/           # Utility functions and helpers
├── workers/         # Background job workers
└── server.js        # Application entry point
```

## Route Organization

Large route files have been split into smaller, focused modules:

### Stories Routes (Example)

**Before:** Single 1,016-line file `routes/stories.js`

**After:**
```
routes/
├── stories.js                    # Main router (25 lines)
└── stories/
    ├── homepage.js               # Homepage endpoint
    ├── list.js                   # List, search, latest, featured
    ├── single.js                 # Single story by ID/slug
    ├── crud.js                   # Create, update, delete operations
    └── interactions.js           # Likes, comments, shares, views
```

### Users Routes (Example)

**Before:** Single 691-line file `routes/users.js`

**After:**
```
routes/
├── users.js                      # Main router (12 lines)
└── users/
    ├── auth.js                   # Register, login, logout
    ├── profile.js                # Profile management
    └── password.js               # Password reset
```

## Service Layer

Business logic has been extracted from routes into dedicated service files:

### Story Service (`services/storyService.js`)

Contains all story-related business logic:
- `getHomepageStories()` - Fetch homepage sections
- `getStories(filters)` - Query with filters
- `searchStories(query)` - Search functionality
- `getLatestStories(limit)` - Latest stories
- `getFeaturedStory()` - Featured story
- `getStoryByIdOrId(param)` - Single story lookup
- `createStory(data)` - Create new story
- `updateStory(id, data)` - Update story
- `deleteStory(id)` - Delete story
- `toggleFeatured(id, featured)` - Toggle featured status
- `incrementViews(id)` - Track views

### User Service (`services/userService.js`)

Contains all user-related business logic:
- `hashPassword(password)` - Password hashing
- `comparePassword(password, hash)` - Password verification
- `generateToken(user)` - JWT token generation
- `findUserByEmail(email)` - User lookup by email
- `findUserByUsername(username)` - User lookup by username
- `createUser(userData)` - User creation
- `recordFailedLoginAttempt(email)` - Track failed attempts
- `clearFailedLoginAttempts(email)` - Clear attempts
- `isAccountLocked(email)` - Check lock status
- `sanitizeUser(user)` - Remove sensitive data

## Utility Functions

Common operations have been extracted into reusable utilities:

### Story Helpers (`utils/storyHelpers.js`)

- `getImageUrl(url, category)` - Handle image URLs (Cloudinary, uploads, static)
- `getAvatarUrl(url)` - Handle avatar URLs
- `generateSlug(title, id)` - Generate URL-friendly slugs
- `transformStory(story)` - Transform story data for API response
- `transformStoryWithImages(story)` - Transform with multiple images
- `getStoriesByDisplaySection(pool, status, displaySection)` - Query helper

## Benefits of This Organization

1. **Smaller Files**: Each file is now focused and manageable (20-200 lines vs 600-1000+ lines)
2. **Separation of Concerns**: Routes handle HTTP, services handle business logic, utilities handle transformations
3. **Reusability**: Common functions are in one place, not duplicated across routes
4. **Testability**: Services and utilities can be tested independently
5. **Maintainability**: Changes to business logic don't require touching route handlers
6. **Readability**: Clear file structure makes it easy to find functionality

## Adding New Features

When adding new features, follow this pattern:

1. **Route Handler** (`routes/featureName.js`): Thin HTTP layer
   - Parse request
   - Call service
   - Return response
   - Handle errors

2. **Service** (`services/featureService.js`): Business logic
   - Database queries
   - Data validation
   - Business rules
   - External API calls

3. **Utilities** (`utils/featureHelpers.js`): Reusable helpers
   - Data transformations
   - Common calculations
   - URL handling

## Migration Strategy

The old monolithic route files still exist but have been replaced. The new structure:
- Maintains the same API endpoints
- Uses the same middleware
- Preserves all functionality
- Improves code organization

## Server.js Refactoring

The server.js file has been refactored to separate concerns into dedicated modules:

**Before:** Single 372-line file handling middleware, routes, static files, health checks, and startup

**After:**
```
config/
├── middleware.js         # Middleware setup (security, CORS, compression, etc.)
├── routes.js            # Route registration (API and legacy routes)
├── staticFiles.js       # Static file serving and multer configuration
├── healthChecks.js       # Health check endpoints
└── serverStartup.js      # Server startup logic and validation

server.js (50 lines)      # Main entry point - orchestrates all modules
```

### Benefits

- **Clear separation**: Each module has a single responsibility
- **Easier testing**: Each module can be tested independently
- **Better maintainability**: Changes to middleware don't affect routes
- **Improved readability**: Main server.js is now a simple orchestrator

## Future Improvements

- Add comprehensive unit tests for services
- Add API documentation (OpenAPI/Swagger)
