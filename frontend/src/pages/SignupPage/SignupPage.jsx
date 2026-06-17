import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { VALIDATION } from '../../utils/constants';
import './SignupPage.css';

const validate = (values) => {
  const newErrors = {};

  if (!values.firstName) newErrors.firstName = 'First name is required';
  if (!values.lastName) newErrors.lastName = 'Last name is required';

  if (!values.email) {
    newErrors.email = 'Email is required';
  } else if (!VALIDATION.EMAIL_REGEX.test(values.email)) {
    newErrors.email = 'Email is invalid';
  }

  if (!values.password) {
    newErrors.password = 'Password is required';
  } else if (values.password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters';
  }

  if (!values.confirmPassword) {
    newErrors.confirmPassword = 'Please confirm your password';
  } else if (values.password !== values.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match';
  }

  if (!values.agreeToTerms) {
    newErrors.agreeToTerms = 'You must agree to the terms and conditions';
  }

  return newErrors;
};

const SignupPage = () => {
  const navigate = useNavigate();

  const { formData, errors, isSubmitting: isLoading, handleChange, handleSubmit } = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
      subscribeToNewsletter: false,
    },
    validate,
    onSubmit: async (data) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Signup attempt:', data);
      navigate('/login');
    },
  });

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h1>Create Account</h1>
          <p>Join our community today</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
                placeholder="Enter your first name"
                disabled={isLoading}
              />
              {errors.firstName && (
                <span className="error-text">{errors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
                placeholder="Enter your last name"
                disabled={isLoading}
              />
              {errors.lastName && (
                <span className="error-text">{errors.lastName}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Create a password"
              disabled={isLoading}
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Confirm your password"
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
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
              I agree to the <Link to="/terms">Terms and Conditions</Link> and <Link to="/privacy">Privacy Policy</Link>
            </label>
            {errors.agreeToTerms && (
              <span className="error-text">{errors.agreeToTerms}</span>
            )}
          </div>

          <div className="checkbox-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="subscribeToNewsletter"
                checked={formData.subscribeToNewsletter}
                onChange={handleChange}
                disabled={isLoading}
              />
              <span className="checkmark"></span>
              Subscribe to our newsletter for updates and exclusive content
            </label>
          </div>

          <button 
            type="submit" 
            className="signup-button"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="signup-divider">
          <span>OR</span>
        </div>

        <div className="social-login">
          <button className="social-button google">
            <i className="fab fa-google"></i>
            Continue with Google
          </button>
        </div>

        <div className="login-link">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
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

export default SignupPage;
