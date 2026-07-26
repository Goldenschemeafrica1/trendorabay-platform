import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContributorsPage.css';
import contributorService from '../../services/contributorService';
import { toast } from 'react-toastify';

const ContributorsPage = () => {
  const navigate = useNavigate();
  const [contributors, setContributors] = useState([]);
  const [selectedRole, setSelectedRole] = useState('all');
  const [loading, setLoading] = useState(true);
  const [filteredContributors, setFilteredContributors] = useState([]);
  const [following, setFollowing] = useState(new Set());
  const [userId] = useState(1); // In real app, get from auth context

  // Contributor roles for filtering
  const roles = [
    { id: 'all', name: 'All Contributors' },
    { id: 'writer', name: 'Writers' },
    { id: 'editor', name: 'Editors' },
    { id: 'photographer', name: 'Photographers' },
    { id: 'illustrator', name: 'Illustrators' },
    { id: 'podcaster', name: 'Podcasters' }
  ];

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await contributorService.getContributors({ status: 'active' });
        let contributors = [];
        
        // Handle axios response structure
        if (response && response.data && response.data.success && Array.isArray(response.data.data)) {
          contributors = response.data.data;
        } else if (response && Array.isArray(response.data)) {
          contributors = response.data;
        } else if (Array.isArray(response)) {
          contributors = response;
        }
        
        // Parse JSON fields from database with error handling
        contributors = contributors.map(c => {
          let parsedExpertise = [];
          if (c.expertise) {
            try {
              parsedExpertise = typeof c.expertise === 'string' 
                ? JSON.parse(c.expertise) 
                : c.expertise;
            } catch (e) {
              // If parsing fails, treat as comma-separated string
              parsedExpertise = typeof c.expertise === 'string'
                ? c.expertise.split(',').map(s => s.trim()).filter(s => s)
                : [];
            }
          }

          let parsedAchievements = [];
          if (c.achievements) {
            try {
              parsedAchievements = typeof c.achievements === 'string'
                ? JSON.parse(c.achievements)
                : c.achievements;
            } catch (e) {
              // If parsing fails, treat as comma-separated string
              parsedAchievements = typeof c.achievements === 'string'
                ? c.achievements.split(',').map(s => s.trim()).filter(s => s)
                : [];
            }
          }

          return {
            ...c,
            expertise: parsedExpertise,
            achievements: parsedAchievements,
            featured: Boolean(c.featured),
            roleType: c.role_type
          };
        });
        
        setContributors(contributors);
        setFilteredContributors(contributors);

        // Check follow status for each contributor
        const followStatus = new Set();
        for (const contributor of contributors) {
          try {
            const followResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/contributors/${contributor.id}/follow/${userId}`);
            const followData = await followResponse.json();
            if (followData.success && followData.isFollowing) {
              followStatus.add(contributor.id);
            }
          } catch (error) {
            console.error('Error checking follow status:', error);
          }
        }
        setFollowing(followStatus);
      } catch (error) {
        console.error('Error fetching contributors:', error);
        setContributors([]);
        setFilteredContributors([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContributors();
  }, []);

  useEffect(() => {
    let filtered = contributors;
    
    if (selectedRole !== 'all') {
      filtered = filtered.filter(c => {
        const role = c.role?.toLowerCase() || '';
        const roleType = c.role_type?.toLowerCase() || '';
        
        // Check if role or role_type contains the selected role keyword
        switch(selectedRole) {
          case 'writer':
            return role.includes('writer') || role.includes('author') || roleType === 'writer';
          case 'editor':
            return role.includes('editor') || roleType === 'editor';
          case 'photographer':
            return role.includes('photographer') || roleType === 'photographer';
          case 'illustrator':
            return role.includes('illustrator') || roleType === 'illustrator';
          case 'podcaster':
            return role.includes('podcaster') || role.includes('podcast') || roleType === 'podcaster';
          default:
            return true;
        }
      });
    }
    
    setFilteredContributors(filtered);
  }, [selectedRole, contributors]);

  const toggleFollow = async (contributorId) => {
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
      if (following.has(contributorId)) {
        // Unfollow
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/contributors/${contributorId}/follow`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId })
        });
        const data = await response.json();
        if (data.success) {
          setFollowing(prev => {
            const newFollowing = new Set(prev);
            newFollowing.delete(contributorId);
            return newFollowing;
          });
          toast.success('Unfollowed contributor');
        } else {
          toast.error(data.error || 'Failed to unfollow');
        }
      } else {
        // Follow
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/contributors/${contributorId}/follow`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId })
        });
        const data = await response.json();
        if (data.success) {
          setFollowing(prev => {
            const newFollowing = new Set(prev);
            newFollowing.add(contributorId);
            return newFollowing;
          });
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

  const handleContributorClick = (contributor) => {
    navigate(`/community/contributors/${contributor.id}`);
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

  return (
    <div className="contributors-page">
      <div className="contributors-container">
        {/* Filters Section */}
        <div className="filters-section">
          <div className="role-filters">
            {roles.map(role => (
              <button
                key={role.id}
                className={`role-filter-btn ${selectedRole === role.id ? 'active' : ''}`}
                onClick={() => setSelectedRole(role.id)}
              >
                {role.name}
              </button>
            ))}
          </div>
        </div>

        {/* Contributors Grid */}
        {loading ? (
          <div className="contributors-loading">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="contributor-skeleton">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text short"></div>
              </div>
            ))}
          </div>
        ) : filteredContributors.length === 0 ? (
          <div className="no-results">
            <h3>No contributors found</h3>
            <p>Try adjusting your search or filter criteria</p>
            <button onClick={() => { setSelectedRole('all'); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="contributors-grid">
            {filteredContributors.map(contributor => (
              <div key={contributor.id} className="contributor-card" onClick={() => handleContributorClick(contributor)}>
                <div className="contributor-card-inner">
                  <div className="contributor-avatar-wrapper">
                    {contributor.avatar ? (
                      <img 
                        src={contributor.avatar.replace(/w=\d+&h=\d+/, 'w=70&h=70')} 
                        alt={contributor.name} 
                        className="contributor-avatar" 
                        style={{ width: '70px', height: '70px' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="contributor-avatar-fallback"
                      style={{ 
                        display: contributor.avatar ? 'none' : 'flex',
                        width: '70px', 
                        height: '70px',
                        backgroundColor: getRandomColor(contributor.name)
                      }}
                    >
                      {contributor.name?.charAt(0) || '?'}
                    </div>
                  </div>
                  <h3 className="contributor-name">{contributor.name}</h3>
                  <p className="contributor-role">{contributor.role}</p>
                  <div className="contributor-expertise">
                    {(() => {
                      const expertise = contributor.expertise;
                      if (Array.isArray(expertise) && expertise.length > 0) {
                        return expertise.slice(0, 2).map((skill, i) => (
                          <span key={i} className="expertise-tag">{skill}</span>
                        ));
                      } else if (typeof expertise === 'string' && expertise.trim()) {
                        return expertise.split(',').slice(0, 2).map((skill, i) => (
                          <span key={i} className="expertise-tag">{skill.trim()}</span>
                        ));
                      }
                      return null;
                    })()}
                  </div>
                  <div className="contributor-stats-mini">
                    <div className="mini-stat">
                      <span className="stat-value">{formatNumber(contributor.actual_followers || contributor.followers || 0)}</span>
                      <span className="stat-label-mini">Followers</span>
                    </div>
                  </div>
                  <button 
                    className={`follow-btn ${following.has(contributor.id) ? 'following' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollow(contributor.id);
                    }}
                  >
                    {following.has(contributor.id) ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributorsPage;