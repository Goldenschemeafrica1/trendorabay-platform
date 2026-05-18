import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StoriesPage.css';

const LatestStoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('latest');

  // Categories for filtering
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

  // Latest stories data - focused on most recent content
  const latestStoriesData = [
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
      views: 5420,
      featured: false,
      tags: ["Wellness", "Tradition", "Health"]
    },
    {
      id: 2,
      title: "Nairobi's Tech Hub Boom: What's Behind the Explosion?",
      excerpt: "Kenya's capital is becoming Africa's Silicon Savannah. We explore the factors driving this technological renaissance.",
      author: {
        name: "James Kamau",
        avatar: "https://i.pravatar.cc/150?u=6",
        bio: "Tech correspondent, Nairobi"
      },
      category: "tech",
      categoryName: "Tech & Innovation",
      readTime: 10,
      publishedDate: "2024-01-19",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&auto=format",
      likes: 1245,
      views: 8930,
      featured: true,
      tags: ["Technology", "Startups", "Nairobi", "Innovation"]
    },
    {
      id: 3,
      title: "The New African Fashion Week: Designers Redefining Luxury",
      excerpt: "From Lagos to Paris, African designers are challenging traditional notions of luxury and sustainability in fashion.",
      author: {
        name: "Amara Okonkwo",
        avatar: "https://i.pravatar.cc/150?u=7",
        bio: "Fashion editor, Lagos"
      },
      category: "fashion",
      categoryName: "Fashion & Style",
      readTime: 8,
      publishedDate: "2024-01-18",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format",
      likes: 892,
      views: 6780,
      featured: false,
      tags: ["Fashion", "Design", "Luxury", "Sustainability"]
    },
    {
      id: 4,
      title: "Exclusive: CEO of Africa's Largest Fintech Speaks Out",
      excerpt: "In an exclusive interview, the CEO reveals plans for pan-African expansion and the future of digital banking.",
      author: {
        name: "Michael Asante",
        avatar: "https://i.pravatar.cc/150?u=8",
        bio: "Business journalist, Accra"
      },
      category: "business",
      categoryName: "Business & Entrepreneurship",
      readTime: 12,
      publishedDate: "2024-01-17",
      imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format",
      likes: 1567,
      views: 12450,
      featured: true,
      tags: ["Business", "Fintech", "Interview", "Banking"]
    },
    {
      id: 5,
      title: "Urban Farming Revolution: How Cities Are Feeding Themselves",
      excerpt: "From rooftop gardens to vertical farms, African cities are pioneering innovative solutions to food security challenges.",
      author: {
        name: "Grace Mbeki",
        avatar: "https://i.pravatar.cc/150?u=9",
        bio: "Environmental reporter, Johannesburg"
      },
      category: "urban-culture",
      categoryName: "Urban Culture & Trends",
      readTime: 9,
      publishedDate: "2024-01-16",
      imageUrl: "https://images.unsplash.com/photo-1589927986089-35812388d0b8?w=800&auto=format",
      likes: 634,
      views: 4560,
      featured: false,
      tags: ["Urban", "Farming", "Sustainability", "Food Security"]
    },
    {
      id: 6,
      title: "Afrobeats Goes Global: The Artists Taking Over the World",
      excerpt: "From Burna Boy to Tems, African artists are dominating global charts and reshaping the music industry.",
      author: {
        name: "David Osei",
        avatar: "https://i.pravatar.cc/150?u=10",
        bio: "Music critic, Accra"
      },
      category: "music",
      categoryName: "Music & Entertainment",
      readTime: 11,
      publishedDate: "2024-01-15",
      imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format",
      likes: 2341,
      views: 18920,
      featured: true,
      tags: ["Music", "Afrobeats", "Global", "Entertainment"]
    },
    {
      id: 7,
      title: "Real Estate Boom: Property Investment in African Cities",
      excerpt: "Why investors are flocking to African property markets and what it means for urban development.",
      author: {
        name: "Sarah Chen",
        avatar: "https://i.pravatar.cc/150?u=11",
        bio: "Real estate analyst, Cape Town"
      },
      category: "real-estate",
      categoryName: "Real Estate & Property",
      readTime: 8,
      publishedDate: "2024-01-14",
      imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format",
      likes: 445,
      views: 3210,
      featured: false,
      tags: ["Real Estate", "Investment", "Urban Development"]
    },
    {
      id: 8,
      title: "African Art Scene: Galleries and Artists Making Waves",
      excerpt: "Contemporary African art is gaining international recognition, with galleries and artists achieving record sales.",
      author: {
        name: "Zara Hassan",
        avatar: "https://i.pravatar.cc/150?u=12",
        bio: "Art curator, Marrakech"
      },
      category: "art",
      categoryName: "Art & Photography",
      readTime: 7,
      publishedDate: "2024-01-13",
      imageUrl: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&auto=format",
      likes: 789,
      views: 5670,
      featured: false,
      tags: ["Art", "Culture", "Galleries", "Contemporary"]
    }
  ];

  useEffect(() => {
    const fetchLatestStories = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setStories(latestStoriesData);
      } catch (error) {
        console.error('Error fetching latest stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestStories();
  }, []);

  // Filter and sort stories
  const filteredStories = stories.filter(story => 
    selectedCategory === 'all' || story.category === selectedCategory
  ).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.views - a.views;
      case 'liked':
        return b.likes - a.likes;
      case 'read-time':
        return a.readTime - b.readTime;
      default: // latest
        return new Date(b.publishedDate) - new Date(a.publishedDate);
    }
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="latest-stories-loading">
        <div className="loading-spinner"></div>
        <p>Loading latest stories...</p>
      </div>
    );
  }

  return (
    <div className="latest-stories-page">
      {/* Header */}
      <div className="latest-stories-header">
        <h1>Latest Stories</h1>
        <p>Fresh perspectives and breaking stories from across the African continent</p>
      </div>

      {/* Controls */}
      <div className="stories-controls">
        <div className="filter-controls">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="latest">Latest First</option>
            <option value="popular">Most Viewed</option>
            <option value="liked">Most Liked</option>
            <option value="read-time">Quick Reads</option>
          </select>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="latest-stories-content">
        {filteredStories.length > 0 ? (
          <div className={`stories-grid ${viewMode}`}>
            {filteredStories.map(story => (
              <article key={story.id} className={`story-card ${viewMode}`}>
                <Link to={`/stories/${story.id}`} className="story-link">
                  <div className="story-image">
                    <img src={story.imageUrl} alt={story.title} loading="lazy" />
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
                        <span>📅 {formatDate(story.publishedDate)}</span>
                        <span>📖 {story.readTime} min</span>
                        <span>👁️ {story.views.toLocaleString()}</span>
                        <span>❤️ {story.likes}</span>
                      </div>
                    </div>
                    <div className="story-tags">
                      {story.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="story-tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="no-stories">
            <h3>No stories found</h3>
            <p>Try selecting a different category or check back later for new content.</p>
          </div>
        )}
      </div>

      {/* Load More */}
      <div className="load-more-section">
        <button className="load-more-btn">Load More Stories</button>
      </div>

      {/* Newsletter */}
      <div className="latest-stories-newsletter">
        <div className="newsletter-content">
          <h3>Stay Updated</h3>
          <p>Get the latest stories delivered to your inbox every morning.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>

      {/* Back Navigation */}
      <div className="back-navigation">
        <Link to="/stories" className="back-to-stories">
          ← Back to All Stories
        </Link>
      </div>
    </div>
  );
};

export default LatestStoriesPage;
