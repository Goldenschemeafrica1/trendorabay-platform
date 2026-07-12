import React, { useState } from 'react';
import partnerService from '../../services/partnerService';
import './PartnerPage.css';

const PartnerPage = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    partnershipType: '',
    message: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const partnershipTypes = [
    'Sponsorship',
    'Content Partnership',
    'Event Collaboration',
    'Advertising',
    'Affiliate Program',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.partnershipType) {
      newErrors.partnershipType = 'Please select a partnership type';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Please describe your partnership proposal';
    } else if (formData.message.length < 50) {
      newErrors.message = 'Please provide at least 50 characters for your proposal';
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
    
    try {
      await partnerService.submitProposal({
        companyName: formData.companyName,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        partnershipType: formData.partnershipType,
        message: formData.message
      });
      
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setShowSuccessPopup(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          partnershipType: '',
          message: '',
          agreeToTerms: false
        });
        setSubmitSuccess(false);
        setShowSuccessPopup(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting proposal:', error);
      setIsSubmitting(false);
      alert('Failed to submit proposal. Please try again.');
    }
  };

  return (
    <div className="partner-page">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#10B981',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: '9999',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'slideDown 0.3s ease-out'
        }}>
          <span style={{ fontSize: '20px' }}>✓</span>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Partnership Proposal Submitted!</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Our partnership team will review your proposal and get back to you within 5-7 business days.</div>
          </div>
        </div>
      )}

      <div className="partner-container">
        {/* Benefits Section */}
        <div className="benefits-section">
          <h2>Why Partner With Us?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <h3>Reach 50,000+ Readers</h3>
              <p>Connect with a highly engaged audience across Africa interested in business, culture, and innovation.</p>
            </div>
            <div className="benefit-card">
              <h3>Targeted Exposure</h3>
              <p>Reach specific demographics through our curated content categories and audience segments.</p>
            </div>
            <div className="benefit-card">
              <h3>Custom Collaborations</h3>
              <p>Work with our team to create unique partnerships that align with your brand objectives.</p>
            </div>
            <div className="benefit-card">
              <h3>Measurable Results</h3>
              <p>Track performance and ROI with comprehensive analytics and reporting.</p>
            </div>
          </div>
        </div>

        {/* Partnership Form */}
        <div className="partner-form-section">
          <h2>Submit Your Partnership Proposal</h2>
          <form className="partner-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="companyName">Company Name *</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Your company name"
                  className={errors.companyName ? 'error' : ''}
                />
                {errors.companyName && <span className="error-message">{errors.companyName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="contactPerson">Contact Person *</label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  placeholder="Full name"
                  className={errors.contactPerson ? 'error' : ''}
                />
                {errors.contactPerson && <span className="error-message">{errors.contactPerson}</span>}
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
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

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
              <label htmlFor="partnershipType">Partnership Type *</label>
              <select
                id="partnershipType"
                name="partnershipType"
                value={formData.partnershipType}
                onChange={handleInputChange}
                className={errors.partnershipType ? 'error' : ''}
              >
                <option value="">Select a partnership type</option>
                {partnershipTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.partnershipType && <span className="error-message">{errors.partnershipType}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Partnership Proposal *</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Describe your partnership proposal. What are your goals? What value can you bring? How do you envision this collaboration working?"
                className={errors.message ? 'error' : ''}
              ></textarea>
              <div className="char-counter">
                {formData.message.length} / 50 characters minimum
              </div>
              {errors.message && <span className="error-message">{errors.message}</span>}
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
                  I confirm that my submission is accurate and I agree to the 
                  <a href="/terms" target="_blank"> Terms & Conditions</a> and 
                  <a href="/privacy" target="_blank"> Privacy Policy</a> *
                </span>
              </label>
              {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PartnerPage;
