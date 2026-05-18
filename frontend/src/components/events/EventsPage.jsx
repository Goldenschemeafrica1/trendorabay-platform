import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sample events data - in real app, this would come from your API
    const fetchEvents = () => {
      const sampleEvents = [
        {
          id: 1,
          title: "African Tech Summit 2024",
          description: "Join us for the biggest tech gathering in Africa, featuring startups, investors, and industry leaders from across the continent. Network with innovators, learn about emerging technologies, and discover investment opportunities.",
          date: "2024-03-15",
          time: "9:00 AM - 6:00 PM",
          location: "Nairobi, Kenya",
          type: "Hybrid",
          image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop",
          category: "Technology",
          attendees: 500,
          price: "Free",
          featured: true
        },
        {
          id: 2,
          title: "Fashion Week Africa",
          description: "Celebrating African fashion designers and showcasing the latest trends from across the continent. Experience runway shows, designer meet-and-greets, and exclusive fashion exhibitions.",
          date: "2024-03-22",
          time: "2:00 PM - 8:00 PM",
          location: "Lagos, Nigeria",
          type: "In-Person",
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop",
          category: "Fashion",
          attendees: 300,
          price: "$25",
          featured: false
        },
        {
          id: 3,
          title: "Wellness & Mindfulness Workshop",
          description: "A virtual workshop focusing on mental health, traditional African healing practices, and modern wellness techniques. Learn from experts and connect with a supportive community.",
          date: "2024-03-28",
          time: "10:00 AM - 1:00 PM",
          location: "Online",
          type: "Virtual",
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop",
          category: "Wellness",
          attendees: 150,
          price: "Free",
          featured: false
        },
        {
          id: 4,
          title: "African Literature Festival",
          description: "A celebration of African writers, poets, and storytellers. Join author readings, writing workshops, and panel discussions on the future of African literature.",
          date: "2024-04-05",
          time: "10:00 AM - 6:00 PM",
          location: "Cape Town, South Africa",
          type: "In-Person",
          image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&auto=format&fit=crop",
          category: "Culture",
          attendees: 400,
          price: "$15",
          featured: false
        },
        {
          id: 5,
          title: "Startup Pitch Competition",
          description: "Watch African startups pitch their innovative ideas to a panel of investors. Network with entrepreneurs and discover the next big thing in African innovation.",
          date: "2024-04-12",
          time: "1:00 PM - 5:00 PM",
          location: "Accra, Ghana",
          type: "Hybrid",
          image: "https://images.unsplash.com/photo-1553867546-3cfdd9c525f6?w=400&auto=format&fit=crop",
          category: "Business",
          attendees: 250,
          price: "Free",
          featured: false
        },
        {
          id: 6,
          title: "African Music Showcase",
          description: "Experience the diverse sounds of Africa with live performances from emerging and established artists across various genres including Afrobeats, Highlife, and traditional music.",
          date: "2024-04-18",
          time: "7:00 PM - 11:00 PM",
          location: "Johannesburg, South Africa",
          type: "In-Person",
          image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop",
          category: "Music",
          attendees: 600,
          price: "$30",
          featured: false
        },
        {
          id: 7,
          title: "Digital Marketing Masterclass",
          description: "Learn digital marketing strategies tailored for the African market. Cover social media, content marketing, and e-commerce best practices.",
          date: "2024-04-25",
          time: "2:00 PM - 6:00 PM",
          location: "Online",
          type: "Virtual",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop",
          category: "Technology",
          attendees: 200,
          price: "$20",
          featured: false
        },
        {
          id: 8,
          title: "African Cuisine Food Festival",
          description: "Celebrate the rich culinary heritage of Africa with cooking demonstrations, food tastings, and cultural performances from across the continent.",
          date: "2024-05-02",
          time: "11:00 AM - 9:00 PM",
          location: "Dakar, Senegal",
          type: "In-Person",
          image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop",
          category: "Culture",
          attendees: 800,
          price: "$35",
          featured: false
        },
        {
          id: 9,
          title: "Women in Leadership Conference",
          description: "Empowering women leaders across Africa with inspiring talks, networking opportunities, and leadership development workshops.",
          date: "2024-05-10",
          time: "9:00 AM - 5:00 PM",
          location: "Kigali, Rwanda",
          type: "Hybrid",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop",
          category: "Business",
          attendees: 350,
          price: "Free",
          featured: false
        },
        {
          id: 10,
          title: "Sustainable Agriculture Forum",
          description: "Exploring innovative farming techniques and sustainable agriculture practices that can transform food security across the African continent.",
          date: "2024-05-15",
          time: "10:00 AM - 4:00 PM",
          location: "Addis Ababa, Ethiopia",
          type: "Hybrid",
          image: "https://images.unsplash.com/photo-1590586154342-be35d2f6453f?w=400&auto=format&fit=crop",
          category: "Wellness",
          attendees: 180,
          price: "Free",
          featured: false
        }
      ];
      
      setEvents(sampleEvents);
      setLoading(false);
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
                {event.featured && (
                  <div className="featured-badge">Featured</div>
                )}
              </div>
              <div className="event-card-content">
                <span className="event-category-tag">{event.category}</span>
                <h5>{event.title}</h5>
                <p className="event-description">{event.description}</p>
                <div className="event-card-meta">
                  <span><i className="far fa-calendar"></i> {event.date}</span>
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
