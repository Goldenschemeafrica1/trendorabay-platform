import express from 'express';
import pool from '../config/database.js';
import { cache } from '../middleware/cacheMiddleware.js';
import { cacheDelPattern } from '../config/redis.js';

const router = express.Router();

// Get all podcasts
router.get('/', cache(300), async (req, res, next) => {
  try {
    const { status, trending, series } = req.query;
    let query = 'SELECT * FROM podcasts WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (trending === 'true' || trending === '1') {
      query += ' AND trending = 1';
    }

    if (series) {
      query += ' AND series = ?';
      params.push(series);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);

    // Log actual image URLs from database for debugging
    console.log('Sample podcast image URLs from database:', rows.slice(0, 3).map(r => ({ id: r.id, cover_art_url: r.cover_art_url, series: r.series, title: r.title })));

    // Map podcast titles/guests to actual image files in frontend public folder
    const podcastImageMap = {
      'kandanda': '/music.jpeg',
      'Tech Talk': '/blockchain.jpeg',
      'Design Matters': '/fashionandbusiness.jpeg',
      'Business Insights': '/financeandinvestment.jpeg'
    };

    // Helper function to get image URL (handle Cloudinary and CMS uploads)
    const getImageUrl = (url, title, guest) => {
      const cmsUrl = process.env.CMS_URL || 'https://trendorabay-content-management-system.onrender.com';
      
      if (!url || url === 'undefined' || url === '/uploads/stories/undefined') {
        // Check title first
        for (const [key, value] of Object.entries(podcastImageMap)) {
          if (title && title.toLowerCase().includes(key.toLowerCase())) {
            return value;
          }
        }
        // Check guest
        for (const [key, value] of Object.entries(podcastImageMap)) {
          if (guest && guest.toLowerCase().includes(key.toLowerCase())) {
            return value;
          }
        }
        return '/music.jpeg';
      }
      
      // Return full URLs as-is (Cloudinary, external images)
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      
      // If it's a relative path starting with /uploads, serve from CMS
      if (url.startsWith('/uploads/')) {
        return `${cmsUrl}${url}`;
      }
      // If it starts with /, it's in the frontend public folder - return as-is
      if (url.startsWith('/')) {
        return url;
      }
      // If it's just a filename, it's in the frontend public folder
      if (!url.includes('/')) {
        return `/${url}`;
      }
      // If it has a path, return as-is
      return url;
    };

    // Helper function to get audio URL with fallback
    const getAudioUrl = (url, id) => {
      // Return the exact audio_file_url from database
      if (url) {
        // If it's a relative path starting with /uploads, serve from backend
        if (url.startsWith('/uploads/')) {
          return `http://localhost:3001${url}`;
        }
        return url;
      }
      return null;
    };

    // Helper function to get video URL with fallback
    const getVideoUrl = (url, id) => {
      if (!url) return null;
      if (url.includes('/uploads/')) {
        return `http://localhost:3001${url}`;
      }
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      if (!url.includes('/') && !url.startsWith('/')) {
        return `/${url}`;
      }
      return url.startsWith('/') ? url : `/${url}`;
    };

    // Category ID to name mapping
    const categoryMap = {
      32: 'Technology',
      33: 'Business',
      34: 'Culture',
      35: 'Sports',
      36: 'Music',
      37: 'Education'
    };

    // Transform field names to match frontend expectations
    const transformed = rows.map(podcast => ({
      ...podcast,
      coverImage: getImageUrl(podcast.cover_art_url, podcast.title, podcast.guest),
      audioUrl: getAudioUrl(podcast.audio_file_url, podcast.id),
      videoUrl: getVideoUrl(podcast.video_file_url, podcast.id),
      category: categoryMap[podcast.category_id] || 'General',
      date: podcast.published_at || podcast.created_at
    }));

    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Get podcast by ID
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM podcasts WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Podcast not found' });
    }

    // Map podcast titles/guests to actual image files in frontend public folder
    const podcastImageMap = {
      'kandanda': '/music.jpeg',
      'Tech Talk': '/blockchain.jpeg',
      'Design Matters': '/fashionandbusiness.jpeg',
      'Business Insights': '/financeandinvestment.jpeg'
    };

    // Helper function to get image URL (handle Cloudinary and CMS uploads)
    const getImageUrl = (url, title, guest) => {
      const cmsUrl = process.env.CMS_URL || 'https://trendorabay-content-management-system.onrender.com';
      
      if (!url || url === 'undefined' || url === '/uploads/stories/undefined') {
        // Check title first
        for (const [key, value] of Object.entries(podcastImageMap)) {
          if (title && title.toLowerCase().includes(key.toLowerCase())) {
            return value;
          }
        }
        // Check guest
        for (const [key, value] of Object.entries(podcastImageMap)) {
          if (guest && guest.toLowerCase().includes(key.toLowerCase())) {
            return value;
          }
        }
        return '/music.jpeg';
      }
      
      // Return full URLs as-is (Cloudinary, external images)
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      
      // If it's a relative path starting with /uploads, serve from CMS
      if (url.startsWith('/uploads/')) {
        return `${cmsUrl}${url}`;
      }
      // If it starts with /, it's in the frontend public folder - return as-is
      if (url.startsWith('/')) {
        return url;
      }
      // If it's just a filename, it's in the frontend public folder
      if (!url.includes('/')) {
        return `/${url}`;
      }
      // If it has a path, return as-is
      return url;
    };

    // Helper function to get audio URL with fallback
    const getAudioUrl = (url, id) => {
      // Return the exact audio_file_url from database
      if (url) {
        // If it's a relative path starting with /uploads, serve from backend
        if (url.startsWith('/uploads/')) {
          return `http://localhost:3001${url}`;
        }
        return url;
      }
      return null;
    };

    // Helper function to get video URL with fallback
    const getVideoUrl = (url, id) => {
      if (!url) return null;
      if (url.includes('/uploads/')) {
        return `http://localhost:3001${url}`;
      }
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      if (!url.includes('/') && !url.startsWith('/')) {
        return `/${url}`;
      }
      return url.startsWith('/') ? url : `/${url}`;
    };

    // Category ID to name mapping
    const categoryMap = {
      32: 'Technology',
      33: 'Business',
      34: 'Culture',
      35: 'Sports',
      36: 'Music',
      37: 'Education'
    };

    // Transform field names to match frontend expectations
    const transformed = {
      ...rows[0],
      coverImage: getImageUrl(rows[0].cover_art_url, rows[0].title, rows[0].guest),
      audioUrl: getAudioUrl(rows[0].audio_file_url, rows[0].id),
      videoUrl: getVideoUrl(rows[0].video_file_url, rows[0].id),
      category: categoryMap[rows[0].category_id] || 'General',
      date: rows[0].published_at || rows[0].created_at
    };

    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Create podcast
router.post('/', async (req, res, next) => {
  try {
    const { title, episode_number, description, cover_art_url, audio_file_url, category_id, guest, series, duration, host, host_id, trending, plays, status, related_story_id, is_featured_guest } = req.body;
    const [result] = await pool.query(
      `INSERT INTO podcasts (title, episode_number, description, cover_art_url, audio_file_url, category_id, guest, series, duration, host, host_id, trending, plays, status, related_story_id, is_featured_guest) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, episode_number, description, cover_art_url, audio_file_url, category_id, guest, series, duration, host, host_id, trending ? 1 : 0, plays || 0, status || 'draft', related_story_id, is_featured_guest ? 1 : 0]
    );
    const [newPodcast] = await pool.query(
      'SELECT * FROM podcasts WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json({ success: true, data: newPodcast[0] });
  } catch (error) {
    next(error);
  }
});

// Update podcast
router.put('/:id', async (req, res, next) => {
  try {
    const { title, episode_number, description, cover_art_url, audio_file_url, video_file_url, category_id, guest, series, duration, host, host_id, trending, plays, status, related_story_id, is_featured_guest } = req.body;
    await pool.query(
      `UPDATE podcasts 
       SET title = ?, episode_number = ?, description = ?, cover_art_url = ?, audio_file_url = ?, video_file_url = ?, category_id = ?, guest = ?, series = ?, duration = ?, host = ?, host_id = ?, trending = ?, plays = ?, status = ?, related_story_id = ?, is_featured_guest = ?
       WHERE id = ?`,
      [title, episode_number, description, cover_art_url, audio_file_url, video_file_url, category_id, guest, series, duration, host, host_id, trending ? 1 : 0, plays, status, related_story_id, is_featured_guest ? 1 : 0, req.params.id]
    );
    const [updated] = await pool.query(
      'SELECT * FROM podcasts WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    next(error);
  }
});

// Delete podcast
router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM podcasts WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Podcast deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Toggle trending status
router.patch('/:id/trending', async (req, res, next) => {
  try {
    const { trending } = req.body;
    await pool.query(
      'UPDATE podcasts SET trending = ? WHERE id = ?',
      [trending ? 1 : 0, req.params.id]
    );
    const [updated] = await pool.query(
      'SELECT * FROM podcasts WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    next(error);
  }
});

// Update play count
router.patch('/:id/plays', async (req, res, next) => {
  try {
    await pool.query(
      'UPDATE podcasts SET plays = plays + 1 WHERE id = ?',
      [req.params.id]
    );
    const [updated] = await pool.query(
      'SELECT * FROM podcasts WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    next(error);
  }
});

// Get all series
router.get('/series/list', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT DISTINCT series FROM podcasts WHERE series IS NOT NULL ORDER BY series'
    );
    const series = rows.map(row => row.series);
    res.json({ success: true, data: series });
  } catch (error) {
    next(error);
  }
});

// Get trending podcasts
router.get('/trending/list', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const [rows] = await pool.query(
      'SELECT * FROM podcasts WHERE trending = 1 AND status = "published" ORDER BY plays DESC LIMIT ?',
      [limit]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Get published podcasts
router.get('/published/list', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const [rows] = await pool.query(
      'SELECT * FROM podcasts WHERE status = "published" ORDER BY published_at DESC LIMIT ?',
      [limit]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Serve audio from database
router.get('/:id/audio', async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT audio_data, audio_file_url FROM podcasts WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Podcast not found' });
    }
    
    const podcast = rows[0];
    
    // If audio data exists in database, serve it
    if (podcast.audio_data) {
      const audioData = podcast.audio_data;
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', audioData.length);
      return res.send(audioData);
    }
    
    // No audio data in database - return 404 instead of redirecting
    return res.status(404).json({ success: false, message: 'Audio not available in database. Please upload audio file.' });
  } catch (error) {
    next(error);
  }
});

// Upload audio to database
router.post('/:id/upload-audio', async (req, res, next) => {
  try {
    const { id } = req.params;
    const upload = req.app.get('upload');
    
    upload.single('audio')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: 'File upload error', error: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No audio file provided' });
      }
      
      const audioData = req.file.buffer;
      
      await pool.query(
        'UPDATE podcasts SET audio_data = ?, audio_file_url = ? WHERE id = ?',
        [audioData, `/api/podcasts/${id}/audio`, id]
      );
      
      res.json({ success: true, message: 'Audio uploaded successfully' });
    });
  } catch (error) {
    next(error);
  }
});

export default router;
