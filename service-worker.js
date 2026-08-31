const CACHE_NAME = 'file-downloader-v1';
const ASSETS = [
  './file-downloader.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // نخدم من الكاش فقط ملفات الواجهة (HTML/CSS/JS/الأيقونات)
  // ونترك طلبات تحميل الملفات (fetch للروابط الخارجية) تمر عادي بدون تدخل
  const url = new URL(event.request.url);
  const isAppShell = ASSETS.some((a) => url.pathname.endsWith(a.replace('./', '')));

  if (isAppShell) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
  }
});
