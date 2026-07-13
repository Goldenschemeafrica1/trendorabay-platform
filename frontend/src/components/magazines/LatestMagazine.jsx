import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem as addToCart } from "../../store/slices/cartSlice";
import { toast } from 'react-toastify';
import magazineService from '../../services/magazineService';
import './LatestMagazine.css';

const LatestMagazines = ({ limit = 8, showViewAll = true, category }) => {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        setLoading(true);
        const data = await magazineService.getMagazines({ limit, category });
        // Ensure each magazine has id and slug fields
        const transformedData = Array.isArray(data) ? data.map(magazine => ({
          ...magazine,
          id: magazine.id || magazine._id || magazine.magazine_id,
          slug: magazine.slug || String(magazine.id || magazine._id || magazine.magazine_id)
        })).filter(magazine => magazine.slug && magazine.slug !== 'undefined') : [];
        setMagazines(transformedData);
      } catch (error) {
        console.error('Error fetching magazines:', error);
        setMagazines([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMagazines();
  }, [category, limit]);

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
        <div className="latest-magazines-header">
          <div className="header-left">
            <h2>
              <span className="accent">✦</span> Latest Magazines
            </h2>
          </div>
        </div>

        <div className="magazines-scroll-container" ref={scrollContainerRef}>
          <div className="magazines-grid-wrapper">
          <div className="magazines-grid">
          {magazines.map((magazine, index) => (
            <div
              key={magazine.id}
              className="magazine-card"
            >
              <Link to={`/magazines/${magazine.slug}`}>
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
            </div>
          ))}
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