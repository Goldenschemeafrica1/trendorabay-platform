import { describe, it, expect } from 'vitest';
import uiReducer, {
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
  selectIsMobileMenuOpen,
  selectActiveModal,
  selectGlobalLoading,
  selectSearchQuery,
  selectSearchResults,
  selectIsSearchOpen,
  selectTheme,
  selectNotifications,
  selectBreadcrumbs,
  selectIsPageTransitioning,
  selectGlobalError,
} from '../uiSlice';

const initialState = {
  isMobileMenuOpen: false,
  activeModal: null,
  globalLoading: false,
  searchQuery: '',
  searchResults: [],
  isSearchOpen: false,
  theme: 'light',
  notifications: [],
  breadcrumbs: [],
  isPageTransitioning: false,
  globalError: null,
};

describe('uiSlice reducer', () => {
  it('returns initial state', () => {
    expect(uiReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('mobile menu', () => {
    it('toggleMobileMenu flips state', () => {
      const state1 = uiReducer(initialState, toggleMobileMenu());
      expect(state1.isMobileMenuOpen).toBe(true);
      const state2 = uiReducer(state1, toggleMobileMenu());
      expect(state2.isMobileMenuOpen).toBe(false);
    });

    it('openMobileMenu sets true', () => {
      const state = uiReducer(initialState, openMobileMenu());
      expect(state.isMobileMenuOpen).toBe(true);
    });

    it('closeMobileMenu sets false', () => {
      const openState = { ...initialState, isMobileMenuOpen: true };
      const state = uiReducer(openState, closeMobileMenu());
      expect(state.isMobileMenuOpen).toBe(false);
    });
  });

  describe('modals', () => {
    it('openModal sets activeModal', () => {
      const state = uiReducer(initialState, openModal('newsletter'));
      expect(state.activeModal).toBe('newsletter');
    });

    it('closeModal clears activeModal', () => {
      const modalState = { ...initialState, activeModal: 'newsletter' };
      const state = uiReducer(modalState, closeModal());
      expect(state.activeModal).toBeNull();
    });
  });

  describe('global loading', () => {
    it('setGlobalLoading sets loading state', () => {
      const state = uiReducer(initialState, setGlobalLoading(true));
      expect(state.globalLoading).toBe(true);
    });
  });

  describe('search', () => {
    it('setSearchQuery updates query', () => {
      const state = uiReducer(initialState, setSearchQuery('test'));
      expect(state.searchQuery).toBe('test');
    });

    it('setSearchResults updates results', () => {
      const results = [{ id: 1, title: 'Result' }];
      const state = uiReducer(initialState, setSearchResults(results));
      expect(state.searchResults).toEqual(results);
    });

    it('toggleSearch flips isSearchOpen', () => {
      const state1 = uiReducer(initialState, toggleSearch());
      expect(state1.isSearchOpen).toBe(true);
      const state2 = uiReducer(state1, toggleSearch());
      expect(state2.isSearchOpen).toBe(false);
    });

    it('openSearch sets true', () => {
      const state = uiReducer(initialState, openSearch());
      expect(state.isSearchOpen).toBe(true);
    });

    it('closeSearch resets search state', () => {
      const searchState = {
        ...initialState,
        isSearchOpen: true,
        searchQuery: 'test',
        searchResults: [{ id: 1 }],
      };
      const state = uiReducer(searchState, closeSearch());
      expect(state.isSearchOpen).toBe(false);
      expect(state.searchQuery).toBe('');
      expect(state.searchResults).toEqual([]);
    });
  });

  describe('theme', () => {
    it('setTheme updates theme', () => {
      const state = uiReducer(initialState, setTheme('dark'));
      expect(state.theme).toBe('dark');
    });

    it('toggleTheme switches between light and dark', () => {
      const state1 = uiReducer(initialState, toggleTheme());
      expect(state1.theme).toBe('dark');
      const state2 = uiReducer(state1, toggleTheme());
      expect(state2.theme).toBe('light');
    });
  });

  describe('notifications', () => {
    it('addNotification pushes notification', () => {
      const state = uiReducer(initialState, addNotification({ message: 'Hello', type: 'info' }));
      expect(state.notifications).toHaveLength(1);
      expect(state.notifications[0].message).toBe('Hello');
      expect(state.notifications[0].type).toBe('info');
      expect(state.notifications[0].id).toBeDefined();
    });

    it('removeNotification removes by id', () => {
      const state1 = uiReducer(initialState, addNotification({ message: 'Hello', type: 'info' }));
      const notifId = state1.notifications[0].id;
      const state2 = uiReducer(state1, removeNotification(notifId));
      expect(state2.notifications).toHaveLength(0);
    });

    it('clearNotifications removes all', () => {
      let state = uiReducer(initialState, addNotification({ message: 'One' }));
      state = uiReducer(state, addNotification({ message: 'Two' }));
      state = uiReducer(state, clearNotifications());
      expect(state.notifications).toEqual([]);
    });
  });

  describe('breadcrumbs', () => {
    it('setBreadcrumbs updates breadcrumbs', () => {
      const crumbs = [{ label: 'Home', path: '/' }, { label: 'Store', path: '/store' }];
      const state = uiReducer(initialState, setBreadcrumbs(crumbs));
      expect(state.breadcrumbs).toEqual(crumbs);
    });
  });

  describe('page transitions', () => {
    it('setPageTransitioning updates state', () => {
      const state = uiReducer(initialState, setPageTransitioning(true));
      expect(state.isPageTransitioning).toBe(true);
    });
  });

  describe('global error', () => {
    it('setGlobalError sets error', () => {
      const state = uiReducer(initialState, setGlobalError('Network error'));
      expect(state.globalError).toBe('Network error');
    });

    it('clearGlobalError clears error', () => {
      const errorState = { ...initialState, globalError: 'Error' };
      const state = uiReducer(errorState, clearGlobalError());
      expect(state.globalError).toBeNull();
    });
  });

  describe('resetUIState', () => {
    it('resets to initial state', () => {
      const modifiedState = {
        ...initialState,
        isMobileMenuOpen: true,
        theme: 'dark',
        globalError: 'Error',
        searchQuery: 'test',
      };
      const state = uiReducer(modifiedState, resetUIState());
      expect(state).toEqual(initialState);
    });
  });
});

describe('ui selectors', () => {
  const mockState = {
    ui: {
      isMobileMenuOpen: true,
      activeModal: 'newsletter',
      globalLoading: true,
      searchQuery: 'search term',
      searchResults: [{ id: 1 }],
      isSearchOpen: true,
      theme: 'dark',
      notifications: [{ id: 1, message: 'test' }],
      breadcrumbs: [{ label: 'Home', path: '/' }],
      isPageTransitioning: true,
      globalError: 'error message',
    },
  };

  it('selectIsMobileMenuOpen', () => {
    expect(selectIsMobileMenuOpen(mockState)).toBe(true);
  });

  it('selectActiveModal', () => {
    expect(selectActiveModal(mockState)).toBe('newsletter');
  });

  it('selectGlobalLoading', () => {
    expect(selectGlobalLoading(mockState)).toBe(true);
  });

  it('selectSearchQuery', () => {
    expect(selectSearchQuery(mockState)).toBe('search term');
  });

  it('selectSearchResults', () => {
    expect(selectSearchResults(mockState)).toEqual([{ id: 1 }]);
  });

  it('selectIsSearchOpen', () => {
    expect(selectIsSearchOpen(mockState)).toBe(true);
  });

  it('selectTheme', () => {
    expect(selectTheme(mockState)).toBe('dark');
  });

  it('selectNotifications', () => {
    expect(selectNotifications(mockState)).toEqual([{ id: 1, message: 'test' }]);
  });

  it('selectBreadcrumbs', () => {
    expect(selectBreadcrumbs(mockState)).toEqual([{ label: 'Home', path: '/' }]);
  });

  it('selectIsPageTransitioning', () => {
    expect(selectIsPageTransitioning(mockState)).toBe(true);
  });

  it('selectGlobalError', () => {
    expect(selectGlobalError(mockState)).toBe('error message');
  });
});
