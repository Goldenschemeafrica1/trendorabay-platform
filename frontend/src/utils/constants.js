// API Constants
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// App Constants
export const APP_NAME = 'Trendorabay';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Celebrating African culture through magazines, merchandise, and community stories';

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAGAZINES_PAGE_SIZE: 12,
  PRODUCTS_PAGE_SIZE: 12,
  STORIES_PAGE_SIZE: 10,
  AUTHORS_PAGE_SIZE: 20,
};

// Currency Constants
export const CURRENCY = {
  DEFAULT: 'USD',
  SYMBOL: '$',
  LOCALE: 'en-US',
};

// Shipping Constants
export const SHIPPING = {
  FREE_SHIPPING_THRESHOLD: 50,
  STANDARD_COST: 5.99,
  EXPRESS_COST: 12.99,
};

// Tax Constants
export const TAX = {
  DEFAULT_RATE: 0.08, // 8%
};

// Image Constants
export const IMAGE = {
  PLACEHOLDER: '/images/placeholder.jpg',
  FALLBACK: '/images/fallback.jpg',
  MAGAZINE_PLACEHOLDER: '/images/magazine-covers/placeholder.jpg',
  PRODUCT_PLACEHOLDER: '/images/merchandise/placeholder.jpg',
  STORY_PLACEHOLDER: '/images/stories/placeholder.jpg',
  AVATAR_PLACEHOLDER: '/images/team/placeholder.jpg',
};

// Social Media Constants
export const SOCIAL_MEDIA = {
  TWITTER: 'https://twitter.com/trendorabay',
  INSTAGRAM: 'https://instagram.com/trendorabay',
  FACEBOOK: 'https://facebook.com/trendorabay',
  LINKEDIN: 'https://linkedin.com/company/trendorabay',
  YOUTUBE: 'https://youtube.com/@trendorabay',
};

// Contact Constants
export const CONTACT = {
  EMAIL: 'hello@trendorabay.com',
  SUPPORT_EMAIL: 'support@trendorabay.com',
  PHONE: '+1 (555) 123-4567',
  ADDRESS: {
    street: '123 Culture Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
  },
};

// Newsletter Constants
export const NEWSLETTER = {
  SUBSCRIPTION_ENDPOINT: '/newsletter/subscribe',
  UNSUBSCRIBE_ENDPOINT: '/newsletter/unsubscribe',
};

// Storage Constants
export const STORAGE_KEYS = {
  CART: 'trendorabay-cart',
  PREFERENCES: 'trendorabay-preferences',
  AUTH_TOKEN: 'trendorabay-token',
  USER_DATA: 'trendorabay-user',
  VIEWED_ITEMS: 'trendorabay-viewed-items',
  SEARCH_HISTORY: 'trendorabay-search-history',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  CART_ERROR: 'There was an error updating your cart.',
  CHECKOUT_ERROR: 'There was an error processing your order.',
  SEARCH_ERROR: 'There was an error performing your search.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  ADDED_TO_CART: 'Item added to cart successfully!',
  REMOVED_FROM_CART: 'Item removed from cart.',
  CART_UPDATED: 'Cart updated successfully.',
  ORDER_PLACED: 'Order placed successfully!',
  NEWSLETTER_SUBSCRIBED: 'Thank you for subscribing to our newsletter!',
  CONTACT_FORM_SENT: 'Your message has been sent successfully!',
};

// Loading Messages
export const LOADING_MESSAGES = {
  GENERAL: 'Loading...',
  SEARCHING: 'Searching...',
  PROCESSING: 'Processing...',
  SAVING: 'Saving...',
  UPDATING: 'Updating...',
};

// Validation Constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  ZIP_CODE_REGEX: /^\d{5}(-\d{4})?$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  MESSAGE_MIN_LENGTH: 10,
};

// Animation Constants
export const ANIMATION = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
  },
};

// Theme Constants
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 992,
    DESKTOP: 1200,
  },
};

// Categories
export const CATEGORIES = {
  MAGAZINES: [
    { value: 'fashion', label: 'Fashion' },
    { value: 'culture', label: 'Culture & Heritage' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'business', label: 'Business & Economy' },
    { value: 'arts', label: 'Arts & Literature' },
  ],
  PRODUCTS: [
    { value: 'clothing', label: 'Clothing' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'home-decor', label: 'Home Decor' },
    { value: 'art', label: 'Art & Prints' },
    { value: 'books', label: 'Books & Media' },
  ],
  STORIES: [
    { value: 'culture', label: 'Culture' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'business', label: 'Business' },
    { value: 'technology', label: 'Technology' },
    { value: 'arts', label: 'Arts & Literature' },
    { value: 'lifestyle', label: 'Lifestyle' },
  ],
};

export default {
  API_BASE_URL,
  APP_NAME,
  APP_VERSION,
  APP_DESCRIPTION,
  PAGINATION,
  CURRENCY,
  SHIPPING,
  TAX,
  IMAGE,
  SOCIAL_MEDIA,
  CONTACT,
  NEWSLETTER,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_MESSAGES,
  VALIDATION,
  ANIMATION,
  THEME,
  CATEGORIES,
};
