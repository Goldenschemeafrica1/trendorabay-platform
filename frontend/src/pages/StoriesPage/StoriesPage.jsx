import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StoriesPage.css';

const StoriesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  // Mock data - replace with API call
  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock stories data
        const mockStories = [
          {
            id: 1,
            title: "Sustainable Living: Traditional Wellness Practices Making a Comeback",
            excerpt: "From shea butter to herbal remedies, how ancient African wellness traditions are being rediscovered by a new generation.",
            author: {
              name: "Fatoumata Diallo",
              avatar: "https://i.pravatar.cc/150?u=5",
              bio: "Wellness writer, Dakar"
            },
            category: "lifestyle",
            categoryName: "Lifestyle & Wellness",
            readTime: 7,
            publishedDate: "2024-01-20",
            imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format",
            likes: 723,
            comments: 41,
            reads: 2800,
            featured: false
          },
          {
            id: 2,
            title: "The Property Boom: Investing in African Real Estate",
            excerpt: "With rapid urbanization, African real estate is attracting global investors. Here's what you need to know.",
            author: {
              name: "James Omondi",
              avatar: "https://i.pravatar.cc/150?u=6",
              bio: "Real estate analyst, Nairobi"
            },
            category: "real-estate",
            categoryName: "Real Estate & Property",
            readTime: 10,
            publishedDate: "2024-01-15",
            imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format",
            likes: 445,
            comments: 67,
            reads: 1900,
            featured: false
          },
          {
            id: 3,
            title: "From Cape Town to Cairo: The Best Coffee Shops for Remote Work",
            excerpt: "Digital nomad shares his favorite spots across the continent with great coffee and reliable WiFi.",
            author: {
              name: "Thabo Ndlovu",
              avatar: "https://i.pravatar.cc/150?u=7",
              bio: "Digital nomad, Johannesburg"
            },
            category: "lifestyle",
            categoryName: "Lifestyle & Wellness",
            readTime: 6,
            publishedDate: "2024-01-08",
            imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format",
            likes: 834,
            comments: 52,
            reads: 3100,
            featured: false
          },
          {
            id: 4,
            title: "Interview: How This Founder Built a Fintech Empire",
            excerpt: "Exclusive interview with the CEO of one of Africa's fastest-growing fintech companies.",
            author: {
              name: "Sarah Kimani",
              avatar: "https://i.pravatar.cc/150?u=8",
              bio: "Business journalist"
            },
            category: "interviews",
            categoryName: "Interviews & Features",
            readTime: 15,
            publishedDate: "2024-01-02",
            imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format",
            likes: 1123,
            comments: 78,
            reads: 5600,
            featured: false
          }
        ];

        const all = selectedCategory === 'all' 
          ? mockStories 
          : mockStories.filter(story => story.category === selectedCategory);

        setStories(all);
        setTotalPages(Math.ceil(all.length / 6));
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [selectedCategory]);

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  // Get current stories for pagination
  const indexOfLastStory = currentPage * 6;
  const indexOfFirstStory = indexOfLastStory - 6;
  const currentStories = stories.slice(indexOfFirstStory, indexOfLastStory);

  return (
    <div className="stories-page">

      {/* Category Filter */}
      <section className="category-filter">
        <div className="container">
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category.id}
                data-category={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>
      
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
                      <div key={story.id} className="story-card">
                        <div className="story-image">
                          <img src={story.imageUrl} alt={story.title} />
                          {story.featured && <span className="featured-badge">Featured</span>}
                        </div>
                        <div className="story-content">
                          <div className="story-category">{story.categoryName}</div>
                          <h3 className="story-title">{story.title}</h3>
                          <p className="story-excerpt">{story.excerpt}</p>
                          <div className="story-meta">
                            <div className="story-author">
                              <img src={story.author.avatar} alt={story.author.name} />
                              <span>{story.author.name}</span>
                            </div>
                            <div className="story-stats">
                              <span>📖 {story.readTime} min</span>
                              <span>❤️ {story.likes}</span>
                            </div>
                          </div>
                        </div>
                      </div>
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
                  <Link to="/write" className="btn btn-primary">Write a Story</Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Call to Action - Write a Story */}
      <section className="write-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Have a story to tell?</h2>
            <p>Join our community of writers and share your perspective with the world.</p>
            <div className="cta-buttons">
              <Link to="/write" className="btn btn-primary btn-large">
                <i className="fas fa-pen-fancy"></i> Start Writing
              </Link>
              <Link to="/contribute/guidelines" className="btn btn-secondary btn-large">
                Read Guidelines
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StoriesPage;
