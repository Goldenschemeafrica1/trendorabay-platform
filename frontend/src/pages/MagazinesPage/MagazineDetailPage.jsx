import React from 'react';
import MagazineDetails from '../../components/magazines/MagazineDetails';

const MagazineDetailPage = ({ magazineId }) => {
  // Mock data - replace with actual API call
  const magazine = {
    id: magazineId,
    title: "African Fashion Today",
    category: "Fashion",
    price: 12.99,
    coverImage: "/images/magazine-covers/fashion-today.jpg",
    description: "Explore the vibrant world of African fashion",
    fullDescription: "A comprehensive look at contemporary African fashion, featuring emerging designers, traditional textiles, and the global influence of African style.",
    content: "This issue delves deep into the heart of African fashion, showcasing how traditional patterns and modern design come together to create something truly unique...",
    specifications: [
      { label: "Pages", value: "120" },
      { label: "Language", value: "English" },
      { label: "Format", value: "Digital & Print" },
      { label: "Publisher", value: "Trendorabay Media" }
    ]
  };


  return (
    <div className="magazine-detail-page">
      <div className="container">
        <MagazineDetails magazine={magazine} />
      </div>
    </div>
  );
};

export default MagazineDetailPage;
