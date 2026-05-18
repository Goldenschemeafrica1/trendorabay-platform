import React from 'react';
import LatestMagazine from '../../components/magazines/LatestMagazine';
import FeaturedStories from '../../components/stories/FeaturedStories';

const HomePage = () => {
  return (
    <div className="home-page">
      <LatestMagazine />
      
      <FeaturedStories />
      
    </div>
  );
};

export default HomePage;
