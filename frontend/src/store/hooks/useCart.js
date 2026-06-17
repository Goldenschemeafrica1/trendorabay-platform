import { useSelector, useDispatch } from 'react-redux';
import { SHIPPING, TAX } from '../../utils/constants';
import {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
  selectCartItems,
  selectCartTotalItems,
  selectCartSubtotal,
  selectCartIsOpen,
  selectCartLoading,
  selectCartError,
} from '../slices/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartTotalItems);
  const subtotal = useSelector(selectCartSubtotal);
  const isOpen = useSelector(selectCartIsOpen);
  const isLoading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);

  const addToCart = (item, quantity = 1) => {
    dispatch(addItem({ item, quantity }));
  };

  const removeFromCart = (itemId, size = '', color = '') => {
    dispatch(removeItem({ itemId, size, color }));
  };

  const updateItemQuantity = (itemId, size = '', color = '', quantity) => {
    dispatch(updateQuantity({ itemId, size, color, quantity }));
  };

  const clearAllItems = () => {
    dispatch(clearCart());
  };

  const toggleCartDrawer = () => {
    dispatch(toggleCart());
  };

  const openCartDrawer = () => {
    dispatch(openCart());
  };

  const closeCartDrawer = () => {
    dispatch(closeCart());
  };

  // Helper functions
  const getItemQuantity = (itemId, size = '', color = '') => {
    const item = cartItems.find(
      cartItem => cartItem.id === itemId && cartItem.size === size && cartItem.color === color
    );
    return item ? item.quantity : 0;
  };

  const isItemInCart = (itemId, size = '', color = '') => {
    return cartItems.some(
      cartItem => cartItem.id === itemId && cartItem.size === size && cartItem.color === color
    );
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateShipping = () => {
    return subtotal >= SHIPPING.FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING.STANDARD_COST;
  };

  const calculateTax = () => {
    return subtotal * TAX.DEFAULT_RATE;
  };

  const calculateTotal = () => {
    return subtotal + calculateShipping() + calculateTax();
  };

  return {
    // State
    cartItems,
    totalItems,
    subtotal,
    isOpen,
    isLoading,
    error,

    // Actions
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearAllItems,
    toggleCartDrawer,
    openCartDrawer,
    closeCartDrawer,

    // Helpers
    getItemQuantity,
    isItemInCart,
    getCartItemCount,
    calculateShipping,
    calculateTax,
    calculateTotal,
  };
};

export default useCart;
