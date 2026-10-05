import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SubscribePage.css';

const SubscribePage = () => {
  const [toast, setToast] = useState({ show: false, message: '' });
  const [openFaq, setOpenFaq] = useState(null);

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 2600);
  };

  const scrollToRates = () => {
    document.getElementById('rates')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handlePlanSelect = (plan) => {
    showToast(`${plan} package selected`);
  };

  const faqs = [
    {
      q: 'How long does it take for my feature to go live?',
      a: 'Once you\'ve approved the final draft, we publish within 5–7 business days. For the Premium package, we can fast-track to 2–3 business days on request.'
    },
    {
      q: 'Can I see the article before it goes live?',
      a: 'Yes. Every package includes a review stage — you\'ll see the full draft and can request edits before it\'s published.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept M-Pesa, major debit and credit cards, and PayPal. Payments are handled securely and can be invoiced for organizations.'
    },
    {
      q: 'Do you offer custom packages?',
      a: 'Yes. If you need something bigger — a multi-month campaign, event coverage, or a fully custom content partnership — get in touch and we\'ll build a package around your goals.'
    },
    {
      q: 'Can I request a specific writer or angle?',
      a: 'You can suggest angles and reference examples you like. For specific writers, this is available on the Premium package and custom partnerships.'
    }
  ];

  return (
    <main className="subscribe-page">
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="eyebrow">Trendorabay Rate Card</div>
              <h1>Get your brand <em>in front of Africa's creators.</em></h1>
              <p>Feature your article, product, brand or event on Trendorabay — the platform telling the stories shaping tomorrow's African narrative. Choose the package that fits your goals.</p>
              <div className="hero-cta">
                <button className="dark-btn" onClick={scrollToRates}>See rates</button>
                <button className="light-btn" onClick={scrollToContact}>Talk to us</button>
              </div>
            </div>
            <div className="hero-art">
              <div className="tile ta"><img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=700&q=85" alt="Brand feature" /></div>
              <div className="tile tb"><img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=85" alt="Storytelling" /></div>
              <div className="tile tc"><img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=85" alt="Magazine" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* RATE CARD */}
      <section className="section plans" id="rates">
        <div className="container">
          <div className="rate-title">
            <span className="brand">Trendorabay Rate Card</span>
            <h2>Choose your package.</h2>
          </div>

          <div className="plans-grid">
            {/* STARTER */}
            <article className="plan">
              <span className="plan-tier">Starter</span>
              <h3>Get Featured</h3>
              <p className="tagline">KES 2,500</p>
              <div className="plan-price">
                <span className="amount">2,500</span>
                <span className="currency">KES</span>
              </div>
              <ul className="plan-features">
                <li><span className="check">✓</span> Article / Profile</li>
                <li><span className="check">✓</span> Trendorabay.com Publication</li>
                <li><span className="check">✓</span> 1 Social Media Post</li>
              </ul>
              <button className="plan-cta outline" onClick={() => handlePlanSelect('Starter')}>Get started</button>
            </article>

            {/* GROWTH (featured) */}
            <article className="plan featured">
              <span className="plan-badge">Most popular</span>
              <span className="plan-tier">Growth</span>
              <h3>Get Noticed</h3>
              <p className="tagline">KES 5,000</p>
              <div className="plan-price">
                <span className="amount">5,000</span>
                <span className="currency">KES</span>
              </div>
              <ul className="plan-features">
                <li><span className="check">✓</span> Feature + Interview</li>
                <li><span className="check">✓</span> Website Publication</li>
                <li><span className="check">✓</span> 2 Social Media Promotions</li>
                <li><span className="check">✓</span> Brand / Product Spotlight</li>
              </ul>
              <button className="plan-cta" onClick={() => handlePlanSelect('Growth')}>Get started</button>
            </article>

            {/* PREMIUM */}
            <article className="plan">
              <span className="plan-tier">Premium</span>
              <h3>Get Maximum Exposure</h3>
              <p className="tagline">KES 10,000</p>
              <div className="plan-price">
                <span className="amount">10,000</span>
                <span className="currency">KES</span>
              </div>
              <ul className="plan-features">
                <li><span className="check">✓</span> Full Feature + Interview</li>
                <li><span className="check">✓</span> Website Banner</li>
                <li><span className="check">✓</span> Social Media Campaign</li>
                <li><span className="check">✓</span> Brand / Event Promotion</li>
                <li><span className="check">✓</span> Customized Content</li>
              </ul>
              <button className="plan-cta outline" onClick={() => handlePlanSelect('Premium')}>Get started</button>
            </article>
          </div>

          {/* WHAT'S INCLUDED */}
          <div className="included">
            <div className="eyebrow" style={{ color: '#888' }}>What's included</div>
            <h2>Every package comes with the essentials.</h2>
            <p>No hidden costs, no upsells. Here's what you can always expect when you work with Trendorabay.</p>

            <div className="included-grid">
              <div className="included-item">
                <strong>Editorial quality</strong>
                <span>Every feature is written and edited by our in-house team.</span>
              </div>
              <div className="included-item">
                <strong>Live publishing</strong>
                <span>Your content goes live within 5–7 business days.</span>
              </div>
              <div className="included-item">
                <strong>Social amplification</strong>
                <span>Published across our Instagram, X, and TikTok channels.</span>
              </div>
              <div className="included-item">
                <strong>Performance report</strong>
                <span>Reach and engagement report delivered after publishing.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">FAQ</div>
            <h2>Questions, answered.</h2>
            <p>Everything you need to know about featuring on Trendorabay.</p>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${openFaq === index ? 'open' : ''}`}>
                <button className="faq-q" onClick={() => toggleFaq(index)}>
                  {faq.q}
                  <span className="icon">+</span>
                </button>
                <div className="faq-a">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="section" id="contact" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-banner">
            <div>
              <div className="eyebrow" style={{ color: '#aaa' }}>Get featured</div>
              <h2>Ready to get your brand in front of 85,000+ readers?</h2>
              <p>Tell us which package you're interested in and we'll get back to you within 24 hours with next steps.</p>
            </div>
            <button className="white-btn" onClick={() => showToast('Opening contact form')}>Get in touch →</button>
          </div>
        </div>
      </section>

      {/* TOAST */}
      <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.message}</div>
    </main>
  );
};

export default SubscribePage;
