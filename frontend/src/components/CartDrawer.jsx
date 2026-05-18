import React from 'react';
import { FaTimes, FaShoppingCart, FaTrash } from 'react-icons/fa';
import Button from './forms/Button';
import './styles/CartDrawer.css';

const CartDrawer = ({ isOpen, onClose }) => {
  const cartItems = []; // This would come from your cart state/context

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
      <div className="cart-drawer-overlay" onClick={onClose} />
      <div className="cart-drawer-content">
        <div className="cart-drawer-header">
          <h2 className="cart-title">
            <FaShoppingCart /> Shopping Cart
          </h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <FaShoppingCart className="empty-cart-icon" />
              <p>Your cart is empty</p>
              <Button onClick={onClose} variant="primary">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-image"
                    />
                    <div className="cart-item-details">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <p className="cart-item-price">${item.price.toFixed(2)}</p>
                      <div className="cart-item-quantity">
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <button className="remove-item-btn">
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="cart-total">
                  <span>Total:</span>
                  <span className="total-amount">${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="cart-actions">
                  <Button onClick={onClose} variant="outline" fullWidth>
                    Continue Shopping
                  </Button>
                  <Button variant="primary" fullWidth>
                    Checkout
                  </Button>
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
