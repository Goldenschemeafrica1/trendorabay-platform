import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdvertisePage.css';

const AdvertisePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    budget: '',
    campaignType: '',
    message: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    if (!formData.campaignType) newErrors.campaignType = 'Campaign type is required';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';
    
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
    } catch (error) {
      setErrors({ general: 'Submission failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="advertise-page">
        <div className="advertise-container">
          <div className="success-message">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h1>Thank You!</h1>
            <p>Your advertising inquiry has been submitted successfully. Our team will contact you within 24-48 hours.</p>
            <Link to="/" className="back-home-btn">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="advertise-page">
      <div className="advertise-container">
        <div className="advertise-header">
          <h1>Advertise with Trendorabay</h1>
          <p>Reach our engaged audience of African culture enthusiasts, storytellers, and creative minds</p>
        </div>

        <div className="advertise-content">
          <div className="advertise-info">
            <div className="info-section">
              <h2>Why Advertise With Us?</h2>
              <div className="benefits-grid">
                <div className="benefit-card">
                  <i className="fas fa-users"></i>
                  <h3>Targeted Audience</h3>
                  <p>Connect with thousands of engaged readers passionate about African culture and storytelling</p>
                </div>
                <div className="benefit-card">
                  <i className="fas fa-chart-line"></i>
                  <h3>High Engagement</h3>
                  <p>Our audience actively interacts with content, providing better visibility for your brand</p>
                </div>
                <div className="benefit-card">
                  <i className="fas fa-globe"></i>
                  <h3>Global Reach</h3>
                  <p>Access a diverse, international audience interested in African perspectives and stories</p>
                </div>
                <div className="benefit-card">
                  <i className="fas fa-palette"></i>
                  <h3>Creative Integration</h3>
                  <p>Seamlessly integrate your brand with authentic content that resonates with our readers</p>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h2>Advertising Opportunities</h2>
              <div className="opportunities-list">
                <div className="opportunity-item">
                  <h3>Display Ads</h3>
                  <p>Premium banner placements on our website and magazine pages</p>
                </div>
                <div className="opportunity-item">
                  <h3>Sponsored Content</h3>
                  <p>Branded articles and stories that align with our editorial standards</p>
                </div>
                <div className="opportunity-item">
                  <h3>Newsletter Sponsorship</h3>
                  <p>Reach our subscribers directly through our weekly newsletter</p>
                </div>
                <div className="opportunity-item">
                  <h3>Social Media Campaigns</h3>
                  <p>Promoted content across our social media platforms</p>
                </div>
                <div className="opportunity-item">
                  <h3>Event Sponsorship</h3>
                  <p>Brand visibility at our community events and workshops</p>
                </div>
              </div>
            </div>
          </div>

          <div className="advertise-form-section">
            <div className="form-container">
              <h2>Get Started</h2>
              <p>Fill out the form below and our advertising team will get in touch with you</p>
              
              {errors.general && (
                <div className="error-message general-error">
                  {errors.general}
                </div>
              )}

              <form className="advertise-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? 'error' : ''}
                      placeholder="Your full name"
                      disabled={isLoading}
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="company">Company Name *</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className={errors.company ? 'error' : ''}
                      placeholder="Your company name"
                      disabled={isLoading}
                    />
                    {errors.company && <span className="error-text">{errors.company}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? 'error' : ''}
                      placeholder="your@email.com"
                      disabled={isLoading}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="budget">Monthly Budget *</label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className={errors.budget ? 'error' : ''}
                      disabled={isLoading}
                    >
                      <option value="">Select budget range</option>
                      <option value="500-1000">$500 - $1,000</option>
                      <option value="1000-2500">$1,000 - $2,500</option>
                      <option value="2500-5000">$2,500 - $5,000</option>
                      <option value="5000-10000">$5,000 - $10,000</option>
                      <option value="10000+">$10,000+</option>
                    </select>
                    {errors.budget && <span className="error-text">{errors.budget}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="campaignType">Campaign Type *</label>
                    <select
                      id="campaignType"
                      name="campaignType"
                      value={formData.campaignType}
                      onChange={handleChange}
                      className={errors.campaignType ? 'error' : ''}
                      disabled={isLoading}
                    >
                      <option value="">Select campaign type</option>
                      <option value="display">Display Ads</option>
                      <option value="sponsored">Sponsored Content</option>
                      <option value="newsletter">Newsletter</option>
                      <option value="social">Social Media</option>
                      <option value="events">Event Sponsorship</option>
                      <option value="multiple">Multiple/Custom</option>
                    </select>
                    {errors.campaignType && <span className="error-text">{errors.campaignType}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Additional Information</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your campaign goals, target audience, or any specific requirements..."
                    rows="4"
                    disabled={isLoading}
                  ></textarea>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <span className="checkmark"></span>
                    I agree to be contacted by Trendorabay's advertising team and understand that my information will be used to respond to my inquiry.
                  </label>
                  {errors.agreeToTerms && <span className="error-text">{errors.agreeToTerms}</span>}
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="back-to-home">
          <Link to="/">
            <i className="fas fa-arrow-left"></i>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdvertisePage;
