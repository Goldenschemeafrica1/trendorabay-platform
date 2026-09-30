import React from 'react';
import './LandingPageSkeleton.css';

const LandingPageSkeleton = () => {
  return (
    <section className="landing-page">
      <div className="nl-container">
        {/* Top Ad Skeleton */}
        <div className="top-ad skeleton">
          <div className="skeleton-image" />
        </div>

        {/* Hero Skeleton */}
        <section className="hero-stories">
          <div className="hero-stories-content">
            <div className="skeleton-text skeleton-kicker" />
            <div className="skeleton-text skeleton-title" />
            <div className="skeleton-text skeleton-title" />
            <div className="skeleton-text skeleton-title" />
            <div className="skeleton-text skeleton-description" />
            <div className="hero-stories-buttons">
              <div className="skeleton-button" />
              <div className="skeleton-button" />
            </div>
          </div>
          <div className="hero-stories-visual">
            <div className="hero-stories-feature skeleton">
              <div className="skeleton-text skeleton-tag" />
              <div className="skeleton-text skeleton-heading" />
              <div className="skeleton-text skeleton-desc" />
              <div className="skeleton-text skeleton-link" />
            </div>
            <div className="hero-stories-strip">
              <div className="hero-stories-mini skeleton">
                <div className="skeleton-text skeleton-mini-tag" />
                <div className="skeleton-text skeleton-mini-title" />
              </div>
              <div className="hero-stories-mini skeleton">
                <div className="skeleton-text skeleton-mini-tag" />
                <div className="skeleton-text skeleton-mini-title" />
              </div>
            </div>
          </div>
        </section>

        {/* Latest Stories Skeleton */}
        <section className="nl-section">
          <div className="nl-section-head">
            <div className="skeleton-text skeleton-section-title" />
            <div className="skeleton-text skeleton-link" />
          </div>
          <div className="nl-trending">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="nl-story-card skeleton">
                <div className="nl-card-img">
                  <div className="skeleton-image" />
                  <div className="skeleton-text skeleton-label" />
                </div>
                <div className="nl-card-body">
                  <div className="skeleton-text skeleton-tag" />
                  <div className="skeleton-text skeleton-title" />
                  <div className="skeleton-text skeleton-excerpt" />
                  <div className="skeleton-text skeleton-meta" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Card Skeleton */}
        <section className="nl-section">
          <div className="community-card skeleton">
            <div className="community-content">
              <div className="skeleton-text skeleton-kicker" />
              <div className="skeleton-text skeleton-heading" />
              <div className="skeleton-text skeleton-description" />
              <div className="skeleton-button" />
            </div>
          </div>
        </section>

        {/* Magazines Skeleton */}
        <section className="nl-section">
          <div className="nl-store-view">
            <div className="nl-section-head">
              <div>
                <div className="skeleton-text skeleton-tag" />
                <div className="skeleton-text skeleton-section-title" />
              </div>
              <div className="skeleton-text skeleton-link" />
            </div>
            <div className="nl-magazine-hero skeleton">
              <div className="nl-mag-cover skeleton">
                <div className="skeleton-image" />
              </div>
              <div>
                <div className="skeleton-text skeleton-kicker" />
                <div className="skeleton-text skeleton-heading" />
                <div className="skeleton-text skeleton-desc" />
                <div className="skeleton-text skeleton-price" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default LandingPageSkeleton;
