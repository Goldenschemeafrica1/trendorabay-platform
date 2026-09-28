import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../store/hooks/useCart';
import merchService from '../../services/merchService';
import './StorePage.css';

const StorePage = () => {
  const navigate = useNavigate();
  const { addToCart, openCartDrawer } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory] = useState('all');
  const [searchQuery] = useState('');
  const [sortBy] = useState('featured');
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from localStorage
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('trendorabay_wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch {
      localStorage.removeItem('trendorabay_wishlist');
    }
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('trendorabay_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Load products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products...');
        const response = await merchService.getProducts();
        console.log('API response:', response);
        
        let products = [];
        
        if (Array.isArray(response)) {
          products = response;
          console.log('Response is an array, using directly');
        } else if (response && Array.isArray(response.data)) {
          products = response.data;
          console.log('Response has data array, using response.data');
        } else {
          console.log('Response format unexpected:', typeof response, response);
        }
        
        console.log('Products count:', products.length);
        
        // Transform data to match frontend expectations
        const transformed = products.map(product => ({
          ...product,
          image: product.image_url || product.image || '/images/product-placeholder.jpg',
          hoverImage: product.hover_image_url || product.hoverImage || product.image_url || product.image || '/images/product-placeholder.jpg',
          originalPrice: product.original_price || product.originalPrice || null,
          inStock: product.in_stock !== undefined ? product.in_stock : (product.stock !== undefined ? product.stock > 0 : (product.inStock !== undefined ? product.inStock : true)),
          badge: product.badge || null,
          badgeColor: product.badge_color || product.badgeColor || null,
          featured: product.featured ? 1 : 0,
          new: product.new_product || product.new || false,
          sale: product.on_sale || product.sale || false,
          rating: product.rating || 4.5,
          reviews: product.reviews || 0
        }));
        
        console.log('Transformed products:', transformed.length);
        setProducts(transformed);
        setFilteredProducts(transformed);
      } catch (error) {
        console.error('Error fetching products:', error);
        console.error('Error details:', error.message, error.stack);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    if (!Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }
    
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
        break;
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Toggle wishlist
  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  // Handle add to cart
  const handleAddToCart = (product, size = null) => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: size || '',
      color: '',
      quantity: 1
    };

    addToCart(cartItem);
    openCartDrawer();

    // Show notification
    showNotification(`${product.name} added to cart!`);
  };

  // Show notification
  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'store-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  };

  // Format price
  const formatPrice = (price) => {
    if (price === undefined || price === null) return 'KSH 0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return 'KSH 0.00';
    return `KSH ${numPrice.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="store-loading">
        <div className="loading-spinner"></div>
        <p>Loading amazing products...</p>
      </div>
    );
  }

  return (
    <div className="store-page">
      {/* Hero Section */}
      <div className="store-hero">
        <div className="store-hero-content">
          <div className="store-hero-text">
            <h1>Trendorabay Hoodie Collection</h1>
            <p>Premium 100% cotton hoodies featuring the Trendorabay logo and African-inspired patterns. Perfect for casual wear and making a statement.</p>
            <button className="shop-now-btn" onClick={() => {
              const hoodie = products.find(p => p.id === 2);
              if (hoodie) handleAddToCart(hoodie);
            }}>
              Shop Now <i className="fas fa-arrow-right"></i>
            </button>
          </div>
          <div className="store-hero-images">
            <div className="hoodie-item">
              <img src="/hoodie.jpeg" alt="Trendorabay Hoodie Urban" />
              <span className="hoodie-label">Urban Edition</span>
            </div>
            <div className="hoodie-item">
              <img src="/hoodie7.jpeg" alt="Trendorabay Hoodie Street" />
              <span className="hoodie-label">Street Style</span>
            </div>
            <div className="hoodie-item">
              <img src="/hoodie5.jpeg" alt="Trendorabay Hoodie Limited" />
              <span className="hoodie-label">Limited Edition</span>
            </div>
          </div>
        </div>
      </div>

      {/* Our Collection Section */}
      <div className="our-collection-section">
        <div className="our-collection-header">
          <h2>Our Collection</h2>
          <p>Explore our full range of products</p>
        </div>
        <div className="our-collection-grid">
          {filteredProducts.slice(0, 8).map(product => (
            <div key={product.id} className="best-selling-card">
              <div className="best-selling-image-section">
                <img src={product.image} alt={product.name} />
                {product.badge ? (
                  <span className="new-arrival-badge" style={{ background: product.badgeColor || 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                    {product.badge}
                  </span>
                ) : (
                  <span className="new-arrival-badge">New Arrival</span>
                )}
              </div>
              <div className="best-selling-content-section">
                <h3>{product.name}</h3>
                <p className="best-selling-price">{formatPrice(product.price)}</p>
                <div className="best-selling-actions">
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`}
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Selling Section */}
      <div className="best-selling-section">
        <div className="best-selling-header">
          <h2>Best Selling</h2>
          <p>Our most popular products loved by customers</p>
        </div>
        <div className="best-selling-grid">
          {filteredProducts.filter(p => p.category === 'apparel').slice(0, 4).map(product => (
            <div key={product.id} className="best-selling-card">
              <div className="best-selling-image-section">
                <img src={product.image} alt={product.name} />
                <span className="new-arrival-badge">New Arrival</span>
              </div>
              <div className="best-selling-content-section">
                <h3>{product.name}</h3>
                <p className="best-selling-price">{formatPrice(product.price)}</p>
                <div className="best-selling-actions">
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`}
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StorePage;