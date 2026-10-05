import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCart } from '../store/hooks/useCart';
import { toggleTheme } from '../store/slices/uiSlice';
import { logout } from '../store/slices/authSlice';
import './Header.css';

const navLinks = [
  { label: 'Latest', target: 'nl-latest' },
  { label: 'Magazines', target: 'nl-magazines' },
  { label: 'Merchandise', target: 'nl-merchandise', isRoute: false, badge: 'SHOP' },
  { label: 'Podcasts', target: 'nl-podcasts' },
  { label: 'Opportunities', target: '/opportunities', isRoute: true },
];

const communityGroups = [
  {
    title: 'CULTURE & CREATIVITY',
    items: [
      { icon: '🎵', label: 'Music', slug: 'music' },
      { icon: '👗', label: 'Fashion', slug: 'fashion' },
      { icon: '🎨', label: 'Art', slug: 'art' },
      { icon: '🎬', label: 'Film', slug: 'film' },
      { icon: '🎮', label: 'Gaming', slug: 'gaming' },
      { icon: '🖌️', label: 'Creative Arts', slug: 'creative-arts' },
      { icon: '📚', label: 'Comics', slug: 'comics' },
    ],
  },
  {
    title: 'BUSINESS & ECONOMY',
    items: [
      { icon: '💼', label: 'Business', slug: 'business' },
      { icon: '💰', label: 'Finance', slug: 'finance' },
      { icon: '🏠', label: 'Real Estate', slug: 'real-estate' },
      { icon: '🚚', label: 'Logistics', slug: 'logistics' },
      { icon: '👩‍💼', label: 'Women in Business', slug: 'women-in-business' },
      { icon: '🌱', label: 'Agriculture', slug: 'agriculture' },
    ],
  },
  {
    title: 'INNOVATION & FUTURE',
    items: [
      { icon: '💻', label: 'Technology', slug: 'technology' },
      { icon: '🎓', label: 'Education', slug: 'education' },
      { icon: '♻️', label: 'Recycling', slug: 'recycling' },
      { icon: '🤝', label: 'Community Impact', slug: 'community-impact' },
    ],
  },
  {
    title: 'LIFESTYLE & PEOPLE',
    items: [
      { icon: '✨', label: 'Lifestyle', slug: 'lifestyle' },
      { icon: '🥗', label: 'Food & Nutrition', slug: 'food-nutrition' },
      { icon: '✈️', label: 'Travel', slug: 'travel' },
      { icon: '⚽', label: 'Sports', slug: 'sports' },
      { icon: '🎒', label: 'Opportunities', slug: 'events' },
      { icon: '🏡', label: 'Home', slug: 'home' },
      { icon: '🏍️', label: 'Riders', slug: 'riders' },
      { icon: '🎒', label: 'Youth / Student Life', slug: 'youth-student-life' },
    ],
  },
];

const CommunityMegaMenu = () => (
  <div className="nl-community-mega-menu" role="menu" aria-label="Trendorabay communities">
    <div className="nl-community-mega-head">
      <div>
        <span className="nl-mega-tag">TRENDORABAY COMMUNITIES</span>
        <h3>Explore your niche.</h3>
      </div>
      <p>Discover stories, creators, opportunities and conversations across 25 communities.</p>
    </div>
    <div className="nl-community-mega-groups">
      {communityGroups.map((group) => (
        <div key={group.title} className="nl-community-mega-group">
          <h4>{group.title}</h4>
          <div className="nl-community-mega-list">
            {group.items.map((item) => (
              <Link
                key={item.slug}
                to="/communities"
                className="nl-community-mega-item"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div className="nl-community-mega-footer">
      <Link to="/communities">View All Communities →</Link>
    </div>
  </div>
);

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.nl-nav-community-wrap')) {
        setCommunityOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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
    if (target.startsWith('/')) {
      navigate(target);
    } else {
      if (location.pathname === '/') {
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
      }
    }
    setMenuOpen(false);
    setCommunityOpen(false);
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

  const toggleCommunity = (e) => {
    e.stopPropagation();
    setCommunityOpen((open) => !open);
  };

  return (
    <header className="nl-header">
      <div className="nl-container nl-nav">
        <Link className="nl-logo" to="/" onClick={handleLogoClick}><img src="/weblogo1.png" alt="Trendorabay" /></Link>
        <nav className="nl-navlinks">
          <button type="button" onClick={() => scrollToSection('nl-latest')}>
            Latest
          </button>
          <div className={`nl-nav-community-wrap ${communityOpen ? 'nl-open' : ''}`}>
            <button
              type="button"
              className="nl-nav-community-trigger"
              onClick={toggleCommunity}
            >
              Communities <span className="nl-chevron">▼</span>
            </button>
            <CommunityMegaMenu />
          </div>
          {navLinks.slice(1).map((link) => (
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
                    className="nl-profile-logout"
                    onClick={() => {
                      dispatch(logout());
                      setProfileOpen(false);
                      navigate('/login');
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
          <button
            type="button"
            className="nl-iconbtn nl-theme-toggle"
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
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
          <button type="button" onClick={() => scrollToSection('nl-latest')}>
            Latest
          </button>
          <div className={`nl-mobile-community-wrap ${communityOpen ? 'nl-open' : ''}`}>
            <button
              type="button"
              className="nl-mobile-community-trigger"
              onClick={(e) => {
                e.stopPropagation();
                setCommunityOpen((open) => !open);
              }}
            >
              <span>Communities</span>
              <span className="nl-mobile-chevron">▼</span>
            </button>
            {communityOpen && (
              <div className="nl-mobile-community-dropdown">
                {communityGroups.map((group) => (
                  <div key={group.title} className="nl-mobile-community-group">
                    <h5>{group.title}</h5>
                    {group.items.map((item) => (
                      <Link
                        key={item.slug}
                        to="/communities"
                        className="nl-mobile-community-item"
                        onClick={() => setCommunityOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
          {navLinks.slice(1).map((link) => (
            <button
              key={`${link.target}-mobile`}
              type="button"
              onClick={() => scrollToSection(link.target)}
            >
              <span>{link.label}</span>
              {link.badge && <span className="nl-nav-badge">{link.badge}</span>}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              navigate('/search');
              setMenuOpen(false);
            }}
            className="nl-mobile-cart-btn"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <circle cx="11" cy="11" r="7"/>
              <path d="m20 20-3.5-3.5"/>
            </svg>
            Search
          </button>
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
