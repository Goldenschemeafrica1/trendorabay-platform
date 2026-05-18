import React, { useState } from 'react';
import './FAQPage.css';

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [expandedItems, setExpandedItems] = useState({});

  const toggleItem = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const categories = [
    {
      id: 'general',
      title: 'General',
      icon: '📋',
      items: [
        {
          id: 'general-1',
          question: 'What is Trendorabay?',
          answer: 'Trendorabay is a premier digital platform that showcases African culture, creativity, and innovation. We connect creators, businesses, and audiences through curated content, magazines, and community events.'
        },
        {
          id: 'general-2',
          question: 'How can I contribute to Trendorabay?',
          answer: 'You can contribute by submitting your stories, becoming a writer, featuring your brand, or participating in our community events. Visit our "Share Your Voice" section to get started.'
        },
        {
          id: 'general-3',
          question: 'Is Trendorabay available worldwide?',
          answer: 'Yes! Trendorabay is accessible globally. Our digital content and community are available to anyone with an internet connection, though some physical products may have regional shipping limitations.'
        }
      ]
    },
    {
      id: 'shopping',
      title: 'Shopping & Orders',
      icon: '🛍️',
      items: [
        {
          id: 'shopping-1',
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, mobile payment solutions, and bank transfers for enterprise orders.'
        },
        {
          id: 'shopping-2',
          question: 'How long does shipping take?',
          answer: 'Standard shipping typically takes 5-7 business days within Africa, 7-14 days internationally. Express shipping options are available at checkout for faster delivery.'
        },
        {
          id: 'shopping-3',
          question: 'Can I return or exchange items?',
          answer: 'Yes, we offer a 30-day return policy for most items. Products must be in original condition. Digital purchases are non-refundable but may be eligible for exchange.'
        },
        {
          id: 'shopping-4',
          question: 'Do you offer international shipping?',
          answer: 'Yes, we ship to over 100 countries worldwide. International shipping rates and delivery times vary by destination. Check your country at checkout.'
        }
      ]
    },
    {
      id: 'magazines',
      title: 'Magazines & Subscriptions',
      icon: '📖',
      items: [
        {
          id: 'magazines-1',
          question: 'How do I access digital magazines?',
          answer: 'Digital magazines are accessible through our online reader and mobile app. Once purchased, you can read them anytime, anywhere with an internet connection.'
        },
        {
          id: 'magazines-2',
          question: 'Do you offer print magazine subscriptions?',
          answer: 'Yes, we offer both digital and print subscriptions. Print subscribers receive physical copies delivered to their door along with digital access.'
        },
        {
          id: 'magazines-3',
          question: 'Can I purchase individual magazine issues?',
          answer: 'Absolutely! You can buy individual digital or print issues of any magazine without committing to a subscription.'
        }
      ]
    },
    {
      id: 'community',
      title: 'Community & Events',
      icon: '👥',
      items: [
        {
          id: 'community-1',
          question: 'How can I join the Trendorabay community?',
          answer: 'Join our community by subscribing to our newsletter, following us on social media, attending our events, or becoming a contributor. Membership tiers offer exclusive benefits.'
        },
        {
          id: 'community-2',
          question: 'Do you organize events?',
          answer: 'Yes, we organize regular events including workshops, networking sessions, cultural showcases, and virtual conferences. Check our events calendar for upcoming activities.'
        },
        {
          id: 'community-3',
          question: 'How can I feature my brand or event?',
          answer: 'Contact our partnerships team through the "Become a Member" section or email us at partnerships@trendorabay.com to discuss featuring opportunities.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: '🔧',
      items: [
        {
          id: 'technical-1',
          question: "I'm having trouble logging in. What should I do?",
          answer: 'Try resetting your password using the "Forgot Password" link. If issues persist, clear your browser cache, check your email for verification, or contact our support team.'
        },
        {
          id: 'technical-2',
          question: 'How do I update my account information?',
          answer: 'Log into your account and navigate to "Account Settings" where you can update your profile, payment methods, preferences, and subscription details.'
        },
        {
          id: 'technical-3',
          question: 'Is my personal information secure?',
          answer: 'Absolutely. We use industry-standard encryption, secure servers, and comply with data protection regulations. Your information is never shared without explicit consent.'
        }
      ]
    }
  ];

  return (
    <div className="faq-page">
      <div className="faq-container">
        {/* Header */}
        <div className="faq-header">
          <h1 className="faq-title">Frequently Asked Questions</h1>
          <p className="faq-subtitle">Find answers to common questions about Trendorabay</p>
        </div>

        {/* Categories */}
        <div className="faq-categories">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-title">{category.title}</span>
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="faq-content">
          {categories
            .filter(cat => cat.id === activeCategory)
            .map((category) => (
              <div key={category.id} className="faq-category">
                {category.items.map((item) => (
                  <div key={item.id} className="faq-item">
                    <button
                      className="faq-question"
                      onClick={() => toggleItem(item.id)}
                    >
                      <span className="question-text">{item.question}</span>
                      <span className={`expand-icon ${expandedItems[item.id] ? 'expanded' : ''}`}>
                        +
                      </span>
                    </button>
                    {expandedItems[item.id] && (
                      <div className="faq-answer">
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
        </div>

        {/* Support Section */}
        <div className="support-section">
          <div className="support-header">
            <h2 className="support-title">Still have questions?</h2>
            <p className="support-subtitle">
              Can't find the answer you're looking for? Our team is here to help!
            </p>
          </div>

          <div className="support-content">
            <div className="support-buttons">
              <button className="support-btn primary">Contact Support</button>
              <button className="support-btn secondary">Visit Help Center</button>
            </div>

            <div className="support-stats">
              <div className="stat-item">
                <div className="stat-value">24/7</div>
                <div className="stat-label">Support Available</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">&lt;2hrs</div>
                <div className="stat-label">Average Response Time</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">98%</div>
                <div className="stat-label">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
