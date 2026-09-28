import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const pitchService = {
  // Submit pitch
  submitPitch: async (data, file = null) => {
    const formData = new FormData();
    
    // Add all form fields
    Object.keys(data).forEach(key => {
      if (key === 'socialMedia' || key === 'topicsOfInterest') {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });
    
    // Add file if present
    if (file) {
      formData.append('articleAttachment', file);
    }
    
    const response = await axios.post(`${API_BASE_URL}/pitches`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });
    return response.data;
  },

  // Get all pitches
  getPitches: async (params = {}) => {
    const response = await axios.get(`${API_BASE_URL}/pitches`, { params, withCredentials: true });
    return response.data;
  },

  // Get pitch by ID
  getPitchById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/pitches/${id}`, { withCredentials: true });
    return response.data;
  },

  // Update pitch status
  updatePitchStatus: async (id, status) => {
    const response = await axios.patch(`${API_BASE_URL}/pitches/${id}/status`, { status }, { withCredentials: true });
    return response.data;
  },

  // Delete pitch
  deletePitch: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/pitches/${id}`, { withCredentials: true });
    return response.data;
  }
};

export default pitchService;
