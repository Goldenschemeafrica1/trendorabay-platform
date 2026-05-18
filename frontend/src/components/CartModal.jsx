import React from 'react';
import './CartModal.css';

const CartModal = ({ isOpen, onClose, cartItems }) => {
  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="cart-modal-overlay">
      <div className="cart-modal">
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p className="price">${item.price}</p>
                      <div className="quantity-controls">
                        <button>-</button>
                        <span>{item.quantity}</span>
                        <button>+</button>
                      </div>
                    </div>
                    <button className="remove-item">&times;</button>
                  </div>
                ))}
              </div>
              
              <div className="cart-summary">
                <div className="total">
                  <strong>Total: ${total.toFixed(2)}</strong>
                </div>
                <button className="btn-checkout">Proceed to Checkout</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
