self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open('ghost-v3').then(cache => cache.addAll([
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
  ])));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key !== 'ghost-v3').map(key => caches.delete(key))
  )));
});

self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
