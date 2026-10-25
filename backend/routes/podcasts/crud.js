import express from 'express';
import pool from '../../config/database.js';
import { cacheDelPattern } from '../../config/redis.js';
import { getPodcastImageUrl } from '../../utils/imageHelpers.js';

const router = express.Router();

// Create podcast
router.post('/', async (req, res, next) => {
  try {
    const {
      title,
      episode_number,
      description,
      cover_art_url,
      audio_file_url,
      video_file_url,
      category_id,
      guest,
      series,
      duration,
      host,
      host_id,
      trending,
      status,
      related_story_id,
      is_featured_guest
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO podcasts (
        title, episode_number, description, cover_art_url, audio_file_url, video_file_url,
        category_id, guest, series, duration, host, host_id, trending, status,
        related_story_id, is_featured_guest, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        title,
        episode_number,
        description,
        cover_art_url,
        audio_file_url,
        video_file_url,
        category_id,
        guest,
        series,
        duration,
        host,
        host_id,
        trending ? 1 : 0,
        status || 'draft',
        related_story_id,
        is_featured_guest ? 1 : 0
      ]
    );

    // Invalidate cache
    cacheDelPattern('cache:/api/podcasts*');

    const [newPodcast] = await pool.query(
      'SELECT * FROM podcasts WHERE id = ?',
      [result.insertId]
    );

    const transformed = {
      ...newPodcast[0],
      coverImage: getPodcastImageUrl(newPodcast[0].cover_art_url, newPodcast[0].title, newPodcast[0].guest)
    };

    res.status(201).json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Update podcast
router.put('/:id', async (req, res, next) => {
  try {
    const {
      title,
      episode_number,
      description,
      cover_art_url,
      audio_file_url,
      video_file_url,
      category_id,
      guest,
      series,
      duration,
      host,
      host_id,
      trending,
      status,
      related_story_id,
      is_featured_guest
    } = req.body;

    await pool.query(
      `UPDATE podcasts SET
        title = ?, episode_number = ?, description = ?, cover_art_url = ?, audio_file_url = ?,
        video_file_url = ?, category_id = ?, guest = ?, series = ?, duration = ?, host = ?,
        host_id = ?, trending = ?, status = ?, related_story_id = ?, is_featured_guest = ?
      WHERE id = ?`,
      [
        title,
        episode_number,
        description,
        cover_art_url,
        audio_file_url,
        video_file_url,
        category_id,
        guest,
        series,
        duration,
        host,
        host_id,
        trending ? 1 : 0,
        status || 'draft',
        related_story_id,
        is_featured_guest ? 1 : 0,
        req.params.id
      ]
    );

    // Invalidate cache
    cacheDelPattern('cache:/api/podcasts*');

    const [updated] = await pool.query(
      'SELECT * FROM podcasts WHERE id = ?',
      [req.params.id]
    );

    const transformed = {
      ...updated[0],
      coverImage: getPodcastImageUrl(updated[0].cover_art_url, updated[0].title, updated[0].guest)
    };

    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Delete podcast
router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query(
      'DELETE FROM podcasts WHERE id = ?',
      [req.params.id]
    );

    // Invalidate cache
    cacheDelPattern('cache:/api/podcasts*');

    res.json({ success: true, message: 'Podcast deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
