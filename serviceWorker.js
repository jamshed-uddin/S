const CACHE_NAME = "VERSION1";
const urlToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/index.js",
  "/images/logo144.png",
  "/images/logo152.png",
  "/images/logo192.png",
  "/images/logo384.png",
  "/images/logo512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // console.log("cache opened");
      return cache.addAll(urlToCache);
    })
  );
});

self.addEventListener("fetch", (e) => {
  // console.log("url", e.request.url);
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

self.addEventListener("activate", (e) => {
  const cacheWhiteList = [];
  cacheWhiteList.push(CACHE_NAME);
  e.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhiteList.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
