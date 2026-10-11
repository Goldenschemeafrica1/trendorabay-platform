import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
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

  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState(new Set());

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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
    // Prevent duplicate calls
    if (hasFetchedJoinedCommunities.current) {
      console.log('Already fetched joined communities, skipping');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/communities/user/${userId}`);

      // Handle rate limiting (429)
      if (response.status === 429) {
        console.warn('Rate limited, using cached data if available');
        return;
      }

      const data = await response.json();

      if (data.success && data.data) {
        const communityIds = data.data.map(c => c.id);
        const newSet = new Set(communityIds);
        localStorage.setItem('joinedCommunities', JSON.stringify([...newSet]));
        setJoinedCommunities(newSet);
        hasFetchedJoinedCommunities.current = true;
        console.log('Fetched joined communities from database:', communityIds);
      }
    } catch (error) {
      console.error('Error fetching joined communities:', error);
    }
  };

  const [joinedCommunities, setJoinedCommunities] = useState(loadJoinedCommunities());
  const [selectedCommunityForJoin, setSelectedCommunityForJoin] = useState(null);
  const [currentCommunity, setCurrentCommunity] = useState(null);
  const [currentTab, setCurrentTab] = useState('Feed');
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [isJoined, setIsJoined] = useState(false);
  const [followingMembers, setFollowingMembers] = useState(new Set());
  const [currentDiscussionId, setCurrentDiscussionId] = useState(null);
  const [showComposerModal, setShowComposerModal] = useState(false);
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [composerText, setComposerText] = useState('');
  const [pendingImageDataUrl, setPendingImageDataUrl] = useState(null);
  const [discTitle, setDiscTitle] = useState('');
  const [discTag, setDiscTag] = useState('General');
  const [discBody, setDiscBody] = useState('');
  const fileInputRef = useRef(null);
  const hasFetchedJoinedCommunities = useRef(false);
  const hasFetchedCommunities = useRef(false);
  const [members, setMembers] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [events, setEvents] = useState([]);
  const [discussions, setDiscussions] = useState([]);

  // Fetch communities from API
  useEffect(() => {
    if (hasFetchedCommunities.current) {
      return;
    }

    const fetchCommunities = async () => {
      try {
        const response = await fetch(`${API_BASE}/communities`);

        // Handle rate limiting (429)
        if (response.status === 429) {
          console.warn('Rate limited fetching communities');
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data.success && data.data) {
          // Transform API data to match expected format
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
      fetchUserJoinedCommunities(userId);
    }
  }, []); // Only run once on mount

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
    
    // Adjust for timezone offset (database is UTC, browser is UTC+3)
    const timezoneOffset = now.getTimezoneOffset() * 60 * 1000; // offset in milliseconds
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
        // Scroll to top immediately
        window.scrollTo(0, 0);
      }
    } else {
      // If no community in URL, scroll to top
      window.scrollTo(0, 0);
    }
  }, [communities, searchParams, joinedCommunities]);

  // Fetch posts for current community (only when Feed tab is active)
  useEffect(() => {
    const fetchPosts = async () => {
      if (!currentCommunity || !currentCommunity.dbId || currentTab !== 'Feed') return;

      try {
        const response = await fetch(`${API_BASE}/community-posts/community/${currentCommunity.dbId}`);
        const data = await response.json();

        if (data.success && data.data) {
          // First, display posts immediately without comments (for instant load)
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
            comments: []
          }));

          setPosts(postsWithoutComments);

          // Then fetch comments in the background
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
        // Keep existing posts if fetch fails
      }
    };

    fetchPosts();
  }, [currentCommunity?.dbId, currentTab, API_BASE]);

  // Fetch members for current community (only when Members tab is active)
  useEffect(() => {
    const fetchMembers = async () => {
      if (!currentCommunity || !currentCommunity.dbId || currentTab !== 'Members') return;

      try {
        const response = await fetch(`${API_BASE}/communities/${currentCommunity.dbId}/members`);
        const data = await response.json();

        console.log('Members API response:', data);

        if (data.success && data.data) {
          // Transform API data to match expected format
          const transformed = data.data.map(m => ({
            name: m.username || `${m.first_name} ${m.last_name}`.trim(),
            role: m.role || 'Member',
            initial: (m.username || m.first_name || 'U')[0].toUpperCase(),
            location: m.location || 'Unknown',
            posts: m.post_count || 0
          }));
          console.log('Transformed members:', transformed);
          setMembers(transformed);
        } else {
          console.log('No members data or success false');
        }
      } catch (error) {
        console.error('Error fetching members:', error);
        // Keep existing members if fetch fails
      }
    };

    fetchMembers();
  }, [currentCommunity?.dbId, currentTab, API_BASE]);

  // Fetch opportunities for current community category (only when Opportunities tab is active)
  useEffect(() => {
    const fetchOpportunities = async () => {
      if (!currentCommunity || !currentCommunity.category || currentTab !== 'Opportunities') return;

      try {
        const response = await fetch(`${API_BASE}/opportunities?category=${encodeURIComponent(currentCommunity.category)}&limit=10`);
        const data = await response.json();

        if (data.success && data.data) {
          // Transform API data to match expected format
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
        // Keep existing opportunities if fetch fails
      }
    };

    fetchOpportunities();
  }, [currentCommunity?.category, currentTab, API_BASE]);

  // Fetch events for current community category (only when Events tab is active)
  useEffect(() => {
    const fetchEvents = async () => {
      if (!currentCommunity || !currentCommunity.category || currentTab !== 'Events') return;

      try {
        const response = await fetch(`${API_BASE}/events?category=${encodeURIComponent(currentCommunity.category)}&limit=10`);
        const data = await response.json();

        if (data.success && data.data) {
          // Transform API data to match expected format
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
        // Keep existing events if fetch fails
      }
    };

    fetchEvents();
  }, [currentCommunity?.category, currentTab, API_BASE]);

  // Fetch discussions for current community (only when Discussions tab is active)
  useEffect(() => {
    const fetchDiscussions = async () => {
      if (!currentCommunity || !currentCommunity.dbId || currentTab !== 'Discussions') return;

      try {
        const response = await fetch(`${API_BASE}/community-discussions/community/${currentCommunity.dbId}`);
        const data = await response.json();

        if (data.success && data.data) {
          // Transform API data to match expected format
          const transformed = data.data.map(d => ({
            id: d.id,
            tag: d.tag || 'General',
            title: d.title,
            excerpt: d.content.substring(0, 150) + '...',
            body: d.content,
            author: d.username || `${d.first_name} ${d.last_name}`.trim(),
            initial: (d.username || d.first_name || 'U')[0].toUpperCase(),
            time: formatTimeAgo(d.created_at),
            views: d.views || 0,
            repliesList: [],
            replies_count: d.replies_count || 0
          }));
          setDiscussions(transformed);
        }
      } catch (error) {
        console.error('Error fetching discussions:', error);
        // Keep existing discussions if fetch fails
      }
    };

    fetchDiscussions();
  }, [currentCommunity?.dbId, currentTab, API_BASE]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2600);
  };

  const getFilteredCommunities = () => {
    let list = [...communities];
    if (selectedCategory !== 'All') {
      list = list.filter(c => c.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c =>
        (c.name + ' ' + c.category + ' ' + c.desc).toLowerCase().includes(q)
      );
    }
    return list;
  };

  const openCommunity = (dbId) => {
    const community = communities.find(c => c.dbId === dbId);
    if (!community) return;
    setCurrentCommunity(community);
    setCurrentTab('Feed');
    setCurrentDiscussionId(null);
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
    
    // Get user data from localStorage
    const userStr = localStorage.getItem('trendorabay-user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id;

    console.log('Joining community with user:', user, 'userId:', userId);

    if (!userId) {
      showToast('Please log in to join a community');
      closeJoinPopup();
      return;
    }

    try {
      // Call API to join community
      const response = await fetch(`${API_BASE}/communities/${dbId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: parseInt(userId) }),
      });

      const result = await response.json();
      console.log('Join API response:', result);

      if (response.ok && result.success) {
        const newJoined = new Set(joinedCommunities);
        newJoined.add(dbId);
        saveJoinedCommunities(newJoined);
        setIsJoined(true);

        // Refetch members to include the newly joined user
        if (currentCommunity && currentCommunity.dbId === dbId) {
          const membersResponse = await fetch(`${API_BASE}/communities/${dbId}/members`);
          const membersData = await membersResponse.json();
          console.log('Members after join:', membersData);
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
    
    // Get user data from localStorage
    const userStr = localStorage.getItem('trendorabay-user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id;

    console.log('Toggle join with user:', user, 'userId:', userId);

    if (!userId) {
      showToast('Please log in to join a community');
      return;
    }

    try {
      if (isJoined) {
        // Leave community
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
        // Join community
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
          
          // Refetch members to include the newly joined user
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
    // Get user data from localStorage
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
      // Fallback to local state
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

    // Get user data from localStorage
    const userStr = localStorage.getItem('trendorabay-user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id;

    console.log('Submitting comment with user:', user, 'userId:', userId, 'postId:', postId, 'text:', text);
    console.log('Current posts in state:', posts.map(p => ({ id: p.id, author: p.author })));

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
      console.log('Comment API response:', JSON.stringify(result, null, 2));

      if (response.ok && result.success) {
        // Refetch comments for this post to get the latest from database
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
          // Fallback to adding comment locally
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

  const votePoll = (postId) => {
    setPosts(posts.map(p => {
      if (p.id === postId && p.poll && !p.poll.voted) {
        return { ...p, poll: { ...p.poll, voted: true, total: p.poll.total + 1 } };
      }
      return p;
    }));
    showToast('Vote recorded!');
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

  const sharePost = (postId) => {
    const postUrl = `${window.location.origin}/communities?community=${currentCommunity?.id}&tab=Feed`;
    navigator.clipboard.writeText(postUrl).then(() => {
      showToast('Link copied to clipboard!');
    }).catch(() => {
      showToast('Failed to copy link');
    });
  };

  const openDiscussion = (id) => {
    setCurrentDiscussionId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToDiscussions = () => {
    setCurrentDiscussionId(null);
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
    
    // Get user data from localStorage
    const userStr = localStorage.getItem('trendorabay-user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id;

    console.log('Submitting post with user:', user, 'userId:', userId);

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
      console.log('Post API response:', result);

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
          comments: []
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
    console.log('submitDiscussion called - isJoined:', isJoined, 'currentCommunity:', currentCommunity);
    
    if (!discTitle.trim() || !discBody.trim()) { showToast('Please fill in all fields.'); return; }
    
    // Get user data from localStorage
    const userStr = localStorage.getItem('trendorabay-user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id;

    console.log('User data:', user, 'userId:', userId);

    if (!userId) {
      showToast('Please log in to post discussions');
      return;
    }

    if (!currentCommunity || !currentCommunity.dbId) {
      showToast('Please select a community');
      return;
    }

    if (!isJoined) {
      showToast('Please join this community to post discussions');
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
          title: discTitle,
          content: discBody,
          tag: discTag
        }),
      });

      const result = await response.json();
      console.log('Discussion API response:', result);

      if (response.ok && result.success) {
        const newDiscussion = {
          id: result.data.id,
          tag: result.data.tag || discTag,
          title: result.data.title,
          excerpt: result.data.content.substring(0, 150) + '...',
          body: result.data.content,
          author: result.data.username || user.username || 'You',
          initial: (result.data.username || user.username || 'You')[0].toUpperCase(),
          time: 'Just now',
          views: result.data.views || 0,
          repliesList: [],
          replies_count: 0
        };
        setDiscussions([newDiscussion, ...discussions]);
        setDiscTitle('');
        setDiscTag('General');
        setDiscBody('');
        setShowDiscussionModal(false);
        showToast('Discussion posted!');
        setCurrentTab('Discussions');
        setCurrentDiscussionId(null);
      } else {
        console.error('Discussion failed:', result);
        showToast(result.error || result.message || 'Failed to post discussion');
      }
    } catch (error) {
      console.error('Error submitting discussion:', error);
      showToast('Failed to post discussion. Please try again.');
    }
  };

  const filteredCommunities = getFilteredCommunities();
  const currentDiscussions = discussions;

  const renderSidebar = () => {
    const sidebarMembers = members.slice(0, 5);
    const trends = [];
    const sidebarEvents = events.slice(0, 3);
    const opps = opportunities.slice(0, 4);

    return (
      <aside className="sidebar">
        <div className="sidebar-card">
          <h4>Community Members</h4>
          {sidebarMembers.map(m => (
            <div key={m.name} className="member-row">
              <div className="avatar">{m.initial}</div>
              <div>
                <span>{m.name}</span>
                <small>{m.role}</small>
              </div>
            </div>
          ))}
        </div>

        <div className="sidebar-card">
          <h4>Trending Discussions</h4>
          {trends.map((t, i) => (
            <div key={i} className="trend-item" onClick={() => showToast(`Opening: ${t.name}`)}>
              <span>{t.name}</span>
              <span className="count">{t.count} posts</span>
            </div>
          ))}
        </div>

        <div className="sidebar-card">
          <h4>Upcoming Events</h4>
          {sidebarEvents.map((e, i) => (
            <div key={i} className="event-item">
              <div className="event-date">
                <strong>{e.day}</strong>
                <span>{e.month}</span>
              </div>
              <div className="event-info">
                <strong>{e.title}</strong>
                <span>{e.venue}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="sidebar-card">
          <h4>Opportunities</h4>
          {opps.map((o, i) => (
            <div key={i} className="opportunity-item" onClick={() => showToast(`Opening: ${o.title}`)}>
              <span className="dot"></span>
              {o.title}
            </div>
          ))}
        </div>
      </aside>
    );
  };

  const renderFeedTab = () => {
    return (
      <div>
        {isJoined ? (
          <div className="composer">
            <div className="composer-row">
              <div className="avatar">You</div>
              <input 
                className="composer-input" 
                placeholder="What's on your mind?" 
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
              />
            </div>
            <div className="composer-actions">
              <button className="composer-action" onClick={() => fileInputRef.current?.click()}>
                <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5-9 9"/></svg>
                Image
              </button>
              <button className="composer-action" onClick={() => showToast('Ask a question - just type your question in the text field')}>
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.7"/><circle cx="12" cy="17.5" r="0.5" fill="currentColor"/></svg>
                Ask a question
              </button>
              <button className="composer-action" onClick={() => showToast('Poll feature coming soon')}>
                <svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>
                Create poll
              </button>
              <button className="btn btn-dark btn-sm" onClick={submitPost} style={{marginLeft: 'auto'}}>
                Post
              </button>
            </div>
            {pendingImageDataUrl && (
              <div className="image-preview" style={{marginTop: '12px'}}>
                <img src={pendingImageDataUrl} alt="Selected image" />
                <button className="remove-image" type="button" onClick={() => setPendingImageDataUrl(null)}>
                  <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
                </button>
              </div>
            )}
            <input type="file" ref={fileInputRef} accept="image/*" style={{display:'none'}} onChange={handleImageSelect} />
          </div>
        ) : (
          <div className="locked-prompt">
            <h4>Only members can post</h4>
            <p>Join this community to share posts, ask questions, and connect with other members.</p>
            <button className="btn btn-dark btn-sm" onClick={toggleJoin}>Join Community</button>
          </div>
        )}
        {posts.map(p => (
          <div key={p.id} className="post">
            <div className="post-header">
              <div className="avatar">{p.initial}</div>
              <div className="post-author">
                <strong>{p.author}</strong>
                <span>{p.time}</span>
              </div>
            </div>
            {p.content && (
              <div className="post-content">
                {expandedPosts.has(p.id) || p.content.split('\n').length <= 3 ? (
                  <div>{p.content}</div>
                ) : (
                  <div>
                    <div>{truncateText(p.content, 3)}</div>
                    <button 
                      className="see-more-btn" 
                      onClick={() => togglePostExpansion(p.id)}
                      style={{background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', padding: '4px 0', fontSize: '13px'}}
                    >
                      See more
                    </button>
                  </div>
                )}
              </div>
            )}
            {p.image && (
              <div className="post-image">
                <img src={p.image} alt="Post image" loading="lazy" />
              </div>
            )}
            {p.poll && (
              <div className="post-poll">
                {p.poll.options.map((opt, i) => (
                  <div key={i} className={`post-poll-option${p.poll.voted ? ' voted' : ''}`} onClick={() => !p.poll.voted && votePoll(p.id)}>
                    <span>{opt.label}</span>
                    <span className="pct">{opt.pct}%</span>
                  </div>
                ))}
                <div className="post-poll-meta">
                  <span>{p.poll.total} votes</span>
                  <span>{p.poll.voted ? 'You voted' : 'Tap to vote'}</span>
                </div>
              </div>
            )}
            <div className="post-actions">
              <button className={`post-action${p.liked ? ' liked' : ''}`} onClick={() => toggleLike(p.id)}>
                <svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
                {p.likes}
              </button>
              <button className={`post-action${p.commentsOpen ? ' active' : ''}`} onClick={() => toggleComments(p.id)}>
                <svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-8 8H4l2-4a8 8 0 1 1 15-4z"/></svg>
                {p.comments ? p.comments.length : 0}
              </button>
              <button className="post-action" onClick={() => sharePost(p.id)}>
                <svg viewBox="0 0 24 24"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v13"/></svg>
                Share
              </button>
            </div>
            <div className={`comment-section${p.commentsOpen ? ' open' : ''}`}>
              {p.comments && p.comments.length > 0 ? (
                <div className="comment-list">
                  {p.comments.map((cm, i) => (
                    <div key={i} className="comment">
                      <div className="avatar avatar-sm">{cm.author[0]}</div>
                      <div className="comment-body">
                        <strong>{cm.author}</strong>
                        <p>{cm.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{fontSize: '13px', color: 'var(--muted)', marginBottom: '10px'}}>No comments yet. Start the conversation.</p>
              )}
              <div className="comment-composer">
                <div className="avatar avatar-sm">Y</div>
                <input type="text" placeholder="Write a comment…" onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    submitComment(p.id, e.target.value);
                    e.target.value = '';
                  }
                }} />
                <button className="btn btn-dark btn-xs" onClick={(e) => {
                  const input = e.target.previousElementSibling;
                  submitComment(p.id, input.value);
                  input.value = '';
                }}>Send</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDiscussionsTab = () => {
    if (currentDiscussionId) {
      const d = currentDiscussions.find(x => x.id === currentDiscussionId);
      if (!d) return <p style={{color: 'var(--muted)'}}>Discussion not found.</p>;

      return (
        <div className="thread-view">
          <div className="thread-back" onClick={backToDiscussions}>
            <svg viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to discussions
          </div>

          <div className="thread-original">
            <span className="discussion-tag">{d.tag}</span>
            <h2 style={{marginTop: '10px'}}>{d.title}</h2>
            <div className="post-header" style={{margin: '14px 0'}}>
              <div className="avatar avatar-lg">{d.initial}</div>
              <div className="post-author">
                <strong>{d.author}</strong>
                <span>{d.time}</span>
              </div>
            </div>
            <div className="content">{d.body.replace(/\n/g, '<br/>')}</div>
            <div className="thread-meta">
              <span>👁 {d.views} views</span>
              <span>💬 {d.repliesList.length} replies</span>
            </div>
          </div>

          <div className="thread-section-title">{d.repliesList.length} {d.repliesList.length === 1 ? 'Reply' : 'Replies'}</div>

          <div className="reply-list">
            {d.repliesList.map((r, i) => (
              <div key={i} className="reply">
                <div className="avatar">{r.initial}</div>
                <div className="reply-body">
                  <div className="reply-head">
                    <strong>{r.author}</strong>
                    <span>· {r.time}</span>
                  </div>
                  <p>{r.text}</p>
                  <div className="reply-actions">
                    <button className="reply-action" onClick={() => showToast('Liked reply')}>
                      <svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
                      Like
                    </button>
                    <button className="reply-action" onClick={() => showToast('Reply (prototype)')}>Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="reply-composer">
            <div className="row">
              <div className="avatar">You</div>
              <textarea placeholder="Write a reply…" />
            </div>
            <div className="footer">
              <button className="btn btn-ghost btn-sm" onClick={() => showToast('Cancelled')}>Cancel</button>
              <button className="btn btn-dark btn-sm" onClick={() => showToast('Reply posted!')}>Post Reply</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="tab-header">
          <div>
            <h3>Discussions</h3>
            <div className="sub">{currentDiscussions.length} {currentDiscussions.length === 1 ? 'thread' : 'threads'} in this community</div>
          </div>
          {isJoined ? (
            <button className="btn btn-dark btn-sm" onClick={() => {
              console.log('Start discussion clicked, showDiscussionModal:', showDiscussionModal);
              setShowDiscussionModal(true);
            }}>
              <svg viewBox="0 0 24 24" style={{width:'14px',height:'14px',stroke:'currentColor',fill:'none',strokeWidth:'2',strokeLinecap:'round',strokeLinejoin:'round'}}><path d="M12 5v14M5 12h14"/></svg>
              Start a discussion
            </button>
          ) : (
            <button className="btn btn-outline btn-sm" onClick={toggleJoin}>Join to start a discussion</button>
          )}
        </div>

        {!isJoined && (
          <div className="locked-prompt">
            <h4>Only members can start discussions</h4>
            <p>Join this community to ask questions, share ideas and start conversations with other members.</p>
            <button className="btn btn-dark btn-sm" onClick={toggleJoin}>Join Community</button>
          </div>
        )}

        {currentDiscussions.length === 0 ? (
          <p style={{color: 'var(--muted)'}}>No discussions yet. Be the first to start one.</p>
        ) : (
          <div className="discussion-list">
            {currentDiscussions.map(d => (
              <div key={d.id} className="discussion-item" onClick={() => openDiscussion(d.id)}>
                <span className="discussion-tag">{d.tag}</span>
                <h3>{d.title}</h3>
                <p>{d.excerpt}</p>
                <div className="discussion-meta">
                  <span>
                    <svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-8 8H4l2-4a8 8 0 1 1 15-4z"/></svg>
                    {d.repliesList.length} replies
                  </span>
                  <span>⏱ {d.time}</span>
                  <span>👁 {d.views} views</span>
                  <span>by {d.author}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderOpportunitiesTab = () => {
    if (!opportunities.length) return <p style={{color: 'var(--muted)'}}>No opportunities at the moment.</p>;
    return (
      <div className="opportunity-list">
        {opportunities.map((o, i) => (
          <div key={i} className="opportunity-card">
            <div className="opportunity-logo">{o.logo}</div>
            <div className="opportunity-body">
              <h3>{o.title}</h3>
              <div className="org">{o.org}</div>
              <div className="opportunity-tags">{o.tags.map((t, j) => <span key={j} className="opportunity-tag">{t}</span>)}</div>
              <div className="opportunity-foot">
                <span className="deadline">{o.deadline} · {o.location}</span>
                <button className="btn btn-dark btn-xs" onClick={() => showToast('Application started (prototype)')}>Apply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderEventsTab = () => {
    if (!events.length) return <p style={{color: 'var(--muted)'}}>No upcoming events.</p>;
    return (
      <div className="event-list">
        {events.map((e, i) => (
          <div key={i} className="event-card">
            <div className="event-cal">
              <strong>{e.day}</strong>
              <span>{e.month}</span>
            </div>
            <div className="event-body">
              <h3>{e.title}</h3>
              <div className="venue">
                <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {e.venue}
              </div>
              <div className="event-foot">
                <div className="event-attendees">
                  <div className="avatars">{e.attendees.map((a, j) => <div key={j} className="avatar">{a}</div>)}</div>
                  {e.spots}
                </div>
                <button className="btn btn-dark btn-xs" onClick={() => showToast('RSVP recorded (prototype)')}>RSVP</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMembersTab = () => {
    if (!members.length) return <p style={{color: 'var(--muted)'}}>No members to show.</p>;
    return (
      <div className="members-grid">
        {members.map(m => {
          const isFollowing = followingMembers.has(m.name);
          return (
            <div key={m.name} className="member-card">
              <div className="avatar">{m.initial}</div>
              <h3>{m.name}</h3>
              <div className="role">{m.role}</div>
              <div className="member-meta">
                <span>📍 {m.location}</span>
                <span>💬 {m.posts}</span>
              </div>
              <button className={`btn btn-outline btn-sm ${isFollowing ? 'following' : ''}`} onClick={() => toggleFollow(m.name)}>
                {isFollowing ? '✓ Following' : 'Follow'}
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  const renderAboutTab = () => {
    if (!currentCommunity) return null;
    const rules = [
      'Respect other members.',
      'No hate speech or harassment.',
      'No spam.',
      'Keep discussions relevant.',
      'Do not post misleading information.',
      'Respect intellectual property.',
      "Follow Trendorabay's community guidelines."
    ];
    return (
      <div className="about-card">
        <h3>About {currentCommunity.name}</h3>
        <p>{currentCommunity.desc}</p>
        <h4>Community Rules</h4>
        <div className="rules-grid">
          {rules.map((r, i) => (
            <div key={i} className="rule-item">
              <span className="rule-num">{String(i + 1).padStart(2, '0')}</span>
              <p>{r}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="community-page-new" style={{padding: '40px', textAlign: 'center'}}>Loading communities...</div>;
  }

  return (
    <div className="community-page-new">
      <main>
        {/* LIST VIEW */}
        {!currentCommunity && (
          <div>
            {/* Hero Section */}
            <section className="hero">
              <div className="hero-grid">
                <div>
                  <div className="eyebrow">The Trendorabay Community</div>
                  <h1>Find your people. Build your space.</h1>
                  <p>Join communities built around the interests, industries and ideas shaping Africa. Share, connect, discover opportunities, attend events and support people doing meaningful work.</p>
                  <div className="hero-search">
                    <span style={{paddingLeft: '12px'}}>⌕</span>
                    <input
                      placeholder="Search communities..."
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="button">Search</button>
                  </div>
                </div>
                <div className="hero-visual">
                  <div className="hero-card h1">
                    <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=700&q=85" alt="Community members" />
                  </div>
                  <div className="hero-card h2">
                    <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=700&q=85" alt="" />
                  </div>
                  <div className="hero-card h3">
                    <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=700&q=85" alt="" />
                  </div>
                </div>
              </div>
            </section>

            {/* Find a Community Section */}
            <section className="section section-soft" id="all">
              <div className="container">
                <div className="category-bar">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      className={`category-chip${cat === selectedCategory ? ' active' : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="section-head">
                  <h2>Explore All Communities</h2>
                  <p>Find your people across every corner of the continent.</p>
                </div>
                <div className="community-grid">
                  {filteredCommunities.map(c => {
                    const isJoined = joinedCommunities.has(c.dbId);
                    return (
                      <article key={c.dbId} className="community-card">
                        <div className="card-image">
                          <img
                            src={c.cover}
                            alt={c.name}
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                        </div>
                        <div className="card-body">
                          <div className="card-meta">
                            <span className="badge">{c.category}</span>
                          </div>
                          <h3 className="card-title">{c.name}</h3>
                          <p className="card-desc">{c.shortDesc || c.desc}</p>
                          <div className="card-stats">
                            <span>
                              <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3"/><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/></svg>
                              {c.members.toLocaleString()} members
                            </span>
                          </div>
                          <div className="card-actions">
                            <button className="btn btn-outline btn-sm" onClick={() => openCommunity(c.dbId)}>View Community</button>
                            {isJoined ? (
                              <button className="btn btn-outline btn-sm joined" disabled>✓ Joined</button>
                            ) : (
                              <button className="btn btn-dark btn-sm" onClick={() => openJoinPopup(c)}>Join Community</button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
                {filteredCommunities.length === 0 && (
                  <p style={{color: '#777'}}>No communities found. Try another search.</p>
                )}
              </div>
            </section>

            {/* Inside a Community Section */}
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
                  <div className="step">
                    <div className="number">01</div>
                    <h3>Join</h3>
                    <p>Choose communities that interest you, agree to the community rules and become a member.</p>
                  </div>
                  <div className="step">
                    <div className="number">02</div>
                    <h3>Connect</h3>
                    <p>Post, comment, react, follow members and take part in conversations and community activities.</p>
                  </div>
                  <div className="step">
                    <div className="number">03</div>
                    <h3>Discover</h3>
                    <p>Find events, opportunities, creators, businesses, stories and resources related to the community.</p>
                  </div>
                  <div className="step">
                    <div className="number">04</div>
                    <h3>Build & Sell</h3>
                    <p>Creators and businesses can showcase their work and sell products through the Trendorabay marketplace.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* DETAIL VIEW */}
        {currentCommunity && (
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
                  <p>{currentCommunity.desc}</p>
                  <div className="detail-cover-stats">
                    <span>👥 {currentCommunity.members.toLocaleString()} members</span>
                    <span>🟢 214 online</span>
                    <span>💬 {currentDiscussions.length} discussions</span>
                  </div>
                </div>
              </div>

              <div className="detail-bar">
                <div className="detail-tabs">
                  {['Feed', 'Discussions', 'Opportunities', 'Events', 'Members', 'About'].map(tab => (
                    <button
                      key={tab}
                      className={`tab-btn${tab === currentTab ? ' active' : ''}`}
                      onClick={() => { setCurrentTab(tab); setCurrentDiscussionId(null); setSearchParams({ community: currentCommunity.id, tab }); }}
                      style={{ textDecoration: 'none', outline: 'none', border: 'none', boxShadow: 'none', borderBottom: 'none' }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="detail-bar-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => showToast('Share link copied')}>Share</button>
                  <button className={`btn ${isJoined ? 'btn-outline joined' : 'btn-dark'} btn-sm`} onClick={toggleJoin}>
                    {isJoined ? '✓ Joined' : 'Join Community'}
                  </button>
                </div>
              </div>

              <div className="detail-layout">
                <div className="detail-main">
                  {currentTab === 'Feed' && renderFeedTab()}
                  {currentTab === 'Discussions' && renderDiscussionsTab()}
                  {currentTab === 'Opportunities' && renderOpportunitiesTab()}
                  {currentTab === 'Events' && renderEventsTab()}
                  {currentTab === 'Members' && renderMembersTab()}
                  {currentTab === 'About' && renderAboutTab()}
                </div>
                {renderSidebar()}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Join Popup */}
      {showJoinPopup && selectedCommunityForJoin && (
        <div className="join-popup-overlay" onClick={closeJoinPopup}>
          <div className="join-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={closeJoinPopup}>×</button>
            <div className="popup-header">
              <h2>{selectedCommunityForJoin.name}</h2>
              <p className="popup-category">{selectedCommunityForJoin.category}</p>
            </div>
            <div className="popup-body">
              <h3>Community Guidelines</h3>
              <div className="guidelines">
                <p>By joining this community, you agree to the following guidelines:</p>
                <ul>
                  <li>Be respectful to other members and their perspectives</li>
                  <li>Share relevant, honest and useful contributions</li>
                  <li>Do not harass, threaten, impersonate or target other members</li>
                  <li>Do not post spam, scams or misleading promotional content</li>
                  <li>Respect intellectual property, privacy and community rules</li>
                  <li>Content or membership may be moderated when it violates these standards</li>
                </ul>
              </div>
              <button className="popup-join-btn" onClick={handleConfirmJoin}>Become a Member</button>
            </div>
          </div>
        </div>
      )}

      {/* Composer Modal */}
      {showComposerModal && (
        <div className="modal-overlay open" onClick={() => setShowComposerModal(false)}>
          <div className="modal composer-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowComposerModal(false)}>
              <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
            <h3>Create a post</h3>
            <p style={{marginBottom: '16px'}}>Share an idea, question or opportunity with the community.</p>
            <textarea
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
              placeholder="What's on your mind?"
            />

            {pendingImageDataUrl && (
              <div className="image-preview">
                <img src={pendingImageDataUrl} alt="Selected image" />
                <button className="remove-image" type="button" onClick={() => setPendingImageDataUrl(null)}>
                  <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
                </button>
              </div>
            )}

            <input type="file" ref={fileInputRef} accept="image/*" style={{display:'none'}} onChange={handleImageSelect} />

            <div className="composer-modal-row">
              <button className="composer-action" type="button" onClick={() => fileInputRef.current?.click()}>
                <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5-9 9"/></svg>
                Image
              </button>
              <button className="composer-action" type="button" onClick={() => showToast('Poll (prototype)')}>
                <svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>
                Poll
              </button>
            </div>
            <div className="composer-modal-actions">
              <button className="btn btn-ghost" type="button" onClick={() => setShowComposerModal(false)}>Cancel</button>
              <button className="btn btn-dark" type="button" onClick={submitPost}>Post</button>
            </div>
          </div>
        </div>
      )}

      {/* Discussion Modal */}
      {showDiscussionModal && (
        <div className="modal-overlay open" style={{display: 'flex'}} onClick={() => setShowDiscussionModal(false)}>
          <div className="modal composer-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDiscussionModal(false)}>
              <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
            <h3>Start a discussion</h3>
            <p style={{marginBottom: '20px'}}>Ask a question or start a conversation. Keep it focused so people can engage.</p>

            <div className="form-field">
              <label htmlFor="discTitle">Title</label>
              <input
                id="discTitle"
                type="text"
                value={discTitle}
                onChange={(e) => setDiscTitle(e.target.value)}
                placeholder="e.g. What's the best way to hire senior engineers in Africa?"
                maxLength={140}
              />
            </div>

            <div className="form-field">
              <label htmlFor="discTag">Tag</label>
              <select
                id="discTag"
                value={discTag}
                onChange={(e) => setDiscTag(e.target.value)}
              >
                <option value="General">General</option>
                <option value="AI">AI</option>
                <option value="Careers">Careers</option>
                <option value="Open Source">Open Source</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Funding">Funding</option>
                <option value="Operations">Operations</option>
                <option value="Design">Design</option>
                <option value="Markets">Markets</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="discBody">Body</label>
              <textarea
                id="discBody"
                value={discBody}
                onChange={(e) => setDiscBody(e.target.value)}
                placeholder="Share context, what you've tried, and what you want the community's take on…"
              />
            </div>

            <div className="composer-modal-actions">
              <button className="btn btn-ghost" type="button" onClick={() => setShowDiscussionModal(false)}>Cancel</button>
              <button className="btn btn-dark" type="button" onClick={submitDiscussion}>Post Discussion</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className={`toast${toast.show ? ' show' : ''}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
