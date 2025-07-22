const CACHE_NAME = 'ev-charge-time-calculator-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/favicon-96x96.png',
    '/favicon.ico',
    '/apple-touch-icon.png',
    '/site.webmanifest',
    '/web-app-manifest-192x192.png',
    '/web-app-manifest-512x512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
