import React, { useState, useEffect } from 'react';
import { useCart } from '../../store/hooks/useCart';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = ({ onCheckoutComplete }) => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateItemQuantity, subtotal, calculateTotal, clearAllItems } = useCart();
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [giftWrap, setGiftWrap] = useState(false);

  // Valid promo codes
  const validPromoCodes = {
    'WELCOME10': { discount: 10, type: 'percentage', name: 'Welcome 10% Off' },
    'TRENDORABAY20': { discount: 20, type: 'percentage', name: 'Magazine Launch Sale' },
    'FREESHIP': { discount: 10, type: 'fixed', name: 'Free Shipping Discount' },
    'AFRICAN50': { discount: 50, type: 'percentage', name: 'African Innovators Special' }
  };

  // Recommended products based on cart items
  const recommendedData = [
    {
      id: 101,
      name: 'Trendorabay Issue #04 - "Future Forward"',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=250&fit=crop',
      category: 'Magazine'
    },
    {
      id: 102,
      name: 'Street Culture Poster Set',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200&h=250&fit=crop',
      category: 'Art'
    },
    {
      id: 103,
      name: 'Trendorabay Water Bottle',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&h=250&fit=crop',
      category: 'Accessories'
    },
    {
      id: 104,
      name: 'Digital Creator Bundle',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=250&fit=crop',
      category: 'Digital'
    }
  ];

  // Load cart from localStorage
  useEffect(() => {
    const savedItemsData = localStorage.getItem('trendorabay_saved_items');
    if (savedItemsData) {
      setSavedItems(JSON.parse(savedItemsData));
    }
    
    setLoading(false);
    setRecommendedProducts(recommendedData);
  }, []);

  // Save saved items to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('trendorabay_saved_items', JSON.stringify(savedItems));
    }
  }, [savedItems, loading]);

  // Calculate shipping cost
  const shippingCost = () => {
    if (subtotal >= 100) return 0;
    switch (shippingMethod) {
      case 'standard': return 5.99;
      case 'express': return 12.99;
      case 'overnight': return 24.99;
      default: return 5.99;
    }
  };

  // Calculate gift wrap cost
  const giftWrapCost = giftWrap ? 4.99 : 0;

  // Calculate discount amount
  const discountAmount = promoApplied ? (discount.type === 'percentage' ? (subtotal * discount.discount / 100) : discount.discount) : 0;

  // Calculate total
  const total = subtotal + shippingCost() + giftWrapCost - discountAmount;

  // Update quantity
  const handleUpdateQuantity = (itemId, size, color, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId, size, color);
      return;
    }
    
    updateItemQuantity(itemId, size, color, newQuantity);
  };

  // Remove item from cart
  const handleRemoveItem = (itemId, size, color) => {
    removeFromCart(itemId, size, color);
    showNotification('Item removed from cart');
  };

  // Move item to saved for later
  const moveToSaved = (item) => {
    handleRemoveItem(item.id, item.size, item.color);
    setSavedItems([...savedItems, { ...item, savedAt: new Date().toISOString() }]);
    showNotification('Item moved to Saved for Later');
  };

  // Move saved item back to cart
  const moveToCart = (savedItem) => {
    setSavedItems(savedItems.filter(i =>
      !(i.id === savedItem.id && i.size === savedItem.size)
    ));

    const existingItem = cartItems.find(item =>
      item.id === savedItem.id && item.size === savedItem.size
    );

    if (existingItem) {
      updateItemQuantity(savedItem.id, savedItem.size, savedItem.color, existingItem.quantity + 1);
    } else {
      const cartItem = {
        id: savedItem.id,
        name: savedItem.name,
        price: savedItem.price,
        image: savedItem.image,
        size: savedItem.size || '',
        color: savedItem.color || '',
        quantity: 1
      };
      updateItemQuantity(cartItem.id, cartItem.size, cartItem.color, 1);
    }

    showNotification('Item moved back to cart');
  };

  // Remove saved item
  const removeSavedItem = (itemId, size) => {
    setSavedItems(savedItems.filter(item => !(item.id === itemId && item.size === size)));
    showNotification('Item removed from saved list');
  };

  // Apply promo code
  const applyPromoCode = () => {
    const code = promoCode.trim().toUpperCase();
    if (validPromoCodes[code]) {
      setDiscount(validPromoCodes[code]);
      setPromoApplied(true);
      setPromoError('');
      showNotification(`${validPromoCodes[code].name} applied!`);
    } else {
      setPromoError('Invalid promo code');
      setPromoApplied(false);
      setDiscount(0);
    }
  };

  // Remove promo code
  const removePromoCode = () => {
    setPromoApplied(false);
    setDiscount(0);
    setPromoCode('');
    setPromoError('');
    showNotification('Promo code removed');
  };

  // Add recommended product to cart
  const addRecommendedToCart = (product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: '',
      color: '',
      quantity: 1
    };

    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      updateItemQuantity(product.id, '', '', existingItem.quantity + 1);
    } else {
      updateItemQuantity(cartItem.id, cartItem.size, cartItem.color, 1);
    }

    showNotification(`${product.name} added to cart!`);
  };

  // Show notification
  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  };

  // Proceed to checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showNotification('Your cart is empty');
      return;
    }

    // Simulate checkout process
    const orderData = {
      items: cartItems,
      subtotal,
      shipping: shippingCost(),
      giftWrapCost: giftWrapCost,
      discount: discountAmount,
      total,
      promoApplied: promoApplied ? discount.name : null,
      shippingMethod,
      giftWrapEnabled: giftWrap,
      orderDate: new Date().toISOString(),
      orderNumber: 'TRX-' + Math.random().toString(36).substr(2, 8).toUpperCase()
    };

    localStorage.setItem('trendorabay_last_order', JSON.stringify(orderData));

    if (onCheckoutComplete) {
      onCheckoutComplete(orderData);
    } else {
      alert(`Order placed successfully!\nOrder #: ${orderData.orderNumber}\nTotal: $${total.toFixed(2)}\n\nThank you for shopping with Trendorabay!`);
      // Clear cart
      clearAllItems();
      navigate('/checkout/success');
    }
  };

  if (loading) {
    return (
      <div className="cart-page-loading">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Main Cart Content */}
        <div className="cart-main">
          {cartItems.length === 0 && savedItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added any items to your cart yet.</p>
              <button onClick={() => navigate('/store')} className="continue-shopping-btn">Continue Shopping</button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              {cartItems.length > 0 && (
                <div className="cart-items-section">
                  <h2 className="section-title">Cart Items ({cartItems.length})</h2>
                  <div className="cart-items-list">
                    {cartItems.map((item, index) => (
                      <div key={`${item.id}-${item.size || ''}-${item.color || ''}-${index}`} className="cart-item-card">
                        <div className="cart-item-image">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="cart-item-details">
                          <h3 className="cart-item-name">{item.name}</h3>
                          {item.size && <span className="cart-item-size">Size: {item.size}</span>}
                          <div className="cart-item-price">${item.price.toFixed(2)}</div>
                          <div className="cart-item-actions">
                            <div className="quantity-selector">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <button
                              className="save-for-later-btn"
                              onClick={() => moveToSaved(item)}
                            >
                              Save for Later
                            </button>
                            <button
                              className="remove-btn"
                              onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="cart-item-total">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Saved for Later Items */}
              {savedItems.length > 0 && (
                <div className="saved-items-section">
                  <h2 className="section-title">Saved for Later ({savedItems.length})</h2>
                  <div className="saved-items-grid">
                    {savedItems.map((item, index) => (
                      <div key={`saved-${item.id}-${item.size || ''}-${index}`} className="saved-item-card">
                        <img src={item.image} alt={item.name} className="saved-item-image" />
                        <div className="saved-item-info">
                          <h4>{item.name}</h4>
                          {item.size && <span>Size: {item.size}</span>}
                          <p>${item.price.toFixed(2)}</p>
                          <div className="saved-item-actions">
                            <button 
                              className="move-to-cart-btn"
                              onClick={() => moveToCart(item)}
                            >
                              Move to Cart
                            </button>
                            <button 
                              className="remove-saved-btn"
                              onClick={() => removeSavedItem(item.id, item.size)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Products */}
              <div className="recommended-section">
                <h2 className="section-title">You Might Also Like</h2>
                <div className="recommended-grid">
                  {recommendedProducts.map(product => (
                    <div key={product.id} className="recommended-card">
                      <img src={product.image} alt={product.name} className="recommended-image" />
                      <div className="recommended-info">
                        <span className="recommended-category">{product.category}</span>
                        <h4>{product.name}</h4>
                        <p>${product.price.toFixed(2)}</p>
                        <button 
                          className="add-recommended-btn"
                          onClick={() => addRecommendedToCart(product)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Order Summary Sidebar */}
        {cartItems.length > 0 && (
          <div className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <div className="shipping-options">
                  <label className="shipping-option">
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                    />
                    <span>Standard (3-5 days) - ${shippingCost() === 0 ? 'FREE' : '$5.99'}</span>
                  </label>
                  <label className="shipping-option">
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                    />
                    <span>Express (1-2 days) - $12.99</span>
                  </label>
                  <label className="shipping-option">
                    <input
                      type="radio"
                      name="shipping"
                      value="overnight"
                      checked={shippingMethod === 'overnight'}
                      onChange={() => setShippingMethod('overnight')}
                    />
                    <span>Overnight (Next day) - $24.99</span>
                  </label>
                </div>
              </div>
              
              <div className="summary-row">
                <span>Gift Wrap</span>
                <label className="gift-wrap-option">
                  <input
                    type="checkbox"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                  />
                  <span>Add gift wrapping (+$4.99)</span>
                </label>
              </div>
              
              {/* Promo Code Section */}
              <div className="promo-section">
                {!promoApplied ? (
                  <div className="promo-input-group">
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="promo-input"
                    />
                    <button onClick={applyPromoCode} className="apply-promo-btn">
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="promo-applied">
                    <span>{discount.name}: -${discountAmount.toFixed(2)}</span>
                    <button onClick={removePromoCode} className="remove-promo-btn">
                      Remove
                    </button>
                  </div>
                )}
                {promoError && <p className="promo-error">{promoError}</p>}
              </div>
              
              {discountAmount > 0 && (
                <div className="summary-row discount-row">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total-row">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="checkout-note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4M12 8h.01"/>
                </svg>
                <span>Free shipping on orders over $100</span>
              </div>
              
              <button className="checkout-button" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
              
              <div className="payment-icons">
                <span>Visa</span>
                <span>Mastercard</span>
                <span>M-Pesa</span>
                <span>PayPal</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;