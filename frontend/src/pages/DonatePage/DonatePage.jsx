import React from 'react';
import './DonatePage.css';

const DonatePage = () => {
  const donationOptions = [
    {
      id: 1,
      amount: 10,
      title: 'Supporter',
      description: 'Help us continue creating quality content'
    },
    {
      id: 2,
      amount: 25,
      title: 'Patron',
      description: 'Support our mission and get exclusive updates'
    },
    {
      id: 3,
      amount: 50,
      title: 'Benefactor',
      description: 'Major support with special recognition'
    },
    {
      id: 4,
      amount: 100,
      title: 'Champion',
      description: 'Premium support with all benefits included'
    }
  ];

  const handleDonate = (amount) => {
    alert(`Thank you for your donation of $${amount}! This would redirect to a payment processor.`);
  };

  return (
    <div className="donate-page">
      <div className="container">
        <div className="donate-header">
          <h1>Support Trendorabay</h1>
          <p>Your donation helps us continue to tell African stories and support creative talent across the continent</p>
        </div>
        
        <div className="donate-content">
          <div className="donate-info">
            <h2>Why Donate?</h2>
            <p>Trendorabay is dedicated to showcasing African creativity, innovation, and culture. Your support helps us:</p>
            <ul className="donate-benefits">
              <li>Feature emerging African artists and writers</li>
              <li>Produce high-quality magazine content</li>
              <li>Support community events and workshops</li>
              <li>Maintain our platform and reach more audiences</li>
            </ul>
            <div className="donate-impact">
              <h3>Our Impact</h3>
              <div className="impact-stats">
                <div className="stat">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Featured Creators</span>
                </div>
                <div className="stat">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Magazine Issues</span>
                </div>
                <div className="stat">
                  <span className="stat-number">10K+</span>
                  <span className="stat-label">Community Members</span>
                </div>
              </div>
            </div>
          </div>

          <div className="donate-options">
            <h2>Choose Your Contribution</h2>
            <div className="donation-cards">
              {donationOptions.map(option => (
                <div key={option.id} className="donation-card">
                  <div className="donation-amount">${option.amount}</div>
                  <h3 className="donation-title">{option.title}</h3>
                  <p className="donation-description">{option.description}</p>
                  <button 
                    className="donate-button"
                    onClick={() => handleDonate(option.amount)}
                  >
                    Donate ${option.amount}
                  </button>
                </div>
              ))}
            </div>
            <div className="custom-donation">
              <h3>Custom Amount</h3>
              <div className="custom-donation-form">
                <input type="number" placeholder="Enter amount" min="1" />
                <button className="donate-button">Donate</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;
