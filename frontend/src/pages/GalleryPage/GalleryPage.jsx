import React, { useState, useEffect } from 'react';
import './GalleryPage.css';
import galleryService from '../../services/galleryService';

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [likedImages, setLikedImages] = useState(() => {
    // Load liked images from localStorage
    const savedLikes = localStorage.getItem('galleryLikes');
    return savedLikes ? JSON.parse(savedLikes) : [];
  });
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Save liked images to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('galleryLikes', JSON.stringify(likedImages));
  }, [likedImages]);

  // Fetch gallery images from database
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoading(true);
        const response = await galleryService.getGalleryImages({ limit: 50 });
        setGalleryImages(response.data || []);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  const toggleLike = (imageId, e) => {
    e.stopPropagation();
    setLikedImages(prev => {
      if (prev.includes(imageId)) {
        return prev.filter(id => id !== imageId);
      } else {
        return [...prev, imageId];
      }
    });
  };

  const isLiked = (imageId) => likedImages.includes(imageId);

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    if (!selectedImage) return;
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % galleryImages.length;
    } else {
      newIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    }
    
    setSelectedImage(galleryImages[newIndex]);
  };

  return (
    <div className="gallery-page">
      {/* Hero Section */}
      <section className="gallery-hero">
        <div className="container">
          <h1 className="gallery-title">Our Gallery</h1>
          <p className="gallery-subtitle">Explore our collection of memorable moments and visual stories</p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="gallery-content">
        <div className="container">
          <div className="gallery-grid">
            {loading ? (
              <div className="gallery-loading">Loading gallery...</div>
            ) : galleryImages.length === 0 ? (
              <div className="gallery-empty">No images found in gallery</div>
            ) : (
              galleryImages.map((image) => (
                <div 
                  key={image.id} 
                  className="gallery-item"
                  onClick={() => openLightbox(image)}
                >
                  <img 
                    src={image.image_url} 
                    alt={image.title}
                    className="gallery-image"
                    loading="lazy"
                  />
                  <div className="gallery-overlay">
                    <span className="gallery-overlay-text">{image.title}</span>
                  </div>
                  <button 
                    className={`like-button ${isLiked(image.id) ? 'liked' : ''}`}
                    onClick={(e) => toggleLike(image.id, e)}
                    aria-label={isLiked(image.id) ? 'Unlike' : 'Like'}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={isLiked(image.id) ? '#b87c4b' : 'none'} stroke={isLiked(image.id) ? '#b87c4b' : 'white'} strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>&times;</button>
          <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}>
            &#10094;
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.image_url} alt={selectedImage.title} className="lightbox-image" />
            <p className="lightbox-caption">{selectedImage.title}</p>
          </div>
          <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}>
            &#10095;
          </button>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
