import React from 'react';

const CommunityEvents = ({ events }) => {
  return (
    <div className="events-section">
      <h2>Events</h2>
      {events.length === 0 ? (
        <p className="empty-state">No upcoming events</p>
      ) : (
        <div className="events-grid">
          {events.map((event, idx) => (
            <div key={idx} className="event-card">
              <div className="event-date">
                <span className="event-day">{event.day}</span>
                <span className="event-month">{event.month}</span>
              </div>
              <div className="event-info">
                <h4>{event.title}</h4>
                <p className="event-venue">{event.venue}</p>
                <p className="event-attendees">{event.spots}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityEvents;
