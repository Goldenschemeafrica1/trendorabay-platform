import React from 'react';
import { FaUser, FaCalendar, FaTag, FaClock } from 'react-icons/fa';
import './StoryCard.css';

const StoryCard = ({ 
  story, 
  showAuthor = true, 
  showDate = true, 
  showCategory = true,
  compact = false 
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content ? content.split(' ').length : 100;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <article className={`story-card ${compact ? 'compact' : ''}`}>
      <div className="story-image">
        <img 
          src={story.imageUrl || story.image || '/images/story-placeholder.jpg'} 
          alt={story.title}
          onError={(e) => {
            e.target.src = '/images/story-placeholder.jpg';
          }}
        />
        {showCategory && (story.categoryName || story.category) && (
          <span className="story-category">{story.categoryName || story.category}</span>
        )}
      </div>
      
      <div className="story-content">
        <h3 className="story-title">
          <a href={`/stories/${story.slug || story.id}`}>{story.title}</a>
        </h3>
        
        <p className="story-excerpt">
          {story.excerpt || story.description}
        </p>
        
        {story.tags && story.tags.length > 0 && (
          <div className="story-tags">
            {story.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="story-tag">
                <FaTag /> {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="story-meta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {showAuthor && story.author && (
            <span className="meta-item author" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FaUser /> {typeof story.author === 'string' ? story.author : story.author.name}
            </span>
          )}
          
          {(story.readTime || story.readTime === 0) && (
            <span className="meta-item read-time" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FaClock /> {story.readTime || 5} min read
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default StoryCard;
