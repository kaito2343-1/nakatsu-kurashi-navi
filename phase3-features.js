/* ============================================================
   中津くらしナビ phase3-features.js（ページ分割対応）

   このファイルでやっていること：
   1. 旧・単一ページ前提だったウィジェットを片付ける
      （ホームヒーロー / できることパネル / 居酒屋ランキング）
      → 同等の内容は新しいページ構成（index.html各種）に引き継ぎ済み
   2. 下部ナビ（ホーム／検索／お気に入り／掲載依頼）を
      ページ間リンクとして動くように配線し直す
   3. 現在のページに応じて、下部ナビ・ハンバーガーメニューの
      「今ここ」表示を合わせる

   読み込み位置：phase1-features.js・phase2-features.js の後
   ============================================================ */

(function () {
  "use strict";

  var PAGE = window.NAKATSU_PAGE || "shops";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* =========================================================
     1. 旧ウィジェットの後片付け
        （中身は新ページ側で作り直しているため、ここでは重複表示を防ぐだけ）
  ========================================================= */
  function retireLegacyWidgets() {
    var idsToRemove = ["izakayaRanking", "homeUiPanel"];
    idsToRemove.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.remove();
    });

    $all(".home-hero-extra, .home-about-extra, .home-category-extra").forEach(function (el) {
      el.remove();
    });
  }

  /* =========================================================
     2. 下部ナビをページ間リンクとして配線し直す
        （ui-extra.js が付けた元のクリック処理より先に横取りする）
  ========================================================= */
  function rewireBottomNav() {
    var nav = document.getElementById("bottomNav");
    if (!nav || nav.dataset.p3Rewired) return;
    nav.dataset.p3Rewired = "1";

    nav.addEventListener("click", function (e) {
      var btn = e.target.closest(".bottom-nav-btn");
      if (!btn || !nav.contains(btn)) return;

      // capture段階で先取りし、ui-extra.js側の元の挙動（同一ページ内スクロール前提）を止める
      e.stopImmediatePropagation();
      e.preventDefault();

      nav.querySelectorAll(".bottom-nav-btn").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");

      var action = btn.dataset.nav;
      if (typeof window.NAKATSU_GO_TO_PAGE !== "function") return;

      if (action === "home") window.NAKATSU_GO_TO_PAGE("home");
      if (action === "search") window.NAKATSU_GO_TO_PAGE("shops");
      if (action === "fav") window.NAKATSU_GO_TO_PAGE("favorites");
      if (action === "request") window.NAKATSU_GO_TO_PAGE("business");
    }, true);

    syncBottomNavActive();
  }

  function syncBottomNavActive() {
    var nav = document.getElementById("bottomNav");
    if (!nav) return;

    var actionByPage = { home: "home", shops: "search", favorites: "fav", business: "request" };
    var current = actionByPage[PAGE];

    nav.querySelectorAll(".bottom-nav-btn").forEach(function (b) {
      b.classList.toggle("is-active", current ? b.dataset.nav === current : false);
    });
  }

  /* =========================================================
     3. 初期化
  ========================================================= */
  function init() {
    retireLegacyWidgets();
    rewireBottomNav();

    /* 追加データや遅延ウィジェットが後から来ても、重複表示を防ぐ */
    document.addEventListener("nakatsu:facilities-updated", retireLegacyWidgets);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(init, 250);
    });
  } else {
    setTimeout(init, 250);
  }
})();
