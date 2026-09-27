# Contributing to Trendorabay

Thank you for contributing to the **Trendorabay Platform**.

Trendorabay is a **proprietary company digital media platform**. Contributions are made by authorized developers, employees, contractors, and other approved contributors working on behalf of or with permission from the company.

This document explains the development workflow, coding expectations, testing practices, pull request process, security requirements, and contribution guidelines.

> **Important:** This is a private company project. Repository access does not grant permission to copy, publish, distribute, sublicense, or reuse the source code outside authorized company activities.

---

## Table of Contents

* [Code of Conduct](#code-of-conduct)
* [Getting Started](#getting-started)
* [Development Workflow](#development-workflow)
* [Branching Strategy](#branching-strategy)
* [Commit Message Guidelines](#commit-message-guidelines)
* [Pull Request Process](#pull-request-process)
* [Coding Standards](#coding-standards)
* [Testing Guidelines](#testing-guidelines)
* [Security Guidelines](#security-guidelines)
* [Database Changes](#database-changes)
* [Documentation](#documentation)
* [Reporting Issues](#reporting-issues)
* [Feature Requests](#feature-requests)
* [Questions and Discussions](#questions-and-discussions)
* [Recognition](#recognition)
* [Proprietary Software and Contributions](#proprietary-software-and-contributions)

---

# Code of Conduct

## Our Pledge

We are committed to maintaining a professional, respectful, and collaborative development environment.

All contributors are expected to communicate professionally and treat other team members and contributors with respect.

## Our Standards

Contributors should:

* Use respectful and professional language
* Accept constructive feedback
* Give constructive feedback
* Respect different technical perspectives
* Communicate clearly
* Document important decisions
* Raise concerns early
* Help maintain a positive development environment

## Unacceptable Behavior

The following behavior is not acceptable:

* Harassment
* Personal attacks
* Discrimination
* Threatening behavior
* Deliberately disruptive conduct
* Sharing private or confidential information without authorization
* Unauthorized access to systems or data
* Deliberate damage to company systems
* Other unethical or unprofessional conduct

Concerns should be reported privately to the project lead or appropriate company representative.

---

# Getting Started

## Repository Access

Trendorabay is maintained in a private company repository.

Before contributing, make sure you have:

* Authorized repository access
* Access to the required development resources
* Node.js installed
* MySQL installed
* Git installed and configured
* Access to required project documentation
* Appropriate local development configuration

Repository access is provided only to authorized contributors.

Do not share repository credentials or access with unauthorized individuals.

---

## Prerequisites

Recommended development environment:

* Node.js 16+
* npm or Yarn
* MySQL 8+
* Git
* Redis where required
* Modern web browser
* GitHub account with authorized repository access

Check the project README and installation documentation for the currently supported versions.

---

# Setting Up the Development Environment

## 1. Clone the Repository

Because the repository is private, contributors should clone the company repository using their authorized GitHub access.

```bash
git clone <company-repository-url>
cd trendorabay-platform
```

Do not create or publish unauthorized public copies of the repository.

---

## 2. Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd ../frontend
npm install
```

---

## 3. Configure Environment Variables

Create local environment files from the provided examples.

### Backend

```bash
cd backend
cp .env.example .env
```

### Frontend

```bash
cd ../frontend
cp .env.example .env
```

Configure the values required for your local environment.

Example backend configuration:

```env
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_local_database_password
DB_NAME=trendorabay

FRONTEND_URL=http://localhost:5173

JWT_SECRET=your_local_development_secret

REDIS_URL=redis://localhost:6379
```

Never commit:

```text
.env
.env.local
.env.production
```

Never commit:

* Production credentials
* Database passwords
* API keys
* JWT secrets
* Private keys
* Access tokens
* Payment credentials
* Cloud credentials
* Third-party service credentials

Each developer should use appropriate local development credentials.

---

## 4. Set Up the Database

Use the project's database schema and migration process.

```bash
cd backend
mysql -u root -p < config/schema.sql
```

If migrations are configured:

```bash
node database/run_migration.js
```

Do not connect local development directly to production databases unless explicitly authorized.

Do not use production data in local development unless specifically approved and handled according to company security requirements.

---

## 5. Start the Development Servers

### Backend

```bash
cd backend
npm run dev
```

The backend normally runs on:

```text
http://localhost:3001
```

Health check:

```text
http://localhost:3001/api/health
```

### Frontend

In another terminal:

```bash
cd frontend
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

---

# Development Workflow

Contributions should follow the project's standard development workflow:

```text
Task / Issue
     ↓
Understand Requirements
     ↓
Discuss Significant Changes
     ↓
Create Branch
     ↓
Implement
     ↓
Test
     ↓
Self Review
     ↓
Push Branch
     ↓
Pull Request
     ↓
Code Review
     ↓
Address Feedback
     ↓
Approval
     ↓
Merge
```

---

# Branching Strategy

Do not develop directly on protected branches unless specifically authorized.

Recommended branch naming:

```text
feature/<description>
fix/<description>
refactor/<description>
docs/<description>
test/<description>
chore/<description>
hotfix/<description>
```

Examples:

```text
feature/podcast-search
feature/creator-profiles
fix/cart-total
fix/authentication-error
docs/api-authentication
test/user-registration
refactor/api-response-handler
```

---

## Creating a Branch

Make sure your base branch is current:

```bash
git checkout main
git pull origin main
```

Create your branch:

```bash
git checkout -b feature/your-feature-name
```

Make your changes, test them, and commit them.

---

# Commit Message Guidelines

Use clear and descriptive commit messages.

Recommended format:

```text
<type>(<scope>): <description>
```

Examples:

```text
feat(auth): add user registration
fix(magazines): resolve pagination bug
docs(api): update authentication documentation
test(users): add registration tests
refactor(api): simplify response handling
```

Common commit types:

* `feat` — New feature
* `fix` — Bug fix
* `docs` — Documentation
* `style` — Formatting/style changes
* `refactor` — Code restructuring
* `perf` — Performance improvements
* `test` — Tests
* `chore` — Maintenance
* `ci` — CI/CD changes

Avoid vague messages such as:

```text
fix
changes
update
stuff
work
final
```

---

# Pull Request Process

## Before Opening a Pull Request

Update your branch:

```bash
git fetch origin
git rebase origin/main
```

Resolve conflicts carefully and run tests after resolving conflicts.

---

## Run Tests

### Frontend

```bash
cd frontend
npm test
```

For a single test run:

```bash
npm run test:run
```

For coverage:

```bash
npm run test:coverage
```

### Backend

If backend tests are configured:

```bash
cd backend
npm test
```

---

## Run Linting

Frontend:

```bash
cd frontend
npm run lint
```

Backend:

```bash
cd backend
npm run lint
```

Run only commands that are configured in the project.

---

## Build the Frontend

```bash
cd frontend
npm run build
```

Make sure the production build completes successfully before submitting significant frontend changes.

---

# Submitting a Pull Request

Push your branch:

```bash
git push origin feature/your-feature-name
```

Open a Pull Request against the appropriate protected branch.

Your PR should clearly explain:

### Description

What changed?

### Reason

Why was the change necessary?

### Testing

How was the change tested?

### Additional Changes

Mention any:

* Database changes
* API changes
* Environment variable changes
* Dependency changes
* Breaking changes
* Deployment requirements
* Security considerations

### Screenshots

For UI changes, include screenshots where useful.

---

## Pull Request Checklist

```markdown
## Description

Describe the changes.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactoring
- [ ] Documentation
- [ ] Testing
- [ ] Performance
- [ ] Security
- [ ] Breaking change

## Testing

Describe how the changes were tested.

## Checklist

- [ ] Code follows project conventions
- [ ] Tests pass locally
- [ ] Linting passes
- [ ] Build succeeds where applicable
- [ ] Documentation updated where necessary
- [ ] Database changes documented
- [ ] Environment changes documented
- [ ] No secrets committed
- [ ] No unrelated changes included
```

---

# Pull Request Review Process

## 1. Automated Checks

Where configured, CI/CD may run:

* Tests
* Linting
* Build verification
* Security checks
* Dependency checks

## 2. Code Review

Reviewers may evaluate:

* Correctness
* Security
* Maintainability
* Performance
* Testing
* Architecture
* API design
* Database impact
* Accessibility
* User experience

## 3. Address Feedback

Contributors should respond to review comments and update their branch when changes are requested.

## 4. Approval

Required approvals depend on repository branch protection and company development policies.

## 5. Merge

Only authorized contributors should merge changes into protected branches.

---

# Coding Standards

## JavaScript / Node.js

Use modern JavaScript practices.

Prefer:

```javascript
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

Guidelines:

* Use `const` and `let`
* Avoid `var`
* Use `async/await` for asynchronous operations
* Use parameterized database queries
* Validate external input
* Handle errors appropriately
* Avoid unnecessary dependencies
* Follow the project's formatting configuration

---

# React Standards

## Component Structure

Prefer focused, reusable components.

Example:

```javascript
import React, { useEffect, useState } from 'react';

const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Side effects
  }, []);

  return (
    <div className="my-component">
      {/* Component content */}
    </div>
  );
};

export default MyComponent;
```

## Hooks

Use hooks appropriately:

* `useState` for local state
* `useEffect` for side effects
* `useSelector` for Redux state
* `useDispatch` for Redux actions

Avoid unnecessary global state.

---

# Naming Conventions

Components:

```text
MyComponent
UserProfile
PodcastCard
```

Functions:

```text
getUserData
createPodcast
handleSubmit
```

Constants:

```text
API_BASE_URL
MAX_UPLOAD_SIZE
DEFAULT_PAGE_SIZE
```

Use the existing project naming conventions for files and folders.

---

# Backend Guidelines

Backend contributions should:

* Validate request input
* Verify authentication
* Verify authorization
* Use parameterized database queries
* Return appropriate HTTP status codes
* Avoid exposing sensitive information
* Handle errors consistently
* Keep business logic organized
* Consider API performance
* Update API documentation when endpoints change

Never bypass authentication or authorization controls simply to make development easier.

---

# Database Guidelines

Before changing the database:

* Understand existing relationships
* Review affected queries
* Consider indexes and performance
* Consider backward compatibility
* Document schema changes
* Use migrations where supported
* Avoid destructive changes without approval

Never modify production data directly unless explicitly authorized.

---

# Testing Guidelines

Testing should be included with new functionality whenever practical.

## Frontend

Current frontend testing may use:

* Vitest
* React Testing Library

Example:

```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent />);

    expect(
      screen.getByText('Expected Text')
    ).toBeInTheDocument();
  });
});
```

Run:

```bash
cd frontend
npm test
```

---

## Backend

Backend automated testing is being expanded.

Where appropriate, backend tests may cover:

* API endpoints
* Authentication
* Authorization
* Validation
* Business logic
* Database operations
* Error handling
* Integration behavior

New backend functionality should include tests where practical.

---

# Bug Fixes

Before fixing a bug:

1. Reproduce the issue
2. Identify the affected component/system
3. Determine the likely cause
4. Implement the smallest appropriate fix
5. Test the fix
6. Add a regression test where practical
7. Update documentation if necessary

A bug fix PR should explain:

* What was broken
* Why it happened
* What was changed
* How it was tested

---

# New Features

Before implementing a significant feature:

1. Understand the problem being solved
2. Review existing functionality
3. Check whether a similar feature already exists
4. Discuss significant architectural changes
5. Consider security implications
6. Consider database/API changes
7. Define the smallest practical implementation
8. Implement and test
9. Update documentation
10. Submit a focused PR

Large features should be divided into smaller, reviewable changes where practical.

---

# Security Guidelines

Security is everyone's responsibility.

Contributors must:

* Protect credentials
* Validate user input
* Verify authentication
* Verify authorization
* Use secure database queries
* Protect API endpoints
* Keep dependencies updated
* Follow existing security middleware
* Avoid exposing sensitive information
* Avoid committing secrets
* Avoid unnecessary access to production systems
* Avoid copying production data into development environments without authorization

The platform may use security mechanisms including:

* Helmet
* CORS controls
* Rate limiting
* Input validation
* Input sanitization
* JWT authentication
* File validation
* Path traversal protection
* DOMPurify
* Secure environment configuration

Do not disable security controls simply to bypass development problems.

---

# Do Not Commit Secrets

Never commit:

```text
.env
.env.local
.env.production
```

or files containing:

* Passwords
* API keys
* JWT secrets
* Private keys
* Access tokens
* Database credentials
* Payment credentials
* Cloud credentials
* Third-party service credentials

If a secret is accidentally committed:

1. Do not simply delete it from the latest commit
2. Notify the appropriate project administrator immediately
3. Treat the credential as compromised
4. Rotate/revoke the credential where appropriate
5. Follow the company's security response process

---

# Dependencies

Before adding a dependency:

* Check whether existing project functionality can solve the problem
* Confirm the dependency is necessary
* Check compatibility
* Check maintenance status
* Consider security implications
* Consider bundle/runtime impact
* Discuss significant dependencies with the project lead

Avoid adding dependencies for functionality that can reasonably be implemented using existing project tools.

---

# Documentation

Documentation should be updated when changes affect:

* Features
* APIs
* Database schema
* Environment variables
* Installation
* Configuration
* Deployment
* Architecture
* Developer workflows
* User-facing behavior

Relevant documentation includes:

* `README.md`
* `INSTALLATION.md`
* `API_REFERENCE.md`
* `DATABASE_SCHEMA.md`
* `ARCHITECTURE.md`
* `DEPLOYMENT.md`
* `DEVELOPMENT_GUIDE.md`
* `CONTRIBUTING.md`
* `TROUBLESHOOTING.md`

---

# Code Comments

Comments should explain **why**, not merely repeat what the code does.

Add comments for:

* Complex logic
* Important architectural decisions
* Non-obvious workarounds
* Security-sensitive behavior
* Complex business rules

Keep comments accurate as the code changes.

---

# Reporting Issues

Before reporting an issue:

1. Check existing issues
2. Check the documentation
3. Confirm the issue is reproducible
4. Gather relevant environment information
5. Provide clear reproduction steps

## Issue Template

```markdown
## Description

Describe the issue clearly.

## Steps to Reproduce

1. Go to '...'
2. Perform '...'
3. Observe '...'

## Expected Behavior

Describe what should happen.

## Actual Behavior

Describe what actually happens.

## Environment

- OS:
- Node.js version:
- Browser:
- Frontend version/commit:
- Backend version/commit:

## Screenshots

Add screenshots where applicable.

## Additional Context

Provide any additional relevant information.
```

---

# Security Issues

Do **not** publish sensitive security vulnerabilities in public issue trackers or discussions.

Security-related issues should be reported privately through the company's approved security or project-management channel.

Include enough information for the responsible team to reproduce and investigate the issue without exposing sensitive credentials, personal information, or production secrets.

---

# Feature Requests

Before requesting a feature:

1. Check whether the functionality already exists
2. Review project documentation
3. Search existing tasks/issues
4. Explain the problem the feature would solve
5. Describe the proposed behavior

## Feature Request Template

```markdown
## Feature Description

Describe the proposed feature.

## Problem Statement

What problem does this feature solve?

## Proposed Solution

Describe how the feature could work.

## Alternatives Considered

Describe alternatives that were considered.

## Additional Context

Add relevant screenshots, examples, or technical information.
```

---

# Questions and Discussions

Before asking a development question:

1. Check the README
2. Check the relevant documentation
3. Search existing issues/discussions
4. Review related code

When asking a question, provide:

* What you are trying to accomplish
* What you expected
* What happened
* Relevant error messages
* Relevant code or files
* Steps already attempted

Avoid sharing credentials, secrets, private customer information, or production data in discussions.

---

# Recognition

Authorized contributors may be recognized through appropriate internal or project documentation, such as:

* Contributor records
* Release notes
* Project documentation
* Internal team recognition

Recognition is subject to company policies and project practices.

---

# Proprietary Software and Contributions

Trendorabay is proprietary company software.

By contributing, you acknowledge that:

* The repository is private
* Source code and related materials are company property where applicable
* Repository access does not grant ownership rights
* Contributions do not automatically grant rights to reuse company source code
* Proprietary code must not be published without authorization
* Company confidential information must be protected
* Contributions are subject to applicable employment, contractor, confidentiality, intellectual property, and company agreements
* You must follow company security and access-control policies

Where applicable, ownership and permitted use of work created for the company are governed by the contributor's employment or contractor agreement and applicable company policies.

The project should use an appropriate proprietary license/notice reviewed and approved by the company.

---

# Development Checklist

Before considering a task complete:

```text
[ ] Requirements understood
[ ] Existing code reviewed
[ ] Correct branch created
[ ] Implementation completed
[ ] Security considerations reviewed
[ ] Tests added/updated where appropriate
[ ] Tests passing
[ ] Linting passing where configured
[ ] Build passing where applicable
[ ] Documentation updated
[ ] No secrets committed
[ ] No unnecessary dependencies added
[ ] No unrelated changes included
[ ] Self-review completed
[ ] Pull Request created
```

---

# Questions and Support

For questions about:

* Architecture
* Backend
* Frontend
* Database
* Authentication
* Security
* Deployment
* Infrastructure
* Repository access
* Proprietary code
* Production systems

Contact the appropriate project lead or use the company's approved internal communication channels.

---

# Final Note

Thank you for contributing to Trendorabay.

**Build carefully. Review thoroughly. Test your work. Protect the platform.**
