# Trendorabay Backend API

Backend API for the Trendorabay platform built with Node.js, Express, and MySQL.

## Features

- RESTful API architecture
- MySQL database integration with connection pooling
- CORS middleware for frontend integration
- Error handling middleware
- Support for magazines, stories, podcasts, merchandise, and orders

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT (ready for implementation)
- **Validation**: Joi

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. **Navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your database credentials:
   ```env
   PORT=3001
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=trendorabay
   FRONTEND_URL=http://localhost:5173
   ```

4. **Set up the MySQL database**
   
   Create the database and tables using the provided schema:
   ```bash
   mysql -u root -p < config/schema.sql
   ```
   
   Or manually:
   ```sql
   CREATE DATABASE trendorabay;
   USE trendorabay;
   -- Then run the SQL statements from config/schema.sql
   ```

## Running the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /api/health` - Check server status

### Magazines
- `GET /api/magazines` - Get all magazines
- `GET /api/magazines/:id` - Get magazine by ID
- `GET /api/magazines/category/:category` - Get magazines by category
- `POST /api/magazines` - Create new magazine
- `PUT /api/magazines/:id` - Update magazine
- `DELETE /api/magazines/:id` - Delete magazine

### Stories
- `GET /api/stories` - Get all stories
- `GET /api/stories/:id` - Get story by ID
- `GET /api/stories/latest` - Get latest stories
- `GET /api/stories/author/:authorId` - Get stories by author
- `POST /api/stories` - Create new story
- `PUT /api/stories/:id` - Update story
- `DELETE /api/stories/:id` - Delete story

### Podcasts
- `GET /api/podcasts` - Get all podcasts
- `GET /api/podcasts/:id` - Get podcast by ID
- `POST /api/podcasts` - Create new podcast
- `PUT /api/podcasts/:id` - Update podcast
- `DELETE /api/podcasts/:id` - Delete podcast

### Merchandise
- `GET /api/merchandise` - Get all merchandise
- `GET /api/merchandise/:id` - Get merchandise by ID
- `GET /api/merchandise/category/:category` - Get merchandise by category
- `POST /api/merchandise` - Create new merchandise
- `PUT /api/merchandise/:id` - Update merchandise
- `DELETE /api/merchandise/:id` - Delete merchandise

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/user/:userId` - Get orders by user
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

## Project Structure

```
backend/
├── config/
│   ├── database.js       # MySQL connection configuration
│   └── schema.sql        # Database schema
├── middleware/
│   ├── cors.js           # CORS middleware
│   └── errorHandler.js   # Error handling middleware
├── models/               # Database models (for ORM if needed)
├── routes/
│   ├── magazines.js      # Magazine routes
│   ├── stories.js        # Story routes
│   ├── podcasts.js       # Podcast routes
│   ├── merchandise.js    # Merchandise routes
│   └── orders.js         # Order routes
├── server.js             # Main server file
├── package.json          # Dependencies and scripts
├── .env.example          # Environment variables template
└── README.md             # This file
```

## Database Schema

The backend uses the following main tables:
- `users` - User accounts
- `authors` - Story authors
- `stories` - Blog posts and articles
- `magazines` - Digital magazines
- `podcasts` - Audio content
- `merchandise` - Products for sale
- `orders` - Customer orders

See `config/schema.sql` for detailed table structures.

## Error Handling

The API uses consistent error responses:
```json
{
  "success": false,
  "error": "Error type",
  "details": "Detailed error message"
}
```

## Development Notes

- The API uses ES6 modules (`"type": "module"` in package.json)
- Database queries use MySQL2 with connection pooling
- All routes follow RESTful conventions
- CORS is configured to allow requests from the frontend

## Future Enhancements

- JWT authentication implementation
- Input validation with Joi
- File upload handling for images and media
- Pagination for list endpoints
- Search functionality
- Rate limiting
- Logging system
- API documentation (Swagger/OpenAPI)

## Troubleshooting

**Database connection failed:**
- Check MySQL is running
- Verify credentials in `.env` file
- Ensure database `trendorabay` exists

**Port already in use:**
- Change PORT in `.env` file
- Or kill the process using port 3001

**CORS errors:**
- Ensure FRONTEND_URL in `.env` matches your frontend URL
- Check that the frontend is running on the specified URL
