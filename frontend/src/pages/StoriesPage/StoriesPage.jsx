import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import storyService from '../../services/storyService';
import './StoriesPage.css';

const StoriesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Helper function to format date as "X days ago"
  const formatPublishedDate = (dateString) => {
    const publishedDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - publishedDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Categories based on your magazine sections
  const categories = [
    { id: 'all', name: 'All Stories', icon: '📚' },
    { id: 'business', name: 'Business & Entrepreneurship', icon: '💼' },
    { id: 'real-estate', name: 'Real Estate & Property', icon: '🏠' },
    { id: 'lifestyle', name: 'Lifestyle & Wellness', icon: '🧘' },
    { id: 'urban-culture', name: 'Urban Culture & Trends', icon: '🌆' },
    { id: 'music', name: 'Music & Entertainment', icon: '🎵' },
    { id: 'tech', name: 'Tech & Innovation', icon: '💻' },
    { id: 'interviews', name: 'Interviews & Features', icon: '🎤' },
    { id: 'fashion', name: 'Fashion & Style', icon: '👗' },
    { id: 'art', name: 'Art & Photography', icon: '🎨' },
  ];

  // Fetch stories from API
  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        console.log('Fetching stories with params:', {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          page: currentPage,
          limit: 12,
          status: 'published'
        });
        
        const response = await storyService.getStories({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          page: currentPage,
          limit: 12,
          status: 'published'
        });
        
        console.log('StoriesPage raw response:', response);
        console.log('Response type:', typeof response);
        console.log('Is array?', Array.isArray(response));
        console.log('Has data property?', response && 'data' in response);
        
        // Handle different response structures
        let storiesData = [];
        let totalPagesData = 1;
        
        if (Array.isArray(response)) {
          storiesData = response;
          console.log('Response is array, using directly');
        } else if (response && Array.isArray(response.data)) {
          storiesData = response.data;
          totalPagesData = response.totalPages || 1;
          console.log('Response has data array, using response.data');
        } else if (response && response.data) {
          storiesData = response.data;
          totalPagesData = response.totalPages || 1;
          console.log('Response has data property, using response.data');
        } else {
          console.log('Unknown response structure, defaulting to empty array');
        }
        
        console.log('Final stories data:', storiesData);
        console.log('Stories data length:', storiesData.length);
        console.log('Total pages:', totalPagesData);
        
        setStories(storiesData);
        setTotalPages(totalPagesData);
      } catch (error) {
        console.error('Error fetching stories:', error);
        console.error('Error details:', error.message, error.stack);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [selectedCategory, currentPage]);

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  // Get current stories for pagination
  const indexOfLastStory = currentPage * 6;
  const indexOfFirstStory = indexOfLastStory - 6;
  const currentStories = Array.isArray(stories) ? stories.slice(indexOfFirstStory, indexOfLastStory) : [];

  return (
    <div className="stories-page">
      {/* All Stories Section */}
      <section className="all-stories">
        <div className="container">
          <h2 className="section-title">
            <i className="fas fa-feather-alt"></i> {selectedCategory === 'all' ? 'All Stories' : categories.find(c => c.id === selectedCategory)?.name}
          </h2>

          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
              <p>Loading stories...</p>
            </div>
          ) : (
            <>
              {currentStories.length > 0 ? (
                <>
                  <div className="stories-grid">
                    {currentStories.map(story => (
                      <Link key={story.id} to={`/stories/${story.slug}`} className="story-card">
                        <div className="story-image">
                          <img
                            src={story.imageUrl || '/music.jpeg'}
                            alt={story.title}
                            onError={(e) => {
                              e.target.src = '/music.jpeg';
                            }}
                          />
                        </div>
                        <div className="story-content">
                          <span style={{ fontSize: '9px', fontWeight: '600', color: '#b87c4b', backgroundColor: 'transparent', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0', padding: '4px 8px', borderRadius: '8px', display: 'inline-block', maxWidth: 'fit-content', whiteSpace: 'nowrap' }}>{story.categoryName}</span>
                          <h3 className="story-title" style={{ '--text-3xl': '10px', marginTop: '8px' }}>{story.title}</h3>
                          <div className="story-meta">
                            <div className="story-author">
                              <Link to={`/author/${story.author?.id}`} className="author-link" onClick={(e) => e.stopPropagation()}>
                                <img src={story.author?.avatar || '/images/default-avatar.png'} alt={story.author?.name || 'Author'} />
                                <span style={{ fontSize: '9px !important' }}>{story.author?.name || 'Unknown Author'}</span>
                              </Link>
                              <span className="story-published-date" style={{ fontSize: '8px !important' }}>{formatPublishedDate(story.publishedDate)}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button 
                        className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <i className="fas fa-chevron-left"></i> Previous
                      </button>
                      <div className="page-numbers">
                        {[...Array(totalPages)].map((_, index) => (
                          <button
                            key={index + 1}
                            className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </button>
                        ))}
                      </div>
                      <button 
                        className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-stories">
                  <i className="fas fa-book-open"></i>
                  <h3>No stories found</h3>
                  <p>Be the first to write a story in this category!</p>
                  <Link to="/write" className="btn btn-primary write-story-btn" style={{ padding: '6px 10px', fontSize: '11px', maxWidth: '100px', width: 'auto', minWidth: 'auto', whiteSpace: 'nowrap' }}>Write a Story</Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      </div>
  );
};

export default StoriesPage;
