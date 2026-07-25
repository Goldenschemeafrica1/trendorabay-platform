import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import SearchBar from '../../components/common/SearchBar';
import searchService from '../../services/searchService';
import './SearchPage.css';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState({
    stories: [],
    magazines: [],
    products: [],
    total: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim() === '') {
      setResults({ stories: [], magazines: [], products: [], total: 0 });
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const searchResults = await searchService.searchAll(searchQuery);
      setResults(searchResults);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to perform search. Please try again.');
      setResults({ stories: [], magazines: [], products: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    // Update URL with search query
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set('q', searchQuery);
    }
    navigate(`/search?${params.toString()}`);
    
    // Perform search
    performSearch(searchQuery);
  };

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-page-header">
          <h1>Search</h1>
          <p>Find products, articles, and more</p>
        </div>
        
        <div className="search-page-content">
          <SearchBar
            placeholder="Search products, articles, and more..."
            initialValue={initialQuery}
            onSearch={handleSearch}
            showFilter={false}
          />
          
          {/* Search Results */}
          <div className="search-results">
            {loading ? (
              <div className="search-loading">
                <p>Searching...</p>
              </div>
            ) : error ? (
              <div className="search-error">
                <p>{error}</p>
              </div>
            ) : query ? (
              <div className="search-results-content">
                <div className="search-results-info">
                  <p>Search results for: <strong>{query}</strong></p>
                  <p className="results-count">{results.total} result{results.total !== 1 ? 's' : ''} found</p>
                </div>

                {results.total === 0 ? (
                  <div className="no-results">
                    <p>No results found for "{query}". Try different keywords.</p>
                  </div>
                ) : (
                  <>
                    {/* Stories Section */}
                    {results.stories.length > 0 && (
                      <div className="results-section">
                        <h3>Stories ({results.stories.length})</h3>
                        <div className="results-grid">
                          {results.stories.map(story => (
                            <Link to={`/stories/${story.slug}`} key={story.id} className="result-card">
                              {story.featured_image_url && (
                                <img src={story.featured_image_url} alt={story.title} className="result-image" />
                              )}
                              <div className="result-content">
                                <h4>{story.title}</h4>
                                <p className="result-meta">
                                  {story.author_name && <span>By {story.author_name}</span>}
                                  {story.category_name && <span> • {story.category_name}</span>}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Magazines Section */}
                    {results.magazines.length > 0 && (
                      <div className="results-section">
                        <h3>Magazines ({results.magazines.length})</h3>
                        <div className="results-grid">
                          {results.magazines.map(magazine => (
                            <Link to={`/magazines/${magazine.slug}`} key={magazine.id} className="result-card">
                              {magazine.cover_image_url && (
                                <img src={magazine.cover_image_url} alt={magazine.title} className="result-image" />
                              )}
                              <div className="result-content">
                                <h4>{magazine.title}</h4>
                                <p className="result-meta">
                                  {magazine.category && <span>{magazine.category}</span>}
                                  {magazine.price && <span> • ${magazine.price}</span>}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Products Section */}
                    {results.products.length > 0 && (
                      <div className="results-section">
                        <h3>Products ({results.products.length})</h3>
                        <div className="results-grid">
                          {results.products.map(product => (
                            <Link to={`/merchandise/${product.id}`} key={product.id} className="result-card">
                              {product.image_url && (
                                <img src={product.image_url} alt={product.name} className="result-image" />
                              )}
                              <div className="result-content">
                                <h4>{product.name}</h4>
                                <p className="result-meta">
                                  {product.category && <span>{product.category}</span>}
                                  {product.price && <span> • ${product.price}</span>}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="search-placeholder">
                <p>Enter a search term to find products, articles, and more.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
