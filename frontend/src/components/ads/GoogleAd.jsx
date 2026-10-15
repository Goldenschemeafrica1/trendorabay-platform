import { useEffect, useRef, useState } from 'react';
import './GoogleAd.css';

const GoogleAd = ({ adSlot, adFormat = 'auto', style = {}, className = '' }) => {
  const adRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay ad loading until component is visible and has dimensions
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only load ads if window.adsbygoogle is available and component is visible
    if (isVisible && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('Google AdSense error:', error);
      }
    }
  }, [isVisible]);

  return (
    <div className={`google-ad-container ${className}`} style={{ ...style, minHeight: '70px', minWidth: '300px' }}>
      {isVisible && (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '70px' }}
          data-ad-client="ca-pub-1861173020933710"
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
};

export default GoogleAd;
