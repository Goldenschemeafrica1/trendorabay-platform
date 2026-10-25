/**
 * Image URL Helper Functions
 * Centralized logic for handling image URLs from different sources
 * (Cloudinary, CMS uploads, frontend public folder)
 */

/**
 * Get image URL with category-based fallback
 * @param {string} url - The image URL from database
 * @param {string} category - Category for fallback image
 * @param {string} type - Type of content (default, magazine, podcast, etc.)
 * @returns {string} - Full image URL
 */
export const getImageUrl = (url, category = null, type = 'default') => {
  // Default placeholder
  const defaultPlaceholder = '/images/opportunity-placeholder.jpg';

  // Category-based image mappings for different content types
  const categoryImageMaps = {
    default: {
      'Music': '/music.jpeg',
      'Fashion': '/fashionandbusiness.jpeg',
      'Business': '/financeandinvestment.jpeg',
      'Technology': '/blockchain.jpeg',
      'Travel': '/community.jpeg',
      'Lifestyle': '/womeninbusiness.jpeg',
      'Finance': '/financeandinvestment.jpeg',
      'Sports': '/boxing.jpeg',
      'Art': '/photography.jpeg',
      'Food': '/barandrestaurant.jpeg',
      'Health': '/kids.jpeg',
      'Automotive': '/automotives.jpeg'
    },
    magazine: {
      'Business': '/financeandinvestment.jpeg',
      'Culture': '/music.jpeg',
      'Technology': '/blockchain.jpeg',
      'Fashion': '/fashionandbusiness.jpeg',
      'Lifestyle': '/womeninbusiness.jpeg'
    },
    podcast: {
      'kandanda': '/music.jpeg',
      'Tech Talk': '/blockchain.jpeg',
      'Design Matters': '/fashionandbusiness.jpeg',
      'Business Insights': '/financeandinvestment.jpeg'
    }
  };

  // If URL is empty or undefined, use category-based image or default
  if (!url || url === 'undefined' || url === '/uploads/undefined' || url === '') {
    const map = categoryImageMaps[type] || categoryImageMaps.default;
    return map[category] || defaultPlaceholder;
  }

  // Return full URLs as-is (Cloudinary, external images)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // For relative paths starting with /uploads, serve from CMS
  if (url.startsWith('/uploads/')) {
    const cmsUrl = process.env.CMS_URL || 'https://trendorabay-content-management-system.onrender.com';
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

/**
 * Get image URL for podcasts with title/guest fallback
 * @param {string} url - The image URL from database
 * @param {string} title - Podcast title
 * @param {string} guest - Podcast guest
 * @returns {string} - Full image URL
 */
export const getPodcastImageUrl = (url, title, guest) => {
  const podcastImageMap = {
    'kandanda': '/music.jpeg',
    'Tech Talk': '/blockchain.jpeg',
    'Design Matters': '/fashionandbusiness.jpeg',
    'Business Insights': '/financeandinvestment.jpeg'
  };

  // Check title first
  if (title && podcastImageMap[title]) {
    return podcastImageMap[title];
  }

  // Check guest
  if (guest && podcastImageMap[guest]) {
    return podcastImageMap[guest];
  }

  // Use general getImageUrl as fallback
  return getImageUrl(url, null, 'podcast');
};
