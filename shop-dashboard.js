/* ============================================================
   中津くらしナビ shop-dashboard.js
   shop-dashboard.html 専用のページロジック

   やること：
   1. ログイン確認（未ログインならログイン案内を表示）
   2. 自分が申請・承認された店舗の一覧表示
      - 承認済み：空き状況／臨時休業／本日おすすめを更新
      - 承認待ち：その旨を表示
   3. 新しい店舗を管理したい時の申請フォーム（店名検索→申請）
   4. 開発用の管理者承認パネル（ADMIN_EMAILS のみ表示）
   ============================================================ */

(function () {
  "use strict";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* 開発用：このメールだけ申請承認パネルを表示 */
  var ADMIN_EMAILS = ["kaito07043@gmail.com"];

  var STATUS_OPTIONS = [
    { key: "空きあり", icon: "🟢", hint: "今すぐ入りやすい" },
    { key: "やや混雑", icon: "🟡", hint: "少し待つ可能性あり" },
    { key: "満席", icon: "🔴", hint: "席が埋まっている" },
    { key: "臨時休業", icon: "⚫", hint: "今日は休み・受付停止" }
  ];

  function isAdmin(session) {
    var email = session && session.user && session.user.email;
    return ADMIN_EMAILS.indexOf(String(email || "").toLowerCase()) !== -1;
  }

  function timeAgoLabel(isoString) {
    var then = Date.parse(isoString);
    if (!then) return "まだ更新なし";
    var minutes = Math.round((Date.now() - then) / 60000);
    if (minutes < 1) return "たった今";
    if (minutes < 60) return minutes + "分前";
    var hours = Math.round(minutes / 60);
    if (hours < 24) return hours + "時間前";
    return Math.round(hours / 24) + "日前";
  }

  function statusIcon(status) {
    var item = STATUS_OPTIONS.find(function (s) { return s.key === status; });
    return item ? item.icon : "⚪";
  }

  async function main() {
    var loggedOutEl = document.getElementById("dashLoggedOut");
    var loggedInEl = document.getElementById("dashLoggedIn");

    if (!window.NAKATSU_AUTH) {
      if (loggedOutEl) {
        loggedOutEl.hidden = false;
        loggedOutEl.innerHTML = '<p class="dash-error">ログイン機能の読み込みに失敗しました。数秒後に再読み込みしてください。</p>';
      }
      return;
    }

    var session = await window.NAKATSU_AUTH.getSession();

    if (!session || !session.user) {
      loggedOutEl.hidden = false;
      loggedInEl.hidden = true;
      return;
    }

    loggedOutEl.hidden = true;
    loggedInEl.hidden = false;

    var userEmailEl = document.getElementById("dashUserEmail");
    if (userEmailEl) userEmailEl.textContent = session.user.email;

    await loadMyShops(session.user.id);
    setupRequestForm(session.user.id);

    if (isAdmin(session)) {
      ensureAdminPanel();
      await loadPendingRequests();
    }
  }

  async function loadMyShops(userId) {
    var listEl = document.getElementById("dashMyShops");
    var client = window.NAKATSU_AUTH.client;
    listEl.innerHTML = '<p class="dash-loading">読み込み中…</p>';

    var ownRes = await client.from("shop_owners").select("*").eq("user_id", userId);
    if (ownRes.error) {
      listEl.innerHTML = '<p class="dash-error">読み込みに失敗しました：' + escapeHtml(ownRes.error.message) + "</p>";
      return;
    }

    var rows = ownRes.data || [];
    if (!rows.length) {
      listEl.innerHTML = '<p class="dash-empty">まだ管理している店舗がありません。下のフォームから申請してください。</p>';
      return;
    }

    var facilityIds = rows.filter(function (r) { return r.approved; }).map(function (r) { return r.facility_id; });
    var statusMap = {};

    if (facilityIds.length) {
      var statusRes = await client.from("shop_status").select("*").in("facility_id", facilityIds);
      if (!statusRes.error) {
        (statusRes.data || []).forEach(function (row) {
          statusMap[String(row.facility_id)] = row;
        });
      }
    }

    listEl.innerHTML = rows.map(function (row) {
      if (!row.approved) {
        return (
          '<div class="dash-shop-card is-pending">' +
            '<div class="dash-shop-topline">' +
              '<p class="dash-shop-name">' + escapeHtml(row.facility_name || ("施設ID:" + row.facility_id)) + "</p>" +
              '<span class="dash-pill is-pending">承認待ち</span>' +
            "</div>" +
            '<p class="dash-pending-note">⏳ サイト運営側の確認が済むと、ここから空き状況を更新できるようになります。</p>' +
          "</div>"
        );
      }

      var status = statusMap[String(row.facility_id)] || {};
      var currentStatus = status.status || "未設定";
      var currentLabel = status.status
        ? status.status + "（" + timeAgoLabel(status.updated_at) + "更新）"
        : "まだ未設定";
      var todayNote = status.today_note || "";

      return (
        '<div class="dash-shop-card" data-facility-id="' + escapeHtml(row.facility_id) + '" data-facility-name="' + escapeHtml(row.facility_name || "") + '" data-current-status="' + escapeHtml(currentStatus) + '">' +
          '<div class="dash-shop-topline">' +
            '<p class="dash-shop-name">' + escapeHtml(row.facility_name || ("施設ID:" + row.facility_id)) + "</p>" +
            '<span class="dash-pill is-approved">承認済み</span>' +
          "</div>" +
          '<p class="dash-current-status">現在：<strong>' + escapeHtml(statusIcon(status.status) + " " + currentLabel) + "</strong></p>" +
          '<div class="dash-status-btns">' +
            STATUS_OPTIONS.map(function (s) {
              return '<button type="button" class="dash-status-btn" data-status="' + escapeHtml(s.key) + '">' +
                '<span class="dash-status-main">' + s.icon + " " + escapeHtml(s.key) + "</span>" +
                '<span class="dash-status-hint">' + escapeHtml(s.hint) + "</span>" +
              "</button>";
            }).join("") +
          "</div>" +
          '<label class="dash-note-label">本日おすすめ・お知らせ' +
            '<textarea class="dash-note-input" maxlength="80" placeholder="例：本日焼き鳥10%OFF／今日は21時まで／おすすめは地鶏もも" rows="2">' + escapeHtml(todayNote) + "</textarea>" +
          "</label>" +
          '<button type="button" class="dash-save-note-btn">おすすめ文だけ保存</button>' +
          '<p class="dash-update-msg" aria-live="polite"></p>' +
        "</div>"
      );
    }).join("");

    $all(".dash-shop-card:not(.is-pending)", listEl).forEach(function (card) {
      card.querySelectorAll(".dash-status-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          updateStatus(card, btn.dataset.status, userId);
        });
      });

      var saveNoteBtn = card.querySelector(".dash-save-note-btn");
      if (saveNoteBtn) {
        saveNoteBtn.addEventListener("click", function () {
          var current = card.dataset.currentStatus;
          if (!current || current === "未設定") current = "空きあり";
          updateStatus(card, current, userId, true);
        });
      }
    });
  }

  async function updateStatus(card, newStatus, userId, noteOnly) {
    var facilityId = Number(card.dataset.facilityId);
    var facilityName = card.dataset.facilityName;
    var msgEl = card.querySelector(".dash-update-msg");
    var noteEl = card.querySelector(".dash-note-input");
    var client = window.NAKATSU_AUTH.client;
    var todayNote = noteEl ? noteEl.value.trim() : "";

    msgEl.textContent = noteOnly ? "おすすめ文を保存中…" : "更新中…";

    var payload = {
      facility_id: facilityId,
      facility_name: facilityName,
      status: newStatus,
      updated_at: new Date().toISOString(),
      updated_by: userId,
      today_note: todayNote
    };

    var res = await client.from("shop_status").upsert(payload, { onConflict: "facility_id" });

    if (res.error && String(res.error.message || "").indexOf("today_note") !== -1) {
      delete payload.today_note;
      res = await client.from("shop_status").upsert(payload, { onConflict: "facility_id" });
      if (!res.error) {
        msgEl.textContent = "状態は更新しました。本日おすすめを使うにはSQLで today_note 列を追加してください。";
      }
    }

    if (res.error) {
      msgEl.textContent = "更新に失敗しました：" + res.error.message;
      return;
    }

    card.dataset.currentStatus = newStatus;
    msgEl.textContent = noteOnly ? "✅ 本日おすすめを保存しました" : "✅ 「" + newStatus + "」に更新しました";

    var currentEl = card.querySelector(".dash-current-status");
    if (currentEl) {
      currentEl.innerHTML = "現在：<strong>" + escapeHtml(statusIcon(newStatus) + " " + newStatus + "（たった今更新）") + "</strong>";
    }
  }

  function setupRequestForm(userId) {
    var input = document.getElementById("dashSearchInput");
    var resultsEl = document.getElementById("dashSearchResults");
    if (!input || typeof facilities === "undefined") return;

    input.addEventListener("input", function () {
      var q = input.value.trim();
      if (q.length < 2) {
        resultsEl.innerHTML = "";
        return;
      }

      var matches = facilities.filter(function (f) {
        return String(f.name || "").indexOf(q) !== -1;
      }).slice(0, 8);

      if (!matches.length) {
        resultsEl.innerHTML = '<p class="dash-empty">見つかりませんでした。</p>';
        return;
      }

      resultsEl.innerHTML = matches.map(function (f) {
        return (
          '<div class="dash-search-result">' +
            '<span><strong>' + escapeHtml(f.name) + "</strong><small>" + escapeHtml(f.category) + "</small></span>" +
            '<button type="button" class="dash-request-btn" data-id="' + escapeHtml(f.id) + '" data-name="' + escapeHtml(f.name) + '">この店舗を申請</button>' +
          "</div>"
        );
      }).join("");

      resultsEl.querySelectorAll(".dash-request-btn").forEach(function (btn) {
        btn.addEventListener("click", async function () {
          btn.disabled = true;
          btn.textContent = "送信中…";

          var client = window.NAKATSU_AUTH.client;
          var res = await client.from("shop_owners").insert({
            user_id: userId,
            facility_id: Number(btn.dataset.id),
            facility_name: btn.dataset.name,
            approved: false
          });

          if (res.error) {
            btn.textContent = "失敗：" + res.error.message;
            btn.disabled = false;
            return;
          }

          btn.textContent = "✅ 申請しました（承認をお待ちください）";
          await loadMyShops(userId);
          await loadPendingRequests();
        });
      });
    });
  }

  function ensureAdminPanel() {
    if (document.getElementById("dashAdminSection")) return;

    var loggedInEl = document.getElementById("dashLoggedIn");
    if (!loggedInEl) return;

    var section = document.createElement("section");
    section.id = "dashAdminSection";
    section.className = "dash-section dash-admin-section";
    section.innerHTML =
      '<div class="dash-admin-head">' +
        '<div>' +
          '<h2>申請承認（管理者用）</h2>' +
          '<p class="dash-section-lead">開発用です。申請された店舗をこの画面で承認できます。</p>' +
        "</div>" +
        '<button type="button" class="dash-small-btn" id="dashReloadPending">更新</button>' +
      "</div>" +
      '<div id="dashPendingRequests"><p class="dash-loading">読み込み中…</p></div>';

    loggedInEl.insertBefore(section, loggedInEl.firstChild.nextSibling);

    var reloadBtn = document.getElementById("dashReloadPending");
    if (reloadBtn) reloadBtn.addEventListener("click", loadPendingRequests);
  }

  async function loadPendingRequests() {
    var box = document.getElementById("dashPendingRequests");
    if (!box || !window.NAKATSU_AUTH) return;

    var client = window.NAKATSU_AUTH.client;
    box.innerHTML = '<p class="dash-loading">申請を確認中…</p>';

    var res = await client.from("shop_owners").select("*").eq("approved", false);
    if (res.error) {
      box.innerHTML = '<p class="dash-error">申請一覧の取得に失敗：' + escapeHtml(res.error.message) + "</p>";
      return;
    }

    var rows = res.data || [];
    if (!rows.length) {
      box.innerHTML = '<p class="dash-empty">未承認の申請はありません。</p>';
      return;
    }

    box.innerHTML = rows.map(function (row, i) {
      return (
        '<div class="dash-pending-card" data-index="' + i + '">' +
          '<div>' +
            '<p class="dash-shop-name">' + escapeHtml(row.facility_name || ("施設ID:" + row.facility_id)) + "</p>" +
            '<p class="dash-mini-text">user_id：' + escapeHtml(row.user_id) + "</p>" +
          "</div>" +
          '<div class="dash-admin-actions">' +
            '<button type="button" class="dash-approve-btn">承認</button>' +
            '<button type="button" class="dash-reject-btn">削除</button>' +
          "</div>" +
        "</div>"
      );
    }).join("");

    $all(".dash-pending-card", box).forEach(function (card) {
      var row = rows[Number(card.dataset.index)];

      card.querySelector(".dash-approve-btn").addEventListener("click", function () {
        approveRequest(row, card);
      });

      card.querySelector(".dash-reject-btn").addEventListener("click", function () {
        rejectRequest(row, card);
      });
    });
  }

  function ownerApproveQuery(client, row) {
    var query = client.from("shop_owners").update({ approved: true });
    if (row.id != null) return query.eq("id", row.id);
    return query.eq("user_id", row.user_id).eq("facility_id", row.facility_id);
  }

  async function approveRequest(row, card) {
    var client = window.NAKATSU_AUTH.client;
    var btn = card.querySelector(".dash-approve-btn");
    btn.disabled = true;
    btn.textContent = "承認中…";

    var res = await ownerApproveQuery(client, row);
    if (res.error) {
      btn.disabled = false;
      btn.textContent = "失敗";
      card.insertAdjacentHTML("beforeend", '<p class="dash-error">' + escapeHtml(res.error.message) + "</p>");
      return;
    }

    card.remove();
    var session = await window.NAKATSU_AUTH.getSession();
    await loadMyShops(session.user.id);
  }

  async function rejectRequest(row, card) {
    var client = window.NAKATSU_AUTH.client;
    var query = client.from("shop_owners").delete();

    if (row.id != null) {
      query = query.eq("id", row.id);
    } else {
      query = query.eq("user_id", row.user_id).eq("facility_id", row.facility_id);
    }

    var res = await query;
    if (res.error) {
      card.insertAdjacentHTML("beforeend", '<p class="dash-error">削除失敗：' + escapeHtml(res.error.message) + "</p>");
      return;
    }

    card.remove();
  }

    var started = false;

  function startDashboard() {
    if (started) return;
    started = true;
    setTimeout(main, 300);
  }

  document.addEventListener("nakatsu:app-ready", startDashboard);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(startDashboard, 800);
    });
  } else {
    setTimeout(startDashboard, 800);
  }
})();
