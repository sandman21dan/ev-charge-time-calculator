import {manifest, version} from '@parcel/service-worker';

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(version)
            .then(cache => {
                console.log('Opened cache');
                console.log('Manifest');
                console.log(manifest);
                return cache.addAll(manifest);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== version) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
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
