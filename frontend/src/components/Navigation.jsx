import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  
  // Refs for dropdowns to handle click outside
  const dropdownRefs = {
    home: useRef(null),
    magazine: useRef(null),
    write: useRef(null),
    creators: useRef(null),
    business: useRef(null),
    events: useRef(null),
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutside = Object.keys(dropdownRefs).every(key => {
        return dropdownRefs[key].current && !dropdownRefs[key].current.contains(event.target);
      });
      
      if (isOutside) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dropdown
  const toggleDropdown = (dropdown) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdown);
    }
  };

  return (
    <nav className="main-navigation">
      <div className="nav-container">
        <div className="nav-menu">
          {/* Home Dropdown */}
          <div 
            className={`dropdown-container ${openDropdown === 'home' ? 'active' : ''}`}
            ref={dropdownRefs.home}
          >
            <button 
              className="dropdown-trigger"
              onClick={() => toggleDropdown('home')}
            >
              EXPLORE
            </button>
            <div className="dropdown-menu">
              <Link to="/stories/latest" className="dropdown-item">Latest Stories</Link>
              <Link to="/stories" className="dropdown-item">All Stories</Link>
              <Link to="/community/contributors" className="dropdown-item">Contributors</Link>
              <Link to="/community" className="dropdown-item">Community</Link>
              <Link to="/about" className="dropdown-item">About</Link>
            </div>
          </div>

          {/* Magazine Dropdown */}
          <div 
            className={`dropdown-container ${openDropdown === 'magazine' ? 'active' : ''}`}
            ref={dropdownRefs.magazine}
          >
            <button 
              className="dropdown-trigger"
              onClick={() => toggleDropdown('magazine')}
            >
              Magazine
            </button>
            <div className="dropdown-menu">
              <Link to="/magazines" className="dropdown-item">Magazines</Link>
              <Link to="/stories/latest" className="dropdown-item">Latest Stories</Link>
              <Link to="/stories" className="dropdown-item">All Stories</Link>
              <Link to="/community/contributors" className="dropdown-item">Contributors</Link>
            </div>
          </div>

          {/* Write Dropdown */}
          <div 
            className={`dropdown-container ${openDropdown === 'write' ? 'active' : ''}`}
            ref={dropdownRefs.write}
          >
            <button 
              className="dropdown-trigger"
              onClick={() => toggleDropdown('write')}
            >
              Get Featured
            </button>
            <div className="dropdown-menu">
              <Link to="/write" className="dropdown-item">Start Writing</Link>
              <Link to="/write-for-us" className="dropdown-item">Submit a Story</Link>
              <Link to="/community/contributors" className="dropdown-item">Contributors</Link>
              <Link to="/community" className="dropdown-item">Join Community</Link>
            </div>
          </div>

          {/* Creators Hub Dropdown */}
          <div 
            className={`dropdown-container ${openDropdown === 'creators' ? 'active' : ''}`}
            ref={dropdownRefs.creators}
          >
            <button 
              className="dropdown-trigger"
              onClick={() => toggleDropdown('creators')}
            >
              Creators Hub
            </button>
            <div className="dropdown-menu">
              <Link to="/community" className="dropdown-item">Join Community</Link>
              <Link to="/community/contributors" className="dropdown-item">Contributors</Link>
              <Link to="/community/events" className="dropdown-item">Events</Link>
              <Link to="/write" className="dropdown-item">Write For Us</Link>
            </div>
          </div>

          {/* Business Hub Dropdown */}
          <div 
            className={`dropdown-container ${openDropdown === 'business' ? 'active' : ''}`}
            ref={dropdownRefs.business}
          >
            <button 
              className="dropdown-trigger"
              onClick={() => toggleDropdown('business')}
            >
              Business Hub
            </button>
            <div className="dropdown-menu">
              <Link to="/about" className="dropdown-item">About Us</Link>
              <Link to="/mission" className="dropdown-item">Mission</Link>
              <Link to="/contact" className="dropdown-item">Contact</Link>
              <Link to="/write-for-us" className="dropdown-item">Partner With Us</Link>
              <Link to="/contact" className="dropdown-item">Advertise With Us</Link>
            </div>
          </div>

          {/* Podcasts Link */}
          <Link to="/podcast" className="nav-link">
            Podcasts
          </Link>

          {/* Events Dropdown */}
          <div 
            className={`dropdown-container ${openDropdown === 'events' ? 'active' : ''}`}
            ref={dropdownRefs.events}
          >
            <button 
              className="dropdown-trigger"
              onClick={() => toggleDropdown('events')}
            >
              Events
            </button>
            <div className="dropdown-menu">
              <Link to="/events" className="dropdown-item">Events</Link>
              <Link to="/community/events" className="dropdown-item">Community Events</Link>
              <Link to="/community" className="dropdown-item">Community Hub</Link>
              <Link to="/contact" className="dropdown-item">Contact for Tickets</Link>
            </div>
          </div>

          {/* Store Link */}
          <Link to="/store" className="nav-link">
            Store
          </Link>
        </div>

              </div>
    </nav>
  );
};

export default Navigation;
