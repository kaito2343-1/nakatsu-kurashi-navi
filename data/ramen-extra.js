/* ============================================================
   中津くらしナビ：大分県中津市 ラーメン追加データ 20件
   ============================================================ */

(function () {
  const categoryKey = "ラーメン";

  if (typeof CATEGORIES !== "undefined") {
    const exists = CATEGORIES.some(function (c) { return c.key === categoryKey; });
    if (!exists) {
      CATEGORIES.push({ key: categoryKey, icon: "🍜" });
    }
  }

  if (typeof CATEGORY_ICON_MAP !== "undefined") {
    CATEGORY_ICON_MAP[categoryKey] = "🍜";
  }

  if (typeof CATEGORY_COLOR_INDEX !== "undefined" && typeof CATEGORIES !== "undefined") {
    CATEGORY_COLOR_INDEX[categoryKey] = CATEGORIES.findIndex(function (c) {
      return c.key === categoryKey;
    });
  }

  const ramenData = [
    {
      id: 301,
      name: "辛麺屋 桝元 中津店",
      address: "大分県中津市牛神1-1-9",
      description: "中津市牛神にある辛麺系ラーメン店。辛いラーメンを食べたい時の候補。",
      tags: ["ラーメン", "辛麺", "中津市", "牛神"]
    },
    {
      id: 302,
      name: "しゅうちゃんラーメン",
      address: "大分県中津市大字犬丸2107-2",
      description: "中津市犬丸にあるラーメン店。豚骨ラーメン系の候補。",
      tags: ["ラーメン", "豚骨", "中津市", "犬丸"]
    },
    {
      id: 303,
      name: "らーめん五九○ 中津店",
      address: "大分県中津市大字蛎瀬860-1",
      description: "中津市蛎瀬にあるラーメン店。気軽なラーメン候補。",
      tags: ["ラーメン", "中津市", "蛎瀬", "安いご飯"]
    },
    {
      id: 304,
      name: "魚介豚骨らーめん 刻",
      address: "大分県中津市島田617-1",
      description: "中津市島田にある魚介豚骨系ラーメン店。",
      tags: ["ラーメン", "魚介豚骨", "中津駅", "島田"]
    },
    {
      id: 305,
      name: "博多豚骨の向こう側 KOU-YU",
      address: "大分県中津市一ツ松226-1 前田アパート東 1F",
      description: "中津市一ツ松にある博多豚骨系ラーメン店。",
      tags: ["ラーメン", "博多豚骨", "中津市", "一ツ松"]
    },
    {
      id: 306,
      name: "宝来軒 本店",
      address: "大分県中津市日ノ出町2",
      description: "中津ラーメンの有名店。中津駅周辺でラーメンを探す時の定番候補。",
      tags: ["ラーメン", "中津ラーメン", "中津駅", "日ノ出町", "老舗"]
    },
    {
      id: 307,
      name: "東京らーめん食堂",
      address: "大分県中津市大字上如水1853",
      description: "中津市上如水にあるラーメン・食堂系のお店。",
      tags: ["ラーメン", "食堂", "醤油ラーメン", "上如水"]
    },
    {
      id: 308,
      name: "福寿宴中国料理店",
      address: "大分県中津市上宮永955-22",
      description: "中津市上宮永にある中華料理店。ラーメン・中華系の候補。",
      tags: ["ラーメン", "中華料理", "中津市", "上宮永"]
    },
    {
      id: 309,
      name: "宝来軒 バイパス店",
      address: "大分県中津市大字加来1548-1",
      description: "中津市加来にある宝来軒のバイパス店。",
      tags: ["ラーメン", "中津ラーメン", "宝来軒", "加来"]
    },
    {
      id: 310,
      name: "武庵花福",
      address: "大分県中津市大字蛎瀬592-1",
      description: "中津市蛎瀬にあるラーメン・肉料理・居酒屋系のお店。",
      tags: ["ラーメン", "肉料理", "居酒屋", "蛎瀬"]
    },
    {
      id: 311,
      name: "らーめん百八",
      address: "大分県中津市大貞字今井野322-18",
      description: "中津市大貞にあるラーメン店。",
      tags: ["ラーメン", "豚骨", "中津市", "大貞"]
    },
    {
      id: 312,
      name: "柳華園",
      address: "大分県中津市上宮永10-3",
      description: "中津市上宮永にある中華料理・食堂系のお店。ラーメン候補にも。",
      tags: ["ラーメン", "中華料理", "食堂", "上宮永"]
    },
    {
      id: 313,
      name: "夢太麺 満祭",
      address: "大分県中津市大字宮夫239-1",
      description: "中津市宮夫にあるラーメン店。二郎系ラーメン候補。",
      tags: ["ラーメン", "二郎系", "中津市", "宮夫"]
    },
    {
      id: 314,
      name: "宝来軒 中央町店",
      address: "大分県中津市中央町1-4-25",
      description: "中津市中央町にある宝来軒の店舗。",
      tags: ["ラーメン", "中津ラーメン", "宝来軒", "中央町"]
    },
    {
      id: 315,
      name: "長浜らーめんとん平 中津店",
      address: "大分県中津市大字島田217-3",
      description: "中津駅近くの長浜ラーメン系のお店。",
      tags: ["ラーメン", "長浜ラーメン", "中津駅", "島田"]
    },
    {
      id: 316,
      name: "麺屋こころ",
      address: "大分県中津市是則741-1",
      description: "中津市是則にあるラーメン・餃子系のお店。",
      tags: ["ラーメン", "餃子", "中津市", "是則"]
    },
    {
      id: 317,
      name: "翔天食堂",
      address: "大分県中津市大貞371-49 松喜第二ビル 1F",
      description: "中津市大貞にあるラーメン・食堂系のお店。",
      tags: ["ラーメン", "食堂", "中津市", "大貞"]
    },
    {
      id: 318,
      name: "宝来軒 産業道路店",
      address: "大分県中津市東浜985-1",
      description: "中津市東浜にある宝来軒の産業道路店。",
      tags: ["ラーメン", "中津ラーメン", "宝来軒", "東浜"]
    },
    {
      id: 319,
      name: "宝来軒 万田店",
      address: "大分県中津市大字万田612",
      description: "中津市万田にある宝来軒の店舗。ちゃんぽん候補にも。",
      tags: ["ラーメン", "ちゃんぽん", "宝来軒", "万田"]
    },
    {
      id: 320,
      name: "博多金龍 中津店",
      address: "大分県中津市沖代町1-281-1",
      description: "中津市沖代町にあるラーメン・餃子系のお店。",
      tags: ["ラーメン", "餃子", "中津市", "沖代町"]
    }
  ];

  if (typeof facilities !== "undefined") {
    ramenData.forEach(function (item) {
      const facility = {
        id: item.id,
        name: item.name,
        category: categoryKey,
        description: item.description,
        address: item.address,
        phone: "",
        hours: "",
        closed: "",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(item.name + " " + item.address),
        officialUrl: "",
        sourceMemo: "2026年7月 食べログの中津市ラーメン一覧を参考。営業時間・定休日・電話番号は要確認",
        tags: item.tags,
        memo: "営業時間・定休日・価格・閉店情報は変わる場合があります。行く前にGoogleマップや公式情報で確認してください。",
        verified: false
      };

      const existing = facilities.find(function (f) { return f.name === item.name; });
      if (existing) {
        Object.assign(existing, facility, { id: existing.id });
      } else {
        facilities.push(facility);
      }
    });
  }
})();
