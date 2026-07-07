/* ============================================================
   中津くらしナビ phase5-bottom-nav-fix.js
   目的：
   1. 下部メニュー「検索」を押したら検索欄へ移動
   2. 検索ボタンを押したら検索結果へ移動
   3. 下部メニュー「お気に入り」を押したら保存リストへ移動
   4. お気に入り保存リストの二重表示を防ぐ
   ============================================================ */

(function () {
  "use strict";

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function scrollToTarget(target, offset) {
    if (!target) return;

    var y = target.getBoundingClientRect().top + window.pageYOffset - (offset || 12);
    if (y < 0) y = 0;

    window.scrollTo({
      top: y,
      behavior: "smooth"
    });
  }

  function getSearchArea() {
    return $(".hero-search") || $("#keywordInput") || $("main");
  }

  function getResultArea() {
    return $("#resultCount") || $("#cardList") || $("main");
  }

  function getFavoriteArea() {
    return $("#phase4FavoritePanel") || $("#phase3FavoritePanel") || $(".hero-search");
  }

  function focusSearchInput() {
    var input = $("#keywordInput");
    if (!input) return;

    setTimeout(function () {
      input.focus({ preventScroll: true });
    }, 300);
  }

  function moveToSearchArea() {
    scrollToTarget(getSearchArea(), 12);
    focusSearchInput();
  }

  function moveToResults() {
    var hero = $(".hero-search");
    var offset = 100;

    if (hero) {
      offset = Math.min(Math.max(hero.getBoundingClientRect().height + 12, 100), window.innerHeight * 0.72);
    }

    scrollToTarget(getResultArea(), offset);
  }

  function moveToFavorites() {
    var target = getFavoriteArea();
    scrollToTarget(target, 12);

    if (target) {
      target.classList.add("phase5-pulse");
      setTimeout(function () {
        target.classList.remove("phase5-pulse");
      }, 900);
    }
  }

  function hideDuplicateFavoritePanel() {
    var phase3 = $("#phase3FavoritePanel");
    var phase4 = $("#phase4FavoritePanel");

    if (phase3 && phase4) {
      phase3.style.display = "none";
    }
  }

  function hookBottomNav() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest(".bottom-nav-btn");
      if (!btn) return;

      var nav = btn.dataset.nav;

      if (nav === "search") {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();

        moveToSearchArea();
      }

      if (nav === "fav") {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();

        moveToFavorites();
      }
    }, true);
  }

  function hookSearchButton() {
    var form = $("#searchForm");
    var searchBtn = $("#searchBtn");
    var input = $("#keywordInput");

    function searchAndMove() {
      if (typeof state !== "undefined") {
        state.keyword = input ? input.value.trim() : "";
        if (state.category === "favorites") {
          state.category = "all";
        }
      }

      if (typeof render === "function") {
        render();
      }

      setTimeout(moveToResults, 80);
      setTimeout(moveToResults, 280);
      setTimeout(moveToResults, 650);
    }

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();

        searchAndMove();
      }, true);
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();

        searchAndMove();
      }, true);
    }

    if (input) {
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          searchAndMove();
        }
      }, true);
    }
  }

  function hookFavoriteButtonMove() {
    document.addEventListener("click", function (e) {
      var favBtn = e.target.closest && e.target.closest(".fav-btn");
      if (!favBtn) return;

      setTimeout(function () {
        hideDuplicateFavoritePanel();
        moveToFavorites();
      }, 350);
    }, true);
  }

  function addStyle() {
    if ($("#phase5Style")) return;

    var style = document.createElement("style");
    style.id = "phase5Style";
    style.textContent = `
      #phase3FavoritePanel {
        display: none !important;
      }

      .phase5-pulse {
        box-shadow: 0 0 0 4px rgba(249,115,22,.25), 0 8px 22px rgba(15,23,42,.12) !important;
        transform: scale(1.01);
        transition: .2s ease;
      }
    `;

    document.head.appendChild(style);
  }

  function init() {
    addStyle();
    hideDuplicateFavoritePanel();
    hookBottomNav();
    hookSearchButton();
    hookFavoriteButtonMove();

    setTimeout(hideDuplicateFavoritePanel, 700);
    setTimeout(hideDuplicateFavoritePanel, 1500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(init, 700);
    });
  } else {
    setTimeout(init, 700);
  }
})();
