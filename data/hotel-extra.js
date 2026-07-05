/* ============================================================
   中津くらしナビ：ホテル・ネットカフェ 追加版
   ファイル名：hotel-extra.js
   ============================================================ */

(function () {
  const categoryKey = "ホテル・ネットカフェ";

  if (typeof CATEGORIES !== "undefined") {
    const exists = CATEGORIES.some(function (c) { return c.key === categoryKey; });
    if (!exists) {
      CATEGORIES.push({ key: categoryKey, icon: "🏨" });
    }
  }

  if (typeof CATEGORY_ICON_MAP !== "undefined") {
    CATEGORY_ICON_MAP[categoryKey] = "🏨";
  }

  if (typeof CATEGORY_COLOR_INDEX !== "undefined" && typeof CATEGORIES !== "undefined") {
    CATEGORY_COLOR_INDEX[categoryKey] = CATEGORIES.findIndex(function (c) {
      return c.key === categoryKey;
    });
  }

  // ホテル・ネットカフェカテゴリ用の色を追加
  if (!document.getElementById("hotelExtraStyle")) {
    const style = document.createElement("style");
    style.id = "hotelExtraStyle";
    style.textContent = `
      .cat-17 { --cat-color: #4f46e5; --cat-color-soft: #e0e7ff; } /* ホテル・ネットカフェ */
    `;
    document.head.appendChild(style);
  }

  const hotelData = [
    {
      id: 1001,
      name: "中津駅 ホテル",
      keyword: "中津駅 ホテル",
      description: "中津駅周辺でホテルをまとめて探したい時の検索カード。",
      tags: ["ホテル", "中津駅", "宿泊", "出張"]
    },
    {
      id: 1002,
      name: "中津市 ビジネスホテル",
      keyword: "中津市 ビジネスホテル",
      description: "出張・仕事・一人利用向けのビジネスホテルを探したい時に。",
      tags: ["ビジネスホテル", "出張", "宿泊", "中津市"]
    },
    {
      id: 1003,
      name: "中津市 安いホテル",
      keyword: "中津市 安いホテル",
      description: "なるべく安く泊まれるホテルを探したい時の検索カード。",
      tags: ["安いホテル", "宿泊", "節約", "中津市"]
    },
    {
      id: 1004,
      name: "中津市 駐車場あり ホテル",
      keyword: "中津市 駐車場あり ホテル",
      description: "車で行きやすいホテルを探したい時の検索カード。",
      tags: ["ホテル", "駐車場", "車", "宿泊"]
    },
    {
      id: 1005,
      name: "東横INN 大分中津駅前",
      keyword: "東横INN 大分中津駅前",
      description: "中津駅前で宿泊先を探したい時のホテル候補。",
      tags: ["ホテル", "中津駅", "宿泊", "ビジネスホテル"]
    },
    {
      id: 1006,
      name: "ホテルルートイン中津駅前",
      keyword: "ホテルルートイン中津駅前",
      description: "中津駅周辺でビジネスホテルを探したい時の候補。",
      tags: ["ホテル", "ルートイン", "宿泊", "出張"]
    },
    {
      id: 1007,
      name: "グランプラザ中津ホテル",
      keyword: "グランプラザ中津ホテル",
      description: "中津市中心部周辺でホテルを探したい時の候補。",
      tags: ["ホテル", "宿泊", "中津市", "出張"]
    },
    {
      id: 1008,
      name: "スーパーホテル 大分・中津駅前",
      keyword: "スーパーホテル 大分 中津駅前",
      description: "中津駅周辺で宿泊・出張用ホテルを探したい時の候補。",
      tags: ["ホテル", "中津駅", "宿泊", "ビジネスホテル"]
    },
    {
      id: 1009,
      name: "中津市 ネットカフェ",
      keyword: "中津市 ネットカフェ",
      description: "休憩・作業・仮眠に使えるネットカフェを探したい時の検索カード。",
      tags: ["ネットカフェ", "休憩", "作業", "仮眠"]
    },
    {
      id: 1010,
      name: "快活CLUB 中津",
      keyword: "快活CLUB 中津",
      description: "ネットカフェ・作業・休憩・仮眠を探したい時の候補。",
      tags: ["快活CLUB", "ネットカフェ", "休憩", "作業"]
    }
  ];

  if (typeof facilities !== "undefined") {
    hotelData.forEach(function (item) {
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
        sourceMemo: "検索カード。料金・空室・営業時間・店舗情報は公式情報やGoogleマップ等で要確認",
        tags: item.tags || ["ホテル", "ネットカフェ", "中津市", "宿泊"],
        memo: "料金・空室・営業時間・閉店情報は変わる場合があります。利用前にGoogleマップや公式情報で確認してください。",
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
