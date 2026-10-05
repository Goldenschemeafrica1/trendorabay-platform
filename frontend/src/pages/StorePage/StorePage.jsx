import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../store/hooks/useCart';
import merchService from '../../services/merchService';
import './StorePage.css';

const StorePage = () => {
  const navigate = useNavigate();
  const { addToCart, openCartDrawer, cartItems } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [saved, setSaved] = useState(new Set());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAllOfficial, setShowAllOfficial] = useState(false);

  // Load wishlist from localStorage
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('trendorabay_wishlist');
      if (savedWishlist) {
        setSaved(new Set(JSON.parse(savedWishlist)));
      }
    } catch {
      localStorage.removeItem('trendorabay_wishlist');
    }
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('trendorabay_wishlist', JSON.stringify(Array.from(saved)));
  }, [saved]);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await merchService.getCategories();
        let categoryList = [];
        
        if (Array.isArray(response)) {
          categoryList = response;
        } else if (response && Array.isArray(response.data)) {
          categoryList = response.data;
        }
        
        setCategories(['All', ...categoryList]);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories(['All']);
      }
    };
    
    fetchCategories();
  }, []);

  // Load products
  useEffect(() => {
    const fetchProducts = async () => {
      const startTime = Date.now();
      try {
        const response = await merchService.getProducts();

        let products = [];

        if (Array.isArray(response)) {
          products = response;
        } else if (response && Array.isArray(response.data)) {
          products = response.data;
        }

        // Transform data to match frontend expectations
        const transformed = products.map(product => ({
          ...product,
          image: product.image_url || product.image || '/images/product-placeholder.jpg',
          category: product.category || 'Fashion',
          seller: product.seller || 'Official Trendorabay',
          community: product.community || 'Official'
        }));

        setProducts(transformed);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        // Ensure minimum loading time of 800ms
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, 800 - elapsed);
        setTimeout(() => setLoading(false), remainingTime);
      }
    };

    fetchProducts();
  }, []);

  // Format price
  const formatPrice = (price) => {
    if (price === undefined || price === null) return 'KSh 0';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return 'KSh 0';
    return `KSh ${numPrice.toLocaleString('en-KE')}`;
  };

  // Toggle wishlist
  const toggleSave = (productName) => {
    const newSaved = new Set(saved);
    if (newSaved.has(productName)) {
      newSaved.delete(productName);
    } else {
      newSaved.add(productName);
      setToastMessage('Added to wishlist');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2200);
    }
    setSaved(newSaved);
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: '',
      color: '',
      quantity: 1
    };

    addToCart(cartItem);
    setToastMessage(`${product.name} added to cart`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  };

  // Handle buy now
  const handleBuyNow = (product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: '',
      color: '',
      quantity: 1
    };

    addToCart(cartItem);
    openCartDrawer();
  };

  // Filter products by category and search
  const filterProducts = (category, query) => {
    const q = query.toLowerCase().trim();
    
    return products.filter(p => {
      const matchesCategory = category === 'All' || p.category === category;
      const matchesSearch = !q || 
        p.name.toLowerCase().includes(q) ||
        (p.seller && p.seller.toLowerCase().includes(q)) ||
        (p.community && p.community.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  };

  // Separate official and community products
  const officialProducts = products.filter(p => p.seller === 'Official Trendorabay' || !p.seller);
  const communityProducts = products.filter(p => p.seller && p.seller !== 'Official Trendorabay');

  const filteredOfficial = filterProducts(currentCategory, searchQuery).filter(p => 
    p.seller === 'Official Trendorabay' || !p.seller
  );
  const filteredCommunity = filterProducts(currentCategory, searchQuery).filter(p => 
    p.seller && p.seller !== 'Official Trendorabay'
  );



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
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">Trendorabay Marketplace</div>
            <h1>The store for the culture.</h1>
            <p>Discover official Trendorabay merchandise and products created by the people, creators and businesses inside our communities.</p>
            <div className="search">
              <span style={{paddingLeft: '13px'}}>⌕</span>
              <input 
                type="text"
                placeholder="Search products, brands, or communities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={() => {}}>Search</button>
            </div>
            <div className="hero-cta">
              <button 
                className="dark-btn"
                onClick={() => document.getElementById('community').scrollIntoView({ behavior: 'smooth' })}
              >
                Shop the community
              </button>
              <button 
                className="light-btn"
                onClick={() => {
                  setToastMessage('Seller onboarding would open here');
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 2200);
                }}
              >
                Start selling
              </button>
            </div>
          </div>
          <div className="hero-art">
            <div className="tile t1">
              <img src="/store-hero-3.jpg" alt="Trendorabay Hoodie" />
            </div>
            <div className="tile t2">
              <img src="/store-hero-2.jpg" alt="Trendorabay Merchandise Bag" />
            </div>
            <div className="tile t3">
              <img src="/store-hero-1.jpg" alt="Trendorabay Smartwatch" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Shop</div>
              <h2>Browse categories</h2>
              <p>Find something from the spaces you love.</p>
            </div>
          </div>
          <div className="chips">
            {categories.map(cat => (
              <button 
                key={cat}
                className={`chip ${currentCategory === cat ? 'active' : ''}`}
                onClick={() => setCurrentCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Official Merchandise Section */}
      <section className="section" style={{paddingTop: '0', marginTop: '-50px'}}>
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Official</div>
              <h2>Trendorabay merchandise</h2>
              <p>Rep the platform. Wear the culture.</p>
            </div>
            {filteredOfficial.length > 5 && (
              <a className="link" href="#" onClick={(e) => { e.preventDefault(); setShowAllOfficial(!showAllOfficial); }}>
                {showAllOfficial ? 'Show less' : 'View all'}
              </a>
            )}
          </div>
          <div className="grid">
            {filteredOfficial.length > 0 ? (
              (showAllOfficial ? filteredOfficial : filteredOfficial.slice(0, 5)).map(product => (
                <article key={product.id} className="product">
                  <div className="product-img">
                    <img src={product.image} alt={product.name} loading="lazy" />
                    <span className="badge">Official</span>
                    <button 
                      className={`heart ${saved.has(product.name) ? 'saved' : ''}`}
                      onClick={() => toggleSave(product.name)}
                    >
                      ♡
                    </button>
                  </div>
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="price">{formatPrice(product.price)}</div>
                    <div className="meta">
                      <span>{product.meta || 'Official Trendorabay'}</span>
                    </div>
                    <div className="product-buttons">
                      <button 
                        className="add"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </button>
                      <button 
                        className="buy-now"
                        onClick={() => handleBuyNow(product)}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p style={{gridColumn: '1 / -1', textAlign: 'center', color: '#777'}}>
                No official merchandise available.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Community Marketplace Section */}
      <section className="section soft-section" id="community">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Community marketplace</div>
              <h2>Shop the community</h2>
              <p>Products created, made and sold by Trendorabay members.</p>
            </div>
            <a className="link" href="#">Explore marketplace</a>
          </div>
          <div className="grid">
            {filteredCommunity.length > 0 ? (
              filteredCommunity.map(product => (
                <article key={product.id} className="product">
                  <div className="product-img">
                    <img src={product.image} alt={product.name} loading="lazy" />
                    <span className="badge">Community Seller</span>
                    <button 
                      className={`heart ${saved.has(product.name) ? 'saved' : ''}`}
                      onClick={() => toggleSave(product.name)}
                    >
                      ♡
                    </button>
                  </div>
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="price">{formatPrice(product.price)}</div>
                    <div className="meta">
                      <span>{product.seller}</span>
                    </div>
                    {product.community && (
                      <div className="meta">
                        <span>Community: {product.community}</span>
                      </div>
                    )}
                    <div className="product-buttons">
                      <button 
                        className="add"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </button>
                      <button 
                        className="buy-now"
                        onClick={() => handleBuyNow(product)}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p style={{gridColumn: '1 / -1', textAlign: 'center', color: '#777'}}>
                No community products available.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Creator Banner */}
      <section className="section">
        <div className="container">
          <div className="creator-banner">
            <div>
              <div className="eyebrow">For creators & businesses</div>
              <h2>Turn your craft into a business.</h2>
              <p>Are you a creator, farmer, designer, artist, business owner or community member? Sell your products to the Trendorabay community.</p>
              <div className="stats">
                <div><b>✓</b>Create your store</div>
                <div><b>✓</b>Reach communities</div>
                <div><b>✓</b>Track orders</div>
              </div>
            </div>
            <button 
              className="white-btn"
              onClick={() => {
                setToastMessage('Seller onboarding would open here');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2200);
              }}
            >
              Start selling →
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section" style={{paddingTop: '10px'}}>
        <div className="container">
          <div className="newsletter">
            <div className="eyebrow">Stay in the trend</div>
            <h2>New products. New creators. New stories.</h2>
            <p>Get community updates, product drops and exclusive Trendorabay offers.</p>
            <form 
              className="newsform"
              onSubmit={(e) => {
                e.preventDefault();
                setToastMessage('Thanks for subscribing!');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2200);
              }}
            >
              <input type="email" required placeholder="Enter your email" />
              <button>Subscribe</button>
            </form>
          </div>
        </div>
      </section>

      {/* Floating Cart Button */}
      <button 
        className="floating-cart"
        onClick={openCartDrawer}
        aria-label="Open cart"
      >
        🛍
        <span className="cart-count">{cartItems.length}</span>
      </button>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast show">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default StorePage;
