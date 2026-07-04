/* ============================================================
   中津くらしナビ：Instagram / SNSリンク対応
   ファイル名：social-links-extra.js
   ============================================================ */

(function () {
  "use strict";

  function isValidInstagramUrl(url) {
    if (typeof url !== "string") return false;
    const trimmed = url.trim();
    return (
      trimmed.indexOf("https://www.instagram.com/") === 0 ||
      trimmed.indexOf("https://instagram.com/") === 0
    );
  }

  function getInstagramUrl(facility) {
    if (!facility) return "";

    if (facility.instagramUrl && isValidInstagramUrl(facility.instagramUrl)) {
      return facility.instagramUrl.trim();
    }

    if (
      facility.snsUrls &&
      facility.snsUrls.instagram &&
      isValidInstagramUrl(facility.snsUrls.instagram)
    ) {
      return facility.snsUrls.instagram.trim();
    }

    return "";
  }

  function hasOfficialUrl(facility) {
    return !!(facility && facility.officialUrl && String(facility.officialUrl).trim() !== "");
  }

  window.NAKATSU_SOCIAL = {
    isValidInstagramUrl: isValidInstagramUrl,
    getInstagramUrl: getInstagramUrl,
    hasOfficialUrl: hasOfficialUrl
  };

  function addStyle() {
    if (document.getElementById("socialLinksStyle")) return;

    const style = document.createElement("style");
    style.id = "socialLinksStyle";
    style.textContent = `
      .insta-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 8px 12px;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 800;
        text-decoration: none;
        color: #fff;
        background: linear-gradient(45deg, #f58529 0%, #dd2a7b 50%, #8134af 100%);
        box-shadow: 0 4px 10px rgba(221, 42, 123, 0.28);
        white-space: nowrap;
      }

      .insta-btn:active {
        transform: scale(0.96);
      }

      .link-badge-row {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin: 4px 0 2px;
      }

      .link-badge {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        padding: 3px 8px;
        border-radius: 999px;
        font-size: 10.5px;
        font-weight: 900;
        line-height: 1.3;
      }

      .link-badge.is-official {
        color: #065f46;
        background: #d1fae5;
        box-shadow: inset 0 0 0 1px rgba(6, 95, 70, 0.14);
      }

      .link-badge.is-instagram {
        color: #9d174d;
        background: #fce7f3;
        box-shadow: inset 0 0 0 1px rgba(157, 23, 77, 0.16);
      }
    `;

    document.head.appendChild(style);
  }

  function findFacilityById(id) {
    if (typeof facilities === "undefined" || !Array.isArray(facilities)) return null;
    return facilities.find(function (f) {
      return Number(f.id) === Number(id);
    }) || null;
  }

  function enhanceCard(card) {
    if (card.dataset.socialEnhanced === "1") return;
    card.dataset.socialEnhanced = "1";

    const facility = findFacilityById(card.dataset.id);
    if (!facility) return;

    const instaUrl = getInstagramUrl(facility);
    const official = hasOfficialUrl(facility);

    if (instaUrl) {
      const actions = card.querySelector(".card-actions");
      if (actions && !actions.querySelector(".insta-btn")) {
        const a = document.createElement("a");
        a.className = "insta-btn";
        a.href = instaUrl;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = "📷 Instagram";

        const telBtn = actions.querySelector(".tel-btn");
        if (telBtn) {
          actions.insertBefore(a, telBtn);
        } else {
          actions.appendChild(a);
        }
      }
    }

    if ((official || instaUrl) && !card.querySelector(".link-badge-row")) {
      const row = document.createElement("div");
      row.className = "link-badge-row";

      let html = "";
      if (official) {
        html += '<span class="link-badge is-official">🔗 公式URLあり</span>';
      }
      if (instaUrl) {
        html += '<span class="link-badge is-instagram">📷 Instagramあり</span>';
      }
      row.innerHTML = html;

      const headStatus = card.querySelector(".card-head-status");
      if (headStatus) {
        headStatus.insertAdjacentElement("afterend", row);
      } else {
        const top = card.querySelector(".card-top");
        if (top) top.insertAdjacentElement("afterend", row);
      }
    }
  }

  function enhanceAllCards() {
    const cards = document.querySelectorAll("#cardList .card");
    cards.forEach(enhanceCard);
  }

  function patchRender() {
    if (window.__socialLinksRenderPatched) return;

    if (typeof window.render === "function") {
      const originalRender = window.render;
      window.render = function () {
        originalRender.apply(this, arguments);
        enhanceAllCards();
      };
      window.__socialLinksRenderPatched = true;
    }
  }

  function observeCardList() {
    const cardList = document.getElementById("cardList");
    if (!cardList || window.__socialLinksObserver) return;

    let timer = null;
    const observer = new MutationObserver(function () {
      if (timer) clearTimeout(timer);
      timer = setTimeout(enhanceAllCards, 60);
    });

    observer.observe(cardList, { childList: true });
    window.__socialLinksObserver = observer;
  }

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    addStyle();
    patchRender();
    observeCardList();
    enhanceAllCards();

    setTimeout(enhanceAllCards, 300);
    setTimeout(enhanceAllCards, 1000);
  });
})();
