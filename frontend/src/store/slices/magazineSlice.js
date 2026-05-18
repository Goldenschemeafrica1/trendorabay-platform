import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  magazines: [],
  featuredMagazines: [],
  currentMagazine: null,
  categories: [],
  subscriptions: [],
  filters: {
    category: 'all',
    minPrice: 0,
    maxPrice: 100,
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

const magazineSlice = createSlice({
  name: 'magazines',
  initialState,
  reducers: {
    setMagazines: (state, action) => {
      state.magazines = action.payload.items || [];
      state.pagination = {
        ...state.pagination,
        ...action.payload.pagination,
      };
    },

    setFeaturedMagazines: (state, action) => {
      state.featuredMagazines = action.payload;
    },

    setCurrentMagazine: (state, action) => {
      state.currentMagazine = action.payload;
    },

    setCategories: (state, action) => {
      state.categories = action.payload;
    },

    setSubscriptions: (state, action) => {
      state.subscriptions = action.payload;
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

    clearCurrentMagazine: (state) => {
      state.currentMagazine = null;
    },
  },
});

export const {
  setMagazines,
  setFeaturedMagazines,
  setCurrentMagazine,
  setCategories,
  setSubscriptions,
  updateFilters,
  resetFilters,
  setCurrentPage,
  setLoading,
  setError,
  clearError,
  clearCurrentMagazine,
} = magazineSlice.actions;

export default magazineSlice.reducer;

// Selectors
export const selectMagazines = (state) => state.magazines.magazines;
export const selectFeaturedMagazines = (state) => state.magazines.featuredMagazines;
export const selectCurrentMagazine = (state) => state.magazines.currentMagazine;
export const selectMagazineCategories = (state) => state.magazines.categories;
export const selectMagazineSubscriptions = (state) => state.magazines.subscriptions;
export const selectMagazineFilters = (state) => state.magazines.filters;
export const selectMagazinePagination = (state) => state.magazines.pagination;
export const selectMagazineLoading = (state) => state.magazines.isLoading;
export const selectMagazineError = (state) => state.magazines.error;
