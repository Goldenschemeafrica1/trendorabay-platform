import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './MagazinesPage.css';

const MagazinesPage = () => {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatPrice = (price) => `KES ${price.toLocaleString()}`;

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        setLoading(true);
        const response = await api.get('/magazines');
        setMagazines(response.data.data || []);
      } catch (err) {
        setError('Failed to load magazines. Please try again.');
        console.error('Error fetching magazines:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMagazines();
  }, []);

  if (loading) {
    return (
      <div className="magazines-page">
        <div className="container">
          <div className="magazines-loading">
            <p>Loading magazines...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="magazines-page">
        <div className="container">
          <div className="magazines-error">
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="magazines-page">
      {/* Hero Section */}
      <section className="magazines-hero">
        <div className="container">
          <h1 className="magazines-title">
            <span className="african-pattern">✦</span> 
            Trendorabay Magazines
            <span className="african-pattern">✦</span>
          </h1>
          <p className="magazines-subtitle">
            Digital magazines exploring the people, businesses, ideas and cultural movements shaping Africa's next chapter.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="magazines-content">
        <div className="container">
          <div className="magazines-header">
            <h2>All Issues</h2>
            <p>{magazines.length} magazines available</p>
          </div>

          {magazines.length > 0 ? (
            <div className="magazines-grid">
              {magazines.map((magazine) => (
                <Link
                  key={magazine.id}
                  to={`/magazines/${magazine.slug || magazine.id}`}
                  className="magazine-card"
                >
                  <div className="magazine-cover">
                    {magazine.coverImage ? (
                      <img
                        src={magazine.coverImage}
                        alt={magazine.title}
                        className="magazine-cover-img"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="magazine-cover-placeholder">
                        <div className="cover-brand">TRENDORABAY</div>
                        <div className="cover-title">{magazine.title}</div>
                      </div>
                    )}
                  </div>
                  <div className="magazine-info">
                    <span className="magazine-tag">
                      {magazine.tag || 'ISSUE'}
                    </span>
                    <h3>{magazine.title}</h3>
                    <p className="magazine-description">
                      {magazine.description || 'Explore this issue of Trendorabay Magazine.'}
                    </p>
                    <div className="magazine-meta">
                      <span className="magazine-price">{formatPrice(magazine.price || 499)}</span>
                      <span className="magazine-date">
                        {magazine.published ? new Date(magazine.published).getFullYear() : '2026'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-magazines">
              <h3>No magazines available</h3>
              <p>Check back later for new issues.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MagazinesPage;