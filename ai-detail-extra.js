/* ============================================================
   中津くらしナビ：AIっぽい店舗詳細表示
   ファイル名：ai-detail-extra.js

   本物のAI APIは使わず、サイト内データから
   「あなたにおすすめ理由」「向いている人」「確認ポイント」
   を自動生成する無料版。
   ============================================================ */

(function () {
  const STYLE_ID = "ai-detail-extra-style";

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getFacilityById(id) {
    if (typeof facilities === "undefined" || !Array.isArray(facilities)) {
      return null;
    }

    return facilities.find(function (facility) {
      return Number(facility.id) === Number(id);
    });
  }

  function getTypeLabel(facility) {
    const text = [
      facility.category,
      facility.name,
      facility.description,
      Array.isArray(facility.tags) ? facility.tags.join(" ") : ""
    ].join(" ");

    if (/居酒屋|焼き鳥|夜|酒|バー/.test(text)) return "夜ご飯・居酒屋系";
    if (/ラーメン|麺|宝来軒/.test(text)) return "ラーメン系";
    if (/カフェ|珈琲|コーヒー|スイーツ|喫茶/.test(text)) return "カフェ系";
    if (/からあげ|弁当|惣菜|定食|ランチ|ご飯/.test(text)) return "ご飯・ランチ系";
    if (/温泉|観光|道の駅/.test(text)) return "おでかけ系";
    if (/病院|歯医者|薬局/.test(text)) return "生活サポート系";
    if (/駐車場|パーキング/.test(text)) return "移動・駐車場系";

    return "中津の生活便利スポット";
  }

  function getRecommendReasons(facility) {
    const reasons = [];
    const type = getTypeLabel(facility);

    reasons.push(type + "を探している人に合いやすいです。");

    if (facility.instagram) {
      reasons.push("Instagramがあるので、雰囲気や最新情報を確認しやすいです。");
    }

    if (facility.officialUrl) {
      reasons.push("公式情報につながるURLがあるため、行く前の確認がしやすいです。");
    }

    if (facility.address && facility.address !== "大分県中津市周辺") {
      reasons.push("住所情報があるため、地図で場所を確認しやすいです。");
    }

    if (facility.phone) {
      reasons.push("電話確認できる可能性があるので、予約や営業時間確認に向いています。");
    }

    if (facility.verified) {
      reasons.push("確認済み情報があるため、比較的安心して候補に入れやすいです。");
    } else {
      reasons.push("一部情報は要確認なので、行く前に公式情報を見た方が安全です。");
    }

    return reasons.slice(0, 4);
  }

  function getBestFor(facility) {
    const text = [
      facility.category,
      facility.name,
      facility.description,
      Array.isArray(facility.tags) ? facility.tags.join(" ") : ""
    ].join(" ");

    const list = [];

    if (/居酒屋|焼き鳥|夜|酒|バー/.test(text)) {
      list.push("仕事終わりに軽く飲みたい人");
      list.push("中津駅周辺で夜ご飯を探している人");
      list.push("友達や同僚と行く店を探している人");
    } else if (/ラーメン|麺|宝来軒/.test(text)) {
      list.push("ラーメンを食べたい人");
      list.push("短時間でご飯を済ませたい人");
      list.push("中津で定番系のご飯を探している人");
    } else if (/カフェ|珈琲|コーヒー|スイーツ|喫茶/.test(text)) {
      list.push("ゆっくり休憩したい人");
      list.push("カフェやスイーツを探している人");
      list.push("Instagramで雰囲気を見てから行きたい人");
    } else if (/からあげ|弁当|惣菜|定食|ランチ|ご飯/.test(text)) {
      list.push("昼ごはん・晩ごはんを探している人");
      list.push("テイクアウト候補を探している人");
      list.push("中津らしいご飯を食べたい人");
    } else {
      list.push("中津市周辺で便利な場所を探している人");
      list.push("行く前に場所や公式情報を確認したい人");
      list.push("初めて行く候補を比較したい人");
    }

    return list;
  }

  function getCheckPoints(facility) {
    const points = [];

    points.push("営業時間・定休日は行く前に確認してください。");

    if (!facility.phone) {
      points.push("電話番号が未掲載の場合は、公式サイトやInstagramを確認してください。");
    }

    if (!facility.instagram && !facility.officialUrl) {
      points.push("公式情報が少ないため、Googleマップ等で最新情報を確認してください。");
    }

    if (facility.memo) {
      points.push(facility.memo);
    }

    return points.slice(0, 3);
  }

  function createAiDetailHtml(facility) {
    const reasons = getRecommendReasons(facility);
    const bestFor = getBestFor(facility);
    const checks = getCheckPoints(facility);
    const type = getTypeLabel(facility);

    return (
      '<div class="ai-detail-box">' +
        '<div class="ai-detail-head">' +
          '<span class="ai-detail-icon">🤖</span>' +
          '<div>' +
            '<strong>' + escapeHtml(facility.name) + ' はこんな人におすすめ</strong>' +
            '<small>サイト内データから自動で作ったAI風コメントです</small>' +
          '</div>' +
        '</div>' +

        '<p class="ai-detail-summary">' +
          escapeHtml(facility.name) + ' は、' + escapeHtml(type) + 'として候補に入れやすい施設です。' +
        '</p>' +

        '<div class="ai-detail-section">' +
          '<h4>おすすめ理由</h4>' +
          '<ul>' + reasons.map(function (item) {
            return '<li>' + escapeHtml(item) + '</li>';
          }).join("") + '</ul>' +
        '</div>' +

        '<div class="ai-detail-section">' +
          '<h4>向いている人</h4>' +
          '<ul>' + bestFor.map(function (item) {
            return '<li>' + escapeHtml(item) + '</li>';
          }).join("") + '</ul>' +
        '</div>' +

        '<div class="ai-detail-section">' +
          '<h4>行く前の確認ポイント</h4>' +
          '<ul>' + checks.map(function (item) {
            return '<li>' + escapeHtml(item) + '</li>';
          }).join("") + '</ul>' +
        '</div>' +
      '</div>'
    );
  }

  function addAiButtons() {
    const cards = document.querySelectorAll(".card");

    cards.forEach(function (card) {
      if (card.dataset.aiReady === "1") return;

      const facilityId = card.dataset.id;
      const actions = card.querySelector(".card-actions");

      if (!facilityId || !actions) return;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "ai-detail-btn";
      button.dataset.id = facilityId;
      button.textContent = "🤖 AIで詳しく見る";

      actions.appendChild(button);
      card.dataset.aiReady = "1";
    });
  }

  function toggleAiDetail(button) {
    const facility = getFacilityById(button.dataset.id);
    if (!facility) return;

    const card = button.closest(".card");
    if (!card) return;

    const existing = card.querySelector(".ai-detail-box");

    if (existing) {
      existing.remove();
      button.textContent = "🤖 AIで詳しく見る";
      return;
    }

    card.insertAdjacentHTML("beforeend", createAiDetailHtml(facility));
    button.textContent = "閉じる";
  }

  function setupEvents() {
    document.addEventListener("click", function (e) {
      const button = e.target.closest(".ai-detail-btn");
      if (!button) return;

      toggleAiDetail(button);
    });
  }

  function setupObserver() {
    const cardList = document.getElementById("cardList");
    if (!cardList) return;

    const observer = new MutationObserver(function () {
      addAiButtons();
    });

    observer.observe(cardList, {
      childList: true,
      subtree: true
    });

    addAiButtons();
  }

  function addStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .ai-detail-btn {
        flex: 1 1 100%;
        width: 100%;
        padding: 13px 10px;
        border: none;
        border-radius: 16px;
        background: linear-gradient(135deg, #111827 0%, #334155 100%);
        color: #fff;
        font-size: 14px;
        font-weight: 800;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.18);
      }

      .ai-detail-btn:active {
        transform: scale(0.98);
      }

      .ai-detail-box {
        margin-top: 14px;
        padding: 14px;
        border-radius: 18px;
        background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
        border: 1px solid #dbeafe;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
      }

      .ai-detail-head {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        margin-bottom: 10px;
      }

      .ai-detail-icon {
        flex: none;
        width: 34px;
        height: 34px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        background: #111827;
        color: #fff;
        font-size: 18px;
      }

      .ai-detail-head strong {
        display: block;
        font-size: 15px;
        line-height: 1.45;
        color: #111827;
      }

      .ai-detail-head small {
        display: block;
        font-size: 11px;
        color: #64748b;
        margin-top: 2px;
      }

      .ai-detail-summary {
        margin: 0 0 10px;
        font-size: 14px;
        font-weight: 700;
        color: #1e293b;
        line-height: 1.6;
      }

      .ai-detail-section {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid rgba(148, 163, 184, 0.35);
      }

      .ai-detail-section h4 {
        margin: 0 0 6px;
        font-size: 13px;
        color: #0f766e;
      }

      .ai-detail-section ul {
        margin: 0;
        padding-left: 18px;
        font-size: 13px;
        color: #334155;
        line-height: 1.6;
      }

      .ai-detail-section li {
        padding: 2px 0;
      }
    `;

    document.head.appendChild(style);
  }

  function init() {
    addStyle();
    setupEvents();
    setupObserver();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
