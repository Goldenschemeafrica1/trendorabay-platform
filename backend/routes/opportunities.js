import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Helper function to get image URL (handle Cloudinary and CMS uploads)
const getImageUrl = (url) => {
  if (!url || url === 'undefined' || url === '/uploads/opportunities/undefined') return '/images/opportunity-placeholder.jpg';
  
  // Return full URLs as-is (Cloudinary, external images)
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  
  // For relative paths, construct full URL using CMS base
  const cmsUrl = process.env.CMS_URL || 'https://trendorabay-content-management-system.onrender.com';
  
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

// Get all opportunities
router.get('/', async (req, res, next) => {
  try {
    const { status, featured, category, country, opportunity_type, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM opportunities WHERE 1=1';
    const params = [];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    // Don't filter by status by default - show all opportunities
    
    if (featured === 'true' || featured === true) {
      query += ' AND featured = 1';
    }
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (country) {
      query += ' AND country = ?';
      params.push(country);
    }
    
    if (opportunity_type) {
      query += ' AND opportunity_type = ?';
      params.push(opportunity_type);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const [rows] = await pool.query(query, params);
    
    // Transform image URLs to serve CMS uploads
    const transformed = rows.map(opportunity => ({
      ...opportunity,
      image_url: getImageUrl(opportunity.image_url),
      organization_logo: getImageUrl(opportunity.organization_logo)
    }));
    
    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Get opportunity by ID or slug
router.get('/:identifier', async (req, res, next) => {
  try {
    const identifier = req.params.identifier;
    const isNumeric = /^\d+$/.test(identifier);
    
    let query, params;
    if (isNumeric) {
      query = 'SELECT * FROM opportunities WHERE id = ?';
      params = [identifier];
    } else {
      query = 'SELECT * FROM opportunities WHERE slug = ?';
      params = [identifier];
    }
    
    const [rows] = await pool.query(query, params);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Opportunity not found' });
    }
    
    // Transform image URLs to serve CMS uploads
    const transformed = {
      ...rows[0],
      image_url: getImageUrl(rows[0].image_url),
      organization_logo: getImageUrl(rows[0].organization_logo)
    };
    
    // Increment views count
    await pool.query('UPDATE opportunities SET views = views + 1 WHERE id = ?', [rows[0].id]);
    
    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Create opportunity
router.post('/', async (req, res, next) => {
  try {
    const { 
      title, 
      slug, 
      short_description, 
      description, 
      category, 
      organization_name, 
      organization_logo, 
      organization_website, 
      opportunity_type, 
      status, 
      featured, 
      image_url, 
      country, 
      city, 
      location, 
      remote, 
      eligibility, 
      requirements, 
      benefits, 
      application_instructions, 
      application_url, 
      application_email, 
      application_open_date, 
      deadline, 
      expires_at, 
      partner_name, 
      partner_url, 
      affiliate_url, 
      affiliate_network, 
      is_paid, 
      price, 
      currency, 
      commission_type, 
      commission_value, 
      tags, 
      contact_name, 
      contact_email, 
      contact_phone 
    } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO opportunities (
        title, 
        slug, 
        short_description, 
        description, 
        category, 
        organization_name, 
        organization_logo, 
        organization_website, 
        opportunity_type, 
        status, 
        featured, 
        image_url, 
        country, 
        city, 
        location, 
        remote, 
        eligibility, 
        requirements, 
        benefits, 
        application_instructions, 
        application_url, 
        application_email, 
        application_open_date, 
        deadline, 
        expires_at, 
        partner_name, 
        partner_url, 
        affiliate_url, 
        affiliate_network, 
        is_paid, 
        price, 
        currency, 
        commission_type, 
        commission_value, 
        tags, 
        contact_name, 
        contact_email, 
        contact_phone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        slug,
        short_description,
        description,
        category,
        organization_name,
        organization_logo,
        organization_website,
        opportunity_type || 'free',
        status || 'draft',
        featured ? 1 : 0,
        image_url,
        country,
        city,
        location,
        remote ? 1 : 0,
        eligibility,
        requirements,
        benefits,
        application_instructions,
        application_url,
        application_email,
        application_open_date,
        deadline,
        expires_at,
        partner_name,
        partner_url,
        affiliate_url,
        affiliate_network,
        is_paid ? 1 : 0,
        price,
        currency || 'KES',
        commission_type || 'none',
        commission_value || 0,
        tags,
        contact_name,
        contact_email,
        contact_phone
      ]
    );
    
    const [newOpportunity] = await pool.query(
      'SELECT * FROM opportunities WHERE id = ?',
      [result.insertId]
    );
    
    // Transform image URLs to serve CMS uploads
    const transformed = {
      ...newOpportunity[0],
      image_url: getImageUrl(newOpportunity[0].image_url),
      organization_logo: getImageUrl(newOpportunity[0].organization_logo)
    };
    
    res.status(201).json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Update opportunity
router.put('/:id', async (req, res, next) => {
  try {
    const { 
      title, 
      slug, 
      short_description, 
      description, 
      category, 
      organization_name, 
      organization_logo, 
      organization_website, 
      opportunity_type, 
      status, 
      featured, 
      image_url, 
      country, 
      city, 
      location, 
      remote, 
      eligibility, 
      requirements, 
      benefits, 
      application_instructions, 
      application_url, 
      application_email, 
      application_open_date, 
      deadline, 
      expires_at, 
      published_at, 
      partner_name, 
      partner_url, 
      affiliate_url, 
      affiliate_network, 
      is_paid, 
      price, 
      currency, 
      commission_type, 
      commission_value, 
      tags, 
      contact_name, 
      contact_email, 
      contact_phone,
      review_status,
      review_notes
    } = req.body;
    
    await pool.query(
      `UPDATE opportunities SET 
        title = ?, 
        slug = ?, 
        short_description = ?, 
        description = ?, 
        category = ?, 
        organization_name = ?, 
        organization_logo = ?, 
        organization_website = ?, 
        opportunity_type = ?, 
        status = ?, 
        featured = ?, 
        image_url = ?, 
        country = ?, 
        city = ?, 
        location = ?, 
        remote = ?, 
        eligibility = ?, 
        requirements = ?, 
        benefits = ?, 
        application_instructions = ?, 
        application_url = ?, 
        application_email = ?, 
        application_open_date = ?, 
        deadline = ?, 
        expires_at = ?, 
        published_at = ?, 
        partner_name = ?, 
        partner_url = ?, 
        affiliate_url = ?, 
        affiliate_network = ?, 
        is_paid = ?, 
        price = ?, 
        currency = ?, 
        commission_type = ?, 
        commission_value = ?, 
        tags = ?, 
        contact_name = ?, 
        contact_email = ?, 
        contact_phone = ?,
        review_status = ?,
        review_notes = ?
      WHERE id = ?`,
      [
        title,
        slug,
        short_description,
        description,
        category,
        organization_name,
        organization_logo,
        organization_website,
        opportunity_type || 'free',
        status || 'draft',
        featured ? 1 : 0,
        image_url,
        country,
        city,
        location,
        remote ? 1 : 0,
        eligibility,
        requirements,
        benefits,
        application_instructions,
        application_url,
        application_email,
        application_open_date,
        deadline,
        expires_at,
        published_at,
        partner_name,
        partner_url,
        affiliate_url,
        affiliate_network,
        is_paid ? 1 : 0,
        price,
        currency || 'KES',
        commission_type || 'none',
        commission_value || 0,
        tags,
        contact_name,
        contact_email,
        contact_phone,
        review_status || 'not_reviewed',
        review_notes,
        req.params.id
      ]
    );
    
    const [updated] = await pool.query(
      'SELECT * FROM opportunities WHERE id = ?',
      [req.params.id]
    );
    
    // Transform image URLs to serve CMS uploads
    const transformed = {
      ...updated[0],
      image_url: getImageUrl(updated[0].image_url),
      organization_logo: getImageUrl(updated[0].organization_logo)
    };
    
    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Delete opportunity
router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query(
      'DELETE FROM opportunities WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, message: 'Opportunity deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Track click/conversion
router.post('/:id/click', async (req, res, next) => {
  try {
    await pool.query(
      'UPDATE opportunities SET clicks = clicks + 1 WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, message: 'Click tracked successfully' });
  } catch (error) {
    next(error);
  }
});

// Track application
router.post('/:id/apply', async (req, res, next) => {
  try {
    await pool.query(
      'UPDATE opportunities SET applications = applications + 1 WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, message: 'Application tracked successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;