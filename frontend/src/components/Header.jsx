import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './styles/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState(null);
  const [cartCount, setCartCount] = useState(3); // This would come from Redux in real app
  
  // Refs for dropdowns to handle click outside
  const dropdownRefs = {
    home: useRef(null),
    magazine: useRef(null),
    write: useRef(null),
    business: useRef(null),
    podcasts: useRef(null),
    events: useRef(null),
  };

  // Toggle dropdown
  const toggleDropdown = (dropdown) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdown);
    }
  };

  // Toggle mobile dropdown
  const toggleMobileDropdown = (dropdown, e) => {
    e?.stopPropagation();
    if (mobileOpenDropdown === dropdown) {
      setMobileOpenDropdown(null);
    } else {
      setMobileOpenDropdown(dropdown);
    }
  };

  // Close mobile menu and navigate
  const handleMobileLinkClick = (e) => {
    e?.stopPropagation();
    setIsMenuOpen(false);
    setMobileOpenDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutside = Object.keys(dropdownRefs).every(key => {
        return dropdownRefs[key].current && !dropdownRefs[key].current.contains(event.target);
      });
      
      if (isOutside) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="trendorabay-header">
      {/* Top Section - Blue Background */}
      <div className="header-top-section">
        <div className="header-container">
          {/* Left Side - Mobile Menu Toggle */}
          <div className="header-left-actions">
            {/* Mobile Menu Toggle */}
            <button 
              className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            {/* Desktop Actions */}
            <Link to="/advertise" className="advertise-btn desktop-only">
              <span>Advertise</span>
            </Link>
            <Link to="/subscribe" className="subscribe-btn-header desktop-only">
              <span>Subscribe</span>
            </Link>
          </div>
          
          {/* Center - Logo */}
          <div className="logo-nav-container">
            <div className="logo-section">
              <div className="logo-with-icons">
                <Link to="/" className="logo">
                  <img src="/logoo.png" alt="Trendorabay" className="logo-image" draggable="false" />
                </Link>
                <div className="logo-icons">
                  <div className="profile-login-section">
                    <Link to="/login" className="profile-login-link">
                      <span className="desktop-only">Login</span>
                      <i className="fas fa-user-circle mobile-only"></i>
                    </Link>
                    <Link to="/signup" className="register-link desktop-only">
                      <span>Register</span>
                    </Link>
                  </div>
                  <div className="cart-with-amount">
                    <Link to="/cart" className="cart-icon">
                      <i className="fas fa-shopping-cart"></i>
                      {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Empty on mobile, can be used for future elements */}
          <div className="header-actions">
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div 
          className="mobile-nav-overlay"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Navigation Menu */}
      <div className={`mobile-navigation ${isMenuOpen ? 'open' : ''}`}>
        {/* Close Button */}
        <button 
          className="mobile-nav-close"
          onClick={() => setIsMenuOpen(false)}
        >
          <i className="fas fa-times"></i>
        </button>
        
        <div className="mobile-nav-content">
          {/* Mobile Nav Items */}
          <div className="mobile-nav-item">
            <button 
              className="mobile-nav-button"
              onClick={(e) => toggleMobileDropdown('home', e)}
            >
              EXPLORE
              <i className={`fas fa-chevron-${mobileOpenDropdown === 'home' ? 'up' : 'down'}`}></i>
            </button>
            <div className={`mobile-dropdown ${mobileOpenDropdown === 'home' ? 'open' : ''}`}>
              <Link to="/stories" className="mobile-dropdown-item" onClick={(e) => handleMobileLinkClick(e)}>All Stories</Link>
              <Link to="/community/contributors" className="mobile-dropdown-item" onClick={(e) => handleMobileLinkClick(e)}>Contributors</Link>
              <Link to="/community" className="mobile-dropdown-item" onClick={(e) => handleMobileLinkClick(e)}>Community</Link>
              <Link to="/about" className="mobile-dropdown-item" onClick={(e) => handleMobileLinkClick(e)}>About</Link>
            </div>
          </div>

          <div className="mobile-nav-item">
            <Link to="/magazines" className="mobile-nav-link" onClick={(e) => handleMobileLinkClick(e)}>
              Magazine
            </Link>
          </div>

          <div className="mobile-nav-item">
            <button 
              className="mobile-nav-button"
              onClick={(e) => toggleMobileDropdown('write', e)}
            >
              Get Featured
              <i className={`fas fa-chevron-${mobileOpenDropdown === 'write' ? 'up' : 'down'}`}></i>
            </button>
            <div className={`mobile-dropdown ${mobileOpenDropdown === 'write' ? 'open' : ''}`}>
              <Link to="/write" className="mobile-dropdown-item" onClick={(e) => handleMobileLinkClick(e)}>Start Writing</Link>
              <Link to="/community/contributors" className="mobile-dropdown-item" onClick={(e) => handleMobileLinkClick(e)}>Contributors</Link>
              <Link to="/community" className="mobile-dropdown-item" onClick={(e) => handleMobileLinkClick(e)}>Join Community</Link>
            </div>
          </div>

          <div className="mobile-nav-item">
            <button 
              className="mobile-nav-button"
              onClick={(e) => toggleMobileDropdown('business', e)}
            >
              Business Hub
              <i className={`fas fa-chevron-${mobileOpenDropdown === 'business' ? 'up' : 'down'}`}></i>
            </button>
            <div className={`mobile-dropdown ${mobileOpenDropdown === 'business' ? 'open' : ''}`}>
              <Link to="/partner-with-us" className="mobile-dropdown-item" onClick={(e) => handleMobileLinkClick(e)}>Partner With Us</Link>
              <Link to="/advertise" className="mobile-dropdown-item" onClick={(e) => handleMobileLinkClick(e)}>Advertise With Us</Link>
            </div>
          </div>

          <div className="mobile-nav-item">
            <Link to="/podcast" className="mobile-nav-link" onClick={(e) => handleMobileLinkClick(e)}>
              Podcasts
            </Link>
          </div>

          <div className="mobile-nav-item">
            <button 
              className="mobile-nav-button"
              onClick={(e) => toggleMobileDropdown('events', e)}
            >
              Events
              <i className={`fas fa-chevron-${mobileOpenDropdown === 'events' ? 'up' : 'down'}`}></i>
            </button>
            <div className={`mobile-dropdown ${mobileOpenDropdown === 'events' ? 'open' : ''}`}>
              <Link to="/events" className="mobile-dropdown-item" onClick={(e) => handleMobileLinkClick(e)}>Events</Link>
              <Link to="/community/events" className="mobile-dropdown-item" onClick={(e) => handleMobileLinkClick(e)}>Community Events</Link>
              <Link to="/community" className="mobile-dropdown-item" onClick={(e) => handleMobileLinkClick(e)}>Community Hub</Link>
            </div>
          </div>

          <div className="mobile-nav-item">
            <Link to="/store" className="mobile-nav-link" onClick={(e) => handleMobileLinkClick(e)}>
              Store
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;