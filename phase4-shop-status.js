* ============================================================
   中津くらしナビ phase4-shop-status.js

   このファイルでやっていること：
   1. ログイン仮UI（phase1が作ったモーダル）を本物のログイン/新規登録に差し替え
   2. 施設カードに「今の空き状況」バッジを表示（誰でも閲覧可・shop_statusテーブルから取得）
      ・3時間以上更新が無ければ「情報が古い可能性」表示に切り替え
   3. 予約URL（facility.reservationUrl）があれば「予約する」ボタンを追加
   4. ハンバーガーメニューに「店舗管理画面」リンクを追加（ログイン時のみ）

   読み込み位置：supabase-auth.js の後、phase1/phase2/phase3 の後
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

  var STATUS_META = {
    "空きあり": { color: "#1d7a4f", bg: "#e4f4ea", icon: "🟢" },
    "やや混雑": { color: "#a3641a", bg: "#faf1e2", icon: "🟡" },
    "満席":     { color: "#b3261e", bg: "#fbe9e7", icon: "🔴" },
    "不明":     { color: "#5c6a66", bg: "#eef0ee", icon: "⚪" }
  };

  var statusCache = null; // facility_id -> {status, updated_at}
  var statusFetchedAt = 0;

  /* =========================================================
     1. shop_status を取得（誰でも閲覧可）
  ========================================================= */
  async function fetchStatusMap(force) {
    if (statusCache && !force && (Date.now() - statusFetchedAt) < 60000) {
      return statusCache; // 直近1分以内に取得済みなら使い回す
    }

    var auth = window.NAKATSU_AUTH;
    var client = auth && auth.client;
    if (!client) return statusCache || {};

    try {
      var res = await client.from("shop_status").select("facility_id,status,updated_at");
      if (res.error) throw res.error;

      var map = {};
      (res.data || []).forEach(function (row) {
        map[String(row.facility_id)] = { status: row.status, updatedAt: row.updated_at };
      });
      statusCache = map;
      statusFetchedAt = Date.now();
      return map;
    } catch (err) {
      console.warn("[phase4] shop_status取得に失敗:", err);
      return statusCache || {};
    }
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

  function isStale(isoString) {
    var then = Date.parse(isoString);
    if (!then) return true;
    return (Date.now() - then) > 3 * 60 * 60 * 1000; // 3時間
  }

  /* =========================================================
     2. カードへのバッジ注入（render後に毎回呼ぶ）
  ========================================================= */
  async function annotateShopStatus() {
    var cardList = document.getElementById("cardList");
    if (!cardList || typeof facilities === "undefined") return;

    var map = await fetchStatusMap(false);
    if (!map) return;

    $all(".card", cardList).forEach(function (card) {
      if (card.querySelector(".p4-status-badge")) return;

      var id = card.dataset.id;
      var entry = map[String(id)];

      var statusRow = card.querySelector(".card-head-status");
      if (!statusRow) return;

      if (entry && entry.status) {
        var meta = STATUS_META[entry.status] || STATUS_META["不明"];
        var stale = isStale(entry.updatedAt);
        var label = stale
          ? "情報が古い可能性（" + timeAgoLabel(entry.updatedAt) + "更新）"
          : entry.status + "・" + timeAgoLabel(entry.updatedAt) + "更新";

        var badge = document.createElement("span");
        badge.className = "p4-status-badge" + (stale ? " is-stale" : "");
        badge.style.color = stale ? "#5c6a66" : meta.color;
        badge.style.background = stale ? "#eef0ee" : meta.bg;
        badge.textContent = (stale ? "⚪" : meta.icon) + " " + label;
        statusRow.appendChild(badge);
      }

      /* 予約URLがあれば予約ボタンを追加 */
      var facility = facilities.find(function (f) { return String(f.id) === String(id); });
      if (facility && facility.reservationUrl) {
        var actions = card.querySelector(".card-actions");
        if (actions && !actions.querySelector(".p4-reserve-btn")) {
          var link = document.createElement("a");
          link.className = "p4-reserve-btn";
          link.href = facility.reservationUrl;
          link.target = "_blank";
          link.rel = "noopener";
          link.textContent = "📅 予約する";
          actions.insertBefore(link, actions.firstChild);
        }
      }
    });
  }

  /* =========================================================
     3. ログインモーダルを本物に差し替え
  ========================================================= */
  function upgradeLoginModal() {
    var modal = document.getElementById("p1LoginModal");
    if (!modal || modal.dataset.p4Upgraded) return;
    modal.dataset.p4Upgraded = "1";

    var box = modal.querySelector(".modal-box");
    if (!box) return;

    var mode = "login"; // "login" | "signup"

    function render(session) {
      if (session && session.user) {
        box.innerHTML =
          '<h2 class="modal-title">ログイン中</h2>' +
          '<p class="modal-text">' + escapeHtml(session.user.email) + ' でログインしています。</p>' +
          '<a class="modal-form-btn" href="shop-dashboard.html">🏪 店舗管理画面を開く</a>' +
          '<button type="button" class="modal-close-btn" id="p4LogoutBtn" style="margin-top:8px;">ログアウト</button>' +
          '<button type="button" class="modal-close-btn" id="p1LoginClose">閉じる</button>';

        $("#p4LogoutBtn", box).addEventListener("click", async function () {
          await window.NAKATSU_AUTH.signOut();
          var s = await window.NAKATSU_AUTH.getSession();
          render(s);
        });
        $("#p1LoginClose", box).addEventListener("click", function () { modal.hidden = true; });
        return;
      }

      var isSignup = mode === "signup";
      box.innerHTML =
        '<h2 class="modal-title">' + (isSignup ? "新規登録（店舗の方）" : "ログイン") + '</h2>' +
        '<p class="modal-text">' +
          (isSignup
            ? "登録後、確認メールが届きます。メール内のリンクを開くと本登録が完了します。"
            : "店舗向け管理画面へのログインです。お気に入り機能はログインしなくても引き続き使えます。") +
        '</p>' +
        '<div class="p1-login-form">' +
          '<label>メールアドレス<input type="email" id="p4Email" placeholder="example@email.com" autocomplete="email"></label>' +
          '<label>パスワード<input type="password" id="p4Password" placeholder="8文字以上" autocomplete="' + (isSignup ? "new-password" : "current-password") + '"></label>' +
          '<button type="button" class="modal-form-btn" id="p4Submit">' + (isSignup ? "登録する" : "ログイン") + '</button>' +
          '<p class="p4-form-msg" id="p4FormMsg" aria-live="polite"></p>' +
        "</div>" +
        '<button type="button" class="p4-link-btn" id="p4ToggleMode">' +
          (isSignup ? "ログインはこちら" : "はじめての方はこちら（新規登録）") +
        '</button>' +
        '<p class="modal-text modal-text-sub">現在もお気に入り機能はこの端末内（localStorage）で利用できます。</p>' +
        '<button type="button" class="modal-close-btn" id="p1LoginClose">閉じる</button>';

      $("#p1LoginClose", box).addEventListener("click", function () { modal.hidden = true; });

      $("#p4ToggleMode", box).addEventListener("click", function () {
        mode = isSignup ? "login" : "signup";
        render(null);
      });

      $("#p4Submit", box).addEventListener("click", async function () {
        var email = $("#p4Email", box).value.trim();
        var password = $("#p4Password", box).value;
        var msg = $("#p4FormMsg", box);

        if (!email || !password) {
          msg.textContent = "メールアドレスとパスワードを入力してください。";
          return;
        }

        msg.textContent = isSignup ? "登録中…" : "ログイン中…";

        var result = isSignup
          ? await window.NAKATSU_AUTH.signUp(email, password)
          : await window.NAKATSU_AUTH.signIn(email, password);

        if (result.error) {
          msg.textContent = "エラー：" + result.error.message;
          return;
        }

        if (isSignup) {
          msg.textContent = "登録できました。確認メールをご確認ください。";
          return;
        }

        var session = await window.NAKATSU_AUTH.getSession();
        render(session);
      });
    }

    window.NAKATSU_AUTH.getSession().then(render);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.hidden = true;
    });
  }

  /* =========================================================
     4. ハンバーガーメニューに「店舗管理画面」を追加
  ========================================================= */
  async function addDashboardMenuItem() {
    var overlay = document.getElementById("p1MenuOverlay");
    if (!overlay || overlay.dataset.p4Added) return;

    var session = await window.NAKATSU_AUTH.getSession();
    if (!session || !session.user) return;

    overlay.dataset.p4Added = "1";
    var closeBtn = overlay.querySelector(".p1-menu-close");
    var item = document.createElement("button");
    item.type = "button";
    item.className = "p1-menu-item";
    item.textContent = "🏪 店舗管理画面";
    item.addEventListener("click", function () {
      window.location.href = "shop-dashboard.html";
    });
    overlay.querySelector(".p1-menu-drawer").insertBefore(item, closeBtn);
  }

  /* =========================================================
     5. スタイル
  ========================================================= */
  function addStyle() {
    if (document.getElementById("p4Style")) return;
    var style = document.createElement("style");
    style.id = "p4Style";
    style.textContent = [
      ".p4-status-badge { border-radius: 999px; padding: 3px 9px; font-size: 10.5px; font-weight: 700; }",
      ".p4-status-badge.is-stale { font-style: italic; }",
      ".p4-reserve-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; border-radius: var(--r-s, 10px); font-weight: 700; background: var(--kaki, #e05a2b); color: #fff; padding: 10px 8px; text-decoration: none; font-size: 12.5px; }",
      ".p4-link-btn { display: block; width: 100%; text-align: center; border: none; background: none; color: var(--pine, #0e5148); font-weight: 700; font-size: 13px; padding: 10px 0; cursor: pointer; text-decoration: underline; }",
      ".p4-form-msg { min-height: 16px; font-size: 12px; color: var(--kaki, #e05a2b); font-weight: 700; margin: 2px 0 0; }"
    ].join("\n");
    document.head.appendChild(style);
  }

  /* =========================================================
     6. 初期化
  ========================================================= */
  function init() {
    if (!window.NAKATSU_AUTH) {
      console.warn("phase4-shop-status.js: supabase-auth.js が先に読み込まれている必要があります。");
      return;
    }

    addStyle();
    upgradeLoginModal();
    addDashboardMenuItem();

    document.addEventListener("nakatsu:rendered", annotateShopStatus);
    annotateShopStatus();

    // ログイン状態が変わったらメニューを更新
    window.NAKATSU_AUTH.onAuthStateChange(function () {
      var overlay = document.getElementById("p1MenuOverlay");
      if (overlay) delete overlay.dataset.p4Added;
      addDashboardMenuItem();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(init, 300);
    });
  } else {
    setTimeout(init, 300);
  }
})();
