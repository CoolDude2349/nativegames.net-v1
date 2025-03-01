const CACHE_NAME = 'offline-cache-v1';

self.addEventListener('install', (event) => {
    event.waitUntil(
        fetch('/generateFileList.php') 
            .then(response => response.json())
            .then(files => caches.open(CACHE_NAME).then(cache => cache.addAll(files)))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200) {
                    return networkResponse;
                }
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
                return networkResponse;
            });
        }).catch(() => caches.match('/nativegames.net-v1/play/DogeMiner/')) // Offline fallback
    );
});
