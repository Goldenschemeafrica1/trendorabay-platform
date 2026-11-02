import React from 'react';
import './LandingPageSkeleton.css';

const CommunityPageSkeleton = () => {
  return (
    <div className="community-page-new">
      {/* Hero Skeleton */}
      <section className="page-hero">
        <div className="container hero-grid">
          <div>
            <div className="skeleton-text skeleton-kicker" style={{width: '200px', marginBottom: '16px'}} />
            <div className="skeleton-text skeleton-title" style={{width: '60%', marginBottom: '15px'}} />
            <div className="skeleton-text skeleton-description" style={{width: '90%', marginBottom: '18px'}} />
            <div className="hero-search skeleton">
              <div className="skeleton-text" style={{width: '100%', height: '40px'}} />
            </div>
          </div>
          <div className="hero-art skeleton">
            <div className="skeleton-image" style={{width: '100%', height: '200px'}} />
          </div>
        </div>
      </section>

      {/* Communities Grid Skeleton */}
      <section className="section section-soft">
        <div className="container">
          <div className="category-bar">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton-text" style={{width: '80px', height: '30px', borderRadius: '999px'}} />
            ))}
          </div>
          <div className="community-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="community-card skeleton">
                <div className="card-image">
                  <div className="skeleton-image" style={{aspectRatio: '16/9'}} />
                </div>
                <div className="card-body">
                  <div className="skeleton-text skeleton-tag" style={{width: '60px', marginBottom: '8px'}} />
                  <div className="skeleton-text skeleton-title" style={{width: '80%', marginBottom: '8px'}} />
                  <div className="skeleton-text skeleton-excerpt" style={{width: '100%', marginBottom: '8px'}} />
                  <div className="skeleton-text skeleton-excerpt" style={{width: '60%', marginBottom: '12px'}} />
                  <div className="card-stats skeleton">
                    <div className="skeleton-text" style={{width: '80px', height: '12px'}} />
                  </div>
                  <div className="card-actions">
                    <div className="skeleton-button" style={{width: '100%', height: '32px'}} />
                    <div className="skeleton-button" style={{width: '100%', height: '32px'}} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Skeleton */}
      <section className="section soft">
        <div className="container">
          <div className="head">
            <div>
              <div className="skeleton-text skeleton-kicker" style={{width: '150px', marginBottom: '16px'}} />
              <div className="skeleton-text skeleton-heading" style={{width: '70%', marginBottom: '8px'}} />
              <div className="skeleton-text skeleton-description" style={{width: '60%'}} />
            </div>
          </div>
          <div className="steps">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="step skeleton">
                <div className="skeleton-text" style={{width: '34px', height: '34px', borderRadius: '50%', marginBottom: '20px'}} />
                <div className="skeleton-text skeleton-heading" style={{width: '60%', marginBottom: '8px'}} />
                <div className="skeleton-text skeleton-excerpt" style={{width: '100%', marginBottom: '4px'}} />
                <div className="skeleton-text skeleton-excerpt" style={{width: '80%'}} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommunityPageSkeleton;
