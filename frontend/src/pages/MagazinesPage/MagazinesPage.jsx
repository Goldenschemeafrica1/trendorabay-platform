import React, { useState } from 'react';
import MagazineGrid from '../../components/magazines/MagazineGrid';
import Pagination from '../../components/common/Pagination';
import './MagazinesPage.css';

const MagazinesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
              showFilters={false} // Filters are in sidebar
              showSearch={true}
            />
            
            <div className="pagination-container">
              <Pagination
                currentPage={currentPage}
                totalPages={10}
                onPageChange={handlePageChange}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MagazinesPage;
