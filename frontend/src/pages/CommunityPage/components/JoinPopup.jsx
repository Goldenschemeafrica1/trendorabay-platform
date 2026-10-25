import React from 'react';

const JoinPopup = ({ 
  showJoinPopup, 
  closeJoinPopup, 
  selectedCommunityForJoin, 
  handleConfirmJoin 
}) => {
  if (!showJoinPopup || !selectedCommunityForJoin) return null;

  return (
    <div className="join-popup-overlay" onClick={closeJoinPopup}>
      <div className="join-popup" onClick={(e) => e.stopPropagation()}>
        <div className="join-popup-header">
          <h3>Join {selectedCommunityForJoin.name}</h3>
          <button onClick={closeJoinPopup}>✕</button>
        </div>
        <div className="join-popup-body">
          <p className="join-popup-desc">
            Join this community to connect with {selectedCommunityForJoin.members} members 
            interested in {selectedCommunityForJoin.category}.
          </p>
          <div className="join-popup-info">
            <div className="info-item">
              <span className="info-label">Category:</span>
              <span className="info-value">{selectedCommunityForJoin.category}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Members:</span>
              <span className="info-value">{selectedCommunityForJoin.members}</span>
            </div>
          </div>
        </div>
        <div className="join-popup-footer">
          <button className="cancel-btn" onClick={closeJoinPopup}>Cancel</button>
          <button className="confirm-btn" onClick={handleConfirmJoin}>Join Community</button>
        </div>
      </div>
    </div>
  );
};

export default JoinPopup;
