const CACHE_NAME = "my-cache-v1";

// Cache the URLs you want at installation
const urlsToCache = [
  "/nativegames.net-v1",
  "/nativegames.net-v1.index.html"
];

// Cache all resources (including assets like images, CSS, JS)
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Precache the URLs listed
      return cache.addAll(urlsToCache);
    })
  );
});

// Respond with cached resources when available, or fetch from the network
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      // Return cached response if found, else fetch from network
      return (
        cachedResponse ||
        fetch(e.request).then((response) => {
          // If it's a network response, clone and cache it
          const clonedResponse = response.clone();
          if (
            e.request.url.startsWith("http://") ||
            e.request.url.startsWith("https://")
          ) {
            e.waitUntil(
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(e.request, clonedResponse);
              })
            );
          }
          return response;
        })
      );
    })
  );
});

// Clean up old caches when the service worker is activated
self.addEventListener("activate", (e) => {
  const cacheWhitelist = [CACHE_NAME];
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      // Delete caches that are not in the whitelist
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
