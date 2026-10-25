import express from 'express';
import pool from '../../config/database.js';
import { cache } from '../../middleware/cacheMiddleware.js';
import { getPodcastImageUrl } from '../../utils/imageHelpers.js';

const router = express.Router();

// Get all podcasts
router.get('/', cache(300), async (req, res, next) => {
  try {
    const { status, trending, series, limit } = req.query;
    let query = 'SELECT id, title, episode_number, description, cover_art_url, audio_file_url, video_file_url, category_id, guest, series, duration, host, host_id, trending, status, related_story_id, is_featured_guest, published_at, created_at, updated_at FROM podcasts WHERE 1=1';
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

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const [rows] = await pool.query(query, params);

    // Transform image URLs
    const transformed = rows.map(podcast => ({
      ...podcast,
      coverImage: getPodcastImageUrl(podcast.cover_art_url, podcast.title, podcast.guest)
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

    const transformed = {
      ...rows[0],
      coverImage: getPodcastImageUrl(rows[0].cover_art_url, rows[0].title, rows[0].guest)
    };

    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

export default router;
