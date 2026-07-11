/* ============================================================
   中津くらしナビ shop-dashboard.js
   shop-dashboard.html 専用のページロジック

   やること：
   1. ログイン確認（未ログインならログイン案内を表示）
   2. 自分が申請・承認された店舗の一覧表示
      - 承認済み：空き状況を更新するボタン、写真アップロード
      - 承認待ち：その旨を表示
   3. 新しい店舗を管理したい時の申請フォーム（店名検索→申請）
   ============================================================ */

(function () {
  "use strict";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  var STATUS_OPTIONS = ["空きあり", "やや混雑", "満席"];

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

  async function main() {
    var loggedOutEl = document.getElementById("dashLoggedOut");
    var loggedInEl = document.getElementById("dashLoggedIn");

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
    var photoMap = {};

    if (facilityIds.length) {
      var statusRes = await client.from("shop_status").select("*").in("facility_id", facilityIds);
      if (!statusRes.error) {
        (statusRes.data || []).forEach(function (row) {
          statusMap[String(row.facility_id)] = row;
        });
      }

      var photoRes = await client.from("shop_photos").select("*").in("facility_id", facilityIds);
      if (!photoRes.error) {
        (photoRes.data || []).forEach(function (row) {
          photoMap[String(row.facility_id)] = row;
        });
      }
    }

    listEl.innerHTML = rows.map(function (row) {
      if (!row.approved) {
        return (
          '<div class="dash-shop-card is-pending">' +
            '<p class="dash-shop-name">' + escapeHtml(row.facility_name || ("施設ID:" + row.facility_id)) + "</p>" +
            '<p class="dash-pending-note">⏳ 承認待ちです。サイト運営側の確認が済むと、ここから空き状況を更新できるようになります。</p>' +
          "</div>"
        );
      }

      var status = statusMap[String(row.facility_id)];
      var currentLabel = status ? status.status + "（" + timeAgoLabel(status.updated_at) + "更新）" : "まだ未設定";
      var photo = photoMap[String(row.facility_id)];

      return (
        '<div class="dash-shop-card" data-facility-id="' + escapeHtml(row.facility_id) + '" data-facility-name="' + escapeHtml(row.facility_name || "") + '">' +
          '<p class="dash-shop-name">' + escapeHtml(row.facility_name || ("施設ID:" + row.facility_id)) + "</p>" +
          '<p class="dash-current-status">現在：<strong>' + escapeHtml(currentLabel) + "</strong></p>" +
          '<div class="dash-status-btns">' +
            STATUS_OPTIONS.map(function (s) {
              return '<button type="button" class="dash-status-btn" data-status="' + escapeHtml(s) + '">' + escapeHtml(s) + "</button>";
            }).join("") +
          "</div>" +
          '<p class="dash-update-msg" aria-live="polite"></p>' +

          '<div class="dash-photo-block">' +
            '<p class="dash-photo-label">お店の写真</p>' +
            '<div class="dash-photo-preview">' +
              (photo
                ? '<img src="' + escapeHtml(photo.photo_url) + '" alt="' + escapeHtml(row.facility_name || "") + 'の写真">'
                : '<span class="dash-photo-empty">未設定</span>') +
            "</div>" +
            '<label class="dash-photo-upload-btn">' +
              "写真を選ぶ" +
              '<input type="file" accept="image/*" class="dash-photo-input" hidden>' +
            "</label>" +
            (photo ? '<button type="button" class="dash-photo-remove-btn">写真を削除</button>' : "") +
            '<p class="dash-photo-msg" aria-live="polite"></p>' +
          "</div>" +
        "</div>"
      );
    }).join("");

    Array.prototype.slice.call(listEl.querySelectorAll(".dash-shop-card:not(.is-pending)")).forEach(function (card) {
      card.querySelectorAll(".dash-status-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          updateStatus(card, btn.dataset.status, userId);
        });
      });

      var fileInput = card.querySelector(".dash-photo-input");
      if (fileInput) {
        fileInput.addEventListener("change", function () {
          if (fileInput.files && fileInput.files[0]) {
            uploadPhoto(card, fileInput.files[0], userId);
          }
        });
      }

      var removeBtn = card.querySelector(".dash-photo-remove-btn");
      if (removeBtn) {
        removeBtn.addEventListener("click", function () {
          removePhoto(card, userId);
        });
      }
    });
  }

  async function updateStatus(card, newStatus, userId) {
    var facilityId = Number(card.dataset.facilityId);
    var facilityName = card.dataset.facilityName;
    var msgEl = card.querySelector(".dash-update-msg");
    var client = window.NAKATSU_AUTH.client;

    msgEl.textContent = "更新中…";

    var res = await client.from("shop_status").upsert({
      facility_id: facilityId,
      facility_name: facilityName,
      status: newStatus,
      updated_at: new Date().toISOString(),
      updated_by: userId
    }, { onConflict: "facility_id" });

    if (res.error) {
      msgEl.textContent = "更新に失敗しました：" + res.error.message;
      return;
    }

    msgEl.textContent = "✅ 「" + newStatus + "」に更新しました";
    var currentEl = card.querySelector(".dash-current-status");
    if (currentEl) currentEl.innerHTML = "現在：<strong>" + escapeHtml(newStatus) + "（たった今更新）</strong>";
  }

  /* 写真を最大幅1280pxにリサイズしてJPEGに変換（通信量・保存容量を抑えるため） */
  function resizeImageFile(file) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      var reader = new FileReader();

      reader.onload = function (e) { img.src = e.target.result; };
      reader.onerror = function () { reject(new Error("ファイルの読み込みに失敗しました")); };

      img.onload = function () {
        var maxWidth = 1280;
        var scale = Math.min(1, maxWidth / img.width);
        var canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(function (blob) {
          if (!blob) { reject(new Error("画像の変換に失敗しました")); return; }
          resolve(blob);
        }, "image/jpeg", 0.82);
      };
      img.onerror = function () { reject(new Error("画像として読み込めませんでした")); };

      reader.readAsDataURL(file);
    });
  }

  async function uploadPhoto(card, file, userId) {
    var facilityId = Number(card.dataset.facilityId);
    var msgEl = card.querySelector(".dash-photo-msg");
    var previewEl = card.querySelector(".dash-photo-preview");
    var client = window.NAKATSU_AUTH.client;

    if (!file.type || file.type.indexOf("image/") !== 0) {
      msgEl.textContent = "画像ファイルを選んでください。";
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      msgEl.textContent = "ファイルが大きすぎます（15MBまで）。";
      return;
    }

    msgEl.textContent = "アップロード中…";

    try {
      var blob = await resizeImageFile(file);
      var path = facilityId + "/" + Date.now() + ".jpg";

      var uploadRes = await client.storage.from("shop-photos").upload(path, blob, {
        contentType: "image/jpeg",
        upsert: false
      });
      if (uploadRes.error) throw uploadRes.error;

      var urlRes = client.storage.from("shop-photos").getPublicUrl(path);
      var publicUrl = urlRes.data.publicUrl;

      var dbRes = await client.from("shop_photos").upsert({
        facility_id: facilityId,
        photo_url: publicUrl,
        updated_at: new Date().toISOString(),
        updated_by: userId
      }, { onConflict: "facility_id" });
      if (dbRes.error) throw dbRes.error;

      previewEl.innerHTML = '<img src="' + escapeHtml(publicUrl) + '" alt="アップロードした写真">';
      msgEl.textContent = "✅ 写真を更新しました";

      if (!card.querySelector(".dash-photo-remove-btn")) {
        var removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "dash-photo-remove-btn";
        removeBtn.textContent = "写真を削除";
        removeBtn.addEventListener("click", function () { removePhoto(card, userId); });
        card.querySelector(".dash-photo-upload-btn").insertAdjacentElement("afterend", removeBtn);
      }
    } catch (err) {
      msgEl.textContent = "失敗しました：" + (err.message || "不明なエラー");
    }
  }

  async function removePhoto(card, userId) {
    var facilityId = Number(card.dataset.facilityId);
    var msgEl = card.querySelector(".dash-photo-msg");
    var previewEl = card.querySelector(".dash-photo-preview");
    var client = window.NAKATSU_AUTH.client;

    msgEl.textContent = "削除中…";

    var res = await client.from("shop_photos").delete().eq("facility_id", facilityId);
    if (res.error) {
      msgEl.textContent = "削除に失敗しました：" + res.error.message;
      return;
    }

    previewEl.innerHTML = '<span class="dash-photo-empty">未設定</span>';
    msgEl.textContent = "写真を削除しました";
    var removeBtn = card.querySelector(".dash-photo-remove-btn");
    if (removeBtn) removeBtn.remove();
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
            '<span>' + escapeHtml(f.category) + " " + escapeHtml(f.name) + "</span>" +
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
        });
      });
    });
  }

  document.addEventListener("nakatsu:app-ready", function () {
    setTimeout(main, 200);
  });
})();
