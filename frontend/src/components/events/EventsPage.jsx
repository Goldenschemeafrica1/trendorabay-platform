import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EventsPage.css';

const EventsPage = () => {
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
    { id: 'jobs', label: 'Jobs' },
    { id: 'funding', label: 'Funding' },
    { id: 'grants', label: 'Grants' },
    { id: 'scholarships', label: 'Scholarships' },
    { id: 'competitions', label: 'Competitions' },
    { id: 'fellowships', label: 'Fellowships' },
    { id: 'events', label: 'Events' },
    { id: 'internships', label: 'Internships' }
  ];

  const regions = [
    { id: 'all', label: 'All' },
    { id: 'kenya', label: '🇰🇪 Kenya' },
    { id: 'africa', label: '🌍 Africa' },
    { id: 'international', label: '🌎 International' },
    { id: 'remote', label: 'Remote' },
    { id: 'undergraduate', label: 'Undergraduate' },
    { id: 'postgraduate', label: 'Postgraduate' },
    { id: 'youth', label: 'Youth' },
    { id: 'women', label: 'Women' },
    { id: 'entrepreneurs', label: 'Entrepreneurs' },
    { id: 'startups', label: 'Startups' },
    { id: 'creatives', label: 'Creatives' },
    { id: 'farmers', label: 'Farmers' },
    { id: 'students', label: 'Students' },
    { id: 'ngos', label: 'NGOs' },
    { id: 'developers', label: 'Developers' },
    { id: 'journalists', label: 'Journalists' },
    { id: 'artists', label: 'Artists' }
  ];

  useEffect(() => {
    // Sample opportunities data - in real app, this would come from your API
    const fetchOpportunities = () => {
      const sampleOpportunities = [
        {
          id: 1,
          title: "Startup Growth Fund 2026",
          org: "African Development Bank",
          category: "funding",
          categoryLabel: "Funding",
          region: "africa",
          regionLabel: "🌍 Africa",
          type: "Grant",
          deadline: "2026-03-15",
          funding: "$50,000 – $250,000",
          eligibility: "Early-stage African startups",
          who: "Entrepreneurs, Startups",
          description: "A growth fund for early-stage African founders building scalable solutions in fintech, agritech, healthtech and clean energy.",
          requirements: "Registered company in an African country, MVP or traction, team of 2+",
          link: "https://www.afdb.org/en/topics-and-sectors/initiatives-partnerships/",
          source: "African Development Bank",
          published: "2026-01-10",
          verified: "2026-01-12",
          status: "Open"
        },
        {
          id: 2,
          title: "Product Designer",
          org: "TechBridge Nairobi",
          category: "jobs",
          categoryLabel: "Jobs",
          region: "kenya",
          regionLabel: "🇰🇪 Kenya",
          type: "Full-time",
          deadline: "2026-02-28",
          funding: "KES 180,000 – 250,000 / month",
          eligibility: "3+ years experience",
          who: "Developers, Creatives",
          description: "Join a fast-growing Nairobi-based product team building digital tools for African SMEs. Work on end-to-end product design.",
          requirements: "Portfolio, Figma proficiency, experience with design systems",
          link: "https://techbridge.co.ke/careers",
          source: "TechBridge Nairobi",
          published: "2026-01-05",
          verified: "2026-01-07",
          status: "Closing Soon"
        },
        {
          id: 3,
          title: "Africa Innovation Summit 2026",
          org: "Africa Innovation Foundation",
          category: "events",
          categoryLabel: "Events",
          region: "africa",
          regionLabel: "🌍 Africa",
          type: "Conference",
          deadline: "2026-04-01",
          funding: "Free (registration required)",
          eligibility: "Open to all",
          who: "Entrepreneurs, Creatives, Students, Developers",
          description: "Three days of keynotes, workshops and networking with Africa's top innovators, founders and investors. Kigali, Rwanda.",
          requirements: "Registration, travel to Kigali",
          link: "https://africainnovationsummit.com/register",
          source: "Africa Innovation Foundation",
          published: "2026-01-15",
          verified: "2026-01-16",
          status: "Open"
        },
        {
          id: 4,
          title: "Women in Tech Scholarship",
          org: "Mastercard Foundation",
          category: "scholarships",
          categoryLabel: "Scholarships",
          region: "africa",
          regionLabel: "🌍 Africa",
          type: "Full scholarship",
          deadline: "2026-03-30",
          funding: "Full tuition + stipend",
          eligibility: "Women, Undergraduate/Postgraduate",
          who: "Women, Students, Undergraduate, Postgraduate",
          description: "Full scholarship for young African women pursuing degrees in computer science, engineering or data science at partner universities.",
          requirements: "Academic transcripts, recommendation letters, proof of admission",
          link: "https://mastercardfdn.org/scholarships",
          source: "Mastercard Foundation",
          published: "2026-01-02",
          verified: "2026-01-04",
          status: "Open"
        },
        {
          id: 5,
          title: "AgriTech Innovation Challenge",
          org: "AgriHub Kenya",
          category: "competitions",
          categoryLabel: "Competitions",
          region: "kenya",
          regionLabel: "🇰🇪 Kenya",
          type: "Competition",
          deadline: "2026-02-20",
          funding: "KES 1,000,000 prize",
          eligibility: "Farmers, Startups, Students",
          who: "Farmers, Startups, Students, Entrepreneurs",
          description: "Pitch your agritech solution to a panel of judges. Win funding, mentorship and access to AgriHub's network of farmers and partners.",
          requirements: "Idea or prototype, team of 2–5, Kenyan resident",
          link: "https://agrihub.co.ke/challenge",
          source: "AgriHub Kenya",
          published: "2026-01-08",
          verified: "2026-01-09",
          status: "Closing Soon"
        },
        {
          id: 6,
          title: "Remote Junior Developer Internship",
          org: "Global Dev Collective",
          category: "internships",
          categoryLabel: "Internships",
          region: "remote",
          regionLabel: "Remote",
          type: "Internship",
          deadline: "2026-03-10",
          funding: "$800 / month stipend",
          eligibility: "Students, Youth, Developers",
          who: "Students, Youth, Developers",
          description: "A 6-month remote internship for aspiring developers. Work on real projects with a global team. Mentorship and training provided.",
          requirements: "Basic knowledge of JavaScript or Python, reliable internet, laptop",
          link: "https://globaldevcollective.org/internships",
          source: "Global Dev Collective",
          published: "2026-01-18",
          verified: "2026-01-19",
          status: "Open"
        }
      ];

      setOpportunities(sampleOpportunities);
      setLoading(false);
    };

    fetchOpportunities();
  }, []);

  const getFilteredOpportunities = () => {
    const query = searchQuery.toLowerCase();
    return opportunities.filter(o => {
      const catMatch = activeCategory === 'all' || o.category === activeCategory;
      const regMatch = activeRegion === 'all' || o.region === activeRegion;
      const searchMatch =
        !query ||
        [o.title, o.org, o.description, o.who, o.categoryLabel, o.regionLabel, o.type]
          .some(field => field && field.toLowerCase().includes(query));
      return catMatch && regMatch && searchMatch;
    });
  };

  const getStatusInfo = (deadline) => {
    const deadlineDate = new Date(deadline);
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
            <div className="filter-label">Region / Eligibility</div>
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
                    <span className="opp-type-badge">{opp.categoryLabel} • {opp.type}</span>
                    <h3>{opp.title}</h3>
                    <div className="opp-org">🏢 {opp.org}</div>
                    <p className="opp-desc">{opp.description}</p>
                    <div className="opp-details">
                      <span>📍 <strong>{opp.regionLabel}</strong></span>
                      <span>💰 <strong>{opp.funding}</strong></span>
                      <span>🎯 <strong>{opp.who}</strong></span>
                    </div>
                    <div className="opp-footer">
                      <span className={`deadline ${isUrgent ? 'urgent' : ''}`}>
                        ⏳ {isClosed ? 'Closed' : `Deadline: ${opp.deadline}`}{isUrgent && !isClosed ? ' • URGENT' : ''}
                      </span>
                      <span className={`status-badge ${statusClass}`}>{statusText}</span>
                    </div>
                    <div className="opp-actions">
                      <a href={opp.link} target="_blank" rel="noopener" className="apply-link" onClick={(e) => e.stopPropagation()}>
                        APPLY NOW →
                      </a>
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
                <option>Job</option>
                <option>Grant</option>
                <option>Scholarship</option>
                <option>Competition</option>
                <option>Fellowship</option>
                <option>Event</option>
                <option>Funding programme</option>
                <option>Internship</option>
                <option>Training</option>
                <option>Accelerator</option>
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
              <span className="opp-type-badge">{selectedOpportunity.categoryLabel} • {selectedOpportunity.type}</span>
              <h2>{selectedOpportunity.title}</h2>
              <div className="modal-org">🏢 {selectedOpportunity.org}</div>
              {(() => {
                const { statusClass, statusText } = getStatusInfo(selectedOpportunity.deadline);
                return <span className={`status-badge ${statusClass}`}>{statusText}</span>;
              })()}
              <p className="modal-desc">{selectedOpportunity.description}</p>
              <div className="modal-detail-row"><strong>Deadline</strong><span>{selectedOpportunity.deadline}</span></div>
              <div className="modal-detail-row"><strong>Funding / Salary</strong><span>{selectedOpportunity.funding}</span></div>
              <div className="modal-detail-row"><strong>Eligibility</strong><span>{selectedOpportunity.eligibility}</span></div>
              <div className="modal-detail-row"><strong>Who can apply</strong><span>{selectedOpportunity.who}</span></div>
              <div className="modal-detail-row"><strong>Region</strong><span>{selectedOpportunity.regionLabel}</span></div>
              <div className="modal-detail-row"><strong>Requirements</strong><span>{selectedOpportunity.requirements}</span></div>
              <div className="modal-detail-row"><strong>Official source</strong><span>{selectedOpportunity.source}</span></div>
              <div className="modal-detail-row"><strong>Published</strong><span>{selectedOpportunity.published} • Verified: {selectedOpportunity.verified}</span></div>
              <div className="modal-actions">
                <a href={selectedOpportunity.link} target="_blank" rel="noopener" className="modal-apply">
                  APPLY ON OFFICIAL SITE →
                </a>
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

export default EventsPage;