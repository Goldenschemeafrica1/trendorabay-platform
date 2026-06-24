import React from 'react';
import './EventsPage.css';

const EventsPage = () => {
  const events = [
    {
      id: 1,
      title: 'Trendorabay Fashion Week 2024',
      date: 'March 15-17, 2024',
      location: 'Nairobi, Kenya',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
      description: 'Join us for the biggest fashion event in East Africa featuring top designers and models.',
      price: 'KES 5,000'
    },
    {
      id: 2,
      title: 'Creative Writing Workshop',
      date: 'April 5, 2024',
      location: 'Virtual Event',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop',
      description: 'Learn from published authors and improve your writing skills in this interactive workshop.',
      price: 'KES 2,500'
    },
    {
      id: 3,
      title: 'Photography Masterclass',
      date: 'April 20, 2024',
      location: 'Lagos, Nigeria',
      image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&h=400&fit=crop',
      description: 'Master the art of photography with professional photographers in this hands-on masterclass.',
      price: 'KES 7,500'
    }
  ];

  return (
    <div className="events-page">
      <div className="container">
        <div className="events-header">
          <h1>Events</h1>
          <p>Discover upcoming events, workshops, and gatherings</p>
        </div>
        <div className="events-grid">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-image">
                <img src={event.image} alt={event.title} />
              </div>
              <div className="event-content">
                <div className="event-date">{event.date}</div>
                <h3 className="event-title">{event.title}</h3>
                <div className="event-location">{event.location}</div>
                <p className="event-description">{event.description}</p>
                <div className="event-footer">
                  <span className="event-price">{event.price}</span>
                  <button className="event-button">Register</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
