import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import searchService from '../../services/searchService';
import './SearchPage.css';

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    stories: [],
    magazines: [],
    products: [],
    total: 0
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    const performSearch = async () => {
      if (query.trim()) {
        setLoading(true);
        setError(null);
        try {
          const searchResults = await searchService.searchAll(query);
          setResults(searchResults);
        } catch (err) {
          console.error('Search error:', err);
          setError('Failed to search. Please try again.');
          setResults({
            stories: [],
            magazines: [],
            products: [],
            total: 0
          });
        } finally {
          setLoading(false);
        }
      } else {
        setResults({
          stories: [],
          magazines: [],
          products: [],
          total: 0
        });
        setError(null);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setQuery('');
    setResults({
      stories: [],
      magazines: [],
      products: [],
      total: 0
    });
  };

  const handleResultClick = (item, type) => {
    if (type === 'story') {
      navigate(`/stories/${item.slug}`);
    } else if (type === 'magazine') {
      navigate(`/magazines/${item.slug}`);
    } else if (type === 'product') {
      navigate(`/merchandise/${item.id}`);
    }
  };

  const getFilteredResults = () => {
    if (activeTab === 'all') {
      return [...results.stories, ...results.magazines, ...results.products];
    }
    return results[activeTab] || [];
  };

  const getItemType = (item) => {
    if (results.stories.find(s => s.id === item.id)) return 'story';
    if (results.magazines.find(m => m.id === item.id)) return 'magazine';
    return 'product';
  };

  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    // Strip HTML tags first
    const plainText = stripHtml(text);
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <div className="search-header">
          <h1>Search</h1>
          <div className="search-input-wrapper">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search stories, magazines, products..."
              className="search-input"
              autoFocus
            />
            {query && (
              <button
                className="search-clear"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
            <span className="search-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7"/>
                <path d="m20 20-3.5-3.5"/>
              </svg>
            </span>
          </div>
        </div>

        <div className="search-tabs">
          <button
            className={`search-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All ({results.total})
          </button>
          <button
            className={`search-tab ${activeTab === 'stories' ? 'active' : ''}`}
            onClick={() => setActiveTab('stories')}
          >
            Stories ({results.stories.length})
          </button>
          <button
            className={`search-tab ${activeTab === 'magazines' ? 'active' : ''}`}
            onClick={() => setActiveTab('magazines')}
          >
            Magazines ({results.magazines.length})
          </button>
          <button
            className={`search-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products ({results.products.length})
          </button>
        </div>

        <div className="search-results">
          {loading ? (
            <div className="search-loading">
              <div className="search-spinner"></div>
              <p>Searching...</p>
            </div>
          ) : error ? (
            <div className="search-error">
              <p>{error}</p>
            </div>
          ) : query.trim() === '' ? (
            <div className="search-empty">
              <div className="search-empty-icon">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#e8e8e8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7"/>
                  <path d="m20 20-3.5-3.5"/>
                </svg>
              </div>
              <p>Enter a search term to find stories, magazines, and products.</p>
            </div>
          ) : getFilteredResults().length === 0 ? (
            <div className="search-empty">
              <p>No results found for "{query}"</p>
              <p className="search-empty-hint">Try different keywords or check your spelling</p>
            </div>
          ) : (
            <div className="search-results-list">
              {getFilteredResults().map((item) => {
                const type = getItemType(item);
                const imageUrl = item.featured_image_url || item.cover_image || item.image_url;
                const title = item.title || item.name;
                const description = item.description || item.excerpt || item.content;

                return (
                  <div
                    key={`${type}-${item.id}`}
                    className="search-result-item"
                    onClick={() => handleResultClick(item, type)}
                  >
                    {imageUrl && (
                      <div className="search-result-image">
                        <img src={imageUrl} alt={title} />
                      </div>
                    )}
                    <div className="search-result-content">
                      <span className="search-result-type">{type}</span>
                      <h3>{title}</h3>
                      <p>{truncateText(description)}</p>
                    </div>
                    <div className="search-result-arrow">→</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
