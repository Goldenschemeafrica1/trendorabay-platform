import React, { useState, useEffect } from 'react';
import './FeaturedStories.css';

const FeaturedStories = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [email, setEmail] = useState('');

  // Featured stories data with rich content
  const featuredStories = [
    {
      id: 1,
      category: 'MOST POPULAR',
      title: 'The African startup ecosystem is booming like never before',
      author: 'CHINWE OKONKWO',
      readTime: '12 MIN READ',
      date: 'MARCH 2024',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: '🔥'
    },
    {
      id: 2,
      category: 'SPORTS',
      title: 'African athletes make history with record-breaking performances at international championships',
      author: 'AMINA DIALLO',
      image: 'https://images.unsplash.com/photo-1537832816519-689ad163238b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 3,
      category: 'BUSINESS',
      title: 'Nairobi tech scene: Africa\'s Silicon Valley',
      author: 'DAVID MWANGI',
      image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 4,
      category: 'HOT TOPIC',
      title: 'Afrobeats takes over the global music charts',
      image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 5,
      category: 'BREAKING',
      title: 'African athletes dominate European football leagues',
      author: 'SAMUEL ODE',
      readTime: '7 MIN READ',
      date: 'MAR 15, 2024',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      gradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
      icon: '⚽'
    },
    {
      id: 6,
      category: 'FEATURED',
      title: 'African cinema gains international recognition',
      author: 'FATIMA KANE',
      readTime: '9 MIN READ',
      date: 'MAR 14, 2024',
      image: 'https://images.unsplash.com/photo-1489599211225-906d4be85c3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      icon: '🎬'
    }
  ];

  // Horizontal stories data for bottom section
  const horizontalStories = [
    {
      id: 6,
      category: 'TECHNOLOGY',
      title: 'African unicorns reshape investment landscape',
      description: 'From startup hubs to billion-dollar valuations, explore how African tech companies are transforming the continent\'s economic future.',
      author: 'SARAH JOHNSON',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 7,
      category: 'TRAVEL',
      title: 'Africa\'s hidden gems become tourist hotspots',
      description: 'Discover the untouched beaches, ancient cities, and wildlife reserves that are putting Africa on the global tourism map.',
      author: 'MARCUS TRAVEL',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 8,
      category: 'FOOD',
      title: 'African cuisine gets Michelin recognition',
      description: 'Traditional recipes and modern fusion techniques earn African chefs prestigious culinary awards worldwide.',
      author: 'EMILY CHEF',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 10,
      category: 'MUSIC',
      title: 'Afrobeats artists sign major record deals',
      description: 'From Lagos to Los Angeles, African musicians are landing contracts with global music giants.',
      author: 'ALEXA MELODY',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
  ];

  // Must read stories data
  const mustReadStories = [
    {
      id: 11,
      category: 'POLITICS',
      title: 'African Union announces new economic partnership initiatives',
      author: 'JAMES KUMARO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 12,
      category: 'CULTURE',
      title: 'Traditional African art forms gain global recognition',
      author: 'AMARA DIALLO',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 13,
      category: 'EDUCATION',
      title: 'African universities rank among world\'s best innovation hubs',
      author: 'DR. SARAH MBANE',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 14,
      category: 'ENVIRONMENT',
      title: 'Renewable energy projects transform African landscapes',
      author: 'MICHAEL GREEN',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
  ];

  // Intersection observer for scroll animations
  useEffect(() => {
    const observers = {};
    
    // Make stories visible immediately as fallback
    setTimeout(() => {
      setIsVisible(prev => ({
        ...prev,
        'left-0': true,
        'left-1': true
      }));
    }, 100);
    
    // Observe left stories
    for (let i = 0; i < 2; i++) {
      const element = document.getElementById(`left-story-${i}`);
      if (element) {
        observers[`left-${i}`] = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                setIsVisible(prev => ({ ...prev, [`left-${i}`]: true }));
              }
            });
          },
          { threshold: 0.2 }
        );
        observers[`left-${i}`].observe(element);
      }
    }
    
    
    return () => {
      Object.values(observers).forEach(observer => observer.disconnect());
    };
  }, []);

  // Auto-rotate main feature
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredStories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredStories.length]);

  // Handle newsletter submission
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with email: ${email}`);
      setEmail('');
    }
  };

  // Handle writer button clicks
  const handleBecomeWriter = () => {
    alert('Redirecting to writer application form...');
  };

  const handleSubmissionGuidelines = () => {
    alert('Opening submission guidelines...');
  };

  return (
    <section className="most-read-section">
      {/* Ambient Background */}
      <div className="ambient-bg">
        <div className="gradient-orb orb1"></div>
        <div className="gradient-orb orb2"></div>
        <div className="gradient-orb orb3"></div>
      </div>

      <div className="container">
        {/* Editorial Header */}
        <div className="editorial-header">
          <div className="header-left">
            <h1 className="main-headline">
              <span className="headline-gold">Featured</span> Stories
            </h1>
          </div>
          
          <div className="header-right">
            <button className="elegant-button">
              <span>readmore</span>
              <svg className="button-arrow" viewBox="0 0 24 24" width="20" height="20">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </button>
          </div>
        </div>

        
        {/* Main Featured Story Layout */}
        <div className="featured-stories-grid">
          {/* Left Stories */}
          <div className="left-stories">
            {featuredStories.slice(1, 3).map((story, index) => (
              <article
                key={story.id}
                id={`left-story-${index}`}
                className={`${(story.category === 'SPORTS' || story.category === 'BUSINESS') ? 'fashion-story-card' : 'side-story-card'} ${isVisible[`left-${index}`] ? 'visible' : ''}`}
                style={{ transitionDelay: `${(index + 1) * 0.1}s` }}
              >
                {(story.category === 'SPORTS' || story.category === 'BUSINESS') ? (
                  // Sports & Business stories with image on top
                  <>
                    <img src={story.image} alt={story.title} loading="lazy" className="side-story-image" />

                    <div className="fashion-story-content">
                      <span className={`side-story-category ${story.category === 'BUSINESS' ? 'business-category' : ''} ${story.category === 'SPORTS' ? 'sports-category' : ''}`}>{story.category}</span>
                      <h3 className="side-story-title">{story.title}</h3>
                      
                      <div className="side-story-footer">
                        <div className="side-story-author">
                          <span className="side-author-name">By {story.author}</span>
                          <span className="side-author-role">{story.authorTitle}</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Regular side story layout
                  <>
                    <img src={story.image} alt={story.title} loading="lazy" className="side-story-image" />

                    <div className="side-story-content">
                      <span className="side-story-category">{story.category}</span>
                      <h3 className="side-story-title">{story.title}</h3>
                      
                      <div className="side-story-footer">
                        <div className="side-story-author">
                          <span className="side-author-name">By {story.author}</span>
                          <span className="side-author-role">{story.authorTitle}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>

          {/* Cover Story - Center Large */}
          <div className="cover-story">
            <article className="main-story-card">
              <div className="main-story-image-wrapper">
                <img 
                  src={featuredStories[3].image} 
                  alt={featuredStories[3].title} 
                  loading="lazy" 
                  className="main-story-image"
                />
                
                {/* HOT TOPIC Title Overlay */}
                <div className="hot-topic-overlay">
                  <div className="hot-topic-badge">HOT TOPIC</div>
                  <h2 className="hot-topic-title">Afrobeats takes over the global music charts</h2>
                </div>
              </div>
              
              <div className="main-story-content">
              </div>
            </article>
            
            {/* Mobile SPORTS Story - After Hot Topic */}
            <div className="mobile-sports-story">
              {featuredStories.find(story => story.category === 'SPORTS') && (
                <article className="mobile-sports-card">
                  <img 
                    src={featuredStories.find(story => story.category === 'SPORTS').image} 
                    alt={featuredStories.find(story => story.category === 'SPORTS').title} 
                    loading="lazy" 
                    className="mobile-sports-image" 
                  />
                  <div className="mobile-sports-content">
                    <span className="mobile-sports-category">SPORTS</span>
                    <h3 className="mobile-sports-title">
                      {featuredStories.find(story => story.category === 'SPORTS').title}
                    </h3>
                    <div className="mobile-sports-author">
                      By {featuredStories.find(story => story.category === 'SPORTS').author}
                    </div>
                  </div>
                </article>
              )}
            </div>

            {/* Mobile BUSINESS Story - After SPORTS */}
            <div className="mobile-business-story">
              {featuredStories.find(story => story.category === 'BUSINESS') && (
                <article className="mobile-business-card">
                  <img 
                    src={featuredStories.find(story => story.category === 'BUSINESS').image} 
                    alt={featuredStories.find(story => story.category === 'BUSINESS').title} 
                    loading="lazy" 
                    className="mobile-business-image" 
                  />
                  <div className="mobile-business-content">
                    <span className="mobile-business-category">BUSINESS</span>
                    <h3 className="mobile-business-title">
                      {featuredStories.find(story => story.category === 'BUSINESS').title}
                    </h3>
                    <div className="mobile-business-author">
                      By {featuredStories.find(story => story.category === 'BUSINESS').author}
                    </div>
                  </div>
                </article>
              )}
            </div>

            {/* Mobile Trending Section - After BUSINESS */}
            <div className="mobile-trending-section">
              <h3 className="mobile-trending-header">
                Trending
                <svg className="trending-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                </svg>
              </h3>
              <div className="mobile-trending-stories">
                {featuredStories.slice(0, 6).map((story, index) => (
                  <div key={story.id} className="mobile-trending-story">
                    <span className="mobile-trending-number">{index + 1}</span>
                    <h4 className="mobile-trending-title">{story.title}</h4>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Horizontal Stories Section */}
            <div className="horizontal-stories-section">
              {/* Top Horizontal Stories Divider */}
              <div className="horizontal-stories-divider-top"></div>
              
              <div className="horizontal-stories-container">
                {horizontalStories.map((story, index) => (
                  <article
                    key={story.id}
                    className={`horizontal-story-card ${story.category === 'TRAVEL' ? 'travel-card' : ''} ${story.category === 'FOOD' ? 'food-card' : ''} ${story.category === 'HEALTH' ? 'health-card' : ''} ${story.category === 'MUSIC' ? 'music-card' : ''}`}
                    style={{ transitionDelay: `${index * 0.1}s` }}
                  >
                    <img src={story.image} alt={story.title} loading="lazy" className="horizontal-story-image" />
                    <div className="horizontal-story-content">
                      <span className={`horizontal-story-category ${story.category === 'BUSINESS' ? 'business-category' : ''} ${story.category === 'TECHNOLOGY' ? 'business-category' : ''} ${story.category === 'TRAVEL' ? 'travel-category' : ''} ${story.category === 'FOOD' ? 'food-category' : ''} ${story.category === 'MUSIC' ? 'music-category' : ''}`}>{story.category}</span>
                      <h3 className="horizontal-story-title">{story.title}</h3>
                      <div className="horizontal-story-footer">
                        <div className="horizontal-story-author">
                          <span className={`horizontal-author-name ${story.category === 'BUSINESS' ? 'business-author-name' : ''} ${story.category === 'TECHNOLOGY' ? 'business-author-name' : ''} ${story.category === 'TRAVEL' ? 'travel-author-name' : ''} ${story.category === 'FOOD' ? 'food-author-name' : ''} ${story.category === 'HEALTH' ? 'health-author-name' : ''} ${story.category === 'MUSIC' ? 'music-author-name' : ''}`}>By {story.author}</span>
                          <span className="horizontal-author-role">{story.authorTitle}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Horizontal Stories Divider */}
            <div className="horizontal-stories-divider"></div>
          </div>

          {/* Right Trending Stories */}
          <div className="right-trending">
            <h3 className="trending-header">
  Trending
  <svg className="trending-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
  </svg>
</h3>
            <div className="trending-stories">
              {featuredStories.slice(0, 6).map((story, index) => (
                <div key={story.id} className="trending-story">
                  <span className="trending-number">{index + 1}</span>
                  <h4 className="trending-title">{story.title}</h4>
                </div>
              ))}
            </div>
          </div>

                  </div>

        {/* Advertisement Section */}
        <div className="advertisement-section-wrapper">
          <div className="ad-label">Advertisement</div>
          <div className="advertisement-section">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=300&fit=crop"
              alt="Advertisement"
              className="ad-image"
              loading="lazy"
            />
          </div>
        </div>

        {/* Must Read Section */}
        <div className="must-read-section-wrapper">
          <div className="must-read-header">
            <h2 className="must-read-title">
              <span className="must-read-gold">Must</span> Read
            </h2>
          </div>
          <div className="must-read-stories-container">
            {mustReadStories.map((story, index) => (
              <article
                key={story.id}
                className="must-read-story-card"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <img src={story.image} alt={story.title} loading="lazy" className="must-read-story-image" />
                <div className="must-read-story-content">
                  <span className="must-read-story-category">{story.category}</span>
                  <h3 className="must-read-story-title">{story.title}</h3>
                  <div className="must-read-story-footer">
                    <span className="must-read-author">By {story.author}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="newsletter-writers-section-wrapper">
          <div className="newsletter-writers-container">
            <div className="newsletter-section">
              <div className="newsletter-content">
                <h3 className="newsletter-title">
                  <span className="newsletter-gold">Stay</span> Connected
                </h3>
                <p className="newsletter-description">
                  Get the latest African stories, exclusive content, and cultural insights delivered to your inbox weekly.
                </p>
                <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                  <div className="form-group">
                    <input 
                      type="email" 
                      placeholder="Enter your email address" 
                      className="newsletter-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button type="submit" className="newsletter-button">
                      Subscribe
                    </button>
                  </div>
                                  </form>

                {/* Share Your Voice Section - Now inside newsletter */}
                <div className="share-voice-section">
                  <div className="share-voice-card">
                    <h4 className="share-voice-title">
                      <span className="share-voice-gold">Share</span> Your Voice
                    </h4>
                    <p className="share-voice-description">
                      Share your African stories with our global writer community.
                    </p>
                    <div className="share-voice-buttons">
                      <button className="share-voice-btn-primary" onClick={handleBecomeWriter}>Become a Writer</button>
                      <button className="share-voice-btn-secondary" onClick={handleSubmissionGuidelines}>Submission Guidelines</button>
                    </div>
                  </div>
                  
                  <div className="membership-card">
                    <h4 className="membership-title">
                      <span className="membership-gold">Join</span> Our Community
                    </h4>
                    <p className="membership-description">
                      Get exclusive access to premium content, workshops, and networking with African creators.
                    </p>
                    <button className="membership-btn" onClick={handleBecomeWriter}>Become a Member</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

              </div>
    </section>
  );
};

export default FeaturedStories;
