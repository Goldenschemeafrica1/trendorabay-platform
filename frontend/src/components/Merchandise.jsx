import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { FaFilter, FaThList, FaThLarge, FaTimes } from 'react-icons/fa';
import { addToCart } from '../../store/slices/cartSlice';
import ProductCard from '../../components/merchandise/ProductCard';
import ProductFilters from '../../components/merchandise/ProductFilters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { merchService } from '../../services/merchService';
import './MerchandisePage.css';

const MerchandisePage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  
  // Filter states
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    size: searchParams.get('size') || 'all',
    color: searchParams.get('color') || 'all',
    priceRange: [0, 200],
    minPrice: 0,
    maxPrice: 200,
    inStock: false,
    onSale: false,
  });

  // Categories
  const categories = [
    { id: 'all', name: 'All Products', icon: '🛍️' },
    { id: 't-shirts', name: 'T-Shirts', icon: '👕' },
    { id: 'hoodies', name: 'Hoodies', icon: '🧥' },
    { id: 'caps', name: 'Caps & Hats', icon: '🧢' },
    { id: 'bags', name: 'Bags', icon: '👜' },
    { id: 'accessories', name: 'Accessories', icon: '📿' },
  ];

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await merchService.getAllProducts();
        setProducts(data);
        
        // Calculate price range from actual products
        const prices = data.map(p => p.price);
        const maxPrice = Math.max(...prices);
        setFilters(prev => ({
          ...prev,
          maxPrice,
          priceRange: [0, maxPrice]
        }));
      } catch (err) {
        setError('Failed to load merchandise. Please try again.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    // Apply category filter
    if (filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    // Apply price range filter
    result = result.filter(p => 
      p.price >= filters.priceRange[0] && 
      p.price <= filters.priceRange[1]
    );

    // Apply size filter
    if (filters.size !== 'all') {
      result = result.filter(p => 
        p.sizes && p.sizes.includes(filters.size)
      );
    }

    // Apply color filter
    if (filters.color !== 'all') {
      result = result.filter(p => 
        p.colors && p.colors.includes(filters.color)
      );
    }

    // Apply stock filter
    if (filters.inStock) {
      result = result.filter(p => p.inStock);
    }

    // Apply sale filter
    if (filters.onSale) {
      result = result.filter(p => p.onSale);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'popular':
        result.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
        break;
      default:
        // 'featured' - keep original order
        break;
    }

    setFilteredProducts(result);
    
    // Update URL params
    const params = new URLSearchParams();
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.size !== 'all') params.set('size', filters.size);
    if (filters.color !== 'all') params.set('color', filters.color);
    setSearchParams(params);
    
  }, [products, filters, sortBy, setSearchParams]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleAddToCart = (product, selectedSize, selectedColor) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.onSale ? product.salePrice : product.price,
      image: product.images[0],
      type: 'merch',
      variant: {
        size: selectedSize,
        color: selectedColor,
      }
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      size: 'all',
      color: 'all',
      priceRange: [0, filters.maxPrice],
      minPrice: 0,
      maxPrice: filters.maxPrice,
      inStock: false,
      onSale: false,
    });
  };

  if (loading) {
    return (
      <div className="merchandise-loading">
        <LoadingSpinner />
        <p>Loading awesome merchandise...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="merchandise-error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="merchandise-page">
      {/* Hero Section */}
      <section className="merchandise-hero">
        <div className="container">
          <h1 className="merchandise-title">
            <span className="african-pattern">✦</span> 
            Official Trendorabay Merch 
            <span className="african-pattern">✦</span>
          </h1>
          <p className="merchandise-subtitle">
            Wear the culture. Represent the movement. Premium quality apparel and accessories 
            inspired by African creativity and style.
          </p>
          
          {/* Category Pills */}
          <div className="category-pills">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-pill ${filters.category === cat.id ? 'active' : ''}`}
                onClick={() => handleFilterChange({ category: cat.id })}
              >
                <span className="category-icon">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="merchandise-content">
        <div className="container">
          {/* Toolbar */}
          <div className="merchandise-toolbar">
            <div className="toolbar-left">
              <button 
                className="filter-toggle-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter /> 
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              
              <span className="product-count">
                {filteredProducts.length} products found
              </span>
            </div>

            <div className="toolbar-right">
              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <FaThLarge />
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <FaThList />
                </button>
              </div>

              <select 
                className="sort-select"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Filters and Products Grid */}
          <div className="merchandise-layout">
            {/* Filters Sidebar */}
            <aside className={`filters-sidebar ${showFilters ? 'active' : ''}`}>
              <div className="filters-header">
                <h3>Filters</h3>
                {(filters.category !== 'all' || 
                  filters.size !== 'all' || 
                  filters.color !== 'all' ||
                  filters.priceRange[0] > 0 ||
                  filters.priceRange[1] < filters.maxPrice ||
                  filters.inStock ||
                  filters.onSale) && (
                  <button className="clear-filters-btn" onClick={clearFilters}>
                    <FaTimes /> Clear all
                  </button>
                )}
              </div>

              <ProductFilters 
                filters={filters}
                onFilterChange={handleFilterChange}
                categories={categories.filter(c => c.id !== 'all')}
              />

              {/* Close filters on mobile */}
              <button 
                className="close-filters-mobile"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </button>
            </aside>

            {/* Products Grid */}
            <div className={`products-container ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    viewMode={viewMode}
                    onAddToCart={handleAddToCart}
                  />
                ))
              ) : (
                <div className="no-products">
                  <img 
                    src="/images/no-products.svg" 
                    alt="No products found"
                    className="no-products-image"
                  />
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or check back later for new items.</p>
                  <button className="clear-filters-btn-large" onClick={clearFilters}>
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="merchandise-features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🌍</div>
              <h3>African Made</h3>
              <p>Proudly designed and produced by African artisans</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✨</div>
              <h3>Premium Quality</h3>
              <p>100% organic cotton and sustainable materials</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🚚</div>
              <h3>Worldwide Shipping</h3>
              <p>Free shipping on orders over $50</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔄</div>
              <h3>Easy Returns</h3>
              <p>30-day return policy, no questions asked</p>
            </div>
          </div>
        </div>
      </section>

      {/* Kente Pattern Divider */}
      <div className="kente-divider"></div>

      {/* Newsletter Section */}
      <section className="merchandise-newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2>Get 10% off your first order</h2>
            <p>Subscribe to receive updates on new drops, exclusive offers, and African stories.</p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MerchandisePage;