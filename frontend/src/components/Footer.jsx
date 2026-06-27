import { Link } from 'react-router-dom';
import './styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const column1Links = [
    { name: 'Contact', path: '/contact' },
    { name: 'Write for Us', path: '/write-for-us' },
    { name: 'FAQs', path: '/faq' },
  ];

  const column2Links = [
    { name: 'Subscribe', path: '/subscribe' },
    { name: 'Community Hub', path: '/community' },
    { name: 'Events', path: '/community/events' },
  ];

  const column3Links = [
    { name: 'Contributors', path: '/community/contributors' },
    { name: 'Stories', path: '/stories' },
    { name: 'Podcast', path: '/podcast' },
  ];

  const column4Links = [
    { name: 'Donate', path: '/donate' },
    { name: 'Merchandise', path: '/merchandise' },
    { name: 'Gift Cards', path: '/gift-cards', disabled: true },
  ];

  const column5Links = [
    { name: 'Cart', path: '/cart' },
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

            {/* Footer Link Columns - 3 columns */}
            <div className="footer-links-grid">
              <div className="footer-col links-col">
                <ul className="footer-links">
                  {column1Links.map((link, index) => (
                    <li key={index}>
                      <Link to={link.path}>{link.name}</Link>
                    </li>
                  ))}
                  {column2Links.slice(0, 2).map((link, index) => (
                    <li key={index + 100}>
                      <Link to={link.path}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer-col links-col">
                <ul className="footer-links">
                  {column2Links.slice(2).map((link, index) => (
                    <li key={index + 200}>
                      <Link to={link.path}>{link.name}</Link>
                    </li>
                  ))}
                  {column3Links.map((link, index) => (
                    <li key={index + 300}>
                      <Link to={link.path}>{link.name}</Link>
                    </li>
                  ))}
                  {column4Links.slice(0, 1).map((link, index) => (
                    <li key={index + 400}>
                      <Link to={link.path}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer-col links-col">
                <ul className="footer-links">
                  {column4Links.slice(1).map((link, index) => (
                    <li key={index + 500}>
                      {link.disabled ? (
                        <span className="footer-link-disabled">{link.name}</span>
                      ) : (
                        <Link to={link.path}>{link.name}</Link>
                      )}
                    </li>
                  ))}
                  {column5Links.map((link, index) => (
                    <li key={index + 600}>
                      <Link to={link.path}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Download App Section */}
            <div className="footer-col download-app-col">
              <h4 className="download-app-title">Download Our App</h4>
              <div className="app-store-buttons">
                <a href="#" className="app-store-btn">
                  <div className="app-store-icon">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.609 1.814L13.792 12 3.609 22.186C3.304 22.045 3.097 21.736 3.097 21.359V2.641C3.097 2.264 3.304 1.955 3.609 1.814Z" fill="#2196F3"/>
                      <path d="M17.086 15.294L14.5 12.708L15.294 11.914L17.086 13.706L17.086 15.294Z" fill="#4CAF50"/>
                      <path d="M13.792 12L3.609 1.814L17.086 8.706L13.792 12Z" fill="#FFC107"/>
                      <path d="M3.609 22.186L13.792 12L17.086 15.294L3.609 22.186Z" fill="#F44336"/>
                    </svg>
                  </div>
                  <div className="app-store-text">
                    <span className="app-store-small">GET IT ON</span>
                    <span className="app-store-large">Google Play</span>
                  </div>
                </a>
                <a href="#" className="app-store-btn">
                  <div className="app-store-icon">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="#FFFFFF">
                      <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                    </svg>
                  </div>
                  <div className="app-store-text">
                    <span className="app-store-small">Download on the</span>
                    <span className="app-store-large">App Store</span>
                  </div>
                </a>
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
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;