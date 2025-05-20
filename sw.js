const CACHE_NAME = 'pwa-mock-v1';
const urlsToCache = ['./', './index.html', './style.css', './main.js', './map.png', './manifest.webmanifest'];

// インストール（指定したファイルをキャッシュに登録）
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

// フェッチ（キャッシュファースト） TODO: 新たにキャッシュに追加したり、古いキャッシュを更新したりする仕組みを検討
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
