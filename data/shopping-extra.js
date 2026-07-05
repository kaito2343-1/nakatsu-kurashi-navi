/* ============================================================
   中津くらしナビ：スーパー・コンビニ 追加版
   ファイル名：shopping-extra.js
   ============================================================ */

(function () {
  const categoryKey = "スーパー・コンビニ";

  if (typeof CATEGORIES !== "undefined") {
    const exists = CATEGORIES.some(function (c) { return c.key === categoryKey; });
    if (!exists) {
      CATEGORIES.push({ key: categoryKey, icon: "🛒" });
    }
  }

  if (typeof CATEGORY_ICON_MAP !== "undefined") {
    CATEGORY_ICON_MAP[categoryKey] = "🛒";
  }

  if (typeof CATEGORY_COLOR_INDEX !== "undefined" && typeof CATEGORIES !== "undefined") {
    CATEGORY_COLOR_INDEX[categoryKey] = CATEGORIES.findIndex(function (c) {
      return c.key === categoryKey;
    });
  }

  // スーパー・コンビニカテゴリ用の色を追加
  if (!document.getElementById("shoppingExtraStyle")) {
    const style = document.createElement("style");
    style.id = "shoppingExtraStyle";
    style.textContent = `
      .cat-16 { --cat-color: #15803d; --cat-color-soft: #dcfce7; } /* スーパー・コンビニ */
    `;
    document.head.appendChild(style);
  }

  const shoppingData = [
    {
      id: 901,
      name: "中津市 スーパー",
      keyword: "中津市 スーパー",
      description: "中津市でスーパーをまとめて探したい時の検索カード。",
      tags: ["スーパー", "買い物", "食品", "中津市"]
    },
    {
      id: 902,
      name: "中津駅 スーパー",
      keyword: "中津駅 スーパー",
      description: "中津駅周辺でスーパーを探したい時の検索カード。",
      tags: ["スーパー", "中津駅", "買い物", "食品"]
    },
    {
      id: 903,
      name: "中津市 コンビニ",
      keyword: "中津市 コンビニ",
      description: "中津市で近くのコンビニを探したい時の検索カード。",
      tags: ["コンビニ", "24時間", "買い物", "中津市"]
    },
    {
      id: 904,
      name: "中津駅 コンビニ",
      keyword: "中津駅 コンビニ",
      description: "中津駅周辺でコンビニを探したい時の検索カード。",
      tags: ["コンビニ", "中津駅", "24時間", "買い物"]
    },
    {
      id: 905,
      name: "ゆめタウン中津",
      keyword: "ゆめタウン中津",
      description: "買い物・食事・日用品の購入に使いやすい大型商業施設候補。",
      tags: ["ショッピング", "スーパー", "買い物", "食事"]
    },
    {
      id: 906,
      name: "イオンモール三光",
      keyword: "イオンモール三光 中津市",
      description: "買い物・食事・休日のお出かけに使いやすい大型商業施設候補。",
      tags: ["ショッピング", "イオン", "買い物", "休日"]
    },
    {
      id: 907,
      name: "マルショク 中津",
      keyword: "マルショク 中津市",
      description: "中津市周辺で食品スーパーを探したい時の候補。",
      tags: ["スーパー", "食品", "買い物", "中津市"]
    },
    {
      id: 908,
      name: "ダイレックス 中津",
      keyword: "ダイレックス 中津市",
      description: "日用品・食品・安い買い物を探したい時の候補。",
      tags: ["ディスカウント", "スーパー", "日用品", "安い"]
    },
    {
      id: 909,
      name: "トライアル 中津",
      keyword: "トライアル 中津市",
      description: "安い食品・日用品・まとめ買いを探したい時の候補。",
      tags: ["スーパー", "ディスカウント", "安い", "買い物"]
    },
    {
      id: 910,
      name: "ドラッグストアモリ 中津",
      keyword: "ドラッグストアモリ 中津市",
      description: "薬・日用品・食品をまとめて買いたい時の候補。",
      tags: ["ドラッグストア", "日用品", "食品", "薬"]
    },
    {
      id: 911,
      name: "コスモス 中津",
      keyword: "ディスカウントドラッグコスモス 中津市",
      description: "日用品・薬・食品を安く買いたい時の候補。",
      tags: ["ドラッグストア", "日用品", "食品", "安い"]
    },
    {
      id: 912,
      name: "セブンイレブン 中津市",
      keyword: "セブンイレブン 中津市",
      description: "中津市でセブンイレブンを探したい時の検索カード。",
      tags: ["コンビニ", "セブンイレブン", "24時間", "買い物"]
    },
    {
      id: 913,
      name: "ローソン 中津市",
      keyword: "ローソン 中津市",
      description: "中津市でローソンを探したい時の検索カード。",
      tags: ["コンビニ", "ローソン", "24時間", "買い物"]
    },
    {
      id: 914,
      name: "ファミリーマート 中津市",
      keyword: "ファミリーマート 中津市",
      description: "中津市でファミリーマートを探したい時の検索カード。",
      tags: ["コンビニ", "ファミリーマート", "24時間", "買い物"]
    },
    {
      id: 915,
      name: "中津市 24時間 コンビニ",
      keyword: "中津市 24時間 コンビニ",
      description: "深夜・早朝に使えるコンビニを探したい時の検索カード。",
      tags: ["コンビニ", "24時間", "深夜", "早朝"]
    },
    {
      id: 916,
      name: "中津市 安いスーパー",
      keyword: "中津市 安いスーパー",
      description: "中津市で安く買い物できるスーパーを探したい時の検索カード。",
      tags: ["スーパー", "安い", "食品", "節約"]
    },
    {
      id: 917,
      name: "中津市 業務スーパー",
      keyword: "中津市 業務スーパー",
      description: "まとめ買い・冷凍食品・業務用食品を探したい時の検索カード。",
      tags: ["業務スーパー", "まとめ買い", "食品", "安い"]
    },
    {
      id: 918,
      name: "中津市 弁当 スーパー",
      keyword: "中津市 弁当 スーパー",
      description: "スーパーの弁当・惣菜を探したい時の検索カード。",
      tags: ["弁当", "惣菜", "スーパー", "昼ご飯"]
    },
    {
      id: 919,
      name: "中津市 駐車場あり スーパー",
      keyword: "中津市 駐車場あり スーパー",
      description: "車で行きやすいスーパーを探したい時の検索カード。",
      tags: ["スーパー", "駐車場", "車", "買い物"]
    },
    {
      id: 920,
      name: "中津市 買い物",
      keyword: "中津市 買い物",
      description: "中津市で買い物できる場所をまとめて探したい時の検索カード。",
      tags: ["買い物", "スーパー", "日用品", "ショッピング"]
    }
  ];

  if (typeof facilities !== "undefined") {
    shoppingData.forEach(function (item) {
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
        sourceMemo: "検索カード。営業時間・店舗情報・閉店情報はGoogleマップ等で要確認",
        tags: item.tags || ["スーパー", "コンビニ", "買い物", "中津市"],
        memo: "営業時間・店舗情報・在庫・閉店情報は変わる場合があります。行く前にGoogleマップや公式情報で確認してください。",
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
