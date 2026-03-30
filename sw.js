const CACHE = 'chatlinx-v3';

const ASSETS = [
  '/app/',
  '/app/index.html',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;

  // Only handle page navigation
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).catch(() => caches.match('/app/index.html'))
    );
    return;
  }

  // Everything else → network first
  e.respondWith(fetch(req));
});