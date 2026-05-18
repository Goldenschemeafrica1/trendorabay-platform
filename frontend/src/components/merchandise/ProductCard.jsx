import React from 'react';
import { FaShoppingCart, FaEye, FaStar } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star filled" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="star half" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="star empty" />);
    }
    
    return stars;
  };

  const handleAddToCart = () => {
    console.log('Added to cart:', product.name);
  };

  const handleViewDetails = () => {
    console.log('View details:', product.name);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={product.image || '/images/product-placeholder.jpg'} 
          alt={product.name}
          onError={(e) => {
            e.target.src = '/images/product-placeholder.jpg';
          }}
        />
        {product.isNew && (
          <span className="new-badge">New</span>
        )}
        {product.discount && (
          <span className="discount-badge">-{product.discount}%</span>
        )}
        <div className="product-overlay">
          <button 
            className="overlay-btn view-btn"
            onClick={handleViewDetails}
            aria-label="View details"
          >
            <FaEye />
          </button>
        </div>
      </div>
      
      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        {product.rating && (
          <div className="product-rating">
            <div className="stars">
              {renderStars(product.rating)}
            </div>
            <span className="rating-text">({product.reviews || 0} reviews)</span>
          </div>
        )}
        
        <div className="product-meta">
          <div className="price-container">
            <span className="product-price">${product.price}</span>
            {product.originalPrice && (
              <span className="original-price">${product.originalPrice}</span>
            )}
          </div>
          <span className="product-category">{product.category}</span>
        </div>
        
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
        >
          <FaShoppingCart /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
