import { apiRequest } from './api';
import createResourceService from './createResourceService';

const magazineService = createResourceService('/magazines', {
  // Aliases so existing call-sites keep working unchanged
  getMagazines: undefined,       // replaced below
  getMagazineById: undefined,    // replaced below
  getMagazinesByCategory: undefined,
  getFeaturedMagazines: undefined,
  searchMagazines: undefined,

  getSubscriptionOptions: async () => {
    const response = await apiRequest.get('/magazines/subscriptions');
    return response.data;
  },

  createSubscription: async (subscriptionData) => {
    const response = await apiRequest.post('/magazines/subscriptions', subscriptionData);
    return response.data;
  },
});

// Re-map generic names → legacy names so callers stay unchanged
magazineService.getMagazines          = magazineService.getAll;
magazineService.getMagazineById       = magazineService.getById;
magazineService.getMagazinesByCategory = magazineService.getByCategory;
magazineService.getFeaturedMagazines  = magazineService.getFeatured;
magazineService.searchMagazines       = magazineService.search;

export default magazineService;
