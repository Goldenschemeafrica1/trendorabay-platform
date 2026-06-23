import { describe, it, expect } from 'vitest';
import {
  formatRelativeDate,
  formatReadingTime,
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
} from '../formatters';

describe('formatRelativeDate', () => {
  it('returns "Just now" for recent dates', () => {
    const now = new Date();
    expect(formatRelativeDate(now)).toBe('Just now');
  });

  it('returns minutes ago', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatRelativeDate(fiveMinutesAgo)).toBe('5 minutes ago');
  });

  it('returns singular minute', () => {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    expect(formatRelativeDate(oneMinuteAgo)).toBe('1 minute ago');
  });

  it('returns hours ago', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    expect(formatRelativeDate(threeHoursAgo)).toBe('3 hours ago');
  });

  it('returns days ago', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    expect(formatRelativeDate(twoDaysAgo)).toBe('2 days ago');
  });

  it('returns weeks ago', () => {
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    expect(formatRelativeDate(twoWeeksAgo)).toBe('2 weeks ago');
  });

  it('returns months ago', () => {
    const twoMonthsAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    expect(formatRelativeDate(twoMonthsAgo)).toBe('2 months ago');
  });

  it('returns years ago', () => {
    const twoYearsAgo = new Date(Date.now() - 730 * 24 * 60 * 60 * 1000);
    expect(formatRelativeDate(twoYearsAgo)).toBe('2 years ago');
  });
});

describe('formatReadingTime', () => {
  it('returns "Less than 1 min read" for < 1 minute', () => {
    expect(formatReadingTime(0.5)).toBe('Less than 1 min read');
  });

  it('returns ceiled minutes for values >= 1', () => {
    expect(formatReadingTime(1)).toBe('1 min read');
    expect(formatReadingTime(5)).toBe('5 min read');
    expect(formatReadingTime(3.2)).toBe('4 min read');
  });
});

describe('formatPercentage', () => {
  it('formats decimal as percentage', () => {
    expect(formatPercentage(0.5)).toBe('50.0%');
    expect(formatPercentage(1)).toBe('100.0%');
    expect(formatPercentage(0.123, 2)).toBe('12.30%');
  });
});

describe('formatFileSize', () => {
  it('returns "0 Bytes" for zero', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
  });

  it('formats bytes correctly', () => {
    expect(formatFileSize(500)).toBe('500 Bytes');
  });

  it('formats kilobytes correctly', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
  });

  it('formats megabytes correctly', () => {
    expect(formatFileSize(1048576)).toBe('1 MB');
  });

  it('formats gigabytes correctly', () => {
    expect(formatFileSize(1073741824)).toBe('1 GB');
  });
});

describe('formatPhoneNumber', () => {
  it('formats 10-digit number', () => {
    expect(formatPhoneNumber('5551234567')).toBe('(555) 123-4567');
  });

  it('returns original if cannot match format', () => {
    expect(formatPhoneNumber('123')).toBe('123');
    expect(formatPhoneNumber('+1-555-123-4567')).toBe('+1-555-123-4567');
  });
});

describe('formatCreditCard', () => {
  it('groups digits by 4', () => {
    expect(formatCreditCard('4111111111111111')).toBe('4111 1111 1111 1111');
  });

  it('handles partial numbers', () => {
    expect(formatCreditCard('41111111')).toBe('4111 1111');
  });

  it('strips non-digit characters', () => {
    expect(formatCreditCard('4111-1111-1111-1111')).toBe('4111 1111 1111 1111');
  });
});

describe('maskCreditCard', () => {
  it('masks all but last 4 digits', () => {
    const result = maskCreditCard('4111111111111111');
    expect(result).toContain('1111');
    expect(result).toContain('*');
    expect(result.replace(/\s/g, '').slice(-4)).toBe('1111');
  });
});

describe('truncateText', () => {
  it('returns original text if shorter than max', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
  });

  it('truncates and adds suffix', () => {
    expect(truncateText('Hello World', 8)).toBe('Hello...');
  });

  it('supports custom suffix', () => {
    expect(truncateText('Hello World', 8, '…')).toBe('Hello W…');
  });
});

describe('createSlug', () => {
  it('converts text to lowercase slug', () => {
    expect(createSlug('Hello World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(createSlug('Hello! World?')).toBe('hello-world');
  });

  it('handles multiple spaces and dashes', () => {
    expect(createSlug('  Hello   World  ')).toBe('hello-world');
  });

  it('removes leading and trailing dashes', () => {
    expect(createSlug('-hello-world-')).toBe('hello-world');
  });
});

describe('capitalizeWords', () => {
  it('capitalizes each word', () => {
    expect(capitalizeWords('hello world')).toBe('Hello World');
  });

  it('handles mixed case input', () => {
    expect(capitalizeWords('hELLO wORLD')).toBe('Hello World');
  });
});

describe('capitalize', () => {
  it('capitalizes first letter only', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('HELLO')).toBe('Hello');
  });
});

describe('formatUrlParams', () => {
  it('formats params into query string', () => {
    const params = { page: '1', sort: 'name' };
    expect(formatUrlParams(params)).toBe('page=1&sort=name');
  });

  it('excludes null/undefined/empty values', () => {
    const params = { page: '1', sort: null, filter: '' };
    expect(formatUrlParams(params)).toBe('page=1');
  });

  it('encodes special characters', () => {
    const params = { q: 'hello world' };
    expect(formatUrlParams(params)).toBe('q=hello%20world');
  });
});

describe('formatCartItemName', () => {
  it('returns name only when no variants', () => {
    expect(formatCartItemName({ name: 'T-Shirt' })).toBe('T-Shirt');
  });

  it('appends size', () => {
    expect(formatCartItemName({ name: 'T-Shirt', size: 'L' })).toBe('T-Shirt (L)');
  });

  it('appends color', () => {
    expect(formatCartItemName({ name: 'T-Shirt', color: 'Red' })).toBe('T-Shirt - Red');
  });

  it('appends both size and color', () => {
    expect(formatCartItemName({ name: 'T-Shirt', size: 'M', color: 'Blue' })).toBe('T-Shirt (M) - Blue');
  });
});

describe('formatOrderStatus', () => {
  it('maps known statuses', () => {
    expect(formatOrderStatus('pending')).toBe('Pending');
    expect(formatOrderStatus('processing')).toBe('Processing');
    expect(formatOrderStatus('shipped')).toBe('Shipped');
    expect(formatOrderStatus('delivered')).toBe('Delivered');
    expect(formatOrderStatus('cancelled')).toBe('Cancelled');
    expect(formatOrderStatus('refunded')).toBe('Refunded');
  });

  it('returns original for unknown status', () => {
    expect(formatOrderStatus('unknown')).toBe('unknown');
  });
});
