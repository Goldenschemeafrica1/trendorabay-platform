import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Create writer application
router.post('/', async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      location,
      shortBio,
      areasOfInterest,
      writingExperience,
      portfolioUrl,
      socialMediaLinks,
      writingSampleUrl,
      whyWriteForTrendorabay,
      cvResumeUrl,
      profilePhotoUrl,
      agreeToGuidelines
    } = req.body;
    
    // Validate required fields
    if (!fullName || !email || !location || !shortBio || !writingExperience || !whyWriteForTrendorabay) {
      return res.status(400).json({ 
        success: false, 
        error: 'Full name, email, location, short bio, writing experience, and reason for writing are required' 
      });
    }

    if (!agreeToGuidelines) {
      return res.status(400).json({ 
        success: false, 
        error: 'You must agree to the writer guidelines' 
      });
    }

    const [result] = await pool.query(
      `INSERT INTO write_applications 
       (full_name, email, phone_number, location, short_bio, areas_of_interest, 
        writing_experience, portfolio_url, social_media_links, writing_sample_url, 
        why_write_for_trendorabay, cv_resume_url, profile_photo_url, agree_to_guidelines) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullName,
        email,
        phoneNumber || null,
        location,
        shortBio,
        areasOfInterest ? JSON.stringify(areasOfInterest) : null,
        writingExperience,
        portfolioUrl || null,
        socialMediaLinks ? JSON.stringify(socialMediaLinks) : null,
        writingSampleUrl || null,
        whyWriteForTrendorabay,
        cvResumeUrl || null,
        profilePhotoUrl || null,
        agreeToGuidelines ? 1 : 0
      ]
    );
    
    const [newApplication] = await pool.query(
      'SELECT * FROM write_applications WHERE id = ?',
      [result.insertId]
    );
    
    // Parse JSON fields for response (handle both string and object formats)
    const application = newApplication[0];
    if (application.areas_of_interest && typeof application.areas_of_interest === 'string') {
      application.areas_of_interest = JSON.parse(application.areas_of_interest);
    }
    if (application.social_media_links && typeof application.social_media_links === 'string') {
      application.social_media_links = JSON.parse(application.social_media_links);
    }
    
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
});

// Get all applications
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM write_applications';
    const params = [];
    
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [rows] = await pool.query(query, params);
    
    // Parse JSON fields (handle both string and object formats)
    rows.forEach(application => {
      if (application.areas_of_interest && typeof application.areas_of_interest === 'string') {
        application.areas_of_interest = JSON.parse(application.areas_of_interest);
      }
      if (application.social_media_links && typeof application.social_media_links === 'string') {
        application.social_media_links = JSON.parse(application.social_media_links);
      }
    });
    
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Get application by ID
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM write_applications WHERE id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    
    // Parse JSON fields (handle both string and object formats)
    const application = rows[0];
    if (application.areas_of_interest && typeof application.areas_of_interest === 'string') {
      application.areas_of_interest = JSON.parse(application.areas_of_interest);
    }
    if (application.social_media_links && typeof application.social_media_links === 'string') {
      application.social_media_links = JSON.parse(application.social_media_links);
    }
    
    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
});

// Update application status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'reviewed', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid status. Must be one of: pending, reviewed, approved, rejected' 
      });
    }
    
    const [result] = await pool.query(
      'UPDATE write_applications SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    
    const [updatedApplication] = await pool.query(
      'SELECT * FROM write_applications WHERE id = ?',
      [req.params.id]
    );
    
    // Parse JSON fields (handle both string and object formats)
    const application = updatedApplication[0];
    if (application.areas_of_interest && typeof application.areas_of_interest === 'string') {
      application.areas_of_interest = JSON.parse(application.areas_of_interest);
    }
    if (application.social_media_links && typeof application.social_media_links === 'string') {
      application.social_media_links = JSON.parse(application.social_media_links);
    }
    
    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
});

// Delete application
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM write_applications WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    
    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
