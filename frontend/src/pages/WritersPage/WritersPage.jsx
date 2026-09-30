import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WritersPage.css';

const WritersPage = () => {
  const navigate = useNavigate();

  const handleApply = () => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/writers/writer-application');
  };

  const topics = [
    { name: 'Business & Entrepreneurship' },
    { name: 'Technology' },
    { name: 'Fashion & Lifestyle' },
    { name: 'Entertainment' },
    { name: 'Sports' },
    { name: 'Agriculture' },
    { name: 'Finance' },
    { name: 'Youth & Innovation' },
    { name: 'Culture & Community' },
    { name: 'Travel' },
    { name: 'Food & Nutrition' },
    { name: 'Education' },
    { name: 'Creative Arts' },
    { name: 'Impact Stories' }
  ];

  const whoCanApply = [
    {
      title: 'Aspiring Writers',
      description: "New to writing? That's fine. We're looking for ideas and voice, not just experience."
    },
    {
      title: 'Experienced Journalists',
      description: 'Bring your craft, editorial instincts and reporting skills to a new generation of readers.'
    },
    {
      title: 'Bloggers & Content Creators',
      description: 'Turn your content into editorial work that reaches an even bigger audience.'
    },
    {
      title: 'Industry Professionals',
      description: 'Share insider knowledge and perspective from your field with our readers.'
    },
    {
      title: 'Students & Young Storytellers',
      description: 'Start building your writing portfolio on a platform that values your voice.'
    },
    {
      title: 'Freelance Writers',
      description: 'Pitch stories, get published and grow your byline with Trendorabay.'
    }
  ];

  const howItWorks = [
    {
      num: '01',
      title: 'Apply',
      description: 'Submit your writer application through our editorial team.'
    },
    {
      num: '02',
      title: 'Review',
      description: 'Our editorial team reviews your application and portfolio.'
    },
    {
      num: '03',
      title: 'Get Approved',
      description: 'Approved writers receive access to the Trendorabay Writer Dashboard.'
    },
    {
      num: '04',
      title: 'Pitch',
      description: 'Submit story ideas through your dashboard for editorial review.'
    },
    {
      num: '05',
      title: 'Write',
      description: 'Accepted pitches become assignments you can begin working on.'
    },
    {
      num: '06',
      title: 'Publish',
      description: 'After editorial review, approved stories are published on Trendorabay.'
    }
  ];

  const benefits = [
    {
      title: 'Reach a Real Audience',
      description: 'Your stories published on a platform read across Africa and beyond.'
    },
    {
      title: 'Editorial Support',
      description: 'Work with editors who help you sharpen every story you write.'
    },
    {
      title: 'Build Your Portfolio',
      description: 'Grow a public portfolio of published work under your name.'
    },
    {
      title: 'Join a Network',
      description: 'Connect with writers, creators and editors across the continent.'
    }
  ];

  return (
    <div className="writers-page">
      <main className="container">
        {/* Compact Writer Hero */}
        <section className="writer-hero">
          <div className="writer-hero-shell">
            <div className="writer-hero-content">
              <span className="kicker">Trendorabay</span>
              <h1>BECOME A <span>WRITER</span></h1>
              <div className="writer-hero-divider"></div>
              <p>Share your voice. Tell stories that matter. We're looking for writers who can bring fresh ideas, original stories and unique perspectives to our audience.</p>
              <a href="#apply" className="writer-hero-cta" onClick={(e) => { e.preventDefault(); handleApply(); }}>
                APPLY TO BECOME A WRITER →
              </a>
            </div>
          </div>
        </section>

      {/* What You Can Write About */}
      <section className="section">
        <div className="section-head">
          <div>
            <span className="tag">Topics</span>
            <h2>✦ What You Can Write About</h2>
          </div>
        </div>

        <div className="topics-grid">
          {topics.map((topic, index) => (
            <div key={index} className="topic-card">
              <span>{topic.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Who Can Apply */}
      <section className="section">
        <div className="section-head">
          <div>
            <span className="tag">Open to everyone</span>
            <h2>✦ Who Can Apply?</h2>
          </div>
        </div>

        <div className="who-grid">
          {whoCanApply.map((item, index) => (
            <div key={index} className="who-card">
              <span className="who-check">✓</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="how-shell">
          <div className="how-head">
            <span className="kicker">The Process</span>
            <h2>How It <span>Works</span></h2>
          </div>

          <div className="how-grid">
            {howItWorks.map((step, index) => (
              <div key={index} className="how-step">
                <div className="how-step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section">
        <div className="section-head">
          <div>
            <span className="tag">Why write with us</span>
            <h2>✦ Writer Benefits</h2>
          </div>
        </div>

        <div className="benefits-strip">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-item">
              <h4>{benefit.title}</h4>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ready to Write CTA */}
      <section className="section">
        <div className="apply-banner">
          <div className="apply-banner-content">
            <span className="kicker">Ready to write for Trendorabay?</span>
            <h2>Bring your ideas.<br />Find your voice.</h2>
            <p>Tell stories that shape tomorrow. Apply today and start your journey as a Trendorabay writer.</p>
            <a href="#apply" className="apply-banner-btn" onClick={(e) => { e.preventDefault(); handleApply(); }}>
              BECOME A WRITER →
            </a>
          </div>
        </div>
      </section>

      {/* Contact Strip */}
      <section className="section" id="apply">
        <div className="contact-strip">
          <div>
            <span className="tag">Ready to apply?</span>
            <h3>Reach out to our editorial team.</h3>
            <p>Send us a short introduction, the topics you want to write about, and any links to your work. Our editorial team will review your application and get back to you within 7 working days.</p>
          </div>
          <div className="contact-actions">
            <a href="mailto:writers@trendorabay.com" className="contact-btn contact-btn-primary">
              EMAIL US →
            </a>
            <a href="/terms" className="contact-btn contact-btn-secondary">
              GUIDELINES
            </a>
          </div>
        </div>
      </section>
      </main>
    </div>
  );
};

export default WritersPage;