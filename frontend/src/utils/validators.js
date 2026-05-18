import { VALIDATION } from './constants';

// Email validation
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return 'Email is required';
  }
  
  if (!VALIDATION.EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

// Phone number validation
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return 'Phone number is required';
  }
  
  if (!VALIDATION.PHONE_REGEX.test(phone)) {
    return 'Please enter a valid phone number';
  }
  
  return null;
};

// Name validation
export const validateName = (name, fieldName = 'Name') => {
  if (!name || name.trim() === '') {
    return `${fieldName} is required`;
  }
  
  if (name.trim().length < VALIDATION.NAME_MIN_LENGTH) {
    return `${fieldName} must be at least ${VALIDATION.NAME_MIN_LENGTH} characters long`;
  }
  
  if (name.trim().length > 50) {
    return `${fieldName} cannot be more than 50 characters long`;
  }
  
  return null;
};

// Password validation
export const validatePassword = (password) => {
  if (!password || password === '') {
    return 'Password is required';
  }
  
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long`;
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  return null;
};

// Message validation
export const validateMessage = (message, fieldName = 'Message') => {
  if (!message || message.trim() === '') {
    return `${fieldName} is required`;
  }
  
  if (message.trim().length < VALIDATION.MESSAGE_MIN_LENGTH) {
    return `${fieldName} must be at least ${VALIDATION.MESSAGE_MIN_LENGTH} characters long`;
  }
  
  if (message.trim().length > 1000) {
    return `${fieldName} cannot be more than 1000 characters long`;
  }
  
  return null;
};

// Zip code validation
export const validateZipCode = (zipCode) => {
  if (!zipCode || zipCode.trim() === '') {
    return 'Zip code is required';
  }
  
  if (!VALIDATION.ZIP_CODE_REGEX.test(zipCode)) {
    return 'Please enter a valid zip code';
  }
  
  return null;
};

// Required field validation
export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} is required`;
  }
  
  return null;
};

// Number validation
export const validateNumber = (value, fieldName = 'Field', options = {}) => {
  const { min, max, integer = false } = options;
  
  if (value === '' || value === null || value === undefined) {
    return `${fieldName} is required`;
  }
  
  const numValue = parseFloat(value);
  
  if (isNaN(numValue)) {
    return `${fieldName} must be a valid number`;
  }
  
  if (integer && !Number.isInteger(numValue)) {
    return `${fieldName} must be a whole number`;
  }
  
  if (min !== undefined && numValue < min) {
    return `${fieldName} must be at least ${min}`;
  }
  
  if (max !== undefined && numValue > max) {
    return `${fieldName} cannot be more than ${max}`;
  }
  
  return null;
};

// Price validation
export const validatePrice = (price, fieldName = 'Price') => {
  return validateNumber(price, fieldName, {
    min: 0,
    max: 99999.99,
  });
};

// Quantity validation
export const validateQuantity = (quantity, fieldName = 'Quantity') => {
  return validateNumber(quantity, fieldName, {
    min: 1,
    max: 999,
    integer: true,
  });
};

// URL validation
export const validateUrl = (url, fieldName = 'URL') => {
  if (!url || url.trim() === '') {
    return `${fieldName} is required`;
  }
  
  try {
    new URL(url);
    return null;
  } catch {
    return `Please enter a valid ${fieldName}`;
  }
};

// Credit card validation (basic)
export const validateCreditCard = (cardNumber) => {
  if (!cardNumber || cardNumber.trim() === '') {
    return 'Card number is required';
  }
  
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (cleaned.length < 13 || cleaned.length > 19) {
    return 'Please enter a valid card number';
  }
  
  // Luhn algorithm check
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  if (sum % 10 !== 0) {
    return 'Please enter a valid card number';
  }
  
  return null;
};

// Expiration date validation
export const validateExpirationDate = (expirationDate) => {
  if (!expirationDate || expirationDate.trim() === '') {
    return 'Expiration date is required';
  }
  
  const match = expirationDate.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  
  if (!match) {
    return 'Please enter a valid expiration date (MM/YY)';
  }
  
  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10) + 2000;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return 'Card has expired';
  }
  
  return null;
};

// CVV validation
export const validateCVV = (cvv) => {
  if (!cvv || cvv.trim() === '') {
    return 'CVV is required';
  }
  
  if (!/^\d{3,4}$/.test(cvv)) {
    return 'Please enter a valid CVV';
  }
  
  return null;
};

// Form validation helper
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const rules = validationRules[field];
    const value = formData[field];
    
    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Async validation for uniqueness (example)
export const validateUniqueEmail = async (email) => {
  // This would make an API call to check if email is already in use
  try {
    const response = await fetch(`/api/validate/email?email=${encodeURIComponent(email)}`);
    const data = await response.json();
    
    if (data.exists) {
      return 'Email is already registered';
    }
    
    return null;
  } catch (error) {
    return 'Unable to validate email';
  }
};

export default {
  validateEmail,
  validatePhone,
  validateName,
  validatePassword,
  validateMessage,
  validateZipCode,
  validateRequired,
  validateNumber,
  validatePrice,
  validateQuantity,
  validateUrl,
  validateCreditCard,
  validateExpirationDate,
  validateCVV,
  validateForm,
  validateUniqueEmail,
};
