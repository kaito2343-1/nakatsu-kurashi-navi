/* ============================================================
   中津くらしナビ：実用化強化パック
   ・ランチランキング
   ・目的別ボタン
   ・実用タグ追加
   ・掲載依頼フォーム導線
   ファイル名：practical-extra.js
   ============================================================ */

(function () {
  const GOOGLE_FORM_URL = ""; 
  // ↑ Googleフォームを作ったら、ここにURLを入れる
  // 例: const GOOGLE_FORM_URL = "https://forms.gle/xxxxxxxx";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function scrollToElement(el) {
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function setKeyword(keyword) {
    const input = document.getElementById("keywordInput");
    if (!input) return;

    input.value = keyword;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus({ preventScroll: true });
    scrollToElement(document.querySelector(".search-section"));
  }

  function clickCategory(label) {
    const buttons = Array.from(document.querySelectorAll(".cat-btn"));
    const target = buttons.find(function (btn) {
      return (btn.textContent || "").includes(label);
    });

    if (target) {
      target.click();
      setTimeout(function () {
        scrollToElement(document.querySelector("main"));
      }, 80);
    } else {
      setKeyword(label);
    }
  }

  function addPracticalStyle() {
    if (document.getElementById("practicalExtraStyle")) return;

    const style = document.createElement("style");
    style.id = "practicalExtraStyle";
    style.textContent = `
      .purpose-section,
      .lunch-ranking-section {
        margin: 16px;
        padding: 16px;
        border-radius: 26px;
        background: rgba(255, 255, 255, 0.96);
        box-shadow: 0 16px 34px rgba(15, 23, 42, 0.12);
      }

      .purpose-head,
      .lunch-ranking-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 10px;
        margin-bottom: 12px;
      }

      .purpose-title,
      .lunch-ranking-title {
        margin: 0;
        font-size: 19px;
        font-weight: 950;
        color: #111827;
        line-height: 1.35;
      }

      .purpose-sub,
      .lunch-ranking-sub {
        margin: 0;
        font-size: 12px;
        font-weight: 800;
        color: #0f766e;
        white-space: nowrap;
      }

      .purpose-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .purpose-btn {
        border: none;
        border-radius: 20px;
        padding: 13px 12px;
        min-height: 74px;
        text-align: left;
        font-family: inherit;
        cursor: pointer;
        color: #111827;
        background: #f8fafc;
        box-shadow: inset 0 0 0 1px rgba(226, 232, 240, 0.95);
      }

      .purpose-btn:active,
      .lunch-rank-btn:active {
        transform: scale(0.97);
      }

      .purpose-icon {
        display: block;
        font-size: 24px;
        line-height: 1;
        margin-bottom: 7px;
      }

      .purpose-main {
        display: block;
        font-size: 14px;
        font-weight: 950;
        line-height: 1.25;
      }

      .purpose-note {
        display: block;
        margin-top: 3px;
        font-size: 11px;
        font-weight: 700;
        color: #64748b;
        line-height: 1.25;
      }

      .purpose-btn.is-now { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); }
      .purpose-btn.is-solo { background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); }
      .purpose-btn.is-parking { background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%); }
      .purpose-btn.is-cheap { background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%); }
      .purpose-btn.is-child { background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); }
      .purpose-btn.is-late { background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); }

      .lunch-ranking-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .lunch-rank-card {
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 10px;
        align-items: center;
        padding: 12px;
        border-radius: 20px;
        background: linear-gradient(135deg, #ffffff 0%, #fff7ed 100%);
        box-shadow: inset 0 0 0 1px rgba(254, 215, 170, 0.9);
      }

      .lunch-rank-num {
        width: 34px;
        height: 34px;
        border-radius: 999px;
        display: grid;
        place-items: center;
        font-size: 13px;
        font-weight: 950;
        color: #fff;
        background: #111827;
      }

      .lunch-rank-name {
        margin: 0;
        font-size: 15px;
        font-weight: 950;
        color: #111827;
        line-height: 1.35;
      }

      .lunch-rank-desc {
        margin: 2px 0 0;
        font-size: 12px;
        font-weight: 700;
        color: #64748b;
        line-height: 1.35;
      }

      .lunch-rank-btn {
        border: none;
        border-radius: 999px;
        padding: 9px 11px;
        font-size: 12px;
        font-weight: 950;
        color: #7c2d12;
        background: #ffedd5;
        font-family: inherit;
        cursor: pointer;
        white-space: nowrap;
      }

      .request-link-area {
        margin-top: 14px;
        padding: 12px;
        border-radius: 16px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
      }

      .request-link-area a {
        display: block;
        text-align: center;
        padding: 12px;
        border-radius: 14px;
        background: linear-gradient(135deg, #0f766e 0%, #064e3b 100%);
        color: #fff;
        text-decoration: none;
        font-weight: 950;
      }

      .request-link-area small {
        display: block;
        margin-top: 8px;
        color: #64748b;
        font-size: 12px;
        line-height: 1.45;
      }

      @media (max-width: 360px) {
        .purpose-grid {
          grid-template-columns: 1fr;
        }

        .lunch-rank-card {
          grid-template-columns: auto 1fr;
        }

        .lunch-rank-btn {
          grid-column: 1 / -1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function addPurposeButtons() {
    if (document.getElementById("purposeSection")) return;

    const searchSection = document.querySelector(".search-section");
    const parent = searchSection ? searchSection.parentNode : document.querySelector(".app");
    if (!parent || !searchSection) return;

    const section = document.createElement("section");
    section.id = "purposeSection";
    section.className = "purpose-section";
    section.innerHTML = `
      <div class="purpose-head">
        <h2 class="purpose-title">目的から探す</h2>
        <p class="purpose-sub">迷ったらここ</p>
      </div>

      <div class="purpose-grid">
        <button type="button" class="purpose-btn is-now" data-keyword="ランチ">
          <span class="purpose-icon">🍱</span>
          <span class="purpose-main">今からご飯</span>
          <span class="purpose-note">ランチ・定食を探す</span>
        </button>

        <button type="button" class="purpose-btn is-solo" data-keyword="一人">
          <span class="purpose-icon">🙋</span>
          <span class="purpose-main">一人で行ける</span>
          <span class="purpose-note">一人飯・一人飲み</span>
        </button>

        <button type="button" class="purpose-btn is-parking" data-keyword="駐車場あり">
          <span class="purpose-icon">🅿️</span>
          <span class="purpose-main">駐車場あり</span>
          <span class="purpose-note">車で行きやすい</span>
        </button>

        <button type="button" class="purpose-btn is-cheap" data-keyword="安い">
          <span class="purpose-icon">💰</span>
          <span class="purpose-main">安く済ませたい</span>
          <span class="purpose-note">安い・コスパ</span>
        </button>

        <button type="button" class="purpose-btn is-child" data-keyword="子連れ">
          <span class="purpose-icon">👪</span>
          <span class="purpose-main">子連れOK</span>
          <span class="purpose-note">家族向き候補</span>
        </button>

        <button type="button" class="purpose-btn is-late" data-keyword="深夜">
          <span class="purpose-icon">🌙</span>
          <span class="purpose-main">夜遅くまで</span>
          <span class="purpose-note">深夜・二軒目</span>
        </button>
      </div>
    `;

    parent.insertBefore(section, searchSection.nextSibling);

    section.querySelectorAll(".purpose-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setKeyword(btn.dataset.keyword || "");
      });
    });
  }

  function addLunchRanking() {
    if (document.getElementById("lunchRankingSection")) return;

    const categoryScroll = document.getElementById("categoryScroll");
    const parent = categoryScroll ? categoryScroll.parentNode : document.querySelector(".app");
    if (!parent || !categoryScroll) return;

    const ranking = [
      {
        rank: 1,
        name: "からあげの鳥しん",
        desc: "中津からあげ候補。まず入れたい定番ランチ枠。",
        keyword: "からあげの鳥しん 中津市"
      },
      {
        rank: 2,
        name: "中津からあげ もり山 万田・本店",
        desc: "中津からあげ候補。テイクアウトにも使いやすい枠。",
        keyword: "中津からあげ もり山 万田 本店 中津市"
      },
      {
        rank: 3,
        name: "とんかつ豊後",
        desc: "しっかり食べたい時のとんかつ・定食候補。",
        keyword: "とんかつ豊後 中津市"
      },
      {
        rank: 4,
        name: "むら上食堂",
        desc: "食堂系ランチ・定食を探したい時の候補。",
        keyword: "むら上食堂 中津市"
      },
      {
        rank: 5,
        name: "和風味処 鬼太郎",
        desc: "和食・海鮮系ランチを探したい時の候補。",
        keyword: "和風味処 鬼太郎 中津市"
      }
    ];

    const section = document.createElement("section");
    section.id = "lunchRankingSection";
    section.className = "lunch-ranking-section";
    section.innerHTML = `
      <div class="lunch-ranking-head">
        <h2 class="lunch-ranking-title">🍱 中津ランチおすすめ候補</h2>
        <p class="lunch-ranking-sub">まず見る5つ</p>
      </div>
      <div class="lunch-ranking-list">
        ${ranking.map(function (item) {
          return `
            <div class="lunch-rank-card">
              <div class="lunch-rank-num">${item.rank}</div>
              <div>
                <p class="lunch-rank-name">${item.name}</p>
                <p class="lunch-rank-desc">${item.desc}</p>
              </div>
              <button type="button" class="lunch-rank-btn" data-keyword="${item.keyword}">見る</button>
            </div>
          `;
        }).join("")}
      </div>
    `;

    parent.insertBefore(section, categoryScroll.nextSibling);

    section.querySelectorAll(".lunch-rank-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setKeyword(btn.dataset.keyword || "");
      });
    });
  }

  function enhanceTags() {
    if (typeof facilities === "undefined") return;

    const tagRules = [
      {
        includes: ["からあげ", "鳥しん", "もり山", "チキンハウス", "からいち", "彩鶏々", "ぶんごや"],
        add: ["テイクアウト", "中津からあげ", "安い", "ランチ"]
      },
      {
        includes: ["ラーメン", "宝来軒", "辛麺", "らーめん", "麺屋", "とん平"],
        add: ["一人OK", "安い", "ランチ", "夜ご飯"]
      },
      {
        includes: ["居酒屋", "や台ずし", "楽笑", "扇八", "マルイチ", "達磨", "うろこ", "ほろほろ"],
        add: ["一人OK", "夜ご飯", "飲み会"]
      },
      {
        includes: ["ホテル", "東横", "ルートイン", "スーパーホテル", "グランプラザ"],
        add: ["駐車場あり", "出張", "宿泊"]
      },
      {
        includes: ["駐車場", "パーキング"],
        add: ["駐車場あり", "車"]
      },
      {
        includes: ["カフェ", "珈琲", "コーヒー", "スターバックス", "コメダ"],
        add: ["一人OK", "休憩", "ランチ"]
      },
      {
        includes: ["美容室", "床屋", "理容室", "カット"],
        add: ["駐車場あり", "予約確認", "身だしなみ"]
      },
      {
        includes: ["スーパー", "コンビニ", "ゆめタウン", "イオン", "ダイレックス", "トライアル"],
        add: ["駐車場あり", "買い物", "日用品"]
      }
    ];

    facilities.forEach(function (facility) {
      const text = [
        facility.name || "",
        facility.category || "",
        facility.description || "",
        Array.isArray(facility.tags) ? facility.tags.join(" ") : ""
      ].join(" ");

      if (!Array.isArray(facility.tags)) {
        facility.tags = [];
      }

      tagRules.forEach(function (rule) {
        const hit = rule.includes.some(function (word) {
          return text.includes(word);
        });

        if (hit) {
          rule.add.forEach(function (tag) {
            if (!facility.tags.includes(tag)) {
              facility.tags.push(tag);
            }
          });
        }
      });
    });
  }

  function improveRequestModal() {
    const requestBtn = document.getElementById("postRequestBtn");
    const modal = document.getElementById("requestModal");
    if (!requestBtn || !modal) return;

    const box = modal.querySelector(".modal-box");
    if (!box || document.getElementById("requestLinkArea")) return;

    const area = document.createElement("div");
    area.id = "requestLinkArea";
    area.className = "request-link-area";

    if (GOOGLE_FORM_URL) {
      area.innerHTML = `
        <a href="${GOOGLE_FORM_URL}" target="_blank" rel="noopener">Googleフォームで送る</a>
        <small>掲載依頼・修正依頼はフォームから送れます。</small>
      `;
    } else {
      area.innerHTML = `
        <a href="https://docs.google.com/forms/" target="_blank" rel="noopener">Googleフォームを作る</a>
        <small>
          フォームを作ったら、practical-extra.js の GOOGLE_FORM_URL にURLを貼ってください。<br>
          項目は「店名・住所・営業時間・定休日・電話番号・公式URL・修正内容」でOKです。
        </small>
      `;
    }

    const closeBtn = document.getElementById("modalCloseBtn");
    if (closeBtn) {
      box.insertBefore(area, closeBtn);
    } else {
      box.appendChild(area);
    }
  }

  ready(function () {
    addPracticalStyle();
    enhanceTags();
    addPurposeButtons();
    addLunchRanking();
    improveRequestModal();
  });
})();
