/* ============================================================
   中津くらしナビ：掲載依頼モーダル強化
   ファイル名：request-form-upgrade-extra.js
   ============================================================ */

(function () {
  "use strict";

  // Googleフォームを作ったら、ここにURLを入れる
  // 例: const GOOGLE_FORM_URL = "https://forms.gle/xxxxxxxx";
  const GOOGLE_FORM_URL = "";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function addStyle() {
    if (document.getElementById("requestFormUpgradeStyle")) return;

    const style = document.createElement("style");
    style.id = "requestFormUpgradeStyle";

    style.textContent = `
      .request-upgrade-note {
        margin: 10px 0 0;
        padding: 10px 12px;
        border-radius: 14px;
        background: #fdf2f8;
        color: #9d174d;
        font-size: 12.5px;
        font-weight: 800;
        line-height: 1.6;
        box-shadow: inset 0 0 0 1px rgba(157, 23, 77, 0.14);
      }

      .request-form-status {
        margin: 10px 0 0;
        padding: 9px 12px;
        border-radius: 14px;
        font-size: 12.5px;
        font-weight: 800;
        line-height: 1.5;
        text-align: center;
      }

      .request-form-status.is-ready {
        background: #ecfdf5;
        color: #065f46;
      }

      .request-form-status.is-preparing {
        background: #f1f5f9;
        color: #475569;
      }

      .request-form-status a {
        color: inherit;
        font-weight: 900;
      }
    `;

    document.head.appendChild(style);
  }

  function upgradeModal() {
    const modal = document.getElementById("requestModal");
    if (!modal) return;

    const box = modal.querySelector(".modal-box");
    if (!box) return;

    const text = box.querySelector(".modal-text");

    if (text && !text.dataset.upgraded) {
      text.dataset.upgraded = "1";
      text.innerHTML =
        "掲載・修正依頼では、<strong>店名・住所・営業時間・公式URL・Instagram URL・GoogleマップURL</strong>を送れます。分かる範囲だけでOKです。";
    }

    const list = box.querySelector(".modal-list");

    if (list && !list.dataset.upgraded) {
      list.dataset.upgraded = "1";

      const additions = [
        "Instagram URL（お店の公式アカウント）",
        "公式ホームページURL",
        "GoogleマップURL",
        "修正してほしい内容（間違い・閉店・移転など）"
      ];

      const existingText = list.textContent || "";

      additions.forEach(function (label) {
        if (existingText.indexOf(label) !== -1) return;

        const li = document.createElement("li");
        li.textContent = label;
        list.appendChild(li);
      });
    }

    if (!document.getElementById("requestUpgradeNote")) {
      const note = document.createElement("p");
      note.id = "requestUpgradeNote";
      note.className = "request-upgrade-note";
      note.textContent =
        "📷 Instagram URLも送れます。お店の公式Instagramがある場合は、URLを添えていただくとカードに「Instagram」ボタンを表示できます。";

      const list2 = box.querySelector(".modal-list");

      if (list2) {
        list2.insertAdjacentElement("afterend", note);
      } else {
        const closeBtn = document.getElementById("modalCloseBtn");
        if (closeBtn) {
          box.insertBefore(note, closeBtn);
        } else {
          box.appendChild(note);
        }
      }
    }

    if (!document.getElementById("requestFormStatus")) {
      const status = document.createElement("p");
      status.id = "requestFormStatus";

      if (GOOGLE_FORM_URL) {
        status.className = "request-form-status is-ready";
        status.innerHTML =
          '<a href="' +
          GOOGLE_FORM_URL +
          '" target="_blank" rel="noopener noreferrer">📩 掲載依頼フォームを開く</a>';
      } else {
        status.className = "request-form-status is-preparing";
        status.textContent =
          "📩 掲載依頼フォーム準備中です。公開後、このページでご案内します。";
      }

      const closeBtn = document.getElementById("modalCloseBtn");

      if (closeBtn) {
        box.insertBefore(status, closeBtn);
      } else {
        box.appendChild(status);
      }
    }
  }

  ready(function () {
    addStyle();
    upgradeModal();

    setTimeout(upgradeModal, 400);
    setTimeout(upgradeModal, 1200);

    const requestBtn = document.getElementById("postRequestBtn");

    if (requestBtn) {
      requestBtn.addEventListener("click", function () {
        setTimeout(upgradeModal, 50);
      });
    }
  });
})();
