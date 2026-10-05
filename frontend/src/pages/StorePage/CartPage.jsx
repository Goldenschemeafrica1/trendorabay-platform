import React, { useState, useEffect } from 'react';
import { useCart } from '../../store/hooks/useCart';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const recommendedData = [
  {
    id: 101,
    name: 'Trendorabay Issue #04 - "Future Forward"',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=250&fit=crop',
    category: 'Magazine',
    seller: 'Official Trendorabay',
    badge: 'Official'
  },
  {
    id: 102,
    name: 'Street Culture Poster Set',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200&h=250&fit=crop',
    category: 'Art',
    seller: 'Community Artist',
    badge: 'Community'
  },
  {
    id: 103,
    name: 'Trendorabay Water Bottle',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&h=250&fit=crop',
    category: 'Accessories',
    seller: 'Official Trendorabay',
    badge: 'Official'
  },
  {
    id: 104,
    name: 'Digital Creator Bundle',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=250&fit=crop',
    category: 'Digital',
    seller: 'Community Creator',
    badge: 'Community'
  }
];

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateItemQuantity, subtotal } = useCart();
  const [loading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [recommendedProducts] = useState(recommendedData);
  const [shippingMethod, setShippingMethod] = useState('standard');

  // Valid promo codes
  const validPromoCodes = {
    'WELCOME10': { discount: 10, type: 'percentage', name: 'Welcome 10% Off' },
    'TRENDORABAY20': { discount: 20, type: 'percentage', name: 'Magazine Launch Sale' },
    'FREESHIP': { discount: 10, type: 'fixed', name: 'Free Shipping Discount' },
    'AFRICAN50': { discount: 50, type: 'percentage', name: 'African Innovators Special' }
  };

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

  // Calculate discount amount
  const discountAmount = promoApplied ? (discount.type === 'percentage' ? (subtotal * discount.discount / 100) : discount.discount) : 0;

  // Calculate total
  const total = subtotal + shippingCost() - discountAmount;

  // Update quantity
  const handleUpdateQuantity = (itemId, size, color, format, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId, size, color, format);
      return;
    }
    
    updateItemQuantity(itemId, size, color, format, newQuantity);
  };

  // Remove item from cart
  const handleRemoveItem = (itemId, size, color) => {
    removeFromCart(itemId, size, color);
    showNotification('Item removed from cart');
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
    notification.className = 'toast';
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

  // Format money
  const formatMoney = (amount) => {
    return `KSh ${Math.round(amount).toLocaleString('en-KE')}`;
  };

  // Get item count
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
      {/* PAGE HEADER */}
      <section className="page-head">
        <div className="container">
          <div className="eyebrow">Shopping Cart</div>
          <h1>Your Cart</h1>
          <p>Review your items, apply a promo code, and check out when ready.</p>
        </div>
      </section>

      {/* EMPTY STATE */}
      {cartItems.length === 0 ? (
        <section className="container" style={{ padding: '44px 0 80px' }}>
          <div className="empty-cart">
            <div className="icon">🛍</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet. Explore the store and find something you love.</p>
            <button className="btn" onClick={() => navigate('/store')}>Browse the store →</button>
          </div>
        </section>
      ) : (
        <main className="container layout">
          {/* CART ITEMS COLUMN */}
          <div style={{ minWidth: 0 }}>
            <div className="cart-header">
              <div>
                <h2>Items in your cart</h2>
                <div className="count">{itemCount} {itemCount === 1 ? 'item' : 'items'}</div>
              </div>
              <button 
                className="clear" 
                onClick={() => {
                  cartItems.forEach(item => removeFromCart(item.id, item.size, item.color));
                  showNotification('Cart cleared');
                }}
              >
                Clear cart
              </button>
            </div>

            <div className="cart-list">
              {cartItems.map((item, index) => (
                <article key={`${item.id}-${item.size || ''}-${item.color || ''}-${index}`} className="cart-item">
                  <div className="item-img">
                    <img src={item.image} alt={item.name} loading="lazy" />
                    <span className="item-badge">Official</span>
                  </div>
                  <div className="item-info">
                    <div className="seller">Official Trendorabay</div>
                    <h3>{item.name}</h3>
                    <div className="variant">
                      {item.size && <span>Size {item.size}</span>}
                      {item.color && <span>{item.color}</span>}
                    </div>
                    <div className="stock">In stock</div>
                    <div className="item-actions">
                      <button 
                        className="remove" 
                        onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                      >
                        Remove
                      </button>
                      <button 
                        className="remove" 
                        onClick={() => showNotification('Saved to wishlist')}
                      >
                        Save for later
                      </button>
                    </div>
                  </div>
                  <div className="item-right">
                    <div className="item-price">{formatMoney(item.price * item.quantity)}</div>
                    <div className="qty">
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.size, item.color, item.format, item.quantity - 1)}
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <input 
                        type="number" 
                        value={item.quantity} 
                        readOnly
                      />
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.size, item.color, item.format, item.quantity + 1)}
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Recommended products */}
            <section className="recommended">
              <div className="recommended-head">
                <div className="eyebrow">You may also like</div>
                <h2>Hand-picked for you.</h2>
              </div>
              <div className="rec-grid">
                {recommendedProducts.slice(0, 4).map(product => (
                  <article key={product.id} className="rec-card">
                    <div className="rec-img">
                      <img src={product.image} alt={product.name} loading="lazy" />
                      <span className="rec-badge">{product.badge}</span>
                    </div>
                    <div className="rec-info">
                      <h4>{product.name}</h4>
                      <div className="seller">{product.seller}</div>
                      <div className="price">{formatMoney(product.price)}</div>
                      <button onClick={() => addRecommendedToCart(product)}>Add to cart</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* SUMMARY COLUMN */}
          <aside className="summary">
            <h2>Order Summary</h2>

            <div className="promo">
              <input
                type="text"
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button onClick={applyPromoCode}>Apply</button>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>{shippingCost() === 0 ? 'FREE' : formatMoney(shippingCost())}</span>
            </div>
            {discountAmount > 0 && (
              <div className="summary-row discount">
                <span>Discount</span>
                <span>-{formatMoney(discountAmount)}</span>
              </div>
            )}

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>

            <button className="checkout-btn" onClick={() => navigate('/checkout')}>
              Proceed to checkout
            </button>
            <a 
              className="continue-link" 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                navigate('/store');
              }}
            >
              ← Continue shopping
            </a>

            <div className="trust">
              <div>Secure checkout</div>
              <div>Free returns within 14 days</div>
              <div>Delivery in 2–5 business days</div>
            </div>
          </aside>
        </main>
      )}
    </div>
  );
};

export default CartPage;