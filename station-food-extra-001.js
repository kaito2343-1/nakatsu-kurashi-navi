/* ============================================================
   中津くらしナビ：中津駅周辺 ご飯屋・居酒屋 追加データ001
   ・住所/営業時間/電話番号は未確認なら空欄
   ・まずは店舗名とGoogleマップ検索で使える形にする
   ============================================================ */

(function () {
  const CATEGORY_DEFS = [
    { key: "居酒屋・夜ご飯", icon: "🍻" },
    { key: "安いご飯", icon: "🍚" }
  ];

  function ensureCategory(key, icon) {
    if (typeof CATEGORIES !== "undefined" && Array.isArray(CATEGORIES)) {
      const exists = CATEGORIES.some(function (c) {
        return c.key === key;
      });

      if (!exists) {
        CATEGORIES.push({ key: key, icon: icon });
      }
    }

    if (typeof CATEGORY_ICON_MAP !== "undefined") {
      CATEGORY_ICON_MAP[key] = icon;
    }

    if (
      typeof CATEGORY_COLOR_INDEX !== "undefined" &&
      typeof CATEGORIES !== "undefined" &&
      Array.isArray(CATEGORIES)
    ) {
      CATEGORY_COLOR_INDEX[key] = CATEGORIES.findIndex(function (c) {
        return c.key === key;
      });
    }
  }

  CATEGORY_DEFS.forEach(function (cat) {
    ensureCategory(cat.key, cat.icon);
  });

  function mapSearch(keyword) {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(keyword);
  }

  const追加店舗 = [
    /* ===== 居酒屋・夜ご飯 ===== */
    {
      name: "や台ずし 中津駅南口町",
      category: "居酒屋・夜ご飯",
      description: "中津駅南口側の寿司居酒屋候補。仕事帰り・飲み会・二軒目にも使いやすい駅近候補。",
      address: "大分県中津市 中津駅南口周辺（詳細要確認）",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: mapSearch("や台ずし 中津駅南口町"),
      officialUrl: "",
      sourceMemo: "2026年7月 追加候補。住所・営業時間・電話番号は公式情報またはGoogleマップで要確認",
      tags: ["居酒屋", "寿司", "中津駅", "夜ご飯", "飲み会", "駅近"],
      memo: "チェーン系なので、最新の営業時間・予約可否は公式情報で確認してください。",
      verified: false
    },
    {
      name: "居酒屋 たにあらし",
      category: "居酒屋・夜ご飯",
      description: "中津駅周辺で夜ご飯・飲み会候補になる居酒屋。",
      address: "大分県中津市 中津駅周辺（詳細要確認）",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: mapSearch("居酒屋 たにあらし 中津市"),
      officialUrl: "",
      sourceMemo: "2026年7月 追加候補。詳細は要確認",
      tags: ["居酒屋", "中津駅", "夜ご飯", "飲み会"],
      memo: "営業時間・定休日・空席は来店前に確認してください。",
      verified: false
    },
    {
      name: "呑んた",
      category: "居酒屋・夜ご飯",
      description: "中津駅周辺の居酒屋候補。一人飲み・少人数の夜ご飯探しにも。",
      address: "大分県中津市 中津駅周辺（詳細要確認）",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: mapSearch("呑んた 中津市 居酒屋"),
      officialUrl: "",
      sourceMemo: "2026年7月 追加候補。詳細は要確認",
      tags: ["居酒屋", "中津駅", "一人飲み", "夜ご飯"],
      memo: "店名検索で最新の場所・営業時間を確認してください。",
      verified: false
    },
    {
      name: "千一",
      category: "居酒屋・夜ご飯",
      description: "中津駅周辺の居酒屋候補。飲み会・夜ご飯探し用。",
      address: "大分県中津市 中津駅周辺（詳細要確認）",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: mapSearch("千一 中津市 居酒屋"),
      officialUrl: "",
      sourceMemo: "2026年7月 追加候補。詳細は要確認",
      tags: ["居酒屋", "中津駅", "夜ご飯", "飲み会"],
      memo: "同名店舗がある可能性があるため、地図で場所を確認してください。",
      verified: false
    },
    {
      name: "みつばち",
      category: "居酒屋・夜ご飯",
      description: "中津駅周辺の夜ご飯・居酒屋候補。",
      address: "大分県中津市 中津駅周辺（詳細要確認）",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: mapSearch("みつばち 中津市 居酒屋"),
      officialUrl: "",
      sourceMemo: "2026年7月 追加候補。詳細は要確認",
      tags: ["居酒屋", "中津駅", "夜ご飯"],
      memo: "営業日・営業時間は事前確認がおすすめです。",
      verified: false
    },
    {
      name: "ほろほろ",
      category: "居酒屋・夜ご飯",
      description: "中津駅周辺の居酒屋候補。二軒目や少人数飲みにも使える候補。",
      address: "大分県中津市 中津駅周辺（詳細要確認）",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: mapSearch("ほろほろ 中津市 居酒屋"),
      officialUrl: "",
      sourceMemo: "2026年7月 追加候補。詳細は要確認",
      tags: ["居酒屋", "中津駅", "二軒目", "夜ご飯"],
      memo: "最新情報はGoogleマップやSNSで確認してください。",
      verified: false
    },
    {
      name: "ブルちゃん",
      category: "居酒屋・夜ご飯",
      description: "中津駅周辺の夜ご飯・居酒屋候補。",
      address: "大分県中津市 中津駅周辺（詳細要確認）",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: mapSearch("ブルちゃん 中津市 居酒屋"),
      officialUrl: "",
      sourceMemo: "2026年7月 追加候補。詳細は要確認",
      tags: ["居酒屋", "中津駅", "夜ご飯"],
      memo: "営業時間・定休日は要確認です。",
      verified: false
    },
    {
      name: "ひばり",
      category: "居酒屋・夜ご飯",
      description: "中津駅周辺の居酒屋候補。夜ご飯・飲み会探し用。",
      address: "大分県中津市 中津駅周辺（詳細要確認）",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: mapSearch("ひばり 中津市 居酒屋"),
      officialUrl: "",
      sourceMemo: "2026年7月 追加候補。詳細は要確認",
      tags: ["居酒屋", "中津駅", "夜ご飯", "飲み会"],
      memo: "店名が一般語なので、地図検索で場所を確認してください。",
      verified: false
    },
    {
      name: "あきない",
      category: "居酒屋・夜ご飯",
      description: "中津駅周辺の居酒屋候補。仕事終わりの夜ご飯候補として追加。",
      address: "大分県中津市 中津駅周辺（詳細要確認）",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: mapSearch("あきない 中津市 居酒屋"),
      officialUrl: "",
      sourceMemo: "2026年7月 追加候補。詳細は要確認",
      tags: ["居酒屋", "中津駅", "夜ご飯"],
      memo: "営業状況は来店前に確認してください。",
      verified: false
    },
    {
      name: "一合",
      category: "居酒屋・夜ご飯",
      description: "中津駅周辺の居酒屋候補。少人数飲みや一人飲み候補。",
      address: "大分県中津市 中津駅周辺（詳細要確認）",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: mapSearch("一合 中津市 居酒屋"),
      officialUrl: "",
      sourceMemo: "2026年7月 追加候補。詳細は要確認",
      tags: ["居酒屋", "中津駅", "一人飲み", "夜ご飯"],
      memo: "同名候補が出る場合があるので、住所を確認してください。",
      verified: false
    },
    {
      name: "灯り家",
      category: "居酒屋・夜ご飯",
      description: "中津駅周辺の居酒屋候補。落ち着いた夜ご飯探し用。",
      address: "大分県中津市 中津駅周辺（詳細要確認）",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: mapSearch("灯り家 中津市 居酒屋"),
      officialUrl: "",
      sourceMemo: "2026年7月 追加候補。詳細は要確認",
      tags: ["居酒屋", "中津駅", "夜ご飯", "少人数"],
      memo: "営業時間・予約可否は確認してください。",
      verified: false
    },
    {
      name: "七輪鳥焼 うろこ",
      category: "居酒屋・夜ご飯",
      description: "中津市の鳥焼き・居酒屋候補。焼き鳥・鳥料理系を探す時に使える候補。",
      address: "大分県中津市 中津駅周辺（詳細要確認）",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: mapSearch("七輪鳥焼 うろこ 中津市"),
      officialUrl: "",
      sourceMemo: "2026年7月 追加候補。詳細は要確認",
      tags: ["鳥料理", "焼き鳥", "居酒屋", "夜ご飯", "中津市"],
      memo: "焼き鳥・鳥焼き系を探す時の候補です。",
      verified: false
    },
    {
      name: "たっとり屋",
      category: "居酒屋・夜ご飯",
      description: "中津市の居酒屋・鳥料理系候補。夜ご飯探し用。",
      address: "大分県中津市（詳細要確認）",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: mapSearch("たっとり屋 中津市"),
      officialUrl: "",
      sourceMemo: "2026年7月 追加候補。詳細は要確認",
      tags: ["居酒屋", "鳥料理", "夜ご飯", "中津市"],
      memo: "場所・営業時間は地図で確認してください。",
      verified: false
    },
    {
      name: "笑顔のたね",
      category: "居酒屋・夜ご飯",
      description: "中津市の夜ご飯・居酒屋候補。飲み会や食事候補として追加。",
      address: "大分県中津市（詳細要確認）",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: mapSearch("笑顔のたね 中津市 居酒屋"),
      officialUrl: "",
      sourceMemo: "2026年7月 追加候補。詳細は要確認",
      tags: ["居酒屋", "夜ご飯", "中津市"],
      memo: "最新の営業情報を確認してください。",
      verified: false
    },
    {
      name: "だいだい",
      category: "居酒屋・夜ご飯",
      description: "中津市の夜ご飯・居酒屋候補。",
      address: "大分県中津市（詳細要確認）",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: mapSearch("だいだい 中津市 居酒屋"),
      officialUrl: "",
      sourceMemo: "2026年7月 追加候補。詳細は要確認",
      tags: ["居酒屋", "夜ご飯", "中津市"],
      memo: "店名検索で場所・営業状況を確認してください。",
      verified: false
    },

    /* ===== ご飯屋・ランチ・からあげ ===== */
    {
      name: "チキンハウス 中津本店",
      category: "安いご飯",
      description: "中津からあげ系のご飯候補。テイクアウト・ランチ候補として追加。",
      address: "大分県中津市（詳細要確認）",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: mapSearch("チキンハウス 中津本店"),
      officialUrl: "",
      sourceMemo: "2026年7月 追加候補。詳細は要確認",
      tags: ["中津からあげ", "からあげ", "テイクアウト", "ランチ", "安いご飯"],
      memo: "中津からあげを探す時の候補。営業時間は要確認です。",
      verified: false
    },
    {
      name: "からあげ からいち",
      category: "安いご飯",
      description: "中津からあげ系のご飯候補。テイクアウト・昼ご飯候補として追加。",
      address: "大分県中津市（詳細要確認）",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: mapSearch("からあげ からいち 中津市"),
      officialUrl: "",
      sourceMemo: "2026年7月 追加候補。詳細は要確認",
      tags: ["中津からあげ", "からあげ", "テイクアウト", "ランチ"],
      memo: "からあげ系を探す時に使える候補です。",
      verified: false
    },
    {
      name: "ふくとん",
      category: "安いご飯",
      description: "中津市のご飯屋候補。しっかり食べたい時の候補として追加。",
      address: "大分県中津市（詳細要確認）",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: mapSearch("ふくとん 中津市"),
      officialUrl: "",
      sourceMemo: "2026年7月 追加候補。詳細は要確認",
      tags: ["ご飯", "ランチ", "定食", "中津市"],
      memo: "営業時間・定休日は確認してください。",
      verified: false
    },
    {
      name: "彩鶏々",
      category: "安いご飯",
      description: "中津市のからあげ・鶏料理系候補。テイクアウトやランチ候補。",
      address: "大分県中津市（詳細要確認）",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: mapSearch("彩鶏々 中津市"),
      officialUrl: "",
      sourceMemo: "2026年7月 追加候補。詳細は要確認",
      tags: ["鶏料理", "からあげ", "テイクアウト", "ランチ"],
      memo: "鶏料理・からあげ系を探す時の候補です。",
      verified: false
    },
    {
      name: "ぶんごや",
      category: "安いご飯",
      description: "中津からあげ系の候補。テイクアウトや昼ご飯候補として追加。",
      address: "大分県中津市（詳細要確認）",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: mapSearch("ぶんごや 中津市 からあげ"),
      officialUrl: "",
      sourceMemo: "2026年7月 追加候補。詳細は要確認",
      tags: ["中津からあげ", "からあげ", "テイクアウト", "ランチ"],
      memo: "からあげを買いたい時の候補です。",
      verified: false
    },
    {
      name: "井上からあげ",
      category: "安いご飯",
      description: "中津からあげ系の候補。テイクアウト・昼ご飯候補として追加。",
      address: "大分県中津市（詳細要確認）",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: mapSearch("井上からあげ 中津市"),
      officialUrl: "",
      sourceMemo: "2026年7月 追加候補。詳細は要確認",
      tags: ["中津からあげ", "からあげ", "テイクアウト", "ランチ"],
      memo: "からあげ系候補。最新情報は地図で確認してください。",
      verified: false
    }
  ];

  if (typeof facilities !== "undefined" && Array.isArray(facilities)) {
    let nextId = facilities.reduce(function (max, facility) {
      const id = Number(facility.id) || 0;
      return Math.max(max, id);
    }, 0) + 1;

    追加店舗.forEach(function (facility) {
      const sameName = facilities.some(function (f) {
        return String(f.name || "").trim() === String(facility.name || "").trim();
      });

      if (!sameName) {
        facilities.push(Object.assign({ id: nextId++ }, facility));
      }
    });
  }
})();
