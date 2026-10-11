import React, { useState } from 'react';
import partnerService from '../../services/partnerService';
import './PartnerPage.css';

const PartnerPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    type: '',
    budget: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await partnerService.submitProposal({
        companyName: formData.company,
        contactPerson: formData.name,
        email: formData.email,
        phone: formData.phone,
        partnershipType: formData.type,
        message: formData.message
      });

      setShowToast(true);
      setTimeout(() => setShowToast(false), 2600);

      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        type: '',
        budget: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting proposal:', error);
      alert('Failed to submit proposal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="partners-page">
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">Partners</div>
            <h1>Let's build the future of <em>African creativity.</em></h1>
            <p>We partner with brands, organizations and institutions who believe in the power of African stories, creators and communities. Together, we can build something that lasts.</p>
            <div className="hero-cta">
              <button className="dark-btn" onClick={() => scrollToSection('contact')}>Become a partner</button>
              <button className="light-btn" onClick={() => scrollToSection('types')}>Partnership types</button>
            </div>
          </div>
          <div className="hero-art">
            <div className="tile ta"><img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=700&q=85" alt="Partnership" /></div>
            <div className="tile tb"><img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=85" alt="Team" /></div>
            <div className="tile tc"><img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=85" alt="Collaboration" /></div>
          </div>
        </div>
      </section>

      {/* PARTNER LOGOS */}
      <section className="section logos-section">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Trusted by</div>
            <h2>Brands we work with.</h2>
            <p>Forward-thinking brands partnering with Trendorabay to support African creativity and storytelling.</p>
          </div>
          <div className="logos-grid">
            <div className="logo-card"><span>Lagos Creative</span></div>
            <div className="logo-card"><span>Nairobi Fintech</span></div>
            <div className="logo-card"><span>Accra Studios</span></div>
            <div className="logo-card"><span>Cape Union</span></div>
            <div className="logo-card"><span>Kigali Coffee</span></div>
            <div className="logo-card"><span>Dakar Design</span></div>
            <div className="logo-card"><span>Addis Print</span></div>
            <div className="logo-card"><span>Zanzibar Goods</span></div>
            <div className="logo-card"><span>Mombasa Textiles</span></div>
            <div className="logo-card"><span>Kampala Foods</span></div>
          </div>
        </div>
      </section>

      {/* PARTNERSHIP TYPES */}
      <section className="section" id="types">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Ways to partner</div>
            <h2>Choose how you'd like to work with us.</h2>
            <p>From content collaborations to strategic partnerships — every partnership is built around your goals.</p>
          </div>
          <div className="types-grid">
            <article className="type-card">
              <div className="num">01</div>
              <h3>Content & Editorial</h3>
              <p>Co-create features, interviews and branded content with our editorial team.</p>
              <ul>
                <li>Sponsored magazine features</li>
                <li>Branded interviews & profiles</li>
                <li>Editorial collaborations</li>
                <li>Native advertising placements</li>
              </ul>
            </article>

            <article className="type-card">
              <div className="num">02</div>
              <h3>Community & Events</h3>
              <p>Reach our community in person through events, meetups and activations.</p>
              <ul>
                <li>Event co-hosting & sponsorship</li>
                <li>Community meetups</li>
                <li>Panels & workshops</li>
                <li>Pop-up activations</li>
              </ul>
            </article>

            <article className="type-card">
              <div className="num">03</div>
              <h3>Strategic Partnerships</h3>
              <p>Long-term collaborations aligned with our mission of amplifying African creativity.</p>
              <ul>
                <li>Annual partnerships</li>
                <li>Creator grant programs</li>
                <li>Joint initiatives</li>
                <li>Co-branded campaigns</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* WHY PARTNER */}
      <section className="section why">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Why partner with us</div>
            <h2>What you get when you work with Trendorabay.</h2>
            <p>A curated audience, real community engagement and a partnership built on quality.</p>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <h3>Curated audience</h3>
              <p>Reach creators, founders, marketers and culture-shapers actively shaping Africa's creative scene.</p>
            </div>
            <div className="why-card">
              <h3>Deep engagement</h3>
              <p>Our readers don't just scroll. They read, share and act — from fashion and tech to agriculture and music.</p>
            </div>
            <div className="why-card">
              <h3>Brand-safe environment</h3>
              <p>Every placement is hand-curated and sits alongside high-quality editorial. No clutter, no noise.</p>
            </div>
            <div className="why-card">
              <h3>Real reporting</h3>
              <p>Full performance reporting after every campaign — reach, engagement, clicks and conversion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="section" id="contact" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Get in touch</div>
            <h2>Let's talk about a partnership.</h2>
            <p>Tell us about your brand and what you'd like to achieve. Our partnerships team will get back to you within 48 hours.</p>
          </div>
          <form className="form-card" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="field">
                <label htmlFor="name">Your name</label>
                <input id="name" type="text" required placeholder="Jane Doe" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="field">
                <label htmlFor="company">Company / Organization</label>
                <input id="company" type="text" required placeholder="Acme Inc." value={formData.company} onChange={handleInputChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" required placeholder="jane@company.com" value={formData.email} onChange={handleInputChange} />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone (optional)</label>
                <input id="phone" type="tel" placeholder="+254 ..." value={formData.phone} onChange={handleInputChange} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="type">Partnership type</label>
              <select id="type" required value={formData.type} onChange={handleInputChange}>
                <option value="">Select a type</option>
                <option>Content & Editorial</option>
                <option>Community & Events</option>
                <option>Strategic Partnership</option>
                <option>Something else</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="budget">Budget range (optional)</label>
              <select id="budget" value={formData.budget} onChange={handleInputChange}>
                <option value="">Select a range</option>
                <option>Under KSh 100,000</option>
                <option>KSh 100,000 – 500,000</option>
                <option>KSh 500,000 – 2,000,000</option>
                <option>KSh 2,000,000+</option>
                <option>Not sure yet</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="message">Tell us about your goals</label>
              <textarea id="message" required placeholder="What are you hoping to achieve with this partnership?" value={formData.message} onChange={handleInputChange}></textarea>
            </div>
            <button className="form-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send enquiry'}
            </button>
          </form>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-banner">
            <div>
              <div className="eyebrow" style={{ color: '#aaa' }}>Ready to start?</div>
              <h2>Join the brands building Africa's creative future.</h2>
              <p>From a single campaign to an annual partnership — we'd love to hear what you're working on.</p>
            </div>
            <button className="white-btn" onClick={() => scrollToSection('contact')}>Get in touch →</button>
          </div>
        </div>
      </section>

      {/* TOAST */}
      <div className={`toast ${showToast ? 'show' : ''}`}>Thanks! We will be in touch within 48 hours.</div>
    </main>
  );
};

export default PartnerPage;
