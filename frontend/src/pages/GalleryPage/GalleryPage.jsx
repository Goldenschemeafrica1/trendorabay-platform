import React, { useState, useEffect } from 'react';
import './GalleryPage.css';
import galleryService from '../../services/galleryService';

// Sample data for development (matches the HTML file)
const samplePhotos = [
  {
    id: 1,
    title: "Nairobi at golden hour",
    desc: "Rooftop view over the city skyline — from Issue 001.",
    category: "Culture",
    photographer: "Brian Kimani",
    image_url: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?auto=format&fit=crop&w=800&q=85"
  },
  {
    id: 2,
    title: "Ankara in motion",
    desc: "Handwoven African print fabric caught mid-movement.",
    category: "Fashion",
    photographer: "Amara Okonkwo",
    image_url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=85"
  },
  {
    id: 3,
    title: "The gallery opening",
    desc: "Contemporary African art showcase in Accra.",
    category: "Art",
    photographer: "Naledi Dlamini",
    image_url: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=800&q=85"
  },
  {
    id: 4,
    title: "Portrait of a maker",
    desc: "Jewelry maker at work in her Nairobi studio.",
    category: "People",
    photographer: "Zainab Ali",
    image_url: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=85"
  },
  {
    id: 5,
    title: "Harvest season",
    desc: "Coffee farmers in the highlands of central Kenya.",
    category: "Nature",
    photographer: "Kwame Mensah",
    image_url: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=85"
  },
  {
    id: 6,
    title: "Street style, Lagos",
    desc: "Saturday afternoon in the city's fashion district.",
    category: "Fashion",
    photographer: "Tunde Adeyemi",
    image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=85"
  },
  {
    id: 7,
    title: "Dinner, served",
    desc: "A chef plating a modern West African tasting menu.",
    category: "Food",
    photographer: "Aisha Kimani",
    image_url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=85"
  },
  {
    id: 8,
    title: "On stage",
    desc: "Afrobeats live set, backstage at the Nairobi Arena.",
    category: "Events",
    photographer: "Brian Kimani",
    image_url: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=800&q=85"
  },
  {
    id: 9,
    title: "Handwork",
    desc: "Detail shot of a handwoven basket from rural Ghana.",
    category: "Art",
    photographer: "Naledi Dlamini",
    image_url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=85"
  },
  {
    id: 10,
    title: "Morning market",
    desc: "Early light at a street market in Kampala.",
    category: "Culture",
    photographer: "Kwame Mensah",
    image_url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=85"
  },
  {
    id: 11,
    title: "Studio days",
    desc: "A creative collective at work in their shared space.",
    category: "People",
    photographer: "Amara Okonkwo",
    image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=85"
  },
  {
    id: 12,
    title: "Field to cup",
    desc: "The full journey of a single Kenyan coffee harvest.",
    category: "Food",
    photographer: "Aisha Kimani",
    image_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=85"
  },
  {
    id: 13,
    title: "Behind the camera",
    desc: "Documentary photographer capturing artisans at work.",
    category: "People",
    photographer: "Zainab Ali",
    image_url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=85"
  },
  {
    id: 14,
    title: "Kente close-up",
    desc: "Traditional kente cloth in handloom detail.",
    category: "Fashion",
    photographer: "Amara Okonkwo",
    image_url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=85"
  },
  {
    id: 15,
    title: "Gallery night",
    desc: "Opening reception for a contemporary African art show.",
    category: "Events",
    photographer: "Brian Kimani",
    image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=85"
  },
  {
    id: 16,
    title: "The creative team",
    desc: "Behind-the-scenes at a Trendorabay photo shoot.",
    category: "People",
    photographer: "Zainab Ali",
    image_url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=85"
  },
  {
    id: 17,
    title: "Landscape, Sahel",
    desc: "Golden hour across the Sahelian plains.",
    category: "Nature",
    photographer: "Kwame Mensah",
    image_url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=85"
  },
  {
    id: 18,
    title: "Work in progress",
    desc: "A young designer sewing her first collection.",
    category: "Fashion",
    photographer: "Amara Okonkwo",
    image_url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=85"
  }
];

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(9);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const PAGE_SIZE = 9;

  const categories = ['All', 'Fashion', 'Art', 'Culture', 'People', 'Food', 'Nature', 'Events'];

  // Fetch gallery images from database
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoading(true);
        const response = await galleryService.getGalleryImages({ limit: 50 });
        if (response.data && response.data.length > 0) {
          setGalleryImages(response.data);
        } else {
          // Use sample data if no data from API
          setGalleryImages(samplePhotos);
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        // Use sample data on error
        setGalleryImages(samplePhotos);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateImage('next');
      if (e.key === 'ArrowLeft') navigateImage('prev');
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  // Body overflow when lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedImage]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2400);
  };

  const setCategory = (cat) => {
    setCurrentCategory(cat);
    setVisibleCount(PAGE_SIZE);
    window.scrollTo({ top: document.querySelector('.filters-wrap')?.offsetTop, behavior: 'smooth' });
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + PAGE_SIZE);
  };

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    if (!selectedImage) return;
    const filteredImages = currentCategory === 'All' 
      ? galleryImages 
      : galleryImages.filter(img => img.category === currentCategory);
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredImages.length;
    } else {
      newIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    }
    
    setSelectedImage(filteredImages[newIndex]);
  };

  const filteredImages = currentCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === currentCategory);
  const visibleImages = filteredImages.slice(0, visibleCount);
  const currentIndex = filteredImages.findIndex(img => img.id === selectedImage?.id);

  return (
    <div className="gallery-page">
      {/* PAGE HEADER */}
      <section className="page-head">
        <div className="container">
          <div className="eyebrow">Trendorabay Gallery</div>
          <h1>Visual stories from <em>across Africa.</em></h1>
          <p>Photography, art and moments from our magazine features, community events and creator collaborations.</p>
          <span className="count">{filteredImages.length} {filteredImages.length === 1 ? 'photo' : 'photos'}</span>
        </div>
      </section>

      {/* CATEGORY FILTERS */}
      <div className="filters-wrap">
        <div className="container">
          <div className="filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter ${currentCategory === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GALLERY GRID */}
      <section className="gallery-section">
        <div className="container">
          {loading ? (
            <div className="gallery-loading">Loading gallery...</div>
          ) : filteredImages.length === 0 ? (
            <div className="empty">
              <strong>No photos in this category yet.</strong>
              <p>Try another category or check back soon.</p>
              <button onClick={() => setCategory('All')}>View all photos</button>
            </div>
          ) : (
            <>
              <div className="gallery-grid">
                {visibleImages.map((image) => (
                  <div
                    key={image.id}
                    className="gallery-item"
                    onClick={() => openLightbox(image)}
                  >
                    <img
                      src={image.image_url}
                      alt={image.title}
                      loading="lazy"
                    />
                    <div className="gallery-expand">⤢</div>
                    <div className="gallery-info">
                      <div className="cat">{image.category || 'Gallery'}</div>
                      <h3>{image.title}</h3>
                      <p>{image.photographer || 'Trendorabay'}</p>
                    </div>
                  </div>
                ))}
              </div>
              {visibleCount < filteredImages.length && (
                <div className="load-more">
                  <button onClick={loadMore}>Load more photos</button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-banner">
            <div>
              <div className="eyebrow" style={{ color: '#aaa' }}>Get featured</div>
              <h2>Have photos that belong here?</h2>
              <p>We feature work from photographers and visual storytellers across Africa. Pitch us your series.</p>
            </div>
            <button
              className="white-btn"
              onClick={() => showToast('Opening pitch form')}
            >
              Submit your work →
            </button>
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {selectedImage && (
        <div className="lightbox open" onClick={closeLightbox}>
          <button className="lb-close" onClick={closeLightbox} aria-label="Close">✕</button>
          <button
            className="lb-nav lb-prev"
            onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            className="lb-nav lb-next"
            onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
            aria-label="Next"
          >
            ›
          </button>
          <span className="lb-counter">{currentIndex + 1} / {filteredImages.length}</span>

          <div className="lb-content">
            <div className="lb-img-wrap">
              <img src={selectedImage.image_url} alt={selectedImage.title} />
            </div>
            <div className="lb-info">
              <div className="cat">{selectedImage.category || 'Gallery'} · {selectedImage.photographer || 'Trendorabay'}</div>
              <h3>{selectedImage.title}</h3>
              <p>{selectedImage.desc || selectedImage.description || ''}</p>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toastVisible && (
        <div className="toast show">{toastMessage}</div>
      )}
    </div>
  );
};

export default GalleryPage;
