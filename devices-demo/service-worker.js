
/**
 * On Install Event
 * Triggered when the service worker is installed
 */
self.addEventListener('install', function (event) {
  console.log('[Service Worker] Install:', event);

  // Skip waiting phase before activation
  self.skipWaiting();
});


/**
 * On Activate Event
 * Triggered when the service worker is activated
 */
self.addEventListener('activate', function (event) {
  console.log('[Service Worker] Activate:', event);

  // Claims control over all uncontrolled tabs/windows
  event.waitUntil(clients.claim());
});


/**
 * On Fetch Event
 * Triggered when the service worker retrieves an asset
 */
self.addEventListener('fetch', function (event) {

  // Network only
  event.respondWith(
    fetch(event.request)
  );
});