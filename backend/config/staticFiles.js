import path from 'path';
import fs from 'fs';
import express from 'express';
import multer from 'multer';
import { createMagicNumberFilter } from '../middleware/fileValidator.js';

export function setupStaticFiles(app) {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const backendUploadsPath = path.join(__dirname, '../uploads');

  // Ensure uploads directory exists
  if (!fs.existsSync(backendUploadsPath)) {
    fs.mkdirSync(backendUploadsPath, { recursive: true });
    const subdirs = ['profiles', 'stories', 'magazines', 'podcasts', 'merchandise'];
    subdirs.forEach(dir => {
      const dirPath = path.join(backendUploadsPath, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });
  }

  // Serve static files from backend uploads directory with CORS and security headers
  app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.header('Cache-Control', 'public, max-age=31536000, immutable');
    res.header('CDN-Cache-Control', 'public, max-age=31536000, immutable');
    res.header('Vary', 'Accept-Encoding');
    next();
  }, express.static(backendUploadsPath));

  // Serve frontend build for production
  const frontendDistPath = path.join(__dirname, '../../frontend/dist');
  const hasFrontendDist = fs.existsSync(frontendDistPath);

  if (hasFrontendDist) {
    // Serve sitemap.xml specifically
    app.get('/sitemap.xml', (req, res) => {
      const sitemapPath = path.join(frontendDistPath, 'sitemap.xml');
      if (fs.existsSync(sitemapPath)) {
        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.sendFile(sitemapPath);
      } else {
        res.status(404).send('Sitemap not found');
      }
    });

    // Serve robots.txt specifically
    app.get('/robots.txt', (req, res) => {
      const robotsPath = path.join(frontendDistPath, 'robots.txt');
      if (fs.existsSync(robotsPath)) {
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.sendFile(robotsPath);
      } else {
        res.status(404).send('Robots.txt not found');
      }
    });

    app.use(express.static(frontendDistPath, {
      index: false,
      immutable: true,
      maxAge: '1y',
      setHeaders: (res, filePath) => {
        if (path.basename(filePath) === 'index.html') {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
        res.setHeader('CDN-Cache-Control', res.getHeader('Cache-Control'));
        res.setHeader('Vary', 'Accept-Encoding');
      }
    }));

    // SPA fallback: only for non-API, non-upload, non-sitemap routes
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/') || req.path === '/sitemap.xml' || req.path === '/robots.txt') {
        return next();
      }
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    });
  }
}

export function configureMulter() {
  return multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: createMagicNumberFilter(['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'audio/mpeg', 'audio/mp3', 'video/mp4', 'application/pdf'])
  });
}
