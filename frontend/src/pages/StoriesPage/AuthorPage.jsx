import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../services/api';
import { toast } from 'react-toastify';
import '../CommunityPage/ContributorDetailsPage.css';

const AuthorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Placeholder user ID - replace with actual user authentication
  const currentUserId = 1;

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
    return num.toString();
  };

  const getRandomColor = (name) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8B500', '#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9'
    ];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
      hash = (name || '').charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  useEffect(() => {
    const fetchAuthorData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiRequest.get(`/authors/${id}`);
        console.log('Full API Response:', JSON.stringify(response, null, 2));
        console.log('Response data:', response.data);
        console.log('Response data.data:', response.data?.data);
        console.log('Author avatar_url:', response.data?.data?.avatar_url);

        if (response && response.data && response.data.success) {
          setAuthor(response.data.data);
          setStories(response.data.data.stories || []);
          
          // Check if user is following this author
          const followResponse = await apiRequest.get(`/authors/${id}/follow/${currentUserId}`);
          if (followResponse && followResponse.data && followResponse.data.success) {
            setIsFollowing(followResponse.data.isFollowing);
          }
        } else {
          console.log('Invalid response structure:', response);
          setError('Author not found');
        }
      } catch (error) {
        console.error('Error fetching author data:', error);
        setError('Failed to load author data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAuthorData();
    }
  }, [id, currentUserId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleFollowToggle = async () => {
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

    setFollowLoading(true);
    try {
      if (isFollowing) {
        // Unfollow
        await apiRequest.delete(`/authors/${id}/follow`, { data: { user_id: currentUserId } });
        setIsFollowing(false);
        toast.success('Unfollowed author');
      } else {
        // Follow
        await apiRequest.post(`/authors/${id}/follow`, { user_id: currentUserId });
        setIsFollowing(true);
        toast.success('Following author');
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('Failed to follow author');
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="contributor-details-page">
        <div className="contributor-details-loading">
          <div className="skeleton-avatar" style={{ width: '130px', height: '130px', margin: '0 auto 20px' }}></div>
          <div className="skeleton-text" style={{ width: '60%', margin: '0 auto 10px' }}></div>
          <div className="skeleton-text short" style={{ width: '40%', margin: '0 auto' }}></div>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="contributor-details-page">
        <div className="contributor-not-found">
          <h2>Author not found</h2>
          <button onClick={() => navigate('/stories')}>Back to Stories</button>
        </div>
      </div>
    );
  }

  return (
    <div className="contributor-details-page">
      <div className="contributor-details-container">
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate('/stories')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Stories
        </button>

        {/* Header Section */}
        <div className="contributor-header">
          <div className="contributor-avatar-wrapper">
            {author.avatar_url ? (
              <img 
                src={author.avatar_url} 
                alt={author.name} 
                className="contributor-avatar-large"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="contributor-avatar-fallback-large"
              style={{ 
                display: author.avatar_url ? 'none' : 'flex',
                backgroundColor: getRandomColor(author.name)
              }}
            >
              {author.name?.charAt(0) || '?'}
            </div>
          </div>
          
          <div className="contributor-header-info">
            <div className="contributor-name-row">
              <h1 className="contributor-name-large">{author.name}</h1>
              <button 
                className={`follow-btn-large ${isFollowing ? 'following' : ''}`}
                onClick={handleFollowToggle}
                disabled={followLoading}
              >
                {followLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
            <p className="contributor-role-large">{author.role || 'Author'}</p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="contributor-content">
          {author.bio && (
            <div className="content-section">
              <h2 className="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                About
              </h2>
              <p className="section-text">{author.bio}</p>
            </div>
          )}

          <div className="content-section">
            <h2 className="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              Stories ({stories.length})
            </h2>
            <div className="articles-list">
              {stories.length > 0 ? (
                stories.map((story) => (
                  <a 
                    key={story.id} 
                    href={`/stories/${story.slug}`} 
                    className="article-item"
                  >
                    <div className="article-info">
                      <h4 className="article-title">{story.title}</h4>
                      <div className="article-meta">
                        <span className="article-category">{story.category_name || 'Story'}</span>
                        <span className="article-date">
                          {story.published_at ? new Date(story.published_at).toLocaleDateString() : 'Not published'}
                        </span>
                      </div>
                    </div>
                    <svg className="article-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </a>
                ))
              ) : (
                <div className="articles-loading">No stories published yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorPage;
