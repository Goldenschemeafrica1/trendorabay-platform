import React from 'react';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import './MagazineCard.css';

const MagazineCard = ({ magazine }) => {
  const handleAddToCart = () => {
    // Add to cart logic here
    console.log('Added to cart:', magazine.title);
  };

  const handleViewDetails = () => {
    // View details logic here
    console.log('View details:', magazine.title);
  };

  return (
    <div className="magazine-card">
      <div className="magazine-image">
        <img 
          src={magazine.coverImage || '/images/magazine-placeholder.jpg'} 
          alt={magazine.title}
          onError={(e) => {
            e.target.src = '/images/magazine-placeholder.jpg';
          }}
        />
        <div className="magazine-overlay">
          <button 
            className="overlay-btn view-btn"
            onClick={handleViewDetails}
            aria-label="View details"
          >
            <FaEye />
          </button>
        </div>
      </div>
      
      <div className="magazine-content">
        <h3 className="magazine-title">{magazine.title}</h3>
        <p className="magazine-description">{magazine.description}</p>
        <div className="magazine-meta">
          <span className="magazine-price">${magazine.price}</span>
          <span className="magazine-category">{magazine.category}</span>
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

export default MagazineCard;
