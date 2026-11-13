import express from 'express';
import { StoryService } from '../services/storyService.js';

const router = express.Router();

const FRONTEND_URL = (process.env.FRONTEND_URL || 'https://www.trendorabay.com').replace(/\/$/, '');

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const toAbsoluteUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${FRONTEND_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const buildDescription = (content = '') =>
  String(content)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);

const renderPage = ({ target, title, description, image, url }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${url}" />

  <meta property="og:site_name" content="Trendorabay" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="${url}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />

  <meta http-equiv="refresh" content="0; url=${target}" />
  <script>window.location.replace(${JSON.stringify(target)});</script>
</head>
<body>
  <p>Redirecting to <a href="${target}">${title}</a>…</p>
</body>
</html>`;

// Serves crawler-friendly Open Graph HTML for shared story links.
// Social bots read the meta tags; browsers get redirected to the SPA.
router.get('/story/:slug', async (req, res, next) => {
  const fallbackTarget = `${FRONTEND_URL}/stories/${encodeURIComponent(req.params.slug)}`;

  try {
    const story = await StoryService.getStoryByIdOrId(req.params.slug);

    if (!story) {
      res.setHeader('Cache-Control', 'public, max-age=60');
      return res.send(
        renderPage({
          target: fallbackTarget,
          title: 'Trendorabay',
          description: 'Digital Magazine, Stories, Podcasts & Culture',
          image: `${FRONTEND_URL}/logo.jpeg`,
          url: fallbackTarget
        })
      );
    }

    const images = Array.isArray(story.featured_image_url)
      ? story.featured_image_url
      : [story.featured_image_url];
    const image = toAbsoluteUrl(images.find(Boolean)) || `${FRONTEND_URL}/logo.jpeg`;
    const storyUrl = `${FRONTEND_URL}/stories/${story.slug || req.params.slug}`;

    res.setHeader('Cache-Control', 'public, max-age=300');
    res.send(
      renderPage({
        target: storyUrl,
        title: escapeHtml(story.title || 'Trendorabay'),
        description: escapeHtml(buildDescription(story.content) || 'Read this story on Trendorabay'),
        image: escapeHtml(image),
        url: escapeHtml(storyUrl)
      })
    );
  } catch (error) {
    next(error);
  }
});

export default router;
