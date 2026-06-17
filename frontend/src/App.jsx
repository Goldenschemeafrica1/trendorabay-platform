import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Analytics } from '@vercel/analytics/react';

// Layout Components
import Advert from './components/Advert';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import NewsletterPopup from './components/common/NewsletterPopup';
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
import CommunityEventsPage from './pages/CommunityPage/EventsPage';
import ContributorsPage from './pages/CommunityPage/ContributorsPage';
import AboutPage from './pages/AboutPage/AboutPage';
import MissionPage from './pages/MissionPage/MissionPage';
import ContactPage from './pages/ContactPage/ContactPage';
import WriteForUsPage from './pages/WriteForUsPage/WriteForUsPage';
import FAQPage from './pages/FAQPage/FAQPage';
import TermsPage from './pages/Legal/TermsPage';
import PrivacyPage from './pages/Legal/PrivacyPage';
import PodcastsPage from './pages/PodcastsPage/PodcastsPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import AdvertisePage from './pages/AdvertisePage/AdvertisePage';
import SubscribePage from './pages/SubscribePage/SubscribePage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isLoading } = useSelector(state => state.ui);
  const { isDrawerOpen } = useSelector(state => state.cart);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Track page views for analytics
  useEffect(() => {
    // You can add analytics tracking here
    console.log('Page viewed:', location.pathname);
  }, [location]);

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

      {/* Main Header with Navigation */}
      <Header />

      {/* Navigation Menu */}
      <Navigation />

      {/* Advertisement Bar - Hidden on magazine pages, podcast, merchandise, cart, login, and signup pages */}
      {!location.pathname.startsWith('/magazines') && location.pathname !== '/podcast' && location.pathname !== '/merchandise' && location.pathname !== '/cart' && location.pathname !== '/login' && location.pathname !== '/signup' && <Advert />}

      {/* Shopping Cart Drawer (Slides from right) */}
      <CartDrawer />

      {/* Newsletter Popup (Appears after 30 seconds) */}
      <NewsletterPopup delay={30000} />

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Main Content Area */}
      <main className="main-content">
        <Routes>
          {/* Home */}
          <Route path="/" element={<HomePage />} />

          
          {/* Magazines Routes */}
          <Route path="/magazines" element={<MagazinesPage />} />
          <Route path="/magazines/category/:category" element={<MagazineCategoryPage />} />
          <Route path="/magazines/:id" element={<MagazineDetailPage />} />

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
          <Route path="/stories/:id" element={<StoryDetailPage />} />
          <Route path="/author/:id" element={<AuthorPage />} />


          {/* Community Routes */}
          <Route path="/community" element={<CommunityHubPage />} />
          <Route path="/community/events" element={<CommunityEventsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/community/contributors" element={<ContributorsPage />} />

          {/* Information Pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/mission" element={<MissionPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/write" element={<WriteForUsPage />} />
          <Route path="/write-for-us" element={<WriteForUsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          {/* Podcasts Page */}
          <Route path="/podcast" element={<PodcastsPage />} />

          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Business Pages */}
          <Route path="/advertise" element={<AdvertisePage />} />
          <Route path="/subscribe" element={<SubscribePage />} />

          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Quick View Modal (can be added here) */}
      {/* <QuickViewModal /> */}

      {/* Vercel Analytics */}
      <Analytics />
    </div>
  );
}

export default App;