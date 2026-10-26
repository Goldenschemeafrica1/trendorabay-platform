import React from 'react';

const CommunityHeader = ({ 
  currentCommunity, 
  goBackToList, 
  isJoined, 
  toggleJoin, 
  currentTab, 
  setCurrentTab, 
  showComposerModal, 
  setShowComposerModal 
}) => {
  if (!currentCommunity) return null;

  return (
    <div className="detail-view">
      <button className="detail-back" onClick={goBackToList}>
        ← Back to communities
      </button>
      <div className="detail-cover">
        <img src={currentCommunity.cover} alt={currentCommunity.name} />
        <div className="detail-cover-overlay"></div>
        <div className="detail-cover-content">
          <span className="eyebrow-light">{currentCommunity.category}</span>
          <h1>{currentCommunity.name}</h1>
          <p>{currentCommunity.desc}</p>
          <div className="detail-cover-stats">
            <span>{currentCommunity.members} members</span>
          </div>
        </div>
      </div>
      <div className="detail-bar">
        <div className="detail-bar-actions">
          <button
            className={`btn btn-dark ${isJoined ? 'joined' : ''}`}
            onClick={toggleJoin}
          >
            {isJoined ? 'Joined ✓' : 'Join Community'}
          </button>
          {isJoined && (
            <button
              className="btn btn-dark"
              onClick={() => setShowComposerModal(true)}
            >
              + Create Post
            </button>
          )}
        </div>
        <div className="detail-tabs">
          <button
            className={`tab-btn ${currentTab === 'Feed' ? 'active' : ''}`}
            onClick={() => setCurrentTab('Feed')}
          >
            Feed
          </button>
          <button
            className={`tab-btn ${currentTab === 'Discussions' ? 'active' : ''}`}
            onClick={() => setCurrentTab('Discussions')}
          >
            Discussions
          </button>
          <button
            className={`tab-btn ${currentTab === 'Members' ? 'active' : ''}`}
            onClick={() => setCurrentTab('Members')}
          >
            Members
          </button>
          <button
            className={`tab-btn ${currentTab === 'Opportunities' ? 'active' : ''}`}
            onClick={() => setCurrentTab('Opportunities')}
          >
            Opportunities
          </button>
          <button
            className={`tab-btn ${currentTab === 'Events' ? 'active' : ''}`}
            onClick={() => setCurrentTab('Events')}
          >
            Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityHeader;
