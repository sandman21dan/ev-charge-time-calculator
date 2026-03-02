/// <reference lib="webworker" />
import { manifest, version } from '@parcel/service-worker';

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener('install', (event: ExtendableEvent) => {
    sw.skipWaiting();
    event.waitUntil(
        caches.open(version)
            .then(cache => {
                console.log('Opened cache', version);
                return cache.addAll(manifest);
            })
    );
});

sw.addEventListener('activate', (event: ExtendableEvent) => {
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
