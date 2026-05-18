import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  featuredProducts: [],
  currentProduct: null,
  categories: [],
  filters: {
    category: 'all',
    minPrice: 0,
    maxPrice: 500,
    search: '',
    size: '',
    color: '',
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

const merchSlice = createSlice({
  name: 'merch',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload.items || [];
      state.pagination = {
        ...state.pagination,
        ...action.payload.pagination,
      };
    },

    setFeaturedProducts: (state, action) => {
      state.featuredProducts = action.payload;
    },

    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },

    setCategories: (state, action) => {
      state.categories = action.payload;
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

    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },

    updateProductOptions: (state, action) => {
      const { productId, options } = action.payload;
      if (state.currentProduct && state.currentProduct.id === productId) {
        state.currentProduct = {
          ...state.currentProduct,
          ...options,
        };
      }
    },
  },
});

export const {
  setProducts,
  setFeaturedProducts,
  setCurrentProduct,
  setCategories,
  updateFilters,
  resetFilters,
  setCurrentPage,
  setLoading,
  setError,
  clearError,
  clearCurrentProduct,
  updateProductOptions,
} = merchSlice.actions;

export default merchSlice.reducer;

// Selectors
export const selectProducts = (state) => state.merch.products;
export const selectFeaturedProducts = (state) => state.merch.featuredProducts;
export const selectCurrentProduct = (state) => state.merch.currentProduct;
export const selectMerchCategories = (state) => state.merch.categories;
export const selectMerchFilters = (state) => state.merch.filters;
export const selectMerchPagination = (state) => state.merch.pagination;
export const selectMerchLoading = (state) => state.merch.isLoading;
export const selectMerchError = (state) => state.merch.error;
