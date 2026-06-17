import { createSlice } from '@reduxjs/toolkit';

/**
 * Factory that creates a Redux slice for a paginated, filterable resource.
 *
 * All three content slices (magazines, merch, stories) shared the same
 * boilerplate for loading, error, filters, pagination, and categories.
 * This factory extracts that common skeleton; each slice only needs to
 * supply its `name`, default `filters`, and any `extraReducers`.
 *
 * Usage:
 *   const { slice, selectors } = createResourceSlice({
 *     name: 'magazines',
 *     initialFilters: { category: 'all', minPrice: 0, maxPrice: 100, search: '' },
 *     extraState: { featuredMagazines: [], subscriptions: [] },
 *     extraReducers: { setFeaturedMagazines: (state, action) => { ... } },
 *   });
 */
const createResourceSlice = ({
  name,
  initialFilters = {},
  itemsKey = 'items',
  extraState = {},
  extraReducers = {},
}) => {
  const initialState = {
    [itemsKey]: [],
    currentItem: null,
    categories: [],
    filters: initialFilters,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 12,
    },
    isLoading: false,
    error: null,
    ...extraState,
  };

  const slice = createSlice({
    name,
    initialState,
    reducers: {
      setItems: (state, action) => {
        state[itemsKey] = action.payload.items || [];
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
        };
      },

      setCurrentItem: (state, action) => {
        state.currentItem = action.payload;
      },

      clearCurrentItem: (state) => {
        state.currentItem = null;
      },

      setCategories: (state, action) => {
        state.categories = action.payload;
      },

      updateFilters: (state, action) => {
        state.filters = { ...state.filters, ...action.payload };
      },

      resetFilters: (state) => {
        state.filters = initialFilters;
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

      ...extraReducers,
    },
  });

  // Build selectors keyed to the slice name
  const base = (state) => state[name];
  const selectors = {
    selectItems: (state) => base(state)[itemsKey],
    selectCurrentItem: (state) => base(state).currentItem,
    selectCategories: (state) => base(state).categories,
    selectFilters: (state) => base(state).filters,
    selectPagination: (state) => base(state).pagination,
    selectLoading: (state) => base(state).isLoading,
    selectError: (state) => base(state).error,
  };

  return { slice, selectors, initialState };
};

export default createResourceSlice;
