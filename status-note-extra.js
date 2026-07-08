/* ============================================================
   中津くらしナビ status-note-extra.js
   利用者側カードに「本日おすすめ」と臨時休業表示を追加
   ============================================================ */

(function () {
  "use strict";

  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function timeAgoLabel(isoString) {
    var then = Date.parse(isoString);
    if (!then) return "";
    var minutes = Math.round((Date.now() - then) / 60000);
    if (minutes < 1) return "たった今";
    if (minutes < 60) return minutes + "分前";
    var hours = Math.round(minutes / 60);
    if (hours < 24) return hours + "時間前";
    return Math.round(hours / 24) + "日前";
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
      console.warn("[status-note-extra] shop_status取得に失敗:", err);
      return statusCache || {};
    }
  }

  async function annotateExtraStatus() {
    var cardList = document.getElementById("cardList");
    if (!cardList) return;

    var map = await fetchStatusMap(false);

    $all(".card", cardList).forEach(function (card) {
      var id = card.dataset.id;
      var entry = map[String(id)];
      if (!entry) return;

      var statusRow = card.querySelector(".card-head-status");
      if (!statusRow) return;

      if (entry.status === "臨時休業") {
        var badge = card.querySelector(".p4-status-badge");
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "p4-status-badge";
          statusRow.appendChild(badge);
        }
        badge.classList.add("p5-temporary-closed");
        badge.textContent = "⚫ 臨時休業・" + timeAgoLabel(entry.updated_at) + "更新";
      }

      var note = entry.today_note || "";
      if (note) {
        var noteEl = card.querySelector(".p5-today-note");
        if (!noteEl) {
          noteEl = document.createElement("div");
          noteEl.className = "p5-today-note";
          statusRow.insertAdjacentElement("afterend", noteEl);
        }
        noteEl.textContent = "📣 本日おすすめ：" + note;
      }
    });
  }

  function addStyle() {
    if (document.getElementById("p5StatusNoteStyle")) return;

    var style = document.createElement("style");
    style.id = "p5StatusNoteStyle";
    style.textContent = [
      ".p5-today-note { display: inline-flex; align-items: center; margin: 6px 0 2px; padding: 5px 9px; border-radius: 999px; background: #fff4d8; color: #8a5312; font-size: 11.5px; font-weight: 800; line-height: 1.35; }",
      ".p5-temporary-closed { background: #eeeeee !important; color: #333333 !important; }"
    ].join("\n");

    document.head.appendChild(style);
  }

  function init() {
    addStyle();
    annotateExtraStatus();
    document.addEventListener("nakatsu:rendered", annotateExtraStatus);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(init, 500);
    });
  } else {
    setTimeout(init, 500);
  }
})();
