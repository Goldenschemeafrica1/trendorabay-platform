import magazineRoutes from '../routes/magazines.js';
import storyRoutes from '../routes/stories.js';
import podcastRoutes from '../routes/podcasts.js';
import merchandiseRoutes from '../routes/merchandise.js';
import orderRoutes from '../routes/orders.js';
import paymentRoutes from '../routes/payments.js';
import userRoutes from '../routes/users.js';
import contributorRoutes from '../routes/contributors.js';
import podcastHostRoutes from '../routes/podcastHosts.js';
import podcastGuestApplicationRoutes from '../routes/podcastGuestApplications.js';
import advertisementRoutes from '../routes/advertisements.js';
import inquiryRoutes from '../routes/inquiries.js';
import pitchRoutes from '../routes/pitches.js';
import partnerRoutes from '../routes/partners.js';
import eventRoutes from '../routes/events.js';
import contactRoutes from '../routes/contact.js';
import authorRoutes from '../routes/authors.js';
import teamRoutes from '../routes/team.js';
import galleryRoutes from '../routes/gallery.js';
import analyticsRoutes from '../routes/analytics.js';
import opportunityRoutes from '../routes/opportunities.js';
import communityRoutes from '../routes/communities.js';
import communityPostRoutes from '../routes/communityPosts.js';
import communityDiscussionRoutes from '../routes/communityDiscussions.js';
import writeApplicationRoutes from '../routes/writeApplications.js';

const API_VERSION = process.env.API_VERSION || 'v1';

export function setupRoutes(app) {
  // API Routes with versioning
  app.use(`/api/${API_VERSION}/users`, userRoutes);
  app.use(`/api/${API_VERSION}/magazines`, magazineRoutes);
  app.use(`/api/${API_VERSION}/stories`, storyRoutes);
  app.use(`/api/${API_VERSION}/podcasts`, podcastRoutes);
  app.use(`/api/${API_VERSION}/podcast-hosts`, podcastHostRoutes);
  app.use(`/api/${API_VERSION}/podcast-guest-applications`, podcastGuestApplicationRoutes);
  app.use(`/api/${API_VERSION}/merchandise`, merchandiseRoutes);
  app.use(`/api/${API_VERSION}/products`, merchandiseRoutes); // Alias for frontend compatibility
  app.use(`/api/${API_VERSION}/orders`, orderRoutes);
  app.use(`/api/${API_VERSION}/payments`, paymentRoutes);
  app.use(`/api/${API_VERSION}/contributors`, contributorRoutes);
  app.use(`/api/${API_VERSION}/advertisements`, advertisementRoutes);
  app.use(`/api/${API_VERSION}/inquiries`, inquiryRoutes);
  app.use(`/api/${API_VERSION}/pitches`, pitchRoutes);
  app.use(`/api/${API_VERSION}/partners`, partnerRoutes);
  app.use(`/api/${API_VERSION}/events`, eventRoutes);
  app.use(`/api/${API_VERSION}/contact`, contactRoutes);
  app.use(`/api/${API_VERSION}/authors`, authorRoutes);
  app.use(`/api/${API_VERSION}/team`, teamRoutes);
  app.use(`/api/${API_VERSION}/gallery`, galleryRoutes);
  app.use(`/api/${API_VERSION}/analytics`, analyticsRoutes);
  app.use(`/api/${API_VERSION}/opportunities`, opportunityRoutes);
  app.use(`/api/${API_VERSION}/communities`, communityRoutes);
  app.use(`/api/${API_VERSION}/community-posts`, communityPostRoutes);
  app.use(`/api/${API_VERSION}/community-discussions`, communityDiscussionRoutes);
  app.use(`/api/${API_VERSION}/write-applications`, writeApplicationRoutes);

  // Legacy API routes (backward compatibility - will be deprecated)
  app.use('/api/users', userRoutes);
  app.use('/api/magazines', magazineRoutes);
  app.use('/api/stories', storyRoutes);
  app.use('/api/podcasts', podcastRoutes);
  app.use('/api/podcast-hosts', podcastHostRoutes);
  app.use('/api/podcast-guest-applications', podcastGuestApplicationRoutes);
  app.use('/api/merchandise', merchandiseRoutes);
  app.use('/api/products', merchandiseRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/contributors', contributorRoutes);
  app.use('/api/advertisements', advertisementRoutes);
  app.use('/api/inquiries', inquiryRoutes);
  app.use('/api/pitches', pitchRoutes);
  app.use('/api/partners', partnerRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/authors', authorRoutes);
  app.use('/api/team', teamRoutes);
  app.use('/api/gallery', galleryRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/opportunities', opportunityRoutes);
  app.use('/api/communities', communityRoutes);
  app.use('/api/community-posts', communityPostRoutes);
  app.use('/api/community-discussions', communityDiscussionRoutes);
  app.use('/api/write-applications', writeApplicationRoutes);
}
