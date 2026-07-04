/* ============================================================
   中津くらしナビ：実店舗だけ表示するフィルター
   ファイル名：real-only-extra.js
   ============================================================ */

(function () {
  const REAL_ONLY_CONFIG = {
    enabled: true
  };

  function normalizeText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function includesAny(text, words) {
    return words.some(function (word) {
      return text.includes(word);
    });
  }

  function startsWithAny(text, words) {
    return words.some(function (word) {
      return text.startsWith(word);
    });
  }

  // 実店舗として残したい名前のヒント
  const realNameHints = [
    "宝来軒", "辛麺屋", "しゅうちゃん", "らーめん", "魚介豚骨", "KOU-YU", "東京らーめん",
    "福寿宴", "武庵花福", "百八", "柳華園", "夢太麺", "とん平", "麺屋こころ", "翔天食堂", "博多金龍",

    "文楽", "扇八", "ぜんちゃん", "二十八萬石", "夢天までとどけ", "on the sly", "楽笑",
    "マルイチ", "達磨", "一期一会", "や台ずし", "たにあらし", "呑んた", "千一",
    "みつばち", "ほろほろ", "ブルちゃん", "ひばり", "あきない", "一合", "灯り家",
    "七輪鳥焼", "うろこ", "たっとり屋", "アリス", "笑顔のたね", "だいだい",

    "彩鶏々", "井上", "とんかつ豊後", "むら上食堂", "鳥しん", "鬼太郎", "ぶんごや",
    "もり山", "チキンハウス", "からいち", "ふくとん",

    "コメダ", "こずえ", "ツバメ珈琲舎", "シエル", "スターバックス", "312", "余菓の日",
    "禅海茶屋", "花水木", "ダイナースキッチン", "八面山荘", "武蔵屋菓寮",
    "丸山ヒルズ", "グランエスタード", "ワールドコーヒー", "季豆なカフェ",
    "モンシェリー", "こうひいや", "HINODE", "ひのでグリル",

    "焼肉テッチャン亭", "游楽亭", "焼肉 しゃぶしゃぶの楽", "炭火焼肉永田屋",
    "焼肉 かもん", "モモヤ", "銀乃しゃり", "伊藤課長", "永しん", "新八寿司",

    "ゆめタウン中津", "イオンモール三光", "マルショク", "ダイレックス", "トライアル",
    "ドラッグストアモリ", "コスモス",

    "東横INN", "ホテルルートイン", "グランプラザ中津ホテル", "スーパーホテル", "快活CLUB"
  ];

  // 検索カードとして消す名前のパターン
  const searchCardNamePrefixes = [
    "中津市 ",
    "中津駅 ",
    "大分県中津市 ",
    "中津市の",
    "中津駅周辺",
    "中津駅北口",
    "中津駅南口",
    "ゆめタウン中津周辺"
  ];

  const searchCardWords = [
    "検索カード",
    "まとめて探したい",
    "検索用",
    "探したい時の検索",
    "周辺の駐車場",
    "周辺の安い",
    "周辺の最大料金",
    "周辺の24時間",
    "周辺のコインパーキング",
    "まとめ検索"
  ];

  const vagueBrandOnlyNames = [
    "ENEOS 中津市",
    "apollostation 中津市",
    "コスモ石油 中津市",
    "セブンイレブン 中津市",
    "ローソン 中津市",
    "ファミリーマート 中津市"
  ];

  function isRealName(facility) {
    const name = normalizeText(facility.name);
    return realNameHints.some(function (hint) {
      return name.includes(hint);
    });
  }

  function isSearchCard(facility) {
    const name = normalizeText(facility.name);
    const category = normalizeText(facility.category);
    const description = normalizeText(facility.description);
    const sourceMemo = normalizeText(facility.sourceMemo);
    const address = normalizeText(facility.address);
    const text = [name, category, description, sourceMemo, address].join(" ");

    if (vagueBrandOnlyNames.includes(name)) return true;

    // 実店舗名っぽいものは残す
    if (isRealName(facility)) return false;

    // 検索カードと明記されているものは消す
    if (includesAny(text, searchCardWords)) return true;
    if (sourceMemo.includes("検索カード")) return true;

    // 「中津市 ランチ」「中津駅 ホテル」みたいな検索ワードは消す
    if (startsWithAny(name, searchCardNamePrefixes)) return true;

    // 住所がざっくりで、名前も検索語っぽいものは消す
    if (address === "大分県中津市周辺") {
      const keywordLike = [
        "駐車場", "スーパー", "コンビニ", "美容室", "床屋", "理容室",
        "ガソリンスタンド", "洗車", "車検", "タイヤ交換", "オイル交換",
        "バッテリー交換", "レンタカー", "ホテル", "ネットカフェ",
        "安い", "食べ放題", "個室", "ランチ", "食堂", "うどん",
        "カレー", "弁当", "回転寿司"
      ];

      if (includesAny(name, keywordLike) && !isRealName(facility)) {
        return true;
      }
    }

    return false;
  }

  function addRealShopTags(facility) {
    if (!Array.isArray(facility.tags)) {
      facility.tags = [];
    }

    function add(tag) {
      if (!facility.tags.includes(tag)) {
        facility.tags.push(tag);
      }
    }

    add("実店舗");

    const text = [
      facility.name || "",
      facility.category || "",
      facility.description || "",
      facility.tags.join(" ")
    ].join(" ");

    if (includesAny(text, ["からあげ", "鳥しん", "もり山", "チキンハウス", "からいち", "彩鶏々"])) {
      add("中津からあげ");
      add("テイクアウト");
      add("ランチ");
      add("安い");
    }

    if (includesAny(text, ["ラーメン", "らーめん", "宝来軒", "辛麺", "麺屋", "とん平"])) {
      add("一人OK");
      add("ランチ");
      add("夜ご飯");
    }

    if (includesAny(text, ["居酒屋", "焼き鳥", "大衆酒場", "バー", "グリル"])) {
      add("夜ご飯");
      add("飲み会");
      add("一人OK");
    }

    if (includesAny(text, ["カフェ", "珈琲", "コーヒー", "スターバックス", "コメダ", "喫茶"])) {
      add("休憩");
      add("一人OK");
    }

    if (includesAny(text, ["ホテル", "INN", "ルートイン", "スーパーホテル", "快活CLUB"])) {
      add("宿泊");
      add("駐車場あり");
    }

    if (includesAny(text, ["ゆめタウン", "イオン", "ダイレックス", "トライアル", "コスモス", "ドラッグストアモリ"])) {
      add("買い物");
      add("駐車場あり");
    }

    facility.tags = facility.tags.slice(0, 12);
  }

  function improveMissingFields(facility) {
    if (!facility.address || facility.address === "大分県中津市周辺") {
      facility.address = "住所確認中";
    }

    if (!facility.hours) {
      facility.hours = "営業時間確認中";
    }

    if (!facility.closed) {
      facility.closed = "定休日確認中";
    }

    if (!facility.sourceMemo) {
      facility.sourceMemo = "実店舗候補。営業時間・住所・電話番号は公式情報やGoogleマップ等で要確認";
    }

    if (facility.verified !== true) {
      facility.verified = false;
    }
  }

  function filterFacilities() {
    if (!REAL_ONLY_CONFIG.enabled) return;
    if (typeof facilities === "undefined" || !Array.isArray(facilities)) return;

    const before = facilities.length;

    for (let i = facilities.length - 1; i >= 0; i -= 1) {
      if (isSearchCard(facilities[i])) {
        facilities.splice(i, 1);
      }
    }

    facilities.forEach(function (facility) {
      addRealShopTags(facility);
      improveMissingFields(facility);
    });

    window.NAKATSU_REAL_ONLY_RESULT = {
      before: before,
      after: facilities.length,
      removed: before - facilities.length
    };

    console.log("中津くらしナビ real-only:", window.NAKATSU_REAL_ONLY_RESULT);
  }

  filterFacilities();
})();
