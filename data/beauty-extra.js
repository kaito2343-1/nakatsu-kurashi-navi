/* ============================================================
   中津くらしナビ：美容室・床屋 追加版
   ファイル名：beauty-extra.js
   ============================================================ */

(function () {
  const categoryKey = "美容室・床屋";

  if (typeof CATEGORIES !== "undefined") {
    const exists = CATEGORIES.some(function (c) { return c.key === categoryKey; });
    if (!exists) {
      CATEGORIES.push({ key: categoryKey, icon: "✂️" });
    }
  }

  if (typeof CATEGORY_ICON_MAP !== "undefined") {
    CATEGORY_ICON_MAP[categoryKey] = "✂️";
  }

  if (typeof CATEGORY_COLOR_INDEX !== "undefined" && typeof CATEGORIES !== "undefined") {
    CATEGORY_COLOR_INDEX[categoryKey] = CATEGORIES.findIndex(function (c) {
      return c.key === categoryKey;
    });
  }

  // 美容室・床屋カテゴリ用の色を追加
  if (!document.getElementById("beautyExtraStyle")) {
    const style = document.createElement("style");
    style.id = "beautyExtraStyle";
    style.textContent = `
      .cat-18 { --cat-color: #be185d; --cat-color-soft: #fce7f3; } /* 美容室・床屋 */
    `;
    document.head.appendChild(style);
  }

  const beautyData = [
    {
      id: 1101,
      name: "中津市 美容室",
      keyword: "中津市 美容室",
      description: "中津市で美容室をまとめて探したい時の検索カード。",
      tags: ["美容室", "美容院", "カット", "中津市"]
    },
    {
      id: 1102,
      name: "中津駅 美容室",
      keyword: "中津駅 美容室",
      description: "中津駅周辺で美容室を探したい時の検索カード。",
      tags: ["美容室", "中津駅", "カット", "美容院"]
    },
    {
      id: 1103,
      name: "中津市 メンズカット",
      keyword: "中津市 メンズカット",
      description: "中津市でメンズカットができる店を探したい時の検索カード。",
      tags: ["メンズカット", "美容室", "床屋", "男性"]
    },
    {
      id: 1104,
      name: "中津市 床屋",
      keyword: "中津市 床屋",
      description: "中津市で床屋・理容室を探したい時の検索カード。",
      tags: ["床屋", "理容室", "カット", "男性"]
    },
    {
      id: 1105,
      name: "中津市 理容室",
      keyword: "中津市 理容室",
      description: "中津市で理容室を探したい時の検索カード。",
      tags: ["理容室", "床屋", "顔剃り", "カット"]
    },
    {
      id: 1106,
      name: "中津市 安い美容室",
      keyword: "中津市 安い美容室",
      description: "中津市で安くカットできる美容室を探したい時の検索カード。",
      tags: ["安い美容室", "カット", "節約", "美容院"]
    },
    {
      id: 1107,
      name: "中津市 カット専門店",
      keyword: "中津市 カット専門店",
      description: "短時間でカットしたい時のカット専門店検索カード。",
      tags: ["カット専門店", "カット", "時短", "安い"]
    },
    {
      id: 1108,
      name: "中津市 ヘアカラー",
      keyword: "中津市 ヘアカラー 美容室",
      description: "中津市でヘアカラーができる美容室を探したい時の検索カード。",
      tags: ["ヘアカラー", "美容室", "カラー", "美容院"]
    },
    {
      id: 1109,
      name: "中津市 パーマ",
      keyword: "中津市 パーマ 美容室",
      description: "中津市でパーマができる美容室を探したい時の検索カード。",
      tags: ["パーマ", "美容室", "ヘアスタイル", "美容院"]
    },
    {
      id: 1110,
      name: "中津市 縮毛矯正",
      keyword: "中津市 縮毛矯正 美容室",
      description: "中津市で縮毛矯正ができる美容室を探したい時の検索カード。",
      tags: ["縮毛矯正", "美容室", "髪質改善", "美容院"]
    },
    {
      id: 1111,
      name: "中津市 眉毛カット",
      keyword: "中津市 眉毛カット",
      description: "眉毛カット・眉毛整えを探したい時の検索カード。",
      tags: ["眉毛カット", "メンズ", "美容室", "身だしなみ"]
    },
    {
      id: 1112,
      name: "中津市 キッズカット",
      keyword: "中津市 キッズカット",
      description: "子どものカットができる美容室・理容室を探したい時の検索カード。",
      tags: ["キッズカット", "子ども", "美容室", "床屋"]
    },
    {
      id: 1113,
      name: "中津市 予約なし 美容室",
      keyword: "中津市 予約なし 美容室",
      description: "予約なしで行ける美容室を探したい時の検索カード。",
      tags: ["予約なし", "美容室", "カット", "当日"]
    },
    {
      id: 1114,
      name: "中津市 駐車場あり 美容室",
      keyword: "中津市 駐車場あり 美容室",
      description: "車で行きやすい美容室を探したい時の検索カード。",
      tags: ["美容室", "駐車場", "車", "カット"]
    },
    {
      id: 1115,
      name: "中津市 メンズ美容室",
      keyword: "中津市 メンズ美容室",
      description: "男性向けの美容室を探したい時の検索カード。",
      tags: ["メンズ美容室", "メンズカット", "男性", "美容室"]
    },
    {
      id: 1116,
      name: "中津市 白髪染め",
      keyword: "中津市 白髪染め 美容室",
      description: "白髪染めができる美容室を探したい時の検索カード。",
      tags: ["白髪染め", "カラー", "美容室", "ヘアカラー"]
    },
    {
      id: 1117,
      name: "中津市 ヘッドスパ",
      keyword: "中津市 ヘッドスパ",
      description: "ヘッドスパ・頭皮ケアができる店を探したい時の検索カード。",
      tags: ["ヘッドスパ", "頭皮ケア", "美容室", "リラックス"]
    },
    {
      id: 1118,
      name: "中津市 美容院",
      keyword: "中津市 美容院",
      description: "中津市で美容院をまとめて探したい時の検索カード。",
      tags: ["美容院", "美容室", "カット", "ヘアサロン"]
    },
    {
      id: 1119,
      name: "中津市 理髪店",
      keyword: "中津市 理髪店",
      description: "中津市で理髪店・床屋を探したい時の検索カード。",
      tags: ["理髪店", "床屋", "理容室", "カット"]
    },
    {
      id: 1120,
      name: "中津市 1000円カット",
      keyword: "中津市 1000円カット",
      description: "中津市で安いカット・短時間カットを探したい時の検索カード。",
      tags: ["1000円カット", "安い", "カット", "時短"]
    }
  ];

  if (typeof facilities !== "undefined") {
    beautyData.forEach(function (item) {
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
        sourceMemo: "検索カード。営業時間・料金・予約可否・店舗情報はGoogleマップ等で要確認",
        tags: item.tags || ["美容室", "床屋", "中津市", "カット"],
        memo: "営業時間・料金・予約可否・閉店情報は変わる場合があります。利用前にGoogleマップや公式情報で確認してください。",
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
