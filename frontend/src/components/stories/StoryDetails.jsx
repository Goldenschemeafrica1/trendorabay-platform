import React from 'react';
import { FaCalendarAlt, FaUser, FaTag, FaBookmark, FaHeart, FaShare, FaClock } from 'react-icons/fa';
import Button from '../forms/Button';
import './StoryDetails.css';

const StoryDetails = ({ story }) => {
  if (!story) {
    return (
      <div className="story-details-loading">
        <div className="loading-spinner">Loading story...</div>
      </div>
    );
  }

  const handleBookmark = () => {
    // Bookmark logic
    console.log('Bookmarked story:', story.id);
  };

  const handleLike = () => {
    // Like logic
    console.log('Liked story:', story.id);
  };

  const handleShare = () => {
    // Share logic
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: story.excerpt,
        url: window.location.href
      });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    if (!content || typeof content !== 'string') {
      return 1; // Default to 1 minute if content is missing or not a string
    }
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <article className="story-details">
      <div className="story-details-container">
        {/* Story Header */}
        <header className="story-header">
          <div className="story-meta">
            {story.category && (
              <span className="story-category">{story.category}</span>
            )}
            <div className="story-meta-info">
              <span className="story-date">
                <FaCalendarAlt /> {formatDate(story.date)}
              </span>
              <span className="read-time">
                <FaClock /> {calculateReadTime(story.content || '')} min read
              </span>
            </div>
          </div>
          
          <h1 className="story-title">{story.title}</h1>
          
          <p className="story-excerpt">{story.excerpt}</p>

          {/* Story Actions */}
          <div className="story-actions">
            <Button onClick={handleBookmark} variant="outline" size="small">
              <FaBookmark /> Save
            </Button>
            <Button onClick={handleLike} variant="outline" size="small">
              <FaHeart /> Like
            </Button>
            <Button onClick={handleShare} variant="outline" size="small">
              <FaShare /> Share
            </Button>
          </div>
        </header>

        {/* Featured Image */}
        {story.image && (
          <div className="story-featured-image">
            <img 
              src={story.image} 
              alt={story.title}
              onError={(e) => {
                e.target.src = '/images/placeholder-story.jpg';
              }}
            />
          </div>
        )}

        {/* Author Information */}
        {story.author && (
          <div className="story-author">
            <div className="author-info">
              {story.author.avatar && (
                <img 
                  src={story.author.avatar} 
                  alt={story.author.name}
                  className="author-avatar"
                />
              )}
              <div className="author-details">
                <h4 className="author-name">{story.author.name}</h4>
                {story.author.bio && (
                  <p className="author-bio">{story.author.bio}</p>
                )}
                <div className="author-stats">
                  {story.author.storiesCount && (
                    <span className="author-stories">
                      {story.author.storiesCount} stories
                    </span>
                  )}
                  {story.author.joinDate && (
                    <span className="author-joined">
                      Joined {story.author.joinDate}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Story Content */}
        <div className="story-content">
          <div 
            className="story-text"
            dangerouslySetInnerHTML={{ __html: story.content }}
          />
        </div>

        {/* Story Tags */}
        {story.tags && story.tags.length > 0 && (
          <div className="story-tags">
            <h4>Tags</h4>
            <div className="tags-list">
              {story.tags.map((tag, index) => (
                <span key={index} className="tag">
                  <FaTag /> {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Story Footer */}
        <footer className="story-footer">
          <div className="story-stats">
            {story.views && (
              <span className="stat-item">
                {story.views} views
              </span>
            )}
            {story.likes && (
              <span className="stat-item">
                {story.likes} likes
              </span>
            )}
            {story.comments && (
              <span className="stat-item">
                {story.comments} comments
              </span>
            )}
          </div>
        </footer>
      </div>
    </article>
  );
};

export default StoryDetails;
