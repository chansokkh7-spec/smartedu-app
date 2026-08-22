// Minimal service worker — required by browsers before they'll show the
// "Install app" prompt. It doesn't do offline caching of app data (this app
// needs a live connection to Firebase anyway), it just satisfies the
// installability requirement and passes all requests straight through.
const CACHE = 'smartedu-shell-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(['./index.html'])).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Network-first, falling back to cache only if offline — this app is
  // online-only (Firebase), so we never want to serve a stale cached copy
  // while online.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
