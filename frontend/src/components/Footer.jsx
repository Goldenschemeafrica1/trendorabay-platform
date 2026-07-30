import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './styles/Footer.css';
import magazineService from '../services/magazineService';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [featuredMagazines, setFeaturedMagazines] = useState([]);

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        const data = await magazineService.getMagazines();
        // Get first 2 magazines for footer display
        setFeaturedMagazines(data.slice(0, 2));
      } catch (error) {
        console.error('Error fetching magazines for footer:', error);
      }
    };
    fetchMagazines();
  }, []);

  const column1Links = [
    { name: 'About', path: '/about' },
    { name: 'Write for Us', path: '/write-for-us' },
    { name: 'FAQs', path: '/faq' },
    { name: 'Magazines', path: '/magazines' },
    { name: 'Gallery', path: '/gallery' },
  ];

  const column2Links = [
    { name: 'Subscribe', path: '/subscribe' },
    { name: 'Events', path: '/events' },
    { name: 'Partner With Us', path: '/partner' },
    { name: 'Advertise With Us', path: '/advertise' },
  ];

  const column3Links = [
    { name: 'Store', path: '/store' },
    { name: 'Contributors', path: '/community/contributors' },
    { name: 'Stories', path: '/stories' },
    { name: 'Podcast', path: '/podcast' },
  ];

  const socialLinks = [
    { name: 'Instagram', url: 'https://www.instagram.com/trendorabayafric/', icon: 'instagram' },
    { name: 'X', url: 'https://x.com/Trendorabayke', icon: 'x' },
    { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61584702823004', icon: 'facebook' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@trendorabaymagazine?_r=1&_d=ej0f8641bm2fhb&sec_uid=MS4wLjABAAAAfDEoN1XzpckKAFkuiltY05G8q7Z606uDnm3sW1LGHZ1oSOkTCbPp_uyibP7CNwAt&share_author_id=7211849972202669062&sharer_language=en&source=h5_m&u_code=ej0f8glc7gj7de&timestamp=1784579452&user_id=7473524064511722497&sec_user_id=MS4wLjABAAAAZj_5UqKfgOLH-iSg2OtG1gEt0Nb1HT9m0k6QPHGgyLzU7HDywc-W-tQdInS3n8oM&utm_source=copy&utm_campaign=client_share&utm_medium=android&share_iid=7527027233584858936&share_link_id=cb73ee0f-b15b-443d-81f5-312144ae6059&share_app_id=1233&ugbiz_name=ACCOUNT&ug_btm=b6880%2Cb5836&social_share_type=5&enable_checksum=1', icon: 'tiktok' },
    { name: 'Bluesky', url: 'https://bsky.app/profile/trendorabay.bsky.social', icon: 'bluesky' },
    { name: 'Trendorabay', url: 'https://trendorabay.com', icon: 'globe' },
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
                {featuredMagazines.length > 0 ? (
                  featuredMagazines.map((magazine) => (
                    <Link key={magazine.id} to={`/magazines/${magazine.slug}`} className="magazine-link">
                      <img 
                        src={magazine.coverImage} 
                        alt={magazine.title} 
                        className="fashion-magazine-image"
                      />
                    </Link>
                  ))
                ) : (
                  <>
                    <Link to="/magazines" className="magazine-link">
                      <img 
                        src="/assets/fashion.jpeg" 
                        alt="Fashion & Style Magazine" 
                        className="fashion-magazine-image"
                      />
                    </Link>
                    <Link to="/magazines" className="magazine-link">
                      <img 
                        src="/assets/Tech.jpeg" 
                        alt="Tech Magazine" 
                        className="fashion-magazine-image"
                      />
                    </Link>
                  </>
                )}
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
                </ul>
              </div>

              <div className="footer-col links-col">
                <ul className="footer-links">
                  {column2Links.map((link, index) => (
                    <li key={index + 100}>
                      <Link to={link.path}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer-col links-col">
                <ul className="footer-links">
                  {column3Links.map((link, index) => (
                    <li key={index + 200}>
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
            <div className="social-section">
              <h4 className="social-title">Follow Us</h4>
              <div className="social-links">
                {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label={social.name}
                >
                  {social.icon === 'instagram' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="url(#instagram-gradient)">
                      <defs>
                        <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#F58529" />
                          <stop offset="25%" stopColor="#DD2A7B" />
                          <stop offset="50%" stopColor="#8134AF" />
                          <stop offset="75%" stopColor="#515BD4" />
                        </linearGradient>
                      </defs>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  )}
                  {social.icon === 'x' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#000000">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  )}
                  {social.icon === 'facebook' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  )}
                  {social.icon === 'tiktok' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.942-4.31V8.687a4.794 4.794 0 0 1 3.687 2.364l2.878-2.066a8.013 8.013 0 0 0-2.98-2.299z"/>
                    </svg>
                  )}
                  {social.icon === 'bluesky' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#0085FF">
                      <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.31.378 5.31s0 .557.462 1.073c.384.428 1.09 1.049 1.09 1.049s.66.628 1.61.912c1.677.5 4.038.748 4.038.748s-.023.018-.335.162c-.753.353-3.054 1.42-3.054 1.42S1.78 15.1 1.78 17.485c0 1.47.69 2.092 1.193 2.425.35.23 1.28.348 2.66.056 2.045-.438 4.927-2.466 6.367-3.68 1.44 1.214 4.322 3.242 6.367 3.68 1.38.292 2.31.174 2.66-.056.503-.333 1.193-.955 1.193-2.425 0-2.385-2.39-3.793-2.39-3.793s-2.3-1.067-3.054-1.42c-.312-.144-.335-.162-.335-.162s2.361-.248 4.038-.748c.95-.284 1.61-.912 1.61-.912s.706-.621 1.09-1.049c.084-.094.462-1.073.462-1.073s.378-4.62.378-5.31c0-.688-.139-1.86-.902-2.203-.659-.299-1.664-.621-4.3 1.24C16.046 4.747 13.087 8.686 12 10.8z"/>
                    </svg>
                  )}
                  {social.icon === 'globe' && (
                    <img src="/logo.jpeg" alt="Trendorabay" className="social-logo-image" />
                  )}
                </a>
              ))}
            </div>
            </div>
            <div className="bottom-bar-links">
              <Link to="/contact">Contact</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/privacy">Privacy Policy</Link>
            </div>
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