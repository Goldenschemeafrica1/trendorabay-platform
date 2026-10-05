import { useState } from 'react';
import { Link } from 'react-router-dom';
import TeamSection from './TeamSection';
import './AboutPage.css';

const AboutPage = () => {
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 2200);
  };

  const scrollToStory = () => {
    document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="about-page">
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">About Trendorabay</div>
            <h1>Stories, style and solutions from <em>Africa's creators.</em></h1>
            <p>Trendorabay is a community-powered platform connecting people to the stories, products and opportunities shaping tomorrow's African narrative. We exist to amplify the voices, craft and businesses of African creators — and to give the world a place to discover them.</p>
            <div className="hero-cta">
              <button className="dark-btn" onClick={scrollToStory}>Our story</button>
              <button className="light-btn" onClick={() => showToast('Visit the store')}>Visit the store</button>
            </div>
          </div>
          <div className="hero-art">
            <div className="tile ta"><img src="/hero.jpeg" alt="Trendorabay Magazine Issue 001" /></div>
            <div className="tile tb"><img src="/hero1.jpeg" alt="Road to 10,000 Followers" /></div>
            <div className="tile tc"><img src="/hero2.jpeg" alt="Join Our Team" /></div>
          </div>
        </div>
      </section>

      {/* MISSION / VALUES */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Our mission</div>
            <h2>Built to celebrate and empower African creators.</h2>
            <p>Everything we build is guided by three core values — community, creativity and opportunity.</p>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <h3>Community first</h3>
              <p>We're a platform built around people, not algorithms. Communities are the heart of Trendorabay — from fashion and art to agriculture and technology.</p>
            </div>
            <div className="value-card">
              <h3>Creator-led</h3>
              <p>Every product, story and idea on Trendorabay comes from real African creators and businesses. We exist to amplify their craft, not replace it.</p>
            </div>
            <div className="value-card">
              <h3>Opportunity for all</h3>
              <p>We open doors — for creators to earn, for communities to grow, and for the world to discover the depth and beauty of African creativity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="section" id="story" style={{ paddingTop: 0 }}>
        <div className="container story">
          <div className="story-text">
            <div className="eyebrow">Our story</div>
            <h2>From a magazine to a movement.</h2>
            <p>Trendorabay began as a digital magazine telling the stories of Africa's most exciting creators — the designers, artists, farmers, musicians and entrepreneurs redefining what it means to be African today.</p>
            <p>As our community grew, so did their needs. Readers wanted to buy from the makers they discovered. Creators wanted a platform to sell directly to the people who loved their work. So we built it — a marketplace that turns stories into opportunities.</p>
            <p>Today, Trendorabay is a full ecosystem: stories, communities, podcasts, opportunities and a community-powered store where anyone can sell to the world. And we're just getting started.</p>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <TeamSection />

      {/* CTA BANNER */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-banner">
            <div>
              <div className="eyebrow" style={{ color: '#aaa' }}>Join us</div>
              <h2>Be part of the African creative movement.</h2>
              <p>Whether you're here to shop, sell, tell stories or simply explore — there's a place for you on Trendorabay.</p>
            </div>
            <Link to="/store" className="white-btn">Explore the store →</Link>
          </div>
        </div>
      </section>

      {/* TOAST */}
      <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.message}</div>
    </main>
  );
};

export default AboutPage;
