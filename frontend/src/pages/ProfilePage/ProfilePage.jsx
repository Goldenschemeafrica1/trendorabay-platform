import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import apiRequest from '../../services/api';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user: authUser, isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [copied, setCopied] = useState(false);
  const [profileData, setProfileData] = useState(null);

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!isAuthenticated || !authUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await apiRequest.get('/users/profile');
        
        if (response.data.success && response.data.data) {
          setProfileData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        // Use authUser data as fallback
        setProfileData(authUser);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [isAuthenticated, authUser]);

  // Combine auth user data with profile data
  const user = profileData || authUser;

  // Transform user data to match the profile page format
  const transformedUser = user ? {
    id: user.id,
    fullName: user.first_name && user.last_name 
      ? `${user.first_name} ${user.last_name}` 
      : user.username || 'User',
    username: user.username || 'user',
    bio: user.bio || 'No bio yet',
    location: user.location || 'Not specified',
    interests: Array.isArray(user.interests) ? user.interests : (user.interests ? JSON.parse(user.interests) : []),
    verified: user.verified || false,
    membershipNumber: user.membership_number || `TRB-${new Date().getFullYear()}-${String(user.id || '000').padStart(6, '0')}`,
    joinedAt: user.created_at || new Date().toISOString(),
    membershipStatus: user.membership_status || 'Active',
    role: user.role || 'Member',
    email: user.email || '',
    avatarUrl: user.profile_image || null
  } : null;

  const [stats, setStats] = useState({
    posts: 0,
    discussions: 0,
    communities: 0,
    followers: 0,
    following: 0
  });

  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [saved, setSaved] = useState([]);
  const [activity, setActivity] = useState([]);

  // Fetch additional user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !authUser) return;

      try {
        // Fetch stats
        const statsResponse = await apiRequest.get('/users/stats');
        if (statsResponse.data.success) {
          setStats(statsResponse.data.data);
        }

        // Fetch communities
        const communitiesResponse = await apiRequest.get('/users/communities');
        if (communitiesResponse.data.success) {
          setCommunities(communitiesResponse.data.data);
        }

        // Fetch posts
        const postsResponse = await apiRequest.get('/users/posts');
        console.log('Posts response:', postsResponse.data);
        if (postsResponse.data.success) {
          console.log('Setting posts:', postsResponse.data.data);
          setPosts(postsResponse.data.data);
        }

        // Fetch saved items
        const savedResponse = await apiRequest.get('/users/saved');
        if (savedResponse.data.success) {
          setSaved(savedResponse.data.data);
        }

        // Fetch activity
        const activityResponse = await apiRequest.get('/users/activity');
        if (activityResponse.data.success) {
          setActivity(activityResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [isAuthenticated, authUser]);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  const copyMembership = async () => {
    try {
      await navigator.clipboard.writeText(transformedUser.membershipNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('Membership number copied');
    } catch (err) {
      showToast('Failed to copy', 'error');
    }
  };

  const handleLike = (postId) => {
    // TODO: Implement like functionality with backend API
    setPosts(posts.map(p => 
      p.id === postId 
        ? { ...p, likes_count: p.likes_count + 1 }
        : p
    ));
  };

  const relTime = (date) => {
    const s = (Date.now() - new Date(date).getTime()) / 1000;
    if (s < 60) return 'just now';
    if (s < 3600) return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    if (s < 604800) return Math.floor(s / 86400) + 'd ago';
    return new Date(date).toLocaleDateString();
  };

  const fmtDate = (iso) => {
    const d = new Date(iso);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  };

  const nf = (n) => (n >= 1000 ? (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k' : String(n));

  const initialsOf = (name) => (name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();

  const hashString = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'posts', label: 'Posts', count: posts.length },
    { key: 'discussions', label: 'Discussions', count: stats.discussions },
    { key: 'communities', label: 'Communities', count: communities.length },
    { key: 'saved', label: 'Saved', count: saved.length },
    { key: 'about', label: 'About' }
  ];

  if (loading) {
    return (
      <div className="profile-page">
        <div className="page">
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#6E7480' }}>
            Loading profile…
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !transformedUser) {
    return (
      <div className="profile-page">
        <div className="page">
          <div className="empty">
            <div className="empty__icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4 M10 17l5-5-5-5 M15 12H3" />
              </svg>
            </div>
            <div className="empty__title">Please log in to view your profile</div>
            <div className="empty__text">You need to be authenticated to access your profile page.</div>
            <button className="btn btn--primary" onClick={() => window.location.href = '/login'}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {toast && (
        <div className="toasts">
          <div className={`toast toast--${toast.type}`}>
            <span className="toast__icon">
              {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'i'}
            </span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="page">
        {/* Profile Header */}
        <section className="profile-card" aria-label="Profile header">
          <div className="profile-head">
            <div className="head-row">
              <div className="avatar-wrap">
                <div className="avatar-xl">
                  {transformedUser.avatarUrl ? (
                    <img src={transformedUser.avatarUrl} alt={transformedUser.fullName} />
                  ) : (
                    (() => {
                      const hue1 = hashString(transformedUser.fullName) % 360;
                      const hue2 = (hashString(transformedUser.fullName) + 42) % 360;
                      return (
                        <div className="mono" style={{ 
                          background: `linear-gradient(140deg, hsl(${hue1} 32% 34%), hsl(${hue2} 40% 18%))` 
                        }}>
                          {initialsOf(transformedUser.fullName)}
                        </div>
                      );
                    })()
                  )}
                </div>
                <button className="avatar-edit" aria-label="Change profile photo">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9 M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </button>
              </div>

              <div className="head-main">
                <h1 className="name">
                  {transformedUser.fullName}
                  {transformedUser.verified && (
                    <svg className="verified" width="19" height="19" viewBox="0 0 24 24" role="img" aria-label="Verified account">
                      <path fill="currentColor" d="M12 1.7l2.5 1.9 3.1-.3 1 3 2.7 1.6-1.1 3 1.1 3-2.7 1.6-1 3-3.1-.3L12 22.3l-2.5-1.9-3.1.3-1-3L2.7 16.2l1.1-3-1.1-3 2.7-1.6 1-3 3.1.3z" />
                      <path fill="#fff" d="M10.9 15.5l-3-3 1.3-1.3 1.7 1.7 4.2-4.2 1.3 1.3z" />
                    </svg>
                  )}
                </h1>
                <div className="handle">@{transformedUser.username}</div>
              </div>

              <div className="head-actions">
                <button className="btn btn--primary" onClick={() => setEditModalOpen(true)}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
                    <path d="M12 20h9 M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                  Edit profile
                </button>
                <button className="btn" onClick={() => showToast('Profile link copied')}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
                    <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7 M16 6l-4-4-4 4 M12 2v13" />
                  </svg>
                  Share profile
                </button>
                <button className="btn btn--icon" aria-label="Account settings" title="Account settings">
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
                  </svg>
                </button>
              </div>
            </div>

            <p className="bio">{transformedUser.bio}</p>

            {transformedUser.location && (
              <div className="meta-row">
                <span className="meta-item">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  </svg>
                  {transformedUser.location}
                </span>
              </div>
            )}

            {transformedUser.interests && transformedUser.interests.length > 0 && (
              <div className="tags">
                {transformedUser.interests.map(t => <span className="tag" key={t}>{t}</span>)}
              </div>
            )}

            <div className="membership">
              <div>
                <div className="membership__label">Membership no.</div>
                <div className="membership__value">
                  {transformedUser.membershipNumber}
                  <button className="copy-btn" onClick={copyMembership} aria-label="Copy membership number" title="Copy membership number">
                    {copied ? (
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 9h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="membership__divider" />
              <div>
                <div className="membership__label">Member since</div>
                <div style={{ fontSize: 14, fontWeight: 550 }}>{fmtDate(transformedUser.joinedAt)}</div>
              </div>
              <div className="membership__divider" />
              <div>
                <div className="membership__label">Status</div>
                <span className="pill pill--ok pill--dot">{transformedUser.membershipStatus}</span>
              </div>
            </div>

            <div className="stats">
              <div className="stat">
                <div className="stat__value">{nf(stats.posts)}</div>
                <div className="stat__label">Posts</div>
              </div>
              <div className="stat">
                <div className="stat__value">{nf(stats.discussions)}</div>
                <div className="stat__label">Discussions</div>
              </div>
              <div className="stat">
                <div className="stat__value">{nf(stats.communities)}</div>
                <div className="stat__label">Communities</div>
              </div>
              <div className="stat">
                <div className="stat__value">{nf(stats.followers)}</div>
                <div className="stat__label">Followers</div>
              </div>
              <div className="stat">
                <div className="stat__value">{nf(stats.following)}</div>
                <div className="stat__label">Following</div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="tabs-wrap">
          <div className="tabs" role="tablist" aria-label="Profile sections">
            {tabs.map(t => (
              <button
                key={t.key}
                role="tab"
                aria-selected={activeTab === t.key}
                className="tab"
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
                {t.count !== undefined && <span className="tab__count">{t.count}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="panel">
          {activeTab === 'overview' && (
            <div className="overview-grid">
              <div className="stack">
                <div className="card">
                  <div className="card__head">
                    <div className="card__title">Recent posts</div>
                    <button className="card__link" onClick={() => setActiveTab('posts')}>
                      View all
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}>
                        <path d="M5 12h14 M13 6l6 6-6 6" />
                      </svg>
                    </button>
                  </div>
                  {console.log('Rendering posts in overview, count:', posts.length)}
                  {posts.length > 0 ? posts.slice(0, 2).map(p => (
                    <article className="post" key={p.id}>
                      <header className="post__head">
                        <div className="avatar-sm" style={{ width: 40, height: 40, background: `linear-gradient(140deg, hsl(${hashString(transformedUser.fullName) % 360} 32% 34%), hsl(${(hashString(transformedUser.fullName) + 42) % 360} 40% 18%))` }}>
                          {initialsOf(transformedUser.fullName)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="post__name">
                            {transformedUser.fullName}
                            {transformedUser.verified && (
                              <svg className="verified" width="16" height="16" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12 1.7l2.5 1.9 3.1-.3 1 3 2.7 1.6-1.1 3 1.1 3-2.7 1.6-1 3-3.1-.3L12 22.3l-2.5-1.9-3.1.3-1-3L2.7 16.2l1.1-3-1.1-3 2.7-1.6 1-3 3.1.3z" />
                                <path fill="#fff" d="M10.9 15.5l-3-3 1.3-1.3 1.7 1.7 4.2-4.2 1.3 1.3z" />
                              </svg>
                            )}
                          </div>
                          <div className="post__meta">@{transformedUser.username} · {relTime(p.created_at)} · {p.community_name}</div>
                        </div>
                      </header>
                      <p className="post__body">{p.content}</p>
                      {p.image_url && <div className="post__media" style={{ backgroundImage: `url(${p.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
                      <footer className="post__foot">
                        <button className="post__act">
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                          </svg>
                          {p.likes_count}
                        </button>
                        <button className="post__act">
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                            <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-4-.9L3 21l1.9-4.6a8.4 8.4 0 0 1-.9-4A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z" />
                          </svg>
                          {p.comments_count}
                        </button>
                      </footer>
                    </article>
                  )) : (
                    <div className="empty">
                      <div className="empty__icon">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-4-.9L3 21l1.9-4.6a8.4 8.4 0 0 1-.9-4A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z" />
                        </svg>
                      </div>
                      <div className="empty__title">No posts yet</div>
                      <div className="empty__text">You haven't shared anything yet. Create your first post and join the conversation.</div>
                    </div>
                  )}
                </div>

                <div className="card">
                  <div className="card__head"><div className="card__title">Recent activity</div></div>
                  {activity.length > 0 ? activity.map(a => (
                    <div className="activity" key={a.id}>
                      <div className="activity__dot">
                        {a.activity_type === 'post' ? (
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9 M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                        ) : a.activity_type === 'community' ? (
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        ) : a.activity_type === 'saved' ? (
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-4-.9L3 21l1.9-4.6a8.4 8.4 0 0 1-.9-4A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className="activity__text">{a.activity_text}</div>
                        <div className="activity__time">{relTime(a.created_at)}</div>
                      </div>
                    </div>
                  )) : (
                    <div className="empty">
                      <div className="empty__icon">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-4-.9L3 21l1.9-4.6a8.4 8.4 0 0 1-.9-4A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z" />
                        </svg>
                      </div>
                      <div className="empty__title">No recent activity</div>
                      <div className="empty__text">Your activity will appear here as you use the platform.</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="stack">
                <div className="card">
                  <div className="card__head"><div className="card__title">Profile summary</div></div>
                  <div className="card__body">
                    <p style={{ fontSize: 14, color: '#3A3F47', lineHeight: 1.62 }}>{transformedUser.bio}</p>
                    <div className="divider" style={{ margin: '18px 0' }} />
                    <div className="kv"><span className="kv__k">Location</span><span className="kv__v">{transformedUser.location || '—'}</span></div>
                    <div className="kv"><span className="kv__k">Member since</span><span className="kv__v">{fmtDate(transformedUser.joinedAt)}</span></div>
                    <div className="kv"><span className="kv__k">Membership</span><span className="kv__v" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{transformedUser.membershipNumber}</span></div>
                  </div>
                </div>

                <div className="card">
                  <div className="card__head">
                    <div className="card__title">Recently joined</div>
                    <button className="card__link" onClick={() => setActiveTab('communities')}>
                      View all
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}>
                        <path d="M5 12h14 M13 6l6 6-6 6" />
                      </svg>
                    </button>
                  </div>
                  {communities.slice(-2).reverse().map(c => {
                    const hue1 = hashString(c.name) % 360;
                    const hue2 = (hashString(c.name) + 40) % 360;
                    return (
                      <div className="activity" key={c.id}>
                        <div className="comm__icon" style={{ 
                          width: 34, height: 34, fontSize: 12,
                          background: `linear-gradient(140deg, hsl(${hue1} 42% 44%), hsl(${hue2} 46% 26%))` 
                        }}>
                          {initialsOf(c.name)}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div className="activity__text"><b>{c.name}</b></div>
                          <div className="activity__time">Joined {relTime(c.joined_at)}</div>
                        </div>
                        <button className="btn btn--sm btn--ghost" style={{ marginLeft: 'auto' }}>
                          Visit
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="stack">
              <div className="card">
                {posts.length > 0 ? posts.map(p => {
                  const hue1 = hashString(transformedUser.fullName) % 360;
                  const hue2 = (hashString(transformedUser.fullName) + 42) % 360;
                  return (
                    <article className="post" key={p.id}>
                      <header className="post__head">
                        <div className="avatar-sm" style={{ width: 40, height: 40, background: `linear-gradient(140deg, hsl(${hue1} 32% 34%), hsl(${hue2} 40% 18%))` }}>
                          {initialsOf(transformedUser.fullName)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="post__name">
                            {transformedUser.fullName}
                            {transformedUser.verified && (
                              <svg className="verified" width="16" height="16" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12 1.7l2.5 1.9 3.1-.3 1 3 2.7 1.6-1.1 3 1.1 3-2.7 1.6-1 3-3.1-.3L12 22.3l-2.5-1.9-3.1.3-1-3L2.7 16.2l1.1-3-1.1-3 2.7-1.6 1-3 3.1.3z" />
                                <path fill="#fff" d="M10.9 15.5l-3-3 1.3-1.3 1.7 1.7 4.2-4.2 1.3 1.3z" />
                              </svg>
                            )}
                          </div>
                          <div className="post__meta">@{transformedUser.username} · {relTime(p.created_at)} · {p.community_name}</div>
                        </div>
                      </header>
                      <p className="post__body">{p.content}</p>
                      {p.image_url && <div className="post__media" style={{ backgroundImage: `url(${p.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
                      <footer className="post__foot">
                        <button className="post__act">
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                          </svg>
                          {p.likes_count}
                        </button>
                        <button className="post__act">
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                            <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-4-.9L3 21l1.9-4.6a8.4 8.4 0 0 1-.9-4A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z" />
                          </svg>
                          {p.comments_count}
                        </button>
                      </footer>
                    </article>
                  );
                }) : (
                  <div className="empty">
                    <div className="empty__icon">
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-4-.9L3 21l1.9-4.6a8.4 8.4 0 0 1-.9-4A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z" />
                      </svg>
                    </div>
                    <div className="empty__title">No posts yet</div>
                    <div className="empty__text">You haven't shared anything yet. Create your first post and join the conversation.</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'communities' && (
            <div className="card">
              {communities.length > 0 ? (
                <div className="comm-grid">
                  {communities.map(c => {
                    const hue1 = hashString(c.name) % 360;
                    const hue2 = (hashString(c.name) + 40) % 360;
                    return (
                      <div className="comm" key={c.id}>
                        <div className="comm__icon" style={{ 
                          background: `linear-gradient(140deg, hsl(${hue1} 42% 44%), hsl(${hue2} 46% 26%))` 
                        }}>
                          {initialsOf(c.name)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="comm__name">{c.name}</div>
                          <div className="comm__desc">{c.description}</div>
                          <div className="comm__meta">
                            <span>Joined {relTime(c.joined_at)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty">
                  <div className="empty__icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="empty__title">No communities yet</div>
                  <div className="empty__text">Join communities to connect with like-minded people.</div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="card">
              {saved.length > 0 ? saved.map(s => (
                <div className="saved" key={s.id}>
                  <div className="saved__main">
                    <div className="saved__title">{s.title}</div>
                    <div className="saved__meta">
                      <span className="badge badge--reply">{s.item_type}</span>
                      <span>{s.source}</span>
                      <span>Saved {relTime(s.saved_at)}</span>
                    </div>
                  </div>
                  <button className="saved__remove" onClick={() => {
                    apiRequest.delete(`/users/saved/${s.id}`).then(() => {
                      setSaved(saved.filter(item => item.id !== s.id));
                      showToast('Removed from saved');
                    });
                  }} aria-label="Remove from saved">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6 M10 11v6 M14 11v6" />
                    </svg>
                  </button>
                </div>
              )) : (
                <div className="empty">
                  <div className="empty__icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
                    </svg>
                  </div>
                  <div className="empty__title">No saved items</div>
                  <div className="empty__text">Items you save will appear here.</div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'discussions' && (
            <div className="card">
              <div className="card__head"><div className="card__title">Discussions</div><span className="tab__count">{stats.discussions}</span></div>
              <div className="empty">
                <div className="empty__icon">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-4-.9L3 21l1.9-4.6a8.4 8.4 0 0 1-.9-4A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z" />
                  </svg>
                </div>
                <div className="empty__title">No discussions yet</div>
                <div className="empty__text">Start a discussion in one of your communities and it will appear here.</div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="card">
              <div className="card__body">
                <div className="kv"><span className="kv__k">Full name</span><span className="kv__v">{transformedUser.fullName}</span></div>
                <div className="kv"><span className="kv__k">Username</span><span className="kv__v">@{transformedUser.username}</span></div>
                <div className="kv"><span className="kv__k">Email</span><span className="kv__v">{transformedUser.email}</span></div>
                <div className="kv"><span className="kv__k">Location</span><span className="kv__v">{transformedUser.location}</span></div>
                <div className="kv"><span className="kv__k">Member since</span><span className="kv__v">{fmtDate(transformedUser.joinedAt)}</span></div>
                <div className="kv"><span className="kv__k">Membership number</span><span className="kv__v" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{transformedUser.membershipNumber}</span></div>
                <div className="kv"><span className="kv__k">Membership status</span><span className="kv__v">{transformedUser.membershipStatus}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setEditModalOpen(false); }}>
          <div className="modal" role="dialog" aria-modal="true" aria-label="Edit profile">
            <div className="modal__head">
              <div>
                <div className="modal__title">Edit profile</div>
                <div className="modal__sub">Update your profile information</div>
              </div>
              <button className="icon-btn" onClick={() => setEditModalOpen(false)} aria-label="Close dialog">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18 M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal__body">
              <div className="field">
                <label className="label">Full name</label>
                <input className="input" defaultValue={transformedUser.fullName} />
              </div>
              <div className="field">
                <label className="label">Username</label>
                <div className="locked">
                  <strong>@{transformedUser.username}</strong>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 10 }}>
                    <path d="M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                </div>
              </div>
              <div className="field">
                <label className="label">Bio</label>
                <textarea className="textarea" defaultValue={transformedUser.bio} rows="4" />
              </div>
              <div className="field">
                <label className="label">Location</label>
                <input className="input" defaultValue={transformedUser.location} />
              </div>
              <div className="field">
                <label className="label">Interests</label>
                <div className="chip-input">
                  {transformedUser.interests.map(tag => (
                    <span className="chip" key={tag}>
                      {tag}
                      <button>
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6 6 18 M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                  <input placeholder="Add interest..." />
                </div>
              </div>
            </div>
            <div className="modal__foot">
              <button className="btn" onClick={() => setEditModalOpen(false)}>Cancel</button>
              <button className="btn btn--primary" onClick={() => { setEditModalOpen(false); showToast('Profile updated'); }}>Save changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
