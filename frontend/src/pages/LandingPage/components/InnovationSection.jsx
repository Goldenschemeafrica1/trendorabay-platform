import React from 'react';

const InnovationSection = ({ innovationStories }) => {
  return (
    <section id="nl-innovation" className="nl-section">
      <div className="nl-section-head">
        <h2>✦ Innovation</h2>
        <Link to="/stories">EXPLORE →</Link>
      </div>
      <div className="nl-innovation-grid">
        {innovationStories.map((story, idx) => (
          <article
            key={idx}
            className="nl-innovation-card"
            onClick={() => window.location.href = `/stories/${story.slug || story.id}`}
          >
            <div className="nl-card-img">
              {story.image && (
                <img
                  src={story.image}
                  alt={story.title}
                  className="nl-card-media"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              )}
              {story.imgLabel}
            </div>
            <div>
              <span className="nl-tag">{story.tag}</span>
              <h3>{story.title}</h3>
              <p className="nl-excerpt">{story.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default InnovationSection;
