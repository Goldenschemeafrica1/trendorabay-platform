import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import eventService from '../../services/eventService';
import './EventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventService.getEvents();
        let eventData = [];
        
        if (Array.isArray(response)) {
          eventData = response;
        } else if (response && Array.isArray(response.data)) {
          eventData = response.data;
        }
        
        // Transform data to match frontend expectations
        const transformed = eventData.map(event => ({
          ...event,
          type: event.event_type,
          date: event.event_date,
          time: event.event_time,
          image: event.image_url
        }));
        
        setEvents(transformed);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  // Sort events by date (upcoming first) and limit to 3 events
  const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 3);

  if (loading) {
    return (
      <div className="events-page-loader">
        <div className="african-loader">
          <span className="loader-text">📅</span>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>All Events</h1>
            <p className="page-subtitle">Discover events happening across Africa and online</p>
          </div>
        </div>



        {/* Events Grid */}
        <div className="events-grid">
          {sortedEvents.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-card-image">
                <img src={event.image} alt={event.title} />
                <div className="event-type-badge">{event.type}</div>
              </div>
              <div className="event-card-content">
                <span className="event-category-tag">{event.category}</span>
                <h5>{event.title}</h5>
                <p className="event-description">{event.description}</p>
                <div className="event-card-meta">
                  <span><i className="far fa-calendar"></i> {formatDate(event.date)}</span>
                  <span><i className="far fa-clock"></i> {event.time}</span>
                  <span><i className="fas fa-map-marker-alt"></i> {event.location}</span>
                  <span><i className="fas fa-users"></i> {event.attendees} attending</span>
                </div>
                <div className="event-card-footer">
                  <span className="event-price-tag">{event.price}</span>
                  <button className="event-register-btn">
                    Register <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* Load More */}
        {sortedEvents.length > 0 && sortedEvents.length >= 10 && (
          <div className="load-more-section">
            <button className="load-more-btn">
              Load More Events <i className="fas fa-arrow-down"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
