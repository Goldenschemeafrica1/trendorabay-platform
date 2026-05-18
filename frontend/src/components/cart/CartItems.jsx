import React from 'react';
import { FaTimes, FaShoppingCart, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import Button from '../forms/Button';
import './CartItems.css';

const CartItems = ({ 
  items = [], 
  onRemoveItem, 
  onUpdateQuantity,
  showHeader = true 
}) => {
  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 50 ? 0 : 5.99;
  };

  const calculateGrandTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  if (items.length === 0) {
    return (
      <div className="cart-items-empty">
        <FaShoppingCart className="empty-cart-icon" />
        <h3>Your cart is empty</h3>
        <p>Add some amazing magazines or merchandise to get started!</p>
        <Button variant="primary" href="/merchandise">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="cart-items">
      {showHeader && (
        <div className="cart-items-header">
          <h2>Shopping Cart ({items.length} items)</h2>
        </div>
      )}

      <div className="cart-items-list">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">
              <img 
                src={item.image} 
                alt={item.name}
                onError={(e) => {
                  e.target.src = '/images/placeholder-product.jpg';
                }}
              />
            </div>
            
            <div className="cart-item-details">
              <h4 className="cart-item-name">{item.name}</h4>
              {item.variant && (
                <div className="cart-item-variant">
                  {item.variant.size && <span>Size: {item.variant.size}</span>}
                  {item.variant.color && <span>Color: {item.variant.color}</span>}
                  {item.variant.issue && <span>Issue: {item.variant.issue}</span>}
                </div>
              )}
              <p className="cart-item-price">${item.price.toFixed(2)}</p>
            </div>

            <div className="cart-item-quantity">
              <div className="quantity-controls">
                <button 
                  onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="quantity-btn"
                  disabled={item.quantity <= 1}
                >
                  <FaMinus />
                </button>
                <span className="quantity-value">{item.quantity}</span>
                <button 
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="quantity-btn"
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            <div className="cart-item-total">
              <span className="item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>

            <button 
              className="remove-item-btn"
              onClick={() => onRemoveItem(item.id)}
              aria-label="Remove item"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>${calculateSubtotal().toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Tax</span>
          <span>${calculateTax().toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span>
            {calculateShipping() === 0 ? 'FREE' : `$${calculateShipping().toFixed(2)}`}
          </span>
        </div>
        <div className="summary-row discount">
          <span>Discount</span>
          <span>-$0.00</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>${calculateGrandTotal().toFixed(2)}</span>
        </div>
        
        {calculateShipping() > 0 && (
          <div className="shipping-note">
            <p>Add ${(50 - calculateSubtotal()).toFixed(2)} more for FREE shipping!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItems;
