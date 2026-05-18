import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stories: [],
  featuredStory: null,
  currentStory: null,
  authors: [],
  currentAuthor: null,
  categories: [],
  popularStories: [],
  filters: {
    category: 'all',
    author: '',
    search: '',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  },
  isLoading: false,
  error: null,
};

const storySlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    setStories: (state, action) => {
      state.stories = action.payload.items || [];
      state.pagination = {
        ...state.pagination,
        ...action.payload.pagination,
      };
    },

    setFeaturedStory: (state, action) => {
      state.featuredStory = action.payload;
    },

    setCurrentStory: (state, action) => {
      state.currentStory = action.payload;
    },

    setAuthors: (state, action) => {
      state.authors = action.payload.items || [];
    },

    setCurrentAuthor: (state, action) => {
      state.currentAuthor = action.payload;
    },

    setCategories: (state, action) => {
      state.categories = action.payload;
    },

    setPopularStories: (state, action) => {
      state.popularStories = action.payload;
    },

    updateFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    clearCurrentStory: (state) => {
      state.currentStory = null;
    },

    clearCurrentAuthor: (state) => {
      state.currentAuthor = null;
    },
  },
});

export const {
  setStories,
  setFeaturedStory,
  setCurrentStory,
  setAuthors,
  setCurrentAuthor,
  setCategories,
  setPopularStories,
  updateFilters,
  resetFilters,
  setCurrentPage,
  setLoading,
  setError,
  clearError,
  clearCurrentStory,
  clearCurrentAuthor,
} = storySlice.actions;

export default storySlice.reducer;

// Selectors
export const selectStories = (state) => state.stories.stories;
export const selectFeaturedStory = (state) => state.stories.featuredStory;
export const selectCurrentStory = (state) => state.stories.currentStory;
export const selectAuthors = (state) => state.stories.authors;
export const selectCurrentAuthor = (state) => state.stories.currentAuthor;
export const selectStoryCategories = (state) => state.stories.categories;
export const selectPopularStories = (state) => state.stories.popularStories;
export const selectStoryFilters = (state) => state.stories.filters;
export const selectStoryPagination = (state) => state.stories.pagination;
export const selectStoryLoading = (state) => state.stories.isLoading;
export const selectStoryError = (state) => state.stories.error;
