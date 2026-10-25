import React from 'react';

const CommunityFeed = ({ 
  posts, 
  expandedPosts, 
  togglePostExpansion, 
  formatTimeAgo, 
  formatContent, 
  toggleLike, 
  toggleComments, 
  submitComment, 
  currentUserId, 
  deletePost, 
  editPost, 
  editingPost, 
  editPostContent, 
  setEditPostContent, 
  setEditingPost, 
  setPostMenuOpen, 
  postMenuOpen 
}) => {
  return (
    <div className="feed-section">
      <h2>Feed</h2>
      {posts.length === 0 ? (
        <p className="empty-state">No posts yet. Be the first to share!</p>
      ) : (
        posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-author">
                <div className="author-avatar">{post.initial}</div>
                <div className="author-info">
                  <span className="author-name">{post.author}</span>
                  <span className="post-time">{post.time}</span>
                </div>
              </div>
              <div className="post-menu-container">
                <button 
                  className="post-menu-btn"
                  onClick={() => setPostMenuOpen(postMenuOpen === post.id ? null : post.id)}
                >
                  •••
                </button>
                {postMenuOpen === post.id && (
                  <div className="post-menu-dropdown">
                    {currentUserId === post.userId && (
                      <>
                        <button onClick={() => {
                          setEditingPost(post.id);
                          setEditPostContent(post.content);
                          setPostMenuOpen(null);
                        }}>Edit</button>
                        <button onClick={() => deletePost(post.id)}>Delete</button>
                      </>
                    )}
                    <button onClick={() => setPostMenuOpen(null)}>Cancel</button>
                  </div>
                )}
              </div>
            </div>

            {editingPost === post.id ? (
              <div className="edit-post-form">
                <textarea
                  value={editPostContent}
                  onChange={(e) => setEditPostContent(e.target.value)}
                  className="edit-textarea"
                />
                <div className="edit-actions">
                  <button onClick={() => editPost(post.id)}>Save</button>
                  <button onClick={() => {
                    setEditingPost(null);
                    setEditPostContent('');
                  }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="post-content">
                {post.image && <img src={post.image} alt="Post" className="post-image" />}
                <p>
                  {expandedPosts.has(post.id) || post.content.length < 200 
                    ? formatContent(post.content)
                    : formatContent(post.content.substring(0, 200)) + '...'}
                </p>
                {post.content.length > 200 && (
                  <button 
                    className="expand-btn"
                    onClick={() => togglePostExpansion(post.id)}
                  >
                    {expandedPosts.has(post.id) ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
            )}

            <div className="post-actions">
              <button 
                className={`action-btn ${post.liked ? 'liked' : ''}`}
                onClick={() => toggleLike(post.id)}
              >
                {post.liked ? '❤️' : '🤍'} {post.likes}
              </button>
              <button 
                className="action-btn"
                onClick={() => toggleComments(post.id)}
              >
                💬 {post.comments?.length || 0}
              </button>
            </div>

            {post.commentsOpen && (
              <div className="comments-section">
                {post.comments?.map((comment, idx) => (
                  <div key={idx} className="comment">
                    <span className="comment-author">{comment.author}:</span>
                    <span className="comment-text">{comment.text}</span>
                  </div>
                ))}
                <div className="comment-input">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        submitComment(post.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default CommunityFeed;
