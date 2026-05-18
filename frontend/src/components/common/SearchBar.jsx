import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes, FaFilter } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = ({ 
  placeholder = 'Search products, articles, and more...', 
  onSearch, 
  onFilter,
  showFilter = false,
  initialValue = '',
  suggestions = []
}) => {
  const [query, setQuery] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  useEffect(() => {
    if (query && suggestions.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [query, suggestions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    onSearch?.(suggestion);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
    onSearch?.('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="search-bar">
      <div className="search-bar-container">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="search-input"
              aria-label="Search"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="clear-btn"
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>
          
          <div className="search-actions">
            {showFilter && (
              <button
                type="button"
                onClick={onFilter}
                className="filter-btn"
                aria-label="Toggle filters"
              >
                <FaFilter />
                <span>Filter</span>
              </button>
            )}
            
            <button type="submit" className="search-submit-btn">
              <FaSearch />
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div className="search-suggestions">
            <div className="suggestions-list">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="suggestion-item"
                >
                  <FaSearch className="suggestion-icon" />
                  <span className="suggestion-text">{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
