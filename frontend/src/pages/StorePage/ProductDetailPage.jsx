import React, { useState } from 'react';
import ProductDetails from '../../components/merchandise/ProductDetails';

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

  return (
    <div className="product-detail-page">
      <div className="container">
        <ProductDetails 
          product={product}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          onSizeChange={setSelectedSize}
          onColorChange={setSelectedColor}
        />
        
      </div>
    </div>
  );
};

export default ProductDetailPage;
