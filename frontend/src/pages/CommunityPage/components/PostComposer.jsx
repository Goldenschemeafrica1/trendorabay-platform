import React from 'react';

const PostComposer = ({ 
  showComposerModal, 
  setShowComposerModal, 
  composerText, 
  setComposerText, 
  pendingImageDataUrl, 
  setPendingImageDataUrl, 
  fileInputRef, 
  handleImageSelect, 
  submitPost 
}) => {
  if (!showComposerModal) return null;

  return (
    <div className="composer-modal-overlay" onClick={() => setShowComposerModal(false)}>
      <div className="composer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="composer-header">
          <h3>Create Post</h3>
          <button onClick={() => setShowComposerModal(false)}>✕</button>
        </div>
        <div className="composer-body">
          <textarea
            placeholder="What's on your mind?"
            value={composerText}
            onChange={(e) => setComposerText(e.target.value)}
            className="composer-textarea"
          />
          {pendingImageDataUrl && (
            <div className="composer-image-preview">
              <img src={pendingImageDataUrl} alt="Preview" />
              <button 
                onClick={() => setPendingImageDataUrl(null)}
                className="remove-image-btn"
              >
                ✕
              </button>
            </div>
          )}
          <div className="composer-actions">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button onClick={() => fileInputRef.current.click()}>
              📷 Add Image
            </button>
            <button 
              className="submit-post-btn"
              onClick={submitPost}
              disabled={!composerText.trim() && !pendingImageDataUrl}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComposer;
