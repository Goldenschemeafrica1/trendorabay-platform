const CACHE_NAME = 'trendorabay-v5';
const API_CACHE_NAME = 'trendorabay-api-v5';
const urlsToCache = [
  '/',
  '/magazines',
  '/stories',
  '/podcasts',
  '/merchandise'
];

// Install event - cache critical resources and activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })))
          .catch(() => Promise.resolve());
      })
  );
});

// Handle skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch event - network first for navigations, cache first for assets
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    event.respondWith(fetch(event.request));
    return;
  }

  // Skip third-party analytics and tracking requests
  const url = new URL(event.request.url);
  if (url.hostname.includes('doubleclick.net') ||
      url.hostname.includes('google-analytics.com') ||
      url.hostname.includes('googletagmanager.com') ||
      url.hostname.includes('googlesyndication.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (event.request.url.includes('/api/')) {
    // Network first for API calls in production to avoid stale data
    // Only use cache as fallback when network fails
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            // Clone response before caching to avoid "body already used" error
            const responseToCache = networkResponse.clone();
            caches.open(API_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch((error) => {
          // Network failed, try to return cached response
          return caches.open(API_CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // No cache available, return error response
              return new Response('Network error - API unavailable', {
                status: 503,
                headers: new Headers({ 'Content-Type': 'text/plain' })
              });
            });
          });
        })
    );
    return;
  }

  const isNavigation = event.request.mode === 'navigate';

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (isNavigation) {
        // Always try network first for HTML pages so updates show immediately
        return fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch((error) => {
            // If network fails and we have a cached version, return it
            if (cachedResponse) {
              return cachedResponse;
            }
            // Otherwise, return a basic offline page or redirect to home
            return caches.match('/').then((homeResponse) => {
              return homeResponse || new Response('Offline - Please check your connection', {
                status: 503,
                headers: new Headers({ 'Content-Type': 'text/plain' })
              });
            });
          });
      }

      // For assets, serve from cache and update in the background
      if (cachedResponse) {
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {
          // Silent fail - asset update failed but cached version is still available
        });
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // If network fails and we have a cached version, return it
        if (cachedResponse) {
          return cachedResponse;
        }
        // For non-navigation requests, just let it fail silently
        return new Response('Network error', {
          status: 503,
          headers: new Headers({ 'Content-Type': 'text/plain' })
        });
      });
    })
  );
});

// Activate event - clean up old caches and take control of pages immediately
self.addEventListener('activate', (event) => {
  self.clients.claim();
  const cacheWhitelist = [CACHE_NAME, API_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
