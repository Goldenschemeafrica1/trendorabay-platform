// Story utility functions for data transformation and URL handling

const categoryImageMap = {
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
};

export const getImageUrl = (url, category) => {
  if (!url || url === 'undefined' || url === '/uploads/stories/undefined') {
    return categoryImageMap[category] || '/music.jpeg';
  }
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  if (url.startsWith('/uploads/')) {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    return `${backendUrl}${url}`;
  }
  
  if (url.startsWith('/')) {
    return url;
  }
  
  if (!url.includes('/')) {
    return `/${url}`;
  }
  
  return url;
};

export const getAvatarUrl = (url) => {
  if (!url) return '/logo.jpeg';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads/')) return '/logo.jpeg';
  if (url.startsWith('/')) return url;
  if (!url.includes('/')) return `/${url}`;
  return url;
};

export const generateSlug = (title, id) => {
  const cleanTitle = title?.trim() || '';
  return cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || String(id);
};

export const transformStory = (story) => {
  const cleanTitle = story.title?.trim() || '';
  const slug = story.slug || generateSlug(cleanTitle, story.id);
  const categoryName = story.category_name || 'General';

  return {
    id: story.id,
    slug,
    title: story.title,
    content: story.content,
    imageUrl: getImageUrl(story.featured_image_url, categoryName),
    categoryName: categoryName,
    category: categoryName,
    featured: story.featured === 1,
    displaySection: story.display_section,
    author: story.author_id ? {
      id: story.author_id,
      name: story.author_name || 'Unknown Author',
      avatar: getAvatarUrl(story.author_avatar)
    } : null,
    publishedDate: story.published_at || story.created_at,
    createdAt: story.created_at,
    updatedAt: story.updated_at,
    status: story.status,
    author_name: story.author_name,
    author_id: story.author_id
  };
};

export const transformStoryWithImages = (story) => {
  const cleanTitle = story.title?.trim() || '';
  const slug = story.slug || generateSlug(cleanTitle, story.id);
  const categoryName = story.category_name || 'General';

  const imageUrls = [];
  if (story.featured_image_url) {
    imageUrls.push(getImageUrl(story.featured_image_url, categoryName));
  }
  if (story.featured_image_url_2) {
    imageUrls.push(getImageUrl(story.featured_image_url_2, categoryName));
  }
  if (story.featured_image_url_3) {
    imageUrls.push(getImageUrl(story.featured_image_url_3, categoryName));
  }
  if (story.featured_image_url_4) {
    imageUrls.push(getImageUrl(story.featured_image_url_4, categoryName));
  }

  return {
    ...story,
    slug,
    category: categoryName,
    author_avatar: getAvatarUrl(story.author_avatar),
    featured_image_url: imageUrls.length > 0 ? imageUrls : null
  };
};

export const getStoriesByDisplaySection = async (pool, status, displaySection) => {
  return pool.query(
    `SELECT s.id, s.slug, s.title, s.content, s.featured_image_url, s.category_id, s.author_id, s.featured, s.published_at, s.created_at, s.updated_at, s.status, s.display_section, a.name as author_name, a.avatar_url as author_avatar, c.name as category_name
     FROM stories s
     LEFT JOIN authors a ON s.author_id = a.id
     LEFT JOIN categories c ON s.category_id = c.id
     WHERE s.status = ? AND s.display_section = ?
     ORDER BY s.created_at DESC`,
    [status, displaySection]
  );
};
