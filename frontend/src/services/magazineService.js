import { apiRequest } from './api';

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCached = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCached = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

const magazineService = {
  // Transform magazine data from backend to frontend format
  transformMagazine: (mag) => {
    if (!mag) return mag;
    // Backend already transforms URLs, so use them directly if they exist
    let previewPages = null;
    if (mag.previewPages || mag.preview_pages) {
      const previewData = mag.preview_pages || mag.previewPages;
      // Only try to parse if it's not already an object and doesn't look like a file path
      if (typeof previewData === 'object') {
        previewPages = previewData;
      } else if (typeof previewData === 'string' && !previewData.startsWith('/uploads/')) {
        try {
          previewPages = JSON.parse(previewData);
        } catch {
          previewPages = null;
        }
      }
    }
    
    const slug = mag.slug || String(mag.id || mag._id || mag.magazine_id);

    return {
      ...mag,
      slug,
      coverImage: mag.coverImage || mag.cover_image_url || '/music.jpeg',
      coverImageLarge: mag.coverImageLarge || mag.coverImage || mag.cover_image_url || '/music.jpeg',
      previewPages,
      // Add missing fields that MagazineDetails component expects
      fullDescription: mag.fullDescription || mag.description || 'Explore this exciting magazine issue featuring the latest stories and insights.',
      reviewCount: mag.reviewCount || mag.review_count || 0,
      rating: mag.rating || 4.5,
      readers: mag.readers || 1000,
      isNew: mag.isNew || false,
      isFeatured: mag.isFeatured || false,
      editorPick: mag.editorPick || false,
      subcategory: mag.subcategory || mag.category || 'General',
      issue: mag.issue || 'Vol. 1 / 2026',
      contributors: mag.contributors || [],
      tableOfContents: mag.tableOfContents || mag.table_of_contents || [],
      reviews: mag.reviews || [],
      relatedMagazines: mag.relatedMagazines || [],
      // Ensure price fields exist
      price: mag.price || 9.99,
      digitalPrice: mag.digitalPrice || mag.digital_price || 9.99,
      printPrice: mag.printPrice || mag.print_price || 13.99,
      subscriptionPrice: mag.subscriptionPrice || mag.subscription_price || 99.99,
      pages: mag.pages || 100,
      language: mag.language || 'English',
      publisher: mag.publisher || 'Trendorabay',
      editor: mag.editor || 'Trendorabay Editorial',
      publishDate: mag.publishDate || mag.publish_date || mag.created_at || new Date().toISOString(),
    };
  },

  // Get all magazines with optional filters
  getMagazines: async (filters = {}) => {
    const cacheKey = `magazines_${JSON.stringify(filters)}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const params = new URLSearchParams();

    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await apiRequest.get(`/magazines?${params.toString()}`);
    const magazines = response.data?.data || response.data || [];

    // Transform data if it exists
    const result = magazines.length > 0
      ? magazines.map(mag => magazineService.transformMagazine(mag))
      : magazines;

    setCached(cacheKey, result);
    return result;
  },

  // Get magazine by ID
  getMagazineById: async (id) => {
    const cacheKey = `magazine_${id}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const response = await apiRequest.get(`/magazines/${id}`);
    const magazine = response.data?.data || response.data;
    const result = magazineService.transformMagazine(magazine);

    setCached(cacheKey, result);
    return result;
  },

  // Get magazine by slug
  getMagazineBySlug: async (slug) => {
    console.log('magazineService.getMagazineBySlug called with slug:', slug);
    const cacheKey = `magazine_${slug}`;
    const cached = getCached(cacheKey);
    if (cached) {
      console.log('Returning cached magazine for slug:', slug);
      return cached;
    }

    console.log('Fetching magazine from API for slug:', slug);
    const response = await apiRequest.get(`/magazines/${slug}`);
    console.log('API response received for slug:', slug, response);
    const magazine = response.data?.data || response.data;
    console.log('Magazine data extracted:', magazine);
    const result = magazineService.transformMagazine(magazine);
    console.log('Transformed magazine:', result);

    setCached(cacheKey, result);
    return result;
  },

  // Get magazines by category
  getMagazinesByCategory: async (category, page = 1, limit = 12) => {
    const cacheKey = `magazines_category_${category}_${page}_${limit}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const response = await apiRequest.get(`/magazines/category/${category}?page=${page}&limit=${limit}`);
    const magazines = response.data?.data || response.data || [];

    const result = magazines.length > 0
      ? magazines.map(mag => magazineService.transformMagazine(mag))
      : magazines;

    setCached(cacheKey, result);
    return result;
  },

  // Get featured magazines
  getFeaturedMagazines: async (limit = 6) => {
    const cacheKey = `magazines_featured_${limit}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const response = await apiRequest.get(`/magazines/featured?limit=${limit}`);
    const magazines = response.data?.data || response.data || [];

    const result = magazines.length > 0
      ? magazines.map(mag => magazineService.transformMagazine(mag))
      : magazines;

    setCached(cacheKey, result);
    return result;
  },

  // Search magazines
  searchMagazines: async (query, page = 1, limit = 12) => {
    const cacheKey = `magazines_search_${query}_${page}_${limit}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await apiRequest.get(`/v1/magazines/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
      const magazines = response.data?.data || response.data || [];

      const result = magazines.length > 0
        ? magazines.map(mag => magazineService.transformMagazine(mag))
        : magazines;

      setCached(cacheKey, result);
      return result;
    } catch (err) {
      // Handle 404 responses with data
      if (err.response?.data?.data) {
        const magazines = err.response.data.data || [];
        const result = magazines.length > 0
          ? magazines.map(mag => magazineService.transformMagazine(mag))
          : magazines;
        setCached(cacheKey, result);
        return result;
      }
      return [];
    }
  },

  // Get magazine categories
  getCategories: async () => {
    const cacheKey = 'magazines_categories';
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const response = await apiRequest.get('/magazines/categories');
    setCached(cacheKey, response.data);
    return response.data;
  },

  // Get subscription options
  getSubscriptionOptions: async () => {
    const cacheKey = 'magazines_subscriptions';
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const response = await apiRequest.get('/magazines/subscriptions');
    setCached(cacheKey, response.data);
    return response.data;
  },

  // Create subscription (guest checkout)
  createSubscription: async (subscriptionData) => {
    const response = await apiRequest.post('/magazines/subscriptions', subscriptionData);
    return response.data;
  },
};

export default magazineService;
