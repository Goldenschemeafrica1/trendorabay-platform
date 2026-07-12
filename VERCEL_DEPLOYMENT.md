# Vercel Deployment Guide

## Current Architecture
- **Frontend**: React + Vite (to be deployed on Vercel)
- **Backend**: Express.js + MySQL (currently on Render, will remain there)
- **CMS**: Content Management System (on Render)

## Deployment Strategy
Deploy frontend to Vercel while keeping backend and CMS on Render. This hybrid approach provides:
- Fast global CDN for static assets
- Optimized React deployment
- Backend remains on existing infrastructure

## Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

## Step 2: Login to Vercel
```bash
vercel login
```

## Step 3: Deploy Frontend
From the frontend directory:
```bash
cd /Users/macbook/Downloads/web\ 1/trendorabay/frontend
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to existing project?** No
- **Project name**: trendorabay-frontend
- **In which directory is your code located?** ./
- **Want to modify settings?** No

## Step 4: Configure Environment Variables in Vercel Dashboard
1. Go to Vercel Dashboard → your project → Settings → Environment Variables
2. Add the following variables:
   ```
   VITE_API_BASE_URL=https://trendorabay-platform.onrender.com/api
   VITE_CMS_URL=https://trendorabay-content-management-system.onrender.com
   ```

## Step 5: Production Deployment
```bash
vercel --prod
```

## Step 6: Update Domain (Optional)
1. Go to Vercel Dashboard → your project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel

## Important Notes
- Backend API calls will go to Render backend
- File uploads will still go to Render backend
- Redis caching remains on Render backend
- Database remains on current hosting

## Troubleshooting
- **CORS Issues**: Ensure backend CORS is configured for Vercel domain
- **API Calls**: Check that VITE_API_BASE_URL is correct in production
- **Build Errors**: Check Vercel deployment logs for specific errors

## Next Steps (Optional)
For full Vercel migration, you would need to:
1. Convert Express.js routes to Vercel Functions
2. Migrate database to Vercel Postgres or PlanetScale
3. Use Vercel KV for Redis replacement
4. Handle file uploads with Vercel Blob storage
