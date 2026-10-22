const CACHE_NAME = 'health-report-v2'; // ভার্সন পরিবর্তন করা হলো
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
  'https://accounts.google.com/gsi/client'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // নতুন সার্ভিস ওয়ার্কার সাথে সাথে অ্যাক্টিভ করার জন্য
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // addAll এর বদলে আলাদা আলাদা করে ক্যাশ করা হচ্ছে যাতে একটি ফেইল করলেও অন্যগুলো সেভ হয়
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => console.log('Failed to cache:', url));
          })
        );
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // পুরোনো ভার্সন ডিলিট করা
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request);
      })
  );
});
