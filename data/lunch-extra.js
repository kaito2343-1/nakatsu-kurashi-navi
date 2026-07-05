/* ============================================================
   中津くらしナビ：定食・ランチ・からあげ 追加版
   ファイル名：lunch-extra.js
   ============================================================ */

(function () {
  const categoryKey = "定食・ランチ";

  if (typeof CATEGORIES !== "undefined") {
    const exists = CATEGORIES.some(function (c) { return c.key === categoryKey; });
    if (!exists) {
      CATEGORIES.push({ key: categoryKey, icon: "🍱" });
    }
  }

  if (typeof CATEGORY_ICON_MAP !== "undefined") {
    CATEGORY_ICON_MAP[categoryKey] = "🍱";
  }

  if (typeof CATEGORY_COLOR_INDEX !== "undefined" && typeof CATEGORIES !== "undefined") {
    CATEGORY_COLOR_INDEX[categoryKey] = CATEGORIES.findIndex(function (c) {
      return c.key === categoryKey;
    });
  }

  // 定食・ランチカテゴリ用の色を追加
  if (!document.getElementById("lunchExtraStyle")) {
    const style = document.createElement("style");
    style.id = "lunchExtraStyle";
    style.textContent = `
      .cat-14 { --cat-color: #ca8a04; --cat-color-soft: #fef9c3; } /* 定食・ランチ */
    `;
    document.head.appendChild(style);
  }

  const lunchData = [
    {
      id: 701,
      name: "中津からあげテイクアウト専門店 中津 彩鶏々",
      keyword: "中津からあげテイクアウト専門店 中津 彩鶏々 中津市",
      description: "中津からあげのテイクアウトを探したい時の候補。昼ご飯・夕飯のおかずにも使いやすい候補。",
      tags: ["からあげ", "テイクアウト", "ランチ", "弁当"]
    },
    {
      id: 702,
      name: "生本まぐろ 炊き餃子 井上",
      keyword: "生本まぐろ 炊き餃子 井上 中津市",
      description: "まぐろ・餃子系のランチや夜ご飯を探したい時の候補。",
      tags: ["まぐろ", "餃子", "ランチ", "夜ご飯"]
    },
    {
      id: 703,
      name: "とんかつ豊後",
      keyword: "とんかつ豊後 中津市",
      description: "とんかつ系の定食・ランチを食べたい時の候補。",
      tags: ["とんかつ", "定食", "ランチ", "ご飯"]
    },
    {
      id: 704,
      name: "むら上食堂",
      keyword: "むら上食堂 中津市",
      description: "食堂系のランチ・定食を探したい時の候補。",
      tags: ["食堂", "定食", "ランチ", "安いご飯"]
    },
    {
      id: 705,
      name: "からあげの鳥しん",
      keyword: "からあげの鳥しん 中津市",
      description: "中津からあげを食べたい時の候補。テイクアウトや昼ご飯にも。",
      tags: ["からあげ", "中津からあげ", "ランチ", "テイクアウト"]
    },
    {
      id: 706,
      name: "和風味処 鬼太郎",
      keyword: "和風味処 鬼太郎 中津市",
      description: "和食・定食・ランチを探したい時の候補。",
      tags: ["和食", "定食", "ランチ", "海鮮"]
    },
    {
      id: 707,
      name: "豊国畜産 ぶんごや",
      keyword: "豊国畜産 ぶんごや 中津市",
      description: "からあげ・肉系のおかずやランチを探したい時の候補。",
      tags: ["からあげ", "肉", "ランチ", "テイクアウト"]
    },
    {
      id: 708,
      name: "中津からあげ もり山 万田・本店",
      keyword: "中津からあげ もり山 万田 本店 中津市",
      description: "中津からあげの有名店候補。テイクアウトや昼ご飯のおかずに。",
      tags: ["からあげ", "中津からあげ", "テイクアウト", "有名店"]
    },
    {
      id: 709,
      name: "チキンハウス 中津本店",
      keyword: "チキンハウス 中津本店 中津市",
      description: "からあげ・チキン系を食べたい時の候補。テイクアウトにも。",
      tags: ["からあげ", "チキン", "ランチ", "テイクアウト"]
    },
    {
      id: 710,
      name: "からあげ屋 からいち 中津総本店",
      keyword: "からあげ屋 からいち 中津総本店 中津市",
      description: "中津からあげ・テイクアウトを探したい時の候補。",
      tags: ["からあげ", "中津からあげ", "テイクアウト", "ランチ"]
    },
    {
      id: 711,
      name: "ふくとん",
      keyword: "ふくとん 中津市",
      description: "定食・ランチ・肉系ご飯を探したい時の候補。",
      tags: ["定食", "ランチ", "肉", "ご飯"]
    },
    {
      id: 712,
      name: "中津市 ランチ 定食",
      keyword: "中津市 ランチ 定食",
      description: "中津市でランチ・定食をまとめて探したい時の検索カード。",
      tags: ["ランチ", "定食", "検索", "昼ご飯"]
    },
    {
      id: 713,
      name: "中津市 食堂",
      keyword: "中津市 食堂",
      description: "中津市で昔ながらの食堂・定食屋を探したい時の検索カード。",
      tags: ["食堂", "定食", "ランチ", "安いご飯"]
    },
    {
      id: 714,
      name: "中津市 からあげ ランチ",
      keyword: "中津市 からあげ ランチ",
      description: "中津名物のからあげをランチで食べたい時の検索カード。",
      tags: ["からあげ", "ランチ", "中津名物", "テイクアウト"]
    },
    {
      id: 715,
      name: "中津市 とんかつ",
      keyword: "中津市 とんかつ",
      description: "中津市でとんかつ・揚げ物系ランチを探したい時の検索カード。",
      tags: ["とんかつ", "定食", "ランチ", "揚げ物"]
    },
    {
      id: 716,
      name: "中津市 海鮮ランチ",
      keyword: "中津市 海鮮ランチ",
      description: "中津市で海鮮系のランチを探したい時の検索カード。",
      tags: ["海鮮", "ランチ", "和食", "昼ご飯"]
    },
    {
      id: 717,
      name: "中津市 うどん",
      keyword: "中津市 うどん",
      description: "中津市でうどん・麺類の昼ご飯を探したい時の検索カード。",
      tags: ["うどん", "麺類", "ランチ", "安いご飯"]
    },
    {
      id: 718,
      name: "中津市 カレー",
      keyword: "中津市 カレー",
      description: "中津市でカレーランチを探したい時の検索カード。",
      tags: ["カレー", "ランチ", "昼ご飯", "検索"]
    },
    {
      id: 719,
      name: "中津市 弁当",
      keyword: "中津市 弁当",
      description: "中津市で弁当・テイクアウトご飯を探したい時の検索カード。",
      tags: ["弁当", "テイクアウト", "ランチ", "昼ご飯"]
    },
    {
      id: 720,
      name: "中津市 安いランチ",
      keyword: "中津市 安いランチ",
      description: "中津市で安く食べられるランチを探したい時の検索カード。",
      tags: ["安いランチ", "ランチ", "定食", "コスパ"]
    }
  ];

  if (typeof facilities !== "undefined") {
    lunchData.forEach(function (item) {
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
        tags: item.tags || ["ランチ", "定食", "中津市", "昼ご飯"],
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
