# API Reference

Complete API documentation for the Trendorabay Platform backend.

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

### Authentication Flow

1. **Login**: Obtain JWT token by providing credentials
2. **Include Token**: Add token to Authorization header for protected routes
3. **Token Refresh**: Tokens expire after 7 days (configurable via `JWT_EXPIRE`)

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

### HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate entry or conflict
- `500 Internal Server Error` - Server error

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General Rate Limit**: 100 requests per 15 minutes per IP
- **Authentication Rate Limit**: 5 requests per 15 minutes per IP
- **Upload Rate Limit**: 10 requests per 15 minutes per IP

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

## Caching

GET requests are cached for 5 minutes (300 seconds) by default. Cache headers:

```http
X-Cache: HIT
X-Cache-TTL: 300
```

## Endpoints

### Health Check

#### Check Server Health

```http
GET /api/health
```

**Authentication**: None

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

#### Check Readiness

```http
GET /api/ready
```

**Authentication**: None

**Response**:

```json
{
  "ready": true
}
```

---

### Magazines

#### Get All Magazines

```http
GET /api/magazines
```

**Authentication**: None

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | No | Filter by category |
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 12) |

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
      "preview_pages": "https://example.com/preview.pdf",
      "price": 9.99,
      "table_of_contents": [...],
      "contributors": [...],
      "published": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
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

#### Get Magazine by ID

```http
GET /api/magazines/:id
```

**Authentication**: None

**URL Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Magazine ID |

**Response**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Tech Trends 2024",
    "description": "Latest technology trends",
    "cover_image": "https://example.com/cover.jpg",
    "category": "Technology",
    "issue_number": "Vol 1",
    "pdf_url": "https://example.com/magazine.pdf",
    "preview_pages": "https://example.com/preview.pdf",
    "price": 9.99,
    "table_of_contents": [
      {
        "title": "AI Revolution",
        "page": 4
      }
    ],
    "contributors": [
      {
        "id": 1,
        "name": "John Doe",
        "role": "Editor",
        "avatar": "https://example.com/avatar.jpg"
      }
    ],
    "published": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get Magazines by Category

```http
GET /api/magazines/category/:category
```

**Authentication**: None

**URL Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | Yes | Category name |

**Available Categories**: Music, Fashion, Business, Technology, Travel, Lifestyle, Finance, Sports, Art, Food, Health, Automotive

#### Create Magazine

```http
POST /api/magazines
```

**Authentication**: Required (Admin)

**Content-Type**: `multipart/form-data`

**Request Body**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Magazine title |
| description | string | No | Magazine description |
| cover_image | file | No | Cover image file |
| category | string | Yes | Category |
| issue_number | string | No | Issue number |
| pdf_url | string | No | PDF file URL |
| preview_pages | string | No | Preview pages URL |
| price | number | No | Price |
| table_of_contents | string | No | Table of contents (JSON or text) |
| contributor_ids | string | No | Comma-separated contributor IDs |
| published | boolean | No | Published status |

**Response**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Tech Trends 2024",
    "message": "Magazine created successfully"
  }
}
```

#### Update Magazine

```http
PUT /api/magazines/:id
```

**Authentication**: Required (Admin)

**Content-Type**: `multipart/form-data`

**Request Body**: Same as create magazine

**Response**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "message": "Magazine updated successfully"
  }
}
```

#### Delete Magazine

```http
DELETE /api/magazines/:id
```

**Authentication**: Required (Admin)

**Response**:

```json
{
  "success": true,
  "message": "Magazine deleted successfully"
}
```

---

### Stories

#### Get All Stories

```http
GET /api/stories
```

**Authentication**: None

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | number | No | Filter by category ID |
| author | number | No | Filter by author ID |
| search | string | No | Search in title and content |
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 12) |
| featured | boolean | No | Filter featured stories |
| status | string | No | Filter by status (draft/published) |

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
      "author_id": 1,
      "author_name": "John Doe",
      "author_avatar": "https://example.com/avatar.jpg",
      "category_id": 4,
      "category_name": "Technology",
      "status": "published",
      "featured": true,
      "published_at": "2024-01-01T00:00:00.000Z",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 12,
    "totalPages": 9
  }
}
```

#### Get Story by ID

```http
GET /api/stories/:id
```

**Authentication**: None

**Response**: Single story object

#### Get Latest Stories

```http
GET /api/stories/latest
```

**Authentication**: None

**Query Parameters**: Same as get all stories

#### Get Stories by Author

```http
GET /api/stories/author/:authorId
```

**Authentication**: None

**URL Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| authorId | number | Yes | Author ID |

#### Create Story

```http
POST /api/stories
```

**Authentication**: Required (Admin/Author)

**Content-Type**: `multipart/form-data`

**Request Body**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Story title |
| content | string | Yes | Story content |
| featured_image_url | file | No | Featured image file |
| author_id | number | Yes | Author ID |
| category_id | number | No | Category ID |
| status | string | No | Status (draft/published) |
| featured | boolean | No | Featured flag |

#### Update Story

```http
PUT /api/stories/:id
```

**Authentication**: Required (Admin/Author)

**Request Body**: Same as create story

#### Delete Story

```http
DELETE /api/stories/:id
```

**Authentication**: Required (Admin/Author)

---

### Podcasts

#### Get All Podcasts

```http
GET /api/podcasts
```

**Authentication**: None

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | No | Filter by category |
| published | boolean | No | Filter by published status |

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Tech Talk Episode 1",
      "description": "Discussion about latest tech trends",
      "cover_image": "https://example.com/cover.jpg",
      "audio_url": "https://example.com/audio.mp3",
      "video_file_url": "https://example.com/video.mp4",
      "duration": 3600,
      "host": "John Doe",
      "category": "Technology",
      "published": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Podcast by ID

```http
GET /api/podcasts/:id
```

**Authentication**: None

#### Create Podcast

```http
POST /api/podcasts
```

**Authentication**: Required (Admin)

**Content-Type**: `multipart/form-data`

**Request Body**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Podcast title |
| description | string | No | Description |
| cover_image | file | No | Cover image file |
| audio_url | file | Yes | Audio file |
| video_file_url | file | No | Video file |
| duration | number | No | Duration in seconds |
| host | string | No | Host name |
| category | string | No | Category |
| published | boolean | No | Published status |

#### Update Podcast

```http
PUT /api/podcasts/:id
```

**Authentication**: Required (Admin)

#### Delete Podcast

```http
DELETE /api/podcasts/:id
```

**Authentication**: Required (Admin)

---

### Merchandise

#### Get All Merchandise

```http
GET /api/merchandise
```

**Authentication**: None

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | No | Filter by category |

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Trendorabay T-Shirt",
      "description": "Premium cotton t-shirt",
      "price": 29.99,
      "image_url": "https://example.com/product.jpg",
      "category": "Clothing",
      "stock_quantity": 50,
      "sizes": "S,M,L,XL",
      "available": true,
      "badge": "New",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Merchandise by ID

```http
GET /api/merchandise/:id
```

**Authentication**: None

#### Get Merchandise by Category

```http
GET /api/merchandise/category/:category
```

**Authentication**: None

#### Create Merchandise

```http
POST /api/merchandise
```

**Authentication**: Required (Admin)

**Content-Type**: `multipart/form-data`

**Request Body**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Product name |
| description | string | No | Description |
| price | number | Yes | Price |
| image_url | file | No | Product image |
| category | string | Yes | Category |
| stock_quantity | number | No | Stock quantity |
| sizes | string | No | Available sizes |
| available | boolean | No | Availability |
| badge | string | No | Product badge |

#### Update Merchandise

```http
PUT /api/merchandise/:id
```

**Authentication**: Required (Admin)

#### Delete Merchandise

```http
DELETE /api/merchandise/:id
```

**Authentication**: Required (Admin)

---

### Orders

#### Get All Orders

```http
GET /api/orders
```

**Authentication**: Required (Admin)

#### Get Order by ID

```http
GET /api/orders/:id
```

**Authentication**: Required (Admin/User)

#### Get User Orders

```http
GET /api/orders/user/:userId
```

**Authentication**: Required (User)

#### Create Order

```http
POST /api/orders
```

**Authentication**: Required (User)

**Request Body**:

```json
{
  "user_id": 1,
  "items": [
    {
      "merchandise_id": 1,
      "quantity": 2,
      "price": 29.99
    }
  ],
  "total_amount": 59.98,
  "shipping_address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "USA"
  }
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "items": [...],
    "total_amount": 59.98,
    "payment_status": "pending",
    "order_status": "pending",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update Order Status

```http
PATCH /api/orders/:id/status
```

**Authentication**: Required (Admin)

**Request Body**:

```json
{
  "order_status": "shipped"
}
```

**Order Status Values**: pending, processing, shipped, delivered, cancelled

#### Delete Order

```http
DELETE /api/orders/:id
```

**Authentication**: Required (Admin)

---

### Users

#### Register User

```http
POST /api/users/register
```

**Authentication**: None

**Request Body**:

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "token": "jwt_token_here"
  }
}
```

#### Login User

```http
POST /api/users/login
```

**Authentication**: None

**Request Body**:

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
}
```

#### Get User Profile

```http
GET /api/users/profile
```

**Authentication**: Required

#### Update User Profile

```http
PUT /api/users/profile
```

**Authentication**: Required

---

### Contributors

#### Get All Contributors

```http
GET /api/contributors
```

**Authentication**: None

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| featured | boolean | No | Filter featured contributors |
| status | string | No | Filter by status (active/inactive) |

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "bio": "Tech writer and journalist",
      "role": "Writer",
      "role_type": "content",
      "avatar": "https://example.com/avatar.jpg",
      "cover_image": "https://example.com/cover.jpg",
      "expertise": ["Technology", "Business"],
      "twitter": "@janesmith",
      "instagram": "@janesmith",
      "linkedin": "jane-smith",
      "followers": 1000,
      "featured": true,
      "achievements": ["Award Winner"],
      "status": "active",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Contributor by ID

```http
GET /api/contributors/:id
```

**Authentication**: None

#### Create Contributor

```http
POST /api/contributors
```

**Authentication**: Required (Admin)

#### Update Contributor

```http
PUT /api/contributors/:id
```

**Authentication**: Required (Admin)

#### Delete Contributor

```http
DELETE /api/contributors/:id
```

**Authentication**: Required (Admin)

---

### Events

#### Get All Events

```http
GET /api/events
```

**Authentication**: None

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Tech Conference 2024",
      "description": "Annual technology conference",
      "date": "2024-06-15",
      "time": "09:00:00",
      "location": "New York",
      "image_url": "https://example.com/event.jpg",
      "registration_url": "https://example.com/register",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Create Event

```http
POST /api/events
```

**Authentication**: Required (Admin)

#### Update Event

```http
PUT /api/events/:id
```

**Authentication**: Required (Admin)

#### Delete Event

```http
DELETE /api/events/:id
```

**Authentication**: Required (Admin)

---

### Authors

#### Get All Authors

```http
GET /api/authors
```

**Authentication**: None

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "bio": "Tech writer and journalist",
      "avatar_url": "https://example.com/avatar.jpg",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Author by ID

```http
GET /api/authors/:id
```

**Authentication**: None

#### Create Author

```http
POST /api/authors
```

**Authentication**: Required (Admin)

#### Update Author

```http
PUT /api/authors/:id
```

**Authentication**: Required (Admin)

#### Delete Author

```http
DELETE /api/authors/:id
```

**Authentication**: Required (Admin)

---

### Podcast Hosts

#### Get All Podcast Hosts

```http
GET /api/podcast-hosts
```

**Authentication**: None

#### Create Podcast Host

```http
POST /api/podcast-hosts
```

**Authentication**: Required (Admin)

#### Update Podcast Host

```http
PUT /api/podcast-hosts/:id
```

**Authentication**: Required (Admin)

#### Delete Podcast Host

```http
DELETE /api/podcast-hosts/:id
```

**Authentication**: Required (Admin)

---

### Podcast Guest Applications

#### Submit Guest Application

```http
POST /api/podcast-guest-applications
```

**Authentication**: None

**Request Body**:

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "topic": "AI in Business",
  "bio": "Expert in AI and business strategy",
  "social_media": "@janesmith"
}
```

#### Get Guest Applications

```http
GET /api/podcast-guest-applications
```

**Authentication**: Required (Admin)

---

### Advertisements

#### Get All Advertisements

```http
GET /api/advertisements
```

**Authentication**: None

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Featured Product",
      "image_url": "https://example.com/ad.jpg",
      "link_url": "/store",
      "position": "horizontal",
      "status": "active",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Create Advertisement

```http
POST /api/advertisements
```

**Authentication**: Required (Admin)

#### Update Advertisement

```http
PUT /api/advertisements/:id
```

**Authentication**: Required (Admin)

#### Delete Advertisement

```http
DELETE /api/advertisements/:id
```

**Authentication**: Required (Admin)

---

### Inquiries

#### Submit Advertisement Inquiry

```http
POST /api/inquiries
```

**Authentication**: None

**Request Body**:

```json
{
  "name": "Company Name",
  "email": "contact@company.com",
  "company": "Company Inc",
  "message": "We're interested in advertising"
}
```

#### Get Inquiries

```http
GET /api/inquiries
```

**Authentication**: Required (Admin)

---

### Partnerships

#### Submit Partnership Proposal

```http
POST /api/partners
```

**Authentication**: None

**Request Body**:

```json
{
  "name": "Company Name",
  "email": "contact@company.com",
  "company": "Company Inc",
  "proposal_type": "content",
  "message": "We'd like to partner for content"
}
```

#### Get Partnership Proposals

```http
GET /api/partners
```

**Authentication**: Required (Admin)

---

### Pitches

#### Submit Story Pitch

```http
POST /api/pitches
```

**Authentication**: None

**Request Body**:

```json
{
  "name": "Writer Name",
  "email": "writer@example.com",
  "title": "Story Title",
  "category": "Technology",
  "summary": "Brief summary of the story",
  "content": "Full story pitch content"
}
```

#### Get Pitches

```http
GET /api/pitches
```

**Authentication**: Required (Admin)

---

### Contact

#### Submit Contact Form

```http
POST /api/contact
```

**Authentication**: None

**Request Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "General Inquiry",
  "message": "Your message here"
}
```

#### Get Contact Messages

```http
GET /api/contact
```

**Authentication**: Required (Admin)

---

### Payments

#### Process Payment

```http
POST /api/payments
```

**Authentication**: Required (User)

**Request Body**:

```json
{
  "order_id": 1,
  "payment_method": "stripe",
  "payment_details": {
    "token": "stripe_token"
  }
}
```

#### Get Payment Status

```http
GET /api/payments/:id
```

**Authentication**: Required (User/Admin)

---

## Error Handling

### Common Error Responses

#### 400 Bad Request

```json
{
  "success": false,
  "error": "Validation Error",
  "details": "Invalid input data"
}
```

#### 401 Unauthorized

```json
{
  "success": false,
  "error": "Unauthorized",
  "details": "No authentication token, access denied"
}
```

#### 404 Not Found

```json
{
  "success": false,
  "error": "Not Found",
  "details": "Resource not found"
}
```

#### 409 Conflict

```json
{
  "success": false,
  "error": "Duplicate Entry",
  "details": "A record with this information already exists"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Internal Server Error",
  "details": "An unexpected error occurred"
}
```

## File Upload

### Supported File Types

- **Images**: JPEG, JPG, PNG, GIF, WebP
- **Audio**: MP3, MPEG
- **Video**: MP4
- **Documents**: PDF

### File Size Limit

Maximum file size: 50MB

### Upload Endpoint

Most POST/PUT endpoints accept file uploads via `multipart/form-data`.

Example using cURL:

```bash
curl -X POST http://localhost:3001/api/magazines \
  -H "Authorization: Bearer <token>" \
  -F "title=New Magazine" \
  -F "category=Technology" \
  -F "cover_image=@/path/to/image.jpg" \
  -F "pdf_url=@/path/to/magazine.pdf"
```

## Pagination

List endpoints support pagination with the following parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12)

Pagination response format:

```json
{
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 12,
    "totalPages": 9
  }
}
```

## Search

Search functionality is available on stories endpoint:

```http
GET /api/stories?search=keyword
```

Searches in:
- Story title
- Story content

## Filtering

Most list endpoints support filtering:

- **By category**: `?category=value`
- **By author**: `?author=id`
- **By status**: `?status=value`
- **Featured**: `?featured=true`

## Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:3001/api/health

# Get all magazines
curl http://localhost:3001/api/magazines

# Login
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get protected resource
curl http://localhost:3001/api/orders \
  -H "Authorization: Bearer <token>"
```

### Using Postman/Thunder Client

1. Import the API collection (if available)
2. Set base URL: `http://localhost:3001/api`
3. Configure authentication for protected endpoints
4. Test endpoints as needed

## Versioning

Current API version: v1 (implicit)

Future versions will use URL versioning: `/api/v2/...`

## Changelog

### v1.0.0 (Current)
- Initial API release
- All core endpoints implemented
- Authentication and authorization
- File upload support
- Rate limiting and caching
