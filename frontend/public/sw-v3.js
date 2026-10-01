// Legacy service worker override: clear stale caches and serve fresh content until the new worker takes over.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
  // Remove all stale caches left by previous builds
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    })
  );
});

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

  // Let API calls go straight to the network
  if (event.request.url.includes('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Serve everything else from the network (no caching) so old pages don't flash.
  // Fall back to cache only if the user is offline.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
