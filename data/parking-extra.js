/* ============================================================
   中津くらしナビ：駐車場検索カード
   ============================================================ */

(function () {
  const categoryKey = "駐車場";

  if (typeof CATEGORIES !== "undefined") {
    const exists = CATEGORIES.some(function (c) { return c.key === categoryKey; });
    if (!exists) {
      CATEGORIES.push({ key: categoryKey, icon: "🅿️" });
    }
  }

  if (typeof CATEGORY_ICON_MAP !== "undefined") {
    CATEGORY_ICON_MAP[categoryKey] = "🅿️";
  }

  if (typeof CATEGORY_COLOR_INDEX !== "undefined" && typeof CATEGORIES !== "undefined") {
    CATEGORY_COLOR_INDEX[categoryKey] = CATEGORIES.findIndex(function (c) {
      return c.key === categoryKey;
    });
  }

  const parkingSearchCards = [
    {
      id: 401,
      name: "中津駅周辺の駐車場",
      keyword: "中津駅 駐車場",
      description: "中津駅周辺で車を停めたい時に。駅利用・待ち合わせ・買い物前に確認。"
    },
    {
      id: 402,
      name: "中津駅周辺の安い駐車場",
      keyword: "中津駅 安い 駐車場",
      description: "なるべく安く停めたい時の検索用。最大料金の有無も確認。"
    },
    {
      id: 403,
      name: "中津駅周辺の最大料金あり駐車場",
      keyword: "中津駅 駐車場 最大料金",
      description: "長時間停める時に便利。料金は変更される場合があります。"
    },
    {
      id: 404,
      name: "中津駅周辺の24時間駐車場",
      keyword: "中津駅 24時間 駐車場",
      description: "夜遅く・早朝に停めたい時の候補探しに。"
    },
    {
      id: 405,
      name: "中津駅北口周辺の駐車場",
      keyword: "中津駅 北口 駐車場",
      description: "中津駅北口側で駐車場を探したい時に。"
    },
    {
      id: 406,
      name: "中津駅南口周辺の駐車場",
      keyword: "中津駅 南口 駐車場",
      description: "中津駅南口側で駐車場を探したい時に。"
    },
    {
      id: 407,
      name: "中津駅周辺のコインパーキング",
      keyword: "中津駅 コインパーキング",
      description: "短時間利用しやすいコインパーキング探しに。"
    },
    {
      id: 408,
      name: "中津駅周辺の居酒屋近くの駐車場",
      keyword: "中津駅 居酒屋 近く 駐車場",
      description: "居酒屋・夜ご飯に行く前の駐車場探しに。飲酒運転は絶対にしないでください。"
    },
    {
      id: 409,
      name: "中津駅周辺のラーメン店近くの駐車場",
      keyword: "中津駅 ラーメン 近く 駐車場",
      description: "ラーメン店に行く時に近くの駐車場を探す用。"
    },
    {
      id: 410,
      name: "中津市役所周辺の駐車場",
      keyword: "中津市役所 駐車場",
      description: "市役所・手続きで車を停めたい時に。"
    },
    {
      id: 411,
      name: "中津城周辺の駐車場",
      keyword: "中津城 駐車場",
      description: "中津城・城下町観光の時に使いやすい駐車場探しに。"
    },
    {
      id: 412,
      name: "ゆめタウン中津周辺の駐車場",
      keyword: "ゆめタウン中津 駐車場",
      description: "買い物・食事の時に駐車場情報を確認。"
    },
    {
      id: 413,
      name: "中津駅周辺の月極駐車場",
      keyword: "中津駅 月極駐車場",
      description: "通勤・通学などで月極駐車場を探したい時に。"
    },
    {
      id: 414,
      name: "中津市の無料駐車場",
      keyword: "中津市 無料 駐車場",
      description: "無料で停められる場所を探したい時に。利用条件は必ず確認。"
    },
    {
      id: 415,
      name: "中津市の駐車場まとめ検索",
      keyword: "大分県中津市 駐車場",
      description: "中津市全体で駐車場を探したい時のまとめ検索。"
    }
  ];

  if (typeof facilities !== "undefined") {
    parkingSearchCards.forEach(function (item) {
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
        sourceMemo: "Googleマップ検索用カード。料金・台数・営業時間は現地情報を要確認",
        tags: ["駐車場", "中津駅", "中津市", "コインパーキング", "最大料金", "車"],
        memo: "駐車料金・最大料金・空き状況は変わるため、利用前にGoogleマップや現地看板で確認してください。",
        verified: false
      };

      const existing = facilities.find(function (f) { return f.name === item.name; });
      if (!existing) {
        facilities.push(facility);
      }
    });
  }
})();
