import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './StoriesPage.css';

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState(['All', 'Business', 'Technology', 'Culture', 'Fashion', 'Lifestyle', 'Sports', 'Entertainment', 'Agriculture', 'Education', 'Health', 'Travel', 'Food', 'Music', 'Art']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      const startTime = Date.now();
      try {
        setLoading(true);
        const storiesResponse = await api.get('/stories');
        setStories(storiesResponse.data.data || []);
      } catch (err) {
        setError('Failed to load stories. Please try again.');
        console.error('Error fetching data:', err);
      } finally {
        // Ensure minimum loading time of 800ms
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, 800 - elapsed);
        setTimeout(() => setLoading(false), remainingTime);
      }
    };

    fetchData();
  }, []);

  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const makeExcerpt = (content, limit = 120) => {
    const text = stripHtml(content);
    if (!text) return '';
    return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
  };

  const filteredStories = stories.filter((story) => {
    const matchesCategory = selectedCategory === 'All' || story.categoryName === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      (story.title && story.title.toLowerCase().includes(query)) ||
      makeExcerpt(story.content).toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="stories-page">
        <div className="container">
          <div className="stories-loading">
            <p>Loading stories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stories-page">
        <div className="container">
          <div className="stories-error">
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stories-page">
      {/* Hero Section */}
      <section className="stories-hero">
        <div className="container">
          <h1 className="stories-title">
            <span className="african-pattern">✦</span> 
            Latest Stories
            <span className="african-pattern">✦</span>
          </h1>
          <p className="stories-subtitle">
            Discover the people, ideas, businesses and cultural movements shaping tomorrow's African narrative.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="stories-content">
        <div className="container">
          <div className="stories-header">
            <h2>All Stories</h2>
            <p>{filteredStories.length} stories available</p>
          </div>

          <div className="stories-filter">
            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="stories-search"
            />
            <div className="stories-categories">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`stories-category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {filteredStories.length > 0 ? (
            <div className="stories-grid">
              {filteredStories.map((story) => (
                <Link
                  key={story.id}
                  to={`/stories/${story.slug || story.id}`}
                  className="story-card"
                >
                  <div className="story-image">
                    {story.imageUrl ? (
                      <img
                        src={story.imageUrl}
                        alt={story.title}
                        className="story-img"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="story-image-placeholder">
                        <span>STORY</span>
                      </div>
                    )}
                  </div>
                  <div className="story-info">
                    <span className="story-tag">
                      {story.categoryName || 'Story'}
                    </span>
                    <h3>{story.title}</h3>
                    <p className="story-excerpt">
                      {makeExcerpt(story.content)}
                    </p>
                    <div className="story-meta">
                      <span className="story-date">
                        {story.createdAt ? new Date(story.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                      <span className="story-read-time">5 min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-stories">
              <h3>No stories available</h3>
              <p>Check back later for new stories.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StoriesPage;