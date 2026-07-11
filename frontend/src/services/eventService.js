import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const eventService = {
  // Get all events
  getEvents: async (params = {}) => {
    const response = await axios.get(`${API_BASE_URL}/events`, { params });
    return response.data;
  },

  // Get event by ID
  getEventById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/events/${id}`);
    return response.data;
  },

  // Create event
  createEvent: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/events`, data);
    return response.data;
  },

  // Update event
  updateEvent: async (id, data) => {
    const response = await axios.put(`${API_BASE_URL}/events/${id}`, data);
    return response.data;
  },

  // Delete event
  deleteEvent: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/events/${id}`);
    return response.data;
  }
};

export default eventService;
