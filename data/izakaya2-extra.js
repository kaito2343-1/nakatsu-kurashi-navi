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
    },

    {
      id: 201,
      name: "文楽",
      category: categoryKey,
      description: "中津駅近く・豊田町にある居酒屋。落ち着いて飲みたい時の候補。",
      address: "大分県中津市豊田町6-13",
      phone: "",
      hours: "Googleマップ表示：17:30頃から（要確認）",
      closed: "",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("文楽 中津市豊田町6-13"),
      officialUrl: "",
      sourceMemo: "2026年7月 Googleマップ表示・ユーザー提供スクショで確認。最新情報は要確認",
      tags: ["居酒屋", "中津駅", "豊田町", "落ち着く", "飲み会", "夜ご飯"],
      memo: "スクショでは評価4.4・価格帯4,000〜5,000円目安。営業時間・空席は来店前に確認してください。",
      verified: false
    },
    {
      id: 202,
      name: "扇八",
      category: categoryKey,
      description: "中津駅近く・島田エリアにある居酒屋。一人飲みや少人数の夜ご飯候補。",
      address: "大分県中津市島田363",
      phone: "",
      hours: "Googleマップ表示：17:00頃から（要確認）",
      closed: "",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("扇八 中津市島田363"),
      officialUrl: "",
      sourceMemo: "2026年7月 Googleマップ表示・ユーザー提供スクショで確認。最新情報は要確認",
      tags: ["居酒屋", "中津駅", "島田", "一人飲み", "夜ご飯", "飲み会"],
      memo: "スクショでは評価4.4・価格帯2,000〜3,000円目安。営業時間・空席は来店前に確認してください。",
      verified: false
    },
    {
      id: 203,
      name: "地魚屋台 ぜんちゃん",
      category: categoryKey,
      description: "中津駅近く・島田エリアにある海鮮系の居酒屋。魚料理を食べたい時の候補。",
      address: "大分県中津市島田352-9",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("地魚屋台 ぜんちゃん 中津市島田352-9"),
      officialUrl: "",
      sourceMemo: "2026年7月 Googleマップ表示・ユーザー提供スクショで確認。最新情報は要確認",
      tags: ["居酒屋", "海鮮", "地魚", "中津駅", "島田", "飲み放題", "一人飲み"],
      memo: "スクショでは評価3.9・価格帯4,000〜5,000円目安。飲み放題表示あり。詳細は来店前に確認してください。",
      verified: false
    },
    {
      id: 204,
      name: "二十八萬石",
      category: categoryKey,
      description: "中津駅近く・日ノ出町にある大衆系の居酒屋。安めに飲みたい時の候補。",
      address: "大分県中津市日ノ出町216",
      phone: "",
      hours: "Googleマップ表示：16:00頃から（要確認）",
      closed: "",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("二十八萬石 中津市日ノ出町216"),
      officialUrl: "",
      sourceMemo: "2026年7月 Googleマップ表示・ユーザー提供スクショで確認。最新情報は要確認",
      tags: ["居酒屋", "中津駅", "日ノ出町", "安い", "大衆酒場", "一人飲み"],
      memo: "スクショでは評価4.0・価格帯2,000〜3,000円目安。営業時間・空席は来店前に確認してください。",
      verified: false
    },
    {
      id: 205,
      name: "夢天までとどけ",
      category: categoryKey,
      description: "中津駅近く・日ノ出町にある居酒屋。刺身・肉系メニューの口コミが見られるお店。",
      address: "大分県中津市日ノ出町370-2",
      phone: "",
      hours: "Googleマップ表示：17:30頃から（要確認）",
      closed: "",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("夢天までとどけ 中津市日ノ出町370-2"),
      officialUrl: "",
      sourceMemo: "2026年7月 Googleマップ表示・ユーザー提供スクショで確認。最新情報は要確認",
      tags: ["居酒屋", "中津駅", "日ノ出町", "刺身", "肉料理", "飲み放題", "宴会"],
      memo: "スクショでは評価4.0・価格帯3,000〜4,000円目安。営業時間・空席は来店前に確認してください。",
      verified: false
    },
    {
      id: 206,
      name: "on the sly.",
      category: categoryKey,
      description: "中津駅近く・島田エリアにあるグリル系のお店。深夜帯まで営業している表示あり。",
      address: "大分県中津市島田217-6",
      phone: "",
      hours: "Googleマップ表示：3:00頃まで（要確認）",
      closed: "",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("on the sly. 中津市島田217-6"),
      officialUrl: "",
      sourceMemo: "2026年7月 Googleマップ表示・ユーザー提供スクショで確認。最新情報は要確認",
      tags: ["グリル", "居酒屋", "バー", "中津駅", "島田", "深夜", "二軒目", "Wi-Fi"],
      memo: "スクショでは評価4.8・深夜3:00終了表示。営業時間は必ず最新情報を確認してください。",
      verified: false
    },
    {
      id: 207,
      name: "居酒屋ダイニング 楽笑",
      category: categoryKey,
      description: "中津駅近く・島田本町にある居酒屋ダイニング。個室・飲み放題表示あり。",
      address: "大分県中津市島田本町374-41",
      phone: "",
      hours: "Googleマップ表示：0:00頃まで（要確認）",
      closed: "",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("居酒屋ダイニング 楽笑 中津市島田本町374-41"),
      officialUrl: "",
      sourceMemo: "2026年7月 Googleマップ表示・ユーザー提供スクショで確認。最新情報は要確認",
      tags: ["居酒屋", "ダイニング", "中津駅", "島田本町", "個室", "飲み放題", "宴会", "テイクアウト"],
      memo: "スクショでは評価4.1・価格帯3,000〜8,000円目安。宴会や職場飲みに良さそうな候補です。",
      verified: false
    },
    {
      id: 208,
      name: "マルイチ",
      category: categoryKey,
      description: "中津駅近く・島田本町にある焼き鳥店。カウンターで一人飲み候補にも。",
      address: "大分県中津市島田本町45",
      phone: "",
      hours: "Googleマップ表示：0:00頃まで（要確認）",
      closed: "",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("マルイチ 焼き鳥 中津市島田本町45"),
      officialUrl: "",
      sourceMemo: "2026年7月 Googleマップ表示・ユーザー提供スクショで確認。最新情報は要確認",
      tags: ["焼き鳥", "居酒屋", "中津駅", "島田本町", "一人飲み", "カウンター", "PayPay"],
      memo: "スクショでは評価4.9・価格帯2,000〜3,000円目安。焼き鳥好き向け。",
      verified: false
    },
    {
      id: 209,
      name: "大衆酒場 達磨",
      category: categoryKey,
      description: "中津駅近く・島田エリアにある大衆酒場。個室・飲み放題・スポーツ観戦表示あり。",
      address: "大分県中津市島田350-12",
      phone: "",
      hours: "Googleマップ表示：2:00頃まで（要確認）",
      closed: "",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("大衆酒場 達磨 中津市島田350-12"),
      officialUrl: "",
      sourceMemo: "2026年7月 Googleマップ表示・ユーザー提供スクショで確認。最新情報は要確認",
      tags: ["大衆酒場", "居酒屋", "中津駅", "島田", "個室", "飲み放題", "深夜", "スポーツ観戦", "家族向き"],
      memo: "スクショでは評価4.0・価格帯5,000〜6,000円目安。営業時間・空席は来店前に確認してください。",
      verified: false
    },
    {
      id: 210,
      name: "一期一会 或",
      category: "安いご飯",
      description: "中津市中央町にあるラーメン店。居酒屋検索でも近くの夜ご飯候補として表示されていました。",
      address: "大分県中津市中央町2丁目2-4",
      phone: "",
      hours: "Googleマップ表示：8:00頃から（要確認）",
      closed: "",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("一期一会 或 中津市中央町2丁目2-4"),
      officialUrl: "",
      sourceMemo: "2026年7月 Googleマップ表示・ユーザー提供スクショで確認。最新情報は要確認",
      tags: ["ラーメン", "中津市", "中央町", "しおラーメン", "夜ご飯", "駐車場"],
      memo: "居酒屋ではなくラーメン枠として追加。スクショでは評価4.3・価格帯1,000〜2,000円目安。",
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
