import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
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

  return (
    <header className="trendorabay-header">
      {/* Top Section - Blue Background */}
      <div className="header-top-section">
        <div className="header-container">
          {/* Left Side - Actions */}
          <div className="header-left-actions">
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