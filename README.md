# Trendorabay Platform

A comprehensive digital media platform featuring magazines, stories, podcasts, and e-commerce functionality focused on African content and culture.

## 🚀 Features

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

### User Features
- **Authentication**: Secure login/signup system with JWT
- **User Profiles**: Profile management and settings
- **Order History**: Track user orders and status
- **Account Settings**: User preferences and configuration

## 🛠 Tech Stack

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

## 📦 Installation

### Prerequisites
- Node.js v16 or higher
- MySQL v8.0 or higher
- Redis (optional, for caching)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trendorabay
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   mysql -u root -p < config/schema.sql
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api
   - Health Check: http://localhost:3001/api/health

For detailed installation instructions, see [INSTALLATION.md](docs/INSTALLATION.md).

## 📚 Documentation

- [Installation Guide](docs/INSTALLATION.md) - Detailed setup instructions
- [API Reference](docs/API_REFERENCE.md) - Complete API documentation
- [Database Schema](docs/DATABASE_SCHEMA.md) - Database structure and relationships
- [Architecture](docs/ARCHITECTURE.md) - System architecture and design
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment instructions
- [Development Guide](docs/DEVELOPMENT_GUIDE.md) - Development workflow and guidelines
- [Contributing](docs/CONTRIBUTING.md) - Contribution guidelines
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Common issues and solutions

## 🏗 Project Structure

```
trendorabay/
├── backend/                 # Backend API
│   ├── config/             # Configuration files
│   ├── database/           # Database migrations and schema
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

## 🔧 Configuration

### Environment Variables

Backend (`.env`):
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=trendorabay
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_here
REDIS_URL=redis://localhost:6379
```

Frontend (`.env`):
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## 🚀 Deployment

### Backend Deployment
- Production server with Node.js
- MySQL database
- Redis for caching
- Environment variables configured

### Frontend Deployment
- Vercel (configured in `vercel.json`)
- Environment variables set in Vercel dashboard
- Automatic deployments on git push

For detailed deployment instructions, see [DEPLOYMENT.md](docs/DEPLOYMENT.md).

## 📊 Scalability

The platform includes several scalability features:
- **Redis Caching**: Distributed caching with automatic fallback
- **Connection Pooling**: 100 concurrent database connections
- **Rate Limiting**: Redis-based distributed rate limiting
- **Response Compression**: Gzip compression for all responses
- **Health Checks**: `/api/health` and `/api/ready` endpoints

**Capacity Estimates**:
- Concurrent Users: 1,000-5,000
- Daily Active Users: 10,000-50,000
- Cache Hit Rate: 60-80% estimated

## 🔒 Security

- **Helmet**: Security headers
- **CORS**: Configured cross-origin resource sharing
- **Rate Limiting**: Multiple limiters (general, auth, upload)
- **Input Sanitization**: Request validation and sanitization
- **File Type Validation**: Restricted file upload types
- **Path Traversal Protection**: Suspicious path detection
- **JWT Authentication**: Token-based authentication
- **XSS Protection**: DOMPurify for content sanitization

## 🧪 Testing

### Frontend Testing
- **Framework**: Vitest
- **Testing Library**: @testing-library/react
- **Coverage**: Available with `npm run test:coverage`

```bash
cd frontend
npm test              # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:coverage # Run tests with coverage
```

### Backend Testing
Currently, backend tests are not configured. This is an area for future enhancement.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines on how to contribute to this project.

## 📄 License

[Your License Here]

## 👥 Team

- Development Team
- Design Team
- Content Team

## 📞 Support

For support, please contact:
- Email: support@trendorabay.com
- Website: https://trendorabay.com
- Documentation: [docs/](docs/)

## 🗺 Roadmap

### Planned Features
- [ ] Enhanced testing coverage
- [ ] API documentation with Swagger/OpenAPI
- [ ] Comprehensive monitoring and logging
- [ ] CDN implementation for static assets
- [ ] Background job processing with queues
- [ ] Enhanced authentication with social logins
- [ ] Real-time features with WebSockets
- [ ] Mobile application

## 🙏 Acknowledgments

- Open source community
- Contributors and supporters
- Technology providers

---

**Trendorabay** - Celebrating African Culture through Digital Media
