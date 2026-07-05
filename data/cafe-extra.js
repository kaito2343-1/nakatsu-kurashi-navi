/* ============================================================
   中津くらしナビ：カフェ・喫茶店 追加版
   ファイル名：cafe-extra.js
   ============================================================ */

(function () {
  const categoryKey = "カフェ・喫茶店";

  if (typeof CATEGORIES !== "undefined") {
    const exists = CATEGORIES.some(function (c) { return c.key === categoryKey; });
    if (!exists) {
      CATEGORIES.push({ key: categoryKey, icon: "☕" });
    }
  }

  if (typeof CATEGORY_ICON_MAP !== "undefined") {
    CATEGORY_ICON_MAP[categoryKey] = "☕";
  }

  if (typeof CATEGORY_COLOR_INDEX !== "undefined" && typeof CATEGORIES !== "undefined") {
    CATEGORY_COLOR_INDEX[categoryKey] = CATEGORIES.findIndex(function (c) {
      return c.key === categoryKey;
    });
  }

  // カフェカテゴリ用の色を追加
  if (!document.getElementById("cafeExtraStyle")) {
    const style = document.createElement("style");
    style.id = "cafeExtraStyle";
    style.textContent = `
      .cat-13 { --cat-color: #7c3f16; --cat-color-soft: #fef3c7; } /* カフェ・喫茶店 */
    `;
    document.head.appendChild(style);
  }
  const cafeData = [
    {
      id: 601,
      name: "コメダ珈琲店 大分中津店",
      description: "モーニング・軽食・休憩に使いやすいカフェ候補。",
      instagram: "https://www.instagram.com/komeda_coffee_official/"
    },
    {
      id: 602,
      name: "古民家かふぇ こずえ",
      description: "古民家系の雰囲気でゆっくりしたい時のカフェ候補。"
    },

   
    {
      id: 603,
      name: "ツバメ珈琲舎",
      description: "コーヒーをゆっくり楽しみたい時の喫茶店・カフェ候補。"
    },
    {
      id: 604,
      name: "オーガニックカフェ シエル",
      description: "オーガニック系・体にやさしいご飯やカフェを探したい時の候補。"
    },
    {
      id: 605,
      name: "スターバックスコーヒー 中津店",
      description: "作業・休憩・待ち合わせに使いやすいカフェ候補。"
    },
    {
      id: 606,
      name: "312",
      description: "中津市周辺でカフェ・喫茶店を探したい時の候補。"
    },
    {
      id: 607,
      name: "道カフェ 余菓の日",
      description: "お菓子・カフェ利用に向いた候補。休憩や軽食に。"
    },
    {
      id: 608,
      name: "甘味処 禅海茶屋",
      description: "甘味・和スイーツ・休憩に使いやすい候補。"
    },
    {
      id: 609,
      name: "古民家カフェ花水木",
      description: "古民家カフェ系で落ち着いて過ごしたい時の候補。"
    },
    {
      id: 610,
      name: "ダイナースキッチン",
      description: "カフェ・ランチ・軽食を探したい時の候補。"
    },
    {
      id: 611,
      name: "八面山荘",
      description: "八面山方面で休憩・食事・カフェ利用を探したい時の候補。"
    },
    {
      id: 612,
      name: "武蔵屋菓寮",
      description: "甘味・和菓子・お茶系を楽しみたい時の候補。"
    },
    {
      id: 613,
      name: "丸山ヒルズ",
      description: "中津市周辺でカフェ・休憩スポットを探したい時の候補。"
    },
    {
      id: 614,
      name: "グランエスタード 大分中津店",
      description: "カフェ・軽食・休憩に使える候補。"
    },
    {
      id: 615,
      name: "ワールドコーヒーオークラ",
      description: "喫茶店・コーヒーを楽しみたい時の候補。"
    },
    {
      id: 616,
      name: "季豆なカフェ",
      description: "中津市周辺でカフェ・ランチを探したい時の候補。"
    },
    {
      id: 617,
      name: "モンシェリー",
      description: "喫茶店・カフェ利用に使える候補。"
    },
    {
      id: 618,
      name: "こうひいや",
      description: "コーヒー・喫茶店を探したい時の候補。"
    },
    {
      id: 619,
      name: "HINODE TERRACE",
      description: "中津市周辺でカフェ・休憩・軽食に使える候補。"
    },
    {
      id: 620,
      name: "ひのでグリル",
      description: "カフェ・グリル・ランチ利用を探したい時の候補。"
    }
  ];

  if (typeof facilities !== "undefined") {
    cafeData.forEach(function (item) {
      const facility = {
        id: item.id,
        name: item.name,
        category: categoryKey,
        description: item.description,
        address: "大分県中津市周辺",
        phone: "",
        hours: "",
        closed: "",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(item.name + " 中津市"),
        officialUrl: "",
instagram: item.instagram || "",
sourceMemo: "2026年7月時点の追加候補。営業時間・住所・定休日はGoogleマップ等で要確認",
        tags: ["カフェ", "喫茶店", "中津市", "ランチ", "休憩", "スイーツ"],
        memo: "営業時間・定休日・料金・閉店情報は変わる場合があります。行く前にGoogleマップや公式情報で確認してください。",
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
