const CACHE_NAME = 'chat-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/chat-socket.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.7.5/socket.io.js',
];

// Instalar o Service Worker e fazer cache dos arquivos
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    }),
  );
});

// Intercepta as requisições e responde com o cache, se disponível
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }),
  );
});

// Atualizar o cache quando houver novas versões
self.addEventListener('activate', function (event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
