import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Events.css';

const Events = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sample opportunities data - in real app, this would come from your API
    const fetchOpportunities = () => {
      const sampleOpportunities = [
        {
          id: 1,
          tag: "GRANT",
          title: "Startup Growth Fund",
          meta: "For early-stage African founders • Deadline: Coming soon"
        },
        {
          id: 2,
          tag: "JOB",
          title: "Product Designer",
          meta: "Technology • Nairobi • Full-time"
        },
        {
          id: 3,
          tag: "EVENT",
          title: "Africa Innovation Summit",
          meta: "Founders & creators • Registration open"
        },
        {
          id: 4,
          tag: "SCHOLARSHIP",
          title: "Tech Education Scholarship",
          meta: "For African students • KSH 500,000 award"
        },
        {
          id: 5,
          tag: "COMPETITION",
          title: "African Startup Challenge",
          meta: "Pitch competition • KSH 1M prize pool"
        },
        {
          id: 6,
          tag: "FELLOWSHIP",
          title: "Media Fellowship Program",
          meta: "Journalism training • 6-month program"
        }
      ];

      setOpportunities(sampleOpportunities);
      setLoading(false);
    };

    fetchOpportunities();
  }, []);

  if (loading) {
    return (
      <div className="events-loader">
        <div className="african-loader">
          <span className="loader-text">�</span>
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
              <span className="accent">💼</span> Opportunities
            </h2>
            <p className="section-subtitle">Funding • Jobs • Grants • Scholarships • Events</p>
          </div>
          <Link to="/events" className="view-all-link">
            See All Opportunities <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        {/* Opportunities Grid */}
        <div className="opportunities-grid">
          {opportunities.map((opp) => (
            <div key={opp.id} className="opportunity-card">
              <span className="opportunity-tag">{opp.tag}</span>
              <h4 className="opportunity-title">{opp.title}</h4>
              <p className="opportunity-meta">{opp.meta}</p>
            </div>
          ))}
        </div>

        {/* Community CTA */}
        <div className="community-cta">
          <div className="cta-content">
            <h4>Discover More Opportunities</h4>
            <p>Stay updated with the latest funding, jobs, grants, scholarships, and events across Africa.</p>
            <div className="cta-actions">
              <button className="join-community-btn">
                <i className="fas fa-bell"></i> Get Notifications
              </button>
              <Link to="/events" className="host-event-btn">
                <i className="fas fa-plus"></i> Submit Opportunity
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;
