# Contributing Guidelines

Thank you for your interest in contributing to the Trendorabay Platform! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and constructive in all interactions.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of different viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, derogatory comments, or personal attacks
- Trolling or insulting/derogatory comments
- Public or private harassment
- Publishing others' private information without permission
- Other unethical or unprofessional conduct

### Reporting Issues

If you encounter any unacceptable behavior, please contact the project maintainers immediately.

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js v16 or higher installed
- MySQL v8.0 or higher installed
- Git installed and configured
- A GitHub account
- Basic knowledge of JavaScript, React, and Node.js

### Setting Up Development Environment

1. **Fork the Repository**
   - Go to the repository on GitHub
   - Click the "Fork" button in the top right corner

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/your-username/trendorabay.git
   cd trendorabay
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/original-owner/trendorabay.git
   ```

4. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

5. **Configure Environment Variables**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   
   # Frontend
   cd ../frontend
   cp .env.example .env
   # Edit .env with your configuration
   ```

6. **Set Up Database**
   ```bash
   cd backend
   mysql -u root -p < config/schema.sql
   node database/run_migration.js
   ```

7. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## Development Workflow

### Branch Strategy

We use a Git branching model to manage development:

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/***: New features
- **bugfix/***: Bug fixes
- **hotfix/***: Emergency production fixes

### Creating a Feature Branch

1. **Ensure your develop branch is up to date**
   ```bash
   git checkout develop
   git pull upstream develop
   ```

2. **Create a new feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write code following our coding standards
   - Test your changes thoroughly
   - Update documentation if needed

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

### Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

**Examples**:
```
feat(auth): add user registration

fix(magazines): resolve pagination bug

docs(api): update authentication documentation

style(components): format code with prettier
```

## Pull Request Process

### Before Submitting a PR

1. **Update your branch**
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout feature/your-feature-name
   git rebase develop
   ```

2. **Run tests**
   ```bash
   # Frontend tests
   cd frontend
   npm test
   
   # Backend tests (when implemented)
   cd backend
   npm test
   ```

3. **Check code style**
   ```bash
   # Frontend linting
   cd frontend
   npm run lint
   
   # Backend linting (when configured)
   cd backend
   npm run lint
   ```

4. **Build the project**
   ```bash
   # Frontend build
   cd frontend
   npm run build
   ```

### Submitting a Pull Request

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select your feature branch
   - Base: `develop` branch
   - Click "Create Pull Request"

3. **Fill in PR Template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   Describe how you tested your changes
   
   ## Checklist
   - [ ] Code follows project style guidelines
   - [ ] Tests pass locally
   - [ ] Documentation updated
   - [ ] No merge conflicts
   ```

### PR Review Process

1. **Automated Checks**
   - CI/CD pipeline runs tests
   - Code style checks
   - Build verification

2. **Code Review**
   - Maintainers review your code
   - Feedback provided via comments
   - Address review feedback

3. **Approval and Merge**
   - At least one maintainer approval required
   - No unresolved conflicts
   - All checks must pass

4. **Merge**
   - Squash and merge preferred
   - Commit message standardized
   - Branch deleted after merge

## Coding Standards

### JavaScript/Node.js (Backend)

#### Code Style

- Use ES6+ features
- Use `const` and `let`, avoid `var`
- Use arrow functions for callbacks
- Use template literals
- Use async/await for asynchronous code
- Follow Prettier configuration

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
```

#### Error Handling

Always handle errors appropriately:

```javascript
try {
  const result = await someOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  throw new Error('Operation failed');
}
```

### React (Frontend)

#### Component Structure

```javascript
import React, { useState, useEffect } from 'react';

const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Side effects
    return () => {
      // Cleanup
    };
  }, [dependencies]);

  return (
    <div className="my-component">
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

#### Hooks Usage

- Use `useState` for local state
- Use `useEffect` for side effects
- Use `useSelector` for Redux state
- Use `useDispatch` for Redux actions

#### Naming Conventions

- Components: PascalCase (`MyComponent`)
- Functions: camelCase (`getUserData`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)
- Files: kebab-case (`my-component.jsx`)

## Testing Guidelines

### Frontend Testing

#### Unit Tests

```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

#### Running Tests

```bash
cd frontend
npm test              # Watch mode
npm run test:run      # Run once
npm run test:coverage # With coverage
```

### Backend Testing

Currently, backend tests are not configured. This is an area for enhancement.

#### Setting Up Tests

```bash
cd backend
npm install --save-dev jest supertest
```

## Documentation

### When to Update Documentation

Update documentation when you:
- Add new features
- Change existing functionality
- Modify API endpoints
- Update database schema
- Change configuration options
- Fix bugs that affect users

### Documentation Files

- **README.md**: Project overview and quick start
- **INSTALLATION.md**: Setup instructions
- **API_REFERENCE.md**: API documentation
- **DATABASE_SCHEMA.md**: Database documentation
- **ARCHITECTURE.md**: System architecture
- **DEPLOYMENT.md**: Deployment guide
- **DEVELOPMENT_GUIDE.md**: Development workflow
- **CONTRIBUTING.md**: This file
- **TROUBLESHOOTING.md**: Common issues and solutions

### Code Comments

- Add comments for complex logic
- Document function parameters and return values
- Explain non-obvious code
- Keep comments up to date with code changes

## Reporting Issues

### Before Reporting

1. **Search existing issues**
   - Check if the issue has already been reported
   - Add comments to existing issues if relevant

2. **Gather information**
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable
   - Environment details (OS, Node.js version, etc.)

### Issue Report Template

```markdown
## Description
Clear description of the issue

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Screenshots
If applicable, add screenshots

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Node.js version: [e.g., 18.0.0]
- Browser: [e.g., Chrome, Firefox]

## Additional Context
Any other relevant information
```

## Feature Requests

### Before Requesting

1. **Check if feature already exists**
   - Review existing functionality
   - Check documentation

2. **Search existing feature requests**
   - Look for similar requests
   - Add comments to existing requests

### Feature Request Template

```markdown
## Feature Description
Clear description of the desired feature

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
What alternatives did you consider?

## Additional Context
Any other relevant information
```

## Questions and Discussions

### Getting Help

- Check documentation first
- Search existing issues and discussions
- Create a new discussion for questions
- Be specific and provide context

### Discussion Guidelines

- Use descriptive titles
- Provide context and background
- Be respectful of others' time
- Follow up on your discussions

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

## License

By contributing to this project, you agree that your contributions will be licensed under the project's license.

## Contact

For questions about contributing:
- Open a GitHub discussion
- Contact maintainers via email
- Join our community chat (if available)

## Additional Resources

- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [React Documentation](https://react.dev/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

Thank you for contributing to Trendorabay! Your contributions help make this project better for everyone.
