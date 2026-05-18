// components/Advert.jsx
import React from 'react';
import './Advert.css';

const Advert = ({ 
  title = "Special Offer - Tech Collection",
  description = "Discover our curated selection of tech magazines and books.",
  imageUrl = "/assets/african.jpeg",
  badge = "Ad",
  badgeColor = '#01ace0', 
  variant = 'default',
  sponsored = true
}) => {
  return (
    <div className="advert">
      {sponsored && <span className="advert__sponsored-tag">Ad</span>}
    </div>
  );
};

export default Advert;