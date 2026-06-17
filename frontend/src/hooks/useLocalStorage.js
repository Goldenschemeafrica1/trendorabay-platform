import { useState } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Remove item from localStorage
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

/**
 * @deprecated Use `useCart` from `store/hooks/useCart` instead.
 * This hook duplicated the same add/remove/update/total logic that the
 * Redux cart slice already provides.  Kept temporarily for backwards
 * compatibility; will be removed in a future release.
 */
export { useCart as useCartStorage } from '../store/hooks/useCart';

// Hook for managing user preferences
export const usePreferences = () => {
  const [preferences, setPreferences] = useLocalStorage('trendorabay-preferences', {
    theme: 'light',
    language: 'en',
    currency: 'USD',
    newsletterSubscribed: false,
  });

  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetPreferences = () => {
    setPreferences({
      theme: 'light',
      language: 'en',
      currency: 'USD',
      newsletterSubscribed: false,
    });
  };

  return {
    preferences,
    updatePreference,
    resetPreferences,
  };
};

export default useLocalStorage;
