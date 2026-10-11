import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './store/store';
import './index.css'; // Global styles imported here

// Add font-display swap for better performance
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap';
fontLink.media = 'print';
fontLink.onload = () => {
  fontLink.media = 'all';
};
document.head.appendChild(fontLink);

// Register service worker for offline caching and instant loading (production only)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    if (import.meta.env.PROD) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      }).then(() => {
        navigator.serviceWorker.register('/sw-v4.js')
          .then((registration) => {
            // Force update the service worker
            if (registration.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
          })
          .catch(() => {});
      });
    } else {
      // Dev: unregister all service workers to avoid stale caches causing old pages to flash
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
    }
  });
}

if (typeof history !== 'undefined' && 'scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

ReactDOM.createRoot(document.getElementById('root')).render(
  // Disable StrictMode in development to prevent double-invoking effects
  // which causes unnecessary API calls and rate limiting issues
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);