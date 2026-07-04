/* ============================================================
   中津くらしナビ：居酒屋・夜ご飯 追加版
   ファイル名：izakaya2-extra.js
   ============================================================ */

(function () {
  const categoryKey = "居酒屋・夜ご飯";

  if (typeof CATEGORIES !== "undefined") {
    const exists = CATEGORIES.some(function (c) { return c.key === categoryKey; });
    if (!exists) {
      CATEGORIES.push({ key: categoryKey, icon: "🍻" });
    }
  }

  if (typeof CATEGORY_ICON_MAP !== "undefined") {
    CATEGORY_ICON_MAP[categoryKey] = "🍻";
  }

  if (typeof CATEGORY_COLOR_INDEX !== "undefined" && typeof CATEGORIES !== "undefined") {
    CATEGORY_COLOR_INDEX[categoryKey] = CATEGORIES.findIndex(function (c) {
      return c.key === categoryKey;
    });
  }

  const izakayaData = [
    {
      id: 501,
      name: "や台ずし 中津駅南口町",
      description: "中津駅周辺で寿司・居酒屋系を探したい時の候補。夜ご飯や飲み会向け。"
    },
    {
      id: 502,
      name: "たにあらし",
      description: "中津市周辺で居酒屋・夜ご飯を探したい時の候補。"
    },
    {
      id: 503,
      name: "家庭料理 呑んた",
      description: "家庭料理系の居酒屋候補。落ち着いて夜ご飯を食べたい時に。"
    },
    {
      id: 504,
      name: "千一",
      description: "中津市周辺で飲み会・夜ご飯に使える居酒屋候補。"
    },
    {
      id: 505,
      name: "居酒屋ダイニング 楽笑",
      description: "ダイニング系の居酒屋候補。飲み会・宴会・夜ご飯向け。"
    },
    {
      id: 506,
      name: "野菜巻き串と肴 みつばち",
      description: "野菜巻き串や肴系を探したい時の居酒屋候補。"
    },
    {
      id: 507,
      name: "居酒屋ほろほろ",
      description: "中津市周辺で居酒屋・夜ご飯を探したい時の候補。"
    },
    {
      id: 508,
      name: "ブルちゃん",
      description: "中津市周辺で夜ご飯・飲み会に使える候補。"
    },
    {
      id: 509,
      name: "ひばり",
      description: "中津市周辺で居酒屋・夜ご飯を探したい時の候補。"
    },
    {
      id: 510,
      name: "あきない 本店",
      description: "中津市周辺で飲み会・夜ご飯に使える居酒屋候補。"
    },
    {
      id: 511,
      name: "一合",
      description: "中津市周辺で落ち着いて飲みたい時の居酒屋候補。"
    },
    {
      id: 512,
      name: "扇八",
      description: "中津駅周辺で一人飲み・少人数飲みに使いやすい居酒屋候補。"
    },
    {
      id: 513,
      name: "灯り家",
      description: "中津市周辺で居酒屋・夜ご飯を探したい時の候補。"
    },
    {
      id: 514,
      name: "油",
      description: "中津市周辺で夜ご飯・飲み会に使える候補。"
    },
    {
      id: 515,
      name: "七輪鳥焼専門店 もり山",
      description: "鳥焼き・七輪焼き系を探したい時の夜ご飯候補。"
    },
    {
      id: 516,
      name: "海鮮厨房 うろこ",
      description: "海鮮系の居酒屋・夜ご飯を探したい時の候補。"
    },
    {
      id: 517,
      name: "たっとり屋",
      description: "中津市周辺で居酒屋・夜ご飯を探したい時の候補。"
    },
    {
      id: 518,
      name: "アリス",
      description: "中津市周辺で夜ご飯・飲み会に使える候補。"
    },
    {
      id: 519,
      name: "笑顔のたね",
      description: "中津市周辺で居酒屋・夜ご飯を探したい時の候補。"
    },
    {
      id: 520,
      name: "だいだい",
      description: "中津市周辺で飲み会・夜ご飯に使える居酒屋候補。"
    }
  ];

  if (typeof facilities !== "undefined") {
    izakayaData.forEach(function (item) {
      const facility = {
        id: item.id,
        name: item.name,
        category: categoryKey,
        description: item.description,
        address: "大分県中津市周辺",
        phone: "",
        hours: "",
        closed: "",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(item.name + " 中津市"),
        officialUrl: "",
        sourceMemo: "2026年7月時点の追加候補。営業時間・住所・定休日はGoogleマップ等で要確認",
        tags: ["居酒屋", "夜ご飯", "中津市", "飲み会", "一人飲み", "宴会"],
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
