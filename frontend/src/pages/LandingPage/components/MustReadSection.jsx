import React from 'react';
import { Link } from 'react-router-dom';

const MustReadSection = ({ mustReadFeatures }) => {
  return (
    <section id="nl-business" className="nl-section nl-two-col">
      <div>
        <div className="nl-section-head">
          <h2>✦ Must Read</h2>
          <Link to="/stories">EXPLORE →</Link>
        </div>
        <div className="nl-feature-list">
          {mustReadFeatures.map((feature) => (
            <article
              key={feature.id || feature.title}
              className="nl-feature"
              onClick={() => window.location.href = `/stories/${feature.slug || feature.id}`}
            >
              <div className="nl-card-img">
                {feature.image && (
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="nl-card-media"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
                {feature.imgLabel}
              </div>
              <div>
                <span className="nl-tag">{feature.tag}</span>
                <h3>{feature.title}</h3>
                <p className="nl-excerpt">{feature.excerpt}</p>
                <p className="nl-meta">{feature.meta}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="nl-sidebar-col">
        <aside className="nl-sidebox">
          <span className="nl-kicker">Trendorabay Brief</span>
          <h3>One place for the ideas moving Africa forward.</h3>
          <p>
            Get the most important stories, business insights and opportunities in one weekly
            briefing.
          </p>
          <div className="nl-pill-list">
            {['Startups', 'Money', 'Tech', 'Culture', 'Creators'].map((pill) => (
              <span key={pill} className="nl-pill">{pill}</span>
            ))}
          </div>
          <form className="nl-sub-form">
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </aside>
      </div>
    </section>
  );
};

export default MustReadSection;
