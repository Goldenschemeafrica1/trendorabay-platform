import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem as addToCart } from "../../store/slices/cartSlice";
import { toast } from 'react-toastify';
import './LatestMagazine.css';

// Sample magazine data - in real app, this would come from your API
const sampleMagazines = [
  {
    id: 1,
    title: 'AfroTech Quarterly',
    category: 'Tech & Innovation',
    coverImage: '/assets/Tech.jpeg',
    rating: 4.8,
    price: 8.99,
    digitalPrice: 8.99,
    printPrice: 12.99,
    description: 'AI in Africa · Fintech Revolution · 10 Innovators to Watch',
    issue: 'Vol. 12 / Q1 2026',
    pages: 128,
    publisher: 'Trendorabay Media',
    publishDate: '2026-01-15',
  },
  {
    id: 2,
    title: 'Vogue Africa',
    category: 'Fashion & Style',
    coverImage: '/assets/fashion.jpeg',
    rating: 4.9,
    price: 12.99,
    digitalPrice: 12.99,
    printPrice: 16.99,
    description: 'African Fashion Week · Designer Spotlight · Cultural Heritage',
    issue: 'Vol. 8 / Spring 2026',
    pages: 96,
    publisher: 'Trendorabay Media',
    publishDate: '2026-02-01',
  },
  {
    id: 3,
    title: 'African Traveler',
    category: 'Travel & Adventure',
    coverImage: '/assets/travel.jpeg',
    rating: 4.7,
    price: 9.99,
    digitalPrice: 9.99,
    printPrice: 13.99,
    description: 'Safari Adventures · Hidden Gems · Cultural Journeys',
    issue: 'Vol. 15 / March 2026',
    pages: 112,
    publisher: 'Trendorabay Media',
    publishDate: '2026-03-01',
  },
  {
    id: 4,
    title: 'Sports Africa',
    category: 'Sports Trends',
    coverImage: '/assets/sports.jpeg',
    rating: 4.6,
    price: 7.99,
    digitalPrice: 7.99,
    printPrice: 11.99,
    description: 'Football Legends · Athletics · Rising Stars',
    issue: 'Vol. 6 / April 2026',
    pages: 88,
    publisher: 'Trendorabay Media',
    publishDate: '2026-04-01',
  },
  {
    id: 5,
    title: 'Riders Magazine',
    category: 'Riders',
    coverImage: '/assets/riders.jpeg',
    rating: 4.5,
    price: 8.99,
    digitalPrice: 8.99,
    printPrice: 12.99,
    description: 'Motorcycle Culture · Custom Builds · Adventure Riding',
    issue: 'Vol. 4 / May 2026',
    pages: 104,
    publisher: 'Trendorabay Media',
    publishDate: '2026-05-01',
  },
  {
    id: 6,
    title: 'Wellness Africa',
    category: 'Lifestyle & Wellness',
    coverImage: '/assets/well_dress.jpeg',
    rating: 4.8,
    price: 10.99,
    digitalPrice: 10.99,
    printPrice: 14.99,
    description: 'Holistic Health · Mindfulness · Traditional Medicine',
    issue: 'Vol. 3 / June 2026',
    pages: 120,
    publisher: 'Trendorabay Media',
    publishDate: '2026-06-01',
  },
  {
    id: 7,
    title: 'Art & Vision',
    category: 'Art & Photography',
    coverImage: '/assets/art.jpeg',
    rating: 4.7,
    price: 11.99,
    digitalPrice: 11.99,
    printPrice: 15.99,
    description: 'Contemporary African Art · Photography · Creative Expressions',
    issue: 'Vol. 9 / July 2026',
    pages: 132,
    publisher: 'Trendorabay Media',
    publishDate: '2026-07-01',
  },
  {
    id: 8,
    title: 'Culture Today',
    category: 'Culture',
    coverImage: '/assets/african.jpeg',
    rating: 4.9,
    price: 9.99,
    digitalPrice: 9.99,
    printPrice: 13.99,
    description: 'Tradition Meets Modern · Heritage · Cultural Evolution',
    issue: 'Vol. 11 / August 2026',
    pages: 108,
    publisher: 'Trendorabay Media',
    publishDate: '2026-08-01',
  },
  {
    id: 9,
    title: 'Finance Today',
    category: 'Business & Finance',
    coverImage: '/assets/finance.jpeg',
    rating: 4.7,
    price: 11.99,
    digitalPrice: 11.99,
    printPrice: 15.99,
    description: 'Investment · Markets · Economic Trends',
    issue: 'Vol. 3 / September 2026',
    pages: 96,
    publisher: 'Trendorabay Media',
    publishDate: '2026-09-01',
  },
  {
    id: 10,
    title: 'Real Estate Africa',
    category: 'Property & Living',
    coverImage: '/assets/realestate.jpeg',
    rating: 4.8,
    price: 10.99,
    digitalPrice: 10.99,
    printPrice: 14.99,
    description: 'Property · Architecture · Home Design',
    issue: 'Vol. 2 / October 2026',
    pages: 112,
    publisher: 'Trendorabay Media',
    publishDate: '2026-10-01',
  },
  {
    id: 11,
    title: 'Music & Entertainment',
    category: 'Music & Entertainment',
    coverImage: '/assets/fashion.jpeg',
    rating: 4.6,
    price: 12.99,
    digitalPrice: 12.99,
    printPrice: 16.99,
    description: 'Music · Concerts · Entertainment Industry',
    issue: 'Vol. 8 / November 2026',
    pages: 88,
    publisher: 'Trendorabay Media',
    publishDate: '2026-11-01',
  },
  {
    id: 12,
    title: 'Wellness Plus',
    category: 'Health & Wellness',
    coverImage: '/assets/well_dress.jpeg',
    rating: 4.5,
    price: 8.99,
    digitalPrice: 8.99,
    printPrice: 12.99,
    description: 'Health · Fitness · Mental Wellbeing',
    issue: 'Vol. 5 / December 2026',
    pages: 104,
    publisher: 'Trendorabay Media',
    publishDate: '2026-12-01',
  },
  {
    id: 13,
    title: 'Creative Arts',
    category: 'Art & Design',
    coverImage: '/assets/art.jpeg',
    rating: 4.9,
    price: 9.99,
    digitalPrice: 9.99,
    printPrice: 13.99,
    description: 'Contemporary Art · Design · Creative Expression',
    issue: 'Vol. 10 / January 2027',
    pages: 120,
    publisher: 'Trendorabay Media',
    publishDate: '2027-01-01',
  },
];

const LatestMagazines = ({ limit = 8, showViewAll = true, category }) => {
  const [magazines, setMagazines] = useState([]);
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    // Set magazines directly without loading delay
    let filtered = sampleMagazines;
    if (category) {
      filtered = sampleMagazines.filter(m => 
        m.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    setMagazines(filtered);
  }, [limit, category]);

  const handleAddToCart = (magazine) => {
    dispatch(addToCart({
      id: magazine.id,
      name: magazine.title,
      price: magazine.price,
      type: 'magazine',
      image: magazine.coverImage,
      quantity: 1,
    }));
    toast.success(`${magazine.title} added to cart!`, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleQuickView = (magazine) => {
    // This would open a modal with magazine preview
    toast.info(`Preview feature coming soon for ${magazine.title}`);
  };

  

  return (
    <section className="latest-magazines">
      <div className="container">
        {/* <div className="latest-magazines-header">
          <div className="header-left">
            <h2>
              <span className="accent">✦</span> Latest Magazines
            </h2>
          </div>
          {showViewAll && (
            <Link to="/magazines" className="view-all-link">
              View All <i className="fas fa-arrow-right"></i>
            </Link>
          )}
        </div> */}

        <div className="magazines-scroll-container" ref={scrollContainerRef}>
          <div className="magazines-grid-wrapper">
          <div className="magazines-grid">
          {magazines.slice(0, limit).map((magazine, index) => (
            <div
              key={magazine.id}
              className="magazine-card"
            >
              <Link to={`/magazines/${magazine.id}`}>
                <img 
                  src={magazine.coverImage} 
                  alt={magazine.title}
                  className="magazine-cover"
                  loading="lazy"
                  style={{ cursor: 'pointer' }}
                />
              </Link>

              <div className="magazine-details">
                <div className="magazine-category">
                  {magazine.category}
                </div>
                <div className="category-rating">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="star-container">
                      <i className="fas fa-star star-empty"></i>
                      <i 
                        className="fas fa-star star-filled" 
                        style={{
                          clipPath: i < Math.floor(magazine.rating) 
                            ? 'none' 
                            : i < magazine.rating 
                              ? `inset(0 ${100 - ((magazine.rating - Math.floor(magazine.rating)) * 100)}% 0 0)`
                              : 'inset(0 100% 0 0)'
                        }}
                      ></i>
                    </div>
                  ))}
                  <span className="rating-number">{magazine.rating}</span>
                </div>
              </div>

              {/* African pattern accent */}
              <div className="card-pattern"></div>
            </div>
          ))}
          </div>
          
          {/* Sticky Chevron Icons */}
          <div className="chevron-left-container">
            <i className="fas fa-chevron-left chevron-left-icon"></i>
          </div>
          <div className="chevron-right-container">
            <i className="fas fa-chevron-right chevron-right-icon"></i>
          </div>
          </div>
          
                  </div>


      {/* African pattern divider */}
      <div className="magazines-pattern-divider">
        <span className="pattern-symbol">⧗</span>
        <span className="pattern-symbol">⧗</span>
        <span className="pattern-symbol">⧗</span>
      </div>
      </div>
    </section>
  );
};

export default LatestMagazines;