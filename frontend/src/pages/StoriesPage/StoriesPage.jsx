import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './StoriesPage.css';

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const storiesPerPage = 10;

  // Reset to page 1 when search, category, or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  useEffect(() => {
    const fetchData = async () => {
      const startTime = Date.now();
      try {
        setLoading(true);
        const storiesResponse = await api.get('/stories?limit=100');
        if (import.meta.env.DEV) {
          console.log('Stories response:', storiesResponse);
        }
        const storiesData = storiesResponse.data?.data || storiesResponse.data || [];
        if (import.meta.env.DEV) {
          console.log('Stories data:', storiesData);
        }
        setStories(Array.isArray(storiesData) ? storiesData : []);

        // Extract unique categories from stories
        const uniqueCategories = [...new Set(storiesData.map(story => story.categoryName).filter(Boolean))];
        setCategories(['All', ...uniqueCategories.sort()]);
      } catch (err) {
        setError('Failed to load stories. Please try again.');
        console.error('Error fetching data:', err);
        setStories([]);
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
    if (!content) return '';
    const text = stripHtml(content);
    if (!text) return '';
    return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
  };

  const getFeaturedStory = () => {
    return stories.find(story => story.featured === 1 || story.featured === true) || stories[0];
  };

  const getRegularStories = () => {
    const featured = getFeaturedStory();
    if (!featured) return stories;
    return stories.filter(story => story.id !== featured.id);
  };

  const filteredStories = stories.filter((story) => {
    const matchesCategory = selectedCategory === 'All' || story.categoryName === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (story.title && story.title.toLowerCase().includes(query)) ||
      (story.content && makeExcerpt(story.content).toLowerCase().includes(query)) ||
      (story.author?.name && story.author.name.toLowerCase().includes(query)) ||
      (typeof story.author === 'string' && story.author.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const sortedStories = [...filteredStories].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    }
    return 0;
  });

  const featuredStory = getFeaturedStory();
  const regularStories = getRegularStories();
  const displayStories = featuredStory ? [featuredStory, ...regularStories] : stories;

  // Filter out featured story from the regular stories grid
  const storiesForGrid = featuredStory
    ? sortedStories.filter(story => story.id !== featuredStory.id)
    : sortedStories;

  const totalPages = Math.ceil(storiesForGrid.length / storiesPerPage);
  const startIndex = (currentPage - 1) * storiesPerPage;
  const endIndex = startIndex + storiesPerPage;
  const currentStories = storiesForGrid.slice(startIndex, endIndex);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="stories-page">
        {/* Page Header */}
        <header className="page-header">
          <div className="container">
            <div className="eyebrow skeleton-text"></div>
            <h1 className="skeleton-text"></h1>
            <p className="description skeleton-text"></p>
            <div className="story-count skeleton-text"></div>
          </div>
        </header>

        {/* Sticky Toolbar */}
        <div className="toolbar">
          <div className="container toolbar-inner">
            <div className="search-wrap skeleton-input"></div>
            <div className="sort-wrap skeleton-input"></div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="filters-wrap">
          <div className="container">
            <div className="filters">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="filter skeleton-filter"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Story Skeleton */}
        <section className="featured-section">
          <div className="container">
            <div className="featured-card skeleton-card">
              <div className="featured-img skeleton-image"></div>
              <div className="featured-info">
                <span className="cat skeleton-text"></span>
                <h2 className="skeleton-text"></h2>
                <p className="skeleton-text"></p>
                <div className="featured-meta">
                  <div className="avatar skeleton-avatar"></div>
                  <div className="author-block">
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Grid Skeleton */}
        <main className="stories-section">
          <div className="container">
            <div className="grid-header">
              <h2 className="skeleton-text"></h2>
              <span className="result-count skeleton-text"></span>
            </div>
            <div className="stories-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="story-card skeleton-card">
                  <div className="story-img skeleton-image"></div>
                  <div className="story-info">
                    <span className="cat-label skeleton-text"></span>
                    <h3 className="skeleton-text"></h3>
                    <p className="excerpt skeleton-text"></p>
                    <div className="story-meta">
                      <div className="avatar skeleton-avatar"></div>
                      <span className="author skeleton-text"></span>
                      <span className="dot"></span>
                      <span className="date skeleton-text"></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stories-page">
        <div className="container">
          <div className="state-box">
            <div className="state-icon">⚠</div>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stories-page">
      {/* Page Header */}
      <header className="page-header">
        <div className="container">
          <div className="eyebrow">Trendorabay Magazine</div>
          <h1>All <em>stories.</em></h1>
          <p className="description">Stories that inform, inspire and shape Africa's next chapter. Explore the ideas, people and movements defining our world.</p>
          <div className="story-count">
            Explore <strong>{stories.length}</strong> stories
          </div>
        </div>
      </header>

      {/* Sticky Toolbar */}
      <div className="toolbar">
        <div className="container toolbar-inner">
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input
              type="text"
              placeholder="Search stories by title, keyword or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search stories"
            />
            {searchQuery && (
              <button
                className="clear-btn"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <div className="sort-wrap">
            <label htmlFor="sortSelect">Sort</label>
            <select
              id="sortSelect"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort stories"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="filters-wrap">
        <div className="container">
          <div className="filters" role="tablist" aria-label="Story categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`filter ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
                role="tab"
                aria-selected={selectedCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Story */}
      {featuredStory && (
        <section className="featured-section">
          <div className="container">
            <Link
              to={`/stories/${featuredStory.slug || featuredStory.id}`}
              className="featured-card"
              tabIndex="0"
            >
              <div className="featured-img">
                {featuredStory.imageUrl || featuredStory.image ? (
                  <img
                    src={featuredStory.imageUrl || featuredStory.image}
                    alt={featuredStory.title}
                  />
                ) : (
                  <div className="story-image-placeholder">STORY</div>
                )}
                <span className="featured-tag">Featured</span>
              </div>
              <div className="featured-info">
                <span className="cat">{featuredStory.categoryName || 'Story'}</span>
                <h2 style={{ fontSize: '18px' }}>{featuredStory.title}</h2>
                <p>{makeExcerpt(featuredStory.content, 200)}</p>
                <div className="featured-meta">
                  <div className="avatar">
                    {featuredStory.author?.avatar || featuredStory.authorAvatar ? (
                      <img src={featuredStory.author?.avatar || featuredStory.authorAvatar} alt={featuredStory.author?.name || featuredStory.author || 'Author'} />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>
                  <div className="author-block">
                    <strong>{featuredStory.author?.name || featuredStory.author || 'Trendorabay'}</strong>
                    <span>{featuredStory.createdAt ? new Date(featuredStory.createdAt).toLocaleDateString() : 'Recent'}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Story Grid */}
      <main className="stories-section">
        <div className="container">
          <div className="grid-header">
            <h2>Latest stories</h2>
            <span className="result-count">{storiesForGrid.length} stories</span>
          </div>

          {currentStories.length > 0 ? (
            <>
              <div className="stories-grid">
                {currentStories.map((story) => (
                  <Link
                    key={story.id}
                    to={`/stories/${story.slug || story.id}`}
                    className="story-card"
                  >
                    <div className="story-img">
                      {story.imageUrl || story.image ? (
                        <img
                          src={story.imageUrl || story.image}
                          alt={story.title}
                        />
                      ) : (
                        <div className="story-image-placeholder">STORY</div>
                      )}
                    </div>
                    <div className="story-info">
                      <span className="cat-label">{story.categoryName || 'Story'}</span>
                      <h3>{story.title}</h3>
                      <p className="excerpt">{makeExcerpt(story.content)}</p>
                      <div className="story-meta">
                        <div className="avatar">
                          {story.author?.avatar || story.authorAvatar ? (
                            <img src={story.author?.avatar || story.authorAvatar} alt={story.author?.name || story.author || 'Author'} />
                          ) : (
                            <span>👤</span>
                          )}
                        </div>
                        <span className="author">{story.author?.name || (typeof story.author === 'string' ? story.author : 'Trendorabay')}</span>
                        <span className="dot"></span>
                        <span className="date">{story.createdAt ? new Date(story.createdAt).toLocaleDateString() : 'Recent'}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="pagination" aria-label="Pagination">
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    ←
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`page-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                      aria-label={`Page ${page}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                    →
                  </button>
                </nav>
              )}
            </>
          ) : (
            <div className="state-box">
              <div className="state-icon">📭</div>
              <h3>No stories found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StoriesPage;