/* ============================================================
   中津くらしナビ：口コミ点数参考順ランキング
   ファイル名：real-ranking-extra.js
   ============================================================ */

(function () {
  const RATING_SOURCE = "食べログ公開一覧を手動確認";
  const LAST_CHECKED = "2026-07";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function setKeyword(keyword) {
    const input = document.getElementById("keywordInput");
    if (!input) return;

    input.value = keyword;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus({ preventScroll: true });

    const main = document.querySelector("main");
    if (main) {
      main.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function facilityExists(keyword) {
    if (typeof facilities === "undefined" || !Array.isArray(facilities)) return true;

    return facilities.some(function (facility) {
      const text = [
        facility.name || "",
        facility.category || "",
        facility.description || "",
        Array.isArray(facility.tags) ? facility.tags.join(" ") : ""
      ].join(" ");

      return text.includes(keyword);
    });
  }

  function removeOldRankings() {
    [
      "izakayaRanking",
      "lunchRankingSection",
      "realRankingSection"
    ].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
  }

  function sortByRating(items) {
    return items
      .slice()
      .sort(function (a, b) {
        const ratingA = typeof a.rating === "number" ? a.rating : -1;
        const ratingB = typeof b.rating === "number" ? b.rating : -1;

        if (ratingB !== ratingA) {
          return ratingB - ratingA;
        }

        return (b.reviewCount || 0) - (a.reviewCount || 0);
      });
  }

  function addStyle() {
    if (document.getElementById("realRankingStyle")) return;

    const style = document.createElement("style");
    style.id = "realRankingStyle";
    style.textContent = `
      .real-ranking-section {
        margin: 16px;
        padding: 16px;
        border-radius: 26px;
        background:
          radial-gradient(circle at 0% 0%, rgba(245, 158, 11, 0.18), transparent 30%),
          linear-gradient(135deg, #ffffff 0%, #fff7ed 100%);
        box-shadow: 0 18px 36px rgba(15, 23, 42, 0.14);
      }

      .real-ranking-head {
        margin-bottom: 14px;
      }

      .real-ranking-title {
        margin: 0;
        font-size: 21px;
        font-weight: 950;
        color: #111827;
        line-height: 1.35;
      }

      .real-ranking-desc {
        margin: 5px 0 0;
        font-size: 13px;
        font-weight: 700;
        color: #64748b;
        line-height: 1.45;
      }

      .real-ranking-block {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid rgba(251, 146, 60, 0.25);
      }

      .real-ranking-block:first-of-type {
        margin-top: 0;
        padding-top: 0;
        border-top: none;
      }

      .real-ranking-block-title {
        margin: 0 0 10px;
        font-size: 17px;
        font-weight: 950;
        color: #111827;
      }

      .real-ranking-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .real-rank-card {
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 10px;
        align-items: center;
        padding: 12px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.94);
        box-shadow: inset 0 0 0 1px rgba(254, 215, 170, 0.9);
      }

      .real-rank-num {
        width: 34px;
        height: 34px;
        border-radius: 999px;
        display: grid;
        place-items: center;
        color: #fff;
        background: #111827;
        font-size: 13px;
        font-weight: 950;
      }

      .real-rank-name {
        margin: 0;
        font-size: 15px;
        font-weight: 950;
        color: #111827;
        line-height: 1.35;
      }

      .real-rank-note {
        margin: 2px 0 0;
        font-size: 12px;
        font-weight: 700;
        color: #64748b;
        line-height: 1.35;
      }

      .real-rank-rating {
        display: inline-flex;
        margin-top: 5px;
        padding: 4px 8px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 900;
        color: #92400e;
        background: #ffedd5;
      }

      .real-rank-btn {
        border: none;
        border-radius: 999px;
        padding: 9px 11px;
        color: #7c2d12;
        background: #ffedd5;
        font-size: 12px;
        font-weight: 950;
        font-family: inherit;
        cursor: pointer;
        white-space: nowrap;
      }

      .real-rank-btn:active {
        transform: scale(0.96);
      }

      @media (max-width: 360px) {
        .real-rank-card {
          grid-template-columns: auto 1fr;
        }

        .real-rank-btn {
          grid-column: 1 / -1;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createRankingBlock(title, items) {
    const filtered = sortByRating(items).filter(function (item) {
      return facilityExists(item.keyword);
    });

    if (filtered.length === 0) return "";

    return `
      <div class="real-ranking-block">
        <h3 class="real-ranking-block-title">${title}</h3>
        <div class="real-ranking-list">
          ${filtered.map(function (item, index) {
            const ratingText = typeof item.rating === "number"
              ? `★${item.rating.toFixed(2)} / 口コミ${item.reviewCount || 0}件`
              : "評価確認中";

            return `
              <div class="real-rank-card">
                <div class="real-rank-num">${index + 1}</div>
                <div>
                  <p class="real-rank-name">${item.name}</p>
                  <p class="real-rank-note">${item.note}</p>
                  <span class="real-rank-rating">${ratingText}</span>
                </div>
                <button type="button" class="real-rank-btn" data-keyword="${item.keyword}">見る</button>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  function createRealRankings() {
    if (document.getElementById("realRankingSection")) return;

    const main = document.querySelector("main");
    const parent = main ? main.parentNode : document.querySelector(".app");
    if (!parent) return;

    const rankings = {
      lunch: [
        {
          name: "中津からあげテイクアウト専門店 中津 彩鶏々",
          keyword: "彩鶏々",
          note: "中津からあげ・テイクアウト候補。",
          rating: 3.71,
          reviewCount: 144
        },
        {
          name: "生本まぐろ 炊き餃子 井上",
          keyword: "井上",
          note: "海鮮・ランチ候補。",
          rating: 3.64,
          reviewCount: 84
        },
        {
          name: "とんかつ豊後",
          keyword: "とんかつ豊後",
          note: "しっかり食べたい時の定食候補。",
          rating: 3.57,
          reviewCount: 100
        },
        {
          name: "むら上食堂",
          keyword: "むら上食堂",
          note: "食堂・からあげ候補。",
          rating: 3.55,
          reviewCount: 197
        },
        {
          name: "からあげの鳥しん",
          keyword: "鳥しん",
          note: "中津からあげ候補。",
          rating: 3.54,
          reviewCount: 119
        },
        {
          name: "和風味処 鬼太郎",
          keyword: "鬼太郎",
          note: "和食・海鮮系ランチ候補。",
          rating: 3.47,
          reviewCount: 223
        },
        {
          name: "豊国畜産 ぶんごや",
          keyword: "ぶんごや",
          note: "からあげ・惣菜候補。",
          rating: 3.46,
          reviewCount: 242
        }
      ],

      ramen: [
        {
          name: "宝来軒 本店",
          keyword: "宝来軒 本店",
          note: "中津ラーメン候補。",
          rating: 3.52,
          reviewCount: 189
        },
        {
          name: "しゅうちゃんラーメン",
          keyword: "しゅうちゃん",
          note: "豚骨ラーメン候補。",
          rating: 3.43,
          reviewCount: 110
        },
        {
          name: "宝来軒 バイパス店",
          keyword: "宝来軒 バイパス",
          note: "宝来軒系列のラーメン候補。",
          rating: 3.33,
          reviewCount: 97
        },
        {
          name: "魚介豚骨らーめん 刻",
          keyword: "刻",
          note: "魚介豚骨系ラーメン候補。",
          rating: 3.32,
          reviewCount: 45
        },
        {
          name: "柳華園",
          keyword: "柳華園",
          note: "町中華・ラーメン候補。",
          rating: 3.18,
          reviewCount: 13
        },
        {
          name: "福寿宴中国料理店",
          keyword: "福寿宴",
          note: "中華料理・ラーメン候補。",
          rating: 3.10,
          reviewCount: 13
        },
        {
          name: "らーめん百八",
          keyword: "百八",
          note: "豚骨ラーメン候補。",
          rating: 3.09,
          reviewCount: 17
        },
        {
          name: "東京らーめん食堂",
          keyword: "東京らーめん",
          note: "醤油ラーメン・食堂候補。",
          rating: 3.08,
          reviewCount: 30
        }
      ],

      izakaya: [
        {
          name: "一合",
          keyword: "一合",
          note: "海鮮・天ぷら系の居酒屋候補。",
          rating: 3.14,
          reviewCount: 13
        },
        {
          name: "たにあらし",
          keyword: "たにあらし",
          note: "ちゃんこ鍋・居酒屋候補。",
          rating: 3.12,
          reviewCount: 24
        },
        {
          name: "居酒屋ダイニング 楽笑",
          keyword: "楽笑",
          note: "居酒屋・ダイニングバー候補。",
          rating: 3.09,
          reviewCount: 34
        },
        {
          name: "家庭料理 呑んた",
          keyword: "呑んた",
          note: "家庭料理系の居酒屋候補。",
          rating: 3.07,
          reviewCount: 9
        },
        {
          name: "扇八",
          keyword: "扇八",
          note: "駅周辺の居酒屋候補。",
          rating: 3.06,
          reviewCount: 13
        },
        {
          name: "ブルちゃん",
          keyword: "ブルちゃん",
          note: "串焼き・居酒屋候補。",
          rating: 3.06,
          reviewCount: 7
        },
        {
          name: "千一",
          keyword: "千一",
          note: "焼き鳥・からあげ系居酒屋候補。",
          rating: 3.04,
          reviewCount: 6
        },
        {
          name: "ひばり",
          keyword: "ひばり",
          note: "居酒屋候補。",
          rating: 3.03,
          reviewCount: 4
        },
        {
          name: "や台ずし 中津駅南口町",
          keyword: "や台ずし",
          note: "寿司居酒屋候補。",
          rating: 3.01,
          reviewCount: 12
        }
      ],

      cafe: [
        {
          name: "甘味処 禅海茶屋",
          keyword: "禅海茶屋",
          note: "甘味・カフェ・そば候補。",
          rating: 3.09,
          reviewCount: 23
        },
        {
          name: "古民家カフェ花水木",
          keyword: "花水木",
          note: "古民家カフェ候補。",
          rating: 3.06,
          reviewCount: 4
        },
        {
          name: "道カフェ 余菓の日",
          keyword: "余菓の日",
          note: "お菓子・休憩候補。",
          rating: 3.04,
          reviewCount: 9
        },
        {
          name: "コメダ珈琲店 大分中津店",
          keyword: "コメダ",
          note: "モーニング・休憩候補。",
          rating: 3.03,
          reviewCount: 19
        },
        {
          name: "スターバックスコーヒー 中津店",
          keyword: "スターバックス",
          note: "作業・待ち合わせ候補。",
          rating: 3.03,
          reviewCount: 15
        },
        {
          name: "オーガニックカフェ シエル",
          keyword: "シエル",
          note: "オーガニック系カフェ候補。",
          rating: 3.01,
          reviewCount: 3
        }
      ]
    };

    const section = document.createElement("section");
    section.id = "realRankingSection";
    section.className = "real-ranking-section";

    section.innerHTML = `
      <div class="real-ranking-head">
        <h2 class="real-ranking-title">口コミ点数参考ランキング</h2>
        <p class="real-ranking-desc">
          食べログ公開一覧の点数・口コミ数を手動確認して並べた参考ランキングです。
          点数は変わるため、行く前に公式情報や最新情報も確認してください。
          確認元：${RATING_SOURCE} / 確認：${LAST_CHECKED}
        </p>
      </div>

      ${createRankingBlock("🍱 ランチ 口コミ点数参考順", rankings.lunch)}
      ${createRankingBlock("🍜 ラーメン 口コミ点数参考順", rankings.ramen)}
      ${createRankingBlock("🍻 居酒屋 口コミ点数参考順", rankings.izakaya)}
      ${createRankingBlock("☕ カフェ 口コミ点数参考順", rankings.cafe)}
    `;

    if (main) {
      parent.insertBefore(section, main);
    } else {
      parent.appendChild(section);
    }

    section.querySelectorAll(".real-rank-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setKeyword(btn.dataset.keyword || "");
      });
    });
  }

  ready(function () {
    removeOldRankings();
    addStyle();
    createRealRankings();
  });
})();
