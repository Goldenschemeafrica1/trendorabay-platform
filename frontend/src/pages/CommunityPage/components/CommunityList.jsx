import React from 'react';

const CommunityList = ({ 
  communities, 
  loading, 
  categories, 
  selectedCategory, 
  setSelectedCategory, 
  searchQuery, 
  setSearchQuery, 
  openCommunity, 
  joinedCommunities 
}) => {
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

  if (loading) {
    return (
      <div className="page-hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow skeleton-text"></div>
            <h1 className="skeleton-text"></h1>
            <p className="skeleton-text"></p>
          </div>
          <div className="hero-art">
            <div className="tile ta skeleton-image"></div>
            <div className="tile tb skeleton-image"></div>
            <div className="tile tc skeleton-image"></div>
          </div>
        </div>
      </div>
    );
  }

  const filteredCommunities = getFilteredCommunities();

  return (
    <div className="page-hero">
      <div className="container hero-grid">
        <div>
          <div className="eyebrow">Communities</div>
          <h1>Find your people.</h1>
          <p>Join communities around your interests, connect with creators, and discover opportunities.</p>
          
          <div className="filters">
            <input
              type="text"
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <div className="category-pills">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="hero-art">
          <div className="tile ta"><img src="/music.jpeg" alt="Music" /></div>
          <div className="tile tb"><img src="/blockchain.jpeg" alt="Technology" /></div>
          <div className="tile tc"><img src="/fashionandbusiness.jpeg" alt="Fashion" /></div>
        </div>
      </div>

      <div className="container">
        <div className="community-grid">
          {filteredCommunities.map(community => (
            <div
              key={community.id}
              className="community-card"
              onClick={() => openCommunity(community.dbId)}
            >
              <div className="community-cover">
                <img src={community.cover} alt={community.name} />
                {joinedCommunities.has(community.dbId) && (
                  <span className="joined-badge">✓ Joined</span>
                )}
              </div>
              <div className="community-info">
                <h3>{community.name}</h3>
                <p className="community-category">{community.category}</p>
                <p className="community-desc">{community.shortDesc}</p>
                <p className="community-members">{community.members} members</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityList;
