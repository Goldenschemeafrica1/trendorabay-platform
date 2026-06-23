import { describe, it, expect } from 'vitest';
import cartReducer, {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
  setLoading,
  setError,
  clearError,
  selectCartItems,
  selectCartTotalItems,
  selectCartSubtotal,
  selectCartIsOpen,
  selectCartLoading,
  selectCartError,
} from '../cartSlice';

const initialState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  isOpen: false,
  isLoading: false,
  error: null,
};

describe('cartSlice reducer', () => {
  it('returns initial state', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('addItem', () => {
    it('adds a new item to empty cart', () => {
      const item = { id: '1', name: 'T-Shirt', price: 25, size: 'M', color: 'Red' };
      const state = cartReducer(initialState, addItem({ item, quantity: 1 }));
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual({ ...item, quantity: 1 });
      expect(state.totalItems).toBe(1);
      expect(state.subtotal).toBe(25);
    });

    it('increments quantity for existing item with same id/size/color', () => {
      const item = { id: '1', name: 'T-Shirt', price: 25, size: 'M', color: 'Red' };
      const stateWithItem = cartReducer(initialState, addItem({ item, quantity: 1 }));
      const state = cartReducer(stateWithItem, addItem({ item, quantity: 2 }));
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(3);
      expect(state.totalItems).toBe(3);
      expect(state.subtotal).toBe(75);
    });

    it('adds separate entry for same item with different size', () => {
      const item1 = { id: '1', name: 'T-Shirt', price: 25, size: 'M', color: 'Red' };
      const item2 = { id: '1', name: 'T-Shirt', price: 25, size: 'L', color: 'Red' };
      const state1 = cartReducer(initialState, addItem({ item: item1, quantity: 1 }));
      const state2 = cartReducer(state1, addItem({ item: item2, quantity: 1 }));
      expect(state2.items).toHaveLength(2);
      expect(state2.totalItems).toBe(2);
    });

    it('defaults quantity to 1', () => {
      const item = { id: '1', name: 'T-Shirt', price: 25, size: 'M', color: 'Red' };
      const state = cartReducer(initialState, addItem({ item }));
      expect(state.items[0].quantity).toBe(1);
    });
  });

  describe('removeItem', () => {
    it('removes item by id/size/color', () => {
      const item = { id: '1', name: 'T-Shirt', price: 25, size: 'M', color: 'Red' };
      const stateWithItem = cartReducer(initialState, addItem({ item, quantity: 2 }));
      const state = cartReducer(stateWithItem, removeItem({ itemId: '1', size: 'M', color: 'Red' }));
      expect(state.items).toHaveLength(0);
      expect(state.totalItems).toBe(0);
      expect(state.subtotal).toBe(0);
    });

    it('only removes matching variant', () => {
      const item1 = { id: '1', name: 'T-Shirt', price: 25, size: 'M', color: 'Red' };
      const item2 = { id: '1', name: 'T-Shirt', price: 25, size: 'L', color: 'Red' };
      let state = cartReducer(initialState, addItem({ item: item1, quantity: 1 }));
      state = cartReducer(state, addItem({ item: item2, quantity: 1 }));
      state = cartReducer(state, removeItem({ itemId: '1', size: 'M', color: 'Red' }));
      expect(state.items).toHaveLength(1);
      expect(state.items[0].size).toBe('L');
    });
  });

  describe('updateQuantity', () => {
    it('updates item quantity', () => {
      const item = { id: '1', name: 'T-Shirt', price: 25, size: 'M', color: 'Red' };
      const stateWithItem = cartReducer(initialState, addItem({ item, quantity: 1 }));
      const state = cartReducer(stateWithItem, updateQuantity({ itemId: '1', size: 'M', color: 'Red', quantity: 5 }));
      expect(state.items[0].quantity).toBe(5);
      expect(state.totalItems).toBe(5);
      expect(state.subtotal).toBe(125);
    });

    it('clamps quantity to minimum of 1', () => {
      const item = { id: '1', name: 'T-Shirt', price: 25, size: 'M', color: 'Red' };
      const stateWithItem = cartReducer(initialState, addItem({ item, quantity: 3 }));
      const state = cartReducer(stateWithItem, updateQuantity({ itemId: '1', size: 'M', color: 'Red', quantity: 0 }));
      expect(state.items[0].quantity).toBe(1);
    });
  });

  describe('clearCart', () => {
    it('removes all items and resets totals', () => {
      const item = { id: '1', name: 'T-Shirt', price: 25, size: 'M', color: 'Red' };
      const stateWithItem = cartReducer(initialState, addItem({ item, quantity: 3 }));
      const state = cartReducer(stateWithItem, clearCart());
      expect(state.items).toEqual([]);
      expect(state.totalItems).toBe(0);
      expect(state.subtotal).toBe(0);
    });
  });

  describe('cart open/close', () => {
    it('toggleCart flips isOpen', () => {
      const state1 = cartReducer(initialState, toggleCart());
      expect(state1.isOpen).toBe(true);
      const state2 = cartReducer(state1, toggleCart());
      expect(state2.isOpen).toBe(false);
    });

    it('openCart sets isOpen to true', () => {
      const state = cartReducer(initialState, openCart());
      expect(state.isOpen).toBe(true);
    });

    it('closeCart sets isOpen to false', () => {
      const openState = { ...initialState, isOpen: true };
      const state = cartReducer(openState, closeCart());
      expect(state.isOpen).toBe(false);
    });
  });

  describe('loading and error states', () => {
    it('setLoading sets loading state', () => {
      const state = cartReducer(initialState, setLoading(true));
      expect(state.isLoading).toBe(true);
    });

    it('setError sets error message', () => {
      const state = cartReducer(initialState, setError('Something went wrong'));
      expect(state.error).toBe('Something went wrong');
    });

    it('clearError clears error', () => {
      const errorState = { ...initialState, error: 'Error' };
      const state = cartReducer(errorState, clearError());
      expect(state.error).toBeNull();
    });
  });
});

describe('cart selectors', () => {
  const mockState = {
    cart: {
      items: [{ id: '1', name: 'Test', price: 10, quantity: 2 }],
      totalItems: 2,
      subtotal: 20,
      isOpen: true,
      isLoading: false,
      error: 'test error',
    },
  };

  it('selectCartItems returns items', () => {
    expect(selectCartItems(mockState)).toEqual(mockState.cart.items);
  });

  it('selectCartTotalItems returns total count', () => {
    expect(selectCartTotalItems(mockState)).toBe(2);
  });

  it('selectCartSubtotal returns subtotal', () => {
    expect(selectCartSubtotal(mockState)).toBe(20);
  });

  it('selectCartIsOpen returns open state', () => {
    expect(selectCartIsOpen(mockState)).toBe(true);
  });

  it('selectCartLoading returns loading state', () => {
    expect(selectCartLoading(mockState)).toBe(false);
  });

  it('selectCartError returns error', () => {
    expect(selectCartError(mockState)).toBe('test error');
  });
});
