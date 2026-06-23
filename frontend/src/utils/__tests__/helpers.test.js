import { describe, it, expect } from 'vitest';
import {
  deepClone,
  generateId,
  getFileExtension,
  isImageFile,
  formatBytes,
  calculatePercentage,
  clamp,
  shuffleArray,
  removeDuplicates,
  groupBy,
  sortBy,
  isEmpty,
  safeJsonParse,
  getNestedProperty,
} from '../helpers';

describe('deepClone', () => {
  it('returns primitives as-is', () => {
    expect(deepClone(null)).toBe(null);
    expect(deepClone(42)).toBe(42);
    expect(deepClone('hello')).toBe('hello');
    expect(deepClone(undefined)).toBe(undefined);
  });

  it('clones arrays', () => {
    const arr = [1, 2, { a: 3 }];
    const cloned = deepClone(arr);
    expect(cloned).toEqual(arr);
    expect(cloned).not.toBe(arr);
    expect(cloned[2]).not.toBe(arr[2]);
  });

  it('clones nested objects', () => {
    const obj = { a: 1, b: { c: 2, d: [3, 4] } };
    const cloned = deepClone(obj);
    expect(cloned).toEqual(obj);
    expect(cloned.b).not.toBe(obj.b);
    expect(cloned.b.d).not.toBe(obj.b.d);
  });

  it('clones Date objects', () => {
    const date = new Date('2024-01-01');
    const cloned = deepClone(date);
    expect(cloned).toEqual(date);
    expect(cloned).not.toBe(date);
  });
});

describe('generateId', () => {
  it('generates a string', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('includes prefix when provided', () => {
    const id = generateId('item_');
    expect(id.startsWith('item_')).toBe(true);
  });

  it('generates unique ids', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });
});

describe('getFileExtension', () => {
  it('returns file extension', () => {
    expect(getFileExtension('photo.jpg')).toBe('jpg');
    expect(getFileExtension('document.pdf')).toBe('pdf');
  });

  it('returns empty string for no extension', () => {
    expect(getFileExtension('noextension')).toBe('');
  });

  it('handles dotfiles (returns empty for no dot before name)', () => {
    expect(getFileExtension('.gitignore')).toBe('');
  });

  it('handles multiple dots', () => {
    expect(getFileExtension('archive.tar.gz')).toBe('gz');
  });
});

describe('isImageFile', () => {
  it('returns true for image extensions', () => {
    expect(isImageFile('photo.jpg')).toBe(true);
    expect(isImageFile('image.png')).toBe(true);
    expect(isImageFile('icon.svg')).toBe(true);
    expect(isImageFile('banner.webp')).toBe(true);
    expect(isImageFile('anim.gif')).toBe(true);
  });

  it('returns false for non-image extensions', () => {
    expect(isImageFile('document.pdf')).toBe(false);
    expect(isImageFile('script.js')).toBe(false);
    expect(isImageFile('styles.css')).toBe(false);
  });

  it('is case-insensitive', () => {
    expect(isImageFile('Photo.JPG')).toBe(true);
    expect(isImageFile('IMAGE.PNG')).toBe(true);
  });
});

describe('formatBytes', () => {
  it('returns "0 Bytes" for zero', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
  });

  it('formats bytes', () => {
    expect(formatBytes(500)).toBe('500 Bytes');
  });

  it('formats kilobytes', () => {
    expect(formatBytes(1024)).toBe('1 KB');
  });

  it('formats megabytes', () => {
    expect(formatBytes(1048576)).toBe('1 MB');
  });

  it('respects decimal precision', () => {
    expect(formatBytes(1536, 1)).toBe('1.5 KB');
  });
});

describe('calculatePercentage', () => {
  it('calculates percentage', () => {
    expect(calculatePercentage(50, 100)).toBe(50);
    expect(calculatePercentage(1, 4)).toBe(25);
  });

  it('returns 0 when total is 0', () => {
    expect(calculatePercentage(10, 0)).toBe(0);
  });
});

describe('clamp', () => {
  it('returns value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('clamps to min', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('clamps to max', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe('shuffleArray', () => {
  it('returns array of same length', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(arr);
    expect(shuffled).toHaveLength(arr.length);
  });

  it('contains same elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(arr);
    expect(shuffled.sort()).toEqual(arr.sort());
  });

  it('does not mutate original array', () => {
    const arr = [1, 2, 3, 4, 5];
    const original = [...arr];
    shuffleArray(arr);
    expect(arr).toEqual(original);
  });
});

describe('removeDuplicates', () => {
  it('removes duplicate primitives', () => {
    expect(removeDuplicates([1, 2, 2, 3, 3])).toEqual([1, 2, 3]);
  });

  it('removes duplicates by key', () => {
    const arr = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
      { id: 1, name: 'c' },
    ];
    const result = removeDuplicates(arr, 'id');
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(2);
  });
});

describe('groupBy', () => {
  it('groups items by key', () => {
    const items = [
      { category: 'fruit', name: 'apple' },
      { category: 'fruit', name: 'banana' },
      { category: 'veggie', name: 'carrot' },
    ];
    const grouped = groupBy(items, 'category');
    expect(grouped.fruit).toHaveLength(2);
    expect(grouped.veggie).toHaveLength(1);
  });
});

describe('sortBy', () => {
  it('sorts ascending by default', () => {
    const items = [{ price: 30 }, { price: 10 }, { price: 20 }];
    const sorted = sortBy(items, 'price');
    expect(sorted.map(i => i.price)).toEqual([10, 20, 30]);
  });

  it('sorts descending', () => {
    const items = [{ price: 30 }, { price: 10 }, { price: 20 }];
    const sorted = sortBy(items, 'price', 'desc');
    expect(sorted.map(i => i.price)).toEqual([30, 20, 10]);
  });

  it('does not mutate original array', () => {
    const items = [{ price: 30 }, { price: 10 }];
    const original = [...items];
    sortBy(items, 'price');
    expect(items).toEqual(original);
  });
});

describe('isEmpty', () => {
  it('returns true for null/undefined', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
  });

  it('returns true for empty string', () => {
    expect(isEmpty('')).toBe(true);
  });

  it('returns true for empty array', () => {
    expect(isEmpty([])).toBe(true);
  });

  it('returns true for empty object', () => {
    expect(isEmpty({})).toBe(true);
  });

  it('returns false for non-empty values', () => {
    expect(isEmpty('hello')).toBe(false);
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty({ a: 1 })).toBe(false);
  });
});

describe('safeJsonParse', () => {
  it('parses valid JSON', () => {
    expect(safeJsonParse('{"a":1}')).toEqual({ a: 1 });
    expect(safeJsonParse('[1,2,3]')).toEqual([1, 2, 3]);
  });

  it('returns default value for invalid JSON', () => {
    expect(safeJsonParse('invalid')).toBeNull();
    expect(safeJsonParse('invalid', [])).toEqual([]);
    expect(safeJsonParse('', 'fallback')).toBe('fallback');
  });
});

describe('getNestedProperty', () => {
  it('gets nested values', () => {
    const obj = { a: { b: { c: 42 } } };
    expect(getNestedProperty(obj, 'a.b.c')).toBe(42);
  });

  it('returns default for missing paths', () => {
    const obj = { a: { b: 1 } };
    expect(getNestedProperty(obj, 'a.c.d')).toBeUndefined();
    expect(getNestedProperty(obj, 'a.c.d', 'default')).toBe('default');
  });

  it('returns default for null object', () => {
    expect(getNestedProperty(null, 'a.b', 'fallback')).toBe('fallback');
  });

  it('handles top-level access', () => {
    const obj = { name: 'test' };
    expect(getNestedProperty(obj, 'name')).toBe('test');
  });
});
