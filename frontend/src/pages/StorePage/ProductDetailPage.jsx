import React, { useState } from 'react';
import ProductDetails from '../../components/merchandise/ProductDetails';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SocialShare from '../../components/common/SocialShare';

const ProductDetailPage = ({ productId }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Mock data - replace with actual API call
  const product = {
    id: productId,
    name: "Ankara Print T-Shirt",
    category: "Clothing",
    price: 29.99,
    image: "/images/merchandise/ankara-tshirt.jpg",
    description: "Vibrant Ankara print t-shirt featuring traditional African patterns. Made from 100% cotton for comfort and durability.",
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Blue', hex: '#0066CC' },
      { name: 'Red', hex: '#CC0000' },
      { name: 'Green', hex: '#009900' },
      { name: 'Yellow', hex: '#FFCC00' }
    ],
    specifications: [
      { label: "Material", value: "100% Cotton" },
      { label: "Care", value: "Machine washable" },
      { label: "Origin", value: "Made in Ghana" },
      { label: "Fit", value: "Regular fit" }
    ]
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Merchandise', href: '/merchandise' },
    { label: product.name }
  ];

  return (
    <div className="product-detail-page">
      <div className="container">
        <Breadcrumbs items={breadcrumbItems} />
        
        <ProductDetails 
          product={product}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          onSizeChange={setSelectedSize}
          onColorChange={setSelectedColor}
        />
        
        <div className="product-actions-footer">
          <SocialShare
            url={window.location.href}
            title={product.name}
            description={product.description}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
