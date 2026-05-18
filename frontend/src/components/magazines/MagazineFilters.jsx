import React from 'react';
import { FaFilter } from 'react-icons/fa';
import './MagazineFilters.css';

const MagazineFilters = ({ filters = {}, onFilterChange }) => {
  const defaultFilters = {
    category: 'all',
    priceRange: { min: 0, max: 100 }
  };
  
  const currentFilters = { ...defaultFilters, ...filters };
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'culture', label: 'Culture' },
    { value: 'business', label: 'Business' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'tech', label: 'Technology' },
    { value: 'sports', label: 'Sports' }
  ];

  const handleCategoryChange = (e) => {
    onFilterChange({
      ...currentFilters,
      category: e.target.value
    });
  };

  const handlePriceChange = (type, value) => {
    onFilterChange({
      ...currentFilters,
      priceRange: {
        ...currentFilters.priceRange,
        [type]: value
      }
    });
  };

  return (
    <div className="magazine-filters">
      <div className="filters-header">
        <FaFilter className="filter-icon" />
        <h3>Filters</h3>
      </div>
      
      <div className="filter-group">
        <label htmlFor="category-filter">Category</label>
        <select
          id="category-filter"
          value={currentFilters.category}
          onChange={handleCategoryChange}
          className="filter-select"
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Price Range</label>
        <div className="price-range">
          <div className="price-input">
            <label htmlFor="min-price">Min</label>
            <input
              id="min-price"
              type="number"
              min="0"
              value={currentFilters.priceRange.min}
              onChange={(e) => handlePriceChange('min', parseFloat(e.target.value) || 0)}
              className="price-input-field"
            />
          </div>
          <div className="price-input">
            <label htmlFor="max-price">Max</label>
            <input
              id="max-price"
              type="number"
              min="0"
              value={currentFilters.priceRange.max}
              onChange={(e) => handlePriceChange('max', parseFloat(e.target.value) || 100)}
              className="price-input-field"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagazineFilters;
