import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const inquiryService = {
  // Submit inquiry
  submitInquiry: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/inquiries`, data);
    return response.data;
  },

  // Get all inquiries
  getInquiries: async (params = {}) => {
    const response = await axios.get(`${API_BASE_URL}/inquiries`, { params });
    return response.data;
  },

  // Get inquiry by ID
  getInquiryById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/inquiries/${id}`);
    return response.data;
  },

  // Update inquiry status
  updateInquiryStatus: async (id, status) => {
    const response = await axios.patch(`${API_BASE_URL}/inquiries/${id}/status`, { status });
    return response.data;
  },

  // Delete inquiry
  deleteInquiry: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/inquiries/${id}`);
    return response.data;
  }
};

export default inquiryService;
