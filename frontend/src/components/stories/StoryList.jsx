import React from 'react';
import StoryCard from './StoryCard';
import './StoryList.css';

const StoryList = ({ 
  stories, 
  loading = false, 
  layout = 'grid', // 'grid' or 'list'
  showAuthor = true,
  showDate = true,
  showCategory = true 
}) => {
  if (loading) {
    return (
      <div className="story-list-loading">
        <div className="loading-spinner">Loading stories...</div>
      </div>
    );
  }

  if (!stories || stories.length === 0) {
    return (
      <div className="story-list-empty">
        <p>No stories found.</p>
      </div>
    );
  }

  return (
    <div className={`story-list story-list-${layout}`}>
      {stories.map((story) => (
        <StoryCard 
          key={story.id} 
          story={story}
          showAuthor={showAuthor}
          showDate={showDate}
          showCategory={showCategory}
        />
      ))}
    </div>
  );
};

export default StoryList;
