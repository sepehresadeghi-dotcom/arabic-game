var CACHE_NAME = "arabic-game-v4";

self.addEventListener("install", function(event) {
  self.skipWaiting(); // این خط باعث میشه فوراً آپدیت بشه
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(key) {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function(event) {
  // این بخش همیشه اول میره از اینترنت میگیره، اگه نبود از کش میخونه
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});
