import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './CommunityPage.css';

const CommunityPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const API_BASE = '/api';

  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCommunity, setCurrentCommunity] = useState(null);
  const [currentTab, setCurrentTab] = useState('Feed');
  const [joinedCommunities, setJoinedCommunities] = useState(new Set());
  const [posts, setPosts] = useState([]);
  const [showComposer, setShowComposer] = useState(false);
  const [composerText, setComposerText] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [discussions, setDiscussions] = useState([]);
  const [loadingDiscussions, setLoadingDiscussions] = useState(false);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [submittingPost, setSubmittingPost] = useState(false);
  const [isComposerExpanded, setIsComposerExpanded] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [postMenuOpen, setPostMenuOpen] = useState(null);
  const [categories, setCategories] = useState(['All']);
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [discussionTitle, setDiscussionTitle] = useState('');
  const [discussionContent, setDiscussionContent] = useState('');
  const [discussionTag, setDiscussionTag] = useState('General');
  const [submittingDiscussion, setSubmittingDiscussion] = useState(false);
  const [discussionMenuOpen, setDiscussionMenuOpen] = useState(null);
  const [initialCommunityId, setInitialCommunityId] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (postMenuOpen && !event.target.closest('.post-menu-container')) {
        setPostMenuOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [postMenuOpen]);

  // Fetch communities
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await fetch(`${API_BASE}/communities?limit=1000`);
        const data = await response.json();
        if (data.success && data.data) {
          const transformed = data.data.map(c => ({
            id: c.slug,
            dbId: c.id,
            name: c.name,
            category: c.category,
            desc: c.description,
            shortDesc: c.short_description || c.description,
            members: c.member_count || 0,
            cover: c.cover_image_url
          })).sort((a, b) => b.members - a.members);
          setCommunities(transformed);

          // Extract unique categories from communities
          const uniqueCategories = ['All', ...new Set(data.data.map(c => c.category).filter(Boolean))];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching communities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunities();
  }, []);

  // Load joined communities from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('joinedCommunities');
    if (stored) {
      setJoinedCommunities(new Set(JSON.parse(stored)));
    }
  }, []);

  // Store initial community ID from URL on mount
  useEffect(() => {
    const communityId = searchParams.get('community');
    if (communityId) {
      setInitialCommunityId(communityId);
    }
  }, []);

  // Check URL params for community
  useEffect(() => {
    const communityId = searchParams.get('community');
    const tab = searchParams.get('tab') || 'Feed';
    if (communityId && !loading) {
      const community = communities.find(c => c.id === communityId || c.dbId === parseInt(communityId));
      if (community) {
        setCurrentCommunity(community);
        setCurrentTab(tab);
      }
    }
  }, [searchParams, communities, loading]);

  // Fetch posts when community changes
  useEffect(() => {
    if (currentCommunity) {
      const fetchPosts = async () => {
        setLoadingPosts(true);
        try {
          console.log('Fetching posts for community:', currentCommunity.dbId);
          const response = await fetch(`${API_BASE}/community-posts/community/${currentCommunity.dbId}`);
          const data = await response.json();
          console.log('Posts response:', data);
          if (data.success && data.data) {
            const transformed = data.data.map(post => ({
              id: post.id,
              author: post.username || `${post.first_name} ${post.last_name}`.trim(),
              initial: (post.username || post.first_name || 'U')[0].toUpperCase(),
              time: new Date(post.created_at).toLocaleDateString(),
              content: post.content,
              image: post.image_url,
              likes: post.likes_count || 0,
              liked: false,
              comments: [],
              commentsOpen: false
            }));
            setPosts(transformed);
          }
        } catch (error) {
          console.error('Error fetching posts:', error);
          setPosts([]);
        } finally {
          setLoadingPosts(false);
        }
      };
      fetchPosts();
    }
  }, [currentCommunity]);

  // Fetch discussions when community changes or tab changes to Discussions
  useEffect(() => {
    if (currentCommunity && currentTab === 'Discussions') {
      const fetchDiscussions = async () => {
        setLoadingDiscussions(true);
        try {
          console.log('Fetching discussions for community:', currentCommunity.dbId);
          const response = await fetch(`${API_BASE}/community-discussions/community/${currentCommunity.dbId}`);
          const data = await response.json();
          console.log('Discussions response:', data);
          if (data.success && data.data) {
            const transformed = data.data.map(discussion => ({
              id: discussion.id,
              tag: discussion.tag || 'General',
              title: discussion.title,
              excerpt: discussion.content.substring(0, 150) + '...',
              body: discussion.content,
              author: discussion.username || `${discussion.first_name} ${discussion.last_name}`.trim(),
              initial: (discussion.username || discussion.first_name || 'U')[0].toUpperCase(),
              time: new Date(discussion.created_at).toLocaleDateString(),
              views: discussion.views || 0,
              repliesList: []
            }));
            setDiscussions(transformed);
          }
        } catch (error) {
          console.error('Error fetching discussions:', error);
          setDiscussions([]);
        } finally {
          setLoadingDiscussions(false);
        }
      };
      fetchDiscussions();
    }
  }, [currentCommunity, currentTab]);

  // Fetch members when community changes or tab changes to Members
  useEffect(() => {
    if (currentCommunity && currentTab === 'Members') {
      const fetchMembers = async () => {
        setLoadingMembers(true);
        try {
          console.log('Fetching members for community:', currentCommunity.dbId);
          const response = await fetch(`${API_BASE}/communities/${currentCommunity.dbId}/members`);
          const data = await response.json();
          console.log('Members response:', data);
          if (data.success && data.data) {
            const transformed = data.data.map(member => ({
              name: member.username || `${member.first_name} ${member.last_name}`.trim(),
              role: member.role || 'Community Member',
              initial: (member.username || member.first_name || 'U')[0].toUpperCase(),
              location: member.country || 'Unknown',
              posts: member.post_count || 0
            }));
            setMembers(transformed);
          }
        } catch (error) {
          console.error('Error fetching members:', error);
          setMembers([]);
        } finally {
          setLoadingMembers(false);
        }
      };
      fetchMembers();
    }
  }, [currentCommunity, currentTab]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showPostModal) {
      console.log('Modal opening - disabling body scroll and blur');
      document.body.style.overflow = 'hidden';
      document.body.style.filter = 'none';
      document.body.style.backdropFilter = 'none';
      document.body.style.webkitBackdropFilter = 'none';
      document.documentElement.style.filter = 'none';
      document.documentElement.style.backdropFilter = 'none';
      document.documentElement.style.webkitBackdropFilter = 'none';
      // Remove any blur from all elements
      document.querySelectorAll('*').forEach(el => {
        el.style.backdropFilter = 'none';
        el.style.webkitBackdropFilter = 'none';
      });
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.filter = '';
      document.body.style.backdropFilter = '';
      document.body.style.webkitBackdropFilter = '';
      document.documentElement.style.filter = '';
      document.documentElement.style.backdropFilter = '';
      document.documentElement.style.webkitBackdropFilter = '';
    };
  }, [showPostModal]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const linkify = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: '#0066cc',
              textDecoration: 'underline',
              wordBreak: 'break-word',
              wordWrap: 'break-word'
            }}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const handleSubmitPost = async () => {
    if (!postContent.trim() && !postImage) {
      showToast('Please enter some content or add an image');
      return;
    }

    if (!isJoined) {
      showToast('Please join this community to post');
      return;
    }

    setSubmittingPost(true);
    try {
      const userStr = localStorage.getItem('trendorabay-user');
      console.log('User string from localStorage:', userStr);
      const user = userStr ? JSON.parse(userStr) : null;
      console.log('Parsed user:', user);

      if (!user) {
        showToast('Please log in to post');
        return;
      }

      console.log('Creating post with user_id:', user.id, 'community_id:', currentCommunity.dbId);

      const response = await fetch(`${API_BASE}/community-posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          community_id: currentCommunity.dbId,
          user_id: user.id,
          content: postContent || '',
          image_url: postImage
        })
      });

      const data = await response.json();
      console.log('Post response:', data);
      
      if (data.success) {
        showToast('Post created successfully!');
        setPostContent('');
        setPostImage(null);
        setShowPostModal(false);
        fetchPosts();
      } else {
        showToast(data.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      showToast('Failed to create post');
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleSubmitDiscussion = async () => {
    if (!discussionTitle.trim() || !discussionContent.trim()) {
      showToast('Please enter a title and content');
      return;
    }

    setSubmittingDiscussion(true);
    try {
      const userStr = localStorage.getItem('trendorabay-user');
      const user = userStr ? JSON.parse(userStr) : null;

      if (!user) {
        showToast('Please log in to create a discussion');
        return;
      }

      const response = await fetch(`${API_BASE}/community-discussions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          community_id: currentCommunity.dbId,
          title: discussionTitle,
          content: discussionContent,
          tag: discussionTag
        })
      });

      const data = await response.json();
      
      if (data.success) {
        showToast('Discussion created successfully!');
        setDiscussionTitle('');
        setDiscussionContent('');
        setDiscussionTag('General');
        setShowDiscussionModal(false);
        // Refresh discussions
        const discussionsResponse = await fetch(`${API_BASE}/community-discussions/community/${currentCommunity.dbId}`);
        const discussionsData = await discussionsResponse.json();
        if (discussionsData.success && discussionsData.data) {
          const transformed = discussionsData.data.map(discussion => ({
            id: discussion.id,
            tag: discussion.tag || 'General',
            title: discussion.title,
            excerpt: discussion.content.substring(0, 150) + '...',
            body: discussion.content,
            author: discussion.username || `${discussion.first_name} ${discussion.last_name}`.trim(),
            initial: (discussion.username || discussion.first_name || 'U')[0].toUpperCase(),
            time: new Date(discussion.created_at).toLocaleDateString(),
            views: discussion.views || 0,
            repliesList: []
          }));
          setDiscussions(transformed);
        }
      } else {
        showToast(data.error || 'Failed to create discussion');
      }
    } catch (error) {
      console.error('Error creating discussion:', error);
      showToast('Failed to create discussion');
    } finally {
      setSubmittingDiscussion(false);
    }
  };

  const handleDeleteDiscussion = async (discussionId) => {
    try {
      const userStr = localStorage.getItem('trendorabay-user');
      const user = userStr ? JSON.parse(userStr) : null;

      if (!user) {
        showToast('Please log in to delete discussions');
        return;
      }

      const response = await fetch(`${API_BASE}/community-discussions/${discussionId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });

      const data = await response.json();

      if (data.success) {
        showToast('Discussion deleted successfully');
        setDiscussions(discussions.filter(d => d.id !== discussionId));
        setDiscussionMenuOpen(null);
      } else {
        showToast(data.error || 'Failed to delete discussion');
      }
    } catch (error) {
      console.error('Error deleting discussion:', error);
      showToast('Failed to delete discussion');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const userStr = localStorage.getItem('trendorabay-user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user) {
        showToast('Please log in to delete posts');
        return;
      }

      const response = await fetch(`${API_BASE}/community-posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });

      const data = await response.json();
      
      if (data.success) {
        showToast('Post deleted successfully');
        setPostMenuOpen(null);
        // Refresh posts
        const postsResponse = await fetch(`${API_BASE}/community-posts/community/${currentCommunity.dbId}`);
        const postsData = await postsResponse.json();
        if (postsData.success && postsData.data) {
          const transformed = postsData.data.map(post => ({
            id: post.id,
            author: post.username || `${post.first_name} ${post.last_name}`.trim(),
            initial: (post.username || post.first_name || 'U')[0].toUpperCase(),
            time: new Date(post.created_at).toLocaleDateString(),
            content: post.content,
            image: post.image_url,
            likes: post.likes_count || 0,
            liked: false,
            comments: [],
            commentsOpen: false
          }));
          setPosts(transformed);
        }
      } else {
        showToast(data.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      showToast('Failed to delete post');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCommunity = (community) => {
    setCurrentCommunity(community);
    setSearchParams({ community: community.id, tab: 'Feed' });
  };

  const goBackToList = () => {
    setCurrentCommunity(null);
    setSearchParams({});
  };

  const toggleJoin = async (community) => {
    console.log('Toggle join called for community:', community.name, 'dbId:', community.dbId);
    console.log('Current joinedCommunities:', joinedCommunities);
    
    const userStr = localStorage.getItem('trendorabay-user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (!user) {
      showToast('Please log in to join communities');
      return;
    }

    const isCurrentlyJoined = joinedCommunities.has(community.dbId);
    
    try {
      if (isCurrentlyJoined) {
        // Leave community
        const response = await fetch(`${API_BASE}/communities/${community.dbId}/leave`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id })
        });
        const data = await response.json();
        
        if (data.success) {
          const newSet = new Set(joinedCommunities);
          newSet.delete(community.dbId);
          setJoinedCommunities(newSet);
          localStorage.setItem('joinedCommunities', JSON.stringify([...newSet]));
          showToast(`Left ${community.name}`);
        } else {
          showToast(data.error || 'Failed to leave community');
        }
      } else {
        // Join community
        const response = await fetch(`${API_BASE}/communities/${community.dbId}/join`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id })
        });
        const data = await response.json();
        
        if (data.success) {
          const newSet = new Set(joinedCommunities);
          newSet.add(community.dbId);
          setJoinedCommunities(newSet);
          localStorage.setItem('joinedCommunities', JSON.stringify([...newSet]));
          showToast(`Joined ${community.name}`);
        } else {
          showToast(data.error || 'Failed to join community');
        }
      }
    } catch (error) {
      console.error('Error toggling join:', error);
      showToast('Failed to update membership');
    }
  };

  const filteredCommunities = communities.filter(c => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isJoined = currentCommunity ? joinedCommunities.has(currentCommunity.dbId) : false;
  console.log('isJoined:', isJoined, 'currentCommunity.dbId:', currentCommunity?.dbId, 'joinedCommunities:', joinedCommunities);

  return (
    <div className="community-page-new">
      {loading && initialCommunityId ? (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh'}}>
          <div className="skeleton-text" style={{width: '200px', height: '20px'}}></div>
        </div>
      ) : !currentCommunity ? (
        <main>
          <section className="page-hero">
            <div className="container hero-grid">
              <div>
                <div className="eyebrow">The Trendorabay Community</div>
                <h1>Find your people. Build your space.</h1>
                <p>Join communities built around the interests, industries and ideas shaping Africa. Share, connect, discover opportunities, attend events and support people doing meaningful work.</p>
                <div className="hero-search">
                  <span style={{paddingLeft: '12px'}}>⌕</span>
                  <input
                    placeholder="Search communities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="text"
                  />
                  <button type="button">Search</button>
                </div>
              </div>
              <div className="hero-art">
                <div className="tile ta"><img src="/music.jpeg" alt="Music" /></div>
                <div className="tile tb"><img src="/blockchain.jpeg" alt="Technology" /></div>
                <div className="tile tc"><img src="/fashionandbusiness.jpeg" alt="Fashion" /></div>
              </div>
            </div>
          </section>

          <section className="section section-soft" id="all">
            <div className="container">
              <div className="section-head">
                <h2>Discover Communities</h2>
              </div>
              <div className="category-bar">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="community-grid">
                {loading ? (
                  Array(6).fill(0).map((_, i) => (
                    <div key={i} className="community-card skeleton">
                      <div className="card-image skeleton-image"></div>
                      <div className="card-content">
                        <div className="card-category skeleton-text"></div>
                        <h3 className="skeleton-text"></h3>
                        <p className="skeleton-text"></p>
                        <div className="card-stats skeleton-text"></div>
                      </div>
                    </div>
                  ))
                ) : filteredCommunities.length === 0 ? (
                  <p style={{gridColumn: '1/-1', textAlign: 'center', color: 'var(--muted)', padding: '40px'}}>
                    No communities found matching your criteria.
                  </p>
                ) : (
                  filteredCommunities.map(community => (
                  <div
                    key={community.id}
                    className="community-card"
                    onClick={() => openCommunity(community)}
                  >
                    <div className="card-image">
                      <img src={community.cover} alt={community.name} />
                      {joinedCommunities.has(community.dbId) && (
                        <span className="badge" style={{position: 'absolute', top: '12px', right: '12px', background: 'var(--ink)', color: '#fff'}}>✓ Joined</span>
                      )}
                    </div>
                    <div className="card-body">
                      <div className="card-meta">
                        <span className="badge category-badge">{community.category}</span>
                      </div>
                      <h3 className="card-title">{community.name}</h3>
                      <p className="card-desc">{community.shortDesc}</p>
                      <div className="card-stats">
                        <span>
                          <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                          {community.members} members
                        </span>
                      </div>
                      <div className="card-actions">
                        <button className="btn btn-outline btn-sm">View</button>
                        {joinedCommunities.has(community.dbId) ? (
                          <button className="btn btn-outline btn-sm joined" disabled>✓ Joined</button>
                        ) : (
                          <button 
                            className="btn btn-dark btn-sm join-btn" 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleJoin(community);
                            }}
                          >
                            Join Community
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
                )}
              </div>
            </div>
          </section>

          <section className="section soft">
            <div className="container">
              <div className="head">
                <div>
                  <div className="eyebrow">Inside a community</div>
                  <h2>More than a group chat.</h2>
                  <p>Each community can have its own social space and ecosystem.</p>
                </div>
              </div>
              <div className="steps">
                <div className="step"><div className="number">01</div><h3>Join</h3><p>Choose communities that interest you, agree to the community rules and become a member.</p></div>
                <div className="step"><div className="number">02</div><h3>Connect</h3><p>Post, comment, react, follow members and take part in conversations and community activities.</p></div>
                <div className="step"><div className="number">03</div><h3>Discover</h3><p>Find events, opportunities, creators, businesses, stories and resources related to the community.</p></div>
                <div className="step"><div className="number">04</div><h3>Build &amp; Sell</h3><p>Creators and businesses can showcase their work and sell products through the Trendorabay marketplace.</p></div>
              </div>
            </div>
          </section>
        </main>
      ) : (
        <main>
          <div className="detail-view active">
            <div className="container">
              <div className="detail-back" onClick={goBackToList}>
                <svg viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back to communities
              </div>

              <div className="detail-cover">
                <img src={currentCommunity.cover} alt={currentCommunity.name} />
                <div className="detail-cover-overlay"></div>
                <div className="detail-cover-content">
                  <div className="eyebrow-light">{currentCommunity.category} Community</div>
                  <h1>{currentCommunity.name}</h1>
                  <div className="detail-cover-stats">
                    <span>👥 {currentCommunity.members.toLocaleString()} members</span>
                  </div>
                </div>
              </div>

              <div className="detail-bar">
                <div className="detail-tabs">
                  {['Feed', 'Discussions', 'Opportunities', 'Events', 'Members', 'About'].map(tab => (
                    <button
                      key={tab}
                      className={`tab-btn${tab === currentTab ? ' active' : ''}`}
                      onClick={() => { setCurrentTab(tab); setSearchParams({ community: currentCommunity.id, tab }); }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="detail-bar-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => showToast('Share link copied')}>Share</button>
                  <button
                    className={`btn ${isJoined ? 'btn-outline joined' : 'btn-dark'} btn-sm`}
                    onClick={() => {
                      console.log('Join button clicked for community:', currentCommunity.name, 'dbId:', currentCommunity.dbId);
                      toggleJoin(currentCommunity);
                    }}
                  >
                    {isJoined ? 'Leave Community' : 'Join Community'}
                  </button>
                </div>
              </div>

              <div className="detail-layout">
                <div className="detail-main">
                  {currentTab === 'Feed' && (
                    <div>
                      {isJoined ? (
                        <div style={{
                          background: '#fff',
                          borderRadius: '16px',
                          padding: '16px',
                          marginBottom: '24px',
                          border: '1px solid #eaeaea',
                          maxWidth: '550px',
                          margin: '0 auto 24px auto'
                        }}>
                          <textarea
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            placeholder="What's on your mind?"
                            style={{
                              width: '100%',
                              minHeight: '80px',
                              padding: '12px',
                              border: '1px solid #eaeaea',
                              borderRadius: '12px',
                              fontSize: '14px',
                              fontFamily: 'inherit',
                              resize: 'vertical'
                            }}
                          />

                          {postImage && (
                            <div style={{position: 'relative', margin: '12px 0', borderRadius: '12px', overflow: 'hidden', background: '#f8f8f6', border: '1px solid #f2f2f2'}}>
                              <img src={postImage} alt="Selected image" style={{width: '100%', height: 'auto', maxHeight: '280px', objectFit: 'cover', display: 'block'}} />
                              <button
                                type="button"
                                onClick={() => setPostImage(null)}
                                style={{
                                  position: 'absolute',
                                  top: '8px',
                                  right: '8px',
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  background: 'rgba(0,0,0,0.7)',
                                  color: '#fff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  border: 'none',
                                  cursor: 'pointer'
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          )}

                          <input type="file" accept="image/*" style={{display: 'none'}} onChange={handleImageUpload} />

                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px'}}>
                            <div style={{display: 'flex', gap: '8px'}}>
                              <button
                                type="button"
                                onClick={() => document.querySelector('input[type="file"]').click()}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '7px 14px',
                                  borderRadius: '99px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  color: '#6f6f6f',
                                  border: '1px solid #eaeaea',
                                  background: '#fff',
                                  cursor: 'pointer'
                                }}
                              >
                                Image
                              </button>
                              <button
                                type="button"
                                onClick={() => showToast('Poll feature coming soon!')}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '7px 14px',
                                  borderRadius: '99px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  color: '#6f6f6f',
                                  border: '1px solid #eaeaea',
                                  background: '#fff',
                                  cursor: 'pointer'
                                }}
                              >
                                Poll
                              </button>
                            </div>
                            <button
                              onClick={handleSubmitPost}
                              disabled={submittingPost || (!postContent.trim() && !postImage)}
                              style={{
                                padding: '8px 20px',
                                borderRadius: '999px',
                                fontSize: '13px',
                                fontWeight: 600,
                                border: '1px solid #111',
                                background: '#111',
                                color: '#fff',
                                cursor: (submittingPost || (!postContent.trim() && !postImage)) ? 'not-allowed' : 'pointer',
                                opacity: (submittingPost || (!postContent.trim() && !postImage)) ? 0.5 : 1
                              }}
                            >
                              {submittingPost ? 'Posting...' : 'Post'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{
                          background: '#fff',
                          borderRadius: '16px',
                          padding: '24px',
                          marginBottom: '24px',
                          border: '1px solid #eaeaea',
                          maxWidth: '550px',
                          margin: '0 auto 24px auto',
                          textAlign: 'center'
                        }}>
                          <p style={{fontSize: '14px', color: '#6f6f6f', marginBottom: '12px'}}>
                            Join this community to share your thoughts and connect with other members.
                          </p>
                          <button
                            onClick={() => toggleJoin(currentCommunity)}
                            style={{
                              padding: '10px 24px',
                              borderRadius: '999px',
                              fontSize: '13px',
                              fontWeight: 600,
                              border: '1px solid #111',
                              background: '#111',
                              color: '#fff',
                              cursor: 'pointer'
                            }}
                          >
                            Join Community
                          </button>
                        </div>
                      )}

                      {loadingPosts ? (
                        <div style={{textAlign: 'center', padding: '40px', color: 'var(--muted)'}}>Loading posts...</div>
                      ) : posts.length === 0 ? (
                        <div className="locked-prompt" style={{maxWidth: '550px', margin: '0 auto'}}>
                          <h4>No posts yet</h4>
                          <p>Be the first to share something with the community!</p>
                        </div>
                      ) : (
                        posts.map(post => {
                          const isExpanded = expandedPosts.has(post.id);
                          const shouldTruncate = post.content.length > 100 && !isExpanded;
                          const displayContent = shouldTruncate ? post.content.substring(0, 100) + '...' : post.content;
                          const userStr = localStorage.getItem('trendorabay-user');
                          const user = userStr ? JSON.parse(userStr) : null;
                          const isOwnPost = user && (post.author === user.username || post.author === `${user.first_name} ${user.last_name}`.trim());
                          
                          return (
                            <div key={post.id} className="post">
                              <div className="post-header" style={{position: 'relative'}}>
                                <div className="avatar">{post.initial}</div>
                                <div className="post-author">
                                  <strong>{post.author}</strong>
                                  <span>{post.time}</span>
                                </div>
                                {isOwnPost && (
                                  <div className="post-menu-container" style={{position: 'relative'}}>
                                    <button 
                                      onClick={() => setPostMenuOpen(postMenuOpen === post.id ? null : post.id)}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}
                                    >
                                      <svg viewBox="0 0 24 24" style={{width: '20px', height: '20px', stroke: '#6f6f6f', fill: 'none', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round'}}>
                                        <circle cx="12" cy="12" r="1"></circle>
                                        <circle cx="12" cy="5" r="1"></circle>
                                        <circle cx="12" cy="19" r="1"></circle>
                                      </svg>
                                    </button>
                                    {postMenuOpen === post.id && (
                                      <div style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: '100%',
                                        background: '#fff',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        zIndex: 10,
                                        minWidth: '120px'
                                      }}>
                                        <button 
                                          onClick={() => handleDeletePost(post.id)}
                                          style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            background: 'none',
                                            border: 'none',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            color: '#dc3545'
                                          }}
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="post-content" style={{
                                display: '-webkit-box',
                                WebkitLineClamp: isExpanded ? 'unset' : 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                wordBreak: 'break-word',
                                wordWrap: 'break-word'
                              }}>
                                {linkify(post.content)}
                              </div>
                              {post.content.length > 100 && (
                                <button 
                                  onClick={() => {
                                    const newExpanded = new Set(expandedPosts);
                                    if (newExpanded.has(post.id)) {
                                      newExpanded.delete(post.id);
                                    } else {
                                      newExpanded.add(post.id);
                                    }
                                    setExpandedPosts(newExpanded);
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#6f6f6f',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    padding: '4px 0',
                                    fontWeight: 500
                                  }}
                                >
                                  {isExpanded ? 'See less' : 'See more'}
                                </button>
                              )}
                              {post.image && (
                                <div className="post-image">
                                  <img src={post.image} alt="Post" />
                                </div>
                              )}
                              <div className="post-actions">
                                <button className="post-action">
                                  <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                                  {post.likes}
                                </button>
                                <button className="post-action">
                                  <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                  {post.comments?.length || 0}
                                </button>
                                <button 
                                  className="post-action"
                                  onClick={() => {
                                    if (navigator.share) {
                                      navigator.share({
                                        title: 'Check out this post',
                                        text: post.content,
                                        url: window.location.href
                                      });
                                    } else {
                                      navigator.clipboard.writeText(window.location.href);
                                      showToast('Link copied to clipboard');
                                    }
                                  }}
                                >
                                  <svg viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {currentTab === 'Discussions' && (
                    <div>
                      <div className="tab-header">
                        <div>
                          <h3>Discussions</h3>
                          <div className="sub">{discussions.length} {discussions.length === 1 ? 'thread' : 'threads'} in this community</div>
                        </div>
                      </div>

                      {isJoined && (
                        <div style={{
                          background: '#fff',
                          borderRadius: '16px',
                          padding: '16px',
                          marginBottom: '24px',
                          border: '1px solid #eaeaea',
                          maxWidth: '550px',
                          margin: '0 auto 24px auto'
                        }}>
                          <input
                            type="text"
                            value={discussionTitle}
                            onChange={(e) => setDiscussionTitle(e.target.value)}
                            placeholder="Discussion title..."
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid #eaeaea',
                              borderRadius: '8px',
                              fontSize: '14px',
                              marginBottom: '10px'
                            }}
                          />
                          <textarea
                            value={discussionContent}
                            onChange={(e) => setDiscussionContent(e.target.value)}
                            placeholder="What is on your mind?"
                            rows={3}
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid #eaeaea',
                              borderRadius: '8px',
                              fontSize: '14px',
                              resize: 'vertical',
                              marginBottom: '10px'
                            }}
                          />
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <select
                              value={discussionTag}
                              onChange={(e) => setDiscussionTag(e.target.value)}
                              style={{
                                padding: '8px 12px',
                                border: '1px solid #eaeaea',
                                borderRadius: '8px',
                                fontSize: '13px',
                                background: '#fff'
                              }}
                            >
                              <option value="General">General</option>
                              <option value="Question">Question</option>
                              <option value="Idea">Idea</option>
                              <option value="Help">Help</option>
                            </select>
                            <button
                              onClick={handleSubmitDiscussion}
                              disabled={submittingDiscussion || !discussionTitle.trim() || !discussionContent.trim()}
                              style={{
                                padding: '8px 20px',
                                borderRadius: '999px',
                                fontSize: '13px',
                                fontWeight: 600,
                                border: '1px solid #111',
                                background: '#111',
                                color: '#fff',
                                cursor: (submittingDiscussion || !discussionTitle.trim() || !discussionContent.trim()) ? 'not-allowed' : 'pointer',
                                opacity: (submittingDiscussion || !discussionTitle.trim() || !discussionContent.trim()) ? 0.5 : 1
                              }}
                            >
                              {submittingDiscussion ? 'Posting...' : 'Post Discussion'}
                            </button>
                          </div>
                        </div>
                      )}

                      {!isJoined ? (
                        <div className="locked-prompt">
                          <h4>Only members can start discussions</h4>
                          <p>Join this community to ask questions, share ideas and start conversations with other members.</p>
                          <button className="btn btn-dark btn-sm" onClick={() => toggleJoin(currentCommunity)}>Join Community</button>
                        </div>
                      ) : loadingDiscussions ? (
                        <div style={{textAlign: 'center', padding: '40px', color: 'var(--muted)'}}>Loading discussions...</div>
                      ) : discussions.length === 0 ? (
                        <p style={{color: 'var(--muted)'}}>No discussions yet. Be the first to start one.</p>
                      ) : (
                        <div className="discussion-list">
                          {discussions.map(discussion => {
                            const userStr = localStorage.getItem('trendorabay-user');
                            const user = userStr ? JSON.parse(userStr) : null;
                            const isOwnDiscussion = user && (discussion.author === user.username || discussion.author === `${user.first_name} ${user.last_name}`.trim());

                            return (
                              <div key={discussion.id} className="discussion-item">
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                  <div style={{flex: 1}}>
                                    <span className="discussion-tag">{discussion.tag}</span>
                                    <h3>{discussion.title}</h3>
                                    <p>{discussion.excerpt}</p>
                                    <div className="discussion-meta">
                                      <span>
                                        <svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-8 8H4l2-4a8 8 0 1 1 15-4z"/></svg>
                                        {discussion.repliesList.length} replies
                                      </span>
                                      <span>⏱ {discussion.time}</span>
                                      <span>👁 {discussion.views} views</span>
                                      <span>by {discussion.author}</span>
                                    </div>
                                  </div>
                                  {isOwnDiscussion && (
                                    <div className="discussion-menu-container" style={{position: 'relative'}}>
                                      <button
                                        onClick={() => setDiscussionMenuOpen(discussionMenuOpen === discussion.id ? null : discussion.id)}
                                        style={{
                                          background: 'none',
                                          border: 'none',
                                          cursor: 'pointer',
                                          padding: '4px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center'
                                        }}
                                      >
                                        <svg viewBox="0 0 24 24" style={{width: '20px', height: '20px', stroke: '#6f6f6f', fill: 'none', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round'}}>
                                          <circle cx="12" cy="12" r="1"></circle>
                                          <circle cx="12" cy="5" r="1"></circle>
                                          <circle cx="12" cy="19" r="1"></circle>
                                        </svg>
                                      </button>
                                      {discussionMenuOpen === discussion.id && (
                                        <div style={{
                                          position: 'absolute',
                                          right: '0',
                                          top: '100%',
                                          background: '#fff',
                                          border: '1px solid #eaeaea',
                                          borderRadius: '8px',
                                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                          zIndex: 10,
                                          minWidth: '120px'
                                        }}>
                                          <button
                                            onClick={() => handleDeleteDiscussion(discussion.id)}
                                            style={{
                                              width: '100%',
                                              padding: '8px 12px',
                                              border: 'none',
                                              background: 'none',
                                              textAlign: 'left',
                                              cursor: 'pointer',
                                              fontSize: '13px',
                                              color: '#ff4444'
                                            }}
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {currentTab === 'Opportunities' && (
                    <div className="locked-prompt">
                      <h4>Opportunities</h4>
                      <p>Coming soon! Discover jobs, grants, and opportunities in this community.</p>
                    </div>
                  )}

                  {currentTab === 'Events' && (
                    <div className="locked-prompt">
                      <h4>Events</h4>
                      <p>Coming soon! Discover and attend community events.</p>
                    </div>
                  )}

                  {currentTab === 'Members' && (
                    <div>
                      <div className="tab-header">
                        <div>
                          <h3>Members</h3>
                          <div className="sub">{members.length} {members.length === 1 ? 'member' : 'members'} in this community</div>
                        </div>
                      </div>

                      {loadingMembers ? (
                        <div style={{textAlign: 'center', padding: '40px', color: 'var(--muted)'}}>Loading members...</div>
                      ) : members.length === 0 ? (
                        <p style={{color: 'var(--muted)'}}>No members yet. Be the first to join!</p>
                      ) : (
                        <div className="members-grid">
                          {members.map(member => (
                            <div key={member.name} className="member-card">
                              <div className="avatar">{member.initial}</div>
                              <h3>{member.name}</h3>
                              <div className="role">{member.role}</div>
                              <div className="member-meta">
                                <span>📍 {member.location}</span>
                                <span>📝 {member.posts} posts</span>
                              </div>
                              <button className="btn btn-outline btn-sm">Follow</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {currentTab === 'About' && (
                    <div className="about-card">
                      <h3>About {currentCommunity.name}</h3>
                      <p>{currentCommunity.desc}</p>
                      <h4>Community Guidelines</h4>
                      <div className="rules-grid">
                        <div className="rule-item"><div className="rule-num">1</div><p>Be respectful to other members and their perspectives</p></div>
                        <div className="rule-item"><div className="rule-num">2</div><p>Share relevant, honest and useful contributions</p></div>
                        <div className="rule-item"><div className="rule-num">3</div><p>Do not harass, threaten, impersonate or target other members</p></div>
                        <div className="rule-item"><div className="rule-num">4</div><p>Do not post spam, scams or misleading promotional content</p></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="sidebar">
                  <div className="sidebar-card">
                    <h4>Trending</h4>
                    <div className="trend-item">
                      <span>AI in Africa</span>
                      <span className="count">24</span>
                    </div>
                    <div className="trend-item">
                      <span>Remote Work</span>
                      <span className="count">18</span>
                    </div>
                    <div className="trend-item">
                      <span>Startups</span>
                      <span className="count">15</span>
                    </div>
                  </div>
                  <div className="sidebar-card">
                    <h4>Opportunities</h4>
                    <div className="trend-item">
                      <span>Job Openings</span>
                      <span className="count">12</span>
                    </div>
                    <div className="trend-item">
                      <span>Grants</span>
                      <span className="count">8</span>
                    </div>
                    <div className="trend-item">
                      <span>Internships</span>
                      <span className="count">5</span>
                    </div>
                  </div>
                  <div className="sidebar-card">
                    <h4>Events</h4>
                    <div className="trend-item">
                      <span>Upcoming</span>
                      <span className="count">3</span>
                    </div>
                    <div className="trend-item">
                      <span>Past</span>
                      <span className="count">15</span>
                    </div>
                  </div>
                  <div className="sidebar-card">
                    <h4>Members</h4>
                    <div className="trend-item">
                      <span>Total</span>
                      <span className="count">{currentCommunity?.members?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {toast.show && (
        <div className={`toast${toast.show ? ' show' : ''}`}>
          {toast.message}
        </div>
      )}

      {/* Post Creation Modal */}
      {showPostModal && (
        <div className="modal-overlay open">
          <div className="modal composer-modal">
            <button className="modal-close" onClick={() => setShowPostModal(false)}>
              <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
            <h3>Create a post</h3>
            <p style={{marginBottom: '16px'}}>Share an idea, question or opportunity with the community.</p>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's on your mind?"
              style={{width: '100%', minHeight: '120px', padding: '12px', border: '1px solid #ddd', borderRadius: '12px', fontSize: '14px'}}
            />

            {postImage && (
              <div className="image-preview">
                <img src={postImage} alt="Selected image" />
                <button className="remove-image" type="button" onClick={() => setPostImage(null)}>
                  <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
                </button>
              </div>
            )}

            <input type="file" accept="image/*" style={{display: 'none'}} onChange={handleImageUpload} />

            <div className="composer-modal-row">
              <button className="composer-action" type="button" onClick={() => document.querySelector('input[type="file"]').click()}>
                <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5-9 9"/></svg>
                Image
              </button>
            </div>
            <div className="composer-modal-actions">
              <button className="btn btn-ghost" type="button" onClick={() => setShowPostModal(false)}>Cancel</button>
              <button className="btn btn-dark" type="button" onClick={handleSubmitPost} disabled={submittingPost}>
                {submittingPost ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
