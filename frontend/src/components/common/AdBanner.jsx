import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import './AdBanner.css';

const AdBanner = ({ 
  type = 'banner', 
  position = 'top',
  size = 'medium',
  content = null,
  closable = true,
  autoClose = false,
  autoCloseDelay = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    if (autoClose && !isClosed) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, isClosed]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setIsClosed(true), 300); // Wait for animation
  };

  if (isClosed) return null;

  const defaultContent = {
    banner: {
      title: "Special Offer!",
      description: "Get 20% off on all magazines this week. Use code: TRENDO20",
      cta: "Shop Now",
      image: "/images/ads/banner-ad.jpg"
    },
    sidebar: {
      title: "Subscribe & Save",
      description: "Monthly magazine subscription starting at $9.99",
      cta: "Learn More",
      image: "/images/ads/sidebar-ad.jpg"
    },
    popup: {
      title: "Limited Time Deal",
      description: "Free shipping on orders over $50",
      cta: "Shop Collection",
      image: "/images/ads/popup-ad.jpg"
    }
  };

  const adContent = content || defaultContent[type] || defaultContent.banner;

  return (
    <div className={`ad-banner ad-${type} ad-${position} ad-${size} ${isVisible ? 'visible' : 'hidden'}`}>
      {closable && (
        <button className="ad-close-btn" onClick={handleClose} aria-label="Close ad">
          <FaTimes />
        </button>
      )}
      
      <div className="ad-content">
        {adContent.image && (
          <div className="ad-image">
            <img src={adContent.image} alt={adContent.title} />
          </div>
        )}
        
        <div className="ad-text">
          <h3 className="ad-title">{adContent.title}</h3>
          <p className="ad-description">{adContent.description}</p>
          {adContent.cta && (
            <button className="ad-cta-btn">
              {adContent.cta}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
