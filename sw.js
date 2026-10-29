var CACHE_NAME = "arabic-game-v2";
var urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(key) {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request).then(function(res) {
        return caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, res.clone());
          return res;
        });
      });
    }).catch(function() {
      return caches.match("./index.html");
    })
  );
});
