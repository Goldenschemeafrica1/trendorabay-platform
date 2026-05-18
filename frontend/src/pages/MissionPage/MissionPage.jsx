import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MissionPage.css';

const MissionPage = () => {
  const [stats, setStats] = useState({
    readers: 45000,
    writers: 2500,
    countries: 45,
    impact: 1000,
  });

  // Animate stats on mount
  useEffect(() => {
    const animateStats = () => {
      const targets = { readers: 45000, writers: 2500, countries: 45, impact: 1000 };
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setStats({
          readers: Math.floor(progress * targets.readers),
          writers: Math.floor(progress * targets.writers),
          countries: Math.floor(progress * targets.countries),
          impact: Math.floor(progress * targets.impact),
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setStats(targets);
        }
      }, interval);

      return () => clearInterval(timer);
    };

    animateStats();
  }, []);

  return (
    <div className="mission-page">
      {/* Hero Section */}
      <section className="mission-hero">
        <div className="container">
          <div className="hero-content">
            <h1>
              <span className="accent">✦</span> 
              Our Mission
            </h1>
            <p className="hero-subtitle">
              To elevate African voices and trends by creating a platform where stories are told 
              by Africans, for the world.
            </p>
            <div className="hero-visual">
              <div className="mission-icon">
                <span>🌍</span>
              </div>
              <div className="mission-ring"></div>
            </div>
          </div>
        </div>
        <div className="hero-pattern"></div>
      </section>

      {/* Mission Statement */}
      <section className="mission-statement">
        <div className="container">
          <div className="statement-content">
            <h2>Why We Exist</h2>
            <p className="statement-text">
              African stories have been told through others' lenses for too long. We exist to change that narrative 
              by providing a platform where African creators, thinkers, and innovators can share their authentic 
              stories with the world.
            </p>
            <p className="statement-text">
              We believe that Africa's future lies in the power of its people to tell their own stories, 
              celebrate their own culture, and define their own path forward.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="core-values">
        <div className="container">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🌍</div>
              <h3>Authenticity</h3>
              <p>We tell real stories from real people. No stereotypes, no shortcuts, just genuine African voices.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">✨</div>
              <h3>Excellence</h3>
              <p>Premium content, beautiful design, and thoughtful journalism that meets global standards.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Community</h3>
              <p>We grow together. Every writer, reader, and creator matters in building our collective future.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🚀</div>
              <h3>Innovation</h3>
              <p>Embracing new ways to tell stories and reach audiences in the digital age.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3>Pan-African</h3>
              <p>All of Africa, one platform. From Lagos to Nairobi to Accra, we celebrate the entire continent.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>Impact</h3>
              <p>Creating opportunities and amplifying voices that need to be heard across the globe.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="vision-section">
        <div className="container">
          <div className="vision-content">
            <h2>Our Vision</h2>
            <p className="vision-text">
              To become Africa's most trusted platform for premium storytelling, 
              where every African voice can find its audience and every story finds its home.
            </p>
            <div className="vision-pillars">
              <div className="pillar">
                <div className="pillar-icon">📚</div>
                <h4>Education</h4>
                <p>Informing and educating through quality content</p>
              </div>
              <div className="pillar">
                <div className="pillar-icon">🎨</div>
                <h4>Culture</h4>
                <p>Promoting African arts and cultural heritage</p>
              </div>
              <div className="pillar">
                <div className="pillar-icon">💼</div>
                <h4>Opportunity</h4>
                <p>Creating economic opportunities for creators</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="impact-stats">
        <div className="container">
          <h2>Our Impact</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{stats.readers.toLocaleString()}+</div>
              <div className="stat-label">Global Readers</div>
              <div className="stat-desc">People engaging with African stories</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.writers.toLocaleString()}+</div>
              <div className="stat-label">African Writers</div>
              <div className="stat-desc">Voices amplified across the continent</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.countries}</div>
              <div className="stat-label">Countries Reached</div>
              <div className="stat-desc">Global audience engagement</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.impact.toLocaleString()}+</div>
              <div className="stat-label">Stories Published</div>
              <div className="stat-desc">Authentic African narratives</div>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="commitment">
        <div className="container">
          <div className="commitment-content">
            <h2>Our Commitment</h2>
            <div className="commitment-grid">
              <div className="commitment-item">
                <div className="commitment-icon">✓</div>
                <h3>Quality Journalism</h3>
                <p>Maintaining the highest standards of accuracy, fairness, and integrity in all our content.</p>
              </div>
              <div className="commitment-item">
                <div className="commitment-icon">✓</div>
                <h3>Diverse Voices</h3>
                <p>Ensuring representation from all corners of Africa and its diaspora.</p>
              </div>
              <div className="commitment-item">
                <div className="commitment-icon">✓</div>
                <h3>Sustainable Growth</h3>
                <p>Building a sustainable business model that supports our creators and community.</p>
              </div>
              <div className="commitment-item">
                <div className="commitment-icon">✓</div>
                <h3>Digital Innovation</h3>
                <p>Leveraging technology to enhance storytelling and user experience.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="mission-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Be Part of Our Mission</h2>
            <p>Join us in reshaping how African stories are told and shared with the world.</p>
            <div className="cta-buttons">
              <Link to="/contribute" className="btn btn-primary">
                <i className="fas fa-feather-alt"></i>
                Write for Us
              </Link>
              <Link to="/community" className="btn btn-secondary">
                <i className="fas fa-users"></i>
                Join Community
              </Link>
              <Link to="/subscribe" className="btn btn-outline">
                <i className="fas fa-envelope"></i>
                Subscribe
              </Link>
            </div>
          </div>
        </div>
        <div className="cta-pattern"></div>
      </section>
    </div>
  );
};

export default MissionPage;
