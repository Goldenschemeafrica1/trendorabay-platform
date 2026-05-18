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
    creators: useRef(null),
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
  const toggleMobileDropdown = (dropdown) => {
    if (mobileOpenDropdown === dropdown) {
      setMobileOpenDropdown(null);
    } else {
      setMobileOpenDropdown(dropdown);
    }
  };

  // Close mobile menu and navigate
  const handleMobileLinkClick = () => {
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
                  TRENDORABAY<span>.mag</span>
                </Link>
                <div className="logo-icons">
                  <div className="profile-login-section">
                    <Link to="/login" className="profile-login-link">
                      <i className="fas fa-user"></i>
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

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-content">
          {/* EXPLORE */}
          <div className="mobile-section">
            <button 
              className="mobile-nav-item"
              onClick={() => toggleMobileDropdown('explore')}
            >
              <span>EXPLORE</span>
              <i className={`fas fa-chevron-down ${mobileOpenDropdown === 'explore' ? 'rotate' : ''}`}></i>
            </button>
            {mobileOpenDropdown === 'explore' && (
              <div className="mobile-dropdown">
                <Link to="/stories/latest" className="mobile-link" onClick={handleMobileLinkClick}>Latest Stories</Link>
                <Link to="/stories" className="mobile-link" onClick={handleMobileLinkClick}>All Stories</Link>
                <Link to="/community/contributors" className="mobile-link" onClick={handleMobileLinkClick}>Contributors</Link>
                <Link to="/community" className="mobile-link" onClick={handleMobileLinkClick}>Community</Link>
                <Link to="/about" className="mobile-link" onClick={handleMobileLinkClick}>About</Link>
              </div>
            )}
          </div>

          {/* MAGAZINE */}
          <div className="mobile-section">
            <button 
              className="mobile-nav-item"
              onClick={() => toggleMobileDropdown('magazine')}
            >
              <span>Magazine</span>
              <i className={`fas fa-chevron-down ${mobileOpenDropdown === 'magazine' ? 'rotate' : ''}`}></i>
            </button>
            {mobileOpenDropdown === 'magazine' && (
              <div className="mobile-dropdown">
                <Link to="/magazines" className="mobile-link" onClick={handleMobileLinkClick}>Magazines</Link>
                <Link to="/stories/latest" className="mobile-link" onClick={handleMobileLinkClick}>Latest Stories</Link>
                <Link to="/stories" className="mobile-link" onClick={handleMobileLinkClick}>All Stories</Link>
                <Link to="/community/contributors" className="mobile-link" onClick={handleMobileLinkClick}>Contributors</Link>
              </div>
            )}
          </div>

          {/* GET FEATURED */}
          <div className="mobile-section">
            <button 
              className="mobile-nav-item"
              onClick={() => toggleMobileDropdown('get-featured')}
            >
              <span>Get Featured</span>
              <i className={`fas fa-chevron-down ${mobileOpenDropdown === 'get-featured' ? 'rotate' : ''}`}></i>
            </button>
            {mobileOpenDropdown === 'get-featured' && (
              <div className="mobile-dropdown">
                <Link to="/write" className="mobile-link" onClick={handleMobileLinkClick}>Start Writing</Link>
                <Link to="/write-for-us" className="mobile-link" onClick={handleMobileLinkClick}>Submit a Story</Link>
                <Link to="/community/contributors" className="mobile-link" onClick={handleMobileLinkClick}>Contributors</Link>
                <Link to="/community" className="mobile-link" onClick={handleMobileLinkClick}>Join Community</Link>
              </div>
            )}
          </div>

          {/* CREATORS HUB */}
          <div className="mobile-section">
            <button 
              className="mobile-nav-item"
              onClick={() => toggleMobileDropdown('creators-hub')}
            >
              <span>Creators Hub</span>
              <i className={`fas fa-chevron-down ${mobileOpenDropdown === 'creators-hub' ? 'rotate' : ''}`}></i>
            </button>
            {mobileOpenDropdown === 'creators-hub' && (
              <div className="mobile-dropdown">
                <Link to="/community" className="mobile-link" onClick={handleMobileLinkClick}>Join Community</Link>
                <Link to="/community/contributors" className="mobile-link" onClick={handleMobileLinkClick}>Contributors</Link>
                <Link to="/community/events" className="mobile-link" onClick={handleMobileLinkClick}>Events</Link>
                <Link to="/write" className="mobile-link" onClick={handleMobileLinkClick}>Write For Us</Link>
              </div>
            )}
          </div>

          {/* BUSINESS HUB */}
          <div className="mobile-section">
            <button 
              className="mobile-nav-item"
              onClick={() => toggleMobileDropdown('business-hub')}
            >
              <span>Business Hub</span>
              <i className={`fas fa-chevron-down ${mobileOpenDropdown === 'business-hub' ? 'rotate' : ''}`}></i>
            </button>
            {mobileOpenDropdown === 'business-hub' && (
              <div className="mobile-dropdown">
                <Link to="/about" className="mobile-link" onClick={handleMobileLinkClick}>About Us</Link>
                <Link to="/mission" className="mobile-link" onClick={handleMobileLinkClick}>Mission</Link>
                <Link to="/contact" className="mobile-link" onClick={handleMobileLinkClick}>Contact</Link>
                <Link to="/write-for-us" className="mobile-link" onClick={handleMobileLinkClick}>Partner With Us</Link>
                <Link to="/contact" className="mobile-link" onClick={handleMobileLinkClick}>Advertise With Us</Link>
              </div>
            )}
          </div>

          {/* PODCASTS */}
          <div className="mobile-section">
            <Link to="/podcast" className="mobile-nav-item" onClick={handleMobileLinkClick}>
              <span>Podcasts</span>
            </Link>
          </div>

          {/* EVENTS */}
          <div className="mobile-section">
            <button 
              className="mobile-nav-item"
              onClick={() => toggleMobileDropdown('events')}
            >
              <span>Events</span>
              <i className={`fas fa-chevron-down ${mobileOpenDropdown === 'events' ? 'rotate' : ''}`}></i>
            </button>
            {mobileOpenDropdown === 'events' && (
              <div className="mobile-dropdown">
                <Link to="/events" className="mobile-link" onClick={handleMobileLinkClick}>Events</Link>
                <Link to="/community/events" className="mobile-link" onClick={handleMobileLinkClick}>Community Events</Link>
                <Link to="/community" className="mobile-link" onClick={handleMobileLinkClick}>Community Hub</Link>
                <Link to="/contact" className="mobile-link" onClick={handleMobileLinkClick}>Contact for Tickets</Link>
              </div>
            )}
          </div>

          {/* STORE */}
          <div className="mobile-section">
            <Link to="/store" className="mobile-nav-item" onClick={handleMobileLinkClick}>
              <span>Store</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;