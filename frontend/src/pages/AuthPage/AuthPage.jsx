import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { apiRequest } from '../../services/api';
import { loginSuccess } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';
import './AuthPage.css';

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    country: 'KE',
    password: '',
    agreeToTerms: false
  });

  // Check URL hash to determine initial mode
  useEffect(() => {
    if (location.hash === '#signup') {
      setIsSignup(true);
    }
  }, [location.hash]);

  // Country change handler
  const handleCountryChange = (e) => {
    setSignupData(prev => ({ ...prev, country: e.target.value }));
  };

  // Password strength calculation
  useEffect(() => {
    const password = signupData.password;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setPasswordStrength(score);
  }, [signupData.password]);

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateLoginForm = () => {
    const newErrors = {};
    if (!loginData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!loginData.password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const validateSignupForm = () => {
    const newErrors = {};
    if (!signupData.firstName) {
      newErrors.firstName = 'Please enter your first name';
    }
    if (!signupData.lastName) {
      newErrors.lastName = 'Please enter your last name';
    }
    if (!signupData.username) {
      newErrors.username = 'Please choose a username';
    } else if (signupData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(signupData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }
    if (!signupData.email) {
      newErrors.email = 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!signupData.phone) {
      newErrors.phone = 'Please enter your phone number with country code';
    } else if (!/^\+?[0-9\s\-\(\)]{10,30}$/.test(signupData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number (e.g., +254712345678)';
    }
    if (!signupData.password) {
      newErrors.password = 'Please create a password';
    } else if (signupData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!signupData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service and Privacy Policy to continue';
    }
    return newErrors;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateLoginForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await apiRequest.post('/users/login', {
        email: loginData.email,
        password: loginData.password
      });

      if (response.data.success) {
        dispatch(loginSuccess(response.data.data));
        if (response.data.data?.token) {
          localStorage.setItem('authToken', response.data.data.token);
        }

        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectUrl);
        } else {
          navigate('/');
        }
        toast.success('Signed in successfully. Welcome back!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateSignupForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      // Show toast notification
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await apiRequest.post('/users/register', {
        username: signupData.username,
        email: signupData.email,
        password: signupData.password,
        first_name: signupData.firstName,
        last_name: signupData.lastName,
        country: signupData.country,
        phone: signupData.phone
      });

      if (response?.data?.success === true) {
        dispatch(loginSuccess({ user: response.data.data }));
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
        }
        toast.success('Welcome to Trendorabay! Check your inbox to confirm your email.');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setErrors({ general: response?.data?.error || 'Registration failed' });
        toast.error(response?.data?.error || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed. Please try again.';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const switchPanel = (target) => {
    setIsSignup(target === 'signup');
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPasswordStrengthColor = (index) => {
    const colors = ['#e05252', '#e8a33d', '#c9c93a', '#3fae5a'];
    return index < passwordStrength ? colors[Math.max(0, passwordStrength - 1)] : '#e6e6e6';
  };

  const getPasswordHint = () => {
    if (!signupData.password) {
      return { text: 'Use 8+ characters with a mix of letters, numbers and symbols.', color: '#999' };
    } else if (passwordStrength <= 2) {
      return { text: 'Weak — add uppercase letters, numbers or symbols.', color: '#d16a6a' };
    } else if (passwordStrength === 3) {
      return { text: 'Good — a symbol would make it stronger.', color: '#c99a2e' };
    } else {
      return { text: 'Strong password. Nice work.', color: '#3fae5a' };
    }
  };

  const visualData = {
    signin: {
      label: 'Sign in',
      title: 'Welcome back.',
      desc: 'Sign in to continue reading stories, managing your profile and staying up to date with African creativity.',
      badge: 'Welcome back',
      quote: 'Every story you\'ve saved, every creator you\'ve followed — right where you left them.',
      images: [
        '/login-magazine-cover.jpg',
        '/promo-road-to-1m.jpg',
        '/hoodie-product.jpg'
      ]
    },
    signup: {
      label: 'Sign up',
      title: 'Create your account.',
      desc: 'Join 85,000+ readers discovering the best of African creativity — stories, creators and culture, delivered weekly.',
      badge: 'New members welcome',
      quote: 'The stories that shape Africa deserve an audience that shows up.',
      images: [
        '/login-magazine-cover.jpg',
        '/promo-road-to-1m.jpg',
        '/hoodie-product.jpg'
      ]
    }
  };

  const currentVisual = isSignup ? visualData.signup : visualData.signin;

  return (
    <main className="auth-wrap">
      {/* LEFT: FORMS */}
      <section className="auth-form-panel">
        <div className="auth-inner">
          {/* HEADER ROW — logo + heading text */}
          <div className="auth-header">
            <Link to="/" className="brand">
              <div className="tb-logo-badge">
                <img src="/auth-logo.jpg" alt="Trendorabay" />
              </div>
            </Link>

            <div className="auth-head">
              <span className="brand-label">{currentVisual.label}</span>
              <h1>{currentVisual.title}</h1>
              <p>{currentVisual.desc}</p>
            </div>
          </div>

          {/* SIGN IN PANEL */}
          <div className={`panel ${!isSignup ? 'active' : ''}`}>
            <form onSubmit={handleLoginSubmit} noValidate>
              {errors.general && (
                <div className="error-message general-error">
                  {errors.general}
                </div>
              )}

              <div className="field">
                <label htmlFor="signin-email">Email address</label>
                <input
                  id="signin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="yangmani@company.com"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  disabled={isLoading}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="field">
                <label htmlFor="signin-password">Password</label>
                <div className="pw-wrap">
                  <input
                    id="signin-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    disabled={isLoading}
                    className={errors.password ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="options-row">
                <div className="remember">
                  <input
                    id="remember"
                    name="rememberMe"
                    type="checkbox"
                    checked={loginData.rememberMe}
                    onChange={handleLoginChange}
                    disabled={isLoading}
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <Link to="/forgot-password" className="forgot">Forgot password?</Link>
              </div>

              <button className="submit-btn" type="submit" disabled={isLoading}>
                {isLoading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <p className="switch-line">Don't have an account? <button type="button" onClick={() => switchPanel('signup')}>Create one</button></p>
          </div>

          {/* SIGN UP PANEL */}
          <div className={`panel ${isSignup ? 'active' : ''}`}>
            <form onSubmit={handleSignupSubmit} noValidate>
              {errors.general && (
                <div className="error-message general-error">
                  {errors.general}
                </div>
              )}

              <div className="field-row">
                <div className="field">
                  <label htmlFor="first">First name</label>
                  <input
                    id="first"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    placeholder="Jane"
                    value={signupData.firstName}
                    onChange={handleSignupChange}
                    disabled={isLoading}
                    className={errors.firstName ? 'error' : ''}
                  />
                  {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                </div>
                <div className="field">
                  <label htmlFor="last">Last name</label>
                  <input
                    id="last"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    placeholder="Doe"
                    value={signupData.lastName}
                    onChange={handleSignupChange}
                    disabled={isLoading}
                    className={errors.lastName ? 'error' : ''}
                  />
                  {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                </div>
              </div>

              <div className="field">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="janedoe"
                  pattern="[a-zA-Z0-9_]{3,20}"
                  value={signupData.username}
                  onChange={handleSignupChange}
                  disabled={isLoading}
                  className={errors.username ? 'error' : ''}
                />
                {errors.username && <span className="error-text">{errors.username}</span>}
                <div className="pw-hint">3–20 characters. Letters, numbers and underscores only.</div>
              </div>

              <div className="field">
                <label htmlFor="signup-email">Email address</label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="jane@company.com"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  disabled={isLoading}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="field">
                <label htmlFor="phone">Phone number (with country code)</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  placeholder="+254 712 345 678"
                  inputMode="tel"
                  value={signupData.phone}
                  onChange={handleSignupChange}
                  disabled={isLoading}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
                <div className="pw-hint">Include your country code (e.g., +254, +1, +44)</div>
              </div>

              <div className="field">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  required
                  value={signupData.country}
                  onChange={handleCountryChange}
                  disabled={isLoading}
                >
                  <option value="">Select your country</option>
                  <option value="KE" data-code="+254">Kenya</option>
                  <option value="NG" data-code="+234">Nigeria</option>
                  <option value="GH" data-code="+233">Ghana</option>
                  <option value="ZA" data-code="+27">South Africa</option>
                  <option value="UG" data-code="+256">Uganda</option>
                  <option value="TZ" data-code="+255">Tanzania</option>
                  <option value="RW" data-code="+250">Rwanda</option>
                  <option value="ET" data-code="+251">Ethiopia</option>
                  <option value="SN" data-code="+221">Senegal</option>
                  <option value="CM" data-code="+237">Cameroon</option>
                  <option value="CI" data-code="+225">Côte d'Ivoire</option>
                  <option value="EG" data-code="+20">Egypt</option>
                  <option value="MA" data-code="+212">Morocco</option>
                  <option value="US" data-code="+1">United States</option>
                  <option value="GB" data-code="+44">United Kingdom</option>
                  <option value="CA" data-code="+1">Canada</option>
                  <option value="OTHER" data-code="+">Other</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="signup-password">Password</label>
                <div className="pw-wrap">
                  <input
                    id="signup-password"
                    name="password"
                    type={showSignupPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    placeholder="At least 8 characters"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    disabled={isLoading}
                    className={errors.password ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                  >
                    {showSignupPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="pw-strength" aria-hidden="true">
                  <i style={{ background: getPasswordStrengthColor(0) }}></i>
                  <i style={{ background: getPasswordStrengthColor(1) }}></i>
                  <i style={{ background: getPasswordStrengthColor(2) }}></i>
                  <i style={{ background: getPasswordStrengthColor(3) }}></i>
                </div>
                <div className="pw-hint" style={{ color: getPasswordHint().color }}>
                  {getPasswordHint().text}
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="check-row">
                <input
                  id="terms"
                  name="agreeToTerms"
                  type="checkbox"
                  required
                  checked={signupData.agreeToTerms}
                  onChange={handleSignupChange}
                  disabled={isLoading}
                  className={errors.agreeToTerms ? 'error' : ''}
                />
                <label htmlFor="terms">
                  I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>, and consent to receiving occasional emails from Trendorabay.
                </label>
                {errors.agreeToTerms && <span className="error-text">{errors.agreeToTerms}</span>}
              </div>

              <button className="submit-btn" type="submit" disabled={isLoading}>
                {isLoading ? 'Creating account…' : 'Create account'}
              </button>
            </form>

            <p className="switch-line">Already have an account? <button type="button" onClick={() => switchPanel('signin')}>Sign in</button></p>
          </div>
        </div>
      </section>

      {/* RIGHT: VISUAL + QUOTE STACKED */}
      <aside className="auth-visual">
        <div className="visual-top">
          <div className="visual-badge"><i></i> <span>{currentVisual.badge}</span></div>
        </div>

        <div className="visual-mosaic">
          <div className="vm-tile vm-1"><img src={currentVisual.images[0]} alt="Team meeting" /></div>
          <div className="vm-tile vm-2"><img src={currentVisual.images[1]} alt="Collaboration" /></div>
          <div className="vm-tile vm-3"><img src={currentVisual.images[2]} alt="Teamwork" /></div>
        </div>

        <div className="visual-quote-card">
          <p className="visual-quote" dangerouslySetInnerHTML={{ __html: `"${currentVisual.quote}"` }}></p>
        </div>
      </aside>
    </main>
  );
};

export default AuthPage;
