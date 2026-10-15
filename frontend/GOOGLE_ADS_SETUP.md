# Google AdSense Integration Guide

This guide explains how to integrate Google AdSense into the Trendorabay platform.

## Setup Instructions

### 1. Get Your AdSense Publisher ID

1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Sign in with your Google account
3. Create a new AdSense account or sign in to an existing one
4. Add your website URL (e.g., `https://trendorabay.com`)
5. Complete the verification process
6. Once approved, you'll receive a Publisher ID in the format: `ca-pub-XXXXXXXXXXXXXXXX`

### 2. Update the Configuration

Replace the placeholder Publisher ID in the following files:

#### In `frontend/index.html` (line 28):
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
```

Replace `ca-pub-XXXXXXXXXXXXXXXX` with your actual Publisher ID.

#### In `frontend/src/components/ads/GoogleAd.jsx` (line 21):
```jsx
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
```

Replace `ca-pub-XXXXXXXXXXXXXXXX` with your actual Publisher ID.

### 3. Create Ad Units in AdSense

1. Go to your AdSense dashboard
2. Navigate to **Ads** > **By ad unit**
3. Click **Create ad unit**
4. Choose the ad type (Display, In-feed, In-article, etc.)
5. Configure the ad unit settings
6. Copy the **Ad slot ID** (e.g., `1234567890`)

### 4. Use the GoogleAd Component

Import and use the `GoogleAd` component in your pages:

```jsx
import GoogleAd from '../components/ads/GoogleAd';

// Basic usage
<GoogleAd adSlot="1234567890" />

// With custom styling
<GoogleAd
  adSlot="1234567890"
  style={{ width: '100%', height: '250px' }}
  className="my-ad"
/>

// Different ad formats
<GoogleAd adSlot="1234567890" adFormat="auto" />
<GoogleAd adSlot="1234567890" adFormat="rectangle" />
<GoogleAd adSlot="1234567890" adFormat="horizontal" />
<GoogleAd adSlot="1234567890" adFormat="vertical" />
```

### 5. Recommended Ad Placements

Here are recommended places to add ads:

- **Landing Page**: Below hero section, between content sections
- **Story Detail Page**: Below story content, in sidebar
- **Magazine Page**: Between magazine listings
- **Community Page**: In sidebar, between posts
- **Store Page**: Product listings sidebar

### 6. Ad Formats

- `auto`: Automatically selects the best size (recommended)
- `rectangle`: 300x250 or similar rectangle
- `horizontal`: 728x90 or similar horizontal banner
- `vertical`: 160x600 or similar vertical skyscraper

### 7. Testing

1. After setup, ads may not appear immediately
2. Google needs to review and approve your site
3. During review, you may see blank spaces
4. Check AdSense dashboard for approval status
5. Use AdSense preview tool to test ad placements

### 8. Compliance

- Ensure your content complies with AdSense policies
- Don't click on your own ads
- Don't encourage others to click on ads
- Provide original, high-quality content
- Maintain a good user experience

### 9. Performance Monitoring

- Monitor ad performance in AdSense dashboard
- Track revenue, impressions, and CTR
- Optimize ad placements based on performance
- Consider A/B testing different positions

### 10. Troubleshooting

**Ads not showing:**
- Check if Publisher ID is correct
- Verify ad slot ID is valid
- Ensure site is approved by AdSense
- Check browser console for errors
- Verify ad blockers are disabled

**Low revenue:**
- Improve content quality
- Increase traffic
- Optimize ad placements
- Test different ad formats
- Ensure mobile-friendly design

## Environment Variables (Optional)

For better security, you can use environment variables:

1. Create `.env` file in frontend directory:
```
VITE_GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
```

2. Update `index.html`:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=%VITE_GOOGLE_ADSENSE_ID%" crossorigin="anonymous"></script>
```

3. Update `GoogleAd.jsx`:
```jsx
data-ad-client={import.meta.env.VITE_GOOGLE_ADSENSE_ID}
```

## Support

For AdSense-specific issues, visit:
- [AdSense Help Center](https://support.google.com/adsense/)
- [AdSense Policy Center](https://support.google.com/adsense/answer/48182)
