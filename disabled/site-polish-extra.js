/* ============================================================
   中津くらしナビ：仕上げ強化パック
   ファイル名：site-polish-extra.js

   やること：
   1. ランキング名を「食べログ点数参考」に修正
   2. GoogleフォームURL導線を強化
   3. 店舗カードに「実店舗」「公式確認済み」「要確認」バッジを追加
   4. 未確認項目を分かりやすく表示
   5. トップページを見やすく整理
   ============================================================ */

(function () {
  // GoogleフォームのURLをここに入れる
  // 例：const GOOGLE_FORM_URL = "https://forms.gle/xxxxxxxx";
  const GOOGLE_FORM_URL = "";

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

  function addStyle() {
    if (document.getElementById("sitePolishStyle")) return;

    const style = document.createElement("style");
    style.id = "sitePolishStyle";
    style.textContent = `
      .site-polish-hero {
        margin: 14px 16px 16px;
        padding: 18px;
        border-radius: 28px;
        color: #fff;
        background:
          radial-gradient(circle at 0% 0%, rgba(255,255,255,.25), transparent 32%),
          linear-gradient(135deg, #064e3b 0%, #0f766e 55%, #115e59 100%);
        box-shadow: 0 20px 42px rgba(15, 23, 42, 0.22);
      }

      .site-polish-hero h2 {
        margin: 0;
        font-size: 22px;
        font-weight: 950;
        line-height: 1.35;
        letter-spacing: -0.03em;
      }

      .site-polish-hero p {
        margin: 8px 0 0;
        font-size: 13px;
        font-weight: 750;
        line-height: 1.55;
        opacity: .94;
      }

      .site-polish-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-top: 14px;
      }

      .site-polish-stat {
        padding: 10px 8px;
        border-radius: 18px;
        background: rgba(255,255,255,.15);
        backdrop-filter: blur(8px);
      }

      .site-polish-stat strong {
        display: block;
        font-size: 18px;
        font-weight: 950;
        line-height: 1;
      }

      .site-polish-stat span {
        display: block;
        margin-top: 4px;
        font-size: 10px;
        font-weight: 850;
        opacity: .9;
      }

      .site-polish-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 9px;
        margin-top: 14px;
      }

      .site-polish-action {
        border: none;
        border-radius: 18px;
        padding: 12px 10px;
        min-height: 58px;
        color: #064e3b;
        background: rgba(255,255,255,.92);
        font-family: inherit;
        font-size: 13px;
        font-weight: 950;
        text-align: left;
        cursor: pointer;
        box-shadow: 0 10px 22px rgba(15, 23, 42, .12);
      }

      .site-polish-action small {
        display: block;
        margin-top: 3px;
        color: #64748b;
        font-size: 10px;
        font-weight: 800;
      }

      .site-polish-action:active {
        transform: scale(.97);
      }

      .real-ranking-title::after {
        content: " 食べログ点数参考";
        display: inline-flex;
        margin-left: 6px;
        padding: 4px 8px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 950;
        color: #92400e;
        background: #ffedd5;
        vertical-align: middle;
      }

      .card-real-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin: 10px 0 0;
      }

      .real-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 5px 8px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 950;
        line-height: 1;
      }

      .real-badge.is-shop {
        color: #065f46;
        background: #d1fae5;
      }

      .real-badge.is-official {
        color: #1d4ed8;
        background: #dbeafe;
      }

      .real-badge.is-check {
        color: #92400e;
        background: #ffedd5;
      }

      .badge-verified.is-verified {
        color: #065f46;
        background: #d1fae5;
      }

      .badge-verified.is-unverified {
        color: #92400e;
        background: #ffedd5;
      }

      .value-unverified {
        color: #b45309;
        font-weight: 950;
      }

      .tag-list .tag:nth-child(n+9) {
        display: none;
      }

      .card-desc {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .request-link-area {
        border: 2px solid #ccfbf1;
      }

      .site-form-note {
        margin-top: 10px;
        padding: 10px;
        border-radius: 14px;
        background: #f8fafc;
        color: #475569;
        font-size: 12px;
        font-weight: 750;
        line-height: 1.5;
      }

      @media (max-width: 360px) {
        .site-polish-stats {
          grid-template-columns: 1fr;
        }

        .site-polish-actions {
          grid-template-columns: 1fr;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function countRealFacilities() {
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

  function addHero() {
    if (document.getElementById("sitePolishHero")) return;

    const searchSection = document.querySelector(".search-section");
    const parent = searchSection ? searchSection.parentNode : document.querySelector(".app");
    if (!parent || !searchSection) return;

    const counts = countRealFacilities();

    const section = document.createElement("section");
    section.id = "sitePolishHero";
    section.className = "site-polish-hero";
    section.innerHTML = `
      <h2>中津で探すなら、まずここ。</h2>
      <p>
        ランチ・居酒屋・ラーメン・カフェ・駐車場・生活施設をスマホで探せる地域ナビです。
        実店舗中心に整理中。営業時間や定休日は行く前に公式情報も確認してください。
      </p>

      <div class="site-polish-stats">
        <div class="site-polish-stat">
          <strong>${counts.total}</strong>
          <span>掲載候補</span>
        </div>
        <div class="site-polish-stat">
          <strong>${counts.verified}</strong>
          <span>公式確認済み</span>
        </div>
        <div class="site-polish-stat">
          <strong>${counts.unverified}</strong>
          <span>要確認</span>
        </div>
      </div>

      <div class="site-polish-actions">
        <button type="button" class="site-polish-action" data-keyword="ランチ">
          🍱 ご飯を探す
          <small>ランチ・定食・からあげ</small>
        </button>
        <button type="button" class="site-polish-action" data-keyword="居酒屋">
          🍻 夜ご飯を探す
          <small>居酒屋・飲み会</small>
        </button>
        <button type="button" class="site-polish-action" data-keyword="ラーメン">
          🍜 ラーメン
          <small>一人飯にも</small>
        </button>
        <button type="button" class="site-polish-action" data-keyword="駐車場あり">
          🅿️ 車で行きやすい
          <small>駐車場あり候補</small>
        </button>
      </div>
    `;

    parent.insertBefore(section, searchSection);

    section.querySelectorAll(".site-polish-action").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setKeyword(btn.dataset.keyword || "");
      });
    });
  }

  function fixRankingWords() {
    const root = document.body;
    if (!root) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const targets = [];

    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeValue && node.nodeValue.includes("口コミ点数参考")) {
        targets.push(node);
      }
    }

    targets.forEach(function (node) {
      node.nodeValue = node.nodeValue.replaceAll("口コミ点数参考", "食べログ点数参考");
    });
  }

  function enhanceCards() {
    const cards = document.querySelectorAll(".card");
    if (!cards.length) return;

    cards.forEach(function (card) {
      if (card.querySelector(".card-real-badges")) return;

      const id = Number(card.dataset.id);
      const facility = typeof facilities !== "undefined" && Array.isArray(facilities)
        ? facilities.find(function (f) { return Number(f.id) === id; })
        : null;

      if (!facility) return;

      const top = card.querySelector(".card-top");
      if (!top) return;

      const badges = document.createElement("div");
      badges.className = "card-real-badges";

      const isOfficial = facility.verified === true || !!facility.officialUrl;
      const isUnverified = facility.verified !== true;

      badges.innerHTML = `
        <span class="real-badge is-shop">🏠 実店舗</span>
        ${
          isOfficial
            ? '<span class="real-badge is-official">✔ 公式確認済み</span>'
            : ''
        }
        ${
          isUnverified
            ? '<span class="real-badge is-check">⚠ 住所・営業時間 要確認</span>'
            : ''
        }
      `;

      top.insertAdjacentElement("afterend", badges);
    });
  }

  function enhanceRequestForm() {
    const modal = document.getElementById("requestModal");
    if (!modal) return;

    const box = modal.querySelector(".modal-box");
    if (!box) return;

    const oldArea = document.getElementById("requestLinkArea");

    if (oldArea) {
      if (GOOGLE_FORM_URL) {
        oldArea.innerHTML = `
          <a href="${GOOGLE_FORM_URL}" target="_blank" rel="noopener">掲載依頼フォームへ</a>
          <small>新規掲載・情報修正・閉店移転の連絡はこちらから送れます。</small>
        `;
      } else {
        oldArea.innerHTML = `
          <a href="https://docs.google.com/forms/" target="_blank" rel="noopener">Googleフォーム準備中</a>
          <small>
            フォームURLがまだ未設定です。site-polish-extra.js の GOOGLE_FORM_URL にURLを貼ると、
            このボタンが「掲載依頼フォームへ」に変わります。
          </small>
        `;
      }
    }

    if (!document.getElementById("siteFormNote")) {
      const note = document.createElement("div");
      note.id = "siteFormNote";
      note.className = "site-form-note";
      note.textContent = "掲載依頼は、店名・住所・営業時間・定休日・公式URLがあると反映しやすいです。";
      const closeBtn = document.getElementById("modalCloseBtn");
      if (closeBtn) {
        box.insertBefore(note, closeBtn);
      } else {
        box.appendChild(note);
      }
    }
  }

  function patchRender() {
    if (typeof window.__sitePolishPatched !== "undefined") return;
    window.__sitePolishPatched = true;

    const run = function () {
      fixRankingWords();
      enhanceCards();
      enhanceRequestForm();
    };

    setTimeout(run, 100);
    setTimeout(run, 500);
    setTimeout(run, 1200);

    document.addEventListener("click", function () {
      setTimeout(run, 120);
    });

    document.addEventListener("input", function () {
      setTimeout(run, 120);
    });

    document.addEventListener("change", function () {
      setTimeout(run, 120);
    });
  }

  ready(function () {
    addStyle();
    addHero();
    fixRankingWords();
    enhanceCards();
    enhanceRequestForm();
    patchRender();
  });
})();
