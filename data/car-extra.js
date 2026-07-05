/* ============================================================
   中津くらしナビ：車・ガソリン・洗車 追加版
   ファイル名：car-extra.js
   ============================================================ */

(function () {
  const categoryKey = "車・ガソリン";

  if (typeof CATEGORIES !== "undefined") {
    const exists = CATEGORIES.some(function (c) { return c.key === categoryKey; });
    if (!exists) {
      CATEGORIES.push({ key: categoryKey, icon: "⛽" });
    }
  }

  if (typeof CATEGORY_ICON_MAP !== "undefined") {
    CATEGORY_ICON_MAP[categoryKey] = "⛽";
  }

  if (typeof CATEGORY_COLOR_INDEX !== "undefined" && typeof CATEGORIES !== "undefined") {
    CATEGORY_COLOR_INDEX[categoryKey] = CATEGORIES.findIndex(function (c) {
      return c.key === categoryKey;
    });
  }

  // 車・ガソリンカテゴリ用の色を追加
  if (!document.getElementById("carExtraStyle")) {
    const style = document.createElement("style");
    style.id = "carExtraStyle";
    style.textContent = `
      .cat-19 { --cat-color: #475569; --cat-color-soft: #e2e8f0; } /* 車・ガソリン */
    `;
    document.head.appendChild(style);
  }

  const carData = [
    {
      id: 1201,
      name: "中津市 ガソリンスタンド",
      keyword: "中津市 ガソリンスタンド",
      description: "中津市で近くのガソリンスタンドを探したい時の検索カード。",
      tags: ["ガソリンスタンド", "給油", "車", "中津市"]
    },
    {
      id: 1202,
      name: "中津駅 ガソリンスタンド",
      keyword: "中津駅 ガソリンスタンド",
      description: "中津駅周辺で給油したい時の検索カード。",
      tags: ["ガソリンスタンド", "中津駅", "給油", "車"]
    },
    {
      id: 1203,
      name: "中津市 24時間 ガソリンスタンド",
      keyword: "中津市 24時間 ガソリンスタンド",
      description: "深夜・早朝に給油できる場所を探したい時の検索カード。",
      tags: ["24時間", "ガソリンスタンド", "深夜", "給油"]
    },
    {
      id: 1204,
      name: "中津市 セルフガソリンスタンド",
      keyword: "中津市 セルフ ガソリンスタンド",
      description: "セルフ給油できるガソリンスタンドを探したい時の検索カード。",
      tags: ["セルフ", "ガソリンスタンド", "給油", "車"]
    },
    {
      id: 1205,
      name: "ENEOS 中津市",
      keyword: "ENEOS 中津市",
      description: "中津市周辺でENEOS系のスタンドを探したい時の検索カード。",
      tags: ["ENEOS", "ガソリンスタンド", "給油", "車"]
    },
    {
      id: 1206,
      name: "apollostation 中津市",
      keyword: "apollostation 中津市",
      description: "中津市周辺でapollostation系のスタンドを探したい時の検索カード。",
      tags: ["apollostation", "出光", "ガソリンスタンド", "給油"]
    },
    {
      id: 1207,
      name: "コスモ石油 中津市",
      keyword: "コスモ石油 中津市",
      description: "中津市周辺でコスモ石油系のスタンドを探したい時の検索カード。",
      tags: ["コスモ石油", "ガソリンスタンド", "給油", "車"]
    },
    {
      id: 1208,
      name: "中津市 洗車場",
      keyword: "中津市 洗車場",
      description: "中津市で洗車できる場所を探したい時の検索カード。",
      tags: ["洗車", "洗車場", "車", "中津市"]
    },
    {
      id: 1209,
      name: "中津市 コイン洗車",
      keyword: "中津市 コイン洗車",
      description: "コイン洗車・セルフ洗車を探したい時の検索カード。",
      tags: ["コイン洗車", "セルフ洗車", "洗車", "車"]
    },
    {
      id: 1210,
      name: "中津市 洗車機",
      keyword: "中津市 洗車機",
      description: "洗車機がある場所を探したい時の検索カード。",
      tags: ["洗車機", "洗車", "ガソリンスタンド", "車"]
    },
    {
      id: 1211,
      name: "中津市 車検",
      keyword: "中津市 車検",
      description: "中津市で車検を頼める場所を探したい時の検索カード。",
      tags: ["車検", "整備", "車", "中津市"]
    },
    {
      id: 1212,
      name: "中津市 タイヤ交換",
      keyword: "中津市 タイヤ交換",
      description: "タイヤ交換・持ち込み交換を探したい時の検索カード。",
      tags: ["タイヤ交換", "タイヤ", "整備", "車"]
    },
    {
      id: 1213,
      name: "中津市 オイル交換",
      keyword: "中津市 オイル交換",
      description: "オイル交換できる店を探したい時の検索カード。",
      tags: ["オイル交換", "整備", "車", "メンテナンス"]
    },
    {
      id: 1214,
      name: "中津市 バッテリー交換",
      keyword: "中津市 バッテリー交換",
      description: "車のバッテリー交換を探したい時の検索カード。",
      tags: ["バッテリー交換", "整備", "車", "トラブル"]
    },
    {
      id: 1215,
      name: "中津市 レンタカー",
      keyword: "中津市 レンタカー",
      description: "中津市でレンタカーを探したい時の検索カード。",
      tags: ["レンタカー", "車", "移動", "中津市"]
    }
  ];

  if (typeof facilities !== "undefined") {
    carData.forEach(function (item) {
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
        sourceMemo: "検索カード。営業時間・料金・サービス内容はGoogleマップ等で要確認",
        tags: item.tags || ["車", "ガソリン", "中津市"],
        memo: "営業時間・料金・対応サービスは変わる場合があります。利用前にGoogleマップや公式情報で確認してください。",
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
