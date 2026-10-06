const CACHE_NAME = "data-siswa-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json"
];


self.addEventListener("install", function(event) {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(function(cache) {

        return cache.addAll(
          FILES_TO_CACHE
        );

      })

  );

});


self.addEventListener("activate", function(event) {

  event.waitUntil(

    caches.keys()
      .then(function(cacheNames) {

        return Promise.all(

          cacheNames.map(
            function(cacheName) {

              if (
                cacheName !== CACHE_NAME
              ) {

                return caches.delete(
                  cacheName
                );

              }

            }
          )

        );

      })

  );

});


self.addEventListener("fetch", function(event) {

  event.respondWith(

    fetch(event.request)
      .catch(function() {

        return caches.match(
          event.request
        );

      })

  );

});
