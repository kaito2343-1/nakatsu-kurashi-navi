/* ============================================================
   中津くらしナビ service-worker.js

   方針：
   - 初回アクセス時に「アプリの土台」となるファイルをまとめてキャッシュ
   - HTML はネット優先（新しい情報を優先しつつ、オフライン時はキャッシュへ）
   - JS/CSS/画像はキャッシュ優先（表示を速く、通信量を減らす）
   - オフライン時でもトップページが開けるようにする

   バージョンを上げるタイミング：
   index.html や script.js など「土台ファイル」を書き換えたら、
   下の CACHE_VERSION の数字を上げてください（例: v1 → v2）。
   上げないと、古いキャッシュのままになることがあります。
   ============================================================ */

const CACHE_VERSION = "v4";
const CACHE_NAME = "nakatsu-kurashi-navi-" + CACHE_VERSION;

/* アプリの土台として最初にキャッシュしておくファイル一覧
   ※ページの中身が増えても、読み込むJS/CSSの一覧は app-shell.js
     1箇所にまとまっているので、ここでは各HTMLページと
     app-shell.js・manifest・アイコンだけ書けばOK */
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
  "./app-shell.js",
  "./supabase-auth.js?v=1",
  "./phase4-shop-status.js?v=1",
  "./shop-dashboard.js?v=1",

  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

/* ---------- インストール：土台ファイルをキャッシュ ---------- */
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return Promise.all(
        APP_SHELL.map(function (url) {
          return cache.add(url).catch(function (err) {
            // 1つのファイルが読めなくても他は続けてキャッシュする
            console.warn("[service-worker] キャッシュ失敗:", url, err);
          });
        })
      );
    })
  );
  self.skipWaiting();
});

/* ---------- 有効化：古いバージョンのキャッシュを削除 ---------- */
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) {
            return key.indexOf("nakatsu-kurashi-navi-") === 0 && key !== CACHE_NAME;
          })
          .map(function (key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

/* ---------- 通信の割り振り ---------- */
self.addEventListener("fetch", function (event) {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // 他ドメイン（Googleフォント・Supabase・地図など）はそのまま素通し
  if (url.origin !== self.location.origin) return;

  // ページ本体（HTML）：ネット優先、失敗したらキャッシュ、それも無ければトップページ
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(request, copy); });
          return response;
        })
        .catch(function () {
          return caches.match(request).then(function (cached) {
            return cached || caches.match("./index.html") || caches.match("./");
          });
        })
    );
    return;
  }

  // それ以外（JS/CSS/画像など）：キャッシュ優先、無ければ取りに行ってキャッシュへ保存
  event.respondWith(
    caches.match(request).then(function (cached) {
      if (cached) return cached;

      return fetch(request)
        .then(function (response) {
          if (response && response.status === 200 && response.type === "basic") {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(function (cache) { cache.put(request, copy); });
          }
          return response;
        })
        .catch(function () {
          // 画像など、無くても致命的でないものは何も返さない
          return undefined;
        });
    })
  );
});
