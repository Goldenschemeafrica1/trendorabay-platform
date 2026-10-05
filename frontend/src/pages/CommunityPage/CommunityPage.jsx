import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import communityService from '../../services/communityService';
import './CommunityPage.css';

const CommunityPage = () => {
  const { user } = useSelector(state => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [communities, setCommunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [joinedCommunities, setJoinedCommunities] = useState(new Set());

  // Fetch communities on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch communities
        const response = await communityService.getCommunities();
        const communityData = response.data || [];

        // Transform API data to match component structure
        const transformedCommunities = communityData.map(c => ({
          id: c.slug,
          dbId: c.id,
          name: c.name,
          category: c.category,
          desc: c.description,
          shortDesc: c.short_description,
          members: c.member_count,
          cover: c.cover_image_url,
          status: c.status
        }));

        setCommunities(transformedCommunities);

        // If user is logged in, fetch their communities
        if (user?.id) {
          try {
            const userCommunitiesResponse = await communityService.getUserCommunities(user.id);
            const userCommunities = userCommunitiesResponse.data || userCommunitiesResponse || [];
            const memberIds = new Set(userCommunities.map(c => c.id || c.community_id));
            setJoinedCommunities(memberIds);
          } catch (error) {
            console.error('Failed to fetch user communities:', error);
          }
        }
      } catch (error) {
        console.error('Failed to fetch communities:', error);
        toast.error('Failed to load communities');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const filteredCommunities = communities.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (c.name + ' ' + c.category + ' ' + c.desc).toLowerCase().includes(q);
  });

  const handleJoinClick = (community) => {
    setSelectedCommunity(community);
    setShowJoinPopup(true);
  };

  const handleConfirmJoin = async () => {
    if (!user?.id) {
      toast.error('Please log in to join a community');
      setShowJoinPopup(false);
      return;
    }

    try {
      await communityService.joinCommunity(selectedCommunity.dbId, user.id);
      setJoinedCommunities(prev => new Set([...prev, selectedCommunity.dbId]));
      
      // Update member count in local state
      setCommunities(prev => prev.map(c => 
        c.dbId === selectedCommunity.dbId 
          ? { ...c, members: c.members + 1 }
          : c
      ));
      
      setShowJoinPopup(false);
      toast.success(`You've joined the ${selectedCommunity.name} Community! Our community space will be ready soon.`);
    } catch (error) {
      console.error('Failed to join community:', error);
      // If already a member, just mark as joined
      if (error.response?.status === 400 || error.response?.data?.error?.includes('already')) {
        setJoinedCommunities(prev => new Set([...prev, selectedCommunity.dbId]));
        setShowJoinPopup(false);
        toast.info(`You're already a member of ${selectedCommunity.name}`);
      } else {
        toast.error(error.response?.data?.error || 'Failed to join community');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="community-page-new">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <div style={{ color: '#666', fontSize: '1.2rem' }}>Loading communities...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="community-page-new">
      <main>
        {/* Hero Section */}
        <section className="hero">
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
                />
                <button>Search</button>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-card h1">
                <img src="/community-hero-1.jpg" alt="Community members" />
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
        <section className="section" id="all">
          <div className="container">
            <div className="head">
              <div>
                <div className="eyebrow">Explore</div>
                <h2>Find a community</h2>
                <p>Choose the spaces that match your interests and goals.</p>
              </div>
            </div>
            <div className="community-grid">
              {filteredCommunities.map((c) => (
                <article key={c.id} className="community">
                  <div className="cover">
                    <img
                      src={c.cover || '/community.jpeg'}
                      alt={c.name}
                      onError={(e) => { e.currentTarget.src = '/community.jpeg'; }}
                    />
                  </div>
                  <div className="comm-body">
                    <h3>{c.name}</h3>
                    <p>{c.shortDesc || c.desc}</p>
                    <div className="comm-footer">
                      <span className="badge">OPEN COMMUNITY</span>
                      <span className="members">{c.members.toLocaleString()} members</span>
                      {joinedCommunities.has(c.dbId) ? (
                        <button className="enter joined" disabled>
                          Member
                        </button>
                      ) : (
                        <button className="enter" onClick={() => handleJoinClick(c)}>
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
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
      </main>

      {/* Join Popup */}
      {showJoinPopup && selectedCommunity && (
        <div className="join-popup-overlay" onClick={() => setShowJoinPopup(false)}>
          <div className="join-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setShowJoinPopup(false)}>×</button>
            <div className="popup-header">
              <img src={selectedCommunity.cover} alt={selectedCommunity.name} className="popup-cover" />
              <h2>{selectedCommunity.name}</h2>
              <p className="popup-category">{selectedCommunity.category}</p>
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
              <button className="popup-join-btn" onClick={handleConfirmJoin}>
                Become a Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
