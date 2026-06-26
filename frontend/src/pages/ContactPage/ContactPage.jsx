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
          <ContactForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
