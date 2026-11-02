import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 250);
    }
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
    <footer className="footer">
      <div className="footer-main">
        <div className="container footer-grid">

          <div className="footer-brand">
            <Link className="footer-logo" to="/" onClick={handleLogoClick}><img src="/weblogo.png" alt="Trendorabay" /></Link>
            <p>From mtaa to global — stories, style, solutions and opportunities shaping Africa’s tomorrow.</p>
            <p className="footer-location">Based in Ruiru, Kenya • Connecting Africa and the world.</p>
            <p className="footer-contact">Phone: 0111773508 • 0787809638</p>
            <p className="footer-email">Email: <a href="mailto:trendorabay@trendorabay.com" style={{color: 'inherit', textDecoration: 'none'}}>trendorabay@trendorabay.com</a></p>

            <div className="footer-social" aria-label="Follow Trendorabay">
              <a href="https://x.com/Trendorabayke" target="_blank" rel="noopener noreferrer" aria-label="X">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://bsky.app/profile/trendorabay.bsky.social" target="_blank" rel="noopener noreferrer" aria-label="Bluesky">🦋</a>
              <a href="https://www.instagram.com/trendorabayafric/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61584702823004" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/kingsley-george-006b1628b/?isSelfProfile=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://www.trendorabay.com" target="_blank" rel="noopener noreferrer" aria-label="Trendorabay"><img src="/weblogo.png" alt="Trendorabay" /></a>
            </div>
          </div>

          <div className="footer-links">
            <span className="footer-kicker">Explore</span>
            <a href="#nl-latest" onClick={(e) => { e.preventDefault(); scrollToSection('nl-latest'); }}>Latest Stories</a>
            <a href="#nl-magazines" onClick={(e) => { e.preventDefault(); scrollToSection('nl-magazines'); }}>Magazines</a>
            <a href="#nl-merchandise" onClick={(e) => { e.preventDefault(); scrollToSection('nl-merchandise'); }}>Merchandise</a>
            <a href="#nl-podcasts" onClick={(e) => { e.preventDefault(); scrollToSection('nl-podcasts'); }}>Podcasts</a>
            <Link to="/gallery">Gallery</Link>
          </div>

          <div className="footer-links">
            <span className="footer-kicker">Trendorabay</span>
            <Link to="/opportunities">Opportunities</Link>
            <Link to="/writers">Write for Us</Link>
            <Link to="/partner">Partners</Link>
            <Link to="/advertise">Advertise</Link>
            <Link to="/subscribe">Subscribe</Link>
            <Link to="/about">About Us</Link>
          </div>

          <div>
            <span className="footer-kicker">Get the app</span>
            <div className="footer-apps">
 
              <div className="app-badges">
                <a className="app-badge" href="#" target="_blank" rel="noopener noreferrer" aria-label="Download Trendorabay on Google Play">
                  <span className="app-badge-icon">▶</span>
                  <span><small>GET IT ON</small><strong>Google Play</strong></span>
                </a>
                <a className="app-badge" href="#" target="_blank" rel="noopener noreferrer" aria-label="Download Trendorabay on the App Store">
                  <span className="app-badge-icon"></span>
                  <span><small>DOWNLOAD ON THE</small><strong>App Store</strong></span>
                </a>
              </div>
            </div>


          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>&copy; {currentYear} Trendorabay. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
