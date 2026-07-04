/* ============================================================
   中津くらしナビ：使いやすさ向上パック
   ファイル名：ux-improvements-extra.js
   ============================================================ */

(function () {
  "use strict";

  window.NAKATSU_SPECIAL_FILTER = window.NAKATSU_SPECIAL_FILTER || "";

  function hasOfficial(facility) {
    if (window.NAKATSU_SOCIAL) return window.NAKATSU_SOCIAL.hasOfficialUrl(facility);
    return !!(facility && facility.officialUrl && String(facility.officialUrl).trim() !== "");
  }

  function hasInstagram(facility) {
    if (window.NAKATSU_SOCIAL) return !!window.NAKATSU_SOCIAL.getInstagramUrl(facility);

    const url =
      (facility && facility.instagramUrl) ||
      (facility && facility.snsUrls && facility.snsUrls.instagram) ||
      "";

    return typeof url === "string" && url.indexOf("https://") === 0 && url.indexOf("instagram.com/") !== -1;
  }

  function patchFilter() {
    if (window.__uxFilterPatched) return;

    if (typeof window.getFilteredFacilities === "function") {
      const originalFilter = window.getFilteredFacilities;

      window.getFilteredFacilities = function () {
        const result = originalFilter.apply(this, arguments);

        if (window.NAKATSU_SPECIAL_FILTER === "official") {
          return result.filter(hasOfficial);
        }

        if (window.NAKATSU_SPECIAL_FILTER === "instagram") {
          return result.filter(hasInstagram);
        }

        return result;
      };

      window.__uxFilterPatched = true;
    }
  }

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function rerender() {
    if (typeof window.render === "function") window.render();
  }

  function scrollToMain() {
    const main = document.querySelector("main");
    if (main) {
      main.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function setKeyword(keyword) {
    const input = document.getElementById("keywordInput");
    if (!input) return;

    input.value = keyword;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    scrollToMain();
  }

  function clearSpecialFilter() {
    window.NAKATSU_SPECIAL_FILTER = "";
    updateActiveButtons();
  }

  function fullReset() {
    clearSpecialFilter();

    const resetBtn = document.getElementById("resetBtn");
    if (resetBtn) {
      resetBtn.click();
    } else {
      rerender();
    }
  }

  function addStyle() {
    if (document.getElementById("uxImprovementsStyle")) return;

    const style = document.createElement("style");
    style.id = "uxImprovementsStyle";

    style.textContent = `
      body {
        padding-bottom: calc(110px + env(safe-area-inset-bottom, 0px)) !important;
      }

      .ux-purpose-panel {
        margin: 0 16px 14px;
        padding: 14px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.96);
        box-shadow: 0 12px 26px rgba(15, 23, 42, 0.10);
      }

      .ux-purpose-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 10px;
        margin-bottom: 10px;
      }

      .ux-purpose-title {
        margin: 0;
        font-size: 17px;
        font-weight: 950;
        color: #111827;
      }

      .ux-purpose-sub {
        margin: 0;
        font-size: 11.5px;
        font-weight: 800;
        color: #0f766e;
        white-space: nowrap;
      }

      .ux-purpose-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .ux-purpose-btn {
        border: none;
        border-radius: 999px;
        padding: 10px 13px;
        font-family: inherit;
        font-size: 12.5px;
        font-weight: 900;
        color: #111827;
        background: #f8fafc;
        box-shadow: inset 0 0 0 1px rgba(226, 232, 240, 0.95);
        cursor: pointer;
        white-space: nowrap;
      }

      .ux-purpose-btn:active {
        transform: scale(0.96);
      }

      .ux-purpose-btn.is-official {
        background: #ecfdf5;
        color: #065f46;
      }

      .ux-purpose-btn.is-instagram {
        background: #fdf2f8;
        color: #9d174d;
      }

      .ux-purpose-btn.is-reset {
        background: #f1f5f9;
        color: #475569;
      }

      .ux-purpose-btn.is-active {
        color: #fff !important;
        background: #0f766e !important;
        box-shadow: 0 6px 14px rgba(15, 118, 110, 0.32);
      }

      .ux-filter-notice {
        margin: 8px 0 0;
        font-size: 11.5px;
        font-weight: 800;
        color: #0f766e;
        display: none;
      }

      .ux-filter-notice.is-visible {
        display: block;
      }

      .back-to-top-btn {
        position: fixed;
        right: 14px;
        bottom: calc(84px + env(safe-area-inset-bottom, 0px));
        z-index: 119;
        width: 46px;
        height: 46px;
        border: none;
        border-radius: 999px;
        background: rgba(17, 24, 39, 0.88);
        color: #fff;
        font-size: 20px;
        font-weight: 900;
        cursor: pointer;
        box-shadow: 0 10px 22px rgba(0, 0, 0, 0.26);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease;
      }

      .back-to-top-btn.is-visible {
        opacity: 1;
        pointer-events: auto;
      }
    `;

    document.head.appendChild(style);
  }

  const PURPOSE_BUTTONS = [
    { label: "🔗 公式URLあり", type: "special", value: "official", cls: "is-official" },
    { label: "📷 Instagramあり", type: "special", value: "instagram", cls: "is-instagram" },
    { label: "🅿️ 駐車場あり", type: "keyword", value: "駐車場あり" },
    { label: "🍱 ランチ", type: "keyword", value: "ランチ" },
    { label: "🍻 夜ご飯", type: "keyword", value: "夜ご飯" },
    { label: "🙋 一人OK", type: "keyword", value: "一人" },
    { label: "👨‍👩‍👧 子連れOK", type: "keyword", value: "子連れ" },
    { label: "☔ 雨の日OK", type: "keyword", value: "屋内" },
    { label: "🚶 近くで使いやすい", type: "keyword", value: "駅" },
    { label: "↩️ リセット", type: "reset", value: "", cls: "is-reset" }
  ];

  function updateActiveButtons() {
    const panel = document.getElementById("uxPurposePanel");
    if (!panel) return;

    panel.querySelectorAll(".ux-purpose-btn[data-type='special']").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.dataset.value === window.NAKATSU_SPECIAL_FILTER);
    });

    const notice = document.getElementById("uxFilterNotice");

    if (notice) {
      if (window.NAKATSU_SPECIAL_FILTER === "official") {
        notice.textContent = "🔗 公式URLがある施設だけ表示中（リセットで解除）";
        notice.classList.add("is-visible");
      } else if (window.NAKATSU_SPECIAL_FILTER === "instagram") {
        notice.textContent = "📷 Instagramがある施設だけ表示中（リセットで解除）";
        notice.classList.add("is-visible");
      } else {
        notice.classList.remove("is-visible");
      }
    }
  }

  function createPurposePanel() {
    if (document.getElementById("uxPurposePanel")) return;

    const searchSection = document.querySelector(".search-section");
    const parent = searchSection ? searchSection.parentNode : document.querySelector(".app");

    if (!parent || !searchSection) return;

    const panel = document.createElement("section");
    panel.id = "uxPurposePanel";
    panel.className = "ux-purpose-panel";

    let buttonsHtml = "";

    PURPOSE_BUTTONS.forEach(function (b) {
      buttonsHtml +=
        '<button type="button" class="ux-purpose-btn ' + (b.cls || "") + '"' +
        ' data-type="' + b.type + '" data-value="' + b.value + '">' +
        b.label +
        "</button>";
    });

    panel.innerHTML =
      '<div class="ux-purpose-head">' +
        '<h2 class="ux-purpose-title">🎯 目的別で探す</h2>' +
        '<p class="ux-purpose-sub">ワンタップで絞り込み</p>' +
      "</div>" +
      '<div class="ux-purpose-row">' + buttonsHtml + "</div>" +
      '<p class="ux-filter-notice" id="uxFilterNotice"></p>';

    parent.insertBefore(panel, searchSection);

    panel.querySelectorAll(".ux-purpose-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const type = btn.dataset.type;
        const value = btn.dataset.value || "";

        if (type === "special") {
          window.NAKATSU_SPECIAL_FILTER =
            window.NAKATSU_SPECIAL_FILTER === value ? "" : value;

          updateActiveButtons();
          rerender();
          scrollToMain();
          return;
        }

        if (type === "keyword") {
          clearSpecialFilter();
          setKeyword(value);
          return;
        }

        if (type === "reset") {
          fullReset();
        }
      });
    });
  }

  function hookResetButton() {
    const resetBtn = document.getElementById("resetBtn");

    if (!resetBtn || resetBtn.dataset.uxHooked === "1") return;

    resetBtn.dataset.uxHooked = "1";

    resetBtn.addEventListener("click", function () {
      window.NAKATSU_SPECIAL_FILTER = "";
      updateActiveButtons();

      setTimeout(rerender, 0);
    });
  }

  function createBackToTop() {
    if (document.getElementById("backToTopBtn")) return;

    const btn = document.createElement("button");
    btn.id = "backToTopBtn";
    btn.className = "back-to-top-btn";
    btn.type = "button";
    btn.setAttribute("aria-label", "ページ上部へ戻る");
    btn.textContent = "↑";

    document.body.appendChild(btn);

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    let ticking = false;

    window.addEventListener("scroll", function () {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(function () {
        btn.classList.toggle("is-visible", window.scrollY > 400);
        ticking = false;
      });
    }, { passive: true });
  }

  function run() {
    addStyle();
    patchFilter();
    createPurposePanel();
    hookResetButton();
    createBackToTop();
    updateActiveButtons();
  }

  ready(function () {
    run();

    setTimeout(run, 400);
    setTimeout(run, 1200);
  });
})();
