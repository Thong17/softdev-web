self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  if (request.url.includes("/backend")) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open("api-cache").then((cache) => {
            cache.put(request, clone);
          });
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // ✅ Static assets = cache first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((res) => {
        caches.open("app-cache").then((cache) => {
          cache.put(request, res.clone());
        });
        return res;
      });
    })
  );
});

