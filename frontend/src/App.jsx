import React, { Suspense, useEffect, useLayoutEffect } from 'react';
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

// Lazy load page components for code splitting
const LandingPage = React.lazy(() => import('./pages/LandingPage/LandingPage'));
const StorePage = React.lazy(() => import('./pages/StorePage/StorePage'));
const ProductDetailPage = React.lazy(() => import('./pages/StorePage/ProductDetailPage'));
const CartPage = React.lazy(() => import('./pages/StorePage/CartPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage/CheckoutPage'));
const CheckoutSuccessPage = React.lazy(() => import('./pages/CheckoutPage/CheckoutSuccessPage'));
const EventsPage = React.lazy(() => import('./components/events/EventsPage'));
const OpportunitiesPage = React.lazy(() => import('./components/opportunities/OpportunitiesPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage/AboutPage'));
const MissionPage = React.lazy(() => import('./pages/MissionPage/MissionPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage/ContactPage'));
const WriteForUsPage = React.lazy(() => import('./pages/WriteForUsPage/WriteForUsPage'));
const PartnerPage = React.lazy(() => import('./pages/PartnerPage/PartnerPage'));
const TermsPage = React.lazy(() => import('./pages/Legal/TermsPage'));
const PrivacyPage = React.lazy(() => import('./pages/Legal/PrivacyPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage/LoginPage'));
const SignupPage = React.lazy(() => import('./pages/SignupPage/SignupPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage/ForgotPasswordPage'));
const AdvertisePage = React.lazy(() => import('./pages/AdvertisePage/AdvertisePage'));
const SubscribePage = React.lazy(() => import('./pages/SubscribePage/SubscribePage'));
const DonatePage = React.lazy(() => import('./pages/DonatePage/DonatePage'));
const OrdersPage = React.lazy(() => import('./pages/OrdersPage/OrdersPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage/SettingsPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage/ProfilePage'));
const GalleryPage = React.lazy(() => import('./pages/GalleryPage/GalleryPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage/NotFoundPage'));
const MagazineDetailPage = React.lazy(() => import('./pages/MagazinesPage/MagazineDetailPage'));
const MagazinesPage = React.lazy(() => import('./pages/MagazinesPage/MagazinesPage'));
const StoriesPage = React.lazy(() => import('./pages/StoriesPage/StoriesPage'));
const StoryDetailPage = React.lazy(() => import('./pages/StoryDetailPage/StoryDetailPage'));
const MusicPage = React.lazy(() => import('./pages/MusicPage/MusicPage'));
const WritersPage = React.lazy(() => import('./pages/WritersPage/WritersPage'));
const WriterApplicationPage = React.lazy(() => import('./pages/WriterApplicationPage/WriterApplicationPage'));
const CommunityPage = React.lazy(() => import('./pages/CommunityPage/CommunityPage'));

// Loading fallback component
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
    <div style={{ color: '#666', fontSize: '1.2rem' }}>Loading...</div>
  </div>
);

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

  // Suppress Vercel Analytics and Google Analytics console errors when blocked by ad blockers
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('Vercel Web Analytics')) {
        return;
      }
      // Suppress Google Analytics errors
      if (typeof args[0] === 'string' && (
        args[0].includes('google-analytics') ||
        args[0].includes('doubleclick.net') ||
        args[0].includes('Failed to fetch') && args[0].includes('google')
      )) {
        return;
      }
      // Suppress API errors for non-critical features
      if (typeof args[0] === 'string' && (
        args[0].includes('Failed to fetch comments') ||
        args[0].includes('Error checking follow status') ||
        args[0].includes('Failed to fetch likes') ||
        args[0].includes('Error fetching user data') ||
        args[0].includes('Error saving settings') ||
        args[0].includes('Ad image failed to load')
      )) {
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

      {/* Main Header - Hidden on login, signup, terms, privacy, and forgot-password pages */}
      {location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/terms' && location.pathname !== '/privacy' && location.pathname !== '/forgot-password' && <Header />}



      {/* Shopping Cart Drawer (Slides from right) */}
      <CartDrawer />


      {/* Main Content Area */}
      <Suspense fallback={<PageLoader />}>
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
          <Route path="/events" element={<EventsPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/music" element={<MusicPage />} />

          {/* Information Pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/mission" element={<MissionPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/write" element={<WriteForUsPage />} />
          <Route path="/write-for-us" element={<WriteForUsPage />} />
          <Route path="/partner" element={<PartnerPage />} />
          <Route path="/partner-with-us" element={<PartnerPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
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

          {/* Writers Page */}
          <Route path="/writers" element={<WritersPage />} />
          <Route path="/become-a-writer" element={<WritersPage />} />
          <Route path="/writers/writer-application" element={<WriterApplicationPage />} />

          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      {/* Footer - Hidden on login, signup, settings, cart, orders, contributors, stories, about, magazines, write, partner, advertise, events, podcast detail, author detail, terms, privacy, search, and forgot-password pages */}
      {location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/settings' && location.pathname !== '/cart' && location.pathname !== '/orders' && !location.pathname.match(/^\/community\/contributors/) && !location.pathname.startsWith('/stories') && location.pathname !== '/about' && !location.pathname.startsWith('/magazines') && location.pathname !== '/write' && location.pathname !== '/write-for-us' && location.pathname !== '/writers' && location.pathname !== '/become-a-writer' && location.pathname !== '/writers/writer-application' && location.pathname !== '/partner' && location.pathname !== '/partner-with-us' && location.pathname !== '/advertise' && location.pathname !== '/events' && location.pathname !== '/community' && location.pathname !== '/community/music' && !location.pathname.match(/^\/podcast\/\d+/) && !location.pathname.startsWith('/author') && location.pathname !== '/terms' && location.pathname !== '/privacy' && location.pathname !== '/search' && location.pathname !== '/forgot-password' && <Footer />}

      {/* Quick View Modal (can be added here) */}
      {/* <QuickViewModal /> */}

      {/* Vercel Analytics */}
      <Analytics />
    </div>
  );
}

export default App;