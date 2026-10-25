import express from 'express';
import pool from '../../config/database.js';
import { invalidateCache } from '../../middleware/cacheMiddleware.js';
import { getImageUrl } from '../../utils/imageHelpers.js';

const router = express.Router();

// Create opportunity
router.post('/', invalidateCache('cache:/api/opportunities*'), async (req, res, next) => {
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
        slug || null,
        short_description || null,
        description || null,
        category || null,
        organization_name || null,
        organization_logo || null,
        organization_website || null,
        opportunity_type || 'free',
        status || 'draft',
        featured ? 1 : 0,
        image_url || null,
        country || null,
        city || null,
        location || null,
        remote ? 1 : 0,
        eligibility || null,
        requirements || null,
        benefits || null,
        application_instructions || null,
        application_url || null,
        application_email || null,
        application_open_date || null,
        deadline || null,
        expires_at || null,
        partner_name || null,
        partner_url || null,
        affiliate_url || null,
        affiliate_network || null,
        is_paid ? 1 : 0,
        price || null,
        currency || 'KES',
        commission_type || 'none',
        commission_value || 0,
        tags || null,
        contact_name || null,
        contact_email || null,
        contact_phone || null
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
router.put('/:id', invalidateCache('cache:/api/opportunities*'), async (req, res, next) => {
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
