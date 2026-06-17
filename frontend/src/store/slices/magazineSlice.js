import createResourceSlice from './createResourceSlice';

const { slice, selectors } = createResourceSlice({
  name: 'magazines',
  itemsKey: 'magazines',
  initialFilters: {
    category: 'all',
    minPrice: 0,
    maxPrice: 100,
    search: '',
  },
  extraState: {
    featuredMagazines: [],
    subscriptions: [],
  },
  extraReducers: {
    setFeaturedMagazines: (state, action) => {
      state.featuredMagazines = action.payload;
    },
    setSubscriptions: (state, action) => {
      state.subscriptions = action.payload;
    },
  },
});

export const {
  setItems: setMagazines,
  setCurrentItem: setCurrentMagazine,
  clearCurrentItem: clearCurrentMagazine,
  setCategories,
  updateFilters,
  resetFilters,
  setCurrentPage,
  setLoading,
  setError,
  clearError,
  setFeaturedMagazines,
  setSubscriptions,
} = slice.actions;

export default slice.reducer;

// Selectors — preserve the names the rest of the app already imports
export const selectMagazines            = selectors.selectItems;
export const selectCurrentMagazine      = selectors.selectCurrentItem;
export const selectMagazineCategories   = selectors.selectCategories;
export const selectMagazineFilters      = selectors.selectFilters;
export const selectMagazinePagination   = selectors.selectPagination;
export const selectMagazineLoading      = selectors.selectLoading;
export const selectMagazineError        = selectors.selectError;
export const selectFeaturedMagazines    = (state) => state.magazines.featuredMagazines;
export const selectMagazineSubscriptions = (state) => state.magazines.subscriptions;
