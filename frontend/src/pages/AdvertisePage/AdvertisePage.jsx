import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import inquiryService from '../../services/inquiryService';
import './AdvertisePage.css';

const AdvertisePage = () => {
  const [toast, setToast] = useState({ show: false, message: '' });
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    budget: '',
    format: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 2600);
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFormats = () => {
    document.getElementById('formats')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.company) newErrors.company = 'Company name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.budget) newErrors.budget = 'Budget selection is required';
    if (!formData.message) newErrors.message = 'Message is required';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      await inquiryService.submitInquiry({
        name: formData.name,
        company: formData.company,
        email: formData.email,
        budget: formData.budget,
        campaignType: formData.format,
        message: formData.message
      });
      
      showToast('Thanks! We\'ll be in touch within 24 hours.');
      
      // Reset form after successful submission
      setFormData({
        name: '',
        company: '',
        email: '',
        budget: '',
        format: '',
        message: ''
      });
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Submission failed. Please try again.';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="advertise-page">
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">Advertise with Trendorabay</div>
            <h1>Reach Africa's <em>creative generation.</em></h1>
            <p>Put your brand in front of thousands of creators, entrepreneurs, and culture-shapers across the continent. From magazine features to community takeovers — we help you tell your story where it matters.</p>
            <div className="hero-cta">
              <button className="dark-btn" onClick={scrollToContact}>Get started</button>
              <button className="light-btn" onClick={scrollToFormats}>See ad formats</button>
            </div>
          </div>
          <div className="hero-art">
            <div className="tile ta"><img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=700&q=85" alt="Creative team" /></div>
            <div className="tile tb"><img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=85" alt="Strategy meeting" /></div>
            <div className="tile tc"><img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=85" alt="Creator" /></div>
          </div>
        </div>
      </section>

      {/* WHY ADVERTISE */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Why Trendorabay</div>
            <h2>An audience that moves culture.</h2>
            <p>Trendorabay reaches the people shaping Africa's next chapter — designers, founders, artists, farmers, musicians and storytellers.</p>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <h3>Highly engaged audience</h3>
              <p>Our readers don't just scroll. They read deeply, share widely, and act on what they discover — from fashion and tech to agriculture and music.</p>
            </div>
            <div className="why-card">
              <h3>Pan-African reach</h3>
              <p>We reach 54 countries across Africa and the diaspora, with a strong presence in Kenya, Nigeria, Ghana, South Africa and beyond.</p>
            </div>
            <div className="why-card">
              <h3>Brand-safe and curated</h3>
              <p>Every placement is hand-curated and sits alongside high-quality editorial. No clutter, no noise — just your brand in the right context.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AD FORMATS */}
      <section className="section formats" id="formats">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Formats</div>
            <h2>Ways to work with us.</h2>
            <p>From a single magazine feature to a full community takeover — choose the format that fits your goals.</p>
          </div>
          <div className="format-grid">
            <div className="format">
              <div className="format-info">
                <span className="tag">Editorial</span>
                <h3>Magazine Feature</h3>
                <p>Long-form sponsored features, interviews and branded content on our magazine — the most trusted space for African storytelling.</p>
                <div className="price">From KSh 35,000</div>
              </div>
            </div>
            <div className="format">
              <div className="format-info">
                <span className="tag">Social</span>
                <h3>Social Takeover</h3>
                <p>A full-day takeover of one of our social channels — Instagram, TikTok or X — with creative content curated around your brand.</p>
                <div className="price">From KSh 25,000</div>
              </div>
            </div>
            <div className="format">
              <div className="format-info">
                <span className="tag">Newsletter</span>
                <h3>Newsletter Spotlight</h3>
                <p>Featured placement in our weekly newsletter — one of the highest open-rate channels in African creative media.</p>
                <div className="price">From KSh 18,000</div>
              </div>
            </div>
            <div className="format">
              <div className="format-info">
                <span className="tag">Events</span>
                <h3>Event Partnership</h3>
                <p>Co-branded events, community meetups and panels. Reach our audience in person at cultural and creative gatherings across Africa.</p>
                <div className="price">Custom pricing</div>
              </div>
            </div>
            <div className="format">
              <div className="format-info">
                <span className="tag">Podcast</span>
                <h3>Podcast Sponsorship</h3>
                <p>Be the presenting sponsor of a full episode or a season of our podcast. Includes host-read mentions and show notes placement.</p>
                <div className="price">From KSh 30,000</div>
              </div>
            </div>
            <div className="format">
              <div className="format-info">
                <span className="tag">Custom</span>
                <h3>Custom Campaign</h3>
                <p>Something bigger in mind? We build bespoke campaigns across magazine, social, store and community — end to end.</p>
                <div className="price">Let's talk</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section process">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">How it works</div>
            <h2>Simple, fast, collaborative.</h2>
            <p>From first contact to live campaign in a matter of days — not weeks.</p>
          </div>
          <div className="process-grid">
            <div className="step">
              <div className="step-num">01</div>
              <h3>Get in touch</h3>
              <p>Tell us about your brand, goals and budget. We'll get back within 24 hours.</p>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <h3>Choose a format</h3>
              <p>We recommend the right mix of magazine, social, newsletter or events for your goals.</p>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <h3>Approve creative</h3>
              <p>We build the creative with you. You approve everything before it goes live.</p>
            </div>
            <div className="step">
              <div className="step-num">04</div>
              <h3>Launch & report</h3>
              <p>Campaign goes live with full performance reporting delivered to you after it ends.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="testimonial">
            <div className="eyebrow" style={{ color: '#888' }}>What partners say</div>
            <p className="quote">"Trendorabay put our brand in front of the exact audience we'd been trying to reach for years. Within two weeks we saw a 40% lift in qualified sign-ups from across Africa."</p>
            <div className="author">
              <strong>Sarah Mwangi</strong>
              Head of Marketing, Pan-African Fintech
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="section" id="contact" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Get in touch</div>
            <h2>Let's build something together.</h2>
            <p>Fill out the form below and our partnerships team will get back to you within 24 hours.</p>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="error-message general-error">
                {errors.general}
              </div>
            )}
            <div className="form-row">
              <div className="field">
                <label htmlFor="name">Your name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Jane Doe"
                  disabled={isLoading}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
              <div className="field">
                <label htmlFor="company">Company / Brand</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  placeholder="Acme Inc."
                  disabled={isLoading}
                />
                {errors.company && <span className="error-text">{errors.company}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="jane@company.com"
                  disabled={isLoading}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              <div className="field">
                <label htmlFor="budget">Budget range</label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                >
                  <option value="">Select a range</option>
                  <option>Under KSh 50,000</option>
                  <option>KSh 50,000 – 150,000</option>
                  <option>KSh 150,000 – 500,000</option>
                  <option>KSh 500,000+</option>
                  <option>Custom / Let's discuss</option>
                </select>
                {errors.budget && <span className="error-text">{errors.budget}</span>}
              </div>
            </div>
            <div className="field">
              <label htmlFor="format">Interested format</label>
              <select
                id="format"
                name="format"
                value={formData.format}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="">Any / Not sure yet</option>
                <option>Magazine Feature</option>
                <option>Social Takeover</option>
                <option>Newsletter Spotlight</option>
                <option>Event Partnership</option>
                <option>Podcast Sponsorship</option>
                <option>Custom Campaign</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="message">Tell us about your goals</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="What are you hoping to achieve with this campaign?"
                disabled={isLoading}
              ></textarea>
              {errors.message && <span className="error-text">{errors.message}</span>}
            </div>
            <button className="form-submit" type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send enquiry'}
            </button>
          </form>
        </div>
      </section>

      {/* TOAST */}
      <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.message}</div>
    </main>
  );
};

export default AdvertisePage;
