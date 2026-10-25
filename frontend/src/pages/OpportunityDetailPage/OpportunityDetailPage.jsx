import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import opportunityService from '../../services/opportunityService';
import './OpportunityDetailPage.css';

const OpportunityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [relatedOpportunities, setRelatedOpportunities] = useState([]);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const response = await opportunityService.getOpportunityById(id);
        setOpportunity(response.data || response);
        setLoading(false);

        // Fetch related opportunities
        try {
          const relatedResponse = await opportunityService.getOpportunities({ limit: 4 });
          setRelatedOpportunities((relatedResponse.data || []).filter(o => o.id !== id).slice(0, 3));
        } catch (err) {
          console.error('Failed to fetch related opportunities:', err);
        }
      } catch (err) {
        console.error('Failed to fetch opportunity:', err);
        setError('Failed to load opportunity details');
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id]);

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

  const handleShare = async () => {
    if (!opportunity) return;

    const shareData = {
      title: opportunity.title,
      text: `${opportunity.title} - ${opportunity.short_description || opportunity.description}`,
      url: opportunity.application_url || window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share failed:', error);
      }
    }
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const getDeadlineStatus = (deadline) => {
    if (!deadline) return { status: 'open', text: 'Apply soon' };
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysLeft = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return { status: 'closed', text: 'Closed' };
    if (daysLeft <= 7) return { status: 'urgent', text: `${daysLeft} days left` };
    return { status: 'open', text: `${daysLeft} days left` };
  };

  if (loading) {
    return (
      <div className="opportunity-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading opportunity details...</p>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="opportunity-detail-error">
        <p>{error || 'Opportunity not found'}</p>
        <Link to="/opportunities">Back to Opportunities</Link>
      </div>
    );
  }

  const typeLabel = opportunity.work_type || opportunity.category || 'Jobs';
  const deadlineStatus = getDeadlineStatus(opportunity.deadline);

  return (
    <main className="opportunity-detail-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate('/opportunities')}>
          ← Back to Opportunities
        </button>

        <div className="layout">
          {/* Main Content Column */}
          <div className="main-col">
            {/* Badges */}
            <div className="badges">
              {opportunity.remote === 1 && <span className="badge badge-status">Remote</span>}
            </div>

            {/* Title */}
            <h1 className="opp-title">{opportunity.title}</h1>

            {/* Organization Row */}
            <div className="org-row">
              <div className="org-logo">
                {opportunity.organization_name?.charAt(0) || 'O'}
              </div>
              <div>
                <div className="org-name">
                  {opportunity.organization_name || 'Organization'}
                </div>
                <div className="org-sub">
                  {opportunity.location || 'Location'} {opportunity.country && `• ${opportunity.country}`}
                </div>
              </div>
            </div>

            {/* Meta Row */}
            <div className="meta-row">
              <div className="meta-item">
                <span>📅</span>
                <span><strong>Deadline:</strong> {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString() : 'Not specified'}</span>
              </div>
              {opportunity.salary && (
                <div className="meta-item">
                  <span>💰</span>
                  <span><strong>Salary:</strong> {opportunity.salary}</span>
                </div>
              )}
              {opportunity.opportunity_type && (
                <div className="meta-item">
                  <span>🏷️</span>
                  <span><strong>Type:</strong> {opportunity.opportunity_type}</span>
                </div>
              )}
            </div>

            {/* Description Section */}
            <div className="content">
              <div className="section">
                <h2>About this opportunity</h2>
                <div className="prose">
                  <p>{opportunity.description || opportunity.short_description}</p>
                </div>
              </div>

              {opportunity.eligibility && (
                <div className="section">
                  <h2>Eligibility</h2>
                  <div className="prose">
                    <p>{opportunity.eligibility}</p>
                  </div>
                </div>
              )}

              {opportunity.requirements && (
                <div className="section">
                  <h2>Requirements</h2>
                  <div className="prose">
                    <p>{opportunity.requirements}</p>
                  </div>
                </div>
              )}

              {opportunity.benefits && (
                <div className="section">
                  <h2>Benefits</h2>
                  <div className="prose">
                    <p>{opportunity.benefits}</p>
                  </div>
                </div>
              )}

              {opportunity.contact_name || opportunity.contact_email && (
                <div className="section">
                  <h2>Contact</h2>
                  <div className="prose">
                    {opportunity.contact_name && <p><strong>Name:</strong> {opportunity.contact_name}</p>}
                    {opportunity.contact_email && <p><strong>Email:</strong> {opportunity.contact_email}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            {/* Apply Card */}
            <div className="apply-card">
              <div className="apply-card-top">
                <div className="deadline-label">Application deadline</div>
                <div className="deadline-date">
                  {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString() : 'Not specified'}
                </div>
                <div className={`countdown ${deadlineStatus.status}`}>
                  {deadlineStatus.text}
                </div>
              </div>
              <div className="apply-card-body">
                <ul className="specs">
                  <li>
                    <span className="k">Type</span>
                    <span className="v">{typeLabel}</span>
                  </li>
                  {opportunity.location && (
                    <li>
                      <span className="k">Location</span>
                      <span className="v">{opportunity.location}</span>
                    </li>
                  )}
                  {opportunity.country && (
                    <li>
                      <span className="k">Country</span>
                      <span className="v">{opportunity.country}</span>
                    </li>
                  )}
                  {opportunity.salary && (
                    <li>
                      <span className="k">Salary</span>
                      <span className="v">{opportunity.salary}</span>
                    </li>
                  )}
                </ul>

                {deadlineStatus.status === 'closed' ? (
                  <div className="closed-banner">
                    <span>✕</span>
                    <span>This opportunity is closed</span>
                  </div>
                ) : (
                  <>
                    <div className="action-pair">
                      <button
                        className={`btn btn-primary btn-block ${saved ? 'is-saved' : ''}`}
                        onClick={handleSave}
                      >
                        {saved ? '♥ Saved' : '♡ Save'}
                      </button>
                      <button className="btn btn-ghost btn-block" onClick={handleShare}>
                        ↗ Share
                      </button>
                    </div>
                    {opportunity.application_url && (
                      <button
                        className="btn btn-primary btn-block"
                        onClick={() => window.open(opportunity.application_url, '_blank')}
                      >
                        Apply Now →
                      </button>
                    )}
                  </>
                )}

                <div className="card-note">
                  <span>ℹ️</span>
                  <span>Applications are processed directly by the organization. Trendorabay is not responsible for the hiring process.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Opportunities */}
      {relatedOpportunities.length > 0 && (
        <div className="related">
          <div className="container">
            <div className="related-head">
              <h2>More opportunities like this</h2>
              <p>Similar opportunities you might be interested in</p>
            </div>
            <div className="related-grid">
              {relatedOpportunities.map((opp) => (
                <Link
                  key={opp.id}
                  to={`/opportunities/${opp.id}`}
                  className="opp-card"
                >
                  <h3>{opp.title}</h3>
                  <div className="card-org">{opp.organization_name || 'Organization'}</div>
                  <div className="card-foot">
                    <span className="dl">{opp.work_type || opp.category || 'Jobs'}</span>
                    <span>{opp.location || 'Remote'}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default OpportunityDetailPage;
