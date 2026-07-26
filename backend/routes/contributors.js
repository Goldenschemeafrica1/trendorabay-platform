import express from 'express';
import pool from '../config/database.js';
import { cache } from '../middleware/cacheMiddleware.js';

const router = express.Router();

// Get all contributors
router.get('/', cache(300), async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT c.*, COALESCE(cf.follower_count, 0) as actual_followers
      FROM contributors c
      LEFT JOIN (
        SELECT contributor_id, COUNT(*) as follower_count
        FROM contributor_follows
        GROUP BY contributor_id
      ) cf ON c.id = cf.contributor_id
    `;
    const params = [];

    if (status) {
      query += ' WHERE c.status = ?';
      params.push(status);
    }

    query += ' ORDER BY c.created_at DESC';

    console.log('Executing contributors query');
    const [rows] = await pool.query(query, params);
    console.log('Contributors fetched successfully');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching contributors:', error);
    next(error);
  }
});

// Get contributor by ID
router.get('/:id', cache(300), async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT c.*, (SELECT COUNT(*) FROM contributor_follows WHERE contributor_id = c.id) as actual_followers FROM contributors c WHERE c.id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Contributor not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// Get contributors by role
router.get('/role/:role', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM contributors WHERE role = ? AND status = "active" ORDER BY created_at DESC',
      [req.params.role]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Get active contributors
router.get('/active', cache(300), async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const [rows] = await pool.query(
      'SELECT * FROM contributors WHERE status = "active" ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Search contributors
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    const [rows] = await pool.query(
      'SELECT * FROM contributors WHERE (name LIKE ? OR bio LIKE ? OR email LIKE ?) ORDER BY created_at DESC',
      [`%${q}%`, `%${q}%`, `%${q}%`]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Create contributor
router.post('/', async (req, res, next) => {
  try {
    const { name, email, bio, role, status, avatar, cover_image, role_type, expertise, twitter, instagram, linkedin, followers, featured, achievements } = req.body;
    const [result] = await pool.query(
      `INSERT INTO contributors (name, email, bio, role, status, avatar, cover_image, role_type, expertise, twitter, instagram, linkedin, followers, featured, achievements) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, bio, role, status || 'active', avatar, cover_image, role_type, expertise, twitter, instagram, linkedin, followers || 0, featured ? 1 : 0, achievements]
    );
    const [newContributor] = await pool.query(
      'SELECT * FROM contributors WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json({ success: true, data: newContributor[0] });
  } catch (error) {
    next(error);
  }
});

// Update contributor
router.put('/:id', async (req, res, next) => {
  try {
    const { name, email, bio, role, status, avatar, cover_image, role_type, expertise, twitter, instagram, linkedin, followers, featured, achievements } = req.body;
    await pool.query(
      `UPDATE contributors 
       SET name = ?, email = ?, bio = ?, role = ?, status = ?, avatar = ?, cover_image = ?, role_type = ?, expertise = ?, twitter = ?, instagram = ?, linkedin = ?, followers = ?, featured = ?, achievements = ?
       WHERE id = ?`,
      [name, email, bio, role, status, avatar, cover_image, role_type, expertise, twitter, instagram, linkedin, followers, featured ? 1 : 0, achievements, req.params.id]
    );
    const [updated] = await pool.query(
      'SELECT * FROM contributors WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    next(error);
  }
});

// Delete contributor
router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM contributors WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Contributor deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Follow a contributor
router.post('/:id/follow', async (req, res, next) => {
  try {
    const contributorId = req.params.id;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    const [contributors] = await pool.query('SELECT * FROM contributors WHERE id = ?', [contributorId]);

    if (contributors.length === 0) {
      return res.status(404).json({ success: false, error: 'Contributor not found' });
    }

    const contributor = contributors[0];

    // Insert follow relationship
    await pool.query(
      'INSERT INTO contributor_follows (user_id, contributor_id) VALUES (?, ?)',
      [user_id, contributor.id]
    );

    res.json({ success: true, message: 'Contributor followed successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, error: 'Already following this contributor' });
    }
    console.error('Error following contributor:', error);
    next(error);
  }
});

// Unfollow a contributor
router.delete('/:id/follow', async (req, res, next) => {
  try {
    const contributorId = req.params.id;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    const [contributors] = await pool.query('SELECT * FROM contributors WHERE id = ?', [contributorId]);

    if (contributors.length === 0) {
      return res.status(404).json({ success: false, error: 'Contributor not found' });
    }

    const contributor = contributors[0];

    // Delete follow relationship
    const [result] = await pool.query(
      'DELETE FROM contributor_follows WHERE user_id = ? AND contributor_id = ?',
      [user_id, contributor.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Follow relationship not found' });
    }

    res.json({ success: true, message: 'Contributor unfollowed successfully' });
  } catch (error) {
    console.error('Error unfollowing contributor:', error);
    next(error);
  }
});

// Check if user is following a contributor
router.get('/:id/follow/:userId', async (req, res, next) => {
  try {
    const contributorId = req.params.id;
    const userId = req.params.userId;

    const [contributors] = await pool.query('SELECT * FROM contributors WHERE id = ?', [contributorId]);

    if (contributors.length === 0) {
      return res.status(404).json({ success: false, error: 'Contributor not found' });
    }

    const contributor = contributors[0];

    const [follows] = await pool.query(
      'SELECT * FROM contributor_follows WHERE user_id = ? AND contributor_id = ?',
      [userId, contributor.id]
    );

    res.json({ success: true, isFollowing: follows.length > 0 });
  } catch (error) {
    console.error('Error checking follow status:', error);
    next(error);
  }
});

// Get articles by contributor
router.get('/:id/articles', async (req, res, next) => {
  try {
    const contributorId = req.params.id;
    const limit = parseInt(req.query.limit) || 10;
    
    const [contributors] = await pool.query('SELECT * FROM contributors WHERE id = ?', [contributorId]);

    if (contributors.length === 0) {
      return res.status(404).json({ success: false, error: 'Contributor not found' });
    }

    let articles = [];
    let articlesCount = 0;

    try {
      // Fetch magazines where contributor_id matches or contributors field contains the ID
      const [magazinesResult] = await pool.query(
        `SELECT m.*, c.name as category_name 
         FROM magazines m 
         LEFT JOIN categories c ON m.category_id = c.id 
         WHERE m.contributor_id = ? OR m.contributors LIKE ? 
         ORDER BY m.published_date DESC 
         LIMIT ?`,
        [contributorId, `%${contributorId}%`, limit]
      );
      articles = magazinesResult;

      const [countResult] = await pool.query(
        'SELECT COUNT(*) as count FROM magazines WHERE contributor_id = ? OR contributors LIKE ?',
        [contributorId, `%${contributorId}%`]
      );
      articlesCount = countResult[0].count;
    } catch (error) {
      console.error('Error fetching magazines:', error);
      articles = [];
      articlesCount = 0;
    }

    res.json({ 
      success: true, 
      data: articles,
      articles_count: articlesCount
    });
  } catch (error) {
    console.error('Error fetching contributor articles:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch articles', data: [], articles_count: 0 });
  }
});

export default router;
