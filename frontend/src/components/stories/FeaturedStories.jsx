import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import storyService from '../../services/storyService';
import advertisementService from '../../services/advertisementService';
import './FeaturedStories.css';

const FeaturedStories = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [featuredStories, setFeaturedStories] = useState([]);
  const [horizontalStories, setHorizontalStories] = useState([]);
  const [mustReadStories, setMustReadStories] = useState([]);
  const [textOnlyStories, setTextOnlyStories] = useState([]);
  const [horizontalAd, setHorizontalAd] = useState(null);
  const [verticalAd, setVerticalAd] = useState(null);

  // Fetch all homepage stories in a single batched API call
  useEffect(() => {
    const fetchHomepageStories = async () => {
      try {
        const response = await storyService.getHomepageStories();
        
        if (response && response.data) {
          const transformStory = (story) => ({
            ...story,
            id: story.id || story._id || story.story_id,
            slug: story.slug || story.title?.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `story-${story.id || story._id || story.story_id}`,
            category: story.category || story.categoryName || story.category_name || story.category_id,
            image: story.imageUrl || story.featured_image_url,
            author: story.author?.name || story.author_name || 'Unknown Author',
            author_id: story.author?.id || story.author_id,
            author_avatar: story.author?.avatar || story.author_avatar || '/logo.jpeg',
            date: new Date(story.published_at || story.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase(),
            readTime: '5 MIN READ'
          });

          setFeaturedStories(response.data.featuredStories?.map(transformStory).filter(s => s.slug && s.slug !== 'undefined') || []);
          setHorizontalStories(response.data.horizontalStories?.map(transformStory).filter(s => s.slug && s.slug !== 'undefined') || []);
          setMustReadStories(response.data.mustReadStories?.map(transformStory).filter(s => s.slug && s.slug !== 'undefined') || []);
          setTextOnlyStories(response.data.textOnlyStories?.map(transformStory).map(s => ({ ...s, isLarger: true })).filter(s => s.slug && s.slug !== 'undefined') || []);
        }
      } catch (error) {
        console.error('Error fetching homepage stories:', error);
        setFeaturedStories([]);
        setHorizontalStories([]);
        setMustReadStories([]);
        setTextOnlyStories([]);
      }
    };

    fetchHomepageStories();
  }, []);

  // Fetch advertisements from API
  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await advertisementService.getAdvertisements({ status: 'active' });
        console.log('Advertisement response:', response);
        let ads = [];

        if (Array.isArray(response)) {
          ads = response;
        } else if (response && Array.isArray(response.data)) {
          ads = response.data;
        }

        console.log('Ads array:', ads);

        // Ensure ads have id field
        const transformedAds = ads.map(ad => ({
          ...ad,
          id: ad.id || ad._id || ad.advertisement_id
        }));

        console.log('Transformed ads:', transformedAds);

        const horizontal = transformedAds.find(ad => ad.position === 'horizontal');
        const vertical = transformedAds.find(ad => ad.position === 'vertical');

        console.log('Horizontal ad:', horizontal);
        console.log('Vertical ad:', vertical);

        setHorizontalAd(horizontal);
        setVerticalAd(vertical);
      } catch (error) {
        console.error('Error fetching advertisements:', error);
        setHorizontalAd(null);
        setVerticalAd(null);
      }
    };

    fetchAdvertisements();
  }, []);

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
              <span className="accent">✦</span> Featured Stories <span className="accent">✦</span>
            </h1>
          </div>
        </div>

        
        {/* Main Featured Story Layout */}
        <div className="featured-stories-grid">
          {/* Left Stories */}
          <div className="left-stories">
            {featuredStories.slice(1, 3).map((story, index) => (
              <Link to={`/stories/${story.slug}`} key={story.id}>
                <article
                  id={`left-story-${index}`}
                  className={`${(story.category === 'SPORTS' || story.category === 'BUSINESS') ? 'fashion-story-card' : 'side-story-card'} ${isVisible[`left-${index}`] ? 'visible' : ''}`}
                  style={{ transitionDelay: `${(index + 1) * 0.1}s` }}
                >
                {(story.category === 'SPORTS' || story.category === 'BUSINESS') ? (
                  // Sports & Business stories with image on top
                  <>
                    <div className="side-story-image-wrapper">
                      <img src={story.image || '/images/story-placeholder.jpg'} alt={story.title || 'Story'} loading="lazy" className="side-story-image" onError={(e) => { e.target.src = '/images/story-placeholder.jpg'; }} />
                      <span className={`side-story-category ${story.category === 'BUSINESS' ? 'business-category' : ''} ${story.category === 'SPORTS' ? 'sports-category' : ''}`}>{story.category || 'CATEGORY'}</span>
                    </div>

                    <div className="fashion-story-content">
                      <h3 className="side-story-title">{story.title}</h3>

                      <div className="side-story-footer">
                        <div className="side-story-author">
                          <img 
                            src={story.author_avatar || '/logo.jpeg'} 
                            alt={story.author || 'Author'} 
                            className="side-author-avatar"
                            onError={(e) => { e.target.src = '/logo.jpeg'; }}
                          />
                          <span className="side-author-name" onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/author/${story.author_id || story.author}`); }}>By {story.author}</span>
                          <span className="side-author-role">{story.authorTitle}</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Regular side story layout
                  <>
                    <div className="side-story-image-wrapper">
                      <img src={story.image || '/images/story-placeholder.jpg'} alt={story.title || 'Story'} onError={(e) => { e.target.src = '/images/story-placeholder.jpg'; }} loading="lazy" className="side-story-image" />
                      <span className="side-story-category">{story.category || 'CATEGORY'}</span>
                    </div>

                    <div className="side-story-content">
                      <h3 className="side-story-title">{story.title}</h3>

                      <div className="side-story-footer">
                        <div className="side-story-author">
                          <img 
                            src={story.author_avatar || '/logo.jpeg'} 
                            alt={story.author || 'Author'} 
                            className="side-author-avatar"
                            onError={(e) => { e.target.src = '/logo.jpeg'; }}
                          />
                          <span className="side-author-name" onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/author/${story.author_id || story.author}`); }}>By {story.author}</span>
                          <span className="side-author-role">{story.authorTitle}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </article>
              </Link>
            ))}
          </div>

          {/* Cover Story - Center Large */}
          <div className="cover-story">
            <Link to={`/stories/${featuredStories[3]?.slug}`}>
              <article className="main-story-card">
                <div className="main-story-image-wrapper">
                  <img
                    src={featuredStories[3]?.image || '/images/story-placeholder.jpg'}
                    alt={featuredStories[3]?.title || 'Cover Story'}
                    loading="lazy"
                    className="main-story-image"
                    onError={(e) => {
                      e.target.src = '/images/story-placeholder.jpg';
                    }}
                  />

                  {/* HOT TOPIC Badge - Desktop */}
                  <div className="hot-topic-badge desktop-hot-topic-badge">HOT TOPIC</div>

                  {/* HOT TOPIC Title Overlay */}
                  <div className="hot-topic-overlay">
                    {/* HOT TOPIC Badge - Mobile */}
                    <div className="hot-topic-badge mobile-hot-topic-badge">HOT TOPIC</div>
                    <h2 className="hot-topic-title">{featuredStories[3]?.title}</h2>
                  </div>
                </div>
              </article>
            </Link>
            
            {/* Mobile SPORTS Story - After Hot Topic */}
            <div className="mobile-sports-story">
              {featuredStories.find(story => story.category === 'SPORTS') && (
                <Link to={`/stories/${featuredStories.find(story => story.category === 'SPORTS')?.slug}`}>
                  <article className="mobile-sports-card">
                    <div className="mobile-sports-image-wrapper">
                      <img 
                        src={featuredStories.find(story => story.category === 'SPORTS')?.image || '/images/story-placeholder.jpg'} 
                        alt={featuredStories.find(story => story.category === 'SPORTS')?.title || 'Sports Story'} 
                        loading="lazy" 
                        className="mobile-sports-image" 
                      />
                      <span className="mobile-sports-category">SPORTS</span>
                    </div>
                    <div className="mobile-sports-content">
                      <h3 className="mobile-sports-title">
                        {featuredStories.find(story => story.category === 'SPORTS').title}
                      </h3>
                      <div className="mobile-sports-author">
                        By <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/author/${featuredStories.find(story => story.category === 'SPORTS').author_id || featuredStories.find(story => story.category === 'SPORTS').author}`); }}>{featuredStories.find(story => story.category === 'SPORTS').author}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              )}
            </div>

            {/* Mobile BUSINESS Story - After SPORTS */}
            <div className="mobile-business-story">
              {featuredStories.find(story => story.category === 'BUSINESS') && (
                <Link to={`/stories/${featuredStories.find(story => story.category === 'BUSINESS')?.slug}`}>
                  <article className="mobile-business-card">
                    <div className="mobile-business-image-wrapper">
                      <img 
                        src={featuredStories.find(story => story.category === 'BUSINESS')?.image || '/images/story-placeholder.jpg'} 
                        alt={featuredStories.find(story => story.category === 'BUSINESS')?.title || 'Business Story'} 
                        loading="lazy" 
                        className="mobile-business-image" 
                      />
                      <span className="mobile-business-category">BUSINESS</span>
                    </div>
                    <div className="mobile-business-content">
                      <h3 className="mobile-business-title">
                        {featuredStories.find(story => story.category === 'BUSINESS').title}
                      </h3>
                      <div className="mobile-business-author">
                        By <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/author/${featuredStories.find(story => story.category === 'BUSINESS').author_id || featuredStories.find(story => story.category === 'BUSINESS').author}`); }}>{featuredStories.find(story => story.category === 'BUSINESS').author}</span>
                      </div>
                    </div>
                  </article>
                </Link>
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
                  <Link to={`/stories/${story.slug}`} key={story.id}>
                    <div className="mobile-trending-story">
                      <span className="mobile-trending-arrow">➤</span>
                      <h4 className="mobile-trending-title">{story.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Horizontal Stories Section */}
            <div className="horizontal-stories-section">
              {/* Top Horizontal Stories Divider */}
              <div className="horizontal-stories-divider-top"></div>
              
              <div className="horizontal-stories-container">
                {horizontalStories.map((story, index) => (
                  <Link to={`/stories/${story.slug}`} key={story.id}>
                    <article
                      className={`horizontal-story-card ${story.category === 'TRAVEL' ? 'travel-card' : ''} ${story.category === 'FOOD' ? 'food-card' : ''} ${story.category === 'HEALTH' ? 'health-card' : ''} ${story.category === 'MUSIC' ? 'music-card' : ''}`}
                      style={{ transitionDelay: `${index * 0.1}s` }}
                    >
                    <div className="horizontal-story-image-wrapper">
                      <img src={story.image || '/images/story-placeholder.jpg'} alt={story.title || 'Story'} onError={(e) => { e.target.src = '/images/story-placeholder.jpg'; }} loading="lazy" className="horizontal-story-image" />
                      <span className={`horizontal-story-category ${story.category === 'BUSINESS' ? 'business-category' : ''} ${story.category === 'TECHNOLOGY' ? 'business-category' : ''} ${story.category === 'TRAVEL' ? 'travel-category' : ''} ${story.category === 'FOOD' ? 'food-category' : ''} ${story.category === 'MUSIC' ? 'music-category' : ''}`}>{story.category}</span>
                    </div>
                    <div className="horizontal-story-content">
                      <h3 className="horizontal-story-title">{story.title}</h3>
                    </div>
                    <div className="horizontal-story-author">
                      <img 
                        src={story.author_avatar || '/logo.jpeg'} 
                        alt={story.author || 'Author'} 
                        className="horizontal-author-avatar"
                        onError={(e) => { e.target.src = '/logo.jpeg'; }}
                      />
                      <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/author/${story.author_id || story.author}`); }} className={`horizontal-author-name ${story.category === 'BUSINESS' ? 'business-author-name' : ''} ${story.category === 'TECHNOLOGY' ? 'business-author-name' : ''} ${story.category === 'TRAVEL' ? 'travel-author-name' : ''} ${story.category === 'FOOD' ? 'food-author-name' : ''} ${story.category === 'HEALTH' ? 'health-author-name' : ''} ${story.category === 'MUSIC' ? 'music-author-name' : ''}`}>By {story.author}</span>
                      <span className="horizontal-author-role">{story.authorTitle}</span>
                    </div>
                  </article>
                  </Link>
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
                <Link to={`/stories/${story.slug}`} key={story.id}>
                  <div className="trending-story">
                    <span className="trending-arrow">➤</span>
                    <h4 className="trending-title">{story.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Advertisement Section */}
        <div className="advertisement-section-wrapper">
          <div className="ad-label">Advertisement</div>
          <div className="advertisement-section">
            {horizontalAd ? (
              <a href={horizontalAd.destination_url || horizontalAd.link_url || '#'} target="_blank" rel="noopener noreferrer">
                <img
                  src={horizontalAd.image_url || horizontalAd.mobile_image_url || '/images/story-placeholder.jpg'}
                  alt={horizontalAd.title || 'Advertisement'}
                  className="ad-image"
                  loading="lazy"
                  onError={(e) => {
                    console.error('Ad image failed to load:', horizontalAd.image_url);
                    e.target.src = '/images/story-placeholder.jpg';
                  }}
                  onLoad={() => {
                    console.log('Ad image loaded successfully:', horizontalAd.image_url);
                  }}
                />
              </a>
            ) : (
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=300&fit=crop"
                alt="Advertisement"
                className="ad-image"
                loading="lazy"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStories;
