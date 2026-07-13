/* ============================================================
   中津くらしナビ service-worker.js

   初回アクセス時に必要なファイルをキャッシュします。
   HTMLはネット優先、CSS・JS・画像はキャッシュ優先です。
   ============================================================ */

const CACHE_VERSION = "v6";

const CACHE_NAME =
  "nakatsu-kurashi-navi-" + CACHE_VERSION;

const APP_SHELL = [
  "./",
  "./index.html",
  "./shops.html",
  "./tourism.html",
  "./rankings.html",
  "./favorites.html",
  "./business.html",
  "./shop-dashboard.html",

  "./style.css?v=9",
  "./design-refresh.css?v=2",
  "./manifest.webmanifest",
  "./app-shell.js?v=11",
  "./local-app-theme.css?v=2",
  "./local-app-theme.js?v=1",
  "./supabase-auth.js?v=1",
  "./phase4-shop-status.js?v=1",
  "./shop-dashboard.js?v=1",

  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

/* インストール */
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return Promise.all(
        APP_SHELL.map(function (url) {
          return cache.add(url).catch(function (error) {
            console.warn(
              "[service-worker] キャッシュ失敗:",
              url,
              error
            );
          });
        })
      );
    })
  );

  self.skipWaiting();
});

/* 古いキャッシュを削除 */
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) {
            return (
              key.indexOf(
                "nakatsu-kurashi-navi-"
              ) === 0 &&
              key !== CACHE_NAME
            );
          })
          .map(function (key) {
            return caches.delete(key);
          })
      );
    })
  );

  self.clients.claim();
});

/* 通信処理 */
self.addEventListener("fetch", function (event) {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  /* 外部サイトのファイルは通常通信 */
  if (url.origin !== self.location.origin) {
    return;
  }

  /* HTMLページはネット優先 */
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          const copy = response.clone();

          caches
            .open(CACHE_NAME)
            .then(function (cache) {
              cache.put(request, copy);
            });

          return response;
        })
        .catch(function () {
          return caches
            .match(request)
            .then(function (cached) {
              return (
                cached ||
                caches.match("./index.html") ||
                caches.match("./")
              );
            });
        })
    );

    return;
  }

  /* CSS・JS・画像はキャッシュ優先 */
  event.respondWith(
    caches.match(request).then(function (cached) {
      if (cached) {
        return cached;
      }

      return fetch(request)
        .then(function (response) {
          if (
            response &&
            response.status === 200 &&
            response.type === "basic"
          ) {
            const copy = response.clone();

            caches
              .open(CACHE_NAME)
              .then(function (cache) {
                cache.put(request, copy);
              });
          }

          return response;
        })
        .catch(function () {
          return new Response("", {
            status: 408,
            statusText: "Offline"
          });
        });
    })
  );
});
