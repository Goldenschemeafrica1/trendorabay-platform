import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from '../../store/slices/cartSlice';
import { toast } from 'react-toastify';
import './MagazineDetails.css';

// Sample magazine data - same as LatestMagazine component
const sampleMagazines = [
  {
    id: 1,
    title: 'AfroTech Quarterly',
    category: 'Tech & Innovation',
    subcategory: 'Technology',
    issue: 'Vol. 12 / Q1 2026',
    coverImage: '/assets/Tech.jpeg',
    coverImageLarge: '/assets/Tech.jpeg',
    description: 'AI in Africa · Fintech Revolution · 10 Innovators to Watch',
    fullDescription: `This quarter's issue of AfroTech Quarterly dives deep into the technological revolution sweeping across Africa. From AI startups in Lagos to fintech innovations in Nairobi, we explore how African innovators are shaping the future of technology.

  Stories include:
  • The Rise of AI in African Agriculture
  • Kenya's Mobile Money Revolution: 10 Years Later
  • 30 Under 30: Africa's Top Tech Innovators
  • How Blockchain is Transforming Land Rights
  • Investment Guide: Where VCs Are Putting Their Money`,
    price: 8.99,
    subscriptionPrice: 24.00,
    digitalPrice: 8.99,
    printPrice: 12.99,
    readers: 1240,
    rating: 4.8,
    reviewCount: 89,
    isNew: true,
    isFeatured: true,
    editorPick: true,
    publishDate: '2026-01-15',
    pages: 128,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Amara Okafor',
    contributors: [
      { name: 'Kwame Mensah', role: 'Senior Writer', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
      { name: 'Wanjiku Kimani', role: 'Tech Editor', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
      { name: 'Efia Asante', role: 'Photographer', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
      { name: 'Chidi Okonkwo', role: 'Contributor', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
    ],
    tableOfContents: [
      { title: 'Editor\'s Note', page: 4 },
      { title: 'The AI Revolution in African Agriculture', page: 8 },
      { title: 'Fintech: The Next Frontier', page: 24 },
      { title: '30 Under 30: Tech Innovators', page: 42 },
      { title: 'Blockchain and Land Rights', page: 68 },
      { title: 'Investment Trends in African Tech', page: 84 },
      { title: 'Startup Spotlight: 10 to Watch', page: 102 },
      { title: 'Tech Events Calendar 2026', page: 118 },
    ],
    previewPages: [
      '/assets/Tech.jpeg',
      '/assets/Tech.jpeg',
      '/assets/Tech.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Michael Osei',
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
        rating: 5,
        date: '2026-01-20',
        comment: 'Best tech magazine on the continent. The AI coverage was exceptional!',
      },
      {
        id: 2,
        user: 'Fatima Diallo',
        avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
        rating: 4,
        date: '2026-01-18',
        comment: 'Great insights into African tech. Would love more West African coverage.',
      },
      {
        id: 3,
        user: 'John Mbeki',
        avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
        rating: 5,
        date: '2026-01-15',
        comment: 'The 30 Under 30 list is inspiring. Keep up the great work!',
      },
    ],
    relatedMagazines: [2, 3, 4, 7],
  },
  {
    id: 2,
    title: 'Vogue Africa',
    category: 'Fashion & Style',
    subcategory: 'Fashion',
    issue: 'Vol. 8 / Spring 2026',
    coverImage: '/assets/fashion.jpeg',
    coverImageLarge: '/assets/fashion.jpeg',
    description: 'African Fashion Week · Designer Spotlight · Cultural Heritage',
    fullDescription: `Vogue Africa celebrates the vibrant and diverse world of African fashion. This issue showcases the best of African design, from traditional textiles to contemporary couture.

  Features include:
  • African Fashion Week Highlights
  • Emerging Designers to Watch
  • Traditional Textiles in Modern Fashion
  • Celebrity Style Icons
  • Sustainable Fashion Movement`,
    price: 12.99,
    subscriptionPrice: 36.00,
    digitalPrice: 12.99,
    printPrice: 16.99,
    readers: 2100,
    rating: 4.9,
    reviewCount: 124,
    isNew: true,
    isFeatured: true,
    editorPick: false,
    publishDate: '2026-02-01',
    pages: 96,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Amina Diallo',
    contributors: [
      { name: 'Zara Adeleke', role: 'Fashion Editor', avatar: 'https://randomuser.me/api/portraits/women/8.jpg' },
      { name: 'Kofi Annan Jr', role: 'Photographer', avatar: 'https://randomuser.me/api/portraits/men/9.jpg' },
    ],
    tableOfContents: [
      { title: 'Editor\'s Letter', page: 4 },
      { title: 'Fashion Week Roundup', page: 12 },
      { title: 'Designer Spotlight', page: 28 },
      { title: 'Textile Traditions', page: 44 },
      { title: 'Style Icons', page: 60 },
      { title: 'Sustainable Fashion', page: 76 },
    ],
    previewPages: [
      '/assets/fashion.jpeg',
      '/assets/fashion.jpeg',
      '/assets/fashion.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Nia Roberts',
        avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
        rating: 5,
        date: '2026-02-05',
        comment: 'Absolutely stunning fashion photography! Love the focus on African designers.',
      },
    ],
    relatedMagazines: [1, 6, 7],
  },
  {
    id: 3,
    title: 'African Traveler',
    category: 'Travel & Adventure',
    subcategory: 'Travel',
    issue: 'Vol. 15 / March 2026',
    coverImage: '/assets/travel.jpeg',
    coverImageLarge: '/assets/travel.jpeg',
    description: 'Safari Adventures · Hidden Gems · Cultural Journeys',
    fullDescription: `African Traveler takes you on an unforgettable journey across the continent. From pristine beaches to majestic mountains, discover Africa's hidden treasures.

  This issue features:
  • Ultimate Safari Guide
  • Hidden Beach Paradises
  • Mountain Climbing Adventures
  • Cultural Festival Calendar
  • Budget Travel Tips`,
    price: 9.99,
    subscriptionPrice: 30.00,
    digitalPrice: 9.99,
    printPrice: 13.99,
    readers: 1850,
    rating: 4.7,
    reviewCount: 98,
    isNew: false,
    isFeatured: false,
    editorPick: true,
    publishDate: '2026-03-01',
    pages: 112,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'James Mwangi',
    contributors: [
      { name: 'Sarah Kamau', role: 'Travel Writer', avatar: 'https://randomuser.me/api/portraits/women/11.jpg' },
    ],
    tableOfContents: [
      { title: 'Travel Editor\'s Note', page: 4 },
      { title: 'Safari Adventures', page: 8 },
      { title: 'Coastal Paradise', page: 32 },
      { title: 'Mountain Expeditions', page: 56 },
      { title: 'Cultural Journeys', page: 80 },
    ],
    previewPages: [
      '/assets/travel.jpeg',
      '/assets/travel.jpeg',
      '/assets/travel.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Tom Wilson',
        avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
        rating: 4,
        date: '2026-03-10',
        comment: 'Great travel inspiration! Already planning my next trip.',
      },
    ],
    relatedMagazines: [1, 8],
  },
  {
    id: 4,
    title: 'Sports Africa',
    category: 'Sports Trends',
    subcategory: 'Sports',
    issue: 'Vol. 6 / April 2026',
    coverImage: '/assets/sports.jpeg',
    coverImageLarge: '/assets/sports.jpeg',
    description: 'Football Legends · Athletics · Rising Stars',
    fullDescription: `Sports Africa brings you the latest in African sports. From football legends to rising athletics stars, we cover it all.

  Stories:
  • African Football Legends
  • Track & Field Stars
  • Basketball Revolution
  • Women in Sports
  • Sports Infrastructure Development`,
    price: 7.99,
    subscriptionPrice: 24.00,
    digitalPrice: 7.99,
    printPrice: 11.99,
    readers: 3200,
    rating: 4.6,
    reviewCount: 156,
    isNew: false,
    isFeatured: false,
    editorPick: false,
    publishDate: '2026-04-01',
    pages: 88,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Michael Okoro',
    contributors: [
      { name: 'David Kofi', role: 'Sports Journalist', avatar: 'https://randomuser.me/api/portraits/men/13.jpg' },
    ],
    tableOfContents: [
      { title: 'Sports Editorial', page: 4 },
      { title: 'Football Heroes', page: 8 },
      { title: 'Athletics Excellence', page: 24 },
      { title: 'Basketball Boom', page: 40 },
      { title: 'Women\'s Sports', page: 56 },
    ],
    previewPages: [
      '/assets/sports.jpeg',
      '/assets/sports.jpeg',
      '/assets/sports.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Ahmed Hassan',
        avatar: 'https://randomuser.me/api/portraits/men/14.jpg',
        rating: 5,
        date: '2026-04-08',
        comment: 'Comprehensive sports coverage. Love the focus on African athletes!',
      },
    ],
    relatedMagazines: [1, 5],
  },
  {
    id: 5,
    title: 'Riders Magazine',
    category: 'Riders',
    subcategory: 'Motorcycle',
    issue: 'Vol. 4 / May 2026',
    coverImage: '/assets/riders.jpeg',
    coverImageLarge: '/assets/riders.jpeg',
    description: 'Motorcycle Culture · Custom Builds · Adventure Riding',
    fullDescription: `Riders Magazine celebrates motorcycle culture across Africa. From custom builds to adventure riding, we bring you the best of two-wheeled life.

  This issue:
  • Custom Motorcycle Showcase
  • Adventure Riding Routes
  • Motorcycle Safety Guide
  • Racing Scene Updates
  • Community Events`,
    price: 8.99,
    subscriptionPrice: 27.00,
    digitalPrice: 8.99,
    printPrice: 12.99,
    readers: 1450,
    rating: 4.5,
    reviewCount: 87,
    isNew: false,
    isFeatured: false,
    editorPick: false,
    publishDate: '2026-05-01',
    pages: 104,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Carlos Moyo',
    contributors: [
      { name: 'Sam Rider', role: 'Motorcycle Enthusiast', avatar: 'https://randomuser.me/api/portraits/men/15.jpg' },
    ],
    tableOfContents: [
      { title: 'Rider\'s Welcome', page: 4 },
      { title: 'Custom Builds', page: 8 },
      { title: 'Adventure Routes', page: 32 },
      { title: 'Safety First', page: 56 },
      { title: 'Racing News', page: 80 },
    ],
    previewPages: [
      '/assets/riders.jpeg',
      '/assets/riders.jpeg',
      '/assets/riders.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Jake Moto',
        avatar: 'https://randomuser.me/api/portraits/men/16.jpg',
        rating: 4,
        date: '2026-05-12',
        comment: 'Great motorcycle content! Love the adventure riding section.',
      },
    ],
    relatedMagazines: [4, 3],
  },
  {
    id: 6,
    title: 'Wellness Africa',
    category: 'Lifestyle & Wellness',
    subcategory: 'Health',
    issue: 'Vol. 3 / June 2026',
    coverImage: '/assets/well_dress.jpeg',
    coverImageLarge: '/assets/well_dress.jpeg',
    description: 'Holistic Health · Mindfulness · Traditional Medicine',
    fullDescription: `Wellness Africa explores holistic health and wellbeing across the continent. From traditional healing to modern mindfulness, discover your path to wellness.

  Features:
  • Traditional African Medicine
  • Modern Mindfulness Practices
  • Nutrition and Diet
  • Mental Health Awareness
  • Fitness Trends`,
    price: 10.99,
    subscriptionPrice: 33.00,
    digitalPrice: 10.99,
    printPrice: 14.99,
    readers: 2800,
    rating: 4.8,
    reviewCount: 112,
    isNew: false,
    isFeatured: true,
    editorPick: true,
    publishDate: '2026-06-01',
    pages: 120,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Dr. Amina Health',
    contributors: [
      { name: 'Dr. James Wellness', role: 'Health Expert', avatar: 'https://randomuser.me/api/portraits/men/17.jpg' },
    ],
    tableOfContents: [
      { title: 'Wellness Editorial', page: 4 },
      { title: 'Traditional Healing', page: 8 },
      { title: 'Mindfulness Guide', page: 32 },
      { title: 'Nutrition Tips', page: 56 },
      { title: 'Mental Health', page: 80 },
    ],
    previewPages: [
      '/assets/well_dress.jpeg',
      '/assets/well_dress.jpeg',
      '/assets/well_dress.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Grace Peace',
        avatar: 'https://randomuser.me/api/portraits/women/18.jpg',
        rating: 5,
        date: '2026-06-15',
        comment: 'Excellent wellness content. Very informative and practical!',
      },
    ],
    relatedMagazines: [2, 7],
  },
  {
    id: 7,
    title: 'Art & Vision',
    category: 'Art & Photography',
    subcategory: 'Art',
    issue: 'Vol. 9 / July 2026',
    coverImage: '/assets/art.jpeg',
    coverImageLarge: '/assets/art.jpeg',
    description: 'Contemporary African Art · Photography · Creative Expressions',
    fullDescription: `Art & Vision showcases the best of contemporary African art and photography. Discover emerging artists and established masters.

  This issue:
  • Contemporary African Artists
  • Photography Excellence
  • Sculpture and Installation
  • Art Market Trends
  • Creative Workshops`,
    price: 11.99,
    subscriptionPrice: 36.00,
    digitalPrice: 11.99,
    printPrice: 15.99,
    readers: 1650,
    rating: 4.7,
    reviewCount: 93,
    isNew: false,
    isFeatured: false,
    editorPick: false,
    publishDate: '2026-07-01',
    pages: 132,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Art Director Maya',
    contributors: [
      { name: 'Picasso Africa', role: 'Art Critic', avatar: 'https://randomuser.me/api/portraits/men/18.jpg' },
    ],
    tableOfContents: [
      { title: 'Art Editorial', page: 4 },
      { title: 'Contemporary Artists', page: 8 },
      { title: 'Photography Showcase', page: 40 },
      { title: 'Sculpture Feature', page: 72 },
      { title: 'Art Market', page: 104 },
    ],
    previewPages: [
      '/assets/art.jpeg',
      '/assets/art.jpeg',
      '/assets/art.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Art Lover',
        avatar: 'https://randomuser.me/api/portraits/women/19.jpg',
        rating: 4,
        date: '2026-07-18',
        comment: 'Beautiful art showcase! Love discovering new African artists.',
      },
    ],
    relatedMagazines: [6, 8],
  },
  {
    id: 8,
    title: 'Culture Today',
    category: 'Culture',
    subcategory: 'Cultural',
    issue: 'Vol. 11 / August 2026',
    coverImage: '/assets/african.jpeg',
    coverImageLarge: '/assets/african.jpeg',
    description: 'Tradition Meets Modern · Heritage · Cultural Evolution',
    fullDescription: `Culture Today explores how African traditions evolve in the modern world. From ancient heritage to contemporary expressions, we celebrate cultural diversity.

  Features:
  • Cultural Heritage Preservation
  • Modern Traditional Fusion
  • Festival Highlights
  • Language and Literature
  • Cultural Exchange Programs`,
    price: 9.99,
    subscriptionPrice: 30.00,
    digitalPrice: 9.99,
    printPrice: 13.99,
    readers: 2400,
    rating: 4.9,
    reviewCount: 134,
    isNew: false,
    isFeatured: true,
    editorPick: true,
    publishDate: '2026-08-01',
    pages: 108,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Culture Editor Kwame',
    contributors: [
      { name: 'Heritage Expert', role: 'Cultural Anthropologist', avatar: 'https://randomuser.me/api/portraits/men/20.jpg' },
    ],
    tableOfContents: [
      { title: 'Cultural Editorial', page: 4 },
      { title: 'Heritage Preservation', page: 8 },
      { title: 'Modern Traditions', page: 32 },
      { title: 'Festival Guide', page: 56 },
      { title: 'Language & Literature', page: 80 },
    ],
    previewPages: [
      '/assets/african.jpeg',
      '/assets/african.jpeg',
      '/assets/african.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Culture Fan',
        avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
        rating: 5,
        date: '2026-08-22',
        comment: 'Rich cultural content! Very educational and inspiring.',
      },
    ],
    relatedMagazines: [3, 7],
  },
];

// Sample related magazines
const relatedMagazinesData = {
  2: {
    id: 2,
    title: 'Vogue Africa',
    coverImage: 'https://images.unsplash.com/photo-1532635241-8e0c8456a2bd?w=400&auto=format',
    price: 12.99,
    category: 'Fashion & Style',
  },
  3: {
    id: 3,
    title: 'African Business Review',
    coverImage: 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=400&auto=format',
    price: 9.99,
    category: 'Business & Entrepreneurship',
  },
  4: {
    id: 4,
    title: 'Urban Culture',
    coverImage: 'https://images.unsplash.com/photo-1523805009345-744884ea3946?w=400&auto=format',
    price: 7.99,
    category: 'Street Culture & Trends',
  },
  7: {
    id: 7,
    title: 'Music Africa',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format',
    price: 8.99,
    category: 'Music & Entertainment',
  },
};

const MagazineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [magazine, setMagazine] = useState(null);
  const [relatedMagazines, setRelatedMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPage, setPreviewPage] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState('digital');

  useEffect(() => {
    // Simulate API fetch
    const fetchMagazine = () => {
      setLoading(true);
      setTimeout(() => {
        const foundMagazine = sampleMagazines.find(m => m.id === parseInt(id));
        setMagazine(foundMagazine || null);
        
        if (foundMagazine) {
          // Fetch related magazines (simplified)
          const related = sampleMagazines.filter(m => 
            foundMagazine.relatedMagazines.includes(m.id)
          );
          setRelatedMagazines(related);
        }
        
        setLoading(false);
      }, 500);
    };

    fetchMagazine();
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    const formatPrice = selectedFormat === 'digital' ? magazine.digitalPrice : magazine.printPrice;
    const formatName = selectedFormat === 'digital' ? 'Digital' : 'Print';
    
    dispatch(addItem({
      id: `${magazine.id}-${selectedFormat}`,
      name: `${magazine.title} (${formatName})`,
      price: formatPrice,
      type: 'magazine',
      format: selectedFormat,
      image: magazine.coverImage,
      quantity: quantity,
    }));
    toast.success(`${magazine.title} (${formatName}) added to cart!`, {
      position: "bottom-right",
      autoClose: 3000,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleSubscribe = () => {
    dispatch(addItem({
      id: magazine.id,
      name: `${magazine.title} - Yearly Subscription`,
      price: magazine.subscriptionPrice,
      type: 'subscription',
      image: magazine.coverImage,
      quantity: 1,
    }));
    toast.success(`Subscription to ${magazine.title} added to cart!`);
    navigate('/cart');
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${magazine.title} on Trendorabay!`;
    
    let shareUrl = '';
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPreview = () => {
    toast.info('Preview download started...');
  };

  if (loading) {
    return (
      <div className="magazine-details-loading">
        <div className="loader"></div>
        <p>Loading magazine details...</p>
      </div>
    );
  }

  if (!magazine) {
    return (
      <div className="magazine-not-found">
        <i className="fas fa-exclamation-circle"></i>
        <h2>Magazine Not Found</h2>
        <p>The magazine you're looking for doesn't exist or has been removed.</p>
        <Link to="/magazines" className="back-to-magazines">
          <i className="fas fa-arrow-left"></i> Back to Magazines
        </Link>
      </div>
    );
  }

  return (
    <div className="magazine-details-page">
      
      <div className="container">
        {/* Main Content */}
        <div className="magazine-details-main">
          {/* Left Column - Images */}
          <div className="magazine-gallery">
            <div className="main-image">
              <img 
                src={magazine.coverImageLarge || magazine.coverImage} 
                alt={magazine.title}
              />
              {magazine.isNew && <span className="main-badge new">New Issue</span>}
              {magazine.editorPick && <span className="main-badge editor">Editor's Pick</span>}
              
              {/* Preview Button */}
              <button 
                className="preview-btn"
                onClick={() => setShowPreview(true)}
              >
                <i className="fas fa-eye"></i> Preview Issue
              </button>
            </div>

            {/* Thumbnail Gallery */}
            {magazine.previewPages && magazine.previewPages.length > 0 && (
              <div className="thumbnail-gallery">
                {magazine.previewPages.map((img, index) => (
                  <div 
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`Preview ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="magazine-info">
            {/* Category and Title */}
            <div className="info-header">
              <span className="info-category">{magazine.category}</span>
              <h1 className="info-title">{magazine.title}</h1>
              <div className="info-meta">
                <span><i className="fas fa-calendar"></i> {new Date(magazine.publishDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                <span><i className="fas fa-book-open"></i> {magazine.pages} pages</span>
                <span><i className="fas fa-globe"></i> {magazine.language}</span>
              </div>
            </div>

            {/* Rating and Reviews */}
            <div className="info-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <i 
                    key={i} 
                    className={`fas fa-star ${i < Math.floor(magazine.rating) ? 'filled' : i < magazine.rating ? 'half' : ''}`}
                  ></i>
                ))}
              </div>
              <span className="rating-value">{magazine.rating}</span>
              <span className="review-count">({magazine.reviewCount} reviews)</span>
            </div>

            {/* Issue and ISSN */}
            <div className="info-identifiers">
              <span className="identifier">
                <strong>Issue:</strong> {magazine.issue}
              </span>
              <span className="identifier">
                <strong>Publisher:</strong> {magazine.publisher}
              </span>
            </div>

            {/* Format Selection */}
            <div className="format-selection">
              <h3>Choose Format</h3>
              <div className="format-options">
                <div 
                  className={`format-option ${selectedFormat === 'digital' ? 'active' : ''}`}
                  onClick={() => setSelectedFormat('digital')}
                >
                  <div className="format-info">
                    <h4>Digital</h4>
                    <p>Instant download, access on all devices</p>
                    <div className="format-price">${magazine.digitalPrice}</div>
                  </div>
                </div>
                <div 
                  className={`format-option ${selectedFormat === 'print' ? 'active' : ''}`}
                  onClick={() => setSelectedFormat('print')}
                >
                  <div className="format-info">
                    <h4>Print</h4>
                    <p>Physical copy delivered to your door</p>
                    <div className="format-price">${magazine.printPrice}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <i className="fas fa-minus"></i>
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="info-actions">
              <button className="add-to-cart-btn-large" onClick={handleAddToCart}>
                <i className="fas fa-shopping-cart"></i>
                Add to Cart
              </button>
              <button className="buy-now-btn" onClick={handleBuyNow}>
                <i className="fas fa-bolt"></i>
                Buy Now
              </button>
              <button className="subscribe-btn" onClick={handleSubscribe}>
                <i className="fas fa-calendar-alt"></i>
                Subscribe
              </button>
            </div>

            {/* Share and Save */}
            <div className="info-extras">
              <div className="share-section">
                <span>Share:</span>
                <button onClick={() => handleShare('facebook')}><i className="fab fa-facebook"></i></button>
                <button onClick={() => handleShare('twitter')}><i className="fab fa-twitter"></i></button>
                <button onClick={() => handleShare('linkedin')}><i className="fab fa-linkedin"></i></button>
                <button onClick={() => handleShare('whatsapp')}><i className="fab fa-whatsapp"></i></button>
              </div>
              <button className="print-btn" onClick={handlePrint}>
                <i className="fas fa-print"></i> Print
              </button>
            </div>

            {/* Guarantee Badge */}
            <div className="guarantee-badge">
              <i className="fas fa-shield-alt"></i>
              <div>
                <strong>Secure Download</strong>
                <span>Instant access after purchase</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="magazine-tabs">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab-btn ${activeTab === 'contents' ? 'active' : ''}`}
              onClick={() => setActiveTab('contents')}
            >
              Table of Contents
            </button>
            <button 
              className={`tab-btn ${activeTab === 'contributors' ? 'active' : ''}`}
              onClick={() => setActiveTab('contributors')}
            >
              Contributors
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({magazine.reviewCount})
            </button>
          </div>

          <div className="tab-content">
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="description-tab">
                <div className="full-description">
                  {magazine.fullDescription.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {/* Key Features */}
                <div className="key-features">
                  <h3>Key Features</h3>
                  <ul>
                    <li><i className="fas fa-check"></i> 128 pages of premium content</li>
                    <li><i className="fas fa-check"></i> High-resolution digital PDF</li>
                    <li><i className="fas fa-check"></i> Access on all devices</li>
                    <li><i className="fas fa-check"></i> Downloadable and printable</li>
                    <li><i className="fas fa-check"></i> Includes bonus digital content</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Table of Contents Tab */}
            {activeTab === 'contents' && (
              <div className="contents-tab">
                <h3>Table of Contents</h3>
                <div className="toc-list">
                  {magazine.tableOfContents.map((item, idx) => (
                    <div key={idx} className="toc-item">
                      <span className="toc-title">{item.title}</span>
                      <span className="toc-page">p. {item.page}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contributors Tab */}
            {activeTab === 'contributors' && (
              <div className="contributors-tab">
                <h3>Contributors</h3>
                <div className="contributors-grid">
                  {magazine.contributors.map((contributor, idx) => (
                    <div key={idx} className="contributor-card">
                      <img src={contributor.avatar} alt={contributor.name} />
                      <div className="contributor-info">
                        <h4>{contributor.name}</h4>
                        <p>{contributor.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="reviews-tab">
                <div className="reviews-summary">
                  <div className="average-rating">
                    <span className="big-rating">{magazine.rating}</span>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="fas fa-star filled"></i>
                      ))}
                    </div>
                    <span>Based on {magazine.reviewCount} reviews</span>
                  </div>
                  <button className="write-review-btn">
                    <i className="fas fa-pen"></i> Write a Review
                  </button>
                </div>

                <div className="reviews-list">
                  {magazine.reviews.map(review => (
                    <div key={review.id} className="review-item">
                      <img src={review.avatar} alt={review.user} />
                      <div className="review-content">
                        <div className="review-header">
                          <h4>{review.user}</h4>
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`fas fa-star ${i < review.rating ? 'filled' : ''}`}></i>
                            ))}
                          </div>
                          <span className="review-date">{new Date(review.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Magazines */}
        {relatedMagazines.length > 0 && (
          <div className="related-magazines">
            <h2>You Might Also Like</h2>
            <div className="related-grid">
              {relatedMagazines.map(related => (
                <Link to={`/magazines/${related.id}`} key={related.id} className="related-card">
                  <img src={related.coverImage} alt={related.title} />
                  <div className="related-info">
                    <span className="related-category">{related.category}</span>
                    <h3>{related.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="preview-modal" onClick={() => setShowPreview(false)}>
          <div className="preview-content" onClick={e => e.stopPropagation()}>
            <div className="preview-header">
              <h3>Preview: {magazine.title}</h3>
              <button className="close-preview" onClick={() => setShowPreview(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="preview-body">
              <div className="preview-navigation">
                <button 
                  className="preview-nav-btn"
                  onClick={() => setPreviewPage(Math.max(0, previewPage - 1))}
                  disabled={previewPage === 0}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <div className="preview-page">
                  <img 
                    src={magazine.previewPages[previewPage] || magazine.coverImage} 
                    alt={`Preview page ${previewPage + 1}`}
                  />
                  <span className="page-number">Page {previewPage + 1} of {magazine.previewPages.length}</span>
                </div>
                <button 
                  className="preview-nav-btn"
                  onClick={() => setPreviewPage(Math.min(magazine.previewPages.length - 1, previewPage + 1))}
                  disabled={previewPage === magazine.previewPages.length - 1}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>

            <div className="preview-footer">
              <button className="download-preview" onClick={handleDownloadPreview}>
                <i className="fas fa-download"></i> Download Full Preview
              </button>
              <button className="buy-preview" onClick={handleBuyNow}>
                <i className="fas fa-shopping-cart"></i> Buy Full Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MagazineDetails;