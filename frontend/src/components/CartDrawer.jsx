import React from 'react';
import { FaTimes, FaShoppingCart, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../store/hooks/useCart';
import { Link } from 'react-router-dom';
import Button from './forms/Button';
import './styles/CartDrawer.css';

const CartDrawer = () => {
  const { cartItems, removeFromCart, updateItemQuantity, subtotal, calculateTotal, closeCartDrawer, isOpen } = useCart();

  const handleRemove = (item) => {
    removeFromCart(item.id, item.size, item.color);
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity > 0) {
      updateItemQuantity(item.id, item.size, item.color, newQuantity);
    }
  };

  const handleClose = () => {
    closeCartDrawer();
  };

  return (
    <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
      <div className="cart-drawer-overlay" onClick={handleClose} />
      <div className="cart-drawer-content">
        <div className="cart-drawer-header">
          <h2 className="cart-title">
            <FaShoppingCart /> Shopping Cart ({cartItems.length})
          </h2>
          <button className="close-btn" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <FaShoppingCart className="empty-cart-icon" />
              <p>Your cart is empty</p>
              <Button onClick={handleClose} variant="primary">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="cart-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-image"
                    />
                    <div className="cart-item-details">
                      <h4 className="cart-item-name">{item.name}</h4>
                      {item.size && <p className="cart-item-size">Size: {item.size}</p>}
                      <p className="cart-item-price">${item.price.toFixed(2)}</p>
                      <div className="cart-item-quantity">
                        <button 
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus />
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                    <button className="remove-item-btn" onClick={() => handleRemove(item)}>
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="cart-subtotal">
                  <span>Subtotal:</span>
                  <span className="subtotal-amount">${subtotal.toFixed(2)}</span>
                </div>
                <div className="cart-total">
                  <span>Total:</span>
                  <span className="total-amount">${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="cart-actions">
                  <Button onClick={handleClose} variant="outline" fullWidth>
                    Continue Shopping
                  </Button>
                  <Link to="/checkout" onClick={handleClose}>
                    <Button variant="primary" fullWidth>
                      Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
