import React from 'react';
import './WriterCTA.css';

const WriterCTA = () => {
  return (
    <section className="writer-cta">
      <div className="container">
        <div className="cta-content">
          <h2>Share Your Story</h2>
          <p>Are you a writer with a story to tell? Join our community of African writers and share your voice with the world.</p>
          <div className="cta-buttons">
            <button className="btn-primary">Become a Writer</button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WriterCTA;
