/* ============================================================
   中津くらしナビ phase4-action-fix.js
   目的：
   1. 検索ボタンを押したら検索結果へ確実に移動する
   2. お気に入りボタンを押したら保存リストへ移動する
   ============================================================ */

(function () {
  "use strict";

  var FAVORITES_KEY = "nakatsu_kurashi_navi_favorites";

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getFavorites() {
    try {
      var saved = localStorage.getItem(FAVORITES_KEY);
      var arr = saved ? JSON.parse(saved) : [];
      return Array.isArray(arr) ? arr.map(Number).filter(Boolean) : [];
    } catch (e) {
      return [];
    }
  }

  function saveFavorites(ids) {
    var unique = [];

    ids.forEach(function (id) {
      id = Number(id);
      if (id && unique.indexOf(id) === -1) {
        unique.push(id);
      }
    });

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(unique));

    if (typeof state !== "undefined") {
      state.favorites = unique;
    }
  }

  function toast(message) {
    if (typeof showToast === "function") {
      showToast(message);
      return;
    }

    var t = $("#toast");
    if (!t) return;

    t.textContent = message;
    t.classList.add("show");
    setTimeout(function () {
      t.classList.remove("show");
    }, 1800);
  }

  function stickyOffset() {
    var hero = $(".hero-search");
    if (!hero) return 100;

    var h = hero.getBoundingClientRect().height;
    return Math.min(Math.max(h + 12, 100), window.innerHeight * 0.72);
  }

  function scrollToTarget(target, offset) {
    if (!target) return;

    var y = target.getBoundingClientRect().top + window.pageYOffset - offset;
    if (y < 0) y = 0;

    window.scrollTo({
      top: y,
      behavior: "smooth"
    });
  }

  function scrollToResults() {
    var target = $("#resultCount") || $("#cardList") || $("main");
    scrollToTarget(target, stickyOffset());
  }

  function scrollToFavoriteList() {
    var panel = $("#phase4FavoritePanel") || $("#phase3FavoritePanel") || $(".hero-search");
    scrollToTarget(panel, 12);

    if (panel) {
      panel.classList.add("phase4-pulse");
      setTimeout(function () {
        panel.classList.remove("phase4-pulse");
      }, 900);
    }
  }

  function ensureFavoritePanel() {
    if ($("#phase4FavoritePanel")) return;

    var hero = $(".hero-search");
    if (!hero) return;

    var panel = document.createElement("section");
    panel.id = "phase4FavoritePanel";
    panel.className = "phase4-favorite-panel";
    panel.innerHTML =
      '<div class="phase4-fav-head">' +
        '<strong>⭐ お気に入り保存リスト</strong>' +
        '<span id="phase4FavCount">0件</span>' +
      '</div>' +
      '<p class="phase4-fav-help">☆を押したお店がここに保存されます。保存した店を押すと、その店だけ表示できます。</p>' +
      '<div id="phase4FavList" class="phase4-fav-list"></div>' +
      '<div class="phase4-fav-actions">' +
        '<button type="button" id="phase4ShowFavBtn">お気に入りだけ見る</button>' +
        '<button type="button" id="phase4ClearFavBtn">全解除</button>' +
      '</div>';

    hero.appendChild(panel);

    $("#phase4ShowFavBtn").addEventListener("click", function () {
      if (typeof state !== "undefined") {
        state.favorites = getFavorites();
        state.category = "favorites";
        state.keyword = "";

        var input = $("#keywordInput");
        if (input) input.value = "";
      }

      if (typeof render === "function") render();

      renderFavoriteList();
      setTimeout(scrollToResults, 120);
      toast("お気に入りだけ表示しました");
    });

    $("#phase4ClearFavBtn").addEventListener("click", function () {
      if (!confirm("お気に入りをすべて解除しますか？")) return;

      saveFavorites([]);

      if (typeof state !== "undefined") {
        state.favorites = [];
        if (state.category === "favorites") {
          state.category = "all";
        }
      }

      if (typeof render === "function") render();

      renderFavoriteList();
      syncFavoriteButtons();
      toast("お気に入りをすべて解除しました");
    });
  }

  function renderFavoriteList() {
    ensureFavoritePanel();

    var favIds = getFavorites();
    var list = $("#phase4FavList");
    var count = $("#phase4FavCount");

    if (!list) return;

    var favFacilities = [];

    if (typeof facilities !== "undefined") {
      favFacilities = favIds.map(function (id) {
        return facilities.find(function (f) {
          return Number(f.id) === Number(id);
        });
      }).filter(Boolean);
    }

    if (count) {
      count.textContent = favFacilities.length + "件";
    }

    if (favFacilities.length === 0) {
      list.innerHTML = '<p class="phase4-fav-empty">まだお気に入りがありません。カード右上の☆を押すと保存できます。</p>';
      return;
    }

    list.innerHTML = favFacilities.map(function (f) {
      return (
        '<button type="button" class="phase4-fav-chip" data-id="' + escapeHtml(f.id) + '">' +
          '<span class="phase4-fav-name">' + escapeHtml(f.name) + '</span>' +
          '<span class="phase4-fav-cat">' + escapeHtml(f.category || "") + '</span>' +
        '</button>'
      );
    }).join("");

    $all(".phase4-fav-chip", list).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = Number(btn.dataset.id);
        var f = facilities.find(function (item) {
          return Number(item.id) === id;
        });

        if (!f) return;

        if (typeof state !== "undefined") {
          state.category = "all";
          state.keyword = f.name;

          var input = $("#keywordInput");
          if (input) input.value = f.name;
        }

        if (typeof render === "function") render();

        setTimeout(scrollToResults, 120);
      });
    });
  }

  function syncFavoriteButtons() {
    var favIds = getFavorites();

    $all(".fav-btn").forEach(function (btn) {
      var id = Number(btn.dataset.id);
      var active = favIds.indexOf(id) !== -1;

      btn.textContent = active ? "★" : "☆";
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      btn.classList.toggle("is-favorite", active);
    });
  }

  function toggleFavoriteAndMove(id) {
    if (typeof facilities === "undefined") return;

    var favIds = getFavorites();
    var index = favIds.indexOf(id);
    var added = index === -1;

    if (added) {
      favIds.push(id);
    } else {
      favIds.splice(index, 1);
    }

    saveFavorites(favIds);

    if (typeof state !== "undefined") {
      state.favorites = favIds;
    }

    if (typeof render === "function") render();

    renderFavoriteList();
    syncFavoriteButtons();

    var facility = facilities.find(function (f) {
      return Number(f.id) === Number(id);
    });

    var name = facility ? facility.name : "施設";

    toast(added ? "⭐「" + name + "」を保存しました" : "「" + name + "」を保存リストから外しました");

    setTimeout(scrollToFavoriteList, 120);
    setTimeout(scrollToFavoriteList, 420);
  }

  function runSearchAndMove() {
    var input = $("#keywordInput");

    if (typeof state !== "undefined") {
      state.keyword = input ? input.value.trim() : "";
      if (state.category === "favorites") {
        state.category = "all";
      }
    }

    if (typeof render === "function") render();

    setTimeout(scrollToResults, 80);
    setTimeout(scrollToResults, 260);
    setTimeout(scrollToResults, 620);

    toast("検索結果へ移動しました");
  }

  function hookActions() {
    var form = $("#searchForm");
    var input = $("#keywordInput");
    var searchBtn = $("#searchBtn");

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();

        runSearchAndMove();
      }, true);
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();

        runSearchAndMove();
      }, true);
    }

    if (input) {
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          runSearchAndMove();
        }
      }, true);
    }

    document.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest(".fav-btn");
      if (!btn) return;

      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();

      var id = Number(btn.dataset.id);
      if (!id) return;

      toggleFavoriteAndMove(id);
    }, true);
  }

  function addStyle() {
    if ($("#phase4Style")) return;

    var style = document.createElement("style");
    style.id = "phase4Style";
    style.textContent = `
      .phase4-favorite-panel {
        margin-top: 12px;
        background: rgba(255,255,255,.9);
        border: 1px solid rgba(20,107,100,.18);
        border-radius: 16px;
        padding: 12px;
        transition: .2s ease;
      }

      .phase4-pulse {
        box-shadow: 0 0 0 4px rgba(249,115,22,.25), 0 8px 22px rgba(15,23,42,.12);
        transform: scale(1.01);
      }

      .phase4-fav-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        color: var(--main-dark, #0d4d47);
      }

      #phase4FavCount {
        font-size: 12px;
        font-weight: 800;
        color: #fff;
        background: var(--main, #146b64);
        border-radius: 999px;
        padding: 3px 9px;
      }

      .phase4-fav-help {
        margin: 5px 0 8px;
        font-size: 12px;
        color: var(--muted, #6b7280);
      }

      .phase4-fav-list {
        display: flex;
        gap: 7px;
        overflow-x: auto;
        padding-bottom: 4px;
        -webkit-overflow-scrolling: touch;
      }

      .phase4-fav-empty {
        margin: 0;
        font-size: 12px;
        color: var(--muted, #6b7280);
      }

      .phase4-fav-chip {
        flex: 0 0 auto;
        border: 1px solid #fed7aa;
        background: #fff7ed;
        color: #9a3412;
        border-radius: 999px;
        padding: 8px 10px;
        font-weight: 800;
        cursor: pointer;
        max-width: 220px;
      }

      .phase4-fav-name {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
      }

      .phase4-fav-cat {
        display: block;
        font-size: 10px;
        opacity: .72;
      }

      .phase4-fav-actions {
        display: flex;
        gap: 8px;
        margin-top: 9px;
      }

      .phase4-fav-actions button {
        border: 0;
        border-radius: 12px;
        padding: 9px 10px;
        font-weight: 800;
        cursor: pointer;
      }

      #phase4ShowFavBtn {
        background: var(--main, #146b64);
        color: #fff;
      }

      #phase4ClearFavBtn {
        background: #f3f4f6;
        color: #374151;
      }

      .fav-btn.is-favorite {
        background: #f97316 !important;
        color: #fff !important;
      }
    `;

    document.head.appendChild(style);
  }

  function init() {
    if (typeof facilities === "undefined" || typeof state === "undefined") {
      console.warn("phase4-action-fix.js: facilities/state が見つかりません。");
      return;
    }

    state.favorites = getFavorites();

    addStyle();
    ensureFavoritePanel();
    renderFavoriteList();
    syncFavoriteButtons();
    hookActions();

    setTimeout(function () {
      renderFavoriteList();
      syncFavoriteButtons();
    }, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(init, 500);
    });
  } else {
    setTimeout(init, 500);
  }
})();
