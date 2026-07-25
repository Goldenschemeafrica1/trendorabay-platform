import storyService from './storyService';
import magazineService from './magazineService';
import merchService from './merchService';

const searchService = {
  // Search across all content types
  searchAll: async (query, page = 1, limit = 12) => {
    if (!query || query.trim() === '') {
      return {
        stories: [],
        magazines: [],
        products: [],
        total: 0
      };
    }

    console.log('Searching for:', query);

    try {
      // Search all content types in parallel
      const [stories, magazines, products] = await Promise.all([
        storyService.searchStories(query, page, limit).catch((err) => {
          console.error('Stories search error:', err);
          // Handle both 404 and error responses
          if (err.response?.data?.data) {
            return err.response.data;
          }
          return { data: [] };
        }),
        magazineService.searchMagazines(query, page, limit).catch((err) => {
          console.error('Magazines search error:', err);
          if (err.response?.data?.data) {
            return err.response.data.data;
          }
          return [];
        }),
        merchService.searchProducts(query, page, limit).catch((err) => {
          console.error('Products search error:', err);
          if (err.response?.data?.data) {
            return err.response.data;
          }
          return { data: [] };
        })
      ]);

      const storiesData = stories.data || stories || [];
      const magazinesData = Array.isArray(magazines) ? magazines : [];
      const productsData = products.data || products || [];

      console.log('Search results:', { stories: storiesData.length, magazines: magazinesData.length, products: productsData.length });

      return {
        stories: storiesData,
        magazines: magazinesData,
        products: productsData,
        total: storiesData.length + magazinesData.length + productsData.length
      };
    } catch (error) {
      console.error('Search error:', error);
      return {
        stories: [],
        magazines: [],
        products: [],
        total: 0
      };
    }
  },

  // Search only stories
  searchStories: async (query, page = 1, limit = 12) => {
    if (!query || query.trim() === '') {
      return [];
    }
    try {
      const result = await storyService.searchStories(query, page, limit);
      return result.data || result || [];
    } catch (error) {
      console.error('Story search error:', error);
      return [];
    }
  },

  // Search only magazines
  searchMagazines: async (query, page = 1, limit = 12) => {
    if (!query || query.trim() === '') {
      return [];
    }
    try {
      const result = await magazineService.searchMagazines(query, page, limit);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Magazine search error:', error);
      return [];
    }
  },

  // Search only products
  searchProducts: async (query, page = 1, limit = 12) => {
    if (!query || query.trim() === '') {
      return [];
    }
    try {
      const result = await merchService.searchProducts(query, page, limit);
      return result.data || result || [];
    } catch (error) {
      console.error('Product search error:', error);
      return [];
    }
  }
};

export default searchService;
