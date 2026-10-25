import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './MagazinesPage.css';

const MagazinesPage = () => {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState('');
  const itemsPerPage = 8;

  const formatPrice = (price) => `KSh ${price.toLocaleString()}`;

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

  const featuredMagazine = magazines.length > 0 ? magazines[0] : null;
  const archiveMagazines = magazines.length > 1 ? magazines.slice(1) : [];

  const totalPages = Math.ceil(archiveMagazines.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMagazines = archiveMagazines.slice(startIndex, endIndex);

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Thanks! ${email} has been added to the Trendorabay Magazine subscription.`);
    setEmail('');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const archiveSection = document.getElementById('archiveSection');
    if (archiveSection) {
      const yOffset = -20;
      const y = archiveSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="magazines-page">
        {/* HERO SKELETON */}
        <section className="page-hero">
          <div className="container hero-grid">
            <div>
              <div className="eyebrow skeleton-text"></div>
              <h1 className="skeleton-text"></h1>
              <p className="skeleton-text"></p>
            </div>
            <div className="hero-art">
              <div className="tile ta skeleton-image"></div>
              <div className="tile tb skeleton-image"></div>
              <div className="tile tc skeleton-image"></div>
            </div>
          </div>
        </section>

        {/* FEATURED ISSUE SKELETON */}
        <section className="featured-issue">
          <div className="container featured-grid">
            <div className="cover-wrap skeleton-image"></div>
            <div className="featured-info">
              <div className="eyebrow skeleton-text"></div>
              <h2 className="skeleton-text"></h2>
              <p className="skeleton-text"></p>
              <div className="featured-meta">
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
              </div>
              <div className="featured-actions">
                <div className="btn skeleton-button"></div>
                <div className="btn skeleton-button"></div>
              </div>
            </div>
          </div>
        </section>

        {/* ARCHIVE GRID SKELETON */}
        <section className="archive">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow skeleton-text"></span>
                <h2 className="skeleton-text"></h2>
              </div>
            </div>
            <div className="issues-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="issue-card skeleton-card">
                  <div className="issue-cover skeleton-image"></div>
                  <div className="issue-info">
                    <h3 className="skeleton-text"></h3>
                    <p className="skeleton-text"></p>
                    <span className="read-link skeleton-text"></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRINT BANNER SKELETON */}
        <section className="container">
          <div className="print-banner skeleton-card">
            <div>
              <div className="skeleton-text"></div>
              <h2 className="skeleton-text"></h2>
              <p className="skeleton-text"></p>
            </div>
            <div className="white-btn skeleton-button"></div>
          </div>
        </section>

        {/* NEWSLETTER SKELETON */}
        <section className="container">
          <div className="newsletter skeleton-card">
            <div className="eyebrow skeleton-text"></div>
            <h2 className="skeleton-text"></h2>
            <p className="skeleton-text"></p>
            <div className="skeleton-input"></div>
            <div className="skeleton-button"></div>
          </div>
        </section>
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
      {/* HERO */}
      <section className="page-hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">Trendorabay Magazine</div>
            <h1>Stories shaping <em>tomorrow's Africa.</em></h1>
            <p>Every issue is a rich deep dive celebrating the people, ideas, and culture shaping our future—straight from the streets to the world.</p>
          </div>
          <div className="hero-art">
            <div className="tile ta"><img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=85" alt="Magazine" /></div>
            <div className="tile tb"><img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=85" alt="Culture" /></div>
            <div className="tile tc"><img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=85" alt="Stories" /></div>
          </div>
        </div>
      </section>

      {/* FEATURED ISSUE */}
      {featuredMagazine && (
        <section className="featured-issue">
          <div className="container featured-grid">

            <div className="cover-wrap">
              <Link to={`/magazines/${featuredMagazine.id}`} className="cover-img">
                {featuredMagazine.coverImage ? (
                  <img src={featuredMagazine.coverImage} alt="Issue Cover" />
                ) : (
                  <div style={{width: '100%', height: '100%', background: '#e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <span style={{fontSize: '24px', fontWeight: 'bold', color: '#666'}}>TRENDORABAY</span>
                  </div>
                )}
              </Link>
            </div>

            <div className="featured-info">
              <div className="eyebrow">Current Issue · Out Now</div>
              <h2>What's inside {featuredMagazine.issue || 'Issue 001'}.</h2>
              <p>{featuredMagazine.description || featuredMagazine.lead || 'Our latest issue. We spent three months on the ground across Nairobi, Lagos, Accra and Cape Town — documenting the designers redefining African fashion, the founders building the continent\'s payment rails, the farmers using AI to fight drought, and the creators shaping the culture.'}</p>

              <div className="featured-meta">
                <div>Published<strong>{featuredMagazine.published ? new Date(featuredMagazine.published).toLocaleDateString('en-US', {month: 'long', year: 'numeric'}) : 'May 2026'}</strong></div>
                <div>Pages<strong>64 pages</strong></div>
                <div>Stories<strong>10 features</strong></div>
                <div>Format<strong>Digital + Print</strong></div>
              </div>

              <div className="featured-actions">
                <Link to={`/magazines/${featuredMagazine.id}`} className="btn accent">Read Digital <span>→</span></Link>
                <Link to={`/magazines/${featuredMagazine.id}`} className="btn primary">Buy Print ({formatPrice(featuredMagazine.price || 1500)})</Link>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ARCHIVE GRID */}
      <section className="archive" id="archiveSection">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">The Archive</span>
              <h2>Browse all {magazines.length} issues.</h2>
            </div>
          </div>

          <div className="issues-grid" id="issuesGrid">
            {paginatedMagazines.map((magazine) => (
              <Link
                key={magazine.id}
                to={`/magazines/${magazine.id}`}
                className="issue-card"
              >
                <div className="issue-cover">
                  <span className="issue-tag">Digital + Print</span>
                  {magazine.coverImage ? (
                    <img src={magazine.coverImage} alt={magazine.title} loading="lazy" />
                  ) : (
                    <div style={{width: '100%', height: '100%', background: '#e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <span style={{fontSize: '18px', fontWeight: 'bold', color: '#666'}}>TRENDORABAY</span>
                    </div>
                  )}
                </div>
                <div className="issue-info">
                  <h3>{magazine.issue || `Issue ${magazine.id}`}</h3>
                  <p>{magazine.title}</p>
                  <span className="read-link">Open Issue →</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="pagination" id="pagination">
            {totalPages > 1 && (
              <>
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ←
                </button>
                {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  →
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* PRINT BANNER */}
      <section className="container">
        <div className="print-banner">
          <div>
            <div style={{fontSize: '11px', fontWeight: '800', letterSpacing: '.18em', textTransform: 'uppercase', color: '#888', marginBottom: '14px'}}>Physical Editions</div>
            <h2>Hold the story in your hands.</h2>
            <p>Premium matte paper, perfect-bound spines, and cover art designed to live on your shelf. Available for delivery across Kenya and the diaspora.</p>
          </div>
          <Link to="/store" className="white-btn">Shop Print Editions →</Link>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="container">
        <div className="newsletter">
          <div className="eyebrow" style={{fontSize: '11px', fontWeight: '800', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '14px'}}>Never miss an issue</div>
          <h2>Get every issue the moment it drops.</h2>
          <p>Subscribe for free and we'll send you each new issue, plus occasional deep dives and creator spotlights.</p>
          <form onSubmit={handleSubscribe}>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Subscribe free</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default MagazinesPage;