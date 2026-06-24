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
    category: 'Tech & Innovation',
    subcategory: 'Technology',
    issue: 'Vol. 12 / Q1 2026',
    coverImage: '/assets/Tech.jpeg',
    rating: 5.0,
  },
  {
    id: 2,
    category: 'Fashion & Style',
    subcategory: 'Fashion',
    issue: 'Vol. 8 / Spring 2026',
    coverImage: '/assets/fashion.jpeg',
    rating: 5.0,
  },
  {
    id: 3,
    category: 'Travel & Adventure',
    subcategory: 'Travel',
    issue: 'Vol. 15 / March 2026',
    coverImage: '/assets/travel.jpeg',
    rating: 5.0,
  },
  {
    id: 4,
    category: 'Sports Trends',
    subcategory: 'Sports',
    issue: 'Vol. 6 / April 2026',
    coverImage: '/assets/sports.jpeg',
    rating: 5.0,
  },
  {
    id: 5,
    category: 'Riders',
    subcategory: 'Motorcycle',
    issue: 'Vol. 4 / May 2026',
    coverImage: '/assets/riders.jpeg',
    rating: 5.0,
  },
  {
    id: 6,
    category: 'Lifestyle & Wellness',
    subcategory: 'Health',
    issue: 'Vol. 3 / June 2026',
    coverImage: '/assets/well_dress.jpeg',
    rating: 5.0,
  },
  {
    id: 7,
    category: 'Art & Photography',
    subcategory: 'Art',
    issue: 'Vol. 9 / July 2026',
    coverImage: '/assets/art.jpeg',
    rating: 5.0,
  },
  {
    id: 8,
    category: 'Culture',
    subcategory: 'Cultural',
    issue: 'Vol. 11 / August 2026',
    coverImage: '/assets/african.jpeg',
    rating: 5.0,
  },
  {
    id: 9,
    category: 'Music & Entertainment',
    subcategory: 'Music',
    issue: 'Vol. 1 / September 2026',
    coverImage: '/music.jpeg',
    rating: 5.0,
  },
  {
    id: 10,
    category: 'Business',
    subcategory: 'Business',
    issue: 'Vol. 2 / October 2026',
    coverImage: '/womeninbusiness.jpeg',
    rating: 5.0,
  },
  {
    id: 11,
    category: 'Politics & Policy',
    subcategory: 'Politics',
    issue: 'Vol. 1 / November 2026',
    coverImage: '/youthinpolicy.jpeg',
    rating: 5.0,
  },
  {
    id: 12,
    category: 'Automotive',
    subcategory: 'Cars',
    issue: 'Vol. 1 / December 2026',
    coverImage: '/automotives.jpeg',
    rating: 5.0,
  },
  {
    id: 13,
    category: 'Kids & Family',
    subcategory: 'Kids',
    issue: 'Vol. 1 / January 2027',
    coverImage: '/kids.jpeg',
    rating: 5.0,
  },
  {
    id: 14,
    category: 'Technology',
    subcategory: 'Blockchain',
    issue: 'Vol. 1 / February 2027',
    coverImage: '/blockchain.jpeg',
    rating: 5.0,
  },
  {
    id: 15,
    category: 'Fashion & Business',
    subcategory: 'Fashion',
    issue: 'Vol. 1 / March 2027',
    coverImage: '/fashionandbusiness.jpeg',
    rating: 5.0,
  },
  {
    id: 16,
    category: 'Lifestyle',
    subcategory: 'Social',
    issue: 'Vol. 1 / April 2027',
    coverImage: '/socialtrends.jpeg',
    rating: 5.0,
  },
  {
    id: 17,
    category: 'Lifestyle',
    subcategory: 'Pets',
    issue: 'Vol. 1 / May 2027',
    coverImage: '/pets.jpeg',
    rating: 5.0,
  },
  {
    id: 18,
    category: 'Community',
    subcategory: 'Community',
    issue: 'Vol. 1 / June 2027',
    coverImage: '/community.jpeg',
    rating: 5.0,
  },
  {
    id: 19,
    category: 'Lifestyle',
    subcategory: 'Relationships',
    issue: 'Vol. 1 / July 2027',
    coverImage: '/relationship.jpeg',
    rating: 5.0,
  },
  {
    id: 20,
    category: 'Finance',
    subcategory: 'Investments',
    issue: 'Vol. 1 / August 2027',
    coverImage: '/financeandinvestment.jpeg',
    rating: 5.0,
  },
  {
    id: 21,
    category: 'Food & Beverage',
    subcategory: 'Hospitality',
    issue: 'Vol. 1 / September 2027',
    coverImage: '/barandrestaurant.jpeg',
    rating: 5.0,
  },
  {
    id: 22,
    category: 'Gaming',
    subcategory: 'Gaming',
    issue: 'Vol. 1 / October 2027',
    coverImage: '/gamers.jpeg',
    rating: 5.0,
  },
  {
    id: 23,
    category: 'Culture',
    subcategory: 'Transportation',
    issue: 'Vol. 1 / November 2027',
    coverImage: '/matatuculture.jpeg',
    rating: 5.0,
  },
  {
    id: 24,
    category: 'Sports',
    subcategory: 'Boxing',
    issue: 'Vol. 1 / December 2027',
    coverImage: '/boxing.jpeg',
    rating: 5.0,
  },
  {
    id: 25,
    category: 'Leadership',
    subcategory: 'Business',
    issue: 'Vol. 1 / January 2028',
    coverImage: '/leadingwithpurpose.jpeg',
    rating: 5.0,
  },
  {
    id: 26,
    category: 'Art & Photography',
    subcategory: 'Photography',
    issue: 'Vol. 1 / February 2028',
    coverImage: '/photography.jpeg',
    rating: 5.0,
  },
  {
    id: 27,
    category: 'Culture',
    subcategory: 'Unity',
    issue: 'Vol. 1 / March 2028',
    coverImage: '/theunity.jpeg',
    rating: 5.0,
  },
  {
    id: 28,
    category: 'Automotive',
    subcategory: 'Cars',
    issue: 'Vol. 2 / January 2028',
    coverImage: '/automotives1.jpeg',
    rating: 5.0,
  },
  {
    id: 29,
    category: 'Fashion & Business',
    subcategory: 'Fashion',
    issue: 'Vol. 2 / April 2028',
    coverImage: '/fashinandbusiness..jpeg',
    rating: 5.0,
  },
  {
    id: 30,
    category: 'Fashion & Business',
    subcategory: 'Fashion',
    issue: 'Vol. 3 / May 2028',
    coverImage: '/fashionandbusiness...jpeg',
    rating: 5.0,
  },
  {
    id: 31,
    category: 'Kids & Family',
    subcategory: 'Kids',
    issue: 'Vol. 2 / February 2028',
    coverImage: '/kids2.jpeg',
    rating: 5.0,
  },
  {
    id: 32,
    category: 'Kids & Family',
    subcategory: 'Kids',
    issue: 'Vol. 3 / March 2028',
    coverImage: '/kids3.jpeg',
    rating: 5.0,
  },
  {
    id: 33,
    category: 'Music & Entertainment',
    subcategory: 'Music',
    issue: 'Vol. 2 / October 2026',
    coverImage: '/music1.jpeg',
    rating: 5.0,
  },
  {
    id: 34,
    category: 'Music & Entertainment',
    subcategory: 'Music',
    issue: 'Vol. 3 / November 2026',
    coverImage: '/music2.jpeg',
    rating: 5.0,
  },
  {
    id: 35,
    category: 'Music & Entertainment',
    subcategory: 'Music',
    issue: 'Vol. 4 / December 2026',
    coverImage: '/music3.jpeg',
    rating: 5.0,
  },
  {
    id: 36,
    category: 'Music & Entertainment',
    subcategory: 'Music',
    issue: 'Vol. 5 / January 2027',
    coverImage: '/music4.jpeg',
    rating: 5.0,
  },
  {
    id: 37,
    category: 'Music & Entertainment',
    subcategory: 'Music',
    issue: 'Vol. 6 / February 2027',
    coverImage: '/music5.jpeg',
    rating: 5.0,
  },
  {
    id: 38,
    category: 'Music & Entertainment',
    subcategory: 'Music',
    issue: 'Vol. 7 / March 2027',
    coverImage: '/music6.jpeg',
    rating: 5.0,
  },
  {
    id: 39,
    category: 'Music & Entertainment',
    subcategory: 'Music',
    issue: 'Vol. 8 / April 2027',
    coverImage: '/music7.jpeg',
    rating: 5.0,
  },
  {
    id: 40,
    category: 'Music & Entertainment',
    subcategory: 'Music',
    issue: 'Vol. 9 / May 2027',
    coverImage: '/music8.jpeg',
    rating: 5.0,
  },
  {
    id: 41,
    category: 'Music & Entertainment',
    subcategory: 'Music',
    issue: 'Vol. 10 / June 2027',
    coverImage: '/music9.jpeg',
    rating: 5.0,
  },
  {
    id: 42,
    category: 'Politics & Policy',
    subcategory: 'Politics',
    issue: 'Vol. 2 / December 2026',
    coverImage: '/youthinpolicy1.jpeg',
    rating: 5.0,
  },
  {
    id: 43,
    category: 'Politics & Policy',
    subcategory: 'Politics',
    issue: 'Vol. 3 / January 2027',
    coverImage: '/youthinpolicy3.jpeg',
    rating: 5.0,
  },
];

export { sampleMagazines };

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

  // Use external magazines if provided, otherwise use sample data
  useEffect(() => {
    if (externalMagazines) {
      setMagazines(externalMagazines);
      setLoading(externalLoading);
    } else {
      // Use sample magazines directly without delay
      setMagazines(sampleMagazines);
      setLoading(false);
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