import { describe, it, expect } from 'vitest';
import {
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
} from '../validators';

describe('validateEmail', () => {
  it('returns error when email is empty', () => {
    expect(validateEmail('')).toBe('Email is required');
    expect(validateEmail(null)).toBe('Email is required');
    expect(validateEmail(undefined)).toBe('Email is required');
    expect(validateEmail('   ')).toBe('Email is required');
  });

  it('returns error for invalid email format', () => {
    expect(validateEmail('notanemail')).toBe('Please enter a valid email address');
    expect(validateEmail('missing@domain')).toBe('Please enter a valid email address');
    expect(validateEmail('@nodomain.com')).toBe('Please enter a valid email address');
  });

  it('returns null for valid email', () => {
    expect(validateEmail('user@example.com')).toBeNull();
    expect(validateEmail('test.user@domain.co')).toBeNull();
  });
});

describe('validatePhone', () => {
  it('returns error when phone is empty', () => {
    expect(validatePhone('')).toBe('Phone number is required');
    expect(validatePhone(null)).toBe('Phone number is required');
    expect(validatePhone('   ')).toBe('Phone number is required');
  });

  it('returns error for invalid phone format', () => {
    expect(validatePhone('abc')).toBe('Please enter a valid phone number');
    expect(validatePhone('12!34')).toBe('Please enter a valid phone number');
  });

  it('returns null for valid phone numbers', () => {
    expect(validatePhone('1234567890')).toBeNull();
    expect(validatePhone('+1 (555) 123-4567')).toBeNull();
    expect(validatePhone('555-123-4567')).toBeNull();
  });
});

describe('validateName', () => {
  it('returns error when name is empty', () => {
    expect(validateName('')).toBe('Name is required');
    expect(validateName(null)).toBe('Name is required');
  });

  it('uses custom field name in error', () => {
    expect(validateName('', 'First name')).toBe('First name is required');
  });

  it('returns error when name is too short', () => {
    expect(validateName('A')).toBe('Name must be at least 2 characters long');
  });

  it('returns error when name is too long', () => {
    const longName = 'A'.repeat(51);
    expect(validateName(longName)).toBe('Name cannot be more than 50 characters long');
  });

  it('returns null for valid name', () => {
    expect(validateName('John')).toBeNull();
    expect(validateName('Jo')).toBeNull();
  });
});

describe('validatePassword', () => {
  it('returns error when password is empty', () => {
    expect(validatePassword('')).toBe('Password is required');
    expect(validatePassword(null)).toBe('Password is required');
  });

  it('returns error when password is too short', () => {
    expect(validatePassword('Ab1')).toBe('Password must be at least 8 characters long');
  });

  it('returns error when missing uppercase', () => {
    expect(validatePassword('abcdefg1')).toBe('Password must contain at least one uppercase letter');
  });

  it('returns error when missing lowercase', () => {
    expect(validatePassword('ABCDEFG1')).toBe('Password must contain at least one lowercase letter');
  });

  it('returns error when missing number', () => {
    expect(validatePassword('Abcdefgh')).toBe('Password must contain at least one number');
  });

  it('returns null for valid password', () => {
    expect(validatePassword('Abcdefg1')).toBeNull();
    expect(validatePassword('StrongPass123')).toBeNull();
  });
});

describe('validateMessage', () => {
  it('returns error when message is empty', () => {
    expect(validateMessage('')).toBe('Message is required');
    expect(validateMessage(null)).toBe('Message is required');
  });

  it('returns error when message is too short', () => {
    expect(validateMessage('Hi')).toBe('Message must be at least 10 characters long');
  });

  it('returns error when message is too long', () => {
    const longMsg = 'A'.repeat(1001);
    expect(validateMessage(longMsg)).toBe('Message cannot be more than 1000 characters long');
  });

  it('returns null for valid message', () => {
    expect(validateMessage('This is a valid message')).toBeNull();
  });
});

describe('validateZipCode', () => {
  it('returns error when zip is empty', () => {
    expect(validateZipCode('')).toBe('Zip code is required');
  });

  it('returns error for invalid zip', () => {
    expect(validateZipCode('123')).toBe('Please enter a valid zip code');
    expect(validateZipCode('ABCDE')).toBe('Please enter a valid zip code');
  });

  it('returns null for valid zip codes', () => {
    expect(validateZipCode('12345')).toBeNull();
    expect(validateZipCode('12345-6789')).toBeNull();
  });
});

describe('validateRequired', () => {
  it('returns error when value is empty', () => {
    expect(validateRequired('')).toBe('Field is required');
    expect(validateRequired(null)).toBe('Field is required');
    expect(validateRequired(undefined)).toBe('Field is required');
  });

  it('uses custom field name', () => {
    expect(validateRequired('', 'City')).toBe('City is required');
  });

  it('returns null for non-empty values', () => {
    expect(validateRequired('hello')).toBeNull();
    expect(validateRequired('0')).toBeNull();
  });
});

describe('validateNumber', () => {
  it('returns error when value is empty', () => {
    expect(validateNumber('', 'Age')).toBe('Age is required');
    expect(validateNumber(null, 'Age')).toBe('Age is required');
  });

  it('returns error for non-numeric value', () => {
    expect(validateNumber('abc', 'Price')).toBe('Price must be a valid number');
  });

  it('returns error when value is below min', () => {
    expect(validateNumber('5', 'Age', { min: 18 })).toBe('Age must be at least 18');
  });

  it('returns error when value exceeds max', () => {
    expect(validateNumber('200', 'Age', { max: 120 })).toBe('Age cannot be more than 120');
  });

  it('returns error when not integer but integer required', () => {
    expect(validateNumber('3.5', 'Qty', { integer: true })).toBe('Qty must be a whole number');
  });

  it('returns null for valid number', () => {
    expect(validateNumber('25', 'Age', { min: 0, max: 120 })).toBeNull();
    expect(validateNumber('5', 'Qty', { integer: true })).toBeNull();
  });
});

describe('validatePrice', () => {
  it('returns error for negative price', () => {
    expect(validatePrice('-1')).toBe('Price must be at least 0');
  });

  it('returns error for price exceeding max', () => {
    expect(validatePrice('100000')).toBe('Price cannot be more than 99999.99');
  });

  it('returns null for valid price', () => {
    expect(validatePrice('29.99')).toBeNull();
    expect(validatePrice('0')).toBeNull();
  });
});

describe('validateQuantity', () => {
  it('returns error for zero quantity', () => {
    expect(validateQuantity('0')).toBe('Quantity must be at least 1');
  });

  it('returns error for non-integer', () => {
    expect(validateQuantity('2.5')).toBe('Quantity must be a whole number');
  });

  it('returns error for quantity exceeding max', () => {
    expect(validateQuantity('1000')).toBe('Quantity cannot be more than 999');
  });

  it('returns null for valid quantity', () => {
    expect(validateQuantity('5')).toBeNull();
  });
});

describe('validateUrl', () => {
  it('returns error when URL is empty', () => {
    expect(validateUrl('')).toBe('URL is required');
  });

  it('returns error for invalid URL', () => {
    expect(validateUrl('not-a-url')).toBe('Please enter a valid URL');
  });

  it('returns null for valid URL', () => {
    expect(validateUrl('https://example.com')).toBeNull();
    expect(validateUrl('http://localhost:3000')).toBeNull();
  });
});

describe('validateCreditCard', () => {
  it('returns error when card number is empty', () => {
    expect(validateCreditCard('')).toBe('Card number is required');
  });

  it('returns error for too short number', () => {
    expect(validateCreditCard('1234')).toBe('Please enter a valid card number');
  });

  it('returns error for invalid Luhn check', () => {
    expect(validateCreditCard('4111111111111112')).toBe('Please enter a valid card number');
  });

  it('returns null for valid card number (Luhn-valid)', () => {
    expect(validateCreditCard('4111111111111111')).toBeNull();
  });
});

describe('validateExpirationDate', () => {
  it('returns error when empty', () => {
    expect(validateExpirationDate('')).toBe('Expiration date is required');
  });

  it('returns error for invalid format', () => {
    expect(validateExpirationDate('13/25')).toBe('Please enter a valid expiration date (MM/YY)');
    expect(validateExpirationDate('1/25')).toBe('Please enter a valid expiration date (MM/YY)');
  });

  it('returns error for expired card', () => {
    expect(validateExpirationDate('01/20')).toBe('Card has expired');
  });

  it('returns null for future date', () => {
    expect(validateExpirationDate('12/30')).toBeNull();
  });
});

describe('validateCVV', () => {
  it('returns error when CVV is empty', () => {
    expect(validateCVV('')).toBe('CVV is required');
  });

  it('returns error for invalid CVV', () => {
    expect(validateCVV('12')).toBe('Please enter a valid CVV');
    expect(validateCVV('12345')).toBe('Please enter a valid CVV');
    expect(validateCVV('abc')).toBe('Please enter a valid CVV');
  });

  it('returns null for valid CVV', () => {
    expect(validateCVV('123')).toBeNull();
    expect(validateCVV('1234')).toBeNull();
  });
});

describe('validateForm', () => {
  it('returns isValid true when all rules pass', () => {
    const formData = { email: 'user@test.com', name: 'John' };
    const rules = {
      email: [validateEmail],
      name: [(v) => validateName(v, 'Name')],
    };
    const result = validateForm(formData, rules);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('returns errors for invalid fields', () => {
    const formData = { email: '', name: '' };
    const rules = {
      email: [validateEmail],
      name: [(v) => validateName(v, 'Name')],
    };
    const result = validateForm(formData, rules);
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe('Email is required');
    expect(result.errors.name).toBe('Name is required');
  });

  it('stops at first error per field', () => {
    const formData = { email: 'bad' };
    const rules = {
      email: [validateEmail],
    };
    const result = validateForm(formData, rules);
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe('Please enter a valid email address');
  });
});
