import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaClock, FaUser, FaEye, FaHeart, FaComment } from 'react-icons/fa';
import { storyService } from '../../services/storyService';
import StoryCard from '../../components/stories/StoryCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './Stories.css';

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const storiesPerPage = 9;

  // Categories for filter
  const categories = [
    { id: 'all', name: 'All Stories', icon: '📚' },
    { id: 'culture', name: 'Culture', icon: '🌍' },
    { id: 'lifestyle', name: 'Lifestyle', icon: '🌟' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'fashion', name: 'Fashion', icon: '👗' },
    { id: 'tech', name: 'Technology', icon: '💻' },
    { id: 'food', name: 'Food & Travel', icon: '🍲' },
    { id: 'art', name: 'Art & Design', icon: '🎨' },
    { id: 'wellness', name: 'Wellness', icon: '🧘' }
  ];

  // Fetch stories on component mount
  useEffect(() => {
    fetchStories();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...stories];

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(story => 
        story.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.author?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'trending':
        filtered.sort((a, b) => ((b.likes || 0) * 2 + (b.views || 0)) - ((a.likes || 0) * 2 + (a.views || 0)));
        break;
      default:
        break;
    }

    setFilteredStories(filtered);
    setTotalPages(Math.ceil(filtered.length / storiesPerPage));
  }, [stories, selectedCategory, searchTerm, sortBy]);

  const fetchStories = async () => {
    setIsLoading(true);
    try {
      const data = await storyService.getAllStories();
      setStories(data);
      setFilteredStories(data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get current page stories
  const getCurrentPageStories = () => {
    const startIndex = (currentPage - 1) * storiesPerPage;
    const endIndex = startIndex + storiesPerPage;
    return filteredStories.slice(startIndex, endIndex);
  };

  
  return (
    <div className="stories-page">
      {/* Hero Section */}
      <section className="stories-hero">
        <div className="container">
          <h1 className="stories-hero-title">
            <span className="gold-text">African Stories</span>
            <br />By Africans, For the World
          </h1>
          <p className="stories-hero-subtitle">
            Discover authentic voices, untold narratives, and fresh perspectives from across the continent
          </p>
        </div>
        <div className="hero-pattern"></div>
      </section>

      {/* Search and Filter Bar */}
      <section className="stories-toolbar">
        <div className="container">
          <div className="toolbar-grid">
            {/* Search */}
            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Category Filter */}
            <div className="filter-wrapper">
              <FaFilter className="filter-icon" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="sort-wrapper">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      
      {/* Stories Grid */}
      <section className="stories-grid-section">
        <div className="container">
          {isLoading ? (
            <div className="loading-container">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* Results count */}
              <div className="results-header">
                <p className="results-count">
                  Showing {getCurrentPageStories().length} of {filteredStories.length} stories
                </p>
                {selectedCategory !== 'all' && (
                  <button 
                    className="clear-filter"
                    onClick={() => setSelectedCategory('all')}
                  >
                    Clear filter ✕
                  </button>
                )}
              </div>

              {/* Stories Grid */}
              {getCurrentPageStories().length > 0 ? (
                <div className="stories-grid">
                  {getCurrentPageStories().map(story => (
                    <StoryCard key={story.id} story={story} />
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <img src="/images/no-results.svg" alt="No stories found" />
                  <h3>No stories found</h3>
                  <p>Try adjusting your search or filter</p>
                  <button 
                    className="reset-btn"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    ← Previous
                  </button>
                  
                  <div className="page-numbers">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="stories-newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h3>Never miss a story</h3>
            <p>Get the best African stories delivered to your inbox weekly</p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">
                Subscribe
              </button>
            </form>
            <p className="newsletter-note">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Stories;