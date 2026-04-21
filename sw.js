const CACHE_NAME = 'service-report-v2.0'; // Изменили имя кэша!
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png' // Укажите ваши реальные названия иконок, если они другие
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // Принудительно устанавливаем новый SW
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Удаляем все старые кэши, имя которых не совпадает с текущим
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Захватываем контроль над открытыми страницами
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Возвращаем из кэша, если есть, иначе идем в сеть
        return response || fetch(event.request);
      })
  );
});
