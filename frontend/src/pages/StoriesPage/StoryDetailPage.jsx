import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useParams, Link } from 'react-router-dom';
import storyService from '../../services/storyService';
import { toast } from 'react-toastify';
import './StoriesPage.css';

const StoryDetailPage = () => {
  const { slug } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedStories, setRelatedStories] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [userId] = useState(1); // In real app, get from auth context
  const [advertisement, setAdvertisement] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      try {
        const response = await storyService.getStoryBySlug(slug);
        
        if (response && response.data) {
          setStory(response.data);
          
          // Check if user is following this author
          const authorId = response.data.author?.id || response.data.author_id;
          if (authorId) {
            try {
              const followResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/authors/${authorId}/follow/${userId}`);
              const followData = await followResponse.json();
              if (followData.success) {
                setIsFollowing(followData.isFollowing);
              }
            } catch (error) {
              console.error('Error checking follow status:', error);
            }
          }
          
          // Fetch related stories
          const relatedResponse = await storyService.getStories({ status: 'published', limit: 4 });
          let relatedStories = [];
          
          if (Array.isArray(relatedResponse)) {
            relatedStories = relatedResponse;
          } else if (relatedResponse && Array.isArray(relatedResponse.data)) {
            relatedStories = relatedResponse.data;
          }
          
          // Filter out current story and limit to 3
          const filteredRelated = relatedStories
            .filter(s => s.id !== parseInt(story?.id))
            .slice(0, 3);
          
          setRelatedStories(filteredRelated);
        } else {
          setStory(null);
        }
      } catch (error) {
        console.error('Error fetching story:', error);
        setStory(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchAdvertisement = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/advertisements?status=active`);
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          setAdvertisement(data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching advertisement:', error);
      }
    };

    // Make API calls in parallel for faster loading
    Promise.all([fetchStory(), fetchAdvertisement()]);
  }, [slug]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    if (!content || typeof content !== 'string') {
      return 5; // Default to 5 minutes if content is missing
    }
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleLike = async () => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      toast.error('Please login to like stories', {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const userObj = JSON.parse(user);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/stories/${story?.id}/like`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userObj.token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setLiked(data.liked);
        setLikesCount(data.likes);
        toast.success(data.liked ? 'Story liked!' : 'Like removed');
      } else {
        toast.error(data.error || 'Failed to like story');
      }
    } catch (error) {
      console.error('Like error:', error);
      toast.error('Failed to like story');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      toast.error('Please login to comment on stories', {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const userObj = JSON.parse(user);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/stories/${story?.id}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userObj.token}`
        },
        body: JSON.stringify({ content: commentText })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Comment post error:', errorData);
        toast.error(errorData.error || `Server error: ${response.status}`);
        return;
      }

      const data = await response.json();
      if (data.success) {
        setComments([data.data, ...comments]);
        setCommentText('');
        toast.success('Comment added!');
      } else {
        toast.error(data.error || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Comment error:', error);
      toast.error('Failed to add comment - check console for details');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: story.title,
          text: story.content?.substring(0, 200) || story.title,
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }

      // Track share in backend
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/stories/${story?.id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, platform: 'web' })
      });
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share story');
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleFollowAuthor = async () => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      toast.error('Please login to follow authors', {
        position: "bottom-right",
        autoClose: 3000,
      });
      navigate('/login');
      return;
    }

    const authorId = story.author?.id || story.author_id;
    if (!authorId) return;

    try {
      if (isFollowing) {
        // Unfollow
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/authors/${authorId}/follow`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId })
        });
        const data = await response.json();
        if (data.success) {
          setIsFollowing(false);
          toast.success('Unfollowed author');
        } else {
          toast.error(data.error || 'Failed to unfollow');
        }
      } else {
        // Follow
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/authors/${authorId}/follow`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId })
        });
        const data = await response.json();
        if (data.success) {
          setIsFollowing(true);
          toast.success('Following author');
        } else {
          toast.error(data.error || 'Failed to follow');
        }
      }
    } catch (error) {
      console.error('Follow error:', error);
      toast.error('Failed to follow author');
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/stories/${story?.id}/comments`);
        const data = await response.json();
        if (data.success) {
          setComments(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error);
        setComments([]); // Set empty array on error
      }
    };

    const fetchLikes = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/stories/${story?.id}/likes`);
        const data = await response.json();
        if (data.success) {
          setLikesCount(data.likes || 0);
        }
      } catch (error) {
        console.error('Failed to fetch likes:', error);
        setLikesCount(0); // Set 0 on error
      }
    };

    if (story?.id) {
      fetchComments();
      fetchLikes();
    }
  }, [story?.id]);

  // Scroll to top when story ID changes (mobile navigation)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [story?.id]);

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
      <div className="story-content-wrapper">
        <div className="story-content-container">
          {/* Main Content */}
          <article className="story-content">
            {/* Story Meta */}
            <div className="story-meta-bar">
              <div className="story-author-mini">
                <img
                  src={story.author_avatar || '/logo.jpeg'}
                  alt={story.author_name || 'Author'}
                  className="author-avatar-mini"
                  onError={(e) => {
                    e.target.src = '/logo.jpeg';
                  }}
                />
                <span className="author-name-mini">
                  {story.author_name || 'Unknown Author'}
                </span>
              </div>
              <div className="story-meta-info">
                {story.published_at && (
                  <span className="story-date-mini">
                    📅 {formatDate(story.published_at)}
                  </span>
                )}
                <span className="read-time-mini">
                  ⏱️ {calculateReadTime(story.content)} min read
                </span>
              </div>
            </div>

            {/* Story Title */}
            <h1 className="story-title">{story.title}</h1>

            {/* Featured Image */}
            {story.imageUrl && (
              <div className="story-featured-image">
                <img
                  src={story.imageUrl.startsWith('/') ? story.imageUrl : `/${story.imageUrl}`}
                  alt={story.title}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div
              className="story-body"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(story.content) }}
            />

            {/* Story Tags */}
            <div className="story-tags">
              {story.tags && Array.isArray(story.tags) && story.tags.map(tag => (
                <span key={tag} className="story-tag">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Engagement Bar */}
            <div className="story-engagement">
              <div className="engagement-stats">
                <button
                  className={`engagement-btn like-btn ${liked ? 'liked' : ''}`}
                  onClick={handleLike}
                >
                  ❤️ {likesCount || 0}
                </button>
                <button className="engagement-btn comment-btn" onClick={toggleComments}>
                  💬 {comments.length}
                </button>
                <button className="engagement-btn share-btn" onClick={handleShare}>
                  📤 Share
                </button>
              </div>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="comments-section">
                <h3>Comments ({comments.length})</h3>

                {/* Comment Form */}
                <form className="comment-form" onSubmit={handleComment}>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="comment-input"
                    rows="3"
                  />
                  <button type="submit" className="comment-submit-btn">
                    Post Comment
                  </button>
                </form>

                {/* Comments List */}
                <div className="comments-list">
                  {comments.length === 0 ? (
                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="comment-item">
                        <div className="comment-header">
                          <span className="comment-author">
                            {comment.first_name || comment.email || 'Anonymous'}
                          </span>
                          <span className="comment-date">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="comment-content">{comment.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </article>
        </div>

        {/* Sidebar */}
        <aside className="story-sidebar">
          {/* Author Card */}
          {story.author_name && (
            <div className="author-card">
              <img 
                src={story.author_avatar || '/logo.jpeg'} 
                alt={story.author_name || 'Author'} 
                onError={(e) => {
                  e.target.src = '/logo.jpeg';
                }}
              />
              <div className="author-info">
                <h3>{story.author_name || 'Unknown Author'}</h3>
                <p className="author-role">Author</p>
                {story.author_bio && <p className="author-bio">{story.author_bio}</p>}
                <button 
                  onClick={handleFollowAuthor}
                  className={`follow-author-btn ${isFollowing ? 'following' : ''}`}
                >
                  {isFollowing ? 'Following' : 'Follow Author'}
                </button>
              </div>
            </div>
          )}

          {/* Ad Section */}
          {advertisement && (
            <div className="ad-section">
              <div className="ad-content">
                {advertisement.image_url ? (
                  <a href={advertisement.link_url || advertisement.destination_url || '#'} target="_blank" rel="noopener noreferrer">
                    <img 
                      src={advertisement.image_url} 
                      alt={advertisement.title || 'Advertisement'} 
                      className="ad-image"
                    />
                  </a>
                ) : (
                  <div className="ad-placeholder">
                    <p>{advertisement.title || 'Advertisement Space'}</p>
                  </div>
                )}
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
