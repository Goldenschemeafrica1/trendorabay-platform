import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sample events data - in real app, this would come from your API
    const fetchEvents = () => {
      const sampleEvents = [
        {
          id: 1,
          title: "African Tech Summit 2024",
          description: "Join us for the biggest tech gathering in Africa, featuring startups, investors, and industry leaders from across the continent.",
          date: "2024-03-15",
          time: "9:00 AM - 6:00 PM",
          location: "Nairobi, Kenya",
          type: "Hybrid",
          image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&auto=format&fit=crop",
          category: "Technology",
          attendees: 500,
          price: "Free"
        },
        {
          id: 2,
          title: "Fashion Week Africa",
          description: "Celebrating African fashion designers and showcasing the latest trends from across the continent.",
          date: "2024-03-22",
          time: "2:00 PM - 8:00 PM",
          location: "Lagos, Nigeria",
          type: "In-Person",
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop",
          category: "Fashion",
          attendees: 300,
          price: "$25"
        },
        {
          id: 3,
          title: "Wellness & Mindfulness Workshop",
          description: "A virtual workshop focusing on mental health, traditional African healing practices, and modern wellness techniques.",
          date: "2024-03-28",
          time: "10:00 AM - 1:00 PM",
          location: "Online",
          type: "Virtual",
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop",
          category: "Wellness",
          attendees: 150,
          price: "Free"
        }
      ];
      
      setEvents(sampleEvents);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="events-loader">
        <div className="african-loader">
          <span className="loader-text">📅</span>
        </div>
      </div>
    );
  }

  return (
    <section className="events-community">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="header-content">
            <h2>
              <span className="accent">🎉</span> Events & Community
            </h2>
            <p className="section-subtitle">Connect with us • Learn together • Grow together</p>
          </div>
          <Link to="/events" className="view-all-link">
            View All Events <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        {/* Upcoming Featured Event */}
        {events.length > 0 && (
          <div className="featured-event">
            <div className="event-content">
              <div className="event-header">
                <span className="event-badge">Featured Event</span>
                <span className="event-type">{events[0].type}</span>
              </div>
              
              <h3 className="event-title">{events[0].title}</h3>
              <p className="event-description">{events[0].description}</p>
              
              <div className="event-details">
                <div className="event-datetime">
                  <span className="event-date">
                    <i className="far fa-calendar"></i> {events[0].date}
                  </span>
                  <span className="event-time">
                    <i className="far fa-clock"></i> {events[0].time}
                  </span>
                </div>
                
                <div className="event-location-info">
                  <span className="event-location">
                    <i className="fas fa-map-marker-alt"></i> {events[0].location}
                  </span>
                  <span className="event-attendees">
                    <i className="fas fa-users"></i> {events[0].attendees} attending
                  </span>
                </div>
              </div>

              <div className="event-actions">
                <button className="register-btn">
                  <i className="fas fa-ticket-alt"></i> Register Now
                </button>
                <span className="event-price">{events[0].price}</span>
              </div>
            </div>

            <div className="event-visual">
              <div className="event-image">
                <img 
                  src={events[0].image} 
                  alt={events[0].title}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&auto=format&fit=crop";
                  }}
                />
                <div className="event-overlay">
                  <span className="event-category">{events[0].category}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Community CTA */}
        <div className="community-cta">
          <div className="cta-content">
            <h4>Join Our Growing Community</h4>
            <p>Connect with like-minded individuals, attend exclusive events, and be part of Africa's digital revolution.</p>
            <div className="cta-actions">
              <button className="join-community-btn">
                <i className="fas fa-users"></i> Join Community
              </button>
              <Link to="/events" className="host-event-btn">
                <i className="fas fa-calendar-plus"></i> Host an Event
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;
