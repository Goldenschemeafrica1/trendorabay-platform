import pool from '../config/database.js';
import { 
  transformStory, 
  transformStoryWithImages, 
  generateSlug,
  getStoriesByDisplaySection 
} from '../utils/storyHelpers.js';
import { cacheDelPattern, cacheGet, cacheSet } from '../config/redis.js';
import { cachePatterns } from '../middleware/cacheMiddleware.js';

export const StoryService = {
  async getHomepageStories(status = 'published') {
    const cacheKey = `stories:homepage:${status}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const sections = ['featured', 'horizontal', 'must_read', 'text_only', 'innovation', 'latest_stories'];
    const results = await Promise.all(
      sections.map(section => getStoriesByDisplaySection(pool, status, section))
    );
    
    const data = {
      featuredStories: results[0][0].map(transformStory),
      horizontalStories: results[1][0].map(transformStory),
      mustReadStories: results[2][0].map(transformStory),
      textOnlyStories: results[3][0].map(transformStory),
      innovationStories: results[4][0].map(transformStory),
      latestStories: results[5][0].map(transformStory)
    };

    await cacheSet(cacheKey, data, 300); // Cache for 5 minutes
    return data;
  },

  async getStories(filters = {}) {
    const { category, author, search, page = 1, limit = 12, featured, status } = filters;
    const offset = (page - 1) * limit;

    let countQuery = 'SELECT COUNT(*) as total FROM stories s WHERE 1=1';
    const countParams = [];

    if (category) {
      countQuery += ' AND s.category_id = ?';
      countParams.push(category);
    }
    if (author) {
      countQuery += ' AND s.author_id = ?';
      countParams.push(author);
    }
    if (search) {
      countQuery += ' AND (s.title LIKE ? OR s.content LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }
    if (featured) {
      countQuery += ' AND s.featured = 1';
    }
    if (status) {
      countQuery += ' AND s.status = ?';
      countParams.push(status);
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Exclude content field for list views to reduce data transfer
    let query = `
      SELECT s.id, s.slug, s.title, s.featured_image_url, s.featured_image_url_2, s.featured_image_url_3, s.featured_image_url_4, s.category_id, s.author_id, s.featured, s.published_at, s.created_at, s.updated_at, s.status, s.display_section, a.name as author_name, a.avatar_url as author_avatar, c.name as category_name
      FROM stories s
      LEFT JOIN authors a ON s.author_id = a.id
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ' AND s.category_id = ?';
      params.push(category);
    }
    if (author) {
      query += ' AND s.author_id = ?';
      params.push(author);
    }
    if (search) {
      query += ' AND (s.title LIKE ? OR s.content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (featured) {
      query += ' AND s.featured = 1';
    }
    if (status) {
      query += ' AND s.status = ?';
      params.push(status);
    }

    query += ' ORDER BY s.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);

    return {
      data: rows.map(transformStory),
      totalPages,
      total
    };
  },

  async searchStories(query, page = 1, limit = 12) {
    const offset = (page - 1) * limit;
    
    const [rows] = await pool.query(
      `SELECT s.*, a.name as author_name 
       FROM stories s 
       LEFT JOIN authors a ON s.author_id = a.id 
       WHERE (s.title LIKE ? OR s.content LIKE ?) AND s.status = 'published'
       ORDER BY s.created_at DESC 
       LIMIT ? OFFSET ?`,
      [`%${query}%`, `%${query}%`, limit, offset]
    );
    
    return rows;
  },

  async getLatestStories(limit = 10) {
    const cacheKey = `stories:latest:${limit}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    // Exclude content field for list views to reduce data transfer
    const [rows] = await pool.query(
      `SELECT s.id, s.slug, s.title, s.featured_image_url, s.category_id, s.author_id, s.featured, s.published_at, s.created_at, s.status, s.display_section, a.name as author_name, a.avatar_url as author_avatar, c.name as category_name
       FROM stories s
       LEFT JOIN authors a ON s.author_id = a.id
       LEFT JOIN categories c ON s.category_id = c.id
       WHERE s.status = 'published'
       ORDER BY s.created_at DESC
       LIMIT ?`,
      [limit]
    );

    const data = rows.map(transformStory);
    await cacheSet(cacheKey, data, 300); // Cache for 5 minutes
    return data;
  },

  async getFeaturedStory() {
    const [rows] = await pool.query(
      `SELECT s.*, a.name as author_name 
       FROM stories s 
       LEFT JOIN authors a ON s.author_id = a.id 
       WHERE s.featured = 1 AND s.status = 'published' 
       ORDER BY s.created_at DESC 
       LIMIT 1`
    );
    
    return rows[0] || null;
  },

  async getRecentStories(limit = 10) {
    const [rows] = await pool.query(
      `SELECT s.*, a.name as author_name 
       FROM stories s 
       LEFT JOIN authors a ON s.author_id = a.id 
       WHERE s.status = 'published'
       ORDER BY s.created_at DESC 
       LIMIT ?`,
      [limit]
    );
    
    return rows;
  },

  async getPopularStories(limit = 6) {
    const [rows] = await pool.query(
      `SELECT s.*, a.name as author_name 
       FROM stories s 
       LEFT JOIN authors a ON s.author_id = a.id 
       WHERE s.status = 'published'
       ORDER BY s.views DESC 
       LIMIT ?`,
      [limit]
    );
    
    return rows;
  },

  async getStoryByIdOrId(param) {
    const isNumeric = /^\d+$/.test(param);
    const cacheKey = `story:${isNumeric ? 'id' : 'slug'}:${param}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    console.log('getStoryByIdOrId called with param:', param, 'isNumeric:', isNumeric);

    let rows;

    if (isNumeric) {
      console.log('Querying by ID:', param);
      [rows] = await pool.query(
        `SELECT s.id, s.slug, s.title, s.content, s.featured_image_url, s.featured_image_url_2, s.featured_image_url_3, s.featured_image_url_4, s.category_id, s.author_id, s.featured, s.published_at, s.created_at, s.updated_at, s.status, s.display_section, s.views, a.name as author_name, a.avatar_url as author_avatar, a.bio as author_bio, c.name as category_name
         FROM stories s
         LEFT JOIN authors a ON s.author_id = a.id
         LEFT JOIN categories c ON s.category_id = c.id
         WHERE s.id = ?`,
        [param]
      );
    } else {
      console.log('Querying by slug:', param);
      [rows] = await pool.query(
        `SELECT s.id, s.slug, s.title, s.content, s.featured_image_url, s.featured_image_url_2, s.featured_image_url_3, s.featured_image_url_4, s.category_id, s.author_id, s.featured, s.published_at, s.created_at, s.updated_at, s.status, s.display_section, s.views, a.name as author_name, a.avatar_url as author_avatar, a.bio as author_bio, c.name as category_name
         FROM stories s
         LEFT JOIN authors a ON s.author_id = a.id
         LEFT JOIN categories c ON s.category_id = c.id
         WHERE s.slug = ?`,
        [param]
      );
    }

    console.log('Query returned', rows.length, 'rows');

    if (rows.length === 0) {
      return null;
    }

    const story = rows[0];
    
    if (!story.slug) {
      const generatedSlug = generateSlug(story.title, story.id);
      await pool.query('UPDATE stories SET slug = ? WHERE id = ?', [generatedSlug, story.id]);
      story.slug = generatedSlug;
    }

    const transformed = transformStoryWithImages(story);
    await cacheSet(cacheKey, transformed, 600); // Cache for 10 minutes
    return transformed;
  },

  async createStory(data) {
    const { title, content, featured_image_url, featured_image_url_2, featured_image_url_3, featured_image_url_4, author_id, category_id, tags, display_section } = data;
    
    let slug = generateSlug(title, Date.now());
    
    let counter = 1;
    let originalSlug = slug;
    
    while (true) {
      const [existing] = await pool.query('SELECT id FROM stories WHERE slug = ?', [slug]);
      if (existing.length === 0) break;
      
      slug = `${originalSlug}-${counter}`;
      counter++;
    }
    
    const [result] = await pool.query(
      `INSERT INTO stories (title, slug, content, featured_image_url, featured_image_url_2, featured_image_url_3, featured_image_url_4, author_id, category_id, tags, display_section)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, content, featured_image_url, featured_image_url_2, featured_image_url_3, featured_image_url_4, author_id, category_id, tags, display_section || 'featured']
    );
    
    const [newStory] = await pool.query(
      `SELECT s.*, a.name as author_name 
       FROM stories s 
       LEFT JOIN authors a ON s.author_id = a.id 
       WHERE s.id = ?`,
      [result.insertId]
    );
    
    await cacheDelPattern(cachePatterns.stories);
    
    return newStory[0];
  },

  async updateStory(id, data) {
    const { title, content, featured_image_url, featured_image_url_2, featured_image_url_3, featured_image_url_4, author_id, category_id, tags, display_section } = data;
    
    const [current] = await pool.query('SELECT title, slug FROM stories WHERE id = ?', [id]);
    if (current.length === 0) {
      return null;
    }
    
    let slug = current[0].slug;
    if (title && title !== current[0].title) {
      let newSlug = generateSlug(title, Date.now());
      
      let counter = 1;
      let originalSlug = newSlug;
      
      while (true) {
        const [existing] = await pool.query('SELECT id FROM stories WHERE slug = ? AND id != ?', [newSlug, id]);
        if (existing.length === 0) break;
        
        newSlug = `${originalSlug}-${counter}`;
        counter++;
      }
      
      slug = newSlug;
    }
    
    await pool.query(
      `UPDATE stories
       SET title = ?, slug = ?, content = ?, featured_image_url = ?, featured_image_url_2 = ?, featured_image_url_3 = ?, featured_image_url_4 = ?, author_id = ?, category_id = ?, tags = ?, display_section = ?
       WHERE id = ?`,
      [title, slug, content, featured_image_url, featured_image_url_2, featured_image_url_3, featured_image_url_4, author_id, category_id, tags, display_section || 'featured', id]
    );
    
    const [updated] = await pool.query(
      `SELECT s.*, a.name as author_name 
       FROM stories s 
       LEFT JOIN authors a ON s.author_id = a.id 
       WHERE s.id = ?`,
      [id]
    );
    
    // Invalidate cache
    await cacheDelPattern('cache:/api/stories*');
    await cacheDel(`story:id:${id}`);
    await cacheDel(`story:slug:${slug}`);
    
    return updated[0];
  },

  async deleteStory(id) {
    await pool.query('DELETE FROM stories WHERE id = ?', [id]);
  },

  async toggleFeatured(id, featured) {
    await pool.query(
      'UPDATE stories SET featured = ? WHERE id = ?',
      [featured ? 1 : 0, id]
    );
    
    const [updated] = await pool.query(
      `SELECT s.*, a.name as author_name
       FROM stories s
       LEFT JOIN authors a ON s.author_id = a.id
       WHERE s.id = ?`,
      [id]
    );
    
    // Invalidate cache
    await cacheDelPattern('cache:/api/stories*');
    await cacheDel(`story:id:${id}`);
    
    return updated[0];
  },

  async incrementViews(id) {
    await pool.query(
      'UPDATE stories SET views = views + 1 WHERE id = ?',
      [id]
    );

    const [result] = await pool.query(
      'SELECT views FROM stories WHERE id = ?',
      [id]
    );

    return result[0]?.views || 0;
  }
};
