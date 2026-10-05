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
            <p className="footer-contact">0111773508 • 0787809638</p>

            <div className="footer-social" aria-label="Follow Trendorabay">
              <a href="https://x.com/Trendorabayke" target="_blank" rel="noopener noreferrer" aria-label="X">𝕏</a>
              <a href="https://bsky.app/profile/trendorabay.bsky.social" target="_blank" rel="noopener noreferrer" aria-label="Bluesky">bs</a>
              <a href="https://www.instagram.com/trendorabayafric/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a>
              <a href="https://www.facebook.com/profile.php?id=61584702823004" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
              <a href="https://www.trendorabay.com" target="_blank" rel="noopener noreferrer" aria-label="Trendorabay"><img src="/weblogo.png" alt="Trendorabay" /></a>
            </div>
          </div>

          <div className="footer-links">
            <span className="footer-kicker">Explore</span>
            <a href="#nl-latest" onClick={(e) => { e.preventDefault(); scrollToSection('nl-latest'); }}>Latest Stories</a>
            <a href="#nl-magazines" onClick={(e) => { e.preventDefault(); scrollToSection('nl-magazines'); }}>Magazines</a>
            <a href="#nl-merchandise" onClick={(e) => { e.preventDefault(); scrollToSection('nl-merchandise'); }}>Merchandise</a>
            <a href="#nl-podcasts" onClick={(e) => { e.preventDefault(); scrollToSection('nl-podcasts'); }}>Podcasts</a>
          </div>

          <div className="footer-links">
            <span className="footer-kicker">Trendorabay</span>
            <Link to="/opportunities">Opportunities</Link>
            <Link to="/writers">Write for Us</Link>
            <Link to="/advertise">Advertise</Link>
            <Link to="/subscribe">Subscribe</Link>
            <Link to="/about" onClick={(e) => e.preventDefault()}>About Us</Link>
            <a href="mailto:trendorabay@trendorabay.com">Contact Us</a>
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
