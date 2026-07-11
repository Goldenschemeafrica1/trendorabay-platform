import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ContributorDetailsPage.css';
import contributorService from '../../services/contributorService';
import { toast } from 'react-toastify';

const ContributorDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contributor, setContributor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [contributorArticles, setContributorArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [userId] = useState(1); // In real app, get from auth context

  useEffect(() => {
    const fetchContributorDetails = async () => {
      try {
        const response = await contributorService.getContributorById(id);
        let contributorDetails = null;
        
        if (response && response.data && response.data.success) {
          contributorDetails = response.data.data;
        } else if (response && response.data) {
          contributorDetails = response.data;
        } else {
          contributorDetails = response;
        }
        
        if (contributorDetails) {
          // Parse JSON fields with error handling
          let parsedExpertise = [];
          if (contributorDetails.expertise) {
            try {
              parsedExpertise = typeof contributorDetails.expertise === 'string' 
                ? JSON.parse(contributorDetails.expertise) 
                : contributorDetails.expertise;
            } catch (e) {
              // If parsing fails, treat as comma-separated string
              parsedExpertise = typeof contributorDetails.expertise === 'string'
                ? contributorDetails.expertise.split(',').map(s => s.trim()).filter(s => s)
                : [];
            }
          }

          let parsedAchievements = [];
          if (contributorDetails.achievements) {
            try {
              parsedAchievements = typeof contributorDetails.achievements === 'string'
                ? JSON.parse(contributorDetails.achievements)
                : contributorDetails.achievements;
            } catch (e) {
              // If parsing fails, treat as comma-separated string
              parsedAchievements = typeof contributorDetails.achievements === 'string'
                ? contributorDetails.achievements.split(',').map(s => s.trim()).filter(s => s)
                : [];
            }
          }

          contributorDetails = {
            ...contributorDetails,
            expertise: parsedExpertise,
            achievements: parsedAchievements,
            featured: Boolean(contributorDetails.featured),
            roleType: contributorDetails.role_type
          };
          setContributor(contributorDetails);
        }

        // Check follow status
        try {
          const followResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://192.168.100.4:3001'}/api/contributors/${id}/follow/${userId}`);
          const followData = await followResponse.json();
          if (followData.success && followData.isFollowing) {
            setFollowing(true);
          }
        } catch (error) {
          console.error('Error checking follow status:', error);
        }

        // Fetch contributor articles
        setArticlesLoading(true);
        const articlesResponse = await contributorService.getContributorArticles(id, 10);
        let articles = [];
        
        if (articlesResponse && articlesResponse.data && articlesResponse.data.success) {
          articles = articlesResponse.data.data || [];
        } else if (articlesResponse && articlesResponse.data) {
          articles = articlesResponse.data || [];
        }
        
        setContributorArticles(articles);
      } catch (error) {
        console.error('Error fetching contributor details:', error);
        toast.error('Failed to load contributor details');
      } finally {
        setLoading(false);
        setArticlesLoading(false);
      }
    };
    
    fetchContributorDetails();
  }, [id]);

  const toggleFollow = async () => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      toast.error('Please login to follow contributors', {
        position: "bottom-right",
        autoClose: 3000,
      });
      navigate('/login');
      return;
    }

    try {
      if (following) {
        // Unfollow
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://192.168.100.4:3001'}/api/contributors/${id}/follow`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId })
        });
        const data = await response.json();
        if (data.success) {
          setFollowing(false);
          toast.success('Unfollowed contributor');
        } else {
          toast.error(data.error || 'Failed to unfollow');
        }
      } else {
        // Follow
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://192.168.100.4:3001'}/api/contributors/${id}/follow`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId })
        });
        const data = await response.json();
        if (data.success) {
          setFollowing(true);
          toast.success('Following contributor');
        } else {
          toast.error(data.error || 'Failed to follow');
        }
      }
    } catch (error) {
      console.error('Follow error:', error);
      toast.error('Failed to follow contributor');
    }
  };

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

  if (!contributor) {
    return (
      <div className="contributor-details-page">
        <div className="contributor-not-found">
          <h2>Contributor not found</h2>
          <button onClick={() => navigate('/community/contributors')}>Back to Contributors</button>
        </div>
      </div>
    );
  }

  return (
    <div className="contributor-details-page">
      <div className="contributor-details-container">
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate('/community/contributors')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Contributors
        </button>

        {/* Header Section */}
        <div className="contributor-header">
          <div className="contributor-avatar-wrapper">
            {contributor.avatar ? (
              <img 
                src={contributor.avatar} 
                alt={contributor.name} 
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
                display: contributor.avatar ? 'none' : 'flex',
                backgroundColor: getRandomColor(contributor.name)
              }}
            >
              {contributor.name?.charAt(0) || '?'}
            </div>
            {contributor.featured && <span className="featured-badge">Featured</span>}
          </div>
          
          <div className="contributor-header-info">
            <div className="contributor-name-row">
              <h1 className="contributor-name-large">{contributor.name}</h1>
              <button 
                className={`follow-btn-large ${following ? 'following' : ''}`}
                onClick={toggleFollow}
              >
                {following ? 'Following' : 'Follow'}
              </button>
            </div>
            <p className="contributor-role-large">{contributor.role}</p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="contributor-content">
          {contributor.bio && (
            <div className="content-section">
              <h2 className="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                About
              </h2>
              <p className="section-text">{contributor.bio}</p>
            </div>
          )}

          {contributor.expertise && contributor.expertise.length > 0 && (
            <div className="content-section">
              <h2 className="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                Expertise
              </h2>
              <div className="expertise-list">
                {contributor.expertise.map((skill, index) => (
                  <span key={index} className="expertise-badge">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {contributor.achievements && contributor.achievements.length > 0 && (
            <div className="content-section">
              <h2 className="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="7"/>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                </svg>
                Achievements
              </h2>
              <ul className="achievements-list">
                {contributor.achievements.map((achievement, index) => (
                  <li key={index}>
                    <span className="achievement-icon">🏆</span>
                    {achievement}
                  </li>
                ))}
              </ul>
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
              Magazine Publications ({contributorArticles.length})
            </h2>
            <div className="articles-list">
              {articlesLoading ? (
                <div className="articles-loading">Loading publications...</div>
              ) : contributorArticles.length === 0 ? (
                <div className="articles-loading">No publications yet</div>
              ) : (
                contributorArticles.map((article) => (
                  <a 
                    key={article.id} 
                    href={`/magazines/${article.id}`} 
                    className="article-item"
                  >
                    <div className="article-info">
                      <h4 className="article-title">{article.description}</h4>
                      <div className="article-meta">
                        <span className="article-category">{article.category_name || 'Uncategorized'}</span>
                        <span className="article-date">
                          {article.published_at || article.published_date ? new Date(article.published_at || article.published_date).toLocaleDateString() : 'Not published'}
                        </span>
                      </div>
                    </div>
                    <svg className="article-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributorDetailsPage;
