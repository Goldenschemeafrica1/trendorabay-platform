import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import opportunityService from '../../services/opportunityService';
import './OpportunitiesPage.css';

const OpportunitiesPage = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [workTypes, setWorkTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [saved, setSaved] = useState(new Set());
  const [toast, setToast] = useState({ show: false, message: '' });
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState(['All', 'Jobs', 'Internships', 'Scholarships', 'Grants', 'Fellowships', 'Competitions', 'Events', 'Training', 'Courses', 'Volunteering']);
  const [formData, setFormData] = useState({
    title: '',
    organization_name: '',
    category: '',
    work_type: '',
    opportunity_type: 'free',
    application_url: '',
    deadline: '',
    short_description: '',
    description: '',
    location: '',
    country: '',
    remote: false,
    contact_email: '',
    contact_name: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const startTime = Date.now();
      try {
        const [oppResponse, workTypesResponse, categoriesResponse] = await Promise.all([
          opportunityService.getOpportunities({ limit: 50 }),
          opportunityService.getWorkTypes(),
          opportunityService.getCategories()
        ]);
        setOpportunities(oppResponse.data || []);
        const workTypes = workTypesResponse.data || [];
        const categories = categoriesResponse.data || [];
        setWorkTypes(workTypes);
        setCategories(categories);
        // Set filters from API response with 'All' prepended
        setFilters(['All', ...workTypes]);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setOpportunities([]);
        setWorkTypes([]);
        setCategories([]);
        // Fallback to default work types if API fails
        setFilters(['All', 'Jobs', 'Internships', 'Scholarships', 'Grants', 'Fellowships', 'Competitions', 'Events', 'Training', 'Courses', 'Volunteering']);
      } finally {
        // Ensure minimum loading time of 800ms
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, 800 - elapsed);
        setTimeout(() => setLoading(false), remainingTime);
      }
    };

    fetchData();
  }, []);

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 2200);
  };

  const toggleSave = (title) => {
    const newSaved = new Set(saved);
    if (newSaved.has(title)) {
      newSaved.delete(title);
      showToast('Removed from saved');
    } else {
      newSaved.add(title);
      showToast('Saved opportunity');
    }
    setSaved(newSaved);
  };

  const getTypeClass = (type) => {
    const typeLower = type?.toLowerCase() || '';
    if (typeLower === 'jobs' || typeLower === 'job') return 'job';
    if (typeLower === 'internships' || typeLower === 'internship') return 'internship';
    if (typeLower === 'scholarships' || typeLower === 'scholarship') return 'scholarship';
    if (typeLower === 'grants' || typeLower === 'grant') return 'grant';
    if (typeLower === 'fellowships' || typeLower === 'fellowship') return 'fellowship';
    if (typeLower === 'competitions' || typeLower === 'competition') return 'competition';
    if (typeLower === 'events' || typeLower === 'event') return 'event';
    if (typeLower === 'training') return 'training';
    if (typeLower === 'courses' || typeLower === 'course') return 'course';
    if (typeLower === 'volunteering' || typeLower === 'volunteer') return 'volunteering';
    return '';
  };

  const getFilteredOpportunities = () => {
    const query = searchQuery.toLowerCase().trim();
    return opportunities.filter(o => {
      // Filter by work type (Jobs, Internships, etc.)
      const matchesWorkType = activeFilter === 'All' ||
        o.work_type?.toLowerCase() === activeFilter.toLowerCase() ||
        o.category?.toLowerCase() === activeFilter.toLowerCase();

      // Filter by category (industry/sector)
      const matchesCategory = activeCategory === 'All' ||
        o.category === activeCategory;

      const haystack = (
        (o.title || '') + ' ' +
        (o.organization_name || '') + ' ' +
        (o.short_description || '') +
        (o.description || '') +
        (o.location || '') +
        (o.country || '')
      ).toLowerCase();

      const matchesQuery = !query || haystack.includes(query);
      return matchesWorkType && matchesCategory && matchesQuery;
    });
  };

  const scrollToListings = () => {
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpportunityClick = (opp) => {
    navigate(`/opportunities/${opp.id}`);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmitOpportunity = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Generate slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const opportunityData = {
        ...formData,
        slug,
        status: 'draft',
        featured: false,
        // Map work_type to category for backward compatibility
        category: formData.work_type || formData.category
      };

      await opportunityService.createOpportunity(opportunityData);
      showToast('Opportunity submitted successfully!');
      setShowSubmitForm(false);
      setFormData({
        title: '',
        organization_name: '',
        category: '',
        work_type: '',
        opportunity_type: 'free',
        application_url: '',
        deadline: '',
        short_description: '',
        description: '',
        location: '',
        country: '',
        remote: false,
        contact_email: '',
        contact_name: ''
      });

      // Refresh opportunities list
      const oppResponse = await opportunityService.getOpportunities({ limit: 50 });
      setOpportunities(oppResponse.data || []);
    } catch (error) {
      console.error('Error submitting opportunity:', error);
      showToast('Failed to submit opportunity. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = getFilteredOpportunities();

  if (loading) {
    return (
      <div className="opportunities-loading">
        <div className="loading-spinner"></div>
        <p>Loading opportunities...</p>
      </div>
    );
  }

  return (
    <main className="opportunities-page">
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">Opportunities</div>
            <h1>Find work. Fund ideas. <em>Build your future.</em></h1>
            <p>Jobs, internships, scholarships, grants, fellowships, competitions, events, training, courses and volunteering opportunities from across Africa's creative, agricultural, tech and business communities. Curated for creators, entrepreneurs and community members on Trendorabay.</p>
            <div className="hero-cta">
              <button className="dark-btn" onClick={scrollToListings}>Browse opportunities</button>
              <button className="light-btn" onClick={() => setShowSubmitForm(true)}>Post an opportunity</button>
            </div>
          </div>
          <div className="hero-art">
            <div className="tile ta"><img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=700&q=85" alt="Team working" /></div>
            <div className="tile tb"><img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=85" alt="Creator" /></div>
            <div className="tile tc"><img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=85" alt="Meeting" /></div>
          </div>
        </div>
      </section>

      {/* LISTINGS */}
      <section className="section" id="listings">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Browse</div>
            <h2>Open opportunities.</h2>
            <p>Filter by type, search by keyword, and apply directly. New listings added every week.</p>
          </div>

          {/* Work Type Filters */}
          <div className="filters">
            <span className="filter-label">Work Type:</span>
            {filters.map(filter => (
              <button
                key={filter}
                className={`filter ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Category Filters */}
          {categories.length > 0 && (
            <div className="filters category-filters">
              <span className="filter-label">Category:</span>
              <button
                className={`filter ${activeCategory === 'All' ? 'active' : ''}`}
                onClick={() => setActiveCategory('All')}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  className={`filter ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* Search */}
          <div className="search">
            <span style={{ paddingLeft: '13px' }}>⌕</span>
            <input
              placeholder="Search opportunities, organizations, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          {/* Grid */}
          <div className="opps-grid">
            {filtered.length === 0 ? (
              <div className="empty">
                <strong>No opportunities found.</strong>
                Try a different filter or search keyword.
              </div>
            ) : (
              filtered.map((opp, index) => {
                const isSaved = saved.has(opp.title);
                const typeLabel = opp.work_type || opp.category || 'Jobs';
                return (
                  <article
                    key={opp.id || index}
                    className="opp"
                    onClick={() => handleOpportunityClick(opp)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="opp-top">
                      <span className={`opp-type ${getTypeClass(typeLabel)}`}>{typeLabel}</span>
                      <button
                        className={`opp-close ${isSaved ? 'saved' : ''}`}
                        title="Save"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(opp.title);
                        }}
                      >
                        {isSaved ? '♥' : '♡'}
                      </button>
                    </div>
                    <h3>{opp.title}</h3>
                    <p className="opp-org">{opp.organization_name} • {opp.location || opp.country || 'Location'}</p>
                    <p className="opp-desc">{opp.short_description || opp.description}</p>
                    <div className="opp-meta">
                      <span>{opp.salary || 'Competitive'}</span>
                      {opp.remote === 1 && <span>Remote</span>}
                    </div>
                    <div className="opp-actions">
                      <button
                        className="opp-apply"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (opp.application_url) {
                            window.open(opp.application_url, '_blank');
                          } else {
                            showToast('Application started: ' + opp.title);
                          }
                        }}
                      >
                        Apply now
                      </button>
                      <button
                        className="opp-save"
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast('Share: ' + opp.title);
                        }}
                      >
                        ↗
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-banner">
            <div>
              <div className="eyebrow" style={{ color: '#aaa' }}>For organizations</div>
              <h2>Hiring or funding African creators?</h2>
              <p>Post your role, gig or grant on Trendorabay and reach thousands of creators, entrepreneurs and community members across the continent.</p>
            </div>
            <button className="white-btn" onClick={() => setShowSubmitForm(true)}>Post an opportunity →</button>
          </div>
        </div>
      </section>

      {/* SUBMIT FORM MODAL */}
      {showSubmitForm && (
        <div className="submit-modal-overlay" onClick={() => !submitting && setShowSubmitForm(false)}>
          <div className="submit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="submit-modal-header">
              <h2>Post an Opportunity</h2>
              <button
                className="close-modal"
                onClick={() => !submitting && setShowSubmitForm(false)}
                disabled={submitting}
              >
                ✕
              </button>
            </div>
            <form className="submit-opportunity-form" onSubmit={handleSubmitOpportunity}>
              <div className="form-row">
                <div className="form-group">
                  <label>Opportunity Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Africa Innovation Grant 2026"
                    required
                    disabled={submitting}
                  />
                </div>
                <div className="form-group">
                  <label>Organization Name *</label>
                  <input
                    type="text"
                    name="organization_name"
                    value={formData.organization_name}
                    onChange={handleInputChange}
                    placeholder="Your organization name"
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Work Type *</label>
                  <select
                    name="work_type"
                    value={formData.work_type}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                  >
                    <option value="">Select work type</option>
                    <option value="Jobs">Jobs</option>
                    <option value="Internships">Internships</option>
                    <option value="Scholarships">Scholarships</option>
                    <option value="Grants">Grants</option>
                    <option value="Fellowships">Fellowships</option>
                    <option value="Competitions">Competitions</option>
                    <option value="Events">Events</option>
                    <option value="Training">Training</option>
                    <option value="Courses">Courses</option>
                    <option value="Volunteering">Volunteering</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Opportunity Type</label>
                  <select
                    name="opportunity_type"
                    value={formData.opportunity_type}
                    onChange={handleInputChange}
                    disabled={submitting}
                  >
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Application URL *</label>
                  <input
                    type="url"
                    name="application_url"
                    value={formData.application_url}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    required
                    disabled={submitting}
                  />
                </div>
                <div className="form-group">
                  <label>Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City or region"
                    disabled={submitting}
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="remote"
                    checked={formData.remote}
                    onChange={handleInputChange}
                    disabled={submitting}
                  />
                  This is a remote opportunity
                </label>
              </div>

              <div className="form-group">
                <label>Short Description *</label>
                <textarea
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Brief summary of the opportunity..."
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label>Full Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Detailed description of the opportunity..."
                  disabled={submitting}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contact Name</label>
                  <input
                    type="text"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleInputChange}
                    placeholder="Contact person"
                    disabled={submitting}
                  />
                </div>
                <div className="form-group">
                  <label>Contact Email</label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    placeholder="contact@example.com"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowSubmitForm(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit for Review'}
                </button>
              </div>

              <p className="submit-note">
                Your opportunity will be submitted as a draft. Our editorial team reviews and verifies every submission before publishing.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* TOAST */}
      <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.message}</div>
    </main>
  );
};

export default OpportunitiesPage;