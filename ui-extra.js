/* ============================================================
   中津くらしナビ：人気カテゴリ・今日よく使うカード・下部固定メニュー
   ============================================================ */

(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function scrollToElement(el) {
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function setKeyword(keyword) {
    const input = document.getElementById("keywordInput");
    if (!input) return;

    input.value = keyword;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus({ preventScroll: true });
    scrollToElement(document.querySelector(".search-section"));
  }

  function resetAll() {
    const resetBtn = document.getElementById("resetBtn");
    if (resetBtn) resetBtn.click();
  }

  function clickCategory(label) {
    const buttons = Array.from(document.querySelectorAll(".cat-btn"));
    const target = buttons.find(function (btn) {
      return (btn.textContent || "").includes(label);
    });

    if (target) {
      target.click();
      setTimeout(function () {
        scrollToElement(document.querySelector("main"));
      }, 80);
    } else {
      setKeyword(label);
    }
  }

  function addStyle() {
    if (document.getElementById("uiExtraStyle")) return;

    const style = document.createElement("style");
    style.id = "uiExtraStyle";
    style.textContent = `
      body {
        padding-bottom: 86px;
      }

      .home-ui-panel {
        margin: 14px 16px 0;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .quick-panel,
      .popular-panel {
        background: rgba(255, 255, 255, 0.96);
        border-radius: 24px;
        padding: 16px;
        box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
      }

      .home-ui-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 10px;
        margin-bottom: 12px;
      }

      .home-ui-title {
        margin: 0;
        font-size: 18px;
        font-weight: 900;
        color: #111827;
        line-height: 1.35;
      }

      .home-ui-sub {
        margin: 0;
        font-size: 12px;
        font-weight: 800;
        color: #0f766e;
        white-space: nowrap;
      }

      .quick-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .quick-card {
        border: none;
        border-radius: 20px;
        padding: 14px 12px;
        min-height: 94px;
        text-align: left;
        color: #111827;
        background: #f8fafc;
        box-shadow: inset 0 0 0 1px rgba(226, 232, 240, 0.9);
        cursor: pointer;
        font-family: inherit;
      }

      .quick-card:active,
      .popular-chip:active,
      .bottom-nav-btn:active {
        transform: scale(0.97);
      }

      .quick-card-icon {
        display: block;
        font-size: 27px;
        line-height: 1;
        margin-bottom: 10px;
      }

      .quick-card-title {
        display: block;
        font-size: 15px;
        font-weight: 900;
        line-height: 1.35;
      }

      .quick-card-note {
        display: block;
        margin-top: 4px;
        font-size: 11px;
        font-weight: 700;
        color: #64748b;
        line-height: 1.35;
      }

      .quick-card.is-night {
        background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
      }

      .quick-card.is-ramen {
        background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      }

      .quick-card.is-parking {
        background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      }

      .quick-card.is-open {
        background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      }

      .popular-chip-row {
        display: flex;
        gap: 9px;
        overflow-x: auto;
        padding-bottom: 2px;
        -webkit-overflow-scrolling: touch;
      }

      .popular-chip {
        flex: none;
        border: none;
        border-radius: 999px;
        padding: 11px 14px;
        color: #111827;
        background: #f8fafc;
        font-size: 14px;
        font-weight: 900;
        box-shadow: 0 8px 18px rgba(15, 23, 42, 0.10);
        cursor: pointer;
        font-family: inherit;
        white-space: nowrap;
      }

      .popular-chip.is-ramen { background: #fee2e2; }
      .popular-chip.is-izakaya { background: #ffedd5; }
      .popular-chip.is-parking { background: #dbeafe; }
      .popular-chip.is-hospital { background: #fce7f3; }

      .bottom-nav {
        position: fixed;
        left: 50%;
        bottom: 12px;
        transform: translateX(-50%);
        z-index: 120;
        width: min(398px, calc(100% - 24px));
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 6px;
        padding: 8px;
        background: rgba(17, 24, 39, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 24px;
        box-shadow: 0 18px 38px rgba(0, 0, 0, 0.26);
        backdrop-filter: blur(14px);
      }

      .bottom-nav-btn {
        border: none;
        border-radius: 18px;
        padding: 8px 4px 7px;
        color: rgba(255, 255, 255, 0.78);
        background: transparent;
        font-family: inherit;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
      }

      .bottom-nav-btn.is-active,
      .bottom-nav-btn:hover {
        color: #111827;
        background: #ffffff;
      }

      .bottom-nav-icon {
        font-size: 20px;
        line-height: 1;
      }

      .bottom-nav-label {
        font-size: 10px;
        font-weight: 900;
        line-height: 1;
      }

      @media (max-width: 360px) {
        .quick-grid {
          grid-template-columns: 1fr;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createHomePanels() {
    if (document.getElementById("homeUiPanel")) return;

    const notice = document.querySelector(".notice-banner");
    const searchSection = document.querySelector(".search-section");
    const parent = notice ? notice.parentNode : document.querySelector(".app");
    const insertBefore = searchSection || (notice ? notice.nextSibling : null);

    if (!parent) return;

    const panel = document.createElement("section");
    panel.id = "homeUiPanel";
    panel.className = "home-ui-panel";
    panel.innerHTML = `
      <div class="quick-panel">
        <div class="home-ui-head">
          <h2 class="home-ui-title">今日よく使う</h2>
          <p class="home-ui-sub">ワンタップ検索</p>
        </div>
        <div class="quick-grid">
          <button type="button" class="quick-card is-night" data-action="category" data-value="居酒屋・夜ご飯">
            <span class="quick-card-icon">🍻</span>
            <span class="quick-card-title">夜ご飯を探す</span>
            <span class="quick-card-note">居酒屋・夜のご飯</span>
          </button>
          <button type="button" class="quick-card is-ramen" data-action="category" data-value="ラーメン">
            <span class="quick-card-icon">🍜</span>
            <span class="quick-card-title">ラーメンを探す</span>
            <span class="quick-card-note">中津市の麺系</span>
          </button>
          <button type="button" class="quick-card is-parking" data-action="category" data-value="駐車場">
            <span class="quick-card-icon">🅿️</span>
            <span class="quick-card-title">駐車場を探す</span>
            <span class="quick-card-note">駅周辺・最大料金</span>
          </button>
          <button type="button" class="quick-card is-open" data-action="openNow">
            <span class="quick-card-icon">🟢</span>
            <span class="quick-card-title">営業中っぽい施設</span>
            <span class="quick-card-note">確認できた施設のみ</span>
          </button>
        </div>
      </div>

      <div class="popular-panel">
        <div class="home-ui-head">
          <h2 class="home-ui-title">人気カテゴリ</h2>
          <p class="home-ui-sub">よく見る項目</p>
        </div>
        <div class="popular-chip-row">
          <button type="button" class="popular-chip is-ramen" data-category="ラーメン">🍜 ラーメン</button>
          <button type="button" class="popular-chip is-izakaya" data-category="居酒屋・夜ご飯">🍻 居酒屋</button>
          <button type="button" class="popular-chip is-parking" data-category="駐車場">🅿️ 駐車場</button>
          <button type="button" class="popular-chip is-hospital" data-category="病院・歯医者">🏥 病院</button>
        </div>
      </div>
    `;

    if (insertBefore) {
      parent.insertBefore(panel, insertBefore);
    } else {
      parent.appendChild(panel);
    }

    panel.querySelectorAll("[data-category]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        clickCategory(btn.dataset.category || "");
      });
    });

    panel.querySelectorAll(".quick-card").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const action = btn.dataset.action;
        const value = btn.dataset.value || "";

        if (action === "category") {
          clickCategory(value);
          return;
        }

        if (action === "openNow") {
          const checkbox = document.getElementById("openNowToggle");
          if (checkbox && !checkbox.checked) {
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event("change", { bubbles: true }));
          }
          scrollToElement(document.querySelector("main"));
        }
      });
    });
  }

  function createBottomNav() {
    if (document.getElementById("bottomNav")) return;

    const nav = document.createElement("nav");
    nav.id = "bottomNav";
    nav.className = "bottom-nav";
    nav.setAttribute("aria-label", "下部メニュー");
    nav.innerHTML = `
      <button type="button" class="bottom-nav-btn is-active" data-nav="home">
        <span class="bottom-nav-icon">🏠</span>
        <span class="bottom-nav-label">ホーム</span>
      </button>
      <button type="button" class="bottom-nav-btn" data-nav="search">
        <span class="bottom-nav-icon">🔎</span>
        <span class="bottom-nav-label">検索</span>
      </button>
      <button type="button" class="bottom-nav-btn" data-nav="fav">
        <span class="bottom-nav-icon">⭐</span>
        <span class="bottom-nav-label">お気に入り</span>
      </button>
      <button type="button" class="bottom-nav-btn" data-nav="request">
        <span class="bottom-nav-icon">📩</span>
        <span class="bottom-nav-label">掲載依頼</span>
      </button>
    `;

    document.body.appendChild(nav);

    nav.querySelectorAll(".bottom-nav-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        nav.querySelectorAll(".bottom-nav-btn").forEach(function (b) {
          b.classList.remove("is-active");
        });
        btn.classList.add("is-active");

        const action = btn.dataset.nav;

        if (action === "home") {
          resetAll();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }

        if (action === "search") {
          const input = document.getElementById("keywordInput");
          scrollToElement(document.querySelector(".search-section"));
          setTimeout(function () {
            if (input) input.focus();
          }, 300);
        }

        if (action === "fav") {
          const favBtn = document.getElementById("favOnlyBtn");
          if (favBtn) favBtn.click();
          scrollToElement(document.querySelector("main"));
        }

        if (action === "request") {
          const requestBtn = document.getElementById("postRequestBtn");
          if (requestBtn) requestBtn.click();
        }
      });
    });
  }

  ready(function () {
    addStyle();
    createHomePanels();
    createBottomNav();
  });
})();
