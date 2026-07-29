import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Analytics } from '@vercel/analytics/react';
import api from './services/api';

// Layout Components
import Advert from './components/Advert';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ScrollToTop from './components/common/ScrollToTop';
import LoadingSpinner from './components/common/LoadingSpinner';
import './App.css';
import './components/magazines/LatestMagazine.css';

// Page Components
import HomePage from './pages/HomePage/HomePage';
import MagazinesPage from './pages/MagazinesPage/MagazinesPage';
import MagazineDetailPage from './pages/MagazinesPage/MagazineDetailPage';
import MagazineCategoryPage from './pages/MagazinesPage/MagazineCategoryPage';
import StorePage from './pages/StorePage/StorePage';
import ProductDetailPage from './pages/StorePage/ProductDetailPage';
import StoriesPage from './pages/StoriesPage/StoriesPage';
import StoryDetailPage from './pages/StoriesPage/StoryDetailPage';
import AuthorPage from './pages/StoriesPage/AuthorPage';
import LatestStoriesPage from './pages/StoriesPage/LatestStoriesPage';
import CartPage from './pages/StorePage/CartPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import CheckoutSuccessPage from './pages/CheckoutPage/CheckoutSuccessPage';
import CommunityHubPage from './pages/CommunityPage/CommunityHubPage';
import EventsPage from './components/events/EventsPage';
import ContributorsPage from './pages/CommunityPage/ContributorsPage';
import ContributorDetailsPage from './pages/CommunityPage/ContributorDetailsPage';
import AboutPage from './pages/AboutPage/AboutPage';
import MissionPage from './pages/MissionPage/MissionPage';
import ContactPage from './pages/ContactPage/ContactPage';
import WriteForUsPage from './pages/WriteForUsPage/WriteForUsPage';
import PartnerPage from './pages/PartnerPage/PartnerPage';
import FAQPage from './pages/FAQPage/FAQPage';
import TermsPage from './pages/Legal/TermsPage';
import PrivacyPage from './pages/Legal/PrivacyPage';
import PodcastsPage from './pages/PodcastsPage/PodcastsPage';
import PodcastDetail from './pages/PodcastDetail/PodcastDetail';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage';
import AdvertisePage from './pages/AdvertisePage/AdvertisePage';
import SubscribePage from './pages/SubscribePage/SubscribePage';
import DonatePage from './pages/DonatePage/DonatePage';
import OrdersPage from './pages/OrdersPage/OrdersPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import GalleryPage from './pages/GalleryPage/GalleryPage';
import SearchPage from './pages/SearchPage/SearchPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isLoading, theme } = useSelector(state => state.ui);
  const { isDrawerOpen } = useSelector(state => state.cart);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
    // Analytics tracking can be added here via a proper analytics service
  }, [location]);

  // Suppress Vercel Analytics console errors when blocked by ad blockers
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('Vercel Web Analytics')) {
        return;
      }
      // Suppress advertisement fetch errors
      if (typeof args[0] === 'string' && args[0].includes('Error fetching advertisement')) {
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
        console.log('Tab became visible, cache cleared for fresh data');
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
        console.log('Critical data preloaded for instant first load');
      } catch (error) {
        console.log('Preload failed, will load on demand:', error.message);
      }
    };

    // Start preloading immediately
    preloadCriticalData();
  }, []);

  return (
    <div className="app">
      {/* Loading Spinner */}
      {isLoading && <LoadingSpinner />}

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

      {/* Advertisement Bar - Hidden on magazine listing page, podcast, merchandise, cart, login, signup, about, store, author, contributors, terms, privacy, donate, contact, write-for-us, write, partner, partner-with-us, faq, subscribe, settings, orders, profile, gallery, search, and forgot-password pages */}
      {location.pathname !== '/magazines' && !location.pathname.startsWith('/magazines/category') && location.pathname !== '/podcast' && !location.pathname.match(/^\/podcast\/\d+/) && location.pathname !== '/merchandise' && location.pathname !== '/cart' && location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/about' && location.pathname !== '/store' && !location.pathname.startsWith('/author') && location.pathname !== '/community/contributors' && !location.pathname.match(/^\/community\/contributors\/\d+/) && location.pathname !== '/terms' && location.pathname !== '/privacy' && location.pathname !== '/donate' && location.pathname !== '/contact' && location.pathname !== '/write-for-us' && location.pathname !== '/write' && !location.pathname.startsWith('/partner') && location.pathname !== '/faq' && location.pathname !== '/subscribe' && location.pathname !== '/settings' && location.pathname !== '/orders' && location.pathname !== '/profile' && location.pathname !== '/gallery' && location.pathname !== '/search' && location.pathname !== '/forgot-password' && <Advert />}

      {/* Shopping Cart Drawer (Slides from right) */}
      <CartDrawer />


      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Main Content Area */}
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />


        {/* Magazines Routes */}
        <Route path="/magazines" element={<MagazinesPage />} />
        <Route path="/magazines/category/:category" element={<MagazineCategoryPage />} />
        <Route path="/magazines/:slug" element={<MagazineDetailPage />} />

        {/* Merchandise Routes */}
        <Route path="/merchandise" element={<StorePage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/merchandise/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/success" element={<CheckoutSuccessPage />} />

        {/* Stories Routes (Read-only) */}
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/stories/latest" element={<LatestStoriesPage />} />
        <Route path="/stories/:slug" element={<StoryDetailPage />} />
        <Route path="/author/:id" element={<AuthorPage />} />


        {/* Community Routes */}
        <Route path="/community" element={<CommunityHubPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/community/contributors" element={<ContributorsPage />} />
        <Route path="/community/contributors/:id" element={<ContributorDetailsPage />} />

        {/* Information Pages */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/mission" element={<MissionPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/write" element={<WriteForUsPage />} />
        <Route path="/write-for-us" element={<WriteForUsPage />} />
        <Route path="/partner" element={<PartnerPage />} />
        <Route path="/partner-with-us" element={<PartnerPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        {/* Podcasts Page */}
        <Route path="/podcast" element={<PodcastsPage />} />
        <Route path="/podcast/:id" element={<PodcastDetail />} />

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

        {/* Search Page */}
        <Route path="/search" element={<SearchPage />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Footer - Hidden on login, signup, settings, cart, orders, contributors, stories, about, magazines, write, partner, advertise, events, podcast detail, author detail, terms, privacy, search, and forgot-password pages */}
      {location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/settings' && location.pathname !== '/cart' && location.pathname !== '/orders' && !location.pathname.match(/^\/community\/contributors/) && !location.pathname.startsWith('/stories') && location.pathname !== '/about' && !location.pathname.startsWith('/magazines') && location.pathname !== '/write' && location.pathname !== '/write-for-us' && location.pathname !== '/partner' && location.pathname !== '/partner-with-us' && location.pathname !== '/advertise' && location.pathname !== '/events' && !location.pathname.match(/^\/podcast\/\d+/) && !location.pathname.startsWith('/author') && location.pathname !== '/terms' && location.pathname !== '/privacy' && location.pathname !== '/search' && location.pathname !== '/forgot-password' && <Footer />}

      {/* Quick View Modal (can be added here) */}
      {/* <QuickViewModal /> */}

      {/* Vercel Analytics */}
      <Analytics />
    </div>
  );
}

export default App;