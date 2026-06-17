import createResourceSlice from './createResourceSlice';

const { slice, selectors } = createResourceSlice({
  name: 'stories',
  itemsKey: 'stories',
  initialFilters: {
    category: 'all',
    author: '',
    search: '',
  },
  extraState: {
    featuredStory: null,
    authors: [],
    currentAuthor: null,
    popularStories: [],
  },
  extraReducers: {
    setFeaturedStory: (state, action) => {
      state.featuredStory = action.payload;
    },
    setAuthors: (state, action) => {
      state.authors = action.payload.items || [];
    },
    setCurrentAuthor: (state, action) => {
      state.currentAuthor = action.payload;
    },
    clearCurrentAuthor: (state) => {
      state.currentAuthor = null;
    },
    setPopularStories: (state, action) => {
      state.popularStories = action.payload;
    },
  },
});

export const {
  setItems: setStories,
  setCurrentItem: setCurrentStory,
  clearCurrentItem: clearCurrentStory,
  setCategories,
  updateFilters,
  resetFilters,
  setCurrentPage,
  setLoading,
  setError,
  clearError,
  setFeaturedStory,
  setAuthors,
  setCurrentAuthor,
  clearCurrentAuthor,
  setPopularStories,
} = slice.actions;

export default slice.reducer;

// Selectors — preserve the names the rest of the app already imports
export const selectStories         = selectors.selectItems;
export const selectCurrentStory    = selectors.selectCurrentItem;
export const selectStoryCategories = selectors.selectCategories;
export const selectStoryFilters    = selectors.selectFilters;
export const selectStoryPagination = selectors.selectPagination;
export const selectStoryLoading    = selectors.selectLoading;
export const selectStoryError      = selectors.selectError;
export const selectFeaturedStory   = (state) => state.stories.featuredStory;
export const selectAuthors         = (state) => state.stories.authors;
export const selectCurrentAuthor   = (state) => state.stories.currentAuthor;
export const selectPopularStories  = (state) => state.stories.popularStories;
