/* ============================================================
   中津くらしナビ：タブ切り替え式おすすめ候補
   ファイル名：ranking-buttons-extra.js
   ============================================================ */

(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function hasOfficial(facility) {
    if (window.NAKATSU_SOCIAL) return window.NAKATSU_SOCIAL.hasOfficialUrl(facility);
    return !!(facility && facility.officialUrl && String(facility.officialUrl).trim() !== "");
  }

  function getInsta(facility) {
    if (window.NAKATSU_SOCIAL) return window.NAKATSU_SOCIAL.getInstagramUrl(facility);

    const url =
      (facility && facility.instagramUrl) ||
      (facility && facility.snsUrls && facility.snsUrls.instagram) ||
      "";

    if (typeof url !== "string") return "";

    const t = url.trim();

    return (
      t.indexOf("https://www.instagram.com/") === 0 ||
      t.indexOf("https://instagram.com/") === 0
    ) ? t : "";
  }

  function getMap(facility) {
    if (typeof window.getMapUrl === "function") return window.getMapUrl(facility);

    const query = ((facility.name || "") + " " + (facility.address || "大分県中津市")).trim();

    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
  }

  function isSearchCard(facility) {
    const name = String(facility.name || "");
    return name.indexOf("周辺の") !== -1 || name.indexOf("各店舗") !== -1;
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function scoreFacility(f) {
    let score = 0;

    if (typeof f.rating === "number") {
      score += f.rating * 100;
    }

    if (typeof f.reviewCount === "number") {
      score += Math.min(10, f.reviewCount / 20);
    }

    if (hasOfficial(f)) score += 20;
    if (getInsta(f)) score += 15;
    if (f.verified === true) score += 30;
    if (Array.isArray(f.tags) && f.tags.length >= 3) score += 5;

    if (!f.address || String(f.address).trim() === "") score -= 5;
    if (!f.hours || String(f.hours).trim() === "") score -= 5;

    if (isSearchCard(f)) score -= 40;

    return score;
  }

  const TABS = [
    { key: "all", label: "🏆 総合", filter: function () { return true; } },
    { key: "lunch", label: "🍱 ランチ", categories: ["定食・ランチ", "安いご飯", "弁当・惣菜"] },
    { key: "izakaya", label: "🍻 居酒屋", categories: ["居酒屋・夜ご飯"] },
    { key: "ramen", label: "🍜 ラーメン", categories: ["ラーメン"] },
    { key: "cafe", label: "☕ カフェ", categories: ["カフェ・喫茶店"] },
    { key: "yakiniku", label: "🥩 焼肉・寿司", categories: ["焼肉・寿司"] },
    { key: "shopping", label: "🛒 買い物", categories: ["スーパー・コンビニ"] },
    { key: "medical", label: "🏥 病院・薬局", categories: ["病院・歯医者", "薬局"] },
    { key: "rainy", label: "☔ 観光・雨の日", categories: ["雨の日に行ける場所"] },
    { key: "official", label: "🔗 公式URLあり", filter: hasOfficial },
    { key: "instagram", label: "📷 Instagramあり", filter: function (f) { return !!getInsta(f); } }
  ];

  const SHOW_LIMIT = 7;

  function getTabItems(tab) {
    if (typeof facilities === "undefined" || !Array.isArray(facilities)) return [];

    let items = facilities.filter(function (f) {
      if (tab.filter) return tab.filter(f);
      if (tab.categories) return tab.categories.indexOf(f.category) !== -1;
      return false;
    });

    if (tab.key === "all") {
      items = items.filter(function (f) {
        return !isSearchCard(f);
      });
    }

    return items
      .map(function (f) {
        return {
          facility: f,
          score: scoreFacility(f)
        };
      })
      .sort(function (a, b) {
        return b.score - a.score;
      })
      .slice(0, SHOW_LIMIT);
  }

  function addStyle() {
    if (document.getElementById("rankingButtonsStyle")) return;

    const style = document.createElement("style");
    style.id = "rankingButtonsStyle";

    style.textContent = `
      .rank-tabs-section {
        margin: 16px;
        padding: 16px;
        border-radius: 26px;
        background:
          radial-gradient(circle at 100% 0%, rgba(20, 184, 166, 0.14), transparent 32%),
          linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%);
        box-shadow: 0 16px 34px rgba(15, 23, 42, 0.13);
      }

      .rank-tabs-title {
        margin: 0;
        font-size: 20px;
        font-weight: 950;
        color: #111827;
        line-height: 1.35;
      }

      .rank-tabs-caution {
        margin: 6px 0 0;
        font-size: 12px;
        font-weight: 700;
        color: #64748b;
        line-height: 1.55;
      }

      .rank-tabs-row {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding: 12px 2px 6px;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }

      .rank-tabs-row::-webkit-scrollbar {
        display: none;
      }

      .rank-tab-btn {
        flex: none;
        border: none;
        border-radius: 999px;
        padding: 10px 14px;
        font-family: inherit;
        font-size: 13px;
        font-weight: 900;
        color: #0f766e;
        background: #ffffff;
        box-shadow: inset 0 0 0 1px rgba(20, 184, 166, 0.25);
        cursor: pointer;
        white-space: nowrap;
      }

      .rank-tab-btn:active {
        transform: scale(0.96);
      }

      .rank-tab-btn.is-active {
        color: #fff;
        background: #0f766e;
        box-shadow: 0 8px 18px rgba(15, 118, 110, 0.32);
      }

      .rank-tab-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 8px;
      }

      .rank-tab-card {
        padding: 12px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.95);
        box-shadow: inset 0 0 0 1px rgba(204, 251, 241, 0.95);
      }

      .rank-tab-card-top {
        display: flex;
        gap: 10px;
        align-items: flex-start;
      }

      .rank-tab-num {
        flex: none;
        width: 32px;
        height: 32px;
        border-radius: 999px;
        display: grid;
        place-items: center;
        color: #fff;
        background: #111827;
        font-size: 12.5px;
        font-weight: 950;
      }

      .rank-tab-num.is-top3 {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      }

      .rank-tab-name {
        margin: 0;
        font-size: 15px;
        font-weight: 950;
        color: #111827;
        line-height: 1.35;
      }

      .rank-tab-note {
        margin: 3px 0 0;
        font-size: 12px;
        font-weight: 700;
        color: #64748b;
        line-height: 1.45;
      }

      .rank-tab-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-top: 6px;
      }

      .rank-tab-pill {
        display: inline-flex;
        padding: 3px 8px;
        border-radius: 999px;
        font-size: 10.5px;
        font-weight: 900;
      }

      .rank-tab-pill.is-rating {
        color: #92400e;
        background: #ffedd5;
      }

      .rank-tab-pill.is-official {
        color: #065f46;
        background: #d1fae5;
      }

      .rank-tab-pill.is-insta {
        color: #9d174d;
        background: #fce7f3;
      }

      .rank-tab-pill.is-verified {
        color: #1e3a8a;
        background: #dbeafe;
      }

      .rank-tab-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 9px;
      }

      .rank-tab-action {
        border: none;
        border-radius: 999px;
        padding: 8px 11px;
        font-family: inherit;
        font-size: 11.5px;
        font-weight: 900;
        cursor: pointer;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 3px;
        color: #0f766e;
        background: #e6fffa;
        white-space: nowrap;
      }

      .rank-tab-action:active {
        transform: scale(0.96);
      }

      .rank-tab-action.is-map {
        color: #1e40af;
        background: #dbeafe;
      }

      .rank-tab-action.is-official {
        color: #065f46;
        background: #d1fae5;
      }

      .rank-tab-action.is-insta {
        color: #fff;
        background: linear-gradient(45deg, #f58529 0%, #dd2a7b 55%, #8134af 100%);
      }

      .rank-tab-action.is-fav {
        color: #92400e;
        background: #fef3c7;
      }

      .rank-tab-empty {
        margin: 8px 0 0;
        font-size: 13px;
        font-weight: 700;
        color: #64748b;
      }
    `;

    document.head.appendChild(style);
  }

  function createRankCardHtml(entry, index) {
    const f = entry.facility;
    const instaUrl = getInsta(f);
    const official = hasOfficial(f);

    const isFav =
      typeof state !== "undefined" &&
      state.favorites &&
      state.favorites.indexOf(f.id) !== -1;

    let pills = "";

    if (typeof f.rating === "number") {
      pills += '<span class="rank-tab-pill is-rating">★' + f.rating.toFixed(2) + "（食べログ点数参考）</span>";
    }

    if (f.verified === true) {
      pills += '<span class="rank-tab-pill is-verified">✔ 公式確認済み</span>';
    }

    if (official) {
      pills += '<span class="rank-tab-pill is-official">🔗 公式URLあり</span>';
    }

    if (instaUrl) {
      pills += '<span class="rank-tab-pill is-insta">📷 Instagramあり</span>';
    }

    let actions = "";

    actions +=
      '<button type="button" class="rank-tab-action" data-act="view" data-name="' +
      escapeHtml(f.name) +
      '">👀 この施設を見る</button>';

    actions +=
      '<a class="rank-tab-action is-map" href="' +
      escapeHtml(getMap(f)) +
      '" target="_blank" rel="noopener noreferrer">📍 地図</a>';

    if (official) {
      actions +=
        '<a class="rank-tab-action is-official" href="' +
        escapeHtml(f.officialUrl) +
        '" target="_blank" rel="noopener noreferrer">🔗 公式</a>';
    }

    if (instaUrl) {
      actions +=
        '<a class="rank-tab-action is-insta" href="' +
        escapeHtml(instaUrl) +
        '" target="_blank" rel="noopener noreferrer">📷 Instagram</a>';
    }

    actions +=
      '<button type="button" class="rank-tab-action is-fav" data-act="fav" data-id="' +
      f.id +
      '">' +
      (isFav ? "★ お気に入り済" : "☆ お気に入り") +
      "</button>";

    actions +=
      '<button type="button" class="rank-tab-action" data-act="category" data-category="' +
      escapeHtml(f.category || "") +
      '">📂 同じカテゴリを見る</button>';

    const desc = f.description ? escapeHtml(f.description) : "";

    return (
      '<div class="rank-tab-card">' +
        '<div class="rank-tab-card-top">' +
          '<div class="rank-tab-num' + (index < 3 ? " is-top3" : "") + '">' + (index + 1) + "</div>" +
          "<div>" +
            '<p class="rank-tab-name">' + escapeHtml(f.name) + "</p>" +
            (desc ? '<p class="rank-tab-note">' + desc + "</p>" : "") +
            (pills ? '<div class="rank-tab-meta">' + pills + "</div>" : "") +
          "</div>" +
        "</div>" +
        '<div class="rank-tab-actions">' + actions + "</div>" +
      "</div>"
    );
  }

  let currentTabKey = "all";

  function renderTabContent(section) {
    const listEl = section.querySelector("#rankTabList");
    if (!listEl) return;

    const tab = TABS.find(function (t) {
      return t.key === currentTabKey;
    }) || TABS[0];

    const items = getTabItems(tab);

    if (items.length === 0) {
      listEl.innerHTML = '<p class="rank-tab-empty">このカテゴリのおすすめ候補は準備中です。</p>';
      return;
    }

    listEl.innerHTML = items.map(createRankCardHtml).join("");

    listEl.querySelectorAll("[data-act='view']").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const input = document.getElementById("keywordInput");

        if (input) {
          if (typeof window.NAKATSU_SPECIAL_FILTER !== "undefined") {
            window.NAKATSU_SPECIAL_FILTER = "";
          }

          input.value = btn.dataset.name || "";
          input.dispatchEvent(new Event("input", { bubbles: true }));

          const main = document.querySelector("main");
          if (main) {
            main.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
    });

    listEl.querySelectorAll("[data-act='fav']").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (typeof window.toggleFavorite === "function") {
          window.toggleFavorite(Number(btn.dataset.id), btn);

          setTimeout(function () {
            renderTabContent(section);
          }, 250);
        }
      });
    });

    listEl.querySelectorAll("[data-act='category']").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const label = btn.dataset.category || "";
        const buttons = Array.from(document.querySelectorAll(".cat-btn"));

        const target = buttons.find(function (b) {
          return (b.textContent || "").indexOf(label) !== -1;
        });

        if (target) {
          target.click();

          setTimeout(function () {
            const main = document.querySelector("main");
            if (main) {
              main.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 100);
        }
      });
    });
  }

  function createSection() {
    if (document.getElementById("rankTabsSection")) return;

    const main = document.querySelector("main");
    const parent = main ? main.parentNode : document.querySelector(".app");

    if (!parent || !main) return;

    const section = document.createElement("section");
    section.id = "rankTabsSection";
    section.className = "rank-tabs-section";

    let tabsHtml = "";

    TABS.forEach(function (t) {
      tabsHtml +=
        '<button type="button" class="rank-tab-btn' +
        (t.key === currentTabKey ? " is-active" : "") +
        '" data-tab="' +
        t.key +
        '">' +
        t.label +
        "</button>";
    });

    section.innerHTML =
      '<h2 class="rank-tabs-title">🏆 おすすめ候補（探しやすさ順）</h2>' +
      '<p class="rank-tabs-caution">' +
        "点数・営業時間・掲載情報は変わる場合があります。利用前に公式情報をご確認ください。" +
        "食べログ点数参考・公式URLあり優先で並べた「おすすめ候補」です。" +
      "</p>" +
      '<div class="rank-tabs-row">' + tabsHtml + "</div>" +
      '<div class="rank-tab-list" id="rankTabList"></div>';

    const oldRanking = document.getElementById("realRankingSection");

    if (oldRanking && oldRanking.parentNode) {
      oldRanking.parentNode.insertBefore(section, oldRanking);
      oldRanking.style.display = "none";
    } else {
      parent.insertBefore(section, main);
    }

    section.querySelectorAll(".rank-tab-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentTabKey = btn.dataset.tab || "all";

        section.querySelectorAll(".rank-tab-btn").forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });

        renderTabContent(section);
      });
    });

    renderTabContent(section);
  }

  function run() {
    addStyle();
    createSection();
  }

  ready(function () {
    run();

    setTimeout(run, 300);
    setTimeout(run, 1000);
  });
})();
