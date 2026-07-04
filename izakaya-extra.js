/* ============================================================
   中津くらしナビ：中津駅周辺の居酒屋・夜ご飯 追加データ
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

  const extraFacilities = [
    {
      id: 101,
      name: "中津駅周辺の居酒屋",
      category: categoryKey,
      description: "JR中津駅周辺で居酒屋をまとめて探せる検索カード。飲み会・二軒目探し向け。",
      address: "大分県中津市 中津駅周辺",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("中津駅 周辺 居酒屋"),
      officialUrl: "",
      sourceMemo: "Googleマップ検索で最新の店舗候補を確認してください",
      tags: ["居酒屋", "駅周辺", "夜ご飯", "飲み会"],
      memo: "営業時間・定休日・空席は店舗ごとに変わるため、行く前に確認がおすすめです。",
      verified: false
    },
    {
      id: 102,
      name: "中津駅周辺の焼き鳥店",
      category: categoryKey,
      description: "中津駅周辺で焼き鳥・串焼き系のお店を探すための検索カード。",
      address: "大分県中津市 中津駅周辺",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("中津駅 周辺 焼き鳥"),
      officialUrl: "",
      sourceMemo: "Googleマップ検索で最新の店舗候補を確認してください",
      tags: ["焼き鳥", "串焼き", "駅周辺", "夜ご飯"],
      memo: "一人飲み・少人数の夜ご飯候補として探しやすいジャンルです。",
      verified: false
    },
    {
      id: 103,
      name: "中津駅周辺の海鮮居酒屋",
      category: categoryKey,
      description: "魚料理・刺身・海鮮系の居酒屋を中津駅周辺で探すための検索カード。",
      address: "大分県中津市 中津駅周辺",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("中津駅 周辺 海鮮 居酒屋"),
      officialUrl: "",
      sourceMemo: "Googleマップ検索で最新の店舗候補を確認してください",
      tags: ["海鮮", "刺身", "魚料理", "居酒屋"],
      memo: "魚系を食べたい時に使いやすい検索です。",
      verified: false
    },
    {
      id: 104,
      name: "中津駅周辺の個室居酒屋",
      category: categoryKey,
      description: "個室・半個室・落ち着いた飲み会向けのお店を探すための検索カード。",
      address: "大分県中津市 中津駅周辺",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("中津駅 周辺 個室 居酒屋"),
      officialUrl: "",
      sourceMemo: "Googleマップ検索で最新の店舗候補を確認してください",
      tags: ["個室", "飲み会", "デート", "駅周辺"],
      memo: "個室の有無は変わるため、予約前に店舗ページや電話で確認してください。",
      verified: false
    },
    {
      id: 105,
      name: "中津駅周辺の安い居酒屋",
      category: categoryKey,
      description: "予算を抑えて飲みたい時に、中津駅周辺の安めの居酒屋を探す検索カード。",
      address: "大分県中津市 中津駅周辺",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("中津駅 周辺 安い 居酒屋"),
      officialUrl: "",
      sourceMemo: "Googleマップ検索で最新の店舗候補を確認してください",
      tags: ["安い", "コスパ", "居酒屋", "駅周辺"],
      memo: "口コミやメニュー写真で価格感を見てから行くと失敗しにくいです。",
      verified: false
    },
    {
      id: 106,
      name: "中津駅周辺のバー・二軒目候補",
      category: categoryKey,
      description: "居酒屋の後に行けるバー・二軒目向けのお店を探す検索カード。",
      address: "大分県中津市 中津駅周辺",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("中津駅 周辺 バー"),
      officialUrl: "",
      sourceMemo: "Googleマップ検索で最新の店舗候補を確認してください",
      tags: ["バー", "二軒目", "夜", "駅周辺"],
      memo: "二軒目探し用。営業時間は店舗ごとに確認してください。",
      verified: false
    }
  ];

  if (typeof facilities !== "undefined") {
    extraFacilities.forEach(function (facility) {
      const sameId = facilities.some(function (f) { return f.id === facility.id; });
      const sameName = facilities.some(function (f) { return f.name === facility.name; });
      if (!sameId && !sameName) {
        facilities.push(facility);
      }
    });
  }
})();
