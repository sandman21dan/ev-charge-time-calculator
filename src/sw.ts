/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE_NAME = 'ev-charge-time-calculator-v4';
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

sw.addEventListener('install', (event: ExtendableEvent) => {
    sw.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

sw.addEventListener('activate', (event: ExtendableEvent) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => sw.clients.claim())
    );
});

sw.addEventListener('fetch', (event: FetchEvent) => {
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
