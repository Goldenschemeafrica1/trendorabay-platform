import apiRequest from './api';

const podcastService = {
  // Transform podcast data from backend to frontend format
  transformPodcast: (podcast) => {
    if (!podcast) return podcast;
    
    // Backend already transforms URLs, so use them directly if they exist
    const coverImage = podcast.coverImage || podcast.cover_art_url || '/music.jpeg';
    const audioUrl = podcast.audioUrl || podcast.audio_file_url;
    const videoUrl = podcast.videoUrl || podcast.video_file_url;

    return {
      ...podcast,
      coverImage,
      audioUrl,
      videoUrl,
      image: coverImage
    };
  },

  getPodcasts: async (params = {}) => {
    const response = await apiRequest.get('/podcasts', { params });
    const podcasts = response.data?.data || response.data || [];
    
    if (podcasts.length > 0) {
      return podcasts.map(p => podcastService.transformPodcast(p));
    }
    
    return podcasts;
  },

  getPodcastById: async (id) => {
    const response = await apiRequest.get(`/podcasts/${id}`);
    const podcast = response.data?.data || response.data;
    return podcastService.transformPodcast(podcast);
  },

  getPodcastsByCategory: async (category) => {
    const response = await apiRequest.get(`/podcasts/category/${category}`);
    const podcasts = response.data?.data || response.data || [];
    
    if (podcasts.length > 0) {
      return podcasts.map(p => podcastService.transformPodcast(p));
    }
    
    return podcasts;
  },

  searchPodcasts: async (query) => {
    const response = await apiRequest.get('/podcasts/search', { params: { q: query } });
    const podcasts = response.data?.data || response.data || [];
    
    if (podcasts.length > 0) {
      return podcasts.map(p => podcastService.transformPodcast(p));
    }
    
    return podcasts;
  },

  getFeaturedPodcasts: async () => {
    const response = await apiRequest.get('/podcasts/featured');
    const podcasts = response.data?.data || response.data || [];
    
    if (podcasts.length > 0) {
      return podcasts.map(p => podcastService.transformPodcast(p));
    }
    
    return podcasts;
  }
};

export default podcastService;
