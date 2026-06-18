import { Link } from 'react-router-dom';
import './styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const column1Links = [
    { name: 'Contact', path: '/contact' },
    { name: 'Write for Us', path: '/write-for-us' },
    { name: 'FAQs', path: '/faq' },
    { name: 'Subscribe', path: '/subscribe' },
  ];

  const column2Links = [
    { name: 'Community Hub', path: '/community' },
    { name: 'Events', path: '/community/events' },
    { name: 'Contributors', path: '/community/contributors' },
    { name: 'Stories', path: '/stories' },
  ];

  const column3Links = [
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

            {/* Footer Link Columns */}
            <div className="footer-col links-col">
              <ul className="footer-links">
                {column1Links.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col links-col">
              <ul className="footer-links">
                {column2Links.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col links-col">
              <ul className="footer-links">
                {column3Links.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path}>{link.name}</Link>
                  </li>
                ))}
              </ul>
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