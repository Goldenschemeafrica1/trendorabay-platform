import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { FaShoppingCart, FaHeart, FaShare, FaStar, FaTruck, FaShieldAlt, FaUndo } from 'react-icons/fa';
import Button from '../forms/Button';
import './ProductDetails.css';

const ProductDetails = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  if (!product) {
    return (
      <div className="product-details-loading">
        <div className="loading-spinner">Loading product...</div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Add to cart logic
    console.log('Added to cart:', {
      ...product,
      size: selectedSize,
      color: selectedColor,
      quantity
    });
  };

  const handleAddToWishlist = () => {
    // Add to wishlist logic
    console.log('Added to wishlist:', product.id);
  };

  const handleShare = () => {
    // Share logic
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      });
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar 
        key={i} 
        className={i < Math.floor(rating) ? 'star filled' : 'star empty'}
      />
    ));
  };

  return (
    <div className="product-details">
      <div className="product-details-container">
        <div className="product-grid">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img 
                src={product.image} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = '/images/placeholder-product.jpg';
                }}
              />
            </div>
            {product.images && (
              <div className="image-thumbnails">
                {product.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${product.name} ${index + 1}`}
                    className="thumbnail"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <div className="product-meta">
                <span className="product-category">{product.category}</span>
                {product.rating && (
                  <div className="product-rating">
                    {renderStars(product.rating)}
                    <span className="rating-text">({product.reviews || 0} reviews)</span>
                  </div>
                )}
              </div>
              
              <h1 className="product-title">{product.name}</h1>
              
              <div className="product-pricing">
                {product.originalPrice && (
                  <span className="original-price">${product.originalPrice}</span>
                )}
                <span className="current-price">${product.price}</span>
              </div>
            </div>

            {/* Product Options */}
            <div className="product-options">
              {/* Size Selection */}
              {product.sizes && (
                <div className="option-group">
                  <label className="option-label">Size</label>
                  <div className="size-options">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && (
                <div className="option-group">
                  <label className="option-label">Color</label>
                  <div className="color-options">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        className={`color-option ${selectedColor === color.name ? 'selected' : ''}`}
                        onClick={() => setSelectedColor(color.name)}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="option-group">
                <label className="option-label">Quantity</label>
                <div className="quantity-selector">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="quantity-input"
                    min="1"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Product Actions */}
            <div className="product-actions">
              <Button 
                onClick={handleAddToCart}
                variant="primary"
                size="large"
                fullWidth
              >
                <FaShoppingCart /> Add to Cart
              </Button>
              
              <div className="secondary-actions">
                <Button 
                  onClick={handleAddToWishlist}
                  variant="outline"
                  size="large"
                >
                  <FaHeart /> Wishlist
                </Button>
                
                <Button 
                  onClick={handleShare}
                  variant="outline"
                  size="large"
                >
                  <FaShare /> Share
                </Button>
              </div>
            </div>

            {/* Product Features */}
            <div className="product-features">
              <div className="feature">
                <FaTruck className="feature-icon" />
                <div className="feature-text">
                  <strong>Free Shipping</strong>
                  <span>On orders over $50</span>
                </div>
              </div>
              <div className="feature">
                <FaShieldAlt className="feature-icon" />
                <div className="feature-text">
                  <strong>Secure Payment</strong>
                  <span>100% secure transactions</span>
                </div>
              </div>
              <div className="feature">
                <FaUndo className="feature-icon" />
                <div className="feature-text">
                  <strong>Easy Returns</strong>
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="product-tabs">
          <div className="tab-navigation">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="tab-pane">
                <h3>Description</h3>
                <p>{product.description}</p>
                {product.fullDescription && (
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.fullDescription) }} />
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="tab-pane">
                <h3>Specifications</h3>
                {product.specifications ? (
                  <div className="specifications-grid">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="spec-item">
                        <span className="spec-label">{spec.label}:</span>
                        <span className="spec-value">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No specifications available.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-pane">
                <h3>Customer Reviews</h3>
                {product.reviewsData ? (
                  <div className="reviews-section">
                    {product.reviewsData.map((review, index) => (
                      <div key={index} className="review">
                        <div className="review-header">
                          <span className="review-author">{review.author}</span>
                          <div className="review-rating">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="review-text">{review.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No reviews yet. Be the first to review this product!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
