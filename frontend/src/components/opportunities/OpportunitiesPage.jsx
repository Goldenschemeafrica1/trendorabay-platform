import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import opportunityService from '../../services/opportunityService';
import './OpportunitiesPage.css';

const OpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeRegion, setActiveRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'Technology', label: 'Technology' },
    { id: 'Business', label: 'Business' },
    { id: 'Education', label: 'Education' },
    { id: 'Health', label: 'Health' },
    { id: 'Arts', label: 'Arts & Culture' },
    { id: 'Environment', label: 'Environment' },
    { id: 'Social Impact', label: 'Social Impact' }
  ];

  const regions = [
    { id: 'all', label: 'All' },
    { id: 'kenya', label: '🇰🇪 Kenya' },
    { id: 'africa', label: '🌍 Africa' },
    { id: 'international', label: '🌎 International' },
    { id: 'remote', label: 'Remote' }
  ];

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await opportunityService.getOpportunities({ limit: 50 });
        setOpportunities(response.data || []);
      } catch (error) {
        console.error('Failed to fetch opportunities:', error);
        // Fallback to empty array if API fails
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const getFilteredOpportunities = () => {
    const query = searchQuery.toLowerCase();
    return opportunities.filter(o => {
      const catMatch = activeCategory === 'all' || o.category === activeCategory;
      const regMatch = activeRegion === 'all' || 
        (activeRegion === 'remote' && o.remote === 1) ||
        (o.country && o.country.toLowerCase().includes(activeRegion)) ||
        (o.location && o.location.toLowerCase().includes(activeRegion));
      const searchMatch =
        !query ||
        [o.title, o.organization_name, o.short_description, o.description, o.category, o.location, o.country]
          .some(field => field && field.toLowerCase().includes(query));
      return catMatch && regMatch && searchMatch;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'No deadline';
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (error) {
      return 'No deadline';
    }
  };

  const getStatusInfo = (deadline) => {
    if (!deadline) return { statusClass: 'status-open', statusText: 'Open', isUrgent: false, isClosed: false, daysLeft: null };
    
    const deadlineDate = new Date(deadline);
    // Check if date is valid
    if (isNaN(deadlineDate.getTime())) return { statusClass: 'status-open', statusText: 'Open', isUrgent: false, isClosed: false, daysLeft: null };
    
    const today = new Date();
    const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
    const isUrgent = daysLeft <= 14 && daysLeft > 0;
    const isClosed = daysLeft < 0;

    let statusClass = 'status-open';
    let statusText = 'Open';
    if (isClosed) { statusClass = 'status-closed'; statusText = 'Closed'; }
    else if (isUrgent) { statusClass = 'status-closing'; statusText = 'Closing Soon'; }

    return { statusClass, statusText, isUrgent, isClosed, daysLeft };
  };

  const openModal = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOpportunity(null);
  };

  if (loading) {
    return (
      <div className="events-page-loader">
        <div className="african-loader">
          <span className="loader-text">🌍</span>
        </div>
      </div>
    );
  }

  const filtered = getFilteredOpportunities();
  const catLabel = activeCategory === 'all' ? 'All categories' : categories.find(c => c.id === activeCategory)?.label || activeCategory;
  const regLabel = activeRegion === 'all' ? 'All regions' : regions.find(r => r.id === activeRegion)?.label || activeRegion;

  return (
    <div className="events-page">
      <div className="container">
        {/* Filter Section */}
        <section className="filter-section">
          <div className="filter-group">
            <div className="filter-label">Search</div>
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="filter-search"
            />
          </div>

          <div className="filter-group">
            <div className="filter-label">Category</div>
            <div className="filter-scroll">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`filter-chip ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-label">Region</div>
            <div className="filter-scroll">
              {regions.map(reg => (
                <button
                  key={reg.id}
                  className={`filter-chip ${activeRegion === reg.id ? 'active' : ''}`}
                  onClick={() => setActiveRegion(reg.id)}
                >
                  {reg.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Opportunities List */}
        <section className="opportunities-section">
          <div className="section-head">
            <h2>✦ {filtered.length} opportunit{filtered.length === 1 ? 'y' : 'ies'}</h2>
            <span className="meta">{catLabel} • {regLabel}</span>
          </div>

          {filtered.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No opportunities match your filters</h3>
              <p>Try adjusting your category or region selection.</p>
            </div>
          ) : (
            <div className="opp-grid">
              {filtered.map(opp => {
                const { statusClass, statusText, isUrgent, isClosed } = getStatusInfo(opp.deadline);
                return (
                  <article key={opp.id} className="opp-card" onClick={() => openModal(opp)}>
                    <span className="opp-type-badge">{opp.category || 'OPPORTUNITY'}</span>
                    <h3>{opp.title}</h3>
                    {opp.organization_name && <div className="opp-org">🏢 {opp.organization_name}</div>}
                    <p className="opp-desc">{opp.short_description || opp.description}</p>
                    <div className="opp-details">
                      {opp.location && <span>📍 <strong>{opp.location}</strong></span>}
                      {opp.country && <span>🌍 <strong>{opp.country}</strong></span>}
                      {opp.remote === 1 && <span>🏠 <strong>Remote</strong></span>}
                    </div>
                    <div className="opp-footer">
                      <span className={`deadline ${isUrgent ? 'urgent' : ''}`}>
                        ⏳ {isClosed ? 'Closed' : `Deadline: ${formatDate(opp.deadline)}`}{isUrgent && !isClosed ? ' • URGENT' : ''}
                      </span>
                      <span className={`status-badge ${statusClass}`}>{statusText}</span>
                    </div>
                    <div className="opp-actions">
                      {opp.application_url && (
                        <a href={opp.application_url} target="_blank" rel="noopener" className="apply-link" onClick={(e) => e.stopPropagation()}>
                          APPLY NOW →
                        </a>
                      )}
                      <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); openModal(opp); }}>
                        DETAILS
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Submit Section */}
        <section className="submit-section">
          {!showSubmitForm ? (
            <div className="submit-content">
              <span className="submit-badge">For organisations</span>
              <h2>Submit an<br />opportunity.</h2>
              <p>Are you an organisation, university, NGO, accelerator or event organiser? Share your opportunity with Africa's next generation. Our editorial team reviews and verifies every submission before publishing.</p>
              <div className="submit-features">
                <span className="submit-feature">✅ Editorial review</span>
                <span className="submit-feature">🔗 Direct to your application</span>
                <span className="submit-feature">📅 Deadline monitoring</span>
              </div>
              <button className="btn-primary" onClick={() => setShowSubmitForm(true)}>SUBMIT AN OPPORTUNITY →</button>
            </div>
          ) : (
            <form className="submit-form" onSubmit={(e) => { e.preventDefault(); alert('Thank you! Your opportunity has been submitted for editorial review.'); }}>
              <button className="btn-secondary" onClick={() => setShowSubmitForm(false)}>← BACK</button>
              <label>Opportunity title</label>
              <input type="text" placeholder="e.g. Africa Innovation Grant 2026" required />
              <label>Organisation</label>
              <input type="text" placeholder="Your organisation name" required />
              <label>Category</label>
              <select required>
                <option value="">Select category</option>
                <option value="JOB">Job</option>
                <option value="GRANT">Grant</option>
                <option value="SCHOLARSHIP">Scholarship</option>
                <option value="COMPETITION">Competition</option>
                <option value="FELLOWSHIP">Fellowship</option>
                <option value="EVENT">Event</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
              <label>Application link (official source)</label>
              <input type="url" placeholder="https://..." required />
              <label>Deadline</label>
              <input type="date" />
              <label>Short description</label>
              <textarea rows="2" placeholder="Brief summary of the opportunity..."></textarea>
              <button type="submit" className="btn-primary">SUBMIT FOR REVIEW →</button>
              <p className="submit-note">Our team verifies every opportunity against the official source before publishing.</p>
            </form>
          )}
        </section>
      </div>

      {/* Modal */}
      {showModal && selectedOpportunity && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-content">
              <span className="opp-type-badge">{selectedOpportunity.category || 'OPPORTUNITY'}</span>
              <h2>{selectedOpportunity.title}</h2>
              {selectedOpportunity.organization_name && <div className="modal-org">🏢 {selectedOpportunity.organization_name}</div>}
              {(() => {
                const { statusClass, statusText } = getStatusInfo(selectedOpportunity.deadline);
                return <span className={`status-badge ${statusClass}`}>{statusText}</span>;
              })()}
              <p className="modal-desc">{selectedOpportunity.description}</p>
              {selectedOpportunity.deadline && <div className="modal-detail-row"><strong>Deadline</strong><span>{formatDate(selectedOpportunity.deadline)}</span></div>}
              {selectedOpportunity.location && <div className="modal-detail-row"><strong>Location</strong><span>{selectedOpportunity.location}</span></div>}
              {selectedOpportunity.country && <div className="modal-detail-row"><strong>Country</strong><span>{selectedOpportunity.country}</span></div>}
              {selectedOpportunity.remote === 1 && <div className="modal-detail-row"><strong>Remote</strong><span>Yes</span></div>}
              {selectedOpportunity.eligibility && <div className="modal-detail-row"><strong>Eligibility</strong><span>{selectedOpportunity.eligibility}</span></div>}
              {selectedOpportunity.requirements && <div className="modal-detail-row"><strong>Requirements</strong><span>{selectedOpportunity.requirements}</span></div>}
              {selectedOpportunity.benefits && <div className="modal-detail-row"><strong>Benefits</strong><span>{selectedOpportunity.benefits}</span></div>}
              {selectedOpportunity.application_instructions && <div className="modal-detail-row"><strong>Application Instructions</strong><span>{selectedOpportunity.application_instructions}</span></div>}
              {selectedOpportunity.category && <div className="modal-detail-row"><strong>Category</strong><span>{selectedOpportunity.category}</span></div>}
              <div className="modal-detail-row"><strong>Status</strong><span>{selectedOpportunity.status || 'Open'}</span></div>
              <div className="modal-actions">
                {selectedOpportunity.application_url && (
                  <a href={selectedOpportunity.application_url} target="_blank" rel="noopener" className="modal-apply">
                    APPLY ON OFFICIAL SITE →
                  </a>
                )}
                <button className="btn-secondary" onClick={closeModal}>CLOSE</button>
              </div>
              <p className="modal-note">Trendorabay redirects you to the original organisation's application page. We do not handle applications directly.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunitiesPage;