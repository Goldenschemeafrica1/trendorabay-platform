import React from 'react';

const CommunityDiscussions = ({ 
  discussions, 
  selectedDiscussion, 
  setSelectedDiscussion, 
  showDiscussionComposer, 
  setShowDiscussionComposer, 
  discussionTitle, 
  setDiscussionTitle, 
  discussionContent, 
  setDiscussionContent, 
  discussionTag, 
  setDiscussionTag, 
  submitDiscussion, 
  openDiscussion, 
  deleteDiscussion, 
  currentUserId, 
  discussionMenuOpen, 
  setDiscussionMenuOpen, 
  replyText, 
  setReplyText, 
  submitReply 
}) => {
  return (
    <div className="discussions-section">
      <h2>Discussions</h2>
      
      {showDiscussionComposer && (
        <div className="discussion-composer">
          <input
            type="text"
            placeholder="Discussion title..."
            value={discussionTitle}
            onChange={(e) => setDiscussionTitle(e.target.value)}
            className="discussion-title-input"
          />
          <textarea
            placeholder="What's on your mind?"
            value={discussionContent}
            onChange={(e) => setDiscussionContent(e.target.value)}
            className="discussion-content-input"
          />
          <input
            type="text"
            placeholder="Tag (optional)"
            value={discussionTag}
            onChange={(e) => setDiscussionTag(e.target.value)}
            className="discussion-tag-input"
          />
          <div className="composer-actions">
            <button onClick={submitDiscussion}>Start Discussion</button>
            <button onClick={() => setShowDiscussionComposer(false)}>Cancel</button>
          </div>
        </div>
      )}

      {!showDiscussionComposer && (
        <button 
          className="start-discussion-btn"
          onClick={() => setShowDiscussionComposer(true)}
        >
          + Start Discussion
        </button>
      )}

      {selectedDiscussion ? (
        <div className="discussion-detail">
          <button 
            className="back-btn"
            onClick={() => setSelectedDiscussion(null)}
          >
            ← Back to discussions
          </button>
          <div className="discussion-header">
            <h3>{selectedDiscussion.title}</h3>
            <span className="discussion-tag">{selectedDiscussion.tag}</span>
          </div>
          <div className="discussion-meta">
            <span>By {selectedDiscussion.author}</span>
            <span>• {selectedDiscussion.time}</span>
            <span>• {selectedDiscussion.views} views</span>
          </div>
          <p className="discussion-content-text">{selectedDiscussion.content}</p>
          
          <div className="replies-section">
            <h4>Replies ({selectedDiscussion.replies?.length || 0})</h4>
            {selectedDiscussion.replies?.map(reply => (
              <div key={reply.id} className="reply">
                <div className="reply-header">
                  <span className="reply-author">{reply.author}</span>
                  <span className="reply-time">{reply.time}</span>
                </div>
                <p className="reply-content">{reply.content}</p>
              </div>
            ))}
            <div className="reply-input">
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    submitReply();
                  }
                }}
              />
              <button onClick={submitReply}>Reply</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="discussions-list">
          {discussions.length === 0 ? (
            <p className="empty-state">No discussions yet. Start one!</p>
          ) : (
            discussions.map(discussion => (
              <div 
                key={discussion.id} 
                className="discussion-card"
                onClick={() => openDiscussion(discussion.id)}
              >
                <div className="discussion-card-header">
                  <h4>{discussion.title}</h4>
                  <div className="discussion-menu-container">
                    <button 
                      className="discussion-menu-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDiscussionMenuOpen(discussionMenuOpen === discussion.id ? null : discussion.id);
                      }}
                    >
                      •••
                    </button>
                    {discussionMenuOpen === discussion.id && (
                      <div className="discussion-menu-dropdown">
                        {currentUserId === discussion.userId && (
                          <button onClick={(e) => {
                            e.stopPropagation();
                            deleteDiscussion(discussion.id);
                          }}>Delete</button>
                        )}
                        <button onClick={(e) => {
                          e.stopPropagation();
                          setDiscussionMenuOpen(null);
                        }}>Cancel</button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="discussion-preview">{discussion.content.substring(0, 150)}...</p>
                <div className="discussion-meta">
                  <span>By {discussion.author}</span>
                  <span>• {discussion.time}</span>
                  <span>• {discussion.repliesCount} replies</span>
                  <span>• {discussion.views} views</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CommunityDiscussions;
