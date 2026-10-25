import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import CommunityList from './components/CommunityList';
import CommunityFeed from './components/CommunityFeed';
import CommunityDiscussions from './components/CommunityDiscussions';
import CommunityMembers from './components/CommunityMembers';
import CommunityOpportunities from './components/CommunityOpportunities';
import CommunityEvents from './components/CommunityEvents';
import PostComposer from './components/PostComposer';
import CommunityHeader from './components/CommunityHeader';
import JoinPopup from './components/JoinPopup';
import Toast from './components/Toast';
import './CommunityPage.css';

const CommunityPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const API_BASE = '/api';

  const categories = [
    'All', 'Business', 'Technology', 'Music', 'Fashion', 'Agriculture',
    'Sports', 'Education', 'Finance', 'Creative Arts', 'Lifestyle',
    'Youth', 'Women in Business', 'Community Impact'
  ];

  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedCommunities, setJoinedCommunities] = useState(new Set());
  const [currentCommunity, setCurrentCommunity] = useState(null);
  const [currentTab, setCurrentTab] = useState('Feed');
  const [isJoined, setIsJoined] = useState(false);
  const [followingMembers, setFollowingMembers] = useState(new Set());
  const [showComposerModal, setShowComposerModal] = useState(false);
  const [composerText, setComposerText] = useState('');
  const [pendingImageDataUrl, setPendingImageDataUrl] = useState(null);
  const [fileInputRef, setFileInputRef] = useState(null);
  const hasFetchedCommunities = useRef(false);
  const hasFetchedJoinedCommunities = useRef(false);
  const [members, setMembers] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [events, setEvents] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [showDiscussionComposer, setShowDiscussionComposer] = useState(false);
  const [discussionTitle, setDiscussionTitle] = useState('');
  const [discussionContent, setDiscussionContent] = useState('');
  const [discussionTag, setDiscussionTag] = useState('');
  const [replyText, setReplyText] = useState('');
  const [postMenuOpen, setPostMenuOpen] = useState(null);
  const [discussionMenuOpen, setDiscussionMenuOpen] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editPostContent, setEditPostContent] = useState('');
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [posts, setPosts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [selectedCommunityForJoin, setSelectedCommunityForJoin] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Load joined communities from localStorage
  const loadJoinedCommunities = () => {
    try {
      const stored = localStorage.getItem('joinedCommunities');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch (error) {
      console.error('Error loading joined communities:', error);
      return new Set();
    }
  };

  // Fetch user's joined communities from database
  const fetchUserJoinedCommunities = async (userId) => {
    if (hasFetchedJoinedCommunities.current) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/communities/user/${userId}`);

      if (response.status === 429) {
        console.warn('Rate limited, using cached data if available');
        return;
      }

      if (response.status === 503) {
        console.error('Service unavailable when fetching joined communities');
        return;
      }

      const data = await response.json();

      if (data.success && data.data) {
        const communityIds = data.data.map(c => c.id);
        const newSet = new Set(communityIds);
        localStorage.setItem('joinedCommunities', JSON.stringify([...newSet]));
        setJoinedCommunities(newSet);
        hasFetchedJoinedCommunities.current = true;
      }
    } catch (error) {
      console.error('Error fetching joined communities:', error);
    }
  };

  // Fetch communities from API
  useEffect(() => {
    if (hasFetchedCommunities.current) {
      return;
    }

    const fetchCommunities = async () => {
      try {
        const response = await fetch(`${API_BASE}/communities`);

        if (response.status === 429) {
          console.warn('Rate limited fetching communities');
          setLoading(false);
          return;
        }

        if (response.status === 503) {
          console.error('Service unavailable when fetching communities');
          setLoading(false);
          return;
        }

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
          }));
          setCommunities(transformed);
          hasFetchedCommunities.current = true;
        }
      } catch (error) {
        console.error('Error fetching communities:', error);
        setCommunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  // Fetch user's joined communities when user is available
  useEffect(() => {
    const userStr = localStorage.getItem('trendorabay-user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id;

    if (userId) {
      setCurrentUserId(userId);
      fetchUserJoinedCommunities(userId);
    }
  }, []);

  // Helper to save joined communities to localStorage
  const saveJoinedCommunities = (set) => {
    const newSet = new Set(set);
    localStorage.setItem('joinedCommunities', JSON.stringify([...newSet]));
    setJoinedCommunities(newSet);
  };

  // Helper to truncate text
  const truncateText = (text, maxLines = 3) => {
    const lines = text.split('\n');
    if (lines.length <= maxLines) return text;
    return lines.slice(0, maxLines).join('\n') + '...';
  };

  // Helper to format links in content
  const formatContent = (text) => {
    if (!text) return '';
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer"
            className="content-link"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  // Toggle post expansion
  const togglePostExpansion = (postId) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  // Helper function to format time
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    
    const date = new Date(dateString);
    const now = new Date();
    
    const timezoneOffset = now.getTimezoneOffset() * 60 * 1000;
    const adjustedDate = new Date(date.getTime() - timezoneOffset);
    
    const seconds = Math.floor((now - adjustedDate) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`;
    if (hours < 24) return `${hours} ${hours === 1 ? 'hr' : 'hrs'} ago`;
    if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    if (weeks < 4) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    if (years > 0) return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    return date.toLocaleDateString();
  };

  // Restore community from URL on mount
  useEffect(() => {
    const communityId = searchParams.get('community');
    if (communityId) {
      const community = communities.find(c => c.id === communityId);
      if (community) {
        setCurrentCommunity(community);
        setIsJoined(joinedCommunities.has(community.dbId));
        setCurrentTab(searchParams.get('tab') || 'Feed');
        window.scrollTo(0, 0);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [communities, searchParams, joinedCommunities]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.post-menu-container')) {
        setPostMenuOpen(null);
      }
      if (!event.target.closest('.discussion-menu-container')) {
        setDiscussionMenuOpen(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Fetch posts for current community
  useEffect(() => {
    const fetchPosts = async () => {
      if (!currentCommunity || !currentCommunity.dbId || currentTab !== 'Feed') return;

      try {
        const response = await fetch(`${API_BASE}/community-posts/community/${currentCommunity.dbId}`);

        if (response.status === 503) {
          console.error('Service unavailable when fetching posts');
          return;
        }

        const data = await response.json();

        if (data.success && data.data) {
          const postsWithoutComments = data.data.map(p => ({
            id: p.id,
            author: p.username || `${p.first_name} ${p.last_name}`.trim(),
            initial: (p.username || p.first_name || 'U')[0].toUpperCase(),
            time: formatTimeAgo(p.created_at),
            content: p.content,
            image: p.image_url,
            likes: p.likes_count || 0,
            liked: false,
            commentsOpen: false,
            comments: [],
            userId: p.user_id,
            authorUsername: p.username
          }));

          setPosts(postsWithoutComments);

          postsWithoutComments.forEach(async (post) => {
            try {
              const commentsResponse = await fetch(`${API_BASE}/community-posts/${post.id}`);
              const commentsData = await commentsResponse.json();
              if (commentsData.success && commentsData.data.comments) {
                const comments = commentsData.data.comments.map(c => ({
                  author: c.username || `${c.first_name} ${c.last_name}`.trim(),
                  text: c.content
                }));
                setPosts(prevPosts => prevPosts.map(p => {
                  if (p.id === post.id) {
                    return { ...p, comments };
                  }
                  return p;
                }));
              }
            } catch (error) {
              console.error('Error fetching comments for post:', post.id, error);
            }
          });
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [currentCommunity?.dbId, currentTab, API_BASE]);

  // Fetch members for current community
  useEffect(() => {
    const fetchMembers = async () => {
      if (!currentCommunity || !currentCommunity.dbId) return;

      try {
        const response = await fetch(`${API_BASE}/communities/${currentCommunity.dbId}/members`);
        const data = await response.json();

        if (data.success && data.data) {
          const transformed = data.data.map(m => ({
            name: m.username || `${m.first_name} ${m.last_name}`.trim(),
            role: m.role || 'Member',
            initial: (m.username || m.first_name || 'U')[0].toUpperCase(),
            location: m.location || 'Unknown',
            posts: m.post_count || 0
          }));
          setMembers(transformed);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, [currentCommunity?.dbId, API_BASE]);

  // Fetch opportunities for current community category
  useEffect(() => {
    const fetchOpportunities = async () => {
      if (!currentCommunity || !currentCommunity.category) return;

      try {
        const response = await fetch(`${API_BASE}/opportunities?category=${encodeURIComponent(currentCommunity.category)}&limit=10`);
        const data = await response.json();

        if (data.success && data.data) {
          const transformed = data.data.map(o => ({
            title: o.title,
            org: o.organization_name || 'Unknown',
            logo: o.organization_logo || '🏢',
            tags: [o.opportunity_type, o.category].filter(Boolean),
            deadline: o.deadline ? `Closes ${formatTimeAgo(o.deadline)}` : 'No deadline',
            location: o.location || o.country || 'Remote'
          }));
          setOpportunities(transformed);
        }
      } catch (error) {
        console.error('Error fetching opportunities:', error);
      }
    };

    fetchOpportunities();
  }, [currentCommunity?.category, API_BASE]);

  // Fetch events for current community category
  useEffect(() => {
    const fetchEvents = async () => {
      if (!currentCommunity || !currentCommunity.category) return;

      try {
        const response = await fetch(`${API_BASE}/events?category=${encodeURIComponent(currentCommunity.category)}&limit=10`);
        const data = await response.json();

        if (data.success && data.data) {
          const transformed = data.data.map(e => {
            const date = new Date(e.event_date);
            const attendees = Array.isArray(e.attendees) ? e.attendees : [];
            return {
              day: date.getDate(),
              month: date.toLocaleString('default', { month: 'short' }),
              title: e.title,
              venue: e.location || 'TBD',
              attendees: attendees.slice(0, 3).map(a => a[0] || 'A'),
              spots: `${attendees.length} attending`
            };
          });
          setEvents(transformed);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [currentCommunity?.category, API_BASE]);

  // Fetch discussions for current community
  useEffect(() => {
    const fetchDiscussions = async () => {
      if (!currentCommunity || !currentCommunity.dbId || currentTab !== 'Discussions') return;

      try {
        const response = await fetch(`${API_BASE}/community-discussions/community/${currentCommunity.dbId}`);

        if (response.status === 503) {
          console.error('Service unavailable when fetching discussions');
          return;
        }

        const data = await response.json();

        if (data.success && data.data) {
          const transformed = data.data.map(d => ({
            id: d.id,
            title: d.title,
            content: d.content,
            author: d.username || `${d.first_name} ${d.last_name}`.trim(),
            initial: (d.username || d.first_name || 'U')[0].toUpperCase(),
            time: formatTimeAgo(d.created_at),
            tag: d.tag,
            repliesCount: d.replies_count || 0,
            views: d.views || 0,
            userId: d.user_id,
            authorUsername: d.username
          }));
          setDiscussions(transformed);
        }
      } catch (error) {
        console.error('Error fetching discussions:', error);
      }
    };

    fetchDiscussions();
  }, [currentCommunity?.dbId, currentTab, API_BASE]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2600);
  };

  const openCommunity = (dbId) => {
    const community = communities.find(c => c.dbId === dbId);
    if (!community) return;
    setCurrentCommunity(community);
    setCurrentTab('Feed');
    setSelectedDiscussion(null);
    setIsJoined(joinedCommunities.has(dbId));
    setSearchParams({ community: community.id, tab: 'Feed' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBackToList = () => {
    setCurrentCommunity(null);
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openJoinPopup = (community) => {
    setSelectedCommunityForJoin(community);
    setShowJoinPopup(true);
    document.body.style.overflow = 'hidden';
  };

  const closeJoinPopup = () => {
    setShowJoinPopup(false);
    document.body.style.overflow = '';
    setSelectedCommunityForJoin(null);
  };

  const handleConfirmJoin = async () => {
    if (!selectedCommunityForJoin) return;

    const dbId = selectedCommunityForJoin.dbId;
    const userStr = localStorage.getItem('trendorabay-user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id;

    if (!userId) {
      showToast('Please log in to join a community');
      closeJoinPopup();
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/communities/${dbId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: parseInt(userId) }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const newJoined = new Set(joinedCommunities);
        newJoined.add(dbId);
        saveJoinedCommunities(newJoined);
        setIsJoined(true);

        if (currentCommunity && currentCommunity.dbId === dbId) {
          const membersResponse = await fetch(`${API_BASE}/communities/${dbId}/members`);
          const membersData = await membersResponse.json();
          if (membersData.success && membersData.data) {
            const transformed = membersData.data.map(m => ({
              name: m.username || `${m.first_name} ${m.last_name}`.trim(),
              role: m.role || 'Member',
              initial: (m.username || m.first_name || 'U')[0].toUpperCase(),
              location: m.location || 'Unknown',
              posts: m.post_count || 0
            }));
            setMembers(transformed);
          }
        }

        const joinedName = selectedCommunityForJoin.name;
        closeJoinPopup();
        showToast(`✓ You joined ${joinedName}!`);
      } else {
        console.error('Join failed:', result);
        showToast(result.error || 'Failed to join community. Please try again.');
      }
    } catch (error) {
      console.error('Error joining community:', error);
      showToast('Failed to join community. Please try again.');
    }
  };

  const toggleJoin = async () => {
    if (!currentCommunity) return;
    
    const userStr = localStorage.getItem('trendorabay-user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id;

    if (!userId) {
      showToast('Please log in to join a community');
      return;
    }

    try {
      if (isJoined) {
        const response = await fetch(`${API_BASE}/communities/${currentCommunity.dbId}/leave`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: parseInt(userId) }),
        });

        if (response.ok) {
          const newJoined = new Set(joinedCommunities);
          newJoined.delete(currentCommunity.dbId);
          saveJoinedCommunities(newJoined);
          setIsJoined(false);
          showToast(`You left ${currentCommunity.name}.`);
        } else {
          showToast('Failed to leave community. Please try again.');
        }
      } else {
        const response = await fetch(`${API_BASE}/communities/${currentCommunity.dbId}/join`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: parseInt(userId) }),
        });

        if (response.ok) {
          const newJoined = new Set(joinedCommunities);
          newJoined.add(currentCommunity.dbId);
          saveJoinedCommunities(newJoined);
          setIsJoined(true);
          
          const membersResponse = await fetch(`${API_BASE}/communities/${currentCommunity.dbId}/members`);
          const membersData = await membersResponse.json();
          if (membersData.success && membersData.data) {
            const transformed = membersData.data.map(m => ({
              name: m.username || `${m.first_name} ${m.last_name}`.trim(),
              role: m.role || 'Member',
              initial: (m.username || m.first_name || 'U')[0].toUpperCase(),
              location: m.location || 'Unknown',
              posts: m.post_count || 0
            }));
            setMembers(transformed);
          }
          
          showToast(`✓ You joined ${currentCommunity.name}!`);
        } else {
          showToast('Failed to join community. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error toggling join:', error);
      showToast('Failed to update membership. Please try again.');
    }
  };

  const toggleLike = async (postId) => {
    const userStr = localStorage.getItem('trendorabay-user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id;

    if (!userId) {
      showToast('Please log in to like posts');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/community-posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: parseInt(userId) }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return { 
              ...p, 
              liked: result.liked, 
              likes: result.liked ? p.likes + 1 : p.likes - 1 
            };
          }
          return p;
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 };
        }
        return p;
      }));
    }
  };

  const toggleComments = (postId) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return { ...p, commentsOpen: !p.commentsOpen };
      }
      return p;
    }));
  };

  const submitComment = async (postId, text) => {
    if (!text.trim()) return;

    const userStr = localStorage.getItem('trendorabay-user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id;

    if (!userId) {
      showToast('Please log in to comment');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/community-posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: parseInt(userId),
          content: text
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        try {
          const commentsResponse = await fetch(`${API_BASE}/community-posts/${postId}`);
          const commentsData = await commentsResponse.json();
          if (commentsData.success && commentsData.data.comments) {
            setPosts(posts.map(p => {
              if (p.id === postId) {
                return {
                  ...p,
                  comments: commentsData.data.comments.map(c => ({
                    author: c.username || `${c.first_name} ${c.last_name}`.trim(),
                    text: c.content
                  })),
                  commentsOpen: true
                };
              }
              return p;
            }));
          }
        } catch (error) {
          console.error('Error refetching comments:', error);
          setPosts(posts.map(p => {
            if (p.id === postId) {
              const newComments = [...(p.comments || []), {
                author: result.data.username || user.username || 'You',
                text
              }];
              return { ...p, comments: newComments, commentsOpen: true };
            }
            return p;
          }));
        }
        showToast('Comment posted!');
      } else {
        console.error('Comment failed:', result);
        showToast(result.error || result.message || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      showToast('Failed to post comment. Please try again.');
    }
  };

  const deletePost = async (postId) => {
    if (!currentUserId) {
      showToast('Please log in to delete posts');
      return;
    }

    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/community-posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: parseInt(currentUserId) }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setPosts(posts.filter(p => p.id !== postId));
        showToast('Post deleted successfully');
      } else {
        console.error('Delete failed:', result);
        showToast(result.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      showToast('Failed to delete post. Please try again.');
    }
  };

  const deleteDiscussion = async (discussionId) => {
    if (!currentUserId) {
      showToast('Please log in to delete discussions');
      return;
    }

    if (!confirm('Are you sure you want to delete this discussion? This cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/community-discussions/${discussionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setDiscussions(discussions.filter(d => d.id !== discussionId));
        if (selectedDiscussion && selectedDiscussion.id === discussionId) {
          setSelectedDiscussion(null);
        }
        setDiscussionMenuOpen(null);
        showToast('Discussion deleted successfully');
      } else {
        console.error('Delete failed:', result);
        showToast(result.error || 'Failed to delete discussion');
      }
    } catch (error) {
      console.error('Error deleting discussion:', error);
      showToast('Failed to delete discussion. Please try again.');
    }
  };

  const editPost = async (postId) => {
    if (!editPostContent.trim()) {
      showToast('Content cannot be empty');
      return;
    }

    if (!currentUserId) {
      showToast('Please log in to edit posts');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/community-posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: parseInt(currentUserId),
          content: editPostContent
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return { ...p, content: editPostContent };
          }
          return p;
        }));
        setEditingPost(null);
        setEditPostContent('');
        setPostMenuOpen(null);
        showToast('Post updated successfully');
      } else {
        console.error('Edit failed:', result);
        showToast(result.error || 'Failed to update post');
      }
    } catch (error) {
      console.error('Error editing post:', error);
      showToast('Failed to update post. Please try again.');
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Please pick an image file.'); return; }
    if (file.size > 8 * 1024 * 1024) { showToast('Image is too large (max 8MB).'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPendingImageDataUrl(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const submitPost = async () => {
    if (!composerText.trim() && !pendingImageDataUrl) { showToast('Write something or add an image first.'); return; }

    const userStr = localStorage.getItem('trendorabay-user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id;

    if (!userId) {
      showToast('Please log in to post');
      return;
    }

    if (!currentCommunity) {
      showToast('Please select a community');
      return;
    }

    if (!isJoined) {
      showToast('Please join this community to post');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/community-posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          community_id: currentCommunity.dbId,
          user_id: parseInt(userId),
          content: composerText,
          image_url: pendingImageDataUrl || null
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const newPost = {
          id: result.data.id,
          author: result.data.username || user.username || 'You',
          initial: (result.data.username || user.username || 'You')[0].toUpperCase(),
          time: 'Just now',
          content: composerText,
          image: pendingImageDataUrl || null,
          likes: 0,
          liked: false,
          commentsOpen: false,
          comments: [],
          userId: parseInt(userId),
          authorUsername: result.data.username || user.username
        };
        setPosts([newPost, ...posts]);
        setComposerText('');
        setPendingImageDataUrl(null);
        setShowComposerModal(false);
        showToast('Post published!');
      } else {
        console.error('Post failed:', result);
        showToast(result.error || result.message || 'Failed to publish post.');
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      showToast('Failed to publish post. Please try again.');
    }
  };

  const submitDiscussion = async () => {
    if (!discussionTitle.trim() || !discussionContent.trim()) {
      showToast('Please provide both title and content');
      return;
    }

    const userStr = localStorage.getItem('trendorabay-user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id;

    if (!userId) {
      showToast('Please log in to start a discussion');
      return;
    }

    if (!isJoined) {
      showToast('Please join this community to start discussions');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/community-discussions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          community_id: currentCommunity.dbId,
          user_id: parseInt(userId),
          title: discussionTitle,
          content: discussionContent,
          tag: discussionTag || null
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const newDiscussion = {
          id: result.data.id,
          title: discussionTitle,
          content: discussionContent,
          author: result.data.username || user.username || 'You',
          initial: (result.data.username || user.username || 'You')[0].toUpperCase(),
          time: 'Just now',
          tag: discussionTag,
          repliesCount: 0,
          views: 0,
          userId: parseInt(userId),
          authorUsername: result.data.username || user.username
        };
        setDiscussions([newDiscussion, ...discussions]);
        setDiscussionTitle('');
        setDiscussionContent('');
        setDiscussionTag('');
        setShowDiscussionComposer(false);
        showToast('Discussion started!');
      } else {
        console.error('Discussion failed:', result);
        showToast(result.error || 'Failed to start discussion');
      }
    } catch (error) {
      console.error('Error submitting discussion:', error);
      showToast('Failed to start discussion. Please try again.');
    }
  };

  const openDiscussion = async (discussionId) => {
    try {
      const response = await fetch(`${API_BASE}/community-discussions/${discussionId}`);
      const data = await response.json();

      if (data.success && data.data) {
        const discussion = {
          id: data.data.id,
          title: data.data.title,
          content: data.data.content,
          author: data.data.username || `${data.data.first_name} ${data.data.last_name}`.trim(),
          initial: (data.data.username || data.data.first_name || 'U')[0].toUpperCase(),
          time: formatTimeAgo(data.data.created_at),
          tag: data.data.tag,
          views: data.data.views || 0,
          userId: data.data.user_id,
          authorUsername: data.data.username,
          replies: data.data.replies ? data.data.replies.map(r => ({
            id: r.id,
            author: r.username || `${r.first_name} ${r.last_name}`.trim(),
            initial: (r.username || r.first_name || 'U')[0].toUpperCase(),
            content: r.content,
            time: formatTimeAgo(r.created_at)
          })) : []
        };
        setSelectedDiscussion(discussion);
      }
    } catch (error) {
      console.error('Error fetching discussion:', error);
      showToast('Failed to load discussion');
    }
  };

  const submitReply = async () => {
    if (!replyText.trim()) return;

    const userStr = localStorage.getItem('trendorabay-user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id;

    if (!userId) {
      showToast('Please log in to reply');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/community-discussions/${selectedDiscussion.id}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: replyText
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const newReply = {
          id: result.data.id,
          author: result.data.username || user.username || 'You',
          initial: (result.data.username || user.username || 'You')[0].toUpperCase(),
          content: replyText,
          time: 'Just now'
        };
        setSelectedDiscussion({
          ...selectedDiscussion,
          replies: [...selectedDiscussion.replies, newReply]
        });
        setReplyText('');
        showToast('Reply posted!');
      } else {
        console.error('Reply failed:', result);
        showToast(result.error || 'Failed to post reply');
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      showToast('Failed to post reply. Please try again.');
    }
  };

  const toggleFollow = (memberName) => {
    const newFollowing = new Set(followingMembers);
    if (newFollowing.has(memberName)) {
      newFollowing.delete(memberName);
      showToast(`Unfollowed ${memberName}`);
    } else {
      newFollowing.add(memberName);
      showToast(`Following ${memberName}`);
    }
    setFollowingMembers(newFollowing);
  };

  return (
    <div className="community-page">
      {!currentCommunity && (
        <CommunityList
          communities={communities}
          loading={loading}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          openCommunity={openCommunity}
          joinedCommunities={joinedCommunities}
        />
      )}

      {currentCommunity && (
        <>
          <CommunityHeader
            currentCommunity={currentCommunity}
            goBackToList={goBackToList}
            isJoined={isJoined}
            toggleJoin={toggleJoin}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            showComposerModal={showComposerModal}
            setShowComposerModal={setShowComposerModal}
          />

          <div className="community-content">
            {currentTab === 'Feed' && (
              <CommunityFeed
                posts={posts}
                expandedPosts={expandedPosts}
                togglePostExpansion={togglePostExpansion}
                formatTimeAgo={formatTimeAgo}
                formatContent={formatContent}
                toggleLike={toggleLike}
                toggleComments={toggleComments}
                submitComment={submitComment}
                currentUserId={currentUserId}
                deletePost={deletePost}
                editPost={editPost}
                editingPost={editingPost}
                editPostContent={editPostContent}
                setEditPostContent={setEditPostContent}
                setEditingPost={setEditingPost}
                setPostMenuOpen={setPostMenuOpen}
                postMenuOpen={postMenuOpen}
              />
            )}

            {currentTab === 'Discussions' && (
              <CommunityDiscussions
                discussions={discussions}
                selectedDiscussion={selectedDiscussion}
                setSelectedDiscussion={setSelectedDiscussion}
                showDiscussionComposer={showDiscussionComposer}
                setShowDiscussionComposer={setShowDiscussionComposer}
                discussionTitle={discussionTitle}
                setDiscussionTitle={setDiscussionTitle}
                discussionContent={discussionContent}
                setDiscussionContent={setDiscussionContent}
                discussionTag={discussionTag}
                setDiscussionTag={setDiscussionTag}
                submitDiscussion={submitDiscussion}
                openDiscussion={openDiscussion}
                deleteDiscussion={deleteDiscussion}
                currentUserId={currentUserId}
                discussionMenuOpen={discussionMenuOpen}
                setDiscussionMenuOpen={setDiscussionMenuOpen}
                replyText={replyText}
                setReplyText={setReplyText}
                submitReply={submitReply}
              />
            )}

            {currentTab === 'Members' && (
              <CommunityMembers
                members={members}
                followingMembers={followingMembers}
                toggleFollow={toggleFollow}
              />
            )}

            {currentTab === 'Opportunities' && (
              <CommunityOpportunities
                opportunities={opportunities}
              />
            )}

            {currentTab === 'Events' && (
              <CommunityEvents
                events={events}
              />
            )}
          </div>
        </>
      )}

      <PostComposer
        showComposerModal={showComposerModal}
        setShowComposerModal={setShowComposerModal}
        composerText={composerText}
        setComposerText={setComposerText}
        pendingImageDataUrl={pendingImageDataUrl}
        setPendingImageDataUrl={setPendingImageDataUrl}
        fileInputRef={fileInputRef}
        handleImageSelect={handleImageSelect}
        submitPost={submitPost}
      />

      <JoinPopup
        showJoinPopup={showJoinPopup}
        closeJoinPopup={closeJoinPopup}
        selectedCommunityForJoin={selectedCommunityForJoin}
        handleConfirmJoin={handleConfirmJoin}
      />

      <Toast show={toast.show} message={toast.message} />
    </div>
  );
};

export default CommunityPage;
