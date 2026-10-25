import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MagazineDetails from '../../components/magazines/MagazineDetails';
import magazineService from '../../services/magazineService';

const MagazineDetailPage = () => {
  const { slug } = useParams();
  const [magazine, setMagazine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMagazine = async () => {
      try {
        if (import.meta.env.DEV) {
          console.log('Fetching magazine with slug:', slug);
        }
        setLoading(true);
        const data = await magazineService.getMagazineBySlug(slug);
        if (import.meta.env.DEV) {
          console.log('Magazine data received:', data);
        }
        setMagazine(data);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Error fetching magazine:', err);
        }
        setError('Failed to load magazine details');
      } finally {
        setLoading(false);
      }
    };

    if (slug && slug !== 'undefined') {
      fetchMagazine();
    } else {
      if (import.meta.env.DEV) {
        console.log('Invalid slug:', slug);
      }
      setLoading(false);
      setError('Invalid magazine slug');
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="magazine-detail-page">
        {/* HERO SKELETON */}
        <section className="issue-hero">
          <div className="container issue-hero-grid">
            <div className="cover-wrap">
              <div className="cover-img skeleton-image"></div>
              <div className="cover-actions">
                <div className="btn skeleton-button"></div>
                <div className="btn skeleton-button"></div>
                <div className="btn skeleton-button"></div>
              </div>
              <div className="cover-meta-small skeleton-text"></div>
            </div>
            <div className="issue-info">
              <div className="eyebrow skeleton-text"></div>
              <h1 className="skeleton-text"></h1>
              <p className="issue-subtitle skeleton-text"></p>
              <div className="issue-meta-grid">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="meta-item">
                    <span className="label skeleton-text"></span>
                    <span className="value skeleton-text"></span>
                  </div>
                ))}
              </div>
              <p className="issue-description skeleton-text"></p>
              <div className="issue-highlights">
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className="highlight-pill skeleton-text"></span>
                ))}
              </div>
              <div className="issue-share">
                <span className="label skeleton-text"></span>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="share-btn skeleton-icon"></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PRINT EDITION SKELETON */}
        <section className="container">
          <div className="print-edition">
            <div className="print-img-wrap">
              <div className="print-img skeleton-image"></div>
            </div>
            <div className="print-text">
              <div className="eyebrow skeleton-text"></div>
              <h2 className="skeleton-text"></h2>
              <p className="skeleton-text"></p>
              <div className="print-specs">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton-text"></div>
                ))}
              </div>
              <div className="print-price-row">
                <span className="print-price skeleton-text"></span>
                <span className="print-price-note skeleton-text"></span>
              </div>
              <div className="print-actions">
                <div className="btn-print skeleton-button"></div>
                <div className="btn-print-outline skeleton-button"></div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED STORIES SKELETON */}
        <section className="section">
          <div className="container">
            <div className="carousel-header">
              <div className="section-head">
                <div className="eyebrow skeleton-text"></div>
                <h2 className="skeleton-text"></h2>
                <p className="skeleton-text"></p>
              </div>
              <div className="carousel-nav">
                <div className="carousel-btn skeleton-icon"></div>
                <div className="carousel-btn skeleton-icon"></div>
              </div>
            </div>
            <div className="carousel-container">
              <div className="carousel-track">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <article key={i} className="feature-card skeleton-card">
                    <div className="feature-img skeleton-image"></div>
                    <div className="feature-info">
                      <span className="cat skeleton-text"></span>
                      <h3 className="skeleton-text"></h3>
                      <p className="skeleton-text"></p>
                      <div className="meta">
                        <span className="author skeleton-text"></span>
                        <span className="skeleton-text"></span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CONTRIBUTORS SKELETON */}
        <section className="section contributors-section">
          <div className="container">
            <div className="carousel-header">
              <div className="section-head">
                <div className="eyebrow skeleton-text"></div>
                <h2 className="skeleton-text"></h2>
                <p className="skeleton-text"></p>
              </div>
              <div className="carousel-nav">
                <div className="carousel-btn skeleton-icon"></div>
                <div className="carousel-btn skeleton-icon"></div>
              </div>
            </div>
            <div className="carousel-container">
              <div className="carousel-track">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="contributor-card skeleton-card">
                    <div className="avatar skeleton-avatar"></div>
                    <h3 className="skeleton-text"></h3>
                    <div className="role skeleton-text"></div>
                    <p className="skeleton-text"></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PREVIEW SPREADS SKELETON */}
        <section className="section preview-section">
          <div className="container">
            <div className="section-head center">
              <div className="eyebrow skeleton-text"></div>
              <h2 className="skeleton-text"></h2>
              <p className="skeleton-text"></p>
            </div>
            <div className="preview-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="preview-card skeleton-card">
                  <div className="skeleton-image"></div>
                  <span className="preview-page-num skeleton-text"></span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PREV/NEXT ISSUE NAV SKELETON */}
        <section className="container">
          <div className="issue-nav">
            <div className="issue-nav-card skeleton-card">
              <div className="thumb skeleton-image"></div>
              <div className="info">
                <div className="label skeleton-text"></div>
                <div className="title skeleton-text"></div>
              </div>
            </div>
            <div className="issue-nav-card next skeleton-card">
              <div className="thumb skeleton-image"></div>
              <div className="info">
                <div className="label skeleton-text"></div>
                <div className="title skeleton-text"></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA BANNER SKELETON */}
        <section className="container" style={{marginTop: '40px'}}>
          <div className="cta-banner skeleton-card">
            <div>
              <div className="skeleton-text"></div>
              <h2 className="skeleton-text"></h2>
              <p className="skeleton-text"></p>
            </div>
            <div className="white-btn skeleton-button"></div>
          </div>
        </section>
      </div>
    );
  }

  if (error || !magazine) {
    return (
      <div className="magazine-detail-page">
        <div className="container">
          <div className="error">{error || 'Magazine not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="magazine-detail-page">
      <MagazineDetails magazine={magazine} />
    </div>
  );
};

export default MagazineDetailPage;
