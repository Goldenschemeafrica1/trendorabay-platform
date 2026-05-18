import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './StoriesPage.css';

const AuthorPage = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample authors data
  const authorsData = {
    'makena-njeri': {
      id: 'makena-njeri',
      name: 'Makena Njeri',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      role: 'Senior Editor',
      bio: 'Makena is an award-winning journalist covering African innovation and entrepreneurship. Based in Nairobi, she has reported on tech ecosystems across the continent for over a decade. Her work focuses on the intersection of technology, culture, and economic development in Africa.',
      email: 'makena.njeri@trendorabay.com',
      social: {
        twitter: '@makenanjeri',
        linkedin: 'makena-njeri',
        instagram: '@makenawrites'
      },
      stats: {
        stories: 47,
        views: '1.2M',
        followers: 15420
      }
    },
    'zuri-makena': {
      id: 'zuri-makena',
      name: 'Zuri Makena',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      role: 'Fashion Editor',
      bio: 'Zuri is a fashion journalist and cultural commentator who explores the intersection of African traditional aesthetics and contemporary design. She has been instrumental in bringing African fashion to global audiences.',
      email: 'zuri.makena@trendorabay.com',
      social: {
        twitter: '@zurimakena',
        instagram: '@zuristyle'
      },
      stats: {
        stories: 32,
        views: '890K',
        followers: 8930
      }
    }
  };

  // Sample stories data
  const allStories = [
    {
      id: 1,
      title: "How Kenyan Youth Are Redefining The Pan-African Startup Economy",
      excerpt: "From Nairobi to Lagos, a new wave of founders is shaping tomorrow's fintech, climate, and culture. The numbers are staggering...",
      category: "startups",
      subcategory: "Impact Stories",
      image: "https://images.unsplash.com/photo-1523800503107-5bc3ba2a6f81?w=800&h=500&fit=crop",
      author: 'makena-njeri',
      publishDate: "2026-04-24",
      readTime: "8 min read",
      views: 15420,
      likes: 2341,
      comments: 156,
      featured: true,
      tags: ["Startups", "Innovation", "Kenya", "Pan-African"]
    },
    {
      id: 2,
      title: "The Rise of Neo-African Streetwear: From Kenya to NY",
      excerpt: "African streetwear is having a moment on global runways. Local designers blend traditional textiles with modern silhouettes...",
      category: "fashion",
      subcategory: "Fashion & Style",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=500&fit=crop",
      author: 'zuri-makena',
      publishDate: "2026-04-22",
      readTime: "6 min read",
      views: 9820,
      likes: 1567,
      comments: 89,
      featured: false,
      tags: ["Fashion", "Streetwear", "Design", "Culture"]
    },
    {
      id: 3,
      title: "From Refugee to Tech CEO: The Inspiring Story of Mamadou Diallo",
      excerpt: "How one man's journey from a refugee camp to building a multi-million dollar tech company is inspiring a generation...",
      category: "impact",
      subcategory: "Impact Stories",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=500&fit=crop",
      author: 'makena-njeri',
      publishDate: "2026-04-03",
      readTime: "11 min read",
      views: 25430,
      likes: 4123,
      comments: 289,
      featured: true,
      tags: ["Impact", "Inspiration", "Entrepreneurship"]
    }
  ];

  useEffect(() => {
    const fetchAuthorData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const authorData = authorsData[id];
        setAuthor(authorData);
        
        // Get stories by this author
        const authorStories = allStories.filter(story => story.author === id);
        setStories(authorStories);
      } catch (error) {
        console.error('Error fetching author data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="author-page-loading">
        <div className="loading-spinner"></div>
        <p>Loading author profile...</p>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="author-not-found">
        <h2>Author Not Found</h2>
        <p>The author you're looking for doesn't exist or has been removed.</p>
        <Link to="/stories" className="back-to-stories">
          ← Back to Stories
        </Link>
      </div>
    );
  }

  return (
    <div className="author-page">
      {/* Author Header */}
      <div className="author-header">
        <div className="author-hero">
          <div className="author-avatar">
            <img src={author.avatar} alt={author.name} />
          </div>
          <div className="author-hero-content">
            <h1 className="author-name">{author.name}</h1>
            <p className="author-role">{author.role}</p>
            <p className="author-bio">{author.bio}</p>
            
            {/* Author Stats */}
            <div className="author-stats">
              <div className="stat-item">
                <span className="stat-number">{author.stats.stories}</span>
                <span className="stat-label">Stories</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{author.stats.views}</span>
                <span className="stat-label">Views</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{author.stats.followers.toLocaleString()}</span>
                <span className="stat-label">Followers</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="author-social">
              <a href={`https://twitter.com/${author.social.twitter}`} target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
              {author.social.linkedin && (
                <a href={`https://linkedin.com/in/${author.social.linkedin}`} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
              {author.social.instagram && (
                <a href={`https://instagram.com/${author.social.instagram}`} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              )}
              <a href={`mailto:${author.email}`}>
                Contact
              </a>
            </div>

            <button className="follow-author-btn">Follow Author</button>
          </div>
        </div>
      </div>

      <div className="author-content">
        {/* Author's Stories */}
        <section className="author-stories">
          <h2>Stories by {author.name}</h2>
          
          {stories.length > 0 ? (
            <div className="author-stories-grid">
              {stories.map(story => (
                <article key={story.id} className="story-card">
                  <Link to={`/stories/${story.id}`} className="story-link">
                    <div className="story-image">
                      <img src={story.image} alt={story.title} />
                      {story.featured && <span className="featured-tag">Featured</span>}
                    </div>
                    <div className="story-content">
                      <div className="story-category">{story.subcategory}</div>
                      <h3 className="story-title">{story.title}</h3>
                      <p className="story-excerpt">{story.excerpt}</p>
                      <div className="story-meta">
                        <span>📅 {formatDate(story.publishDate)}</span>
                        <span>📖 {story.readTime}</span>
                        <span>👁️ {story.views.toLocaleString()}</span>
                        <span>❤️ {story.likes.toLocaleString()}</span>
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
              <p>No stories published by this author yet.</p>
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside className="author-sidebar">
          {/* Newsletter */}
          <div className="newsletter-card">
            <h3>Subscribe to {author.name}</h3>
            <p>Get notified when {author.name} publishes new stories.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Your email address" />
              <button>Subscribe</button>
            </div>
          </div>

          {/* Popular Categories */}
          <div className="categories-card">
            <h3>Popular Categories</h3>
            <div className="category-list">
              {['Startups', 'Fashion', 'Innovation', 'Culture', 'Technology'].map(category => (
                <Link key={category} to={`/stories?category=${category.toLowerCase()}`} className="category-link">
                  {category}
                </Link>
              ))}
            </div>
          </div>

          {/* Back to Stories */}
          <div className="back-navigation">
            <Link to="/stories" className="back-to-stories">
              ← Back to All Stories
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AuthorPage;
