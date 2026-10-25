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
    <div className="community-header">
      <button className="back-btn" onClick={goBackToList}>
        ← Back to communities
      </button>
      <div className="community-info">
        <h1>{currentCommunity.name}</h1>
        <p className="community-category">{currentCommunity.category}</p>
        <p className="community-desc">{currentCommunity.desc}</p>
        <p className="community-members-count">{currentCommunity.members} members</p>
      </div>
      <button 
        className={`join-btn ${isJoined ? 'joined' : ''}`}
        onClick={toggleJoin}
      >
        {isJoined ? 'Joined ✓' : 'Join Community'}
      </button>
      <div className="tabs">
        <button 
          className={`tab ${currentTab === 'Feed' ? 'active' : ''}`}
          onClick={() => setCurrentTab('Feed')}
        >
          Feed
        </button>
        <button 
          className={`tab ${currentTab === 'Discussions' ? 'active' : ''}`}
          onClick={() => setCurrentTab('Discussions')}
        >
          Discussions
        </button>
        <button 
          className={`tab ${currentTab === 'Members' ? 'active' : ''}`}
          onClick={() => setCurrentTab('Members')}
        >
          Members
        </button>
        <button 
          className={`tab ${currentTab === 'Opportunities' ? 'active' : ''}`}
          onClick={() => setCurrentTab('Opportunities')}
        >
          Opportunities
        </button>
        <button 
          className={`tab ${currentTab === 'Events' ? 'active' : ''}`}
          onClick={() => setCurrentTab('Events')}
        >
          Events
        </button>
      </div>
      {isJoined && (
        <button 
          className="create-post-btn"
          onClick={() => setShowComposerModal(true)}
        >
          + Create Post
        </button>
      )}
    </div>
  );
};

export default CommunityHeader;
