import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp, FaLink, FaEnvelope } from 'react-icons/fa';
import Button from '../forms/Button';
import './SocialShare.css';

const SocialShare = ({ url, title, description }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;
  const shareDescription = description || '';

  const shareLinks = [
    {
      name: 'Facebook',
      icon: <FaFacebookF />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: '#1877f2'
    },
    {
      name: 'Twitter',
      icon: <FaTwitter />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      color: '#1da1f2'
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedinIn />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: '#0077b5'
    },
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp />,
      url: `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`,
      color: '#25d366'
    },
    {
      name: 'Email',
      icon: <FaEnvelope />,
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareDescription}\n\n${shareUrl}`)}`,
      color: '#ea4335'
    }
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = (shareUrl) => {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  return (
    <div className="social-share">
      <div className="social-share-container">
        <h3 className="share-title">Share this article</h3>
        
        {/* Native Share Button (for mobile) */}
        {navigator.share && (
          <Button 
            onClick={handleNativeShare}
            variant="outline"
            className="native-share-btn"
          >
            Share
          </Button>
        )}

        {/* Social Media Buttons */}
        <div className="social-buttons">
          {shareLinks.map((social) => (
            <button
              key={social.name}
              className="social-btn"
              style={{ '--social-color': social.color }}
              onClick={() => handleShare(social.url)}
              aria-label={`Share on ${social.name}`}
            >
              <span className="social-icon">{social.icon}</span>
              <span className="social-name">{social.name}</span>
            </button>
          ))}
        </div>

        {/* Copy Link Button */}
        <div className="copy-link-section">
          <Button 
            onClick={handleCopyLink}
            variant="outline"
            className="copy-link-btn"
            fullWidth
          >
            <FaLink />
            {copied ? 'Link Copied!' : 'Copy Link'}
          </Button>
        </div>

        {/* URL Display */}
        <div className="url-display">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="url-input"
            onClick={handleCopyLink}
          />
        </div>
      </div>
    </div>
  );
};

export default SocialShare;
