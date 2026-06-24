import React from 'react';
import MagazineGrid from '../../components/magazines/MagazineGrid';
import './MagazinesPage.css';

const MagazinesPage = () => {
  return (
    <div className="magazines-page">
      <div className="container">
        <div className="page-header">
          <p>Discover our collection of African-focused magazines covering culture, fashion, business, and lifestyle</p>
        </div>

        <div className="magazines-content">
          <main className="magazines-main">
            <MagazineGrid
              limit={null} // Show all magazines
              showFilters={true}
              showSearch={true}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MagazinesPage;
