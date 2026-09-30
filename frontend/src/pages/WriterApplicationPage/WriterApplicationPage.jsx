import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './WriterApplicationPage.css';

const WriterApplicationPage = () => {
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    location: '',
    shortBio: '',
    areasOfInterest: [],
    writingExperience: '',
    portfolioUrl: '',
    socialMediaLinks: {
      twitter: '',
      instagram: '',
      linkedin: '',
      website: ''
    },
    writingSample: null,
    whyWriteForTrendorabay: '',
    cvResume: null,
    profilePhoto: null,
    agreeToGuidelines: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const areasOfInterestOptions = [
    'Business & Entrepreneurship',
    'Technology',
    'Fashion & Lifestyle',
    'Entertainment',
    'Sports',
    'Agriculture',
    'Finance',
    'Youth & Innovation',
    'Culture & Community',
    'Travel',
    'Food & Nutrition',
    'Education',
    'Creative Arts',
    'Impact Stories'
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

  const handleAreaToggle = (area) => {
    const updatedAreas = formData.areasOfInterest.includes(area)
      ? formData.areasOfInterest.filter(a => a !== area)
      : [...formData.areasOfInterest, area];
    
    setFormData({ ...formData, areasOfInterest: updatedAreas });
    
    // Clear error for areasOfInterest
    if (errors.areasOfInterest) {
      setErrors({ ...errors, areasOfInterest: '' });
    }
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
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.shortBio.trim()) {
      newErrors.shortBio = 'Short bio is required';
    } else if (formData.shortBio.length < 50) {
      newErrors.shortBio = 'Please provide at least 50 characters for your bio';
    }
    
    if (formData.areasOfInterest.length === 0) {
      newErrors.areasOfInterest = 'Please select at least one area of interest';
    }
    
    if (!formData.writingExperience.trim()) {
      newErrors.writingExperience = 'Writing experience is required';
    }
    
    if (!formData.whyWriteForTrendorabay.trim()) {
      newErrors.whyWriteForTrendorabay = 'Please explain why you want to write for Trendorabay';
    } else if (formData.whyWriteForTrendorabay.length < 100) {
      newErrors.whyWriteForTrendorabay = 'Please provide at least 100 characters';
    }
    
    if (!formData.agreeToGuidelines) {
      newErrors.agreeToGuidelines = 'You must agree to the Trendorabay Writer Guidelines';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for API submission
      const submissionData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        location: formData.location,
        shortBio: formData.shortBio,
        areasOfInterest: formData.areasOfInterest,
        writingExperience: formData.writingExperience,
        portfolioUrl: formData.portfolioUrl,
        socialMediaLinks: formData.socialMediaLinks,
        whyWriteForTrendorabay: formData.whyWriteForTrendorabay,
        agreeToGuidelines: formData.agreeToGuidelines
      };

      // Submit to API
      const response = await api.post('/write-applications', submissionData);
      
      if (response.data.success) {
        setShowSuccess(true);
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            fullName: '',
            email: '',
            phoneNumber: '',
            location: '',
            shortBio: '',
            areasOfInterest: [],
            writingExperience: '',
            portfolioUrl: '',
            socialMediaLinks: {
              twitter: '',
              instagram: '',
              linkedin: '',
              website: ''
            },
            writingSample: null,
            whyWriteForTrendorabay: '',
            cvResume: null,
            profilePhoto: null,
            agreeToGuidelines: false
          });
          setIsSubmitting(false);
          setShowSuccess(false);
          navigate('/writers');
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setIsSubmitting(false);
      alert('Failed to submit application. Please try again.');
    }
  };

  if (showSuccess) {
    return (
      <div className="writer-application-page">
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h2>Application Submitted Successfully!</h2>
          <p>Thank you for your interest in writing for Trendorabay. Our editorial team will review your application and get back to you within 7 working days.</p>
          <button onClick={() => navigate('/writers')} className="back-btn">
            Back to Writers Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="writer-application-page">
      <div className="container">
        <div className="form-header">
          <h1>Writer Application</h1>
          <p>Join our community of writers and storytellers shaping Africa's narrative.</p>
        </div>

        <form className="application-form" onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="form-section">
            <h2>Personal Information</h2>
            
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={errors.fullName ? 'error' : ''}
                placeholder="Enter your full name"
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="your@email.com"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+254 XXX XXX XXX"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={errors.location ? 'error' : ''}
                placeholder="City, Country"
              />
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>
          </div>

          {/* Bio & Experience */}
          <div className="form-section">
            <h2>About You</h2>
            
            <div className="form-group">
              <label htmlFor="shortBio">Short Bio *</label>
              <textarea
                id="shortBio"
                name="shortBio"
                rows="4"
                value={formData.shortBio}
                onChange={handleInputChange}
                className={errors.shortBio ? 'error' : ''}
                placeholder="Tell us about yourself in 50-200 characters..."
              ></textarea>
              <div className="char-counter">
                {formData.shortBio.length} / 50 characters minimum
              </div>
              {errors.shortBio && <span className="error-message">{errors.shortBio}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="writingExperience">Writing Experience *</label>
              <textarea
                id="writingExperience"
                name="writingExperience"
                rows="4"
                value={formData.writingExperience}
                onChange={handleInputChange}
                className={errors.writingExperience ? 'error' : ''}
                placeholder="Describe your writing experience, previous publications, or relevant background..."
              ></textarea>
              {errors.writingExperience && <span className="error-message">{errors.writingExperience}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="whyWriteForTrendorabay">Why do you want to write for Trendorabay? *</label>
              <textarea
                id="whyWriteForTrendorabay"
                name="whyWriteForTrendorabay"
                rows="4"
                value={formData.whyWriteForTrendorabay}
                onChange={handleInputChange}
                className={errors.whyWriteForTrendorabay ? 'error' : ''}
                placeholder="Tell us why you're interested in writing for Trendorabay and what you hope to contribute..."
              ></textarea>
              <div className="char-counter">
                {formData.whyWriteForTrendorabay.length} / 100 characters minimum
              </div>
              {errors.whyWriteForTrendorabay && <span className="error-message">{errors.whyWriteForTrendorabay}</span>}
            </div>
          </div>

          {/* Areas of Interest */}
          <div className="form-section">
            <h2>Areas of Interest *</h2>
            <p className="section-description">Select the topics you're most interested in writing about:</p>
            
            <div className="areas-grid">
              {areasOfInterestOptions.map((area) => (
                <button
                  type="button"
                  key={area}
                  className={`area-chip ${formData.areasOfInterest.includes(area) ? 'active' : ''}`}
                  onClick={() => handleAreaToggle(area)}
                >
                  {area}
                </button>
              ))}
            </div>
            {errors.areasOfInterest && <span className="error-message">{errors.areasOfInterest}</span>}
          </div>

          {/* Portfolio & Social Media */}
          <div className="form-section">
            <h2>Portfolio & Social Media</h2>
            
            <div className="form-group">
              <label htmlFor="portfolioUrl">Portfolio/Website URL</label>
              <input
                type="url"
                id="portfolioUrl"
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleInputChange}
                placeholder="https://yourportfolio.com"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="twitter">Twitter</label>
                <input
                  type="text"
                  id="twitter"
                  name="socialMediaLinks.twitter"
                  value={formData.socialMediaLinks.twitter}
                  onChange={handleInputChange}
                  placeholder="@username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="instagram">Instagram</label>
                <input
                  type="text"
                  id="instagram"
                  name="socialMediaLinks.instagram"
                  value={formData.socialMediaLinks.instagram}
                  onChange={handleInputChange}
                  placeholder="@username"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="linkedin">LinkedIn</label>
                <input
                  type="url"
                  id="linkedin"
                  name="socialMediaLinks.linkedin"
                  value={formData.socialMediaLinks.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="website">Personal Website</label>
                <input
                  type="url"
                  id="website"
                  name="socialMediaLinks.website"
                  value={formData.socialMediaLinks.website}
                  onChange={handleInputChange}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="form-section">
            <h2>Attachments</h2>
            
            <div className="form-group">
              <label htmlFor="writingSample">Writing Sample</label>
              <input
                type="file"
                id="writingSample"
                name="writingSample"
                accept=".doc,.docx,.pdf,.txt"
                onChange={handleInputChange}
              />
              <small>Accepted formats: .doc, .docx, .pdf, .txt (Max 10MB)</small>
            </div>

            <div className="form-group">
              <label htmlFor="cvResume">CV/Resume (Optional)</label>
              <input
                type="file"
                id="cvResume"
                name="cvResume"
                accept=".pdf,.doc,.docx"
                onChange={handleInputChange}
              />
              <small>Accepted formats: .pdf, .doc, .docx (Max 5MB)</small>
            </div>

            <div className="form-group">
              <label htmlFor="profilePhoto">Profile Photo (Optional)</label>
              <input
                type="file"
                id="profilePhoto"
                name="profilePhoto"
                accept=".jpg,.jpeg,.png,.gif"
                onChange={handleInputChange}
              />
              <small>Accepted formats: .jpg, .jpeg, .png, .gif (Max 2MB)</small>
            </div>
          </div>

          {/* Agreement */}
          <div className="form-section">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeToGuidelines"
                  checked={formData.agreeToGuidelines}
                  onChange={handleInputChange}
                />
                <span>
                  I agree to the <a href="/terms" target="_blank">Trendorabay Writer Guidelines</a> and understand that my application will be reviewed by the editorial team. *
                </span>
              </label>
              {errors.agreeToGuidelines && <span className="error-message">{errors.agreeToGuidelines}</span>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/writers')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriterApplicationPage;