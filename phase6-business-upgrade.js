/* ============================================================
   中津くらしナビ phase6-business-upgrade.js
   店舗情報編集・写真・トップおすすめ・店舗向け案内
   ============================================================ */

(function () {
  "use strict";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  var statusCache = null;
  var fetchedAt = 0;

  async function fetchStatusMap(force) {
    if (statusCache && !force && Date.now() - fetchedAt < 60000) {
      return statusCache;
    }

    var auth = window.NAKATSU_AUTH;
    var client = auth && auth.client;
    if (!client) return statusCache || {};

    try {
      var res = await client.from("shop_status").select("*");
      if (res.error) throw res.error;

      var map = {};
      (res.data || []).forEach(function (row) {
        map[String(row.facility_id)] = row;
      });

      statusCache = map;
      fetchedAt = Date.now();
      return map;
    } catch (err) {
      console.warn("[phase6] shop_status取得失敗:", err);
      return statusCache || {};
    }
  }

  async function enhanceDashboardCards() {
    if (document.body.dataset.page !== "business") return;

    var cards = $all(".dash-shop-card[data-facility-id]");
    if (!cards.length) return;

    var map = await fetchStatusMap(true);

    cards.forEach(function (card) {
      if (card.dataset.p6Enhanced) return;
      card.dataset.p6Enhanced = "1";

      var facilityId = card.dataset.facilityId;
      var entry = map[String(facilityId)] || {};

      var editor = document.createElement("div");
      editor.className = "p6-shop-editor";
      editor.innerHTML =
        '<h3 class="p6-editor-title">店舗情報の追加編集</h3>' +

        '<label class="p6-editor-label">営業時間' +
          '<input type="text" class="p6-hours-input" placeholder="例：17:00〜24:00" value="' + escapeHtml(entry.custom_hours || "") + '">' +
        '</label>' +

        '<label class="p6-editor-label">定休日' +
          '<input type="text" class="p6-closed-input" placeholder="例：火曜日／不定休" value="' + escapeHtml(entry.custom_closed || "") + '">' +
        '</label>' +

        '<label class="p6-editor-label">店舗写真URL' +
          '<input type="url" class="p6-photo-input" placeholder="https://..." value="' + escapeHtml(entry.photo_url || "") + '">' +
        '</label>' +

        '<p class="p6-editor-help">写真は、画像URLを貼ると利用者側カードに表示できます。</p>' +
        '<button type="button" class="p6-save-info-btn">営業時間・定休日・写真を保存</button>' +
        '<p class="p6-save-msg" aria-live="polite"></p>';

      card.appendChild(editor);

      $(".p6-save-info-btn", editor).addEventListener("click", function () {
        saveShopExtraInfo(card, editor, entry);
      });
    });
  }

  async function saveShopExtraInfo(card, editor, oldEntry) {
    var auth = window.NAKATSU_AUTH;
    var client = auth && auth.client;
    if (!client) return;

    var session = await auth.getSession();
    var userId = session && session.user && session.user.id;

    var facilityId = Number(card.dataset.facilityId);
    var facilityName = card.dataset.facilityName || "";

    var msg = $(".p6-save-msg", editor);
    var hours = $(".p6-hours-input", editor).value.trim();
    var closed = $(".p6-closed-input", editor).value.trim();
    var photo = $(".p6-photo-input", editor).value.trim();

    msg.textContent = "保存中…";

    var payload = {
      facility_id: facilityId,
      facility_name: facilityName,
      status: oldEntry.status || card.dataset.currentStatus || "空きあり",
      updated_at: new Date().toISOString(),
      updated_by: userId,
      today_note: oldEntry.today_note || "",
      custom_hours: hours,
      custom_closed: closed,
      photo_url: photo
    };

    var res = await client.from("shop_status").upsert(payload, {
      onConflict: "facility_id"
    });

    if (res.error) {
      msg.textContent = "保存に失敗しました：" + res.error.message;
      return;
    }

    statusCache = null;
    msg.textContent = "✅ 店舗情報を保存しました";
  }

    async function enhancePublicCards() {
    var cardList = document.getElementById("cardList");
    if (!cardList) return;

    var map = await fetchStatusMap(false);

    $all(".card", cardList).forEach(function (card) {
      var id = card.dataset.id;
      var entry = map[String(id)];
      if (!entry) return;

      var photoEl = card.querySelector(".p6-shop-photo");

      if (entry.photo_url && !photoEl) {
        photoEl = document.createElement("img");
        photoEl.className = "p6-shop-photo";
        photoEl.src = entry.photo_url;
        photoEl.alt = "店舗写真";
        photoEl.loading = "lazy";

        var title = card.querySelector(".card-title") || card.querySelector("h3");
        if (title) {
          title.insertAdjacentElement("afterend", photoEl);
        } else {
          card.insertBefore(photoEl, card.firstChild);
        }
      }

      var customHours = entry.custom_hours || "";
      var customClosed = entry.custom_closed || "";

      if (customHours || customClosed) {
        var info = card.querySelector(".p6-shop-extra-info");

        if (!info) {
          info = document.createElement("div");
          info.className = "p6-shop-extra-info";
        }

        var html = "";
        if (customHours) {
          html += '<p><strong>店舗更新の営業時間</strong><span>' + escapeHtml(customHours) + "</span></p>";
        }
        if (customClosed) {
          html += '<p><strong>店舗更新の定休日</strong><span>' + escapeHtml(customClosed) + "</span></p>";
        }

        info.innerHTML = html;

        photoEl = card.querySelector(".p6-shop-photo");
        var todayNote = card.querySelector(".p5-today-note");
        var statusBadge = card.querySelector(".p4-status-badge");
        var detailBox = card.querySelector(".card-info") || card.querySelector(".card-detail");

        if (photoEl) {
          photoEl.insertAdjacentElement("afterend", info);
        } else if (todayNote) {
          todayNote.insertAdjacentElement("afterend", info);
        } else if (statusBadge) {
          statusBadge.insertAdjacentElement("afterend", info);
        } else if (detailBox) {
          detailBox.insertAdjacentElement("beforebegin", info);
        } else {
          card.appendChild(info);
        }
      }
    });
  }

  async function buildTodayRecommendSection() {
    if (window.NAKATSU_PAGE !== "home") return;
    if (document.getElementById("p6TodayRecommend")) return;
    if (typeof facilities === "undefined") return;

    var map = await fetchStatusMap(false);

    var items = Object.keys(map).map(function (id) {
      var row = map[id];
      var facility = facilities.find(function (f) {
        return String(f.id) === String(id);
      });

      if (!facility || !row.today_note) return null;

      return {
        name: facility.name,
        category: facility.category,
        status: row.status || "更新あり",
        note: row.today_note,
        photo: row.photo_url || ""
      };
    }).filter(Boolean).slice(0, 6);

    if (!items.length) return;

    var section = document.createElement("section");
    section.id = "p6TodayRecommend";
    section.className = "p6-today-section";
    section.innerHTML =
      '<div class="p6-section-head">' +
        '<h2>📣 本日おすすめのお店</h2>' +
        '<p>店舗が今日更新したおすすめ・お知らせです。</p>' +
      "</div>" +
      '<div class="p6-today-grid">' +
        items.map(function (item) {
          return (
            '<button type="button" class="p6-today-card" data-keyword="' + escapeHtml(item.name) + '">' +
              (item.photo ? '<img src="' + escapeHtml(item.photo) + '" alt="" loading="lazy">' : "") +
              '<span class="p6-today-cat">' + escapeHtml(item.category || "店舗") + "</span>" +
              '<strong>' + escapeHtml(item.name) + "</strong>" +
              '<em>' + escapeHtml(item.status) + "</em>" +
              '<p>📣 ' + escapeHtml(item.note) + "</p>" +
            "</button>"
          );
        }).join("") +
      "</div>";

    var main = document.querySelector("main");
    if (main && main.parentNode) {
      main.parentNode.insertBefore(section, main);
    }

    $all(".p6-today-card", section).forEach(function (btn) {
      btn.addEventListener("click", function () {
        window.location.href = "shops.html?q=" + encodeURIComponent(btn.dataset.keyword || "");
      });
    });
  }

  function addBusinessGuideBanner() {
    if (document.getElementById("p6BusinessGuide")) return;

    var page = window.NAKATSU_PAGE;
    if (page !== "home" && page !== "shops" && document.body.dataset.page !== "business") return;

    var banner = document.createElement("section");
    banner.id = "p6BusinessGuide";
    banner.className = "p6-business-guide";
    banner.innerHTML =
      '<div>' +
        '<h2>🏪 店舗さまへ：掲載・更新は無料です</h2>' +
        '<p>ログインすると、空き状況・本日おすすめ・営業時間・定休日・写真URLを自分で更新できます。</p>' +
      '</div>' +
      '<a href="shop-dashboard.html">店舗管理画面へ</a>';

    var footer = document.querySelector(".site-footer");
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(banner, footer);
    }
  }

  function addStyle() {
    if (document.getElementById("p6Style")) return;

    var style = document.createElement("style");
    style.id = "p6Style";
    style.textContent = [
      ".p6-shop-editor { margin-top: 14px; padding: 13px; border-radius: 16px; background: #fff; border: 1px solid var(--hairline, #e3e2da); }",
      ".p6-editor-title { margin: 0 0 10px; font-size: 14px; font-weight: 900; color: var(--ink, #1b2422); }",
      ".p6-editor-label { display: block; margin-top: 9px; font-size: 12px; font-weight: 800; color: var(--ink, #1b2422); }",
      ".p6-editor-label input { width: 100%; box-sizing: border-box; margin-top: 5px; padding: 10px 11px; border: 1.5px solid var(--hairline, #e3e2da); border-radius: 12px; font-family: inherit; font-size: 13px; background: #f9f8f3; }",
      ".p6-editor-help { margin: 8px 0 0; font-size: 11px; color: var(--ink-sub, #5c6a66); line-height: 1.6; }",
      ".p6-save-info-btn { width: 100%; margin-top: 10px; border: none; border-radius: 999px; padding: 11px 14px; background: var(--pine, #0e5148); color: #fff; font-size: 13px; font-weight: 900; font-family: inherit; }",
      ".p6-save-msg { min-height: 18px; margin: 7px 0 0; font-size: 12px; font-weight: 800; color: var(--pine, #0e5148); }",

      ".p6-shop-photo { width: 100%; max-height: 190px; object-fit: cover; border-radius: 16px; margin: 8px 0 10px; border: 1px solid var(--hairline, #e3e2da); }",
      ".p6-shop-extra-info { margin: 10px 0; padding: 10px 12px; border-radius: 14px; background: #eef7f4; border: 1px solid #cde4dd; }",
      ".p6-shop-extra-info p { margin: 4px 0; display: grid; grid-template-columns: 118px 1fr; gap: 8px; font-size: 12px; line-height: 1.55; }",
      ".p6-shop-extra-info strong { color: var(--pine, #0e5148); }",

      ".p6-today-section { margin: 16px; padding: 16px; border-radius: 22px; background: #fffaf0; border: 1px solid #f1d69d; box-shadow: 0 2px 10px rgba(27,36,34,.06); }",
      ".p6-section-head h2 { margin: 0 0 4px; font-size: 18px; font-weight: 900; color: var(--ink, #1b2422); }",
      ".p6-section-head p { margin: 0 0 12px; font-size: 12.5px; color: var(--ink-sub, #5c6a66); }",
      ".p6-today-grid { display: grid; gap: 10px; }",
      ".p6-today-card { text-align: left; width: 100%; border: 1px solid var(--hairline, #e3e2da); border-radius: 16px; background: #fff; padding: 12px; font-family: inherit; color: inherit; }",
      ".p6-today-card img { width: 100%; max-height: 145px; object-fit: cover; border-radius: 12px; margin-bottom: 8px; }",
      ".p6-today-cat { display: inline-flex; border-radius: 999px; padding: 3px 8px; background: #e6eef7; color: #1e3a5f; font-size: 10.5px; font-weight: 800; }",
      ".p6-today-card strong { display: block; margin-top: 6px; font-size: 15px; font-weight: 900; }",
      ".p6-today-card em { display: inline-block; margin-top: 4px; font-style: normal; font-size: 11px; color: #1d7a4f; font-weight: 800; }",
      ".p6-today-card p { margin: 7px 0 0; font-size: 13px; line-height: 1.6; color: #8a5312; font-weight: 800; }",

      ".p6-business-guide { margin: 16px; padding: 16px; border-radius: 20px; background: linear-gradient(135deg, #0e5148, #163f6b); color: #fff; display: grid; gap: 10px; }",
      ".p6-business-guide h2 { margin: 0 0 5px; font-size: 16px; font-weight: 900; }",
      ".p6-business-guide p { margin: 0; font-size: 12.5px; line-height: 1.7; opacity: .92; }",
      ".p6-business-guide a { display: inline-flex; justify-content: center; align-items: center; border-radius: 999px; padding: 11px 14px; background: #fff; color: #0e5148; font-weight: 900; text-decoration: none; font-size: 13px; }"
    ].join("\n");

    document.head.appendChild(style);
  }

  function run() {
    enhanceDashboardCards();
    enhancePublicCards();
    buildTodayRecommendSection();
    addBusinessGuideBanner();
  }

  function init() {
    addStyle();

    setTimeout(run, 800);
    setTimeout(run, 1600);

    document.addEventListener("nakatsu:rendered", function () {
      enhancePublicCards();
    });

    var observer = new MutationObserver(function () {
      enhanceDashboardCards();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
