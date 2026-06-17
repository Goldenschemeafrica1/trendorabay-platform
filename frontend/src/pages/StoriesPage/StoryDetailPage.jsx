import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';
import './StoriesPage.css';

const StoryDetailPage = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedStories, setRelatedStories] = useState([]);

  // Sample story data - in a real app, this would come from an API
  const storiesData = [
    {
      id: 1,
      title: "How Kenyan Youth Are Redefining The Pan-African Startup Economy",
      content: `
        <p>From Nairobi to Lagos, a new wave of young entrepreneurs is reshaping Africa's economic landscape. These founders aren't just building companies; they're crafting solutions to some of the continent's most pressing challenges.</p>
        
        <h2>The Numbers Don't Lie</h2>
        <p>African startups raised over $5 billion in funding last year, with Kenyan youth leading the charge. The fintech sector alone saw a 300% increase in investment, proving that innovation thrives when necessity meets opportunity.</p>
        
        <h2>Breaking Barriers</h2>
        <p>What makes these founders remarkable isn't just their technical prowess, but their deep understanding of local contexts. They're not copying Silicon Valley models; they're creating uniquely African solutions that address real needs.</p>
        
        <h2>The Road Ahead</h2>
        <p>As we look toward the future, one thing is clear: the African startup ecosystem is just getting started. With increased access to capital, mentorship, and global markets, the next decade promises even greater breakthroughs.</p>
      `,
      excerpt: "From Nairobi to Lagos, a new wave of founders is shaping tomorrow's fintech, climate, and culture. The numbers are staggering...",
      category: "startups",
      subcategory: "Impact Stories",
      image: "https://images.unsplash.com/photo-1523800503107-5bc3ba2a6f81?w=1200&h=600&fit=crop",
      author: {
        name: "Makena Njeri",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop",
        role: "Senior Editor",
        bio: "Makena is an award-winning journalist covering African innovation and entrepreneurship. Based in Nairobi, she has reported on tech ecosystems across the continent."
      },
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
      content: `<p>African streetwear is having a moment on global runways...</p>`,
      excerpt: "African streetwear is having a moment on global runways. Local designers blend traditional textiles with modern silhouettes...",
      category: "fashion",
      subcategory: "Fashion & Style",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=500&fit=crop",
      author: {
        name: "Zuri Makena",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop",
        role: "Fashion Editor"
      },
      publishDate: "2026-04-22",
      readTime: "6 min read",
      views: 9820,
      likes: 1567,
      comments: 89,
      featured: false,
      tags: ["Fashion", "Streetwear", "Design", "Culture"]
    }
  ];

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundStory = storiesData.find(s => s.id === parseInt(id));
        setStory(foundStory);
        
        // Set related stories (same category, excluding current story)
        if (foundStory) {
          const related = storiesData.filter(s => 
            s.category === foundStory.category && s.id !== foundStory.id
          );
          setRelatedStories(related);
        }
      } catch (error) {
        console.error('Error fetching story:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  if (loading) {
    return (
      <div className="story-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading story...</p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="story-not-found">
        <h2>Story Not Found</h2>
        <p>The story you're looking for doesn't exist or has been removed.</p>
        <Link to="/stories" className="back-to-stories">
          ← Back to Stories
        </Link>
      </div>
    );
  }

  return (
    <div className="story-detail-page">
      {/* Hero Section */}
      <div className="story-hero">
        <div className="story-hero-image">
          <img src={story.image} alt={story.title} />
          <div className="image-overlay"></div>
        </div>
        <div className="story-hero-content">
          <div className="story-category">{story.subcategory}</div>
          <h1 className="story-title">{story.title}</h1>
          <div className="story-meta">
            <div className="story-author">
              <img src={story.author.avatar} alt={story.author.name} />
              <div>
                <span className="author-name">{story.author.name}</span>
                <span className="author-role">{story.author.role}</span>
              </div>
            </div>
            <div className="story-stats">
              <span>📅 {formatDate(story.publishDate)}</span>
              <span>📖 {story.readTime}</span>
              <span>👁️ {story.views.toLocaleString()} views</span>
            </div>
          </div>
        </div>
      </div>

      <div className="story-content-container">
        {/* Main Content */}
        <article className="story-content">
          <div className="story-excerpt">
            <p>{story.excerpt}</p>
          </div>
          
          <div 
            className="story-body"
            dangerouslySetInnerHTML={{ __html: story.content }}
          />

          {/* Story Tags */}
          <div className="story-tags">
            {story.tags.map(tag => (
              <span key={tag} className="story-tag">
                #{tag}
              </span>
            ))}
          </div>

          {/* Engagement Bar */}
          <div className="story-engagement">
            <div className="engagement-stats">
              <button className="engagement-btn like-btn">
                ❤️ {story.likes.toLocaleString()}
              </button>
              <button className="engagement-btn comment-btn">
                💬 {story.comments}
              </button>
              <button className="engagement-btn share-btn">
                📤 Share
              </button>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="story-sidebar">
          {/* Author Card */}
          <div className="author-card">
            <img src={story.author.avatar} alt={story.author.name} />
            <div className="author-info">
              <h3>{story.author.name}</h3>
              <p className="author-role">{story.author.role}</p>
              {story.author.bio && <p className="author-bio">{story.author.bio}</p>}
              <Link to={`/author/${story.author.name.toLowerCase().replace(' ', '-')}`} className="follow-author-btn">
                Follow Author
              </Link>
            </div>
          </div>

          {/* Related Stories */}
          {relatedStories.length > 0 && (
            <div className="related-stories">
              <h3>Related Stories</h3>
              <div className="related-stories-list">
                {relatedStories.map(relatedStory => (
                  <Link 
                    key={relatedStory.id} 
                    to={`/stories/${relatedStory.id}`}
                    className="related-story-card"
                  >
                    <img src={relatedStory.image} alt={relatedStory.title} />
                    <div className="related-story-info">
                      <h4>{relatedStory.title}</h4>
                      <p>{relatedStory.excerpt}</p>
                      <span className="related-story-meta">
                        {relatedStory.readTime} • {relatedStory.likes.toLocaleString()} likes
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Newsletter Signup */}
          <div className="newsletter-card">
            <h3>Stay Updated</h3>
            <p>Get the latest stories delivered to your inbox weekly.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Your email address" />
              <button>Subscribe</button>
            </div>
          </div>
        </aside>
      </div>

      {/* Back Navigation */}
      <div className="story-navigation">
        <Link to="/stories/latest" className="back-to-stories">
          ← Back to All Stories
        </Link>
      </div>
    </div>
  );
};

export default StoryDetailPage;
