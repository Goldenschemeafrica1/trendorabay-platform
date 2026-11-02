import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCart } from '../store/hooks/useCart';
import { toggleTheme } from '../store/slices/uiSlice';
import { logout } from '../store/slices/authSlice';
import './Header.css';

const navLinks = [
  { label: 'Latest', target: 'nl-latest' },
  { label: 'Communities', target: '/communities', isRoute: true },
  { label: 'Magazines', target: 'nl-magazines' },
  { label: 'Merchandise', target: '/store', isRoute: true, badge: 'SHOP' },
  { label: 'Podcasts', target: 'nl-podcasts' },
  { label: 'Opportunities', target: '/opportunities', isRoute: true },
];

const Header = ({ hideThemeToggle = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.nl-profile-wrap')) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.nl-mobile-theme-wrap')) {
        setThemeOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const scrollToSection = (target) => {
    const link = navLinks.find(l => l.target === target);
    if (link?.isRoute) {
      navigate(target);
    } else if (target.startsWith('/')) {
      navigate(target);
    } else {
      if (location.pathname === '/') {
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
      }
    }
    setMenuOpen(false);
  };

  const scrollToTop = () => {
    const start = window.scrollY;
    if (start === 0) return;
    const duration = 600;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      window.scrollTo(0, start * (1 - ease));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      scrollToTop();
    } else {
      window.scrollTo(0, 0);
      navigate('/');
    }
  };

  return (
    <header className="nl-header">
      <div className="nl-container nl-nav">
        <Link className="nl-logo" to="/" onClick={handleLogoClick}><img src="/weblogo1.png" alt="Trendorabay" /></Link>
        <nav className="nl-navlinks">
          {navLinks.map((link) => (
            <button key={link.target} type="button" onClick={() => scrollToSection(link.target)}>
              {link.label}
              {link.badge && <span className="nl-nav-badge">{link.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="nl-actions">
          {isAuthenticated ? (
            <div className={`nl-profile-wrap ${profileOpen ? 'nl-open' : ''}`}>
              <button
                type="button"
                className="nl-profile-icon"
                aria-label="Profile"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileOpen((open) => !open);
                }}
              >
                {user?.profile_image ? (
                  <img src={user.profile_image} alt={user.username || 'Profile'} />
                ) : (
                  <span className="nl-profile-avatar">👤</span>
                )}
              </button>
              {profileOpen && (
                <div className="nl-profile-dropdown" role="menu">
                  <button
                    type="button"
                    className="nl-profile-item"
                    disabled
                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                  >
                    View Profile
                  </button>
                  <button
                    type="button"
                    className="nl-profile-logout"
                    onClick={() => {
                      dispatch(logout());
                      setProfileOpen(false);
                      navigate('/');
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nl-loginbtn">LOGIN</Link>
          )}
          {!hideThemeToggle && (
            <button
              type="button"
              className="nl-iconbtn nl-theme-toggle"
              onClick={() => dispatch(toggleTheme())}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>
          )}
          <button className="nl-iconbtn nl-search-toggle" onClick={() => navigate('/search')} aria-label="Search">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/>
              <path d="m20 20-3.5-3.5"/>
            </svg>
          </button>
          {isAuthenticated && (
            <button className="nl-iconbtn nl-cart-toggle" onClick={() => navigate('/cart')} aria-label="Cart">
              🛒
              <span className="nl-cart-count">{totalItems}</span>
            </button>
          )}
          <button className="nl-menubtn" onClick={() => setMenuOpen((open) => !open)} aria-label="Menu">☰</button>
        </div>
      </div>
      {menuOpen && (
        <div className="nl-container nl-mobile-nav">
          {navLinks.map((link) => (
            <button
              key={`${link.target}-mobile`}
              type="button"
              onClick={() => scrollToSection(link.target)}
            >
              <span>{link.label}</span>
              {link.badge && <span className="nl-nav-badge">{link.badge}</span>}
            </button>
          ))}
          {!hideThemeToggle && (
            <div className={`nl-mobile-theme-wrap ${themeOpen ? 'nl-open' : ''}`}>
              <button
                type="button"
                className="nl-mobile-theme-trigger"
                onClick={(e) => {
                  e.stopPropagation();
                  setThemeOpen((open) => !open);
                }}
              >
                <span>Theme</span>
                <span className="nl-mobile-chevron">▼</span>
              </button>
              {themeOpen && (
                <div className="nl-mobile-theme-dropdown">
                  <button
                    type="button"
                    className="nl-mobile-theme-option"
                    onClick={() => {
                      dispatch(toggleTheme());
                      setThemeOpen(false);
                    }}
                  >
                    {theme === 'dark' ? '☀ Light Mode' : '☾ Dark Mode'}
                  </button>
                </div>
              )}
            </div>
          )}
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => {
                navigate('/cart');
                setMenuOpen(false);
              }}
              className="nl-mobile-cart-btn"
            >
              🛒 Cart ({totalItems})
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
