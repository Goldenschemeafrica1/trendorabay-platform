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
                  <img src="/logoo.png" alt="Trendorabay" className="logo-image" draggable="false" />
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
    </header>
  );
};

export default Header;