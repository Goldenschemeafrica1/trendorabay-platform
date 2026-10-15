# Trendorabay API Sitemap

## API Base URL
- **Production**: `https://api.trendorabay.com`
- **Development**: `http://localhost:5000`
- **API Version**: v1 (default)

## API Endpoints

### Authentication & Users (`/api/v1/users`)

#### Authentication
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `POST /api/v1/users/forgot-password` - Request password reset
- `POST /api/v1/users/reset-password` - Reset password with token

#### Profile Management
- `GET /api/v1/users/profile` - Get user profile (authenticated)
- `PUT /api/v1/users/profile` - Update user profile (authenticated)
- `POST /api/v1/users/clear-invalid-profile-images` - Clear invalid profile images

### Stories (`/api/v1/stories`)

#### Homepage
- `GET /api/v1/stories/homepage` - Get homepage stories (featured sections)

#### List & Search
- `GET /api/v1/stories` - Get all stories with filters (category, author, search, page, limit, featured, status)
- `GET /api/v1/stories/search` - Search stories
- `GET /api/v1/stories/latest` - Get latest stories
- `GET /api/v1/stories/featured` - Get featured story
- `GET /api/v1/stories/recent` - Get recent stories
- `GET /api/v1/stories/popular` - Get popular stories

#### Single Story
- `GET /api/v1/stories/:slug` - Get single story by slug or ID

#### CRUD Operations
- `POST /api/v1/stories` - Create new story
- `PUT /api/v1/stories/:id` - Update story
- `DELETE /api/v1/stories/:id` - Delete story
- `PATCH /api/v1/stories/:id/featured` - Toggle featured status

#### Interactions
- `POST /api/v1/stories/:id/like` - Like/unlike story (authenticated)
- `GET /api/v1/stories/:id/likes` - Get likes count
- `POST /api/v1/stories/:id/comments` - Add comment (authenticated)
- `GET /api/v1/stories/:id/comments` - Get comments
- `POST /api/v1/stories/:id/share` - Share story
- `POST /api/v1/stories/:id/view` - Track story view

### Magazines (`/api/v1/magazines`)

#### List & Search
- `GET /api/v1/magazines` - Get all magazines (with category, limit filters)
- `GET /api/v1/magazines/search` - Search magazines
- `GET /api/v1/magazines/category/:category` - Get magazines by category
- `GET /api/v1/magazines/featured` - Get featured magazines
- `GET /api/v1/magazines/categories` - Get magazine categories
- `GET /api/v1/magazines/subscriptions` - Get subscription options

#### Single Magazine
- `GET /api/v1/magazines/:slug` - Get magazine by slug or ID

#### CRUD Operations
- `POST /api/v1/magazines` - Create magazine
- `PUT /api/v1/magazines/:id` - Update magazine
- `DELETE /api/v1/magazines/:id` - Delete magazine

#### Subscriptions
- `POST /api/v1/magazines/subscriptions` - Create subscription

### Podcasts (`/api/v1/podcasts`)

#### List & Search
- `GET /api/v1/podcasts` - Get all podcasts (with status, trending, series, limit filters)
- `GET /api/v1/podcasts/series/list` - Get all podcast series
- `GET /api/v1/podcasts/trending/list` - Get trending podcasts
- `GET /api/v1/podcasts/published/list` - Get published podcasts

#### Single Podcast
- `GET /api/v1/podcasts/:id` - Get podcast by ID
- `GET /api/v1/podcasts/:id/audio` - Serve podcast audio
- `POST /api/v1/podcasts/:id/upload-audio` - Upload audio to database

#### CRUD Operations
- `POST /api/v1/podcasts` - Create podcast
- `PUT /api/v1/podcasts/:id` - Update podcast
- `DELETE /api/v1/podcasts/:id` - Delete podcast
- `PATCH /api/v1/podcasts/:id/trending` - Toggle trending status
- `PATCH /api/v1/podcasts/:id/plays` - Update play count

### Merchandise/Products (`/api/v1/merchandise` or `/api/v1/products`)

#### List & Search
- `GET /api/v1/merchandise` - Get all products (with category, price, search, page, limit filters)
- `GET /api/v1/merchandise/search` - Search products
- `GET /api/v1/merchandise/category/:category` - Get products by category
- `GET /api/v1/merchandise/featured` - Get featured products
- `GET /api/v1/merchandise/categories` - Get product categories

#### Single Product
- `GET /api/v1/merchandise/:id` - Get product by ID
- `GET /api/v1/merchandise/:id/options` - Get product options (sizes, colors)
- `GET /api/v1/merchandise/:id/availability` - Check product availability
- `GET /api/v1/merchandise/:id/related` - Get related products

#### CRUD Operations
- `POST /api/v1/merchandise` - Create product
- `PUT /api/v1/merchandise/:id` - Update product
- `DELETE /api/v1/merchandise/:id` - Delete product

### Orders (`/api/v1/orders`)

#### Order Management
- `GET /api/v1/orders` - Get all orders
- `GET /api/v1/orders/:id` - Get order by ID
- `GET /api/v1/orders/:id/status` - Get order status
- `GET /api/v1/orders/:id/confirmation` - Get order confirmation
- `GET /api/v1/orders/user/:userId` - Get orders by user (authenticated)
- `POST /api/v1/orders` - Create order
- `PATCH /api/v1/orders/:id/status` - Update order status
- `DELETE /api/v1/orders/:id` - Delete order

#### Order Utilities
- `POST /api/v1/orders/shipping-calculate` - Calculate shipping cost
- `POST /api/v1/orders/discount` - Apply discount code
- `POST /api/v1/orders/validate` - Validate checkout data
- `POST /api/v1/orders/:id/resend-confirmation` - Resend order confirmation
- `GET /api/v1/orders/track/:trackingNumber` - Track order

### Payments (`/api/v1/payments`)

#### Payment Processing
- `POST /api/v1/payments/process` - Process payment
- `POST /api/v1/payments/create-intent` - Create payment intent
- `POST /api/v1/payments/confirm` - Confirm payment
- `GET /api/v1/payments/methods` - Get payment methods
- `POST /api/v1/payments/validate` - Validate payment data
- `POST /api/v1/payments/refund` - Refund payment
- `GET /api/v1/payments/:paymentId/status` - Get payment status
- `POST /api/v1/payments/calculate-tax` - Calculate tax
- `POST /api/v1/payments/guest-customer` - Create guest customer

### Contributors (`/api/v1/contributors`)

#### List & Search
- `GET /api/v1/contributors` - Get all contributors (with status filter)
- `GET /api/v1/contributors/:id` - Get contributor by ID
- `GET /api/v1/contributors/role/:role` - Get contributors by role
- `GET /api/v1/contributors/active` - Get active contributors
- `GET /api/v1/contributors/search` - Search contributors

#### CRUD Operations
- `POST /api/v1/contributors` - Create contributor
- `PUT /api/v1/contributors/:id` - Update contributor
- `DELETE /api/v1/contributors/:id` - Delete contributor

#### Contributor Interactions
- `POST /api/v1/contributors/:id/follow` - Follow contributor
- `DELETE /api/v1/contributors/:id/follow` - Unfollow contributor
- `GET /api/v1/contributors/:id/follow/:userId` - Check follow status
- `GET /api/v1/contributors/:id/articles` - Get articles by contributor

### Podcast Hosts (`/api/v1/podcast-hosts`)

#### List & Search
- `GET /api/v1/podcast-hosts` - Get all hosts (with status filter)
- `GET /api/v1/podcast-hosts/:id` - Get host by ID
- `GET /api/v1/podcast-hosts/:id/podcasts` - Get host's podcasts
- `GET /api/v1/podcast-hosts/featured/list` - Get featured guests

#### CRUD Operations
- `POST /api/v1/podcast-hosts` - Create host
- `PUT /api/v1/podcast-hosts/:id` - Update host
- `DELETE /api/v1/podcast-hosts/:id` - Delete host

### Podcast Guest Applications (`/api/v1/podcast-guest-applications`)
- `GET /api/v1/podcast-guest-applications` - Get all applications
- `GET /api/v1/podcast-guest-applications/:id` - Get application by ID
- `POST /api/v1/podcast-guest-applications` - Create application
- `PUT /api/v1/podcast-guest-applications/:id` - Update application
- `DELETE /api/v1/podcast-guest-applications/:id` - Delete application

### Advertisements (`/api/v1/advertisements`)
- `GET /api/v1/advertisements` - Get all advertisements
- `GET /api/v1/advertisements/:id` - Get advertisement by ID
- `POST /api/v1/advertisements` - Create advertisement
- `PUT /api/v1/advertisements/:id` - Update advertisement
- `DELETE /api/v1/advertisements/:id` - Delete advertisement

### Inquiries (`/api/v1/inquiries`)
- `GET /api/v1/inquiries` - Get all inquiries
- `GET /api/v1/inquiries/:id` - Get inquiry by ID
- `POST /api/v1/inquiries` - Create inquiry
- `PUT /api/v1/inquiries/:id` - Update inquiry
- `DELETE /api/v1/inquiries/:id` - Delete inquiry

### Pitches (`/api/v1/pitches`)
- `GET /api/v1/pitches` - Get all pitches
- `GET /api/v1/pitches/:id` - Get pitch by ID
- `POST /api/v1/pitches` - Create pitch
- `PUT /api/v1/pitches/:id` - Update pitch
- `DELETE /api/v1/pitches/:id` - Delete pitch

### Partners (`/api/v1/partners`)
- `GET /api/v1/partners` - Get all partners
- `GET /api/v1/partners/:id` - Get partner by ID
- `POST /api/v1/partners` - Create partner
- `PUT /api/v1/partners/:id` - Update partner
- `DELETE /api/v1/partners/:id` - Delete partner

### Events (`/api/v1/events`)

#### List & Search
- `GET /api/v1/events` - Get all events (with status, featured, page, limit filters)

#### Single Event
- `GET /api/v1/events/:id` - Get event by ID

#### CRUD Operations
- `POST /api/v1/events` - Create event
- `PUT /api/v1/events/:id` - Update event
- `DELETE /api/v1/events/:id` - Delete event

### Contact (`/api/v1/contact`)

#### Contact Messages
- `GET /api/v1/contact` - Get all contact messages (with status, page, limit filters)
- `GET /api/v1/contact/:id` - Get message by ID
- `POST /api/v1/contact` - Create contact message
- `PATCH /api/v1/contact/:id/status` - Update message status
- `DELETE /api/v1/contact/:id` - Delete message

### Authors (`/api/v1/authors`)

#### Author Profile
- `GET /api/v1/authors/:id` - Get author by ID or name (with stories and stats)

#### Author Interactions
- `POST /api/v1/authors/:id/follow` - Follow author
- `DELETE /api/v1/authors/:id/follow` - Unfollow author
- `GET /api/v1/authors/:id/follow/:userId` - Check follow status

### Team (`/api/v1/team`)

#### Team Members
- `GET /api/v1/team` - Get all team members (with status filter)
- `GET /api/v1/team/:id` - Get team member by ID
- `GET /api/v1/team/active` - Get active team members
- `GET /api/v1/team/role/:role` - Get team members by role

#### CRUD Operations
- `POST /api/v1/team` - Create team member
- `PUT /api/v1/team/:id` - Update team member
- `DELETE /api/v1/team/:id` - Delete team member

### Gallery (`/api/v1/gallery`)

#### Gallery Items
- `GET /api/v1/gallery` - Get all gallery images (with category, featured, page, limit filters)
- `GET /api/v1/gallery/:id` - Get gallery item by ID

#### CRUD Operations (Admin)
- `POST /api/v1/gallery` - Create gallery item (authenticated)
- `PUT /api/v1/gallery/:id` - Update gallery item (authenticated)
- `DELETE /api/v1/gallery/:id` - Delete gallery item (authenticated)

#### Gallery Interactions
- `POST /api/v1/gallery/:id/like` - Like/unlike gallery item (authenticated)
- `GET /api/v1/gallery/:id/likes` - Get likes count
- `POST /api/v1/gallery/create-likes-table` - Create gallery likes table

### Analytics (`/api/v1/analytics`)

#### Analytics Data (Authenticated)
- `GET /api/v1/analytics/summary` - Get analytics summary (page views, visitors, time on page)
- `GET /api/v1/analytics/traffic-sources` - Get traffic sources breakdown
- `GET /api/v1/analytics/devices` - Get device types distribution
- `GET /api/v1/analytics/countries` - Get geographic distribution
- `GET /api/v1/analytics/dashboard` - Get combined dashboard data

### Opportunities (`/api/v1/opportunities`)

#### Categories & Types
- `GET /api/v1/opportunities/work-types` - Get all work types
- `GET /api/v1/opportunities/categories` - Get opportunity categories

#### List & Search
- `GET /api/v1/opportunities` - Get all opportunities (with status, featured, category, country, type, page, limit filters)

#### Single Opportunity
- `GET /api/v1/opportunities/:identifier` - Get opportunity by ID or slug

#### CRUD Operations
- `POST /api/v1/opportunities` - Create opportunity
- `PUT /api/v1/opportunities/:id` - Update opportunity
- `DELETE /api/v1/opportunities/:id` - Delete opportunity

#### Tracking
- `POST /api/v1/opportunities/:id/click` - Track click/conversion
- `POST /api/v1/opportunities/:id/apply` - Track application

### Communities (`/api/v1/communities`)

#### List & Search
- `GET /api/v1/communities` - Get all communities (with category, type, status, page, limit filters)
- `GET /api/v1/communities/:slug` - Get community by slug
- `GET /api/v1/communities/id/:id` - Get community by ID
- `GET /api/v1/communities/user/:userId` - Get user's communities

#### CRUD Operations (Admin)
- `POST /api/v1/communities` - Create community
- `PUT /api/v1/communities/:id` - Update community
- `DELETE /api/v1/communities/:id` - Delete community

#### Community Membership
- `POST /api/v1/communities/:communityId/join` - Join community
- `POST /api/v1/communities/:communityId/leave` - Leave community
- `GET /api/v1/communities/:communityId/members` - Get community members
- `GET /api/v1/communities/:communityId/membership/:userId` - Check membership status

#### Image Upload
- `POST /api/v1/communities/upload-image` - Upload community image to Cloudinary

### Community Posts (`/api/v1/community-posts`)

#### Posts
- `GET /api/v1/community-posts/community/:communityId` - Get posts for a community
- `GET /api/v1/community-posts/:id` - Get single post with comments
- `POST /api/v1/community-posts` - Create new post
- `DELETE /api/v1/community-posts/:id` - Delete post

#### Post Interactions
- `POST /api/v1/community-posts/:id/like` - Like/unlike post
- `POST /api/v1/community-posts/:id/comments` - Add comment to post

### Community Discussions (`/api/v1/community-discussions`)

#### Discussions
- `GET /api/v1/community-discussions/community/:communityId` - Get discussions for a community
- `GET /api/v1/community-discussions/:id` - Get single discussion with replies
- `POST /api/v1/community-discussions` - Create new discussion

#### Discussion Replies
- `POST /api/v1/community-discussions/:id/replies` - Add reply to discussion

### Write Applications (`/api/v1/write-applications`)

#### Applications
- `GET /api/v1/write-applications` - Get all applications (with status filter)
- `GET /api/v1/write-applications/:id` - Get application by ID
- `POST /api/v1/write-applications` - Create writer application
- `PATCH /api/v1/write-applications/:id/status` - Update application status
- `DELETE /api/v1/write-applications/:id` - Delete application

## Legacy API Routes (Backward Compatibility)

The following legacy routes are also supported without version prefix:
- `/api/users`
- `/api/magazines`
- `/api/stories`
- `/api/podcasts`
- `/api/podcast-hosts`
- `/api/podcast-guest-applications`
- `/api/merchandise`
- `/api/products`
- `/api/orders`
- `/api/payments`
- `/api/contributors`
- `/api/advertisements`
- `/api/inquiries`
- `/api/pitches`
- `/api/partners`
- `/api/events`
- `/api/contact`
- `/api/authors`
- `/api/team`
- `/api/gallery`
- `/api/analytics`
- `/api/opportunities`
- `/api/communities`
- `/api/community-posts`
- `/api/community-discussions`
- `/api/write-applications`

## Authentication

Most endpoints require authentication via JWT token. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

Or as a cookie:
```
Cookie: token=<token>
```

## Rate Limiting

Authentication endpoints use Redis-based rate limiting to prevent abuse.

## Caching

Many GET endpoints use caching middleware to improve performance. Cache durations vary by endpoint (60-600 seconds).

## Error Responses

All endpoints return JSON responses with the following structure:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Pagination

List endpoints support pagination with the following query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: varies by endpoint)

## Filtering

Many list endpoints support filtering via query parameters. See individual endpoint documentation for available filters.
