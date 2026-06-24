import React from 'react';
import ContactForm from './ContactForm';
import './ContactPage.css';

const ContactPage = () => {
  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
    alert('Message sent successfully!');
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>Get in touch with the Trendorabay team</p>
        </div>
        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            <div className="contact-details">
              <div className="contact-item">
                <strong>Email:</strong> info@trendorabay.com
              </div>
              <div className="contact-item">
                <strong>Location:</strong> Nairobi, Kenya
              </div>
            </div>
          </div>
          <ContactForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
