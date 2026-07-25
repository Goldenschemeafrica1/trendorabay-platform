import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/slices/uiSlice';
import './styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector(state => state.ui.theme);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Refs for dropdowns to handle click outside
  const dropdownRefs = {
    home: useRef(null),
    magazine: useRef(null),
    write: useRef(null),
    business: useRef(null),
    podcasts: useRef(null),
    events: useRef(null),
    profile: useRef(null),
  };

  // Toggle dropdown
  const toggleDropdown = (dropdown) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdown);
    }
  };

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      console.log('Header user data:', parsedUser);
      setUser(parsedUser);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutside = Object.keys(dropdownRefs).every(key => {
        return !dropdownRefs[key].current || !dropdownRefs[key].current.contains(event.target);
      });
      
      if (isOutside) {
        setOpenDropdown(null);
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setShowProfileDropdown(false);
    navigate('/');
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  // Handle search
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchInput(false);
      setSearchQuery('');
    }
  };

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
    if (!showSearchInput) {
      // Focus input when opening
      setTimeout(() => {
        const searchInput = document.querySelector('.header-search-input');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  };

  return (
    <header className="trendorabay-header">
      {/* Top Section - Blue Background */}
      <div className="header-top-section">
        <div className="header-container">
          {/* Left Side - Actions */}
          <div className="header-left-actions">
            {/* Search Button - Mobile Only */}
            <button 
              className="search-btn mobile-search-btn"
              onClick={() => navigate('/search')}
              aria-label="Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            {/* Theme Toggle Button - Mobile Only */}
            <button 
              className="theme-toggle-btn mobile-theme-toggle"
              onClick={handleThemeToggle}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              )}
            </button>
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
                  {/* Cart Button - Only visible when logged in */}
                  {user && (
                    <Link to="/cart" className="cart-icon" aria-label="Cart">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                    </Link>
                  )}
                  {/* Search Input */}
                  <div className="header-search-container">
                    {showSearchInput && (
                      <input
                        type="text"
                        className="header-search-input"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        onBlur={() => {
                          // Delay hiding to allow click events to register
                          setTimeout(() => setShowSearchInput(false), 200);
                        }}
                      />
                    )}
                    <button 
                      className="search-btn"
                      onClick={toggleSearchInput}
                      aria-label="Search"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </button>
                  </div>
                  {/* Theme Toggle Button */}
                  <button 
                    className="theme-toggle-btn"
                    onClick={handleThemeToggle}
                    aria-label="Toggle theme"
                  >
                    {theme === 'light' ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                      </svg>
                    )}
                  </button>
                  {user ? (
                    <div className="profile-login-section">
                      <div className="profile-dropdown-container" ref={dropdownRefs.profile}>
                        <button 
                          className="profile-icon-btn"
                          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                        >
                          {user.profile_image || user.avatar || user.image || user.profileImage || user.profile_picture || user.profilePic ? (
                            <img 
                              src={user.profile_image || user.avatar || user.image || user.profileImage || user.profile_picture || user.profilePic} 
                              alt="Profile" 
                              className="profile-avatar-img"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'inline-block';
                              }}
                            />
                          ) : null}
                          <i className="fas fa-user-circle" style={{ display: (user.profile_image || user.avatar || user.image || user.profileImage || user.profile_picture || user.profilePic) ? 'none' : 'inline-block' }}></i>
                          <span className="desktop-only">{(user.username || user.first_name || 'Profile').toUpperCase()}</span>
                        </button>
                        {showProfileDropdown && (
                          <div className="profile-dropdown">
                            <Link to="/cart" onClick={() => setShowProfileDropdown(false)}>
                              <i className="fas fa-shopping-cart"></i> Cart
                            </Link>
                            <Link to="/orders" onClick={() => setShowProfileDropdown(false)}>
                              <i className="fas fa-shopping-bag"></i> My Orders
                            </Link>
                            <Link to="/settings" onClick={() => setShowProfileDropdown(false)}>
                              <i className="fas fa-cog"></i> Settings
                            </Link>
                            <button onClick={handleLogout} className="logout-btn">
                              <i className="fas fa-sign-out-alt"></i> Logout
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="profile-login-section">
                      <Link to="/login" className="profile-login-link">
                        <span className="desktop-only">Login</span>
                        <i className="fas fa-user-circle mobile-only"></i>
                      </Link>
                      <Link to="/signup" className="register-link desktop-only">
                        <span>Register</span>
                      </Link>
                    </div>
                  )}
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