import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import './WritersPage.css';

const WritersPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    location: '',
    shortBio: '',
    areasOfInterest: [],
    writingExperience: '',
    portfolioUrl: '',
    writingSampleUrl: '',
    socialMediaLinks: {
      twitter: '',
      instagram: '',
      linkedin: '',
      website: ''
    },
    whyWriteForTrendorabay: '',
    agreeToGuidelines: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const areasOfInterestOptions = [
    'Fashion', 'Art', 'Agriculture', 'Food & Nutrition', 'Music', 'Beauty',
    'Technology', 'Business', 'Culture', 'Lifestyle', 'Home', 'Accessories'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('[')) {
      const match = name.match(/(\w+)\[(\w+)\]/);
      if (match) {
        const [parent, child] = match.slice(1);
        setFormData({
          ...formData,
          socialMediaLinks: {
            ...formData.socialMediaLinks,
            [child]: value
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleAreaToggle = (area) => {
    const updatedAreas = formData.areasOfInterest.includes(area)
      ? formData.areasOfInterest.filter(a => a !== area)
      : [...formData.areasOfInterest, area];
    setFormData({ ...formData, areasOfInterest: updatedAreas });
  };

  const handleFaqToggle = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!formData.agreeToGuidelines) {
      toast.error('Please agree to the writer guidelines');
      return;
    }

    if (formData.areasOfInterest.length === 0) {
      toast.error('Please select at least one area of interest');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post('/write-applications', {
        ...formData,
        status: 'pending'
      });

      if (response.data.success) {
        toast.success('Application received. We\'ll be in touch soon.');
        setFormData({
          fullName: '',
          email: '',
          phoneNumber: '',
          location: '',
          shortBio: '',
          areasOfInterest: [],
          writingExperience: '',
          portfolioUrl: '',
          writingSampleUrl: '',
          socialMediaLinks: { twitter: '', instagram: '', linkedin: '', website: '' },
          whyWriteForTrendorabay: '',
          agreeToGuidelines: false
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const faqs = [
    {
      q: 'Do you pay writers?',
      a: 'Yes. We pay for every piece we commission. Rates are agreed upfront before you write and payment is made within 14 days of publication. We do not accept unpaid contributions.'
    },
    {
      q: 'Do I need to have published work?',
      a: 'Not necessarily. If you\'re a new writer, we\'re happy to look at unpublished samples, a personal blog, a Substack, or a strong first-person pitch that shows your voice.'
    },
    {
      q: 'How long should pieces be?',
      a: 'It depends on the format. Feature pieces are typically 1,500–3,000 words. Profiles and interviews usually 1,200–2,000. Essays and opinion 800–1,500. Photo essays vary.'
    },
    {
      q: 'How long does the process take?',
      a: 'From pitch to publication is usually 2–4 weeks. We respond to all pitches within 5 working days, then work with you through writing and two rounds of editing before the piece goes live.'
    },
    {
      q: 'Can I write in a language other than English?',
      a: 'Currently we publish in English, but we\'re exploring other languages. If you write in French, Swahili, Portuguese or Arabic and want to pitch, get in touch — we\'d love to hear from you.'
    },
    {
      q: 'Do you accept previously published pieces?',
      a: 'We commission original work. Occasionally we republish with permission, but this is rare and always with full credit and payment. Mention it in your pitch if you\'d like us to consider.'
    }
  ];

  return (
    <div className="writers-page">
      <main>
        {/* HERO */}
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <div className="eyebrow">Become a Writer</div>
              <h1>Tell the stories <em>Africa needs to hear.</em></h1>
              <p>Trendorabay is always looking for writers, journalists, essayists, and storytellers who can help us document the people, brands and ideas shaping tomorrow's African narrative.</p>
              <div className="hero-cta">
                <button className="dark-btn" onClick={() => scrollToSection('apply')}>Apply to write</button>
                <button className="light-btn" onClick={() => scrollToSection('perks')}>What you get</button>
              </div>
            </div>
            <div className="hero-art">
              <div className="tile ta"><img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=700&q=85" alt="Writer at work" /></div>
              <div className="tile tb"><img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=85" alt="Magazine" /></div>
              <div className="tile tc"><img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=85" alt="Notebook" /></div>
            </div>
          </div>
        </section>

        {/* WHY WRITE */}
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div className="eyebrow">Why write for us</div>
              <h2>A platform built for good storytelling.</h2>
              <p>We care about the writing, the reporting and the people behind the stories — not clicks or virality.</p>
            </div>
            <div className="why-grid">
              <div className="why-card">
                <div className="num">01</div>
                <h3>Real editorial support</h3>
                <p>Every piece goes through a proper edit. You'll work with experienced editors who help you sharpen the angle, structure and language.</p>
              </div>
              <div className="why-card">
                <div className="num">02</div>
                <h3>Paid, always</h3>
                <p>We pay for every piece we publish. No free labour, no exposure-only. Rates are agreed upfront and paid on publication.</p>
              </div>
              <div className="why-card">
                <div className="num">03</div>
                <h3>Reach across Africa</h3>
                <p>Your work reaches over 85,000 readers across 54 countries, and is shared across our social channels and newsletters.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PERKS */}
        <section className="section" id="perks" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="perks">
              <div className="eyebrow" style={{ color: '#888' }}>What you get</div>
              <h2 style={{ color: '#fff' }}>More than just a name.</h2>
              <p>We're building a long-term relationship with our writers — not a one-off transaction.</p>

              <div className="perks-grid">
                <div className="perk">
                  <div className="num">01</div>
                  <strong>Competitive rates</strong>
                  <span>Paid per piece, with rates agreed upfront based on length and reporting needs.</span>
                </div>
                <div className="perk">
                  <div className="num">02</div>
                  <strong>Your own profile</strong>
                  <span>A public author page on Trendorabay with your bio, photo and every piece you've written.</span>
                </div>
                <div className="perk">
                  <div className="num">03</div>
                  <strong>Distribution across Africa</strong>
                  <span>Your work is distributed across our entire community platform — the magazine, newsletter, social channels, and every community space within Trendorabay.</span>
                </div>
                <div className="perk">
                  <div className="num">04</div>
                  <strong>Access to the network</strong>
                  <span>Invitations to Trendorabay events, workshops and community gatherings across the continent.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* APPLICATION FORM */}
        <section className="section apply" id="apply">
          <div className="container">
            <div className="section-head">
              <div className="eyebrow">Apply</div>
              <h2>Become a Trendorabay writer.</h2>
              <p>Fill out the form below. If we think there's a fit, we'll reach out within 5 working days.</p>
            </div>

            <form className="form-card" onSubmit={handleSubmit}>

              {/* SECTION 1: Personal details */}
              <div className="form-section-title">Personal details</div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="fullName">Full name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    placeholder="Your name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="phoneNumber">Phone number</label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    placeholder="+254 ..."
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="field">
                  <label htmlFor="location">Location</label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="shortBio">Short bio</label>
                <textarea
                  id="shortBio"
                  name="shortBio"
                  required
                  placeholder="A short introduction about yourself (max 300 characters)."
                  maxLength={300}
                  value={formData.shortBio}
                  onChange={handleInputChange}
                />
                <span className="hint">Max 300 characters.</span>
              </div>

              {/* SECTION 2: Writing background */}
              <div className="form-section-title">Writing background</div>

              <div className="field">
                <label>Areas of interest</label>
                <div className="checkbox-group">
                  {areasOfInterestOptions.map((area) => (
                    <label
                      key={area}
                      className={`checkbox-pill ${formData.areasOfInterest.includes(area) ? 'checked' : ''}`}
                    >
                      <input
                        type="checkbox"
                        name="areasOfInterest"
                        value={area}
                        checked={formData.areasOfInterest.includes(area)}
                        onChange={() => handleAreaToggle(area)}
                      />
                      {area}
                    </label>
                  ))}
                </div>
                <span className="hint">Select as many as you like.</span>
              </div>

              <div className="field">
                <label htmlFor="writingExperience">Writing experience</label>
                <textarea
                  id="writingExperience"
                  name="writingExperience"
                  required
                  placeholder="Tell us about your writing background — publications, years of experience, notable pieces, etc."
                  value={formData.writingExperience}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="portfolioUrl">Portfolio URL</label>
                  <input
                    id="portfolioUrl"
                    name="portfolioUrl"
                    type="url"
                    placeholder="https://yourportfolio.com"
                    value={formData.portfolioUrl}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="field">
                  <label htmlFor="writingSampleUrl">Writing sample URL</label>
                  <input
                    id="writingSampleUrl"
                    name="writingSampleUrl"
                    type="url"
                    required
                    placeholder="https://link-to-a-sample-piece"
                    value={formData.writingSampleUrl}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* SECTION 3: Online presence */}
              <div className="form-section-title">Online presence</div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="social_twitter">Twitter / X <span className="optional">(optional)</span></label>
                  <input
                    id="social_twitter"
                    name="socialMediaLinks[twitter]"
                    type="url"
                    placeholder="https://x.com/yourhandle"
                    value={formData.socialMediaLinks.twitter}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="field">
                  <label htmlFor="social_instagram">Instagram <span className="optional">(optional)</span></label>
                  <input
                    id="social_instagram"
                    name="socialMediaLinks[instagram]"
                    type="url"
                    placeholder="https://instagram.com/yourhandle"
                    value={formData.socialMediaLinks.instagram}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="social_linkedin">LinkedIn <span className="optional">(optional)</span></label>
                  <input
                    id="social_linkedin"
                    name="socialMediaLinks[linkedin]"
                    type="url"
                    placeholder="https://linkedin.com/in/yourhandle"
                    value={formData.socialMediaLinks.linkedin}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="field">
                  <label htmlFor="social_website">Personal website <span className="optional">(optional)</span></label>
                  <input
                    id="social_website"
                    name="socialMediaLinks[website]"
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={formData.socialMediaLinks.website}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* SECTION 4: Motivation */}
              <div className="form-section-title">Your pitch</div>

              <div className="field">
                <label htmlFor="whyWriteForTrendorabay">Why write for Trendorabay?</label>
                <textarea
                  id="whyWriteForTrendorabay"
                  name="whyWriteForTrendorabay"
                  required
                  placeholder="Tell us why you want to write for Trendorabay and what you'd bring to the platform (max 500 characters)."
                  maxLength={500}
                  value={formData.whyWriteForTrendorabay}
                  onChange={handleInputChange}
                />
                <span className="hint">Max 500 characters. Be specific — we read every application.</span>
              </div>

              {/* SECTION 5: Agreement */}
              <div className="form-section-title">Agreement</div>

              <label className="agreement">
                <input
                  type="checkbox"
                  id="agreeToGuidelines"
                  name="agreeToGuidelines"
                  required
                  checked={formData.agreeToGuidelines}
                  onChange={handleInputChange}
                />
                <span>I confirm the information above is accurate and I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Trendorabay Writer Guidelines</a>.</span>
              </label>

              <button className="form-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit application'}
              </button>

              <p className="form-note">We review every application personally. Expect to hear from us within 5 working days.</p>
            </form>
          </div>
        </section>

        {/* FAQ */}
        <section className="section faq">
          <div className="container">
            <div className="section-head">
              <div className="eyebrow">FAQ</div>
              <h2>Questions, answered.</h2>
              <p>Everything you need to know before applying.</p>
            </div>

            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div key={index} className={`faq-item ${openFaq === index ? 'open' : ''}`}>
                  <button className="faq-q" onClick={() => handleFaqToggle(index)}>
                    {faq.q}
                    <span className="icon">{openFaq === index ? '×' : '+'}</span>
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
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="cta-banner">
              <div>
                <div className="eyebrow" style={{ color: '#aaa' }}>Ready to write?</div>
                <h2>Add your voice to Africa's most exciting story.</h2>
                <p>Send us a pitch, share a sample, and let's see what we can build together.</p>
              </div>
              <button className="white-btn" onClick={() => scrollToSection('apply')}>Apply now →</button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default WritersPage;
