import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Helper function to get image URL (handle Cloudinary and local uploads)
const getImageUrl = (url) => {
  if (!url || url === 'undefined' || url === '/uploads/stories/undefined') return '/images/event-placeholder.jpg';
  
  // Return full URLs as-is (Cloudinary, external images)
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  
  // For relative paths, construct full URL using backend base
  const baseUrl = process.env.API_BASE_URL?.replace('/api', '') || `http://localhost:${process.env.PORT || 3001}`;
  
  // If it's a relative path starting with /uploads, serve from backend
  if (url.startsWith('/uploads/')) {
    return `${baseUrl}${url}`;
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

// Get all events
router.get('/', async (req, res, next) => {
  try {
    const { status, featured, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM events WHERE 1=1';
    const params = [];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (featured === 'true' || featured === true) {
      query += ' AND featured = 1';
    }
    
    query += ' ORDER BY event_date ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const [rows] = await pool.query(query, params);
    
    // Transform image URLs to serve CMS uploads
    const transformed = rows.map(event => ({
      ...event,
      image_url: getImageUrl(event.image_url)
    }));
    
    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Get event by ID
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM events WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    // Transform image URL to serve CMS uploads
    const transformed = {
      ...rows[0],
      image_url: getImageUrl(rows[0].image_url)
    };
    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Create event
router.post('/', async (req, res, next) => {
  try {
    const { 
      title, 
      description, 
      date, 
      time, 
      location, 
      type, 
      image, 
      category, 
      attendees, 
      price, 
      featured 
    } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO events (
        title, 
        description, 
        event_date, 
        event_time, 
        location, 
        event_type, 
        image_url, 
        category, 
        attendees, 
        price, 
        featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        date,
        time,
        location,
        type,
        image,
        category,
        attendees,
        price,
        featured ? 1 : 0
      ]
    );
    
    const [newEvent] = await pool.query(
      'SELECT * FROM events WHERE id = ?',
      [result.insertId]
    );
    // Transform image URL to serve CMS uploads
    const transformed = {
      ...newEvent[0],
      image_url: getImageUrl(newEvent[0].image_url)
    };
    res.status(201).json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Update event
router.put('/:id', async (req, res, next) => {
  try {
    const { 
      title, 
      description, 
      date, 
      time, 
      location, 
      type, 
      image, 
      category, 
      attendees, 
      price, 
      featured,
      status
    } = req.body;
    
    await pool.query(
      `UPDATE events SET 
        title = ?, 
        description = ?, 
        event_date = ?, 
        event_time = ?, 
        location = ?, 
        event_type = ?, 
        image_url = ?, 
        category = ?, 
        attendees = ?, 
        price = ?, 
        featured = ?,
        status = ?
      WHERE id = ?`,
      [
        title,
        description,
        date,
        time,
        location,
        type,
        image,
        category,
        attendees,
        price,
        featured ? 1 : 0,
        status,
        req.params.id
      ]
    );
    
    const [updated] = await pool.query(
      'SELECT * FROM events WHERE id = ?',
      [req.params.id]
    );
    // Transform image URL to serve CMS uploads
    const transformed = {
      ...updated[0],
      image_url: getImageUrl(updated[0].image_url)
    };
    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Delete event
router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query(
      'DELETE FROM events WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
