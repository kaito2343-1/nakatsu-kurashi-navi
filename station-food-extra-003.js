/* ============================================================
   中津くらしナビ：中津市 外食・家族向けご飯 追加データ003
   ・実在確認しやすい店舗名中心
   ・営業時間/電話番号は未確認なら入れない
   ・同じ店名が既にある場合は上書きして情報を整える
   ============================================================ */

(function () {
  const CATEGORY_DEFS = [
    { key: "安いご飯", icon: "🍚" },
    { key: "定食・ランチ", icon: "🍱" },
    { key: "弁当・惣菜", icon: "🍱" },
    { key: "居酒屋・夜ご飯", icon: "🍻" },
    { key: "ラーメン", icon: "🍜" },
    { key: "焼肉・寿司", icon: "🥩" },
    { key: "カフェ・喫茶店", icon: "☕" }
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

  const removeNames = [
    "やよい軒 中津店",
    "餃子の王将 中津店",
    "大阪王将 中津店",
    "おべんとうのヒライ 中津店"
  ];

  const DEFAULT_MEMO = "営業時間・定休日・閉店情報は変わる場合があります。行く前に公式情報やGoogleマップで確認してください。";

  const shops003 = [
    {
      name: "井手ちゃんぽん 中津店",
      category: "定食・ランチ",
      description: "ちゃんぽん・野菜多めの麺類を食べたい時の候補。ランチや一人飯にも使いやすい店舗。",
      keyword: "井手ちゃんぽん 中津店",
      officialUrl: "",
      tags: ["ちゃんぽん", "麺類", "ランチ", "一人飯", "家族向き"]
    },
    {
      name: "リンガーハット 大分中津店",
      category: "定食・ランチ",
      description: "ちゃんぽん・皿うどんを手早く食べたい時の候補。ランチや軽めの夜ご飯にも。",
      keyword: "リンガーハット 大分中津店",
      officialUrl: "https://www.ringerhut.jp/",
      tags: ["ちゃんぽん", "皿うどん", "ランチ", "一人飯", "チェーン店"]
    },
    {
      name: "かつや 大分中津店",
      category: "定食・ランチ",
      description: "カツ丼・とんかつ定食を食べたい時の候補。しっかり食べたい昼ご飯・夜ご飯向け。",
      keyword: "かつや 大分中津店",
      officialUrl: "https://www.arclandservice.co.jp/katsuya/",
      tags: ["カツ丼", "とんかつ", "定食", "ランチ", "一人飯"]
    },
    {
      name: "ウエスト 中津店",
      category: "安いご飯",
      description: "うどん・そば・丼系を食べたい時の候補。昼ご飯や一人飯に使いやすい店舗。",
      keyword: "ウエスト 中津店",
      officialUrl: "https://www.shop-west.jp/",
      tags: ["うどん", "そば", "丼", "安いご飯", "一人飯"]
    },
    {
      name: "どんどん亭 中津店",
      category: "定食・ランチ",
      description: "お好み焼き・鉄板焼き系を食べたい時の候補。家族利用や夜ご飯にも。",
      keyword: "どんどん亭 中津店",
      officialUrl: "https://www.dondontei.com/",
      tags: ["お好み焼き", "鉄板焼き", "ランチ", "夜ご飯", "家族向き"]
    },
    {
      name: "ジョイフル 北中津店",
      category: "定食・ランチ",
      description: "ファミレス系の食事候補。家族利用・一人飯・夜ご飯にも使いやすい店舗。",
      keyword: "ジョイフル 北中津店",
      officialUrl: "https://www.joyfull.co.jp/",
      tags: ["ファミレス", "ランチ", "夜ご飯", "家族向き", "一人飯"]
    },
    {
      name: "ジョイフル 南中津店",
      category: "定食・ランチ",
      description: "ファミレス系の食事候補。ランチ・夜ご飯・家族利用に使いやすい店舗。",
      keyword: "ジョイフル 南中津店",
      officialUrl: "https://www.joyfull.co.jp/",
      tags: ["ファミレス", "ランチ", "夜ご飯", "家族向き", "一人飯"]
    },
    {
      name: "ジョイフル 中津店",
      category: "定食・ランチ",
      description: "ファミレス系のご飯候補。ランチ・夜ご飯・家族利用・一人飯にも使いやすい店舗。",
      keyword: "ジョイフル 中津店",
      officialUrl: "https://www.joyfull.co.jp/",
      tags: ["ファミレス", "ランチ", "定食", "家族向き", "一人飯", "夜ご飯"]
    },
    {
      name: "ガスト 中津店",
      category: "定食・ランチ",
      description: "ファミレス系のランチ・夜ご飯候補。家族利用、作業、軽めの食事にも使いやすい店舗。",
      keyword: "ガスト 中津店",
      officialUrl: "https://www.skylark.co.jp/gusto/",
      tags: ["ファミレス", "ランチ", "家族向き", "一人飯", "駐車場", "夜ご飯"]
    },
    {
      name: "CoCo壱番屋 大分中津店",
      category: "安いご飯",
      description: "カレーを食べたい時の候補。ランチ・夜ご飯・一人飯にも使いやすいチェーン店。",
      keyword: "CoCo壱番屋 大分中津店",
      officialUrl: "https://www.ichibanya.co.jp/",
      tags: ["カレー", "ランチ", "夜ご飯", "一人飯", "テイクアウト"]
    },
    {
      name: "牛角 中津店",
      category: "焼肉・寿司",
      description: "焼肉チェーンの候補。家族利用・飲み会・夜ご飯に使いやすい店舗。",
      keyword: "牛角 中津店",
      officialUrl: "https://www.gyukaku.ne.jp/",
      tags: ["焼肉", "肉", "夜ご飯", "飲み会", "家族向き"]
    },
    {
      name: "焼肉きんぐ 中津店",
      category: "焼肉・寿司",
      description: "焼肉食べ放題系を探す時の候補。家族利用・友人との夜ご飯向け。",
      keyword: "焼肉きんぐ 中津店",
      officialUrl: "https://www.yakiniku-king.jp/",
      tags: ["焼肉", "食べ放題", "肉", "夜ご飯", "家族向き"]
    },
    {
      name: "焼肉ウエスト 中津店",
      category: "焼肉・寿司",
      description: "焼肉・肉系ご飯を食べたい時の候補。家族利用や夜ご飯向け。",
      keyword: "焼肉ウエスト 中津店",
      officialUrl: "https://www.shop-west.jp/",
      tags: ["焼肉", "肉", "夜ご飯", "家族向き"]
    },
    {
      name: "しゃぶしゃぶ温野菜 大分中津店",
      category: "居酒屋・夜ご飯",
      description: "しゃぶしゃぶを食べたい時の候補。夜ご飯・飲み会・家族利用向け。",
      keyword: "しゃぶしゃぶ温野菜 大分中津店",
      officialUrl: "https://www.onyasai.com/",
      tags: ["しゃぶしゃぶ", "鍋", "夜ご飯", "飲み会", "家族向き"]
    },
    {
      name: "博多一番どり 居食家あらい 中津店",
      category: "居酒屋・夜ご飯",
      description: "焼き鳥・鳥料理・居酒屋系の夜ご飯候補。飲み会にも使いやすい店舗。",
      keyword: "博多一番どり 居食家あらい 中津店",
      officialUrl: "https://www.ichibandori.com/",
      tags: ["居酒屋", "焼き鳥", "鳥料理", "夜ご飯", "飲み会"]
    },
    {
      name: "やきとり大吉 中津店",
      category: "居酒屋・夜ご飯",
      description: "焼き鳥・居酒屋系の候補。一人飲みや少人数の夜ご飯にも。",
      keyword: "やきとり大吉 中津店",
      officialUrl: "https://www.daikichi.co.jp/",
      tags: ["焼き鳥", "居酒屋", "夜ご飯", "一人飲み"]
    },
    {
      name: "魚民 中津北口駅前店",
      category: "居酒屋・夜ご飯",
      description: "中津駅北口側で居酒屋を探す時の候補。飲み会・二軒目向け。",
      keyword: "魚民 中津北口駅前店",
      officialUrl: "https://www.monteroza.co.jp/brand/tami/",
      tags: ["居酒屋", "中津駅", "飲み会", "夜ご飯", "駅近"]
    },
    {
      name: "筑豊ラーメン山小屋 メルクス中津店",
      category: "ラーメン",
      description: "豚骨ラーメン系を食べたい時の候補。ランチ・夜ご飯・一人飯向け。",
      keyword: "筑豊ラーメン山小屋 メルクス中津店",
      officialUrl: "https://yamagoya.co.jp/",
      tags: ["ラーメン", "豚骨", "ランチ", "夜ご飯", "一人飯"]
    },
    {
      name: "マクドナルド イオンモール三光店",
      category: "安いご飯",
      description: "イオンモール三光内で軽食・休憩・テイクアウトに使える候補。",
      keyword: "マクドナルド イオンモール三光店",
      officialUrl: "https://www.mcdonalds.co.jp/",
      tags: ["ハンバーガー", "軽食", "テイクアウト", "家族向き", "イオンモール三光"]
    },
    {
      name: "ケンタッキーフライドチキン ゆめタウン中津店",
      category: "安いご飯",
      description: "ゆめタウン中津内でチキン・軽食を探す時の候補。テイクアウトにも。",
      keyword: "ケンタッキーフライドチキン ゆめタウン中津店",
      officialUrl: "https://www.kfc.co.jp/",
      tags: ["チキン", "軽食", "テイクアウト", "ゆめタウン中津", "家族向き"]
    },
    {
      name: "ミスタードーナツ ゆめタウン中津ショップ",
      category: "カフェ・喫茶店",
      description: "ドーナツ・コーヒー・休憩に使いやすい候補。ゆめタウン中津内の軽食候補。",
      keyword: "ミスタードーナツ ゆめタウン中津ショップ",
      officialUrl: "https://www.misterdonut.jp/",
      tags: ["ドーナツ", "カフェ", "休憩", "スイーツ", "ゆめタウン中津"]
    },
    {
      name: "サーティワンアイスクリーム ゆめタウン中津店",
      category: "カフェ・喫茶店",
      description: "アイスクリーム・スイーツ・休憩に使いやすい候補。子連れにも使いやすい店舗。",
      keyword: "サーティワンアイスクリーム ゆめタウン中津店",
      officialUrl: "https://www.31ice.co.jp/",
      tags: ["アイス", "スイーツ", "休憩", "子連れ", "ゆめタウン中津"]
    }
  ];

  if (typeof facilities !== "undefined" && Array.isArray(facilities)) {
    for (let i = facilities.length - 1; i >= 0; i--) {
      const currentName = String(facilities[i].name || "").trim();
      if (removeNames.indexOf(currentName) !== -1) {
        facilities.splice(i, 1);
      }
    }

    let nextId = facilities.reduce(function (max, facility) {
      const id = Number(facility.id) || 0;
      return Math.max(max, id);
    }, 0) + 1;

    shops003.forEach(function (item) {
      const facility = {
        id: nextId++,
        name: item.name,
        category: item.category,
        description: item.description,
        address: "",
        phone: "",
        hours: "営業時間は要確認",
        closed: "",
        mapUrl: mapSearch(item.keyword || item.name + " 中津市"),
        officialUrl: item.officialUrl || "",
        sourceMemo: "2026年7月 追加候補。住所・営業時間・電話番号は公式店舗検索またはGoogleマップで要確認",
        tags: item.tags || [],
        memo: DEFAULT_MEMO,
        verified: false
      };

      const sameIndex = facilities.findIndex(function (f) {
        return String(f.name || "").trim() === String(facility.name || "").trim();
      });

      if (sameIndex >= 0) {
        facilities[sameIndex] = Object.assign({}, facilities[sameIndex], facility, {
          id: facilities[sameIndex].id
        });
      } else {
        facilities.push(facility);
      }
    });
  }
})();
