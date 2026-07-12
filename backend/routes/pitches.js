import express from 'express';
import pool from '../config/database.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for file uploads
const uploadDir = process.env.UPLOADS_PATH || path.join(process.cwd(), 'uploads', 'pitches');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'pitch-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.doc', '.docx', '.pdf', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only .doc, .docx, .pdf, and .txt files are allowed.'));
    }
  }
});

// Get all pitches
router.get('/', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM pitch_submissions WHERE 1=1';
    const params = [];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Get pitch by ID
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM pitch_submissions WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Pitch not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// Create pitch
router.post('/', upload.single('articleAttachment'), async (req, res, next) => {
  try {
    console.log('Received pitch submission:', req.body);
    const {
      fullName,
      email,
      phone,
      topic,
      pitchTitle,
      pitchDescription,
      authorBio,
      socialMedia,
      topicsOfInterest,
      previousPublications,
      experience
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !pitchTitle) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: fullName, email, and pitchTitle are required'
      });
    }

    const articleAttachment = req.file ? `/uploads/pitches/${req.file.filename}` : null;

    console.log('Attempting to insert pitch into database...');
    const [result] = await pool.query(
      `INSERT INTO pitch_submissions (
        full_name, 
        email, 
        phone, 
        topic, 
        pitch_title, 
        pitch_description, 
        author_bio, 
        social_media, 
        topics_of_interest, 
        previous_publications, 
        experience,
        article_attachment
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullName,
        email,
        phone,
        topic,
        pitchTitle,
        pitchDescription,
        authorBio,
        socialMedia ? JSON.stringify(socialMedia) : null,
        topicsOfInterest ? JSON.stringify(topicsOfInterest) : null,
        previousPublications,
        experience,
        articleAttachment
      ]
    );
    console.log('Pitch inserted successfully, ID:', result.insertId);

    const [newPitch] = await pool.query(
      'SELECT * FROM pitch_submissions WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json({ success: true, data: newPitch[0] });
  } catch (error) {
    console.error('Pitch submission error:', error);

    // Check if table doesn't exist
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({
        success: false,
        error: 'Database table does not exist. Please contact administrator.'
      });
    }

    next(error);
  }
});

// Update pitch status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    await pool.query(
      'UPDATE pitch_submissions SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    const [updated] = await pool.query(
      'SELECT * FROM pitch_submissions WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    next(error);
  }
});

// Delete pitch
router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query(
      'DELETE FROM pitch_submissions WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, message: 'Pitch deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
