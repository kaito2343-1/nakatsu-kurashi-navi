/* ============================================================
   中津くらしナビ：焼肉・寿司 追加版
   ファイル名：yakiniku-sushi-extra.js
   ============================================================ */

(function () {
  const categoryKey = "焼肉・寿司";

  if (typeof CATEGORIES !== "undefined") {
    const exists = CATEGORIES.some(function (c) { return c.key === categoryKey; });
    if (!exists) {
      CATEGORIES.push({ key: categoryKey, icon: "🥩" });
    }
  }

  if (typeof CATEGORY_ICON_MAP !== "undefined") {
    CATEGORY_ICON_MAP[categoryKey] = "🥩";
  }

  if (typeof CATEGORY_COLOR_INDEX !== "undefined" && typeof CATEGORIES !== "undefined") {
    CATEGORY_COLOR_INDEX[categoryKey] = CATEGORIES.findIndex(function (c) {
      return c.key === categoryKey;
    });
  }

  // 焼肉・寿司カテゴリ用の色を追加
  if (!document.getElementById("yakinikuSushiExtraStyle")) {
    const style = document.createElement("style");
    style.id = "yakinikuSushiExtraStyle";
    style.textContent = `
      .cat-15 { --cat-color: #991b1b; --cat-color-soft: #fee2e2; } /* 焼肉・寿司 */
    `;
    document.head.appendChild(style);
  }

  const shopData = [
    {
      id: 801,
      name: "焼肉テッチャン亭",
      keyword: "焼肉テッチャン亭 中津市",
      description: "中津市で焼肉を食べたい時の候補。夜ご飯・飲み会向け。",
      tags: ["焼肉", "肉", "夜ご飯", "飲み会"]
    },
    {
      id: 802,
      name: "游楽亭",
      keyword: "游楽亭 中津市 焼肉",
      description: "中津市周辺で焼肉・肉料理を探したい時の候補。",
      tags: ["焼肉", "肉料理", "夜ご飯", "中津市"]
    },
    {
      id: 803,
      name: "焼肉 しゃぶしゃぶの楽",
      keyword: "焼肉 しゃぶしゃぶの楽 中津市",
      description: "焼肉・しゃぶしゃぶ系を探したい時の候補。",
      tags: ["焼肉", "しゃぶしゃぶ", "肉", "夜ご飯"]
    },
    {
      id: 804,
      name: "炭火焼肉永田屋",
      keyword: "炭火焼肉永田屋 中津市",
      description: "炭火焼肉を食べたい時の候補。夜ご飯や家族利用にも。",
      tags: ["焼肉", "炭火焼肉", "肉", "夜ご飯"]
    },
    {
      id: 805,
      name: "焼肉 かもん",
      keyword: "焼肉 かもん 中津市",
      description: "中津市周辺で焼肉を探したい時の候補。",
      tags: ["焼肉", "肉", "夜ご飯", "中津市"]
    },
    {
      id: 806,
      name: "モモヤ",
      keyword: "モモヤ 中津市 焼肉",
      description: "中津市周辺で焼肉・肉系ご飯を探したい時の候補。",
      tags: ["焼肉", "肉", "ご飯", "夜ご飯"]
    },
    {
      id: 807,
      name: "銀乃しゃり 中津店",
      keyword: "銀乃しゃり 中津店",
      description: "寿司・海鮮系を食べたい時の候補。ランチや夜ご飯にも。",
      tags: ["寿司", "海鮮", "ランチ", "夜ご飯"]
    },
    {
      id: 808,
      name: "伊藤課長 中津店",
      keyword: "伊藤課長 中津店",
      description: "焼肉・ホルモン系を探したい時の候補。",
      tags: ["焼肉", "ホルモン", "肉", "夜ご飯"]
    },
    {
      id: 809,
      name: "や台ずし 中津駅南口町（寿司）",
      keyword: "や台ずし 中津駅南口町",
      description: "中津駅周辺で寿司居酒屋を探したい時の候補。飲み会・夜ご飯向け。",
      tags: ["寿司", "居酒屋", "中津駅", "夜ご飯"]
    },
    {
      id: 810,
      name: "永しん 中津店",
      keyword: "永しん 中津店 寿司",
      description: "寿司・和食系を探したい時の候補。",
      tags: ["寿司", "和食", "海鮮", "夜ご飯"]
    },
    {
      id: 811,
      name: "新八寿司",
      keyword: "新八寿司 中津市",
      description: "中津市周辺で寿司を食べたい時の候補。",
      tags: ["寿司", "海鮮", "和食", "夜ご飯"]
    },
    {
      id: 812,
      name: "中津市 焼肉 個室",
      keyword: "中津市 焼肉 個室",
      description: "中津市で個室ありの焼肉を探したい時の検索カード。",
      tags: ["焼肉", "個室", "検索", "夜ご飯"]
    },
    {
      id: 813,
      name: "中津市 焼肉 食べ放題",
      keyword: "中津市 焼肉 食べ放題",
      description: "中津市で焼肉食べ放題を探したい時の検索カード。",
      tags: ["焼肉", "食べ放題", "検索", "肉"]
    },
    {
      id: 814,
      name: "中津市 寿司 ランチ",
      keyword: "中津市 寿司 ランチ",
      description: "中津市で寿司ランチを探したい時の検索カード。",
      tags: ["寿司", "ランチ", "海鮮", "検索"]
    },
    {
      id: 815,
      name: "中津市 回転寿司",
      keyword: "中津市 回転寿司",
      description: "中津市で回転寿司を探したい時の検索カード。",
      tags: ["回転寿司", "寿司", "ランチ", "検索"]
    }
  ];

  if (typeof facilities !== "undefined") {
    shopData.forEach(function (item) {
      const facility = {
        id: item.id,
        name: item.name,
        category: categoryKey,
        description: item.description,
        address: "大分県中津市周辺",
        phone: "",
        hours: "",
        closed: "",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(item.keyword),
        officialUrl: "",
        sourceMemo: "2026年7月時点の追加候補。営業時間・住所・定休日はGoogleマップ等で要確認",
        tags: item.tags || ["焼肉", "寿司", "中津市", "夜ご飯"],
        memo: "営業時間・定休日・料金・閉店情報は変わる場合があります。行く前にGoogleマップや公式情報で確認してください。",
        verified: false
      };

      const existing = facilities.find(function (f) {
        return f.name === item.name;
      });

      if (!existing) {
        facilities.push(facility);
      }
    });
  }
})();
