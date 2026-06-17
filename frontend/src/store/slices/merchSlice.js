import createResourceSlice from './createResourceSlice';

const { slice, selectors } = createResourceSlice({
  name: 'merch',
  itemsKey: 'products',
  initialFilters: {
    category: 'all',
    minPrice: 0,
    maxPrice: 500,
    search: '',
    size: '',
    color: '',
  },
  extraState: {
    featuredProducts: [],
  },
  extraReducers: {
    setFeaturedProducts: (state, action) => {
      state.featuredProducts = action.payload;
    },
    updateProductOptions: (state, action) => {
      const { productId, options } = action.payload;
      if (state.currentItem && state.currentItem.id === productId) {
        state.currentItem = { ...state.currentItem, ...options };
      }
    },
  },
});

export const {
  setItems: setProducts,
  setCurrentItem: setCurrentProduct,
  clearCurrentItem: clearCurrentProduct,
  setCategories,
  updateFilters,
  resetFilters,
  setCurrentPage,
  setLoading,
  setError,
  clearError,
  setFeaturedProducts,
  updateProductOptions,
} = slice.actions;

export default slice.reducer;

// Selectors — preserve the names the rest of the app already imports
export const selectProducts        = selectors.selectItems;
export const selectCurrentProduct  = selectors.selectCurrentItem;
export const selectMerchCategories = selectors.selectCategories;
export const selectMerchFilters    = selectors.selectFilters;
export const selectMerchPagination = selectors.selectPagination;
export const selectMerchLoading    = selectors.selectLoading;
export const selectMerchError      = selectors.selectError;
export const selectFeaturedProducts = (state) => state.merch.featuredProducts;
