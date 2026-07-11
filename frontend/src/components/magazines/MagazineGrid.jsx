import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from "../../store/slices/cartSlice";
import { toast } from 'react-toastify';
import magazineService from '../../services/magazineService';
import './MagazineGrid.css';

// Categories for filtering
const categories = [
  'All Categories',
  'Tech & Innovation',
  'Fashion & Style',
  'Business',
  'Street Culture & Trends',
  'Real Estate & Property',
  'Lifestyle & Wellness',
  'Music & Entertainment',
  'Art & Photography',
  'Sports & Fitness',
];

const MagazineGrid = ({ 
  initialCategory = 'All Categories',
  showFilters = true,
  showSearch = true,
  limit = 12,
  onMagazineClick,
  magazines: externalMagazines,
  loading: externalLoading = false
}) => {
  const [magazines, setMagazines] = useState([]);
  const [filteredMagazines, setFilteredMagazines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [hoveredId, setHoveredId] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const dispatch = useDispatch();

  // Use external magazines if provided, otherwise fetch from API
  useEffect(() => {
    if (externalMagazines) {
      setMagazines(externalMagazines);
      setLoading(externalLoading);
    } else {
      // Fetch magazines from API
      const fetchMagazines = async () => {
        setLoading(true);
        try {
          const magazines = await magazineService.getMagazines();
          setMagazines(magazines);
        } catch (error) {
          console.error('Error fetching magazines:', error);
          setMagazines([]);
        } finally {
          setLoading(false);
        }
      };
      
      fetchMagazines();
    }
  }, [externalMagazines, externalLoading]);

  // Filter and sort magazines
  useEffect(() => {
    let result = [...magazines];

    // Apply category filter
    if (selectedCategory !== 'All Categories') {
      result = result.filter(mag => {
        const category = mag.category || mag.subcategory || '';
        return category.toLowerCase().includes(selectedCategory.toLowerCase());
      });
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(mag => 
        (mag.title && mag.title.toLowerCase().includes(query)) ||
        (mag.description && mag.description.toLowerCase().includes(query)) ||
        (mag.category && mag.category.toLowerCase().includes(query)) ||
        (mag.subcategory && mag.subcategory.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => {
          const dateA = new Date(a.publishDate || '2026-01-01');
          const dateB = new Date(b.publishDate || '2026-01-01');
          return dateB - dateA;
        });
        break;
      case 'oldest':
        result.sort((a, b) => {
          const dateA = new Date(a.publishDate || '2026-01-01');
          const dateB = new Date(b.publishDate || '2026-01-01');
          return dateA - dateB;
        });
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popular':
        result.sort((a, b) => (b.readers || 0) - (a.readers || 0));
        break;
      default:
        break;
    }

    // Apply limit
    if (limit) {
      result = result.slice(0, limit);
    }

    setFilteredMagazines(result);
  }, [magazines, selectedCategory, searchQuery, sortBy, limit]);

  const handleAddToCart = (magazine) => {
    dispatch(addItem({
      item: {
        id: magazine.id,
        name: magazine.title,
        price: magazine.price,
        type: 'magazine',
        image: magazine.coverImage,
        quantity: 1,
      }
    }));
    toast.success(`${magazine.title} added to cart!`, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleQuickView = (magazine) => {
    toast.info(`Preview: ${magazine.title} - Coming soon!`);
  };

  const clearFilters = () => {
    setSelectedCategory('All Categories');
    setSearchQuery('');
    setSortBy('newest');
  };

  if (loading) {
    return (
      <div className="magazine-grid-loading">
        <div className="loader"></div>
        <p>Loading magazines...</p>
      </div>
    );
  }

  return (
    <section className="magazine-grid-section">
      {/* Filters Bar */}
      {showFilters && (
        <div className="magazine-filters">
          <div className="filters-container">
            {/* Category Filter */}
            <div className="filter-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="filter-group">
              <label htmlFor="sort">Sort By</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {/* Search */}
            {showSearch && (
              <div className="filter-group search-group">
                <label htmlFor="search">Search</label>
                <div className="search-input-wrapper">
                  <i className="fas fa-search search-icon"></i>
                  <input
                    type="text"
                    id="search"
                    placeholder="Search magazines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  {searchQuery && (
                    <button 
                      className="clear-search"
                      onClick={() => setSearchQuery('')}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="results-count">
              <span>{filteredMagazines.length} magazines</span>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory !== 'All Categories' || searchQuery || sortBy !== 'newest') && (
            <div className="active-filters">
              <span className="active-filters-label">Active Filters:</span>
              {selectedCategory !== 'All Categories' && (
                <span className="filter-tag">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('All Categories')}>
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="filter-tag">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}>
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              {sortBy !== 'newest' && (
                <span className="filter-tag">
                  Sort: {sortBy.replace('-', ' ')}
                  <button onClick={() => setSortBy('newest')}>
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              <button className="clear-all" onClick={clearFilters}>
                Clear All
              </button>
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {filteredMagazines.length === 0 && (
        <div className="no-results">
          <i className="fas fa-search"></i>
          <h3>No magazines found</h3>
          <p>Try adjusting your filters or search query</p>
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      )}

      {/* Magazine Grid/List */}
      <div className={`magazines-container ${viewMode}`}>
        {filteredMagazines.map((magazine) => (
          <div
            key={magazine.id}
            className={`magazine-item ${hoveredId === magazine.id ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredId(magazine.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {viewMode === 'grid' ? (
              /* Grid View */
              <div className="magazine-card">
                <Link to={`/magazines/${magazine.id}`}>
                  <img 
                    src={magazine.coverImage} 
                    alt={magazine.title}
                    className="magazine-cover"
                    loading="lazy"
                  />
                </Link>

                <div className="magazine-details">
                  <div className="magazine-category">
                    {magazine.category}
                  </div>
                  <div className="magazine-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i key={star} className="fas fa-star"></i>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* List View */
              <div className="magazine-list-item">
                <div className="list-cover-wrapper">
                  <Link to={`/magazines/${magazine.id}`}>
                    <img 
                      src={magazine.coverImage} 
                      alt={magazine.title}
                      className="list-cover"
                      loading="lazy"
                    />
                  </Link>
                  {magazine.isNew && <span className="list-badge new">New</span>}
                </div>

                <div className="list-details">
                  <div className="list-header">
                    <div>
                      <span className="list-category">{magazine.category}</span>
                      <h3 className="list-title">
                        <Link to={`/magazines/${magazine.id}`}>
                          {magazine.title}
                        </Link>
                      </h3>
                    </div>
                    <div className="list-rating">
                      <i className="fas fa-star"></i>
                      <span>{magazine.rating}</span>
                    </div>
                  </div>

                  <p className="list-description">{magazine.description}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More Button (if needed) */}
      {limit && magazines.length > limit && filteredMagazines.length >= limit && (
        <div className="load-more">
          <button className="load-more-btn">
            Load More Magazines <i className="fas fa-arrow-down"></i>
          </button>
        </div>
      )}
    </section>
  );
};

export default MagazineGrid;