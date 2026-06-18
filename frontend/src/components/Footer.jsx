import { Link } from 'react-router-dom';
import './styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'Contact', path: '/contact' },
    { name: 'Write for Us', path: '/write-for-us' },
    { name: 'FAQs', path: '/faq' },
    { name: 'Subscribe', path: '/subscribe' },
    { name: 'Community Hub', path: '/community' },
    { name: 'Events', path: '/community/events' },
    { name: 'Contributors', path: '/community/contributors' },
    { name: 'Stories', path: '/stories' },
    { name: 'Podcast', path: '/podcast' },
    { name: 'Donate', path: '/donate' },
    { name: 'Merchandise', path: '/merchandise' },
    { name: 'Gift Cards', path: '/gift-cards' },
    { name: 'Cart', path: '/cart' },
  ];

  const aboutLinks = [
    { name: 'Advertise', path: '/advertise' },
    { name: 'Support', path: '/contact' },
    { name: 'Shipping & Returns', path: '/shipping' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
  ];

  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="container">
          {/* Adinkra Pattern Divider */}
          <div className="adinkra-divider"></div>

          {/* Footer Grid */}
          <div className="footer-grid">
            {/* Fashion & Style Magazine Column */}
            <div className="footer-col fashion-col">
              <div className="fashion-magazine">
                <Link to="/magazines/2" className="magazine-link">
                  <img 
                    src="/assets/fashion.jpeg" 
                    alt="Fashion & Style Magazine" 
                    className="fashion-magazine-image"
                  />
                </Link>
                <Link to="/magazines/1" className="magazine-link">
                  <img 
                    src="/assets/Tech.jpeg" 
                    alt="Tech Magazine" 
                    className="fashion-magazine-image"
                  />
                </Link>
              </div>
            </div>

            {/* Footer Links - 3 per row */}
            <div className="footer-col footer-buttons-col">
              <div className="footer-buttons-grid">
                {footerLinks.map((link, index) => (
                  <Link key={index} to={link.path} className="footer-btn">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container">
          <div className="bottom-bar-content">
            <p className="copyright">
              &copy; {currentYear} Trendorabay Magazine. All rights reserved.
            </p>
            <div className="company-links-horizontal">
              {aboutLinks.map((link, index) => (
                <Link key={index} to={link.path} className="company-link-item">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;