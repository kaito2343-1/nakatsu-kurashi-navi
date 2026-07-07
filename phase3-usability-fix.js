/* ============================================================
   中津くらしナビ phase3-usability-fix.js
   目的：
   1. 検索ボタンを押したら、検索結果エリアまで自動で移動する
   2. お気に入りを「保存リスト」として実用化する
   3. お気に入り追加後に、上部で確認・呼び出しできるようにする

   読み込み位置：
   phase2-features.js の後
   ============================================================ */

(function () {
  "use strict";

  const FAVORITES_KEY = "nakatsu_kurashi_navi_favorites";

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
      const saved = localStorage.getItem(FAVORITES_KEY);
      const arr = saved ? JSON.parse(saved) : [];
      return Array.isArray(arr) ? arr.map(Number).filter(Boolean) : [];
    } catch (e) {
      return [];
    }
  }

  function saveFavorites(ids) {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids.map(Number).filter(Boolean)));
    } catch (e) {
      console.warn("お気に入り保存に失敗しました", e);
    }
  }

  function syncStateFavorites() {
    if (typeof state === "undefined") return;
    state.favorites = getFavorites();
  }

  function showMiniToast(message) {
    if (typeof showToast === "function") {
      showToast(message);
      return;
    }

    let toast = $("#toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(function () {
      toast.classList.remove("show");
    }, 1800);
  }

  function scrollToResults() {
    const heading = $(".section-heading");
    const resultCount = $("#resultCount");
    const cardList = $("#cardList");
    const target = heading || resultCount || cardList;

    if (!target) return;

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function addSearchResultNotice() {
    if ($("#phase3SearchNotice")) return;

    const resultCount = $("#resultCount");
    if (!resultCount) return;

    const notice = document.createElement("p");
    notice.id = "phase3SearchNotice";
    notice.className = "phase3-search-notice";
    notice.textContent = "検索すると、ここに結果が表示されます。";

    resultCount.parentNode.insertBefore(notice, resultCount.nextSibling);
  }

  function updateSearchNotice() {
    const notice = $("#phase3SearchNotice");
    if (!notice || typeof state === "undefined") return;

    if (state.keyword) {
      notice.textContent = "「" + state.keyword + "」の検索結果を表示中です。";
      notice.hidden = false;
    } else {
      notice.textContent = "検索すると、ここに結果が表示されます。";
      notice.hidden = false;
    }
  }

  function hookSearchButton() {
    const form = $("#searchForm");
    const input = $("#keywordInput");
    const searchBtn = $("#searchBtn");

    if (!form || !input) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (typeof state !== "undefined") {
        state.keyword = input.value.trim();
      }

      if (typeof render === "function") {
        render();
      }

      updateSearchNotice();

      setTimeout(scrollToResults, 80);
      setTimeout(scrollToResults, 260);

      if (input.value.trim()) {
        showMiniToast("検索結果を表示しました");
      } else {
        showMiniToast("すべての施設を表示しました");
      }
    });

    if (searchBtn) {
      searchBtn.addEventListener("click", function () {
        setTimeout(scrollToResults, 120);
      });
    }
  }

  function buildFavoritePanel() {
    if ($("#phase3FavoritePanel")) return;

    const hero = $(".hero-search");
    if (!hero) return;

    const panel = document.createElement("section");
    panel.id = "phase3FavoritePanel";
    panel.className = "phase3-favorite-panel";
    panel.innerHTML =
      '<div class="phase3-fav-head">' +
        '<strong>⭐ お気に入り保存リスト</strong>' +
        '<span id="phase3FavCount">0件</span>' +
      '</div>' +
      '<p class="phase3-fav-help">気になるお店を保存して、あとでまとめて見られます。</p>' +
      '<div id="phase3FavList" class="phase3-fav-list"></div>' +
      '<div class="phase3-fav-actions">' +
        '<button type="button" id="phase3ShowFavBtn">お気に入りだけ見る</button>' +
        '<button type="button" id="phase3ClearFavBtn">全解除</button>' +
      '</div>';

    hero.appendChild(panel);

    const showBtn = $("#phase3ShowFavBtn");
    const clearBtn = $("#phase3ClearFavBtn");

    if (showBtn) {
      showBtn.addEventListener("click", function () {
        syncStateFavorites();

        if (typeof state !== "undefined") {
          state.category = "favorites";
          state.keyword = "";

          const input = $("#keywordInput");
          if (input) input.value = "";
        }

        if (typeof render === "function") render();

        renderFavoritePanel();
        setTimeout(scrollToResults, 100);
        showMiniToast("お気に入りだけ表示しました");
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        const ok = confirm("お気に入りをすべて解除しますか？");
        if (!ok) return;

        saveFavorites([]);

        if (typeof state !== "undefined") {
          state.favorites = [];
          if (state.category === "favorites") {
            state.category = "all";
          }
        }

        if (typeof render === "function") render();

        renderFavoritePanel();
        showMiniToast("お気に入りをすべて解除しました");
      });
    }
  }

  function renderFavoritePanel() {
    syncStateFavorites();

    const countEl = $("#phase3FavCount");
    const listEl = $("#phase3FavList");

    if (!listEl) return;

    const favIds = getFavorites();
    const favFacilities = typeof facilities !== "undefined"
      ? favIds
          .map(function (id) {
            return facilities.find(function (f) {
              return Number(f.id) === Number(id);
            });
          })
          .filter(Boolean)
      : [];

    if (countEl) {
      countEl.textContent = favFacilities.length + "件";
    }

    if (favFacilities.length === 0) {
      listEl.innerHTML = '<p class="phase3-fav-empty">まだお気に入りがありません。カード右上の☆を押すと保存できます。</p>';
      return;
    }

    listEl.innerHTML = favFacilities.map(function (f) {
      return (
        '<button type="button" class="phase3-fav-chip" data-id="' + escapeHtml(f.id) + '">' +
          '<span class="phase3-fav-chip-name">' + escapeHtml(f.name) + '</span>' +
          '<span class="phase3-fav-chip-cat">' + escapeHtml(f.category || "") + '</span>' +
        '</button>'
      );
    }).join("");

    $all(".phase3-fav-chip", listEl).forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = Number(btn.dataset.id);
        const f = facilities.find(function (item) {
          return Number(item.id) === id;
        });

        if (!f) return;

        if (typeof state !== "undefined") {
          state.category = "all";
          state.keyword = f.name;

          const input = $("#keywordInput");
          if (input) input.value = f.name;
        }

        if (typeof render === "function") render();

        updateSearchNotice();
        setTimeout(scrollToResults, 100);
      });
    });
  }

  function updateFavoriteButtons() {
    const favIds = getFavorites();

    $all(".fav-btn").forEach(function (btn) {
      const id = Number(btn.dataset.id);
      const active = favIds.indexOf(id) !== -1;

      btn.textContent = active ? "★" : "☆";
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      btn.classList.toggle("is-favorite", active);
    });
  }

  function hookFavoriteButtons() {
    document.addEventListener("click", function (e) {
      const btn = e.target.closest(".fav-btn");
      if (!btn) return;

      const id = Number(btn.dataset.id);
      if (!id) return;

      setTimeout(function () {
        syncStateFavorites();
        renderFavoritePanel();
        updateFavoriteButtons();
      }, 220);
    });
  }

  function hookRenderAftercare() {
    const originalRender = window.render;

    if (typeof originalRender !== "function") return;
    if (originalRender.__phase3Wrapped) return;

    window.render = function () {
      originalRender.apply(this, arguments);

      setTimeout(function () {
        syncStateFavorites();
        renderFavoritePanel();
        updateFavoriteButtons();
        updateSearchNotice();
      }, 30);
    };

    window.render.__phase3Wrapped = true;
  }

  function addStyle() {
    if ($("#phase3Style")) return;

    const style = document.createElement("style");
    style.id = "phase3Style";
    style.textContent = `
      .phase3-search-notice {
        margin: 0 0 12px;
        color: var(--muted, #6b7280);
        font-size: 13px;
      }

      .phase3-favorite-panel {
        margin-top: 12px;
        background: rgba(255,255,255,0.82);
        border: 1px solid rgba(20,107,100,0.14);
        border-radius: 16px;
        padding: 12px;
      }

      .phase3-fav-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        color: var(--main-dark, #0d4d47);
      }

      #phase3FavCount {
        font-size: 12px;
        font-weight: 800;
        color: #fff;
        background: var(--main, #146b64);
        border-radius: 999px;
        padding: 3px 9px;
      }

      .phase3-fav-help {
        margin: 5px 0 8px;
        font-size: 12px;
        color: var(--muted, #6b7280);
      }

      .phase3-fav-list {
        display: flex;
        gap: 7px;
        overflow-x: auto;
        padding-bottom: 4px;
      }

      .phase3-fav-empty {
        margin: 0;
        font-size: 12px;
        color: var(--muted, #6b7280);
      }

      .phase3-fav-chip {
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

      .phase3-fav-chip-name {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
      }

      .phase3-fav-chip-cat {
        display: block;
        font-size: 10px;
        opacity: 0.72;
      }

      .phase3-fav-actions {
        display: flex;
        gap: 8px;
        margin-top: 9px;
      }

      .phase3-fav-actions button {
        border: 0;
        border-radius: 12px;
        padding: 9px 10px;
        font-weight: 800;
        cursor: pointer;
      }

      #phase3ShowFavBtn {
        background: var(--main, #146b64);
        color: #fff;
      }

      #phase3ClearFavBtn {
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
      console.warn("phase3-usability-fix.js: facilities/state が見つかりません。読み込み順を確認してください。");
      return;
    }

    syncStateFavorites();
    addStyle();
    addSearchResultNotice();
    buildFavoritePanel();
    hookSearchButton();
    hookFavoriteButtons();
    hookRenderAftercare();

    if (typeof render === "function") {
      render();
    }

    renderFavoritePanel();
    updateFavoriteButtons();
    updateSearchNotice();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(init, 300);
    });
  } else {
    setTimeout(init, 300);
  }
})();
