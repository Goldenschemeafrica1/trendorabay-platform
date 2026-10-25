import React from 'react';

const CommunityOpportunities = ({ opportunities }) => {
  return (
    <div className="opportunities-section">
      <h2>Opportunities</h2>
      {opportunities.length === 0 ? (
        <p className="empty-state">No opportunities available</p>
      ) : (
        <div className="opportunities-grid">
          {opportunities.map((opp, idx) => (
            <div key={idx} className="opportunity-card">
              <div className="opportunity-header">
                <span className="opportunity-tag">{opp.tags[0]}</span>
                <span className="opportunity-deadline">{opp.deadline}</span>
              </div>
              <h4>{opp.title}</h4>
              <p className="opportunity-org">{opp.org}</p>
              <p className="opportunity-location">{opp.location}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityOpportunities;
