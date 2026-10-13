# Development Guide

Complete development workflow and guidelines for the Trendorabay Platform.

## Overview

This guide covers the development workflow, coding standards, best practices, and tools used for developing the Trendorabay platform.

## Development Environment Setup

### Prerequisites

- Node.js v16 or higher
- MySQL v8.0 or higher
- Redis (optional but recommended)
- Git
- VS Code or preferred IDE
- Postman or Thunder Client (for API testing)

### Recommended VS Code Extensions

- ESLint - JavaScript linting
- Prettier - Code formatting
- GitLens - Git integration
- Thunder Client - API testing
- MySQL - Database management
- Redis - Redis client
- Auto Rename Tag - HTML/XML tag renaming
- Bracket Pair Colorizer - Bracket matching

### Project Structure

```
trendorabay/
├── backend/                 # Backend API
│   ├── config/             # Configuration files
│   ├── database/           # Database migrations
│   ├── middleware/         # Express middleware
│   ├── routes/             # API routes
│   ├── scripts/            # Utility scripts
│   ├── server.js           # Main server file
│   ├── .env.example        # Environment variables template
│   └── package.json        # Dependencies
├── frontend/               # Frontend React app
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ads/        # AdSense components
│   │   │   ├── cart/       # Shopping cart
│   │   │   ├── common/     # Shared components
│   │   │   ├── events/     # Events
│   │   │   ├── landing/    # Landing page components
│   │   │   ├── magazines/  # Magazine components
│   │   │   ├── merchandise/# E-commerce
│   │   │   └── opportunities/# Opportunities
│   │   ├── pages/          # Page components
│   │   │   ├── LandingPage/ # Landing page
│   │   │   ├── MagazinesPage/
│   │   │   ├── StoriesPage/
│   │   │   ├── StorePage/
│   │   │   ├── CommunityPage/
│   │   │   └── ...          # Other pages
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # Global styles
│   ├── index.html          # HTML template
│   ├── vite.config.js      # Vite configuration
│   └── package.json        # Dependencies
└── docs/                   # Documentation
```

## Development Workflow

### Git Workflow

#### Branch Strategy

- `main` - Production-ready code
- `develop` - Development integration branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Emergency production fixes

#### Branch Naming Conventions

```
feature/user-authentication
feature/magazine-filters
bugfix/login-error
hotfix/security-patch
```

#### Commit Message Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user authentication
fix: resolve login page error
docs: update API documentation
style: format code with prettier
refactor: simplify payment processing
test: add unit tests for user service
chore: update dependencies
```

#### Development Process

1. **Create Feature Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code following coding standards
   - Test your changes
   - Update documentation if needed

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push to Remote**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Go to GitHub/GitLab
   - Create PR from feature branch to develop
   - Include description of changes
   - Request review from team

6. **Code Review**
   - Address review feedback
   - Make necessary changes
   - Update PR

7. **Merge**
   - After approval, merge to develop
   - Delete feature branch

8. **Deploy to Staging**
   - Test in staging environment
   - Verify functionality

9. **Deploy to Production**
   - Merge develop to main
   - Deploy to production

## Coding Standards

### JavaScript/Node.js (Backend)

#### Code Style

- Use ES6+ features
- Use `const` and `let`, avoid `var`
- Use arrow functions for callbacks
- Use template literals for string interpolation
- Use destructuring for objects and arrays
- Use async/await for asynchronous code

#### Example

```javascript
// Good
const getUserById = async (userId) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );
    return rows[0];
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Bad
function getUserById(userId) {
  pool.query('SELECT * FROM users WHERE id = ' + userId, function(err, rows) {
    if (err) {
      console.log('Error');
    }
    return rows[0];
  });
}
```

#### Error Handling

```javascript
// Always handle errors
try {
  const result = await someAsyncOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  throw new Error('Operation failed');
}
```

#### Validation

```javascript
// Use Joi for validation
import Joi from 'joi';

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  username: Joi.string().min(3).max(30).required()
});

const { error, value } = userSchema.validate(req.body);
if (error) {
  return res.status(400).json({ error: error.details[0].message });
}
```

### React (Frontend)

#### Component Structure

```javascript
// Functional components with hooks
import React, { useState, useEffect } from 'react';

const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Side effects
    return () => {
      // Cleanup
    };
  }, [dependencies]);

  const handleClick = () => {
    // Event handler
  };

  return (
    <div className="my-component">
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

#### Hooks Usage

```javascript
// useState for local state
const [count, setCount] = useState(0);

// useEffect for side effects
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);

// useSelector for Redux state
const user = useSelector(state => state.user);

// useDispatch for Redux actions
const dispatch = useDispatch();
```

#### Props Destructuring

```javascript
// Good
const UserCard = ({ name, email, avatar }) => {
  return (
    <div>
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
};

// Bad
const UserCard = (props) => {
  return (
    <div>
      <img src={props.avatar} alt={props.name} />
      <h3>{props.name}</h3>
      <p>{props.email}</p>
    </div>
  );
};
```

#### Conditional Rendering

```javascript
// Good - ternary operator
{isLoggedIn ? <Dashboard /> : <Login />}

// Good - logical AND
{showBanner && <Banner />}

// Good - early return
if (isLoading) return <LoadingSpinner />;

// Bad - if statements in JSX
{if (isLoggedIn) { return <Dashboard /> }}
```

## API Development

### Creating New Endpoints

#### 1. Create Route File

```javascript
// backend/routes/resource.js
import express from 'express';
import pool from '../config/database.js';
import { cache } from '../middleware/cacheMiddleware.js';

const router = express.Router();

// GET all resources
router.get('/', cache(300), async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM resources');
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// GET single resource
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM resources WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Resource not found' 
      });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// POST new resource
router.post('/', async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const [result] = await pool.query(
      'INSERT INTO resources (name, description) VALUES (?, ?)',
      [name, description]
    );
    res.status(201).json({ 
      success: true, 
      data: { id: result.insertId, name, description } 
    });
  } catch (error) {
    next(error);
  }
});

export default router;
```

#### 2. Register Route in Server

```javascript
// backend/server.js
import resourceRoutes from './routes/resource.js';

app.use('/api/resources', resourceRoutes);
```

#### 3. Add Authentication (if needed)

```javascript
import auth from '../middleware/auth.js';

router.post('/', auth, async (req, res, next) => {
  // Protected route
});
```

#### 4. Add Validation

```javascript
import { body, validationResult } from 'express-validator';

router.post('/', [
  body('name').notEmpty().trim(),
  body('description').optional()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Route logic
});
```

### Testing API Endpoints

#### Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create new request
3. Set method (GET, POST, etc.)
4. Set URL: `http://localhost:3001/api/resources`
5. Add headers if needed
6. Add body for POST/PUT requests
7. Send request

#### Using cURL

```bash
# GET request
curl http://localhost:3001/api/resources

# POST request
curl -X POST http://localhost:3001/api/resources \
  -H "Content-Type: application/json" \
  -d '{"name":"Resource Name","description":"Description"}'

# With authentication
curl http://localhost:3001/api/protected \
  -H "Authorization: Bearer your_jwt_token"
```

## Frontend Development

### Creating New Components

#### 1. Create Component File

```javascript
// frontend/src/components/MyComponent.jsx
import React from 'react';
import './MyComponent.css';

const MyComponent = ({ title, items }) => {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyComponent;
```

#### 2. Create Styles

```css
/* frontend/src/components/MyComponent.css */
.my-component {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.my-component h2 {
  color: #333;
  margin-bottom: 16px;
}
```

#### 3. Use Component

```javascript
import MyComponent from './components/MyComponent';

function App() {
  return (
    <MyComponent 
      title="My Title" 
      items={['Item 1', 'Item 2', 'Item 3']} 
    />
  );
}
```

### Creating New Pages

#### 1. Create Page Component

```javascript
// frontend/src/pages/MyPage/MyPage.jsx
import React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchData } from '../../services/myService';

const MyPage = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(state => state.myData);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="my-page">
      <h1>My Page</h1>
      {/* Page content */}
    </div>
  );
};

export default MyPage;
```

#### 2. Add Route

```javascript
// frontend/src/App.jsx
import MyPage from './pages/MyPage/MyPage';

<Route path="/my-page" element={<MyPage />} />
```

### Creating API Services

#### 1. Create Service File

```javascript
// frontend/src/services/myService.js
import api from './api';

export const fetchData = async () => {
  const response = await api.get('/resources');
  return response.data;
};

export const createResource = async (data) => {
  const response = await api.post('/resources', data);
  return response.data;
};

export const updateResource = async (id, data) => {
  const response = await api.put(`/resources/${id}`, data);
  return response.data;
};

export const deleteResource = async (id) => {
  const response = await api.delete(`/resources/${id}`);
  return response.data;
};
```

#### 2. Create Redux Slice

```javascript
// frontend/src/store/slices/mySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchData } from '../../services/myService';

export const fetchResources = createAsyncThunk(
  'resources/fetchResources',
  async () => {
    const data = await fetchData();
    return data;
  }
);

const mySlice = createSlice({
  name: 'resources',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default mySlice.reducer;
```

#### 3. Add Slice to Store

```javascript
// frontend/src/store/store.js
import myReducer from './slices/mySlice';

const store = configureStore({
  reducer: {
    // existing reducers
    resources: myReducer
  }
});
```

## Database Development

### Creating Migrations

#### 1. Create Migration SQL File

```sql
-- backend/database/add_new_column.sql
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
```

#### 2. Create Migration Script

```javascript
// backend/database/add_new_column.js
import pool from '../config/database.js';

const migrate = async () => {
  try {
    await pool.query(`
      ALTER TABLE users ADD COLUMN phone VARCHAR(20)
    `);
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
```

#### 3. Run Migration

```bash
cd backend
node database/add_new_column.js
```

### Running Database Queries

#### Direct MySQL

```bash
mysql -u root -p trendorabay

# Then run SQL queries
SELECT * FROM users LIMIT 10;
```

#### From Node.js

```javascript
import pool from '../config/database.js';

const getUsers = async () => {
  const [rows] = await pool.query('SELECT * FROM users');
  return rows;
};
```

## Testing

### Frontend Testing

#### Unit Tests with Vitest

```javascript
// frontend/src/components/__tests__/MyComponent.test.jsx
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  test('renders title', () => {
    render(<MyComponent title="Test Title" items={[]} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

#### Run Tests

```bash
cd frontend
npm test              # Watch mode
npm run test:run      # Run once
npm run test:coverage # With coverage
```

### Backend Testing

Currently, backend tests are not configured. This is an area for future enhancement.

#### Recommended Testing Setup

```bash
npm install --save-dev jest supertest
```

```javascript
// backend/routes/__tests__/magazines.test.js
import request from 'supertest';
import app from '../../server.js';

describe('Magazine API', () => {
  test('GET /api/magazines', async () => {
    const response = await request(app).get('/api/magazines');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

## Debugging

### Backend Debugging

#### Console Logging

```javascript
console.log('Debug info:', data);
console.error('Error:', error);
```

#### VS Code Debugger

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "program": "${workspaceFolder}/backend/server.js",
      "cwd": "${workspaceFolder}/backend",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

### Frontend Debugging

#### React DevTools

Install React DevTools browser extension for component inspection.

#### Console Logging

```javascript
console.log('Component state:', state);
console.log('API response:', response);
```

#### VS Code Debugger

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug Frontend",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/frontend/src"
    }
  ]
}
```

## Performance Optimization

### Frontend Optimization

#### Code Splitting

```javascript
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

#### Memoization

```javascript
import { memo } from 'react';

const ExpensiveComponent = memo(({ data }) => {
  // Component logic
});
```

#### Image Optimization

```javascript
// Use lazy loading
<img src="image.jpg" loading="lazy" alt="Description" />
```

### Backend Optimization

#### Query Optimization

```javascript
// Use indexes
const [rows] = await pool.query(
  'SELECT * FROM stories WHERE category_id = ?',
  [categoryId]
);

// Select only needed columns
const [rows] = await pool.query(
  'SELECT id, title, created_at FROM stories'
);

// Use LIMIT for pagination
const [rows] = await pool.query(
  'SELECT * FROM stories LIMIT 12 OFFSET 0'
);
```

#### Caching

```javascript
import { cacheGet, cacheSet } from '../config/redis.js';

const getExpensiveData = async (key) => {
  // Try cache first
  const cached = await cacheGet(key);
  if (cached) return cached;

  // Fetch from database
  const data = await fetchFromDatabase();
  
  // Cache the result
  await cacheSet(key, data, 300); // 5 minutes
  return data;
};
```

## Code Review Checklist

### Backend

- [ ] Code follows ES6+ standards
- [ ] Error handling implemented
- [ ] Input validation added
- [ ] SQL injection prevention (parameterized queries)
- [ ] Authentication/authorization if needed
- [ ] API responses are consistent
- [ ] Environment variables used for sensitive data
- [ ] Code is properly commented

### Frontend

- [ ] Component follows React best practices
- [ ] Props are properly destructured
- [ ] State management is appropriate
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Responsive design considered
- [ ] Accessibility features included
- [ ] Code is properly commented

## Common Development Tasks

### Adding New Environment Variable

1. Add to `.env.example`
2. Add to actual `.env` file
3. Use in code: `process.env.VARIABLE_NAME`
4. Update documentation

### Adding New Dependency

```bash
# Backend
cd backend
npm install package-name
npm install --save-dev package-name  # For dev dependencies

# Frontend
cd frontend
npm install package-name
npm install --save-dev package-name  # For dev dependencies
```

### Resetting Database

```bash
# Warning: This deletes all data
mysql -u root -p
DROP DATABASE trendorabay;
CREATE DATABASE trendorabay;
EXIT;

mysql -u root -p trendorabay < backend/config/schema.sql
cd backend
node database/run_migration.js
```

### Clearing Cache

```bash
# Redis
redis-cli FLUSHALL

# Frontend
rm -rf frontend/node_modules/.vite

# Browser
# Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

## Best Practices

### Security

- Never commit `.env` files
- Use strong passwords in production
- Validate all user inputs
- Sanitize data before database operations
- Use HTTPS in production
- Keep dependencies updated

### Performance

- Use pagination for large datasets
- Implement caching for frequently accessed data
- Optimize database queries
- Use code splitting for large applications
- Compress assets
- Use CDN for static assets

### Maintainability

- Write clean, readable code
- Follow consistent naming conventions
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful variable names
- Follow DRY (Don't Repeat Yourself) principle

### Collaboration

- Write descriptive commit messages
- Create pull requests for review
- Review code before merging
- Update documentation with changes
- Communicate changes to team
- Use issue tracking for features/bugs

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port
lsof -i :3001  # Backend
lsof -i :5173  # Frontend

# Kill process
kill -9 <PID>
```

#### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Database Connection Failed

```bash
# Check MySQL is running
sudo systemctl status mysql

# Check credentials in .env
# Test connection
mysql -u user -p -h host database
```

## Resources

### Documentation

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Vite Documentation](https://vite.dev/)

### Learning Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)
- [React Patterns](https://reactpatterns.com/)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)

### Tools

- [Postman](https://www.postman.com/)
- [Thunder Client](https://www.thunderclient.com/)
- [MySQL Workbench](https://www.mysql.com/products/workbench/)
- [Redis Insight](https://redis.com/redis-enterprise/redis-insight/)
