import React, { useState } from 'react';
import { FaCreditCard, FaTruck, FaUser } from 'react-icons/fa';
import Input from '../forms/Input';
import Button from '../forms/Button';
import './CheckoutForm.css';

const CheckoutForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    
    // Payment Information
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    
    // Order Notes
    orderNotes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate shipping info
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    // Validate payment info
    if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    if (!formData.cardName.trim()) newErrors.cardName = 'Name on card is required';
    if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onSubmit(formData);
    } catch (error) {
      setErrors({ submit: 'Failed to process order. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      {/* Shipping Information */}
      <div className="checkout-section">
        <h3 className="section-title">
          <FaTruck /> Shipping Information
        </h3>
        
        <div className="form-row">
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            error={errors.firstName}
          />
          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            error={errors.lastName}
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          error={errors.email}
        />

        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
        />

        <Input
          label="Street Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          error={errors.address}
        />

        <div className="form-row">
          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            error={errors.city}
          />
          <Input
            label="State/Province"
            name="state"
            value={formData.state}
            onChange={handleChange}
            error={errors.state}
          />
        </div>

        <div className="form-row">
          <Input
            label="ZIP/Postal Code"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            required
            error={errors.zipCode}
          />
          <Input
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            error={errors.country}
          />
        </div>
      </div>

      {/* Payment Information */}
      <div className="checkout-section">
        <h3 className="section-title">
          <FaCreditCard /> Payment Information
        </h3>

        <Input
          label="Card Number"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
          required
          error={errors.cardNumber}
        />

        <Input
          label="Name on Card"
          name="cardName"
          value={formData.cardName}
          onChange={handleChange}
          required
          error={errors.cardName}
        />

        <div className="form-row">
          <Input
            label="Expiry Date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            placeholder="MM/YY"
            required
            error={errors.expiryDate}
          />
          <Input
            label="CVV"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            placeholder="123"
            required
            error={errors.cvv}
          />
        </div>
      </div>

      {/* Order Notes */}
      <div className="checkout-section">
        <h3 className="section-title">
          <FaUser /> Order Notes (Optional)
        </h3>
        <textarea
          name="orderNotes"
          value={formData.orderNotes}
          onChange={handleChange}
          placeholder="Special instructions for your order..."
          className="form-textarea"
          rows={4}
        />
      </div>

      {errors.submit && (
        <div className="form-error">
          {errors.submit}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="large"
        loading={isSubmitting}
        disabled={isSubmitting}
        fullWidth
      >
        {isSubmitting ? 'Processing Order...' : 'Complete Order'}
      </Button>
    </form>
  );
};

export default CheckoutForm;
