// components/Advert.jsx
import React, { useState, useEffect } from 'react';
import advertisementService from '../services/advertisementService';
import './Advert.css';

const Advert = ({ 
  title = "Special Offer - Tech Collection",
  description = "Discover our curated selection of tech magazines and books.",
  imageUrl = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=200&fit=crop",
  badge = "Ad",
  badgeColor = '#01ace0', 
  variant = 'default',
  sponsored = true,
  position = 'banner'
}) => {
  const [adData, setAdData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvertisement = async () => {
      try {
        const response = await advertisementService.getAdvertisements({ 
          status: 'active'
        });
        if (response.success && response.data && response.data.length > 0) {
          setAdData(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching advertisement:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisement();
  }, []);

  if (loading) {
    return null;
  }

  const displayTitle = adData?.title || title;
  const displayImageUrl = (adData?.image_url && adData.image_url.trim() !== '') ? adData.image_url : (adData?.mobile_image_url && adData.mobile_image_url.trim() !== '') ? adData.mobile_image_url : imageUrl;
  const displayLinkUrl = adData?.link_url || adData?.destination_url || '#';

  return (
    <a 
      href={displayLinkUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="advert-link"
      style={{ width: '100%', height: '120px', display: 'block', margin: '20px auto' }}
    >
      <img 
        src={displayImageUrl} 
        alt={displayTitle} 
        className="advert__image"
        style={{ width: '100%', height: '120px', objectFit: 'cover', objectPosition: 'center' }}
      />
    </a>
  );
};

export default Advert;