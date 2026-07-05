/* ============================================================
   中津くらしナビ：トップ画面まとめ
   ファイル名：home-merge-extra.js

   まとめるもの：
   ・今日よく使う
   ・人気カテゴリ
   ・中津で探すなら、まずここ。
   ============================================================ */

(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function setKeyword(keyword) {
    const input = document.getElementById("keywordInput");
    if (!input) return;

    input.value = keyword;
    input.dispatchEvent(new Event("input", { bubbles: true }));

    const main = document.querySelector("main");
    if (main) {
      main.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function clickCategory(label) {
    const buttons = Array.from(document.querySelectorAll(".cat-btn"));
    const target = buttons.find(function (btn) {
      return (btn.textContent || "").includes(label);
    });

    if (target) {
      target.click();
      setTimeout(function () {
        const main = document.querySelector("main");
        if (main) main.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      setKeyword(label);
    }
  }

  function openNow() {
    const toggle = document.getElementById("openNowToggle");
    if (!toggle) return;

    toggle.checked = true;
    toggle.dispatchEvent(new Event("change", { bubbles: true }));

    const main = document.querySelector("main");
    if (main) {
      main.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function countFacilities() {
    if (typeof facilities === "undefined" || !Array.isArray(facilities)) {
      return { total: 0, verified: 0, unverified: 0 };
    }

    const total = facilities.length;
    const verified = facilities.filter(function (f) {
      return f.verified === true;
    }).length;

    return {
      total: total,
      verified: verified,
      unverified: total - verified
    };
  }

  function removeOldTopParts() {
    [
      "#sitePolishHero",
      "#homeUiPanel",
      "#home-ui-panel",
      ".home-ui-panel",
      "#purposeSection"
    ].forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        el.remove();
      });
    });
  }

  function addStyle() {
    if (document.getElementById("homeMergeStyle")) return;

    const style = document.createElement("style");
    style.id = "homeMergeStyle";
    style.textContent = `
      .merged-home-section {
        margin: 14px 16px 16px;
        padding: 16px;
        border-radius: 30px;
        color: #0f172a;
        background:
          radial-gradient(circle at 0% 0%, rgba(20, 184, 166, .20), transparent 34%),
          linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%);
        box-shadow: 0 20px 44px rgba(15, 23, 42, .14);
        overflow: hidden;
      }

      .merged-home-hero {
        padding: 16px;
        border-radius: 24px;
        color: #fff;
        background:
          radial-gradient(circle at 0% 0%, rgba(255,255,255,.25), transparent 35%),
          linear-gradient(135deg, #064e3b 0%, #0f766e 58%, #115e59 100%);
      }

      .merged-home-hero h2 {
        margin: 0;
        font-size: 23px;
        font-weight: 950;
        line-height: 1.35;
        letter-spacing: -0.03em;
      }

      .merged-home-hero p {
        margin: 8px 0 0;
        font-size: 13px;
        font-weight: 800;
        line-height: 1.55;
        opacity: .94;
      }

      .merged-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-top: 13px;
      }

      .merged-stat {
        padding: 10px 8px;
        border-radius: 18px;
        background: rgba(255,255,255,.16);
        backdrop-filter: blur(8px);
      }

      .merged-stat strong {
        display: block;
        font-size: 18px;
        font-weight: 950;
        line-height: 1;
      }

      .merged-stat span {
        display: block;
        margin-top: 4px;
        font-size: 10px;
        font-weight: 850;
        opacity: .9;
      }

      .merged-block {
        margin-top: 14px;
      }

      .merged-block-head {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 10px;
      }

      .merged-block-title {
        margin: 0;
        font-size: 18px;
        font-weight: 950;
        color: #111827;
      }

      .merged-block-sub {
        margin: 0;
        font-size: 12px;
        font-weight: 900;
        color: #0f766e;
        white-space: nowrap;
      }

      .merged-quick-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .merged-quick-btn {
        border: none;
        min-height: 82px;
        padding: 13px;
        border-radius: 22px;
        text-align: left;
        font-family: inherit;
        cursor: pointer;
        color: #111827;
        box-shadow: inset 0 0 0 1px rgba(226, 232, 240, .9);
      }

      .merged-quick-btn:active,
      .merged-chip:active {
        transform: scale(.97);
      }

      .merged-quick-icon {
        display: block;
        font-size: 28px;
        line-height: 1;
        margin-bottom: 8px;
      }

      .merged-quick-main {
        display: block;
        font-size: 15px;
        font-weight: 950;
        line-height: 1.25;
      }

      .merged-quick-note {
        display: block;
        margin-top: 4px;
        font-size: 11px;
        font-weight: 800;
        color: #64748b;
      }

      .merged-quick-btn.is-food { background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); }
      .merged-quick-btn.is-ramen { background: linear-gradient(135deg, #fef2f2 0%, #ffe4e6 100%); }
      .merged-quick-btn.is-parking { background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); }
      .merged-quick-btn.is-open { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); }

      .merged-chip-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .merged-chip {
        border: none;
        border-radius: 999px;
        padding: 10px 12px;
        font-family: inherit;
        font-size: 12px;
        font-weight: 950;
        color: #064e3b;
        background: #ffffff;
        box-shadow: inset 0 0 0 1px rgba(20, 184, 166, .22), 0 8px 16px rgba(15,23,42,.08);
        cursor: pointer;
      }

      @media (max-width: 360px) {
        .merged-stats,
        .merged-quick-grid {
          grid-template-columns: 1fr;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createMergedHome() {
    if (document.getElementById("mergedHomeSection")) return;

    const searchSection = document.querySelector(".search-section");
    const parent = searchSection ? searchSection.parentNode : document.querySelector(".app");
    if (!parent || !searchSection) return;

    const counts = countFacilities();

    const section = document.createElement("section");
    section.id = "mergedHomeSection";
    section.className = "merged-home-section";

    section.innerHTML = `
      <div class="merged-home-hero">
        <h2>中津で探すなら、まずここ。</h2>
        <p>
          ランチ・居酒屋・ラーメン・カフェ・駐車場・生活施設をまとめて探せる地域ナビです。
          情報は変わる場合があるため、利用前に公式情報も確認してください。
        </p>

        <div class="merged-stats">
          <div class="merged-stat">
            <strong>${counts.total}</strong>
            <span>掲載候補</span>
          </div>
          <div class="merged-stat">
            <strong>${counts.verified}</strong>
            <span>公式確認済み</span>
          </div>
          <div class="merged-stat">
            <strong>${counts.unverified}</strong>
            <span>要確認</span>
          </div>
        </div>
      </div>

      <div class="merged-block">
        <div class="merged-block-head">
          <h3 class="merged-block-title">今日よく使う</h3>
          <p class="merged-block-sub">ワンタップ検索</p>
        </div>

        <div class="merged-quick-grid">
          <button type="button" class="merged-quick-btn is-food" data-keyword="居酒屋">
            <span class="merged-quick-icon">🍻</span>
            <span class="merged-quick-main">夜ご飯を探す</span>
            <span class="merged-quick-note">居酒屋・夜のご飯</span>
          </button>

          <button type="button" class="merged-quick-btn is-ramen" data-keyword="ラーメン">
            <span class="merged-quick-icon">🍜</span>
            <span class="merged-quick-main">ラーメンを探す</span>
            <span class="merged-quick-note">中津市の麺系</span>
          </button>

          <button type="button" class="merged-quick-btn is-parking" data-keyword="駐車場あり">
            <span class="merged-quick-icon">🅿️</span>
            <span class="merged-quick-main">駐車場あり</span>
            <span class="merged-quick-note">車で行きやすい候補</span>
          </button>

          <button type="button" class="merged-quick-btn is-open" data-action="open-now">
            <span class="merged-quick-icon">🟢</span>
            <span class="merged-quick-main">営業中っぽい施設</span>
            <span class="merged-quick-note">確認できた施設のみ</span>
          </button>
        </div>
      </div>

      <div class="merged-block">
        <div class="merged-block-head">
          <h3 class="merged-block-title">人気カテゴリ</h3>
          <p class="merged-block-sub">よく見る項目</p>
        </div>

        <div class="merged-chip-row">
          <button type="button" class="merged-chip" data-category="定食・ランチ">🍱 ランチ</button>
          <button type="button" class="merged-chip" data-category="居酒屋・夜ご飯">🍻 居酒屋</button>
          <button type="button" class="merged-chip" data-category="ラーメン">🍜 ラーメン</button>
          <button type="button" class="merged-chip" data-category="カフェ・喫茶店">☕ カフェ</button>
          <button type="button" class="merged-chip" data-category="駐車場">🅿️ 駐車場</button>
          <button type="button" class="merged-chip" data-category="病院・歯医者">🏥 病院</button>
          <button type="button" class="merged-chip" data-category="薬局">💊 薬局</button>
          <button type="button" class="merged-chip" data-category="スーパー・コンビニ">🛒 買い物</button>
        </div>
      </div>
    `;

    parent.insertBefore(section, searchSection);

    section.querySelectorAll("[data-keyword]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setKeyword(btn.dataset.keyword || "");
      });
    });

    section.querySelectorAll("[data-category]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        clickCategory(btn.dataset.category || "");
      });
    });

    section.querySelectorAll("[data-action='open-now']").forEach(function (btn) {
      btn.addEventListener("click", openNow);
    });
  }

  function run() {
    removeOldTopParts();
    addStyle();
    createMergedHome();
  }

  ready(function () {
    run();
    setTimeout(run, 300);
    setTimeout(run, 1000);
  });
})();
