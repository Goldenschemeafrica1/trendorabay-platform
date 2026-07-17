import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './store/store';
import './index.css'; // Global styles imported here
import { apiRequest } from './services/api';
import storyService from './services/storyService';
import magazineService from './services/magazineService';

// Add font-display swap for better performance
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap';
fontLink.media = 'print';
fontLink.onload = () => {
  fontLink.media = 'all';
};
document.head.appendChild(fontLink);

// Preload critical data for homepage
const preloadCriticalData = async () => {
  try {
    // Preload homepage stories (batched endpoint)
    storyService.getHomepageStories();
    // Preload magazines
    magazineService.getMagazines({ limit: 8 });
  } catch (error) {
    console.log('Preload failed (will load on demand):', error.message);
  }
};

// Start preloading in background
preloadCriticalData();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);