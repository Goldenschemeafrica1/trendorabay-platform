import api from './api';

const communityService = {
  // Get all communities
  getCommunities: async (params = {}) => {
    const response = await api.get('/communities', { params });
    return response.data;
  },

  // Get trending communities (helper method)
  getTrendingCommunities: async (params = {}) => {
    const response = await api.get('/communities', { params: { ...params, community_type: 'open' } });
    return response.data;
  },

  // Get community by slug
  getCommunityBySlug: async (slug) => {
    const response = await api.get(`/communities/${slug}`);
    return response.data;
  },

  // Get community by ID
  getCommunityById: async (id) => {
    const response = await api.get(`/communities/id/${id}`);
    return response.data;
  },

  // Get user's communities
  getUserCommunities: async (userId) => {
    const response = await api.get(`/communities/user/${userId}`);
    return response.data;
  },

  // Join community
  joinCommunity: async (communityId, userId) => {
    const response = await api.post(`/communities/${communityId}/join`, { userId });
    return response.data;
  },

  // Leave community
  leaveCommunity: async (communityId, userId) => {
    const response = await api.post(`/communities/${communityId}/leave`, { userId });
    return response.data;
  },

  // Get community members
  getCommunityMembers: async (communityId, params = {}) => {
    const response = await api.get(`/communities/${communityId}/members`, { params });
    return response.data;
  },

  // Check user membership
  checkMembership: async (communityId, userId) => {
    const response = await api.get(`/communities/${communityId}/membership/${userId}`);
    return response.data;
  },
};

export default communityService;
