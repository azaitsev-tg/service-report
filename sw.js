const CACHE_NAME = 'tg-service-report-v1';

// Список файлов, которые нужно сохранить в память телефона для работы без сети
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    // Сохраняем внешнюю библиотеку PDF локально!
    'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js' 
];

// Установка: скачиваем всё в кэш
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Кэширование файлов...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Активация: удаляем старые версии кэша, если мы обновили приложение
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Перехват запросов: если нет сети, отдаем из кэша
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Если файл есть в кэше — отдаем его, иначе лезем в интернет
            return response || fetch(event.request);
        }).catch(() => {
            // Если нет ни сети, ни кэша (страховка)
            return caches.match('./index.html');
        })
    );
});