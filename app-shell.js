/* ============================================================
   中津くらしナビ app-shell.js

   役割：全ページ共通の「読み込みリスト」を1箇所にまとめる。
   各HTMLページはこのファイル1つを読み込むだけでOK。

   ★今後、新しいデータファイルを追加する時★
   → 下の SCRIPTS 配列に1行足すだけでOK（HTMLを5個も直さなくてよい）

   ページごとの違いは、各HTMLの中の
     <script>window.NAKATSU_PAGE = "shops";</script>
   の1行だけで表現する（phase1-features.js 等がこれを見て表示を切り替える）。

   読み込み方式：<script src>を動的に生成し、前のファイルの読み込み完了を
   待ってから次を読み込む（現在のindex.htmlと同じ「上から順番に実行」を再現）。
   ============================================================ */

(function () {
  "use strict";

  var STYLES = [
    "style.css?v=9",
    "design-refresh.css?v=2"
  ];

  var SCRIPTS = [
    "script.js?v=9",

    "data/izakaya2-extra.js?v=1",
    "data/ramen-extra.js?v=1",
    "data/parking-extra.js?v=1",
    "data/cafe-extra.js?v=1",
    "data/lunch-extra.js?v=2",
    "data/yakiniku-sushi-extra.js?v=1",
    "data/shopping-extra.js?v=1",
    "data/hotel-extra.js?v=1",
    "data/beauty-extra.js?v=1",
    "data/car-extra.js?v=1",

    "bulk-facilities-001.js?v=1",
    "bulk-facilities-002.js?v=1",
    "bulk-facilities-003.js?v=1",
    "bulk-facilities-004.js?v=1",

    "food-extra-all.js?v=1",

    "safety-cleanup-extra.js?v=1",
    "official-url-extra.js?v=1",
    "official-url-extra-002.js?v=1",
    "official-url-extra-003.js?v=1",
    "real-only-extra.js?v=1",
    "instagram-extra-001.js?v=1",
    "instagram-extra-002.js?v=1",

    "supabase-config.js?v=3",
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2",
    "supabase-auth.js?v=2",
    "dynamic-facilities-extra.js?v=5", 
  
     "ranking.js?v=1",
    "ui-extra.js?v=1",
    "ai-detail-extra.js?v=1",
    "home-page-extra.js?v=1",
    "about-extra.js?v=1",

    "core-upgrade.js?v=1",

         "design-refresh.js?v=2",
    "phase1-features.js?v=1",
    "phase2-features.js?v=1",
    "phase3-features.js?v=1",
    "phase4-shop-status.js?v=1",
    "status-note-extra.js?v=2",
    "phase6-business-upgrade.js?v=7",
      "phase6-position-fix.js?v=1"
     "shop-profile-public.js?v=2"
  ];

  /* 現在実行中の app-shell.js 自身のURLから、サイトのベースパスを割り出す
     （どのページ／どんなフォルダ階層から読んでも相対パスが壊れないように） */
  function getBasePath() {
    var current = document.currentScript && document.currentScript.src;
    if (!current) return "./";
    return current.replace(/app-shell\.js.*$/, "");
  }

  var BASE = getBasePath();

  function loadStyles() {
    STYLES.forEach(function (href) {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = BASE + href;
      document.head.appendChild(link);
    });
  }

  function loadScriptsSequentially(list, index, done) {
    if (index >= list.length) { done(); return; }

    var src = list[index];
    var isAbsolute = /^https?:\/\//.test(src);

    var script = document.createElement("script");
    script.src = isAbsolute ? src : BASE + src;
    script.onload = function () { loadScriptsSequentially(list, index + 1, done); };
    script.onerror = function () {
      console.warn("[app-shell] 読み込み失敗（続行します）:", src);
      loadScriptsSequentially(list, index + 1, done);
    };
    document.body.appendChild(script);
  }

  loadStyles();
  loadScriptsSequentially(SCRIPTS, 0, function () {
    document.dispatchEvent(new CustomEvent("nakatsu:app-ready"));
  });
})();
