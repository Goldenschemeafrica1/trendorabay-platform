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
import AdvertisePage from './pages/AdvertisePage/AdvertisePage';
import SubscribePage from './pages/SubscribePage/SubscribePage';
import DonatePage from './pages/DonatePage/DonatePage';
import OrdersPage from './pages/OrdersPage/OrdersPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
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
    // Analytics tracking can be added here via a proper analytics service
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

      {/* Main Header - Hidden on login, signup, terms, and privacy pages */}
      {location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/terms' && location.pathname !== '/privacy' && <Header />}

      {/* Advertisement Bar - Hidden on magazine pages, podcast, merchandise, cart, login, signup, about, store, stories, author, contributors, terms, privacy, donate, events, contact, write-for-us, write, partner, partner-with-us, faq, subscribe, settings, orders, and profile pages */}
      {!location.pathname.startsWith('/magazines') && location.pathname !== '/podcast' && !location.pathname.match(/^\/podcast\/\d+/) && location.pathname !== '/merchandise' && location.pathname !== '/cart' && location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/about' && location.pathname !== '/store' && !location.pathname.startsWith('/stories') && !location.pathname.startsWith('/author') && location.pathname !== '/community/contributors' && !location.pathname.match(/^\/community\/contributors\/\d+/) && location.pathname !== '/terms' && location.pathname !== '/privacy' && location.pathname !== '/donate' && location.pathname !== '/events' && location.pathname !== '/contact' && location.pathname !== '/write-for-us' && location.pathname !== '/write' && !location.pathname.startsWith('/partner') && location.pathname !== '/faq' && location.pathname !== '/subscribe' && location.pathname !== '/settings' && location.pathname !== '/orders' && location.pathname !== '/profile' && !location.pathname.match(/^\/stories\/\d+/) && <Advert />}

      {/* Shopping Cart Drawer (Slides from right) */}
      <CartDrawer />

      {/* Newsletter Popup (Appears after 30 seconds) */}
      <NewsletterPopup delay={30000} />

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Main Content Area */}
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

        {/* User Account Pages */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Business Pages */}
        <Route path="/advertise" element={<AdvertisePage />} />
        <Route path="/subscribe" element={<SubscribePage />} />
        <Route path="/donate" element={<DonatePage />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Footer - Hidden on login, signup, settings, cart, orders, contributors, stories, about, magazines, write, partner, advertise, events, podcast detail, author detail, terms, and privacy pages */}
      {location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/settings' && location.pathname !== '/cart' && location.pathname !== '/orders' && !location.pathname.match(/^\/community\/contributors/) && !location.pathname.startsWith('/stories') && location.pathname !== '/about' && !location.pathname.startsWith('/magazines') && location.pathname !== '/write' && location.pathname !== '/write-for-us' && location.pathname !== '/partner' && location.pathname !== '/partner-with-us' && location.pathname !== '/advertise' && location.pathname !== '/events' && !location.pathname.match(/^\/podcast\/\d+/) && !location.pathname.startsWith('/author') && location.pathname !== '/terms' && location.pathname !== '/privacy' && <Footer />}

      {/* Quick View Modal (can be added here) */}
      {/* <QuickViewModal /> */}

      {/* Vercel Analytics */}
      <Analytics />
    </div>
  );
}

export default App;