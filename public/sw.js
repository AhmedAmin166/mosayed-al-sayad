// Service Worker for Mosayed Al-Sayad PWA Offline Caching
const CACHE_NAME = 'mosayed-cache-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Let network requests pass through, or fallback if offline
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
