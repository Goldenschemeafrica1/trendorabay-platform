import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Mobile menu state
  isMobileMenuOpen: false,
  
  // Modal states
  activeModal: null, // null, 'newsletter', 'contact', etc.
  
  // Loading states
  globalLoading: false,
  
  // Search state
  searchQuery: '',
  searchResults: [],
  isSearchOpen: false,
  
  // Theme
  theme: 'light', // 'light', 'dark'
  
  // Notifications
  notifications: [],
  
  // Breadcrumbs
  breadcrumbs: [],
  
  // Page transitions
  isPageTransitioning: false,
  
  // Error states
  globalError: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Mobile menu
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    
    openMobileMenu: (state) => {
      state.isMobileMenuOpen = true;
    },
    
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },

    // Modal management
    openModal: (state, action) => {
      state.activeModal = action.payload;
    },

    closeModal: (state) => {
      state.activeModal = null;
    },

    // Global loading
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },

    // Search functionality
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },

    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },

    openSearch: (state) => {
      state.isSearchOpen = true;
    },

    closeSearch: (state) => {
      state.isSearchOpen = false;
      state.searchQuery = '';
      state.searchResults = [];
    },

    // Theme management
    setTheme: (state, action) => {
      state.theme = action.payload;
    },

    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },

    // Notifications
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        ...action.payload,
      };
      state.notifications.push(notification);
    },

    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },

    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Breadcrumbs
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload;
    },

    // Page transitions
    setPageTransitioning: (state, action) => {
      state.isPageTransitioning = action.payload;
    },

    // Global error handling
    setGlobalError: (state, action) => {
      state.globalError = action.payload;
    },

    clearGlobalError: (state) => {
      state.globalError = null;
    },

    // Reset UI state
    resetUIState: (state) => {
      return initialState;
    },
  },
});

export const {
  toggleMobileMenu,
  openMobileMenu,
  closeMobileMenu,
  openModal,
  closeModal,
  setGlobalLoading,
  setSearchQuery,
  setSearchResults,
  toggleSearch,
  openSearch,
  closeSearch,
  setTheme,
  toggleTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  setBreadcrumbs,
  setPageTransitioning,
  setGlobalError,
  clearGlobalError,
  resetUIState,
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectIsMobileMenuOpen = (state) => state.ui.isMobileMenuOpen;
export const selectActiveModal = (state) => state.ui.activeModal;
export const selectGlobalLoading = (state) => state.ui.globalLoading;
export const selectSearchQuery = (state) => state.ui.searchQuery;
export const selectSearchResults = (state) => state.ui.searchResults;
export const selectIsSearchOpen = (state) => state.ui.isSearchOpen;
export const selectTheme = (state) => state.ui.theme;
export const selectNotifications = (state) => state.ui.notifications;
export const selectBreadcrumbs = (state) => state.ui.breadcrumbs;
export const selectIsPageTransitioning = (state) => state.ui.isPageTransitioning;
export const selectGlobalError = (state) => state.ui.globalError;
