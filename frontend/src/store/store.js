import { configureStore } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../utils/constants';
import cartReducer from './slices/cartSlice';
import magazineReducer from './slices/magazineSlice';
import merchReducer from './slices/merchSlice';
import storyReducer from './slices/storySlice';
import uiReducer from './slices/uiSlice';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem(STORAGE_KEYS.CART);
    if (serializedCart === null) {
      return undefined;
    }
    return JSON.parse(serializedCart);
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return undefined;
  }
};

// Pre-load cart state
const preloadedState = {
  cart: loadCartFromStorage(),
};

const store = configureStore({
  reducer: {
    cart: cartReducer,
    magazines: magazineReducer,
    merch: merchReducer,
    stories: storyReducer,
    ui: uiReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Subscribe to store changes to save cart to localStorage
store.subscribe(() => {
  try {
    const state = store.getState();
    const serializedCart = JSON.stringify(state.cart);
    localStorage.setItem(STORAGE_KEYS.CART, serializedCart);
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
});

export default store;
