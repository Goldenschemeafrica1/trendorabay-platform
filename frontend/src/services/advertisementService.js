import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const advertisementService = {
  // Get all advertisements
  getAdvertisements: async (params = {}) => {
    const response = await axios.get(`${API_BASE_URL}/advertisements`, { params });
    return response.data;
  },

  // Get advertisement by ID
  getAdvertisementById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/advertisements/${id}`);
    return response.data;
  },

  // Create advertisement
  createAdvertisement: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/advertisements`, data);
    return response.data;
  },

  // Update advertisement
  updateAdvertisement: async (id, data) => {
    const response = await axios.put(`${API_BASE_URL}/advertisements/${id}`, data);
    return response.data;
  },

  // Delete advertisement
  deleteAdvertisement: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/advertisements/${id}`);
    return response.data;
  }
};

export default advertisementService;
