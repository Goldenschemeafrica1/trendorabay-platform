import express from 'express';
import pool from '../../config/database.js';
import { cache } from '../../middleware/cacheMiddleware.js';

const router = express.Router();

// Helper function to parse table of contents text to JSON
const parseTableOfContents = (tocText) => {
  if (!tocText) return [];
  
  try {
    // If it's already JSON, parse it
    if (tocText.trim().startsWith('[')) {
      return JSON.parse(tocText);
    }
    
    // Parse text format: "1.Title — Page 4"
    const items = tocText.split(/\d+\.|\d+\)/).filter(item => item.trim());
    const parsed = [];
    
    items.forEach(item => {
      const match = item.match(/(.+?)\s*—\s*Page\s*(\d+)/i);
      if (match) {
        parsed.push({
          title: match[1].trim(),
          page: parseInt(match[2])
        });
      }
    });
    
    return parsed;
  } catch (error) {
    console.error('Error parsing table of contents:', error);
    return [];
  }
};

// Helper function to fetch contributors by IDs
const fetchContributors = async (contributorIds) => {
  if (!contributorIds) return [];

  try {
    // Parse contributor IDs (could be comma-separated or single ID)
    const ids = contributorIds.toString().split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

    if (ids.length === 0) return [];

    const [contributors] = await pool.query(
      'SELECT id, name, role, avatar FROM contributors WHERE id IN (?) AND status = "active"',
      [ids]
    );

    return contributors;
  } catch (error) {
    console.error('Error fetching contributors:', error);
    return [];
  }
};

// Create magazine
router.post('/', async (req, res, next) => {
  try {
    const {
      title,
      slug,
      issue,
      description,
      full_description,
      cover_image_url,
      cover_image_large_url,
      category,
      subcategory,
      price,
      digital_price,
      print_price,
      subscription_price,
      pages,
      language,
      publisher,
      editor,
      created_at,
      status,
      is_featured,
      is_new,
      editor_pick,
      contributor_ids,
      table_of_contents,
      preview_pages,
      related_magazines
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO magazines (
        title, slug, issue, description, full_description, cover_image_url, cover_image_large_url,
        category, subcategory, price, digital_price, print_price, subscription_price,
        pages, language, publisher, editor, created_at, status,
        is_featured, is_new, editor_pick, contributor_ids, table_of_contents,
        preview_pages, related_magazines
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        slug,
        issue,
        description,
        full_description,
        cover_image_url,
        cover_image_large_url,
        category,
        subcategory,
        price || 9.99,
        digital_price || 9.99,
        print_price || 13.99,
        subscription_price || 99.99,
        pages || 100,
        language || 'English',
        publisher || 'Trendorabay',
        editor || 'Trendorabay Editorial',
        created_at || new Date(),
        status || 'published',
        is_featured ? 1 : 0,
        is_new ? 1 : 0,
        editor_pick ? 1 : 0,
        contributor_ids,
        table_of_contents,
        preview_pages,
        related_magazines
      ]
    );

    const [newMagazine] = await pool.query(
      'SELECT * FROM magazines WHERE id = ?',
      [result.insertId]
    );

    // Parse table of contents
    const parsedTOC = parseTableOfContents(newMagazine[0].table_of_contents);

    // Fetch contributors
    const contributors = await fetchContributors(newMagazine[0].contributor_ids);

    const transformed = {
      ...newMagazine[0],
      table_of_contents: parsedTOC,
      contributors
    };

    res.status(201).json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Update magazine
router.put('/:id', async (req, res, next) => {
  try {
    const {
      title,
      slug,
      issue,
      description,
      full_description,
      cover_image_url,
      cover_image_large_url,
      category,
      subcategory,
      price,
      digital_price,
      print_price,
      subscription_price,
      pages,
      language,
      publisher,
      editor,
      created_at,
      status,
      is_featured,
      is_new,
      editor_pick,
      contributor_ids,
      table_of_contents,
      preview_pages,
      related_magazines
    } = req.body;

    await pool.query(
      `UPDATE magazines SET
        title = ?, slug = ?, issue = ?, description = ?, full_description = ?,
        cover_image_url = ?, cover_image_large_url = ?, category = ?, subcategory = ?,
        price = ?, digital_price = ?, print_price = ?, subscription_price = ?,
        pages = ?, language = ?, publisher = ?, editor = ?, created_at = ?,
        status = ?, is_featured = ?, is_new = ?, editor_pick = ?,
        contributor_ids = ?, table_of_contents = ?, preview_pages = ?, related_magazines = ?
      WHERE id = ?`,
      [
        title,
        slug,
        issue,
        description,
        full_description,
        cover_image_url,
        cover_image_large_url,
        category,
        subcategory,
        price || 9.99,
        digital_price || 9.99,
        print_price || 13.99,
        subscription_price || 99.99,
        pages || 100,
        language || 'English',
        publisher || 'Trendorabay',
        editor || 'Trendorabay Editorial',
        created_at,
        status || 'published',
        is_featured ? 1 : 0,
        is_new ? 1 : 0,
        editor_pick ? 1 : 0,
        contributor_ids,
        table_of_contents,
        preview_pages,
        related_magazines,
        req.params.id
      ]
    );

    const [updated] = await pool.query(
      'SELECT * FROM magazines WHERE id = ?',
      [req.params.id]
    );

    // Parse table of contents
    const parsedTOC = parseTableOfContents(updated[0].table_of_contents);

    // Fetch contributors
    const contributors = await fetchContributors(updated[0].contributor_ids);

    const transformed = {
      ...updated[0],
      table_of_contents: parsedTOC,
      contributors
    };

    res.json({ success: true, data: transformed });
  } catch (error) {
    next(error);
  }
});

// Delete magazine
router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query(
      'DELETE FROM magazines WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, message: 'Magazine deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
