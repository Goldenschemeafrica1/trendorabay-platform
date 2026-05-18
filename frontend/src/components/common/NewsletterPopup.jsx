import React, { useState, useEffect } from 'react';
import { FaTimes, FaEnvelope } from 'react-icons/fa';
import Button from '../forms/Button';
import Input from '../forms/Input';
import './NewsletterPopup.css';

const NewsletterPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [hasSubscribed, setHasSubscribed] = useState(false);

  useEffect(() => {
    // Check if user has already subscribed or closed the popup
    const hasClosed = localStorage.getItem('newsletterPopupClosed');
    const subscribed = localStorage.getItem('newsletterSubscribed');
    
    if (!hasClosed && !subscribed) {
      // Show popup after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('newsletterPopupClosed', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('Thank you for subscribing!');
      setHasSubscribed(true);
      localStorage.setItem('newsletterSubscribed', 'true');
      
      setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="newsletter-popup-overlay">
      <div className="newsletter-popup">
        <button className="popup-close-btn" onClick={handleClose}>
          <FaTimes />
        </button>
        
        <div className="popup-content">
          <div className="popup-icon">
            <FaEnvelope />
          </div>
          
          <h2 className="popup-title">Stay in the Loop</h2>
          <p className="popup-description">
            Subscribe to our newsletter and get exclusive content, early access to new magazines, and special discounts on merchandise.
          </p>
          
          {!hasSubscribed ? (
            <form className="popup-form" onSubmit={handleSubmit}>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="popup-input"
              />
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
                fullWidth
                className="popup-button"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
              </Button>
            </form>
          ) : (
            <div className="popup-success">
              <p>🎉 {message}</p>
            </div>
          )}
          
          {message && !hasSubscribed && (
            <div className="popup-message">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterPopup;
