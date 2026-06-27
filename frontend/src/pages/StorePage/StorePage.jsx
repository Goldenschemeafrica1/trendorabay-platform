import React, { useState, useEffect } from 'react';
import { useCart } from '../../store/hooks/useCart';
import './StorePage.css';

const StorePage = () => {
  const { addToCart, openCartDrawer } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
      const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  // Product categories
  const categories = [
    { id: 'all', name: 'All Products', icon: '🛍️', count: 0 },
    { id: 'magazine', name: 'Magazines', icon: '📖', count: 0 },
    { id: 'apparel', name: 'Apparel', icon: '👕', count: 0 },
    { id: 'accessories', name: 'Accessories', icon: '⌚', count: 0 },
    { id: 'art', name: 'Art', icon: '🎨', count: 0 },
    { id: 'digital', name: 'Digital', icon: '💻', count: 0 }
  ];

  
  // Sample product data (in production, this would come from an API)
  const productsData = [
    {
      id: 1,
      name: 'Trendorabay Issue #01 - "The Origin"',
      category: 'magazine',
      price: 24.99,
      originalPrice: 29.99,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=500&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=500&fit=crop',
      description: 'Premier issue featuring interviews with Africa\'s top innovators and trendsetters. 120 pages of premium content.',
      badge: 'Limited Edition',
      badgeColor: '#C4451B',
      inStock: true,
      rating: 4.8,
      reviews: 124,
      featured: true,
      new: false,
      sale: false
    },
    {
      id: 2,
      name: 'Trendorabay Hoodie - Urban Edition',
      category: 'apparel',
      price: 79.99,
      originalPrice: null,
      image: '/hoodie.jpeg',
      hoverImage: '/hoodie1.jpeg',
      description: 'Premium 100% cotton hoodie featuring the Trendorabay logo and African-inspired patterns. Perfect for casual wear.',
      badge: 'Best Seller',
      badgeColor: '#2E8B57',
      inStock: true,
      rating: 4.9,
      reviews: 89,
      featured: true,
      new: false,
      sale: false,
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      id: 3,
      name: 'Trendorabay Cap - Street Collection',
      category: 'accessories',
      price: 34.99,
      originalPrice: 49.99,
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=500&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1556306535-0d09c97c75c3?w=400&h=500&fit=crop',
      description: 'Adjustable structured cap with embroidered logo and unique African textile details. One size fits all.',
      badge: 'Sale',
      badgeColor: '#1DA1F2',
      inStock: true,
      rating: 4.7,
      reviews: 56,
      featured: false,
      new: true,
      sale: true
    },
    {
      id: 4,
      name: 'African Innovators Print Set',
      category: 'art',
      price: 49.99,
      originalPrice: 79.99,
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop',
      description: 'Set of 3 premium art prints celebrating African creativity and innovation. Museum-quality paper.',
      badge: 'Artist Series',
      badgeColor: '#9B59B6',
      inStock: true,
      rating: 5.0,
      reviews: 32,
      featured: true,
      new: false,
      sale: true
    },
    {
      id: 5,
      name: 'Trendorabay T-Shirt - Heritage',
      category: 'apparel',
      price: 44.99,
      originalPrice: 59.99,
      image: '/tshirt1.jpeg',
      hoverImage: 'https://images.unsplash.com/photo-1503342219980-2c4cd1a7e331?w=400&h=500&fit=crop',
      description: '100% organic cotton t-shirt featuring original artwork by Kenyan artists. Ethically made.',
      badge: 'Eco-Friendly',
      badgeColor: '#27AE60',
      inStock: true,
      sizes: ['S', 'M', 'L', 'XL'],
      rating: 4.6,
      reviews: 67,
      featured: false,
      new: true,
      sale: false
    },
    {
      id: 6,
      name: 'Digital Magazine Bundle',
      category: 'digital',
      price: 39.99,
      originalPrice: 59.97,
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=500&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=500&fit=crop',
      description: 'PDF bundle of first 3 issues + exclusive digital content and wallpapers. Instant download.',
      badge: 'Digital Only',
      badgeColor: '#3498DB',
      inStock: true,
      rating: 4.8,
      reviews: 45,
      featured: false,
      new: false,
      sale: true
    },
    {
      id: 7,
      name: 'Trendorabay Tote Bag',
      category: 'accessories',
      price: 29.99,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=400&h=500&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=400&h=500&fit=crop',
      description: 'Durable canvas tote bag perfect for carrying your essentials in style. Machine washable.',
      badge: 'New',
      badgeColor: '#E67E22',
      inStock: true,
      rating: 4.5,
      reviews: 23,
      featured: false,
      new: true,
      sale: false
    },
    {
      id: 8,
      name: 'Issue #02 - "Innovation Nation"',
      category: 'magazine',
      price: 24.99,
      originalPrice: 29.99,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=500&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=500&fit=crop',
      description: 'Deep dive into Africa\'s tech revolution with exclusive interviews with leading founders.',
      badge: 'Best Seller',
      badgeColor: '#2E8B57',
      inStock: true,
      rating: 4.9,
      reviews: 98,
      featured: true,
      new: false,
      sale: false
    },
    {
      id: 9,
      name: 'Poster Set - Street Culture',
      category: 'art',
      price: 39.99,
      originalPrice: 54.99,
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1578301977993-1ad858658c28?w=400&h=500&fit=crop',
      description: 'Limited edition poster collection celebrating Nairobi street art scene. Set of 4 posters.',
      badge: 'Limited',
      badgeColor: '#C4451B',
      inStock: false,
      rating: 4.7,
      reviews: 15,
      featured: false,
      new: false,
      sale: false
    },
    {
      id: 10,
      name: 'Trendorabay Beanie',
      category: 'accessories',
      price: 24.99,
      originalPrice: 34.99,
      image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&h=500&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c7?w=400&h=500&fit=crop',
      description: 'Warm acrylic beanie with woven Trendorabay patch. One size fits most.',
      badge: 'Winter Edit',
      badgeColor: '#3498DB',
      inStock: true,
      rating: 4.6,
      reviews: 34,
      featured: false,
      new: true,
      sale: true
    },
    {
      id: 11,
      name: 'Creator Masterclass Bundle',
      category: 'digital',
      price: 149.99,
      originalPrice: 299.99,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=500&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=500&fit=crop',
      description: '5 video courses from top African creators on content, branding, and monetization.',
      badge: 'Save 50%',
      badgeColor: '#E74C3C',
      inStock: true,
      rating: 4.9,
      reviews: 78,
      featured: true,
      new: false,
      sale: true
    },
    {
      id: 12,
      name: 'Issue #03 - "Creative Economy"',
      category: 'magazine',
      price: 24.99,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=500&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=500&fit=crop',
      description: 'Exploring the rise of Africa\'s creative class and digital artists. Features 50+ creators.',
      badge: 'New Issue',
      badgeColor: '#E67E22',
      inStock: true,
      rating: 5.0,
      reviews: 42,
      featured: false,
      new: true,
      sale: false
    },
    {
      id: 13,
      name: 'Trendorabay Hoodie - Classic Black',
      category: 'apparel',
      price: 84.99,
      originalPrice: null,
      image: '/hoodie3.jpeg',
      hoverImage: '/hoodie4.jpeg',
      description: 'Classic black hoodie with premium cotton blend. Features subtle Trendorabay branding.',
      badge: 'New',
      badgeColor: '#E67E22',
      inStock: true,
      rating: 4.7,
      reviews: 45,
      featured: false,
      new: true,
      sale: false,
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      id: 14,
      name: 'Trendorabay Hoodie - Limited Edition',
      category: 'apparel',
      price: 99.99,
      originalPrice: 129.99,
      image: '/hoodie5.jpeg',
      hoverImage: '/hoodie6.jpeg',
      description: 'Limited edition hoodie with exclusive African art print. Only 100 pieces available.',
      badge: 'Limited',
      badgeColor: '#C4451B',
      inStock: true,
      rating: 4.9,
      reviews: 28,
      featured: true,
      new: false,
      sale: true,
      sizes: ['M', 'L', 'XL']
    },
    {
      id: 15,
      name: 'Trendorabay Hoodie - Street Style',
      category: 'apparel',
      price: 89.99,
      originalPrice: null,
      image: '/hoodie7.jpeg',
      hoverImage: '/hoodie8.jpeg',
      description: 'Street-style inspired hoodie with bold graphics and comfortable fit.',
      badge: 'Trending',
      badgeColor: '#9B59B6',
      inStock: true,
      rating: 4.6,
      reviews: 52,
      featured: false,
      new: false,
      sale: false,
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 16,
      name: 'Trendorabay Hoodie - Premium Collection',
      category: 'apparel',
      price: 109.99,
      originalPrice: null,
      image: '/hoodie9.jpeg',
      hoverImage: '/hoodie.jpeg',
      description: 'Premium collection hoodie with luxury materials and exclusive design.',
      badge: 'Premium',
      badgeColor: '#2E8B57',
      inStock: true,
      rating: 5.0,
      reviews: 18,
      featured: true,
      new: true,
      sale: false,
      sizes: ['M', 'L', 'XL', 'XXL']
    }
  ];

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
    setTimeout(() => {
      setProducts(productsData);
      setFilteredProducts(productsData);
      setLoading(false);
    }, 500);
  }, []);

  // Filter and sort products
  useEffect(() => {
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
    return `$${price.toFixed(2)}`;
  };

  // Render stars for rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <>
        {'★'.repeat(fullStars)}
        {halfStar && '½'}
        {'☆'.repeat(emptyStars)}
      </>
    );
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
              const hoodie = productsData.find(p => p.id === 2);
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

      {/* Best Selling Section */}
      <div className="best-selling-section">
        <div className="best-selling-header">
          <h2>Best Selling</h2>
          <p>Our most popular products loved by customers</p>
        </div>
        <div className="best-selling-grid">
          {productsData.filter(p => p.category === 'apparel').slice(0, 4).map(product => (
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

      {/* Our Collection Section */}
      <div className="our-collection-section">
        <div className="our-collection-header">
          <h2>Our Collection</h2>
          <p>Explore our full range of products</p>
        </div>
        <div className="our-collection-grid">
          {productsData.slice(0, 8).map(product => (
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
    </div>
  );
};

export default StorePage;