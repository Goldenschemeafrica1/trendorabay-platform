import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, subtotal } = useSelector(state => state.cart);
  const total = Number(subtotal) || 0;
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    region: '',
    postal: '',
    country: 'Kenya',
    deliveryMethod: 'standard',
    paymentMethod: 'mpesa',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
    orderNotes: '',
    marketingEmails: true,
    saveAddress: true
  });

  const [showCardForm, setShowCardForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const deliveryCosts = {
    standard: 250,
    express: 500,
    pickup: 0
  };

  const deliveryCost = deliveryCosts[formData.deliveryMethod] || 250;
  const finalTotal = total + deliveryCost;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    if (name === 'paymentMethod') {
      setShowCardForm(value === 'card');
    }
  };

  const handleDeliveryChange = (value) => {
    setFormData({
      ...formData,
      deliveryMethod: value
    });
  };

  const handlePaymentChange = (value) => {
    setFormData({
      ...formData,
      paymentMethod: value
    });
    setShowCardForm(value === 'card');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'region', 'postal'];
    for (const field of required) {
      if (!formData[field]?.trim()) {
        showToast('Please fill in all required fields');
        return;
      }
    }

    // Generate order number
    const orderNum = '#TB-' + Math.floor(1000 + Math.random() * 9000);
    setOrderNumber(orderNum);
    setShowSuccessModal(true);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    showToast('Redirecting to home...');
    navigate('/');
  };

  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 2200);
  };

  const formatMoney = (amount) => {
    return `KSh ${Math.round(amount).toLocaleString('en-KE')}`;
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <section className="page-head">
          <div className="container">
            <div className="eyebrow">Checkout</div>
            <h1>Complete your order</h1>
            <p>Just a few details and your order will be on its way.</p>
          </div>
        </section>
        <div className="container" style={{ padding: '44px 0 80px' }}>
          <div className="empty-cart">
            <div className="icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some items to your cart before checking out.</p>
            <button className="btn" onClick={() => navigate('/store')}>Browse the store →</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* PAGE HEADER */}
      <section className="page-head">
        <div className="container">
          <div className="eyebrow">Checkout</div>
          <h1>Complete your order</h1>
          <p>Just a few details and your order will be on its way.</p>

          <div className="stepper">
            <div className="step done"><span className="dot">✓</span><span>Cart</span></div>
            <div className="step-line"></div>
            <div className="step active"><span className="dot">2</span><span>Details</span></div>
            <div className="step-line"></div>
            <div className="step"><span className="dot">3</span><span>Payment</span></div>
            <div className="step-line"></div>
            <div className="step"><span className="dot">4</span><span>Done</span></div>
          </div>
        </div>
      </section>

      <main className="container layout">
        {/* LEFT: FORMS */}
        <div style={{ minWidth: 0 }}>
          {/* CONTACT */}
          <section className="form-card">
            <div className="form-card-head">
              <div>
                <h2>Contact information</h2>
                <p>We'll use this to send your order updates.</p>
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
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
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <label className="checkbox">
              <input
                type="checkbox"
                name="marketingEmails"
                checked={formData.marketingEmails}
                onChange={handleInputChange}
              />
              <span>Send me occasional updates on new drops, stories and opportunities from Trendorabay.</span>
            </label>
          </section>

          {/* SHIPPING ADDRESS */}
          <section className="form-card">
            <div className="form-card-head">
              <div>
                <h2>Shipping address</h2>
                <p>Where should we deliver your order?</p>
              </div>
            </div>

            <div className="field">
              <label htmlFor="address">Street address</label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="apartment">Apartment, suite, etc. (optional)</label>
              <input
                id="apartment"
                name="apartment"
                type="text"
                value={formData.apartment}
                onChange={handleInputChange}
                placeholder="Apt 4B, 3rd floor..."
              />
            </div>

            <div className="form-row three">
              <div className="field">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="region">Region</label>
                <input
                  id="region"
                  name="region"
                  type="text"
                  value={formData.region}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="postal">Postal code</label>
                <input
                  id="postal"
                  name="postal"
                  type="text"
                  value={formData.postal}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
              >
                <option value="Kenya">Kenya</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
                <option value="South Africa">South Africa</option>
                <option value="Tanzania">Tanzania</option>
                <option value="Uganda">Uganda</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <label className="checkbox">
              <input
                type="checkbox"
                name="saveAddress"
                checked={formData.saveAddress}
                onChange={handleInputChange}
              />
              <span>Save this address for next time</span>
            </label>
          </section>

          {/* DELIVERY METHOD */}
          <section className="form-card">
            <div className="form-card-head">
              <div>
                <h2>Delivery method</h2>
                <p>Choose how you'd like to receive your order.</p>
              </div>
            </div>

            <div className="delivery-options">
              <label 
                className={`delivery-option ${formData.deliveryMethod === 'standard' ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="standard"
                  checked={formData.deliveryMethod === 'standard'}
                  onChange={(e) => handleDeliveryChange(e.target.value)}
                />
                <div className="delivery-info">
                  <strong>Standard delivery</strong>
                  <span>2–5 business days · Tracked</span>
                </div>
                <div className="delivery-price">{formatMoney(deliveryCosts.standard)}</div>
              </label>

              <label 
                className={`delivery-option ${formData.deliveryMethod === 'express' ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="express"
                  checked={formData.deliveryMethod === 'express'}
                  onChange={(e) => handleDeliveryChange(e.target.value)}
                />
                <div className="delivery-info">
                  <strong>Express delivery</strong>
                  <span>1–2 business days · Priority handling</span>
                </div>
                <div className="delivery-price">{formatMoney(deliveryCosts.express)}</div>
              </label>

              <label 
                className={`delivery-option ${formData.deliveryMethod === 'pickup' ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="pickup"
                  checked={formData.deliveryMethod === 'pickup'}
                  onChange={(e) => handleDeliveryChange(e.target.value)}
                />
                <div className="delivery-info">
                  <strong>Pickup point</strong>
                  <span>Collect from a nearby Trendorabay pickup point</span>
                </div>
                <div className="delivery-price">Free</div>
              </label>
            </div>
          </section>

          {/* PAYMENT METHOD */}
          <section className="form-card">
            <div className="form-card-head">
              <div>
                <h2>Payment method</h2>
                <p>All payments are encrypted and secure.</p>
              </div>
            </div>

            <div className="payment-options">
              <label 
                className={`payment-option ${formData.paymentMethod === 'mpesa' ? 'selected' : ''}`}
              >
                <div className="payment-top">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mpesa"
                    checked={formData.paymentMethod === 'mpesa'}
                    onChange={(e) => handlePaymentChange(e.target.value)}
                  />
                  <div className="logo">M-PESA</div>
                  <div className="info">
                    <strong>M-Pesa</strong>
                    <span>Pay with your M-Pesa mobile wallet</span>
                  </div>
                </div>
              </label>

              <label 
                className={`payment-option ${formData.paymentMethod === 'card' ? 'selected' : ''}`}
              >
                <div className="payment-top">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={(e) => handlePaymentChange(e.target.value)}
                  />
                  <div className="logo">CARD</div>
                  <div className="info">
                    <strong>Credit / Debit card</strong>
                    <span>Visa, Mastercard, American Express</span>
                  </div>
                </div>
                {showCardForm && (
                  <div className="payment-form">
                    <div className="field">
                      <label htmlFor="cardNumber">Card number</label>
                      <input
                        id="cardNumber"
                        name="cardNumber"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        inputMode="numeric"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-row three">
                      <div className="field">
                        <label htmlFor="cardExpiry">Expiry</label>
                        <input
                          id="cardExpiry"
                          name="cardExpiry"
                          type="text"
                          placeholder="MM / YY"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="cardCvv">CVV</label>
                        <input
                          id="cardCvv"
                          name="cardCvv"
                          type="text"
                          placeholder="123"
                          inputMode="numeric"
                          value={formData.cardCvv}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="cardName">Name on card</label>
                        <input
                          id="cardName"
                          name="cardName"
                          type="text"
                          placeholder="Alex Mwangi"
                          value={formData.cardName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </label>

              <label 
                className={`payment-option ${formData.paymentMethod === 'paypal' ? 'selected' : ''}`}
              >
                <div className="payment-top">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={(e) => handlePaymentChange(e.target.value)}
                  />
                  <div className="logo">PP</div>
                  <div className="info">
                    <strong>PayPal</strong>
                    <span>Pay securely with your PayPal account</span>
                  </div>
                </div>
              </label>
            </div>
          </section>

          {/* NOTES */}
          <section className="form-card">
            <div className="form-card-head">
              <div>
                <h2>Order notes (optional)</h2>
                <p>Add anything we should know about your delivery.</p>
              </div>
            </div>
            <div className="field">
              <textarea
                name="orderNotes"
                rows="3"
                placeholder="e.g. Please call when you arrive..."
                value={formData.orderNotes}
                onChange={handleInputChange}
                style={{ minHeight: '90px', resize: 'vertical' }}
              />
            </div>
          </section>
        </div>

        {/* RIGHT: SUMMARY */}
        <aside className="summary">
          <h2>Order Summary</h2>

          <div className="mini-list">
            {items.map(item => (
              <div key={item.id} className="mini-item">
                <div className="img">
                  <img src={item.image} alt={item.name} />
                  <span className="qty-badge">{item.quantity}</span>
                </div>
                <div className="info">
                  <strong>{item.name}</strong>
                  <span>Official Trendorabay</span>
                </div>
                <div className="price">{formatMoney(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatMoney(total)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>{deliveryCost === 0 ? 'Free' : formatMoney(deliveryCost)}</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">
            <span>Total</span>
            <span>{formatMoney(finalTotal)}</span>
          </div>

          <button className="place-btn" onClick={handleSubmit}>Place order</button>
          <a 
            className="back-link" 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              navigate('/cart');
            }}
          >
            ← Back to cart
          </a>

          <div className="trust">
            <div>Secure encrypted payment</div>
            <div>Free returns within 14 days</div>
            <div>Delivery in 2–5 business days</div>
          </div>
        </aside>
      </main>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="modal open">
          <div className="modal-box">
            <div className="modal-icon">✓</div>
            <h2>Order placed!</h2>
            <p>Thanks for your order. We've sent a confirmation to your email with the details.</p>
            <div className="order-num">{orderNumber}</div>
            <p style={{ marginBottom: '24px' }}>You can track your order anytime from your profile.</p>
            <button className="btn" onClick={closeSuccessModal}>Continue shopping</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
