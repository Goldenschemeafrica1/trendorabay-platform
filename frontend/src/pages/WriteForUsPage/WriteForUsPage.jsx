import React, { useState } from 'react';
import './WriteForUsPage.css';

const WriteForUsPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    topic: '',
    pitchTitle: '',
    pitchDescription: '',
    articleAttachment: null,
    authorBio: '',
    socialMedia: {
      twitter: '',
      instagram: '',
      linkedin: '',
      website: ''
    },
    topicsOfInterest: [],
    previousPublications: '',
    experience: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('pitch');

  const topicsOptions = [
    'Startups & Entrepreneurship',
    'Technology & Innovation',
    'Fashion & Style',
    'Music & Entertainment',
    'Art & Photography',
    'Lifestyle & Wellness',
    'Culture & Trends',
    'Impact Stories',
    'Real Estate',
    'Investment & Funding'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleTopicToggle = (topic) => {
    const updatedTopics = formData.topicsOfInterest.includes(topic)
      ? formData.topicsOfInterest.filter(t => t !== topic)
      : [...formData.topicsOfInterest, topic];
    
    setFormData({ ...formData, topicsOfInterest: updatedTopics });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.pitchTitle.trim()) {
      newErrors.pitchTitle = 'Pitch title is required';
    }
    
    if (!formData.pitchDescription.trim()) {
      newErrors.pitchDescription = 'Please describe your article idea';
    } else if (formData.pitchDescription.length < 100) {
      newErrors.pitchDescription = 'Please provide at least 100 characters describing your article';
    }
    
    if (!formData.authorBio.trim()) {
      newErrors.authorBio = 'Author bio is required';
    } else if (formData.authorBio.length < 50) {
      newErrors.authorBio = 'Please provide at least 50 characters for your bio';
    }
    
    if (formData.topicsOfInterest.length === 0) {
      newErrors.topicsOfInterest = 'Please select at least one topic of interest';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          topic: '',
          pitchTitle: '',
          pitchDescription: '',
          articleAttachment: null,
          authorBio: '',
          socialMedia: {
            twitter: '',
            instagram: '',
            linkedin: '',
            website: ''
          },
          topicsOfInterest: [],
          previousPublications: '',
          experience: '',
          agreeToTerms: false
        });
        setSubmitSuccess(false);
        setActiveTab('pitch');
      }, 3000);
    }, 1500);
  };

  // Guidelines content
  const guidelines = [
    {
      title: "Content Focus",
      items: [
        "Original, unpublished content only",
        "Focus on African innovation, culture, and business",
        "Word count: 800-2000 words for articles",
        "Include data, examples, and authentic stories"
      ]
    },
    {
      title: "Quality Standards",
      items: [
        "Well-researched and fact-checked content",
        "Clear, engaging, and professional writing",
        "Proper attribution of sources",
        "Original images or properly licensed media"
      ]
    },
    {
      title: "What We Look For",
      items: [
        "Unique perspectives on African trends",
        "Actionable insights for entrepreneurs",
        "Impact-driven storytelling",
        "Cultural relevance and authenticity"
      ]
    },
    {
      title: "Benefits",
      items: [
        "Reach 50,000+ monthly readers",
        "Build your writer portfolio",
        "Network with industry leaders",
        "Monetization opportunities for regular contributors"
      ]
    }
  ];

  if (submitSuccess) {
    return (
      <div className="write-for-us-success">
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h1>Pitch Submitted Successfully!</h1>
          <p>Thank you for your interest in writing for Trendorabay Magazine.</p>
          <p>Our editorial team will review your pitch and get back to you within 5-7 business days.</p>
          <div className="success-details">
            <h3>What happens next?</h3>
            <ul>
              <li>📧 You'll receive a confirmation email shortly</li>
              <li>👥 Our editors will review your pitch</li>
              <li>💬 We may reach out with feedback or questions</li>
              <li>🎉 If selected, we'll guide you through the writing process</li>
            </ul>
          </div>
          <button 
            className="submit-another-btn"
            onClick={() => setSubmitSuccess(false)}
          >
            Submit Another Pitch
          </button>
          <a href="/" className="home-link">← Back to Homepage</a>
        </div>
      </div>
    );
  }

  return (
    <div className="write-for-us-page">

      <div className="write-container">
        {/* Intro Section */}
        <div className="write-intro">
          <h2>Join Our Contributor Community</h2>
          <p>
            Trendorabay Magazine is always looking for passionate writers, industry experts, 
            and creative storytellers to contribute to our platform. Whether you're an 
            entrepreneur, journalist, creative, or thought leader, we want to hear your 
            unique perspective on African business, culture, and innovation.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="write-layout">
          {/* Guidelines Sidebar */}
          <aside className="write-guidelines">
            <div className="guidelines-card">
              <h3>📝 Submission Guidelines</h3>
              {guidelines.map((section, idx) => (
                <div key={idx} className="guideline-section">
                  <h4>{section.title}</h4>
                  <ul>
                    {section.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
              
              <div className="guidelines-note">
                <h4>✨ Pro Tip</h4>
                <p>
                  Pitches that include a clear angle, target audience, and why this story 
                  matters to our readers are more likely to be accepted.
                </p>
              </div>
            </div>

            <div className="contact-card">
              <h4>Questions?</h4>
              <p>
                Have questions about contributing? Reach out to our editorial team at
              </p>
              <a href="mailto:contributors@trendorabay.com">contributors@trendorabay.com</a>
            </div>
          </aside>

          {/* Submission Form */}
          <form className="write-form" onSubmit={handleSubmit}>
            <div className="form-tabs">
              <button
                type="button"
                className={`tab-btn ${activeTab === 'pitch' ? 'active' : ''}`}
                onClick={() => setActiveTab('pitch')}
              >
                Pitch Your Idea
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                About You
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'pitch' && (
                <div className="pitch-tab">
                  <div className="form-group">
                    <label htmlFor="pitchTitle">Pitch Title *</label>
                    <input
                      type="text"
                      id="pitchTitle"
                      name="pitchTitle"
                      value={formData.pitchTitle}
                      onChange={handleInputChange}
                      placeholder="e.g., How Kenyan Fintech Startups Are Revolutionizing Mobile Banking"
                      className={errors.pitchTitle ? 'error' : ''}
                    />
                    {errors.pitchTitle && <span className="error-message">{errors.pitchTitle}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="pitchDescription">Article Description / Pitch *</label>
                    <textarea
                      id="pitchDescription"
                      name="pitchDescription"
                      rows="6"
                      value={formData.pitchDescription}
                      onChange={handleInputChange}
                      placeholder="Describe your article idea in detail. What's the angle? Why should our readers care? Include key points, sources, or unique insights you plan to cover."
                      className={errors.pitchDescription ? 'error' : ''}
                    ></textarea>
                    <div className="char-counter">
                      {formData.pitchDescription.length} / 100 characters minimum
                    </div>
                    {errors.pitchDescription && <span className="error-message">{errors.pitchDescription}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="topic">Primary Topic Category *</label>
                      <select
                        id="topic"
                        name="topic"
                        value={formData.topic}
                        onChange={handleInputChange}
                      >
                        <option value="">Select a category</option>
                        {topicsOptions.map(topic => (
                          <option key={topic} value={topic}>{topic}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="articleAttachment">Article Attachment (Optional)</label>
                      <input
                        type="file"
                        id="articleAttachment"
                        name="articleAttachment"
                        accept=".doc,.docx,.pdf,.txt"
                        onChange={handleInputChange}
                      />
                      <small>Accepted formats: .doc, .docx, .pdf, .txt (Max 10MB)</small>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Topics of Interest *</label>
                    <div className="topics-grid">
                      {topicsOptions.map(topic => (
                        <button
                          type="button"
                          key={topic}
                          className={`topic-chip ${formData.topicsOfInterest.includes(topic) ? 'active' : ''}`}
                          onClick={() => handleTopicToggle(topic)}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                    {errors.topicsOfInterest && <span className="error-message">{errors.topicsOfInterest}</span>}
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div className="about-tab">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fullName">Full Name *</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={errors.fullName ? 'error' : ''}
                      />
                      {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? 'error' : ''}
                      />
                      {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Optional, for quick contact"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="authorBio">Author Bio *</label>
                    <textarea
                      id="authorBio"
                      name="authorBio"
                      rows="4"
                      value={formData.authorBio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself. Your expertise, writing experience, and why you're passionate about contributing to Trendorabay."
                      className={errors.authorBio ? 'error' : ''}
                    ></textarea>
                    <div className="char-counter">
                      {formData.authorBio.length} / 50 characters minimum
                    </div>
                    {errors.authorBio && <span className="error-message">{errors.authorBio}</span>}
                  </div>

                  <div className="form-group">
                    <label>Social Media & Portfolio</label>
                    <div className="social-inputs">
                      <input
                        type="text"
                        name="socialMedia.twitter"
                        placeholder="Twitter handle (e.g., @username)"
                        value={formData.socialMedia.twitter}
                        onChange={handleInputChange}
                      />
                      <input
                        type="text"
                        name="socialMedia.instagram"
                        placeholder="Instagram handle"
                        value={formData.socialMedia.instagram}
                        onChange={handleInputChange}
                      />
                      <input
                        type="text"
                        name="socialMedia.linkedin"
                        placeholder="LinkedIn URL"
                        value={formData.socialMedia.linkedin}
                        onChange={handleInputChange}
                      />
                      <input
                        type="url"
                        name="socialMedia.website"
                        placeholder="Personal website or portfolio"
                        value={formData.socialMedia.website}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="previousPublications">Previous Publications / Writing Samples</label>
                    <textarea
                      id="previousPublications"
                      name="previousPublications"
                      rows="3"
                      value={formData.previousPublications}
                      onChange={handleInputChange}
                      placeholder="Share links to your previously published work (if any)"
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="experience">Writing Experience</label>
                    <textarea
                      id="experience"
                      name="experience"
                      rows="3"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="Tell us about your writing experience, including any relevant publications, blogs, or content you've created"
                    ></textarea>
                  </div>
                </div>
              )}
            </div>

            <div className="form-footer">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                />
                <span>
                  I confirm that my submission is original and I agree to the 
                  <a href="/terms" target="_blank"> Terms & Conditions</a> and 
                  <a href="/privacy" target="_blank"> Privacy Policy</a> *
                </span>
              </label>
              {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}

              <button 
                type="submit" 
                className="submit-pitch-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Your Pitch'}
              </button>
            </div>
          </form>
        </div>

        {/* Testimonials Section */}
        <div className="testimonials-section">
          <h2>What Our Contributors Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="testimonial-quote">
                "Writing for Trendorabay has been an incredible experience. The editorial team 
                is supportive and my articles reached thousands of readers across Africa."
              </p>
              <div className="testimonial-author">
                <strong>Amara Okonkwo</strong>
                <span>Freelance Journalist, Lagos</span>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-quote">
                "Trendorabay gave me a platform to share my startup journey. The exposure 
                led to speaking opportunities and valuable connections."
              </p>
              <div className="testimonial-author">
                <strong>James Mwangi</strong>
                <span>Founder, LipaLater</span>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-quote">
                "As a creative writer, having my work featured on Trendorabay opened doors 
                to collaborations with brands and other creators."
              </p>
              <div className="testimonial-author">
                <strong>Zuri Makena</strong>
                <span>Creative Writer, Nairobi</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Do you pay contributors?</h4>
              <p>Yes! We offer competitive rates for accepted articles. Payment varies based on article length, depth, and exclusivity. Freelance rates start at $50 per article.</p>
            </div>
            <div className="faq-item">
              <h4>How long does the review process take?</h4>
              <p>Our editorial team typically reviews pitches within 5-7 business days. You'll receive a response regardless of whether your pitch is accepted.</p>
            </div>
            <div className="faq-item">
              <h4>Can I submit previously published work?</h4>
              <p>We only accept original, unpublished content. All submissions must be exclusive to Trendorabay Magazine.</p>
            </div>
            <div className="faq-item">
              <h4>What if my pitch is rejected?</h4>
              <p>We provide constructive feedback whenever possible. You're welcome to revise and resubmit based on our suggestions or pitch a different topic.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteForUsPage;