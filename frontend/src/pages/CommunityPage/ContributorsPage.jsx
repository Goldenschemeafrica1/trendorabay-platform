import React, { useState, useEffect } from 'react';
import './ContributorsPage.css';

const ContributorsPage = () => {
  const [contributors, setContributors] = useState([]);
  const [selectedRole, setSelectedRole] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContributor, setSelectedContributor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredContributors, setFilteredContributors] = useState([]);
  const [following, setFollowing] = useState(new Set());

  // Contributor roles for filtering
  const roles = [
    { id: 'all', name: 'All Contributors' },
    { id: 'writer', name: 'Writers' },
    { id: 'editor', name: 'Editors' },
    { id: 'photographer', name: 'Photographers' },
    { id: 'illustrator', name: 'Illustrators' },
    { id: 'podcaster', name: 'Podcasters' }
  ];

  // Contributors data
  const contributorsData = [
    {
      id: 1,
      name: "Makena Njeri",
      role: "Senior Editor & Writer",
      roleType: "editor",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=300&fit=crop",
      bio: "Makena is an award-winning journalist and storyteller with over a decade of experience covering African innovation, technology, and culture. Her work has appeared in The Guardian, BBC, and Al Jazeera. She believes in the power of narrative to shape Africa's future.",
      expertise: ["Startups", "Innovation", "Tech Policy", "Gender Equality"],
      articles: 47,
      followers: 15420,
      joinedDate: "January 2023",
      email: "makena@trendorabay.com",
      twitter: "@makenanjeri",
      instagram: "@makena.writes",
      linkedin: "makena-njeri",
      featured: true,
      achievements: ["African Storytelling Award 2024", "Tech Journalism Prize 2025"],
      recentArticles: [
        { title: "How Kenyan Youth Are Redefining The Pan-African Startup Economy", date: "Apr 24, 2026" },
        { title: "The Rise of Climate Tech in East Africa", date: "Apr 10, 2026" }
      ]
    },
    {
      id: 2,
      name: "Liam Otieno",
      role: "Tech Correspondent",
      roleType: "writer",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=300&fit=crop",
      bio: "Liam is a technology journalist passionate about artificial intelligence, blockchain, and emerging tech in Africa. He previously worked at TechCrunch and has reported from over 15 African countries.",
      expertise: ["AI", "Blockchain", "Fintech", "Data Science"],
      articles: 38,
      followers: 8920,
      joinedDate: "March 2023",
      email: "liam@trendorabay.com",
      twitter: "@liamtech",
      instagram: "@liam.otieno",
      linkedin: "liam-otieno",
      featured: false,
      achievements: ["Young Tech Writer of the Year 2024"],
      recentArticles: [
        { title: "Why African AI Labs Are Outpacing Global Benchmarks", date: "Apr 20, 2026" },
        { title: "Web3 Revolution in Kenya", date: "Apr 5, 2026" }
      ]
    },
    {
      id: 3,
      name: "Zuri Makena",
      role: "Fashion & Culture Editor",
      roleType: "editor",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=300&fit=crop",
      bio: "Zuri is a fashion historian and cultural critic exploring the intersection of African heritage and contemporary style. She has curated exhibitions at the Nairobi National Museum and writes for Vogue International.",
      expertise: ["Fashion", "Street Culture", "Art History", "Sustainable Design"],
      articles: 52,
      followers: 23400,
      joinedDate: "February 2023",
      email: "zuri@trendorabay.com",
      twitter: "@zuristyle",
      instagram: "@zuri.makena",
      linkedin: "zuri-makena",
      featured: true,
      achievements: ["Fashion Journalist of the Year 2025", "Cultural Ambassador Award"],
      recentArticles: [
        { title: "The Rise of Neo-African Streetwear: From Kenya to NY", date: "Apr 22, 2026" },
        { title: "Nairobi Fashion Week Highlights", date: "Apr 12, 2026" }
      ]
    },
    {
      id: 4,
      name: "James Kariuki",
      role: "Business & Startups Reporter",
      roleType: "writer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=300&fit=crop",
      bio: "James covers the African startup ecosystem, from early-stage funding to exit strategies. He has interviewed over 100 founders across the continent and tracks VC trends closely.",
      expertise: ["Venture Capital", "Startup Growth", "Mergers & Acquisitions", "Market Analysis"],
      articles: 31,
      followers: 6780,
      joinedDate: "April 2023",
      email: "james@trendorabay.com",
      twitter: "@jameskariuki",
      instagram: "@james.k.business",
      linkedin: "james-kariuki",
      featured: false,
      achievements: ["Business Reporting Award 2024"],
      recentArticles: [
        { title: "Kenyan Startups Raise Record $500M in Q1 2026", date: "Apr 18, 2026" },
        { title: "The Future of Remote Work in Africa", date: "Apr 8, 2026" }
      ]
    },
    {
      id: 5,
      name: "Aisha Wanjiku",
      role: "Photographer & Visual Editor",
      roleType: "photographer",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1554048612-b6a482bc67b6?w=800&h=300&fit=crop",
      bio: "Aisha is an award-winning visual storyteller whose photography has been featured in National Geographic, CNN Africa, and the Victoria & Albert Museum. She specializes in documentary and portrait photography.",
      expertise: ["Documentary", "Portrait", "Street Photography", "Visual Storytelling"],
      articles: 0,
      photosPublished: 234,
      followers: 45600,
      joinedDate: "January 2023",
      email: "aisha@trendorabay.com",
      twitter: "@aishavisuals",
      instagram: "@aisha.wanjiku.photo",
      linkedin: "aisha-wanjiku",
      featured: true,
      achievements: ["World Press Photo Nominee 2025", "African Photojournalism Award"],
      recentArticles: [
        { title: "Portraits of Innovation: Kenya's Tech Hubs", date: "Apr 15, 2026" }
      ]
    },
    {
      id: 6,
      name: "Brian Kimathi",
      role: "Podcast Host & Audio Producer",
      roleType: "podcaster",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&h=300&fit=crop",
      bio: "Brian is the voice behind 'The Blueprint' podcast, where he interviews Africa's most influential entrepreneurs and creatives. His background in radio production spans over 8 years.",
      expertise: ["Podcasting", "Audio Production", "Interviewing", "Storytelling"],
      articles: 0,
      podcastEpisodes: 67,
      followers: 12800,
      joinedDate: "February 2023",
      email: "brian@trendorabay.com",
      twitter: "@briankimathi",
      instagram: "@brian.k.podcast",
      linkedin: "brian-kimathi",
      featured: false,
      achievements: ["Best Business Podcast 2025", "Audio Storytelling Award"],
      recentArticles: [
        { title: "The Blueprint Ep. 67: Building Unicorn Startups", date: "Apr 21, 2026" }
      ]
    },
    {
      id: 7,
      name: "Grace Atieno",
      role: "Illustrator & Creative Director",
      roleType: "illustrator",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=300&fit=crop",
      bio: "Grace is an illustrator whose vibrant work celebrates African femininity, culture, and futurism. She has collaborated with brands like Nike, Google, and UNESCO.",
      expertise: ["Digital Illustration", "Character Design", "Brand Identity", "Afrofuturism"],
      articles: 0,
      illustrations: 189,
      followers: 67800,
      joinedDate: "March 2023",
      email: "grace@trendorabay.com",
      twitter: "@graceart",
      instagram: "@grace.atieno.art",
      linkedin: "grace-atieno",
      featured: true,
      achievements: ["Digital Artist of the Year 2025", "Adobe Creative Residency"],
      recentArticles: [
        { title: "Cover Art: Issue #03 - Creative Economy", date: "Apr 10, 2026" }
      ]
    },
    {
      id: 8,
      name: "Victor Mwangi",
      role: "Investigative Journalist",
      roleType: "writer",
      avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&h=300&fit=crop",
      bio: "Victor specializes in investigative reporting on governance, corruption, and social justice. His work has led to policy changes and won multiple awards for impact journalism.",
      expertise: ["Investigative Reporting", "Data Journalism", "Governance", "Human Rights"],
      articles: 28,
      followers: 9450,
      joinedDate: "May 2023",
      email: "victor@trendorabay.com",
      twitter: "@victormwangi",
      instagram: "@victor.investigates",
      linkedin: "victor-mwangi",
      featured: false,
      achievements: ["Investigative Reporter of the Year 2024", "Kibaki Award for Journalism"],
      recentArticles: [
        { title: "The Hidden Cost of Fast Fashion in Kenya", date: "Apr 14, 2026" }
      ]
    },
    {
      id: 9,
      name: "Nadia Musa",
      role: "Music & Entertainment Reporter",
      roleType: "writer",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=300&fit=crop",
      bio: "Nadia covers the vibrant African music scene, from Afrobeats to Amapiano to Kenyan gengetone. She has interviewed artists like Burna Boy, Sauti Sol, and Diamond Platnumz.",
      expertise: ["Music Journalism", "Concert Reviews", "Artist Interviews", "Music Trends"],
      articles: 34,
      followers: 11200,
      joinedDate: "June 2023",
      email: "nadia@trendorabay.com",
      twitter: "@nadiamusa",
      instagram: "@nadia.music",
      linkedin: "nadia-musa",
      featured: false,
      achievements: ["Music Journalist of the Year 2025"],
      recentArticles: [
        { title: "Amapiano's Evolution & Kenyan Sound Architects", date: "Apr 19, 2026" }
      ]
    },
    {
      id: 10,
      name: "Edwin Omondi",
      role: "Data & Insights Analyst",
      roleType: "editor",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=300&fit=crop",
      bio: "Edwin brings data-driven insights to Trendorabay's coverage, analyzing market trends, consumer behavior, and economic indicators across Africa.",
      expertise: ["Data Analytics", "Market Research", "Economic Trends", "Consumer Insights"],
      articles: 22,
      followers: 3450,
      joinedDate: "July 2023",
      email: "edwin@trendorabay.com",
      twitter: "@edwindata",
      instagram: "@edwin.analytics",
      linkedin: "edwin-omondi",
      featured: false,
      achievements: ["Data Journalism Award 2025"],
      recentArticles: [
        { title: "Kenya's Creator Economy: $3BN Market Potential", date: "Apr 23, 2026" }
      ]
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setContributors(contributorsData);
      setFilteredContributors(contributorsData);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = contributors;
    
    if (selectedRole !== 'all') {
      filtered = filtered.filter(c => c.roleType === selectedRole);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.role.toLowerCase().includes(query) ||
        c.expertise.some(skill => skill.toLowerCase().includes(query)) ||
        c.bio.toLowerCase().includes(query)
      );
    }
    
    setFilteredContributors(filtered);
  }, [selectedRole, searchQuery, contributors]);

  const openContributorModal = (contributor) => {
    setSelectedContributor(contributor);
    document.body.style.overflow = 'hidden';
  };

  const closeContributorModal = () => {
    setSelectedContributor(null);
    document.body.style.overflow = 'auto';
  };

  const toggleFollow = (contributorId) => {
    setFollowing(prev => {
      const newFollowing = new Set(prev);
      if (newFollowing.has(contributorId)) {
        newFollowing.delete(contributorId);
      } else {
        newFollowing.add(contributorId);
      }
      return newFollowing;
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
    return num.toString();
  };

  return (
    <div className="contributors-page">
      <div className="contributors-container">
        {/* Filters Section */}
        <div className="filters-section">
          <div className="search-bar">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name, role, or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

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
            <button onClick={() => { setSelectedRole('all'); setSearchQuery(''); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="contributors-grid">
            {filteredContributors.map(contributor => (
              <div key={contributor.id} className="contributor-card" onClick={() => openContributorModal(contributor)}>
                <div className="contributor-card-inner">
                  <div className="contributor-avatar-wrapper">
                    <img src={contributor.avatar} alt={contributor.name} className="contributor-avatar" />
                    {contributor.featured && (
                      <span className="featured-badge">⭐ Featured</span>
                    )}
                  </div>
                  <h3 className="contributor-name">{contributor.name}</h3>
                  <p className="contributor-role">{contributor.role}</p>
                  <div className="contributor-expertise">
                    {contributor.expertise.slice(0, 3).map((skill, i) => (
                      <span key={i} className="expertise-tag">{skill}</span>
                    ))}
                  </div>
                  <div className="contributor-stats-mini">
                    <div className="mini-stat">
                      <span className="stat-value">{contributor.articles || contributor.photosPublished || contributor.podcastEpisodes || contributor.illustrations || 0}</span>
                      <span className="stat-label-mini">
                        {contributor.articles ? 'Articles' : 
                         contributor.photosPublished ? 'Photos' :
                         contributor.podcastEpisodes ? 'Episodes' : 'Works'}
                      </span>
                    </div>
                    <div className="mini-stat">
                      <span className="stat-value">{formatNumber(contributor.followers)}</span>
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

      {/* Contributor Modal */}
      {selectedContributor && (
        <div className="modal-overlay" onClick={closeContributorModal}>
          <div className="contributor-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeContributorModal}>×</button>
            
            <div className="modal-cover">
              <img src={selectedContributor.coverImage} alt={`${selectedContributor.name} cover`} className="cover-image" />
            </div>
            
            <div className="modal-content">
              <div className="modal-avatar-section">
                <img src={selectedContributor.avatar} alt={selectedContributor.name} className="modal-avatar" />
                <div className="modal-name-section">
                  <h2>{selectedContributor.name}</h2>
                  <p className="modal-role">{selectedContributor.role}</p>
                  <button 
                    className={`modal-follow-btn ${following.has(selectedContributor.id) ? 'following' : ''}`}
                    onClick={() => toggleFollow(selectedContributor.id)}
                  >
                    {following.has(selectedContributor.id) ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>
              
              <div className="modal-bio">
                <h3>Biography</h3>
                <p>{selectedContributor.bio}</p>
              </div>
              
              <div className="modal-expertise">
                <h3>Areas of Expertise</h3>
                <div className="expertise-list">
                  {selectedContributor.expertise.map((skill, i) => (
                    <span key={i} className="expertise-badge">{skill}</span>
                  ))}
                </div>
              </div>
              
              <div className="modal-stats">
                <div className="modal-stat">
                  <span className="modal-stat-value">{selectedContributor.articles || selectedContributor.photosPublished || selectedContributor.podcastEpisodes || selectedContributor.illustrations || 0}</span>
                  <span className="modal-stat-label">
                    {selectedContributor.articles ? 'Articles Written' : 
                     selectedContributor.photosPublished ? 'Photos Published' :
                     selectedContributor.podcastEpisodes ? 'Podcast Episodes' : 'Illustrations Created'}
                  </span>
                </div>
                <div className="modal-stat">
                  <span className="modal-stat-value">{formatNumber(selectedContributor.followers)}</span>
                  <span className="modal-stat-label">Followers</span>
                </div>
                <div className="modal-stat">
                  <span className="modal-stat-value">{selectedContributor.joinedDate}</span>
                  <span className="modal-stat-label">Joined</span>
                </div>
              </div>
              
              {selectedContributor.achievements && (
                <div className="modal-achievements">
                  <h3>Achievements</h3>
                  <ul>
                    {selectedContributor.achievements.map((achievement, i) => (
                      <li key={i}>🏆 {achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedContributor.recentArticles && selectedContributor.recentArticles.length > 0 && (
                <div className="modal-recent">
                  <h3>Recent Work</h3>
                  <div className="recent-list">
                    {selectedContributor.recentArticles.map((article, i) => (
                      <a key={i} href="#" className="recent-item" onClick={(e) => e.preventDefault()}>
                        <span className="recent-title">{article.title}</span>
                        <span className="recent-date">{article.date}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="modal-social">
                <h3>Connect</h3>
                <div className="social-links">
                  {selectedContributor.twitter && (
                    <a href={`https://twitter.com/${selectedContributor.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="social-link twitter">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                      </svg>
                      {selectedContributor.twitter}
                    </a>
                  )}
                  {selectedContributor.instagram && (
                    <a href={`https://instagram.com/${selectedContributor.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="social-link instagram">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <circle cx="12" cy="12" r="4.5"/>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                      </svg>
                      {selectedContributor.instagram}
                    </a>
                  )}
                  {selectedContributor.linkedin && (
                    <a href={`https://linkedin.com/in/${selectedContributor.linkedin}`} target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                        <rect x="2" y="9" width="4" height="12"/>
                        <circle cx="4" cy="4" r="2"/>
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContributorsPage;