import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const contactService = {
  // Submit contact message
  submitMessage: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/contact`, data);
    return response.data;
  },

  // Get all messages
  getMessages: async (params = {}) => {
    const response = await axios.get(`${API_BASE_URL}/contact`, { params });
    return response.data;
  },

  // Get message by ID
  getMessageById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/contact/${id}`);
    return response.data;
  },

  // Update message status
  updateMessageStatus: async (id, status) => {
    const response = await axios.patch(`${API_BASE_URL}/contact/${id}/status`, { status });
    return response.data;
  },

  // Delete message
  deleteMessage: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/contact/${id}`);
    return response.data;
  }
};

export default contactService;
