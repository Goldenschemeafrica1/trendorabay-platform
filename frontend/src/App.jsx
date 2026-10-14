import React from 'react';
import { useEffect, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Analytics } from '@vercel/analytics/react';
import ReactGA from 'react-ga4';
import api from './services/api';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import './App.css';

// Page Components
import LandingPage from './pages/LandingPage/LandingPage';
import StorePage from './pages/StorePage/StorePage';
import ProductDetailPage from './pages/StorePage/ProductDetailPage';
import CartPage from './pages/StorePage/CartPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import CheckoutSuccessPage from './pages/CheckoutPage/CheckoutSuccessPage';
import EventsPage from './components/events/EventsPage';
import OpportunitiesPage from './components/opportunities/OpportunitiesPage';
import AboutPage from './pages/AboutPage/AboutPage';
import MissionPage from './pages/MissionPage/MissionPage';
import ContactPage from './pages/ContactPage/ContactPage';
import WritersPage from './pages/WritersPage/WritersPage';
import SearchPage from './pages/SearchPage/SearchPage';
import PartnerPage from './pages/PartnerPage/PartnerPage';
import TermsPage from './pages/Legal/TermsPage';
import PrivacyPage from './pages/Legal/PrivacyPage';
import AuthPage from './pages/AuthPage/AuthPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage';
import AdvertisePage from './pages/AdvertisePage/AdvertisePage';
import SubscribePage from './pages/SubscribePage/SubscribePage';
import DonatePage from './pages/DonatePage/DonatePage';
import OrdersPage from './pages/OrdersPage/OrdersPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import GalleryPage from './pages/GalleryPage/GalleryPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import MagazineDetailPage from './pages/MagazinesPage/MagazineDetailPage';
import MagazinesPage from './pages/MagazinesPage/MagazinesPage';
import StoriesPage from './pages/StoriesPage/StoriesPage';
import StoryDetailPage from './pages/StoryDetailPage/StoryDetailPage';
import MusicPage from './pages/MusicPage/MusicPage';
import CommunityPage from './pages/CommunityPage/CommunityPage';
import OpportunityDetailPage from './pages/OpportunityDetailPage/OpportunityDetailPage';

function App() {
  const location = useLocation();
  const { theme } = useSelector(state => state.ui);
  const { isDrawerOpen } = useSelector(state => state.cart);

  // Initialize Google Analytics
  useEffect(() => {
    const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-VN6QLG1ZEL';
    if (GA_MEASUREMENT_ID) {
      ReactGA.initialize(GA_MEASUREMENT_ID);
    }
  }, []);

  // Scroll to top on route change and page load before paint
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (window.history && window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual';
    }
  }, [location.pathname]);

  // Scroll to top on initial page load/refresh before paint
  useLayoutEffect(() => {
    const forceScrollToTop = () => {
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        if (window.history && window.history.scrollRestoration) {
          window.history.scrollRestoration = 'manual';
        }
      }
    };

    forceScrollToTop();
    const timeoutId = setTimeout(forceScrollToTop, 0);
    const delayId = setTimeout(forceScrollToTop, 100);
    const loadedId = setTimeout(() => {
      document.body.classList.add('loaded');
    }, 250);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(delayId);
      clearTimeout(loadedId);
    };
  }, []);

  // Apply dark mode class to body based on theme state
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [theme]);

  // Track page views for analytics
  useEffect(() => {
    const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-VN6QLG1ZEL';
    if (GA_MEASUREMENT_ID) {
      ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
    }
  }, [location]);

  // Suppress only known ad-blocker related errors for analytics
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      const message = typeof args[0] === 'string' ? args[0] : '';
      // Only suppress known ad-blocker related analytics errors
      if (message.includes('Vercel Web Analytics') ||
          message.includes('google-analytics') ||
          message.includes('doubleclick.net')) {
        return;
      }
      originalError.apply(console, args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

  // Prevent body scroll when cart drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  // Handle visibility change - refresh data when user returns to tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Clear cache when user returns to ensure fresh data
        if (typeof api.clearCache === 'function') {
          api.clearCache();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Preload critical data for instant first load
  useEffect(() => {
    const preloadCriticalData = async () => {
      try {
        // Preload magazines
        await api.get('/magazines?limit=6');
        // Preload featured stories
        await api.get('/stories/homepage');
        // Preload latest stories
        await api.get('/stories/latest?limit=10');
      } catch {
        // Silent fail
      }
    };

    // Start preloading immediately
    preloadCriticalData();
  }, []);

  return (
    <div className="app">
      {/* Toast Notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastClassName="african-toast"
      />

      {/* Main Header - Hidden on auth, terms, privacy, forgot-password, and opportunity detail pages */}
      {location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/terms' && location.pathname !== '/privacy' && location.pathname !== '/forgot-password' && !location.pathname.startsWith('/opportunities/') && <Header />}



      {/* Shopping Cart Drawer (Slides from right) */}
      <CartDrawer />


      {/* Main Content Area */}
      <Routes>
        {/* Home */}
        <Route path="/" element={<LandingPage />} />


        {/* Merchandise Routes */}
        <Route path="/merchandise" element={<StorePage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/merchandise/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/success" element={<CheckoutSuccessPage />} />

        {/* Community Routes */}
        <Route path="/communities" element={<CommunityPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/opportunities" element={<OpportunitiesPage />} />
        <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />
        <Route path="/community/music" element={<MusicPage />} />

        {/* Information Pages */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/mission" element={<MissionPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/writers" element={<WritersPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/partner" element={<PartnerPage />} />
        <Route path="/partner-with-us" element={<PartnerPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        {/* Authentication */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* User Account Pages */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Business Pages */}
        <Route path="/advertise" element={<AdvertisePage />} />
        <Route path="/subscribe" element={<SubscribePage />} />
        <Route path="/donate" element={<DonatePage />} />

        {/* Gallery Page */}
        <Route path="/gallery" element={<GalleryPage />} />

        {/* Magazine Routes */}
        <Route path="/magazines" element={<MagazinesPage />} />
        <Route path="/magazines/:slug" element={<MagazineDetailPage />} />

        {/* Story Routes */}
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/stories/:slug" element={<StoryDetailPage />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Footer - Hidden on login, signup, settings, cart, orders, contributors, stories, magazines, writers, partner, advertise, events, podcast detail, author detail, terms, privacy, search, forgot-password, opportunity detail, and community pages */}
      {location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/settings' && location.pathname !== '/cart' && location.pathname !== '/orders' && !location.pathname.match(/^\/community\/contributors/) && !location.pathname.startsWith('/stories') && !location.pathname.startsWith('/magazines') && location.pathname !== '/writers' && location.pathname !== '/partner' && location.pathname !== '/partner-with-us' && location.pathname !== '/advertise' && location.pathname !== '/events' && location.pathname !== '/community/music' && !location.pathname.match(/^\/podcast\/\d+/) && !location.pathname.startsWith('/author') && location.pathname !== '/terms' && location.pathname !== '/privacy' && location.pathname !== '/search' && location.pathname !== '/forgot-password' && !location.pathname.startsWith('/opportunities/') && !location.pathname.startsWith('/communities') && <Footer />}

      {/* Quick View Modal (can be added here) */}
      {/* <QuickViewModal /> */}

      {/* Vercel Analytics - Only include if properly configured */}
      {import.meta.env.VITE_VERCEL_ANALYTICS_ID && <Analytics />}
    </div>
  );
}

export default App;