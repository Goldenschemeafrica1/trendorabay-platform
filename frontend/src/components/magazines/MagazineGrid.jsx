import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from "../../store/slices/cartSlice";
import { toast } from 'react-toastify';
import './MagazineGrid.css';

// Sample magazine data - in real app, this would come from your API
const sampleMagazines = [
  {
    id: 1,
    title: '',
    category: 'Tech & Innovation',
    subcategory: 'Technology',
    issue: '',
    coverImage: '/assets/Tech.jpeg',
    description: '',
    price: 5.99,
    subscriptionPrice: 24.00,
    readers: 1240,
    rating: 4.8,
    isNew: true,
    isFeatured: true,
    editorPick: true,
    publishDate: '2026-01-15',
  },
  {
    id: 2,
    title: '',
    category: 'Fashion & Style',
    subcategory: 'Fashion',
    issue: '',
    coverImage: '/assets/fashion.jpeg',
    description: '',
    price: 2.99,
    subscriptionPrice: 8.00,
    readers: 3200,
    rating: 4.9,
    isNew: true,
    isFeatured: true,
    publishDate: '2026-02-01',
  },
  {
    id: 3,
    title: '',
    category: 'Music & Entertainment',
    subcategory: 'Music',
    issue: '',
    coverImage: '/assets/music.jpeg',
    description: '',
    price: 3.99,
    subscriptionPrice: 12.00,
    readers: 892,
    rating: 4.7,
    isNew: true,
    publishDate: '2026-01-20',
  },
  {
    id: 4,
    title: '',
    category: 'Sports Trends',
    subcategory: 'Sports',
    issue: '',
    coverImage: '/assets/sports.jpeg',
    description: '',
    price: 1.99,
    subscriptionPrice: 7.00,
    readers: 2100,
    rating: 4.6,
    isNew: true,
    publishDate: '2026-02-10',
  },
  {
    id: 5,
    title: '',
    category: 'Riders',
    subcategory: 'Lifestyle',
    issue: '',
    coverImage: '/assets/riders.jpeg',
    description: '',
    price: 2.99,
    subscriptionPrice: 10.00,
    readers: 567,
    rating: 4.5,
    isNew: true,
    publishDate: '2026-02-05',
  },
  {
    id: 6,
    title: '',
    category: 'Lifestyle & Wellness',
    subcategory: 'Lifestyle',
    issue: '',
    coverImage: '/assets/well_dress.jpeg',
    description: '',
    price: 4.99,
    subscriptionPrice: 13.00,
    readers: 1450,
    rating: 4.8,
    isNew: true,
    publishDate: '2026-01-28',
  },
  {
    id: 7,
    title: '',
    category: 'Travel & Adventure',
    subcategory: 'Travel',
    issue: '',
    coverImage: '/assets/travel.jpeg',
    description: '',
    price: 10.99,
    subscriptionPrice: 22.00,
    readers: 1870,
    rating: 4.7,
    isNew: true,
    publishDate: '2026-02-12',
  },
  {
    id: 8,
    title: '',
    category: 'Art & Photography',
    subcategory: 'Art',
    issue: '',
    coverImage: '/assets/art.jpeg',
    description: '',
    price: 11.99,
    subscriptionPrice: 40.00,
    readers: 923,
    rating: 4.9,
    isNew: true,
    publishDate: '2026-01-18',
  },
  {
    id: 9,
    title: '',
    category: 'Culture',
    subcategory: 'Culture',
    issue: '',
    coverImage: '/assets/african.jpeg',
    description: '',
    price: 6.99,
    subscriptionPrice: 25.00,
    readers: 670,
    rating: 4.6,
    isNew: false,
    publishDate: '2025-12-10',
  },
];

// Categories for filtering
const categories = [
  'All Categories',
  'Tech & Innovation',
  'Fashion & Style',
  'Business & Entrepreneurship',
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
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [hoveredId, setHoveredId] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const dispatch = useDispatch();

  // Use external magazines if provided, otherwise use sample data
  useEffect(() => {
    if (externalMagazines) {
      setMagazines(externalMagazines);
      setLoading(externalLoading);
    } else {
      // Fetch sample magazines
      const fetchMagazines = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          setMagazines(sampleMagazines);
          setLoading(false);
        }, 500);
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
        mag.title.toLowerCase().includes(query) ||
        mag.description.toLowerCase().includes(query) ||
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

            {/* View Toggle */}
            <div className="filter-group view-toggle">
              <label>View</label>
              <div className="view-buttons">
                <button
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <i className="fas fa-th"></i>
                </button>
                <button
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>

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
                <img 
                  src={magazine.coverImage} 
                  alt={magazine.title}
                  className="magazine-cover"
                  loading="lazy"
                />

                <div className="magazine-details">
                  <div className="magazine-category">
                    {magazine.category}
                  </div>
                  
                  <h3 className="magazine-title">
                    <Link to={`/magazines/${magazine.id}`}>
                      {magazine.title}
                    </Link>
                  </h3>
                  
                  <p className="magazine-description">{magazine.description}</p>
                  
                  <div className="magazine-pricing">
                    <div className="price">
                      <span className="currency">$</span>
                      <span className="amount">{magazine.price}</span>
                      <span className="period">/issue</span>
                    </div>
                    {magazine.subscriptionPrice && (
                      <div className="subscription-price">
                        ${magazine.subscriptionPrice}/year
                      </div>
                    )}
                  </div>

                  <div className="magazine-actions">
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(magazine)}
                    >
                      <i className="fas fa-shopping-cart"></i>
                    </button>
                    <Link 
                      to={`/magazines/${magazine.id}`}
                      className="details-btn"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              /* List View */
              <div className="magazine-list-item">
                <div className="list-cover-wrapper">
                  <img 
                    src={magazine.coverImage} 
                    alt={magazine.title}
                    className="list-cover"
                    loading="lazy"
                  />
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
                  
                  <div className="list-meta">
                    <span><i className="fas fa-users"></i> {magazine.readers.toLocaleString()} readers</span>
                    <span><i className="fas fa-calendar"></i> {magazine.issue}</span>
                  </div>

                  <div className="list-footer">
                    <div className="list-price">
                      <span className="list-currency">$</span>
                      <span className="list-amount">{magazine.price}</span>
                      <span className="list-period">/issue</span>
                      <span className="list-subscription">or ${magazine.subscriptionPrice}/year</span>
                    </div>
                    
                    <div className="list-actions">
                      <button 
                        className="list-cart-btn"
                        onClick={() => handleAddToCart(magazine)}
                      >
                        <i className="fas fa-shopping-cart"></i>
                        Add to Cart
                      </button>
                      <Link 
                        to={`/magazines/${magazine.id}`}
                        className="list-details-btn"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
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