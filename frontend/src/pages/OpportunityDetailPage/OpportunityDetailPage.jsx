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

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const response = await opportunityService.getOpportunityById(id);
        setOpportunity(response.data || response);
        setLoading(false);
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

  return (
    <main className="opportunity-detail-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate('/opportunities')}>
          ← Back to Opportunities
        </button>

        <div className="detail-header">
          <span className={`opp-type ${getTypeClass(typeLabel)}`}>{typeLabel}</span>
          {opportunity.remote === 1 && <span className="opp-type remote">Remote</span>}
          <div className="header-actions">
            <button className="action-button" onClick={handleSave}>
              {saved ? '♥ Saved' : '♡ Save'}
            </button>
            <button className="action-button" onClick={handleShare}>
              ↗ Share
            </button>
          </div>
        </div>

        <h1 className="detail-title">{opportunity.title}</h1>

        <div className="detail-meta">
          {opportunity.organization_name && (
            <span className="detail-org">{opportunity.organization_name}</span>
          )}
          <div className="detail-location">
            {opportunity.location && <span>📍 {opportunity.location}</span>}
            {opportunity.country && <span>🌍 {opportunity.country}</span>}
            {opportunity.deadline && <span>📅 Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>}
          </div>
        </div>

        <div className="detail-description">
          <h3>Description</h3>
          <p>{opportunity.description || opportunity.short_description}</p>
        </div>

        {opportunity.salary && (
          <div className="detail-salary">
            <h3>Compensation</h3>
            <p>{opportunity.salary}</p>
          </div>
        )}

        {opportunity.eligibility && (
          <div className="detail-section">
            <h3>Eligibility</h3>
            <p>{opportunity.eligibility}</p>
          </div>
        )}

        {opportunity.requirements && (
          <div className="detail-section">
            <h3>Requirements</h3>
            <p>{opportunity.requirements}</p>
          </div>
        )}

        {opportunity.benefits && (
          <div className="detail-section">
            <h3>Benefits</h3>
            <p>{opportunity.benefits}</p>
          </div>
        )}

        {opportunity.contact_name || opportunity.contact_email && (
          <div className="detail-contact">
            <h3>Contact</h3>
            {opportunity.contact_name && <p>Name: {opportunity.contact_name}</p>}
            {opportunity.contact_email && <p>Email: {opportunity.contact_email}</p>}
          </div>
        )}

        <div className="detail-actions">
          {opportunity.application_url && (
            <button
              className="btn-primary"
              onClick={() => window.open(opportunity.application_url, '_blank')}
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default OpportunityDetailPage;
