/* ============================================================
   中津くらしナビ phase2-features.js（機能強化 第2弾）

   このファイルでやっていること：
   1. 支払い方法バッジ（paymentMethods フィールド対応）＋支払い方法での絞り込み
   2. ファミリー向けタグ（familyTags フィールド対応）＋ファミリー条件での絞り込み
      ※既存の tags（座敷・子連れOK等）から自動でファミリータグ化。
        新しい事実の追加はせず、既に掲載済みの情報を見やすくするだけ。
   3. チェーン店のまとめ表示（chainGroup / brandName フィールド対応）
      ※確認済みチェーンの限定リスト方式。
        「中津からあげ ○○」のような屋号の共通語は誤ってまとめない。

   ★データの正直さについて★
   - 支払い方法は、対応が確認できた施設にだけ表示します。
   - サンプルとして、全国共通対応が公知のコンビニ等にのみ初期データを付与。
   - 未確認の店舗に勝手に「PayPay対応」等を表示することはありません。

   読み込み位置：phase1-features.js の後
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

  /* =========================================================
     1. 支払い方法の定義
  ========================================================= */
  var PAYMENTS = [
    { key: "現金",           icon: "💴" },
    { key: "クレジットカード", icon: "💳" },
    { key: "PayPay",         icon: "🅿" },
    { key: "QR決済",         icon: "📱" },
    { key: "交通系IC",       icon: "🚃" },
    { key: "電子マネー",     icon: "💰" }
  ];

  function getPayments(facility) {
    var raw = facility.paymentMethods || facility.payments;
    if (!Array.isArray(raw)) return [];
    return raw.map(String).filter(Boolean);
  }

  /* サンプル初期データ：
     全国チェーン共通で決済対応が公知の施設にのみ付与（店舗独自の例外はあり得るため、
     画面には「来店前にご確認を」の注意を常に添える） */
  var PAYMENT_SAMPLES = [
    { match: "セブン-イレブン",   pay: ["現金", "クレジットカード", "PayPay", "QR決済", "交通系IC", "電子マネー"] },
    { match: "セブンイレブン",     pay: ["現金", "クレジットカード", "PayPay", "QR決済", "交通系IC", "電子マネー"] },
    { match: "ファミリーマート",   pay: ["現金", "クレジットカード", "PayPay", "QR決済", "交通系IC", "電子マネー"] },
    { match: "ローソン",           pay: ["現金", "クレジットカード", "PayPay", "QR決済", "交通系IC", "電子マネー"] },
    { match: "マクドナルド",       pay: ["現金", "クレジットカード", "PayPay", "QR決済", "交通系IC", "電子マネー"] }
  ];

  function attachPaymentSamples() {
    facilities.forEach(function (f) {
      if (getPayments(f).length) return; // 既にデータがある施設には触らない
      PAYMENT_SAMPLES.forEach(function (s) {
        if (String(f.name || "").indexOf(s.match) === 0) {
          f.paymentMethods = s.pay.slice();
          f.paymentNote = "全国チェーン共通の対応（店舗により例外の場合あり）";
        }
      });
    });
  }

  /* =========================================================
     2. ファミリータグの定義
        既存の tags から自動変換（新しい事実は追加しない）
  ========================================================= */
  var FAMILY_DEFS = [
    { key: "子連れOK",     icon: "👶", from: ["子連れOK", "子連れ"] },
    { key: "座敷あり",     icon: "🪑", from: ["座敷あり", "座敷"] },
    { key: "個室あり",     icon: "🚪", from: ["個室"] },
    { key: "ベビーカーOK", icon: "🍼", from: ["ベビーカー"] },
    { key: "キッズメニュー", icon: "🍽️", from: ["キッズメニュー"] },
    { key: "駐車場あり",   icon: "🅿️", from: ["駐車場あり"] }
  ];

  function getFamilyTags(facility) {
    /* 明示フィールドがあればそれを優先 */
    if (Array.isArray(facility.familyTags) && facility.familyTags.length) {
      return facility.familyTags.map(String);
    }
    /* 既存タグから導出（表示の見やすさ向上のみ） */
    var tags = (facility.tags || []).map(String);
    var result = [];
    FAMILY_DEFS.forEach(function (def) {
      var hit = def.from.some(function (word) {
        return tags.some(function (t) { return t === word; });
      });
      if (hit) result.push(def.key);
    });
    return result;
  }

  function familyIcon(key) {
    var def = FAMILY_DEFS.find(function (d) { return d.key === key; });
    return def ? def.icon : "✅";
  }

  /* =========================================================
     3. チェーン店グルーピング
        確認済みチェーンの限定リスト（名前がこの語で始まる施設のみ対象）
  ========================================================= */
  var KNOWN_CHAINS = [
    "セブン-イレブン", "セブンイレブン", "ファミリーマート", "ローソン",
    "ジョイフル", "マクドナルド", "ほっともっと", "ガスト",
    "リンガーハット", "CoCo壱番屋", "かつや", "焼肉きんぐ",
    "や台ずし", "井手ちゃんぽん", "どんどん亭", "ウエスト",
    "ダイレックス", "マルショク",
    "宝来軒", "からあげの鳥しん", "チキンハウス"
  ];

  function getChainName(facility) {
    /* 明示フィールドが最優先 */
    if (facility.chainGroup) return String(facility.chainGroup);
    if (facility.brandName) return String(facility.brandName);

    var name = String(facility.name || "");
    for (var i = 0; i < KNOWN_CHAINS.length; i++) {
      var brand = KNOWN_CHAINS[i];
      if (name.indexOf(brand) === 0 && name.length > brand.length) {
        return brand;
      }
      if (name === brand) return brand;
    }
    return null;
  }

  /* =========================================================
     4. カードHTMLの拡張（支払い・ファミリーのバッジ行を追加）
  ========================================================= */
  function extendCardHtml() {
    var original = window.createCardHtml;
    if (typeof original !== "function") return;

    window.createCardHtml = function (facility) {
      var html = original(facility);

      var extraRows = "";

      var pays = getPayments(facility);
      if (pays.length) {
        extraRows +=
          '<div class="p2-badge-row" aria-label="支払い方法">' +
          '<span class="p2-badge-row-label">支払い</span>' +
          pays.map(function (p) {
            var def = PAYMENTS.find(function (d) { return d.key === p; });
            return '<span class="p2-pay-badge">' + (def ? def.icon + " " : "") + escapeHtml(p) + "</span>";
          }).join("") +
          (facility.paymentNote
            ? '<span class="p2-badge-note">' + escapeHtml(facility.paymentNote) + "</span>"
            : "") +
          "</div>";
      }

      var fams = getFamilyTags(facility);
      if (fams.length) {
        extraRows +=
          '<div class="p2-badge-row" aria-label="ファミリー向け情報">' +
          '<span class="p2-badge-row-label">ファミリー</span>' +
          fams.map(function (t) {
            return '<span class="p2-family-badge">' + familyIcon(t) + " " + escapeHtml(t) + "</span>";
          }).join("") +
          "</div>";
      }

      if (!extraRows) return html;

      /* card-actions の直前（＝カード下部）に差し込む */
      var marker = '<div class="card-actions">';
      var pos = html.lastIndexOf(marker);
      if (pos === -1) return html.replace("</article>", extraRows + "</article>");
      return html.slice(0, pos) + extraRows + html.slice(pos);
    };
  }

  /* =========================================================
     5. チェーンまとめ表示（render の置き換え）
        元の render と同じ流れ＋同一チェーン2店舗以上をまとめる
  ========================================================= */
  function chainAwareRender() {
    var cardListEl = document.getElementById("cardList");
    var noResultEl = document.getElementById("noResult");
    var resultCountEl = document.getElementById("resultCount");
    if (!cardListEl) return;

    /* index.html内の改善パッチと同じ流れ：カテゴリナビとお気に入りボタンも更新 */
    if (typeof window.renderCategoryNav === "function") window.renderCategoryNav();
    if (typeof window.renderFavOnlyButton === "function") window.renderFavOnlyButton();

    var filtered = getFilteredFacilities();

    if (resultCountEl) {
      var catLabel = state.category === "all"
        ? "すべて"
        : state.category === "favorites"
          ? "お気に入り"
          : state.category;
      resultCountEl.textContent = filtered.length + "件表示中｜カテゴリ：" + catLabel +
        (state.keyword ? "｜検索：" + state.keyword : "");
    }

    if (filtered.length === 0) {
      cardListEl.innerHTML = "";
      if (noResultEl) {
        noResultEl.textContent = state.openNowOnly
          ? "今の条件では、営業中と判定できる施設が見つかりませんでした。営業時間が未確認（要確認）の施設は対象外です。チェックを外してお試しください。"
          : "条件に合う施設が見つかりませんでした";
        noResultEl.hidden = false;
      }
      return;
    }
    if (noResultEl) noResultEl.hidden = true;

    /* --- チェーンごとにまとめる（2店舗以上のみ。並び順は最初に出てきた位置を維持） --- */
    var chainCount = {};
    filtered.forEach(function (f) {
      var chain = getChainName(f);
      if (chain) chainCount[chain] = (chainCount[chain] || 0) + 1;
    });

    var renderedChains = {};
    var htmlParts = [];

    filtered.forEach(function (f) {
      var chain = getChainName(f);

      if (chain && chainCount[chain] >= 2) {
        if (renderedChains[chain]) return; // 既にグループとして出力済み
        renderedChains[chain] = true;

        var members = filtered.filter(function (m) { return getChainName(m) === chain; });
        htmlParts.push(
          '<details class="p2-chain-group">' +
            '<summary class="p2-chain-summary">' +
              '<span class="p2-chain-icon">🏪</span>' +
              '<span class="p2-chain-name">' + escapeHtml(chain) + "</span>" +
              '<span class="p2-chain-count">' + members.length + "店舗</span>" +
              '<span class="p2-chain-hint">タップで各店舗を表示</span>' +
            "</summary>" +
            '<div class="p2-chain-body">' +
              members.map(createCardHtml).join("") +
            "</div>" +
          "</details>"
        );
        return;
      }

      htmlParts.push(createCardHtml(f));
    });

    cardListEl.innerHTML = htmlParts.join("");

    /* お気に入りボタンの結線（元の render と同じ） */
    $all(".fav-btn", cardListEl).forEach(function (btn) {
      btn.addEventListener("click", function () {
        toggleFavorite(Number(btn.dataset.id), btn);
      });
    });
  }

  /* =========================================================
     6. 絞り込み：支払い方法・ファミリー条件
  ========================================================= */
  var p2 = {
    payment: null, // 選択中の支払い方法（null=指定なし）
    family: null   // 選択中のファミリー条件（null=指定なし）
  };

  function hookFilter() {
    var prev = window.getFilteredFacilities;
    if (typeof prev !== "function") return;

    window.getFilteredFacilities = function () {
      var list = prev();

      if (p2.payment) {
        list = list.filter(function (f) {
          return getPayments(f).indexOf(p2.payment) !== -1;
        });
      }
      if (p2.family) {
        list = list.filter(function (f) {
          return getFamilyTags(f).indexOf(p2.family) !== -1;
        });
      }
      return list;
    };
  }

  function buildFilterUi() {
    var sortRow = document.getElementById("p1SortRow");
    if (!sortRow || document.getElementById("p2FilterWrap")) return;

    var wrap = document.createElement("div");
    wrap.id = "p2FilterWrap";
    wrap.innerHTML =
      '<p class="p1-block-title">支払い方法で絞る</p>' +
      '<p class="p2-filter-note">対応が確認できた施設のみ表示されます。最新の対応状況は来店前にご確認ください。</p>' +
      '<div class="p2-chip-row" id="p2PayRow">' +
        PAYMENTS.map(function (p) {
          return '<button type="button" class="p2-filter-chip" data-pay="' + escapeHtml(p.key) + '">' + p.icon + " " + escapeHtml(p.key) + "</button>";
        }).join("") +
      "</div>" +
      '<p class="p1-block-title">ファミリー条件で絞る</p>' +
      '<div class="p2-chip-row" id="p2FamRow">' +
        FAMILY_DEFS.map(function (d) {
          return '<button type="button" class="p2-filter-chip" data-fam="' + escapeHtml(d.key) + '">' + d.icon + " " + escapeHtml(d.key) + "</button>";
        }).join("") +
      "</div>";

    sortRow.parentNode.insertBefore(wrap, sortRow.nextSibling);

    $all("[data-pay]", wrap).forEach(function (btn) {
      btn.addEventListener("click", function () {
        p2.payment = p2.payment === btn.dataset.pay ? null : btn.dataset.pay;
        syncChips();
        render();
      });
    });
    $all("[data-fam]", wrap).forEach(function (btn) {
      btn.addEventListener("click", function () {
        p2.family = p2.family === btn.dataset.fam ? null : btn.dataset.fam;
        syncChips();
        render();
      });
    });
  }

  function syncChips() {
    $all("[data-pay]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.dataset.pay === p2.payment);
    });
    $all("[data-fam]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.dataset.fam === p2.family);
    });
  }

  function hookResetButton() {
    var resetBtn = document.getElementById("resetBtn");
    if (!resetBtn) return;
    resetBtn.addEventListener("click", function () {
      p2.payment = null;
      p2.family = null;
      syncChips();
    });
  }

  /* =========================================================
     7. スタイル
  ========================================================= */
  function addStyle() {
    if (document.getElementById("p2Style")) return;
    var style = document.createElement("style");
    style.id = "p2Style";
    style.textContent = [
      /* --- 絞り込みチップ --- */
      ".p2-filter-note { margin: -4px 0 8px; font-size: 11px; color: var(--ink-sub, #5c6a66); }",
      ".p2-chip-row { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; -webkit-overflow-scrolling: touch; }",
      ".p2-filter-chip { flex: none; border: 1px solid var(--hairline, #e3e2da); background: var(--surface, #fff); color: var(--ink, #1b2422); border-radius: 999px; padding: 7px 12px; font-size: 12px; font-weight: 700; font-family: inherit; cursor: pointer; }",
      ".p2-filter-chip.is-active { background: var(--pine, #0e5148); border-color: var(--pine, #0e5148); color: #fff; }",

      /* --- カード内バッジ行 --- */
      ".p2-badge-row { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; margin: 8px 0; }",
      ".p2-badge-row-label { flex: none; font-size: 10px; font-weight: 800; letter-spacing: .06em; color: var(--ink-sub, #5c6a66); background: var(--paper, #f2f1ec); border: 1px solid var(--hairline, #e3e2da); border-radius: 5px; padding: 3px 6px; }",
      ".p2-pay-badge { font-size: 11px; font-weight: 700; color: var(--pine, #0e5148); background: var(--pine-soft, #e3efec); border-radius: 999px; padding: 4px 9px; }",
      ".p2-family-badge { font-size: 11px; font-weight: 700; color: #8a4a12; background: #fdf1e4; border-radius: 999px; padding: 4px 9px; }",
      ".p2-badge-note { flex-basis: 100%; font-size: 10px; color: var(--ink-sub, #5c6a66); }",

      /* --- チェーンまとめ --- */
      ".p2-chain-group { border: 1px solid var(--hairline, #e3e2da); border-radius: var(--r-l, 20px); background: var(--surface, #fff); box-shadow: 0 1px 2px rgba(27,36,34,.05), 0 4px 12px rgba(27,36,34,.06); overflow: hidden; }",
      ".p2-chain-summary { display: flex; align-items: center; gap: 8px; padding: 15px 14px; cursor: pointer; list-style: none; }",
      ".p2-chain-summary::-webkit-details-marker { display: none; }",
      ".p2-chain-icon { flex: none; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 12px; background: var(--pine-soft, #e3efec); font-size: 19px; }",
      ".p2-chain-name { font-size: 15px; font-weight: 800; color: var(--ink, #1b2422); }",
      ".p2-chain-count { flex: none; font-size: 11px; font-weight: 800; color: #fff; background: var(--pine, #0e5148); border-radius: 999px; padding: 3px 9px; }",
      ".p2-chain-hint { margin-left: auto; flex: none; font-size: 10.5px; color: var(--ink-sub, #5c6a66); }",
      ".p2-chain-group[open] .p2-chain-summary { border-bottom: 1px solid var(--hairline, #e3e2da); }",
      ".p2-chain-group[open] .p2-chain-hint { display: none; }",
      ".p2-chain-body { padding: 12px; background: var(--paper, #f2f1ec); display: flex; flex-direction: column; gap: 12px; }",
      ".p2-chain-body .card { box-shadow: none; }"
    ].join("\n");
    document.head.appendChild(style);
  }

  /* =========================================================
     8. 初期化（phase1 の後に動く）
  ========================================================= */
  function init() {
    if (typeof facilities === "undefined" || typeof state === "undefined") {
      console.warn("phase2-features.js: script.js が先に読み込まれている必要があります。");
      return;
    }

    addStyle();
    attachPaymentSamples();
    extendCardHtml();
    hookFilter();
    buildFilterUi();
    hookResetButton();

    /* render をチェーン対応版に置き換え（phase1の距離バッジ処理は維持） */
    window.render = function () {
      chainAwareRender();
      /* phase1 が定義した距離バッジ関数があれば適用される（renderのwrap経由ではなく直接） */
      document.dispatchEvent(new CustomEvent("nakatsu:rendered"));
    };

    document.addEventListener("nakatsu:facilities-updated", attachPaymentSamples);

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      /* phase1（setTimeout 50ms）の初期化が終わってから動かす */
      setTimeout(init, 150);
    });
  } else {
    setTimeout(init, 150);
  }
})();
