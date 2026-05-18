import { CURRENCY } from './constants';

// Price formatting
export const formatPrice = (price, currency = CURRENCY.DEFAULT) => {
  return new Intl.NumberFormat(CURRENCY.LOCALE, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// Price formatting without currency symbol
export const formatPriceNumber = (price) => {
  return new Intl.NumberFormat(CURRENCY.LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// Date formatting
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const formatOptions = { ...defaultOptions, ...options };

  return new Intl.DateTimeFormat(CURRENCY.LOCALE, formatOptions).format(
    new Date(date)
  );
};

// Short date formatting
export const formatShortDate = (date) => {
  return formatDate(date, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Relative date formatting (e.g., "2 days ago")
export const formatRelativeDate = (date) => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now - targetDate) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

// Reading time formatting
export const formatReadingTime = (minutes) => {
  if (minutes < 1) {
    return 'Less than 1 min read';
  }
  return `${Math.ceil(minutes)} min read`;
};

// Number formatting with commas
export const formatNumber = (number) => {
  return new Intl.NumberFormat(CURRENCY.LOCALE).format(number);
};

// Percentage formatting
export const formatPercentage = (value, decimals = 1) => {
  return `${(value * 100).toFixed(decimals)}%`;
};

// File size formatting
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Phone number formatting
export const formatPhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phoneNumber;
};

// Credit card formatting
export const formatCreditCard = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  const groups = cleaned.match(/\d{4}/g) || [];
  
  return groups.join(' ');
};

// Credit card masking (showing only last 4 digits)
export const maskCreditCard = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  const lastFour = cleaned.slice(-4);
  const masked = '*'.repeat(cleaned.length - 4) + lastFour;
  
  return masked.match(/.{1,4}/g)?.join(' ') || masked;
};

// Text truncation
export const truncateText = (text, maxLength, suffix = '...') => {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.slice(0, maxLength - suffix.length) + suffix;
};

// Slug creation from text
export const createSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Capitalize first letter of each word
export const capitalizeWords = (text) => {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Capitalize first letter only
export const capitalize = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Format URL parameters
export const formatUrlParams = (params) => {
  return Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
};

// Format cart item name with variations
export const formatCartItemName = (item) => {
  let name = item.name;
  
  if (item.size) {
    name += ` (${item.size})`;
  }
  
  if (item.color) {
    name += ` - ${item.color}`;
  }
  
  return name;
};

// Format order status
export const formatOrderStatus = (status) => {
  const statusMap = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  };
  
  return statusMap[status] || status;
};

export default {
  formatPrice,
  formatPriceNumber,
  formatDate,
  formatShortDate,
  formatRelativeDate,
  formatReadingTime,
  formatNumber,
  formatPercentage,
  formatFileSize,
  formatPhoneNumber,
  formatCreditCard,
  maskCreditCard,
  truncateText,
  createSlug,
  capitalizeWords,
  capitalize,
  formatUrlParams,
  formatCartItemName,
  formatOrderStatus,
};
