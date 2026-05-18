import React, { useState } from 'react';
import MagazineGrid from '../../components/magazines/MagazineGrid';
import Pagination from '../../components/common/Pagination';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import './MagazineCategoryPage.css';

const MagazineCategoryPage = ({ category }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data - replace with actual API call
  const magazines = [
    {
      id: 1,
      title: "African Fashion Today",
      description: "Latest trends in African fashion and design",
      price: 12.99,
      category: "fashion",
      coverImage: "/images/magazine-covers/fashion-today.jpg"
    },
    {
      id: 2,
      title: "Fashion Forward Africa",
      description: "Emerging designers and fashion trends",
      price: 14.99,
      category: "fashion",
      coverImage: "/images/magazine-covers/fashion-forward.jpg"
    }
  ];

  const categoryInfo = {
    tech: {
      title: "Technology & Innovation",
      description: "Explore the latest in African technology, startups, and digital innovation"
    },
    fashion: {
      title: "Fashion Magazines",
      description: "Explore the latest in African fashion, design, and style trends"
    },
    culture: {
      title: "Culture & Heritage",
      description: "Discover the rich cultural traditions and heritage of Africa"
    },
    business: {
      title: "Business & Economy",
      description: "Insights into African business, entrepreneurship, and economic development"
    },
    lifestyle: {
      title: "Lifestyle",
      description: "African lifestyle, wellness, and living magazines"
    }
  };

  const currentCategory = categoryInfo[category] || categoryInfo.fashion;

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Magazines', href: '/magazines' },
    { label: currentCategory.title }
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={`magazine-category-page ${category}`}>
      <div className="container">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="category-header">
          <h1>{currentCategory.title}</h1>
          <p>{currentCategory.description}</p>
        </div>

        <div className="category-content">
          <MagazineGrid magazines={magazines} />
          
          <div className="pagination-container">
            <Pagination
              currentPage={currentPage}
              totalPages={8}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagazineCategoryPage;
