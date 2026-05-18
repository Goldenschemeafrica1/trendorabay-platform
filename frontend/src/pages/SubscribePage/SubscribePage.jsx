import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SubscribePage.css';

const SubscribePage = () => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    paymentMethod: 'card',
    agreeToTerms: false,
    promoCode: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);

  const subscriptionPlans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: 9.99,
      period: 'month',
      features: [
        'Access to all digital magazines',
        'Unlimited story reading',
        'Exclusive author interviews',
        'Monthly newsletter',
        'Mobile app access'
      ],
      popular: false
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: 99.99,
      period: 'year',
      features: [
        'Everything in Monthly plan',
        'Save 17% compared to monthly',
        'Early access to new issues',
        'Exclusive community events',
        'Download issues for offline reading',
        'Priority customer support'
      ],
      popular: true
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: 299.99,
      period: 'once',
      features: [
        'Everything in Yearly plan',
        'One-time payment, forever access',
        'All future updates included',
        'Exclusive lifetime member badge',
        'VIP event invitations',
        'Personal account manager'
      ],
      popular: false
    }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    
    return newErrors;
  };

  const applyPromoCode = () => {
    if (formData.promoCode.toLowerCase() === 'welcome20') {
      setPromoApplied(true);
    } else {
      setErrors({ promoCode: 'Invalid promo code' });
      setTimeout(() => setErrors({}), 3000);
    }
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Subscription data:', { ...formData, plan: selectedPlan });
      setIsSubmitted(true);
    } catch (error) {
      setErrors({ general: 'Subscription failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPlanData = subscriptionPlans.find(plan => plan.id === selectedPlan);
  const finalPrice = promoApplied && selectedPlan === 'yearly' ? selectedPlanData.price * 0.8 : selectedPlanData.price;

  if (isSubmitted) {
    return (
      <div className="subscribe-page">
        <div className="subscribe-container">
          <div className="success-message">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h1>Welcome to Trendorabay!</h1>
            <p>Your subscription has been activated successfully. You now have full access to all our premium content.</p>
            <div className="subscription-details">
              <p><strong>Plan:</strong> {selectedPlanData.name}</p>
              <p><strong>Email:</strong> {formData.email}</p>
            </div>
            <Link to="/magazines" className="start-reading-btn">Start Reading</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="subscribe-page">
      <div className="subscribe-container">
        <div className="subscribe-header">
          <h1>Subscribe to Trendorabay</h1>
          <p>Get unlimited access to African stories, culture, and perspectives</p>
        </div>

        <div className="subscribe-content">
          <div className="plans-section">
            <h2>Choose Your Plan</h2>
            <div className="plans-grid">
              {subscriptionPlans.map(plan => (
                <div 
                  key={plan.id}
                  className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {plan.popular && <div className="popular-badge">Most Popular</div>}
                  <div className="plan-header">
                    <h3>{plan.name}</h3>
                    <div className="plan-price">
                      <span className="currency">$</span>
                      <span className="amount">{promoApplied && plan.id === 'yearly' ? (plan.price * 0.8).toFixed(2) : plan.price}</span>
                      <span className="period">/{plan.period}</span>
                    </div>
                  </div>
                  <ul className="plan-features">
                    {plan.features.map((feature, index) => (
                      <li key={index}>
                        <i className="fas fa-check"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="payment-section">
            <div className="payment-container">
              <h2>Complete Your Subscription</h2>
              
              {errors.general && (
                <div className="error-message general-error">
                  {errors.general}
                </div>
              )}

              <form className="payment-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={errors.firstName ? 'error' : ''}
                      placeholder="Your first name"
                      disabled={isLoading}
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={errors.lastName ? 'error' : ''}
                      placeholder="Your last name"
                      disabled={isLoading}
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                  </div>
                </div>

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

                <div className="promo-section">
                  <label htmlFor="promoCode">Promo Code</label>
                  <div className="promo-input-group">
                    <input
                      type="text"
                      id="promoCode"
                      name="promoCode"
                      value={formData.promoCode}
                      onChange={handleChange}
                      placeholder="Enter promo code"
                      disabled={isLoading || promoApplied}
                    />
                    <button 
                      type="button" 
                      className="apply-promo-btn"
                      onClick={applyPromoCode}
                      disabled={isLoading || promoApplied || !formData.promoCode}
                    >
                      {promoApplied ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                  {errors.promoCode && <span className="error-text">{errors.promoCode}</span>}
                  {promoApplied && <span className="success-text">20% discount applied!</span>}
                </div>

                <div className="payment-method">
                  <h3>Payment Method</h3>
                  <div className="payment-options">
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                      <div className="payment-card">
                        <i className="fas fa-credit-card"></i>
                        <span>Credit/Debit Card</span>
                      </div>
                    </label>
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === 'paypal'}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                      <div className="payment-card">
                        <i className="fab fa-paypal"></i>
                        <span>PayPal</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="order-summary">
                  <h3>Order Summary</h3>
                  <div className="summary-item">
                    <span>{selectedPlanData.name} Plan</span>
                    <span>${finalPrice.toFixed(2)}</span>
                  </div>
                  {promoApplied && (
                    <div className="summary-item discount">
                      <span>Promo Discount (20%)</span>
                      <span>-${(selectedPlanData.price * 0.2).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="summary-divider"></div>
                  <div className="summary-item total">
                    <span>Total</span>
                    <span>${finalPrice.toFixed(2)}</span>
                  </div>
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
                    I agree to the <Link to="/terms">Terms and Conditions</Link> and <Link to="/privacy">Privacy Policy</Link>. I understand that my subscription will automatically renew and I can cancel anytime.
                  </label>
                  {errors.agreeToTerms && <span className="error-text">{errors.agreeToTerms}</span>}
                </div>

                <button 
                  type="submit" 
                  className="subscribe-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : `Subscribe for $${finalPrice.toFixed(2)}`}
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

export default SubscribePage;
