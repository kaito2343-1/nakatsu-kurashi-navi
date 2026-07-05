/* ============================================================
   中津くらしナビ：中津市 チェーンご飯・弁当・深夜ご飯 追加データ002
   修正版
   ・やよい軒/王将系など、中津店が怪しいものは除外
   ・資さんうどんは追加
   ・24時間/深夜系は「表示あり（要確認）」で安全運用
   ============================================================ */

(function () {
  const CATEGORY_DEFS = [
    { key: "安いご飯", icon: "🍚" },
    { key: "定食・ランチ", icon: "🍱" },
    { key: "弁当・惣菜", icon: "🍱" }
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

  /*
    前回ミス対策：
    もし古い版で入っていた場合、この名前は画面から消す
  */
  const removeNames = [
    "やよい軒 中津店",
    "餃子の王将 中津店",
    "大阪王将 中津店",
    "おべんとうのヒライ 中津店"
  ];

  const extraFoods002 = [
    {
      name: "資さんうどん 中津店",
      category: "安いご飯",
      description: "うどん・丼・ぼた餅などを食べたい時の候補。深夜・早朝のご飯探しにも使いやすい店舗。",
      address: "",
      phone: "",
      hours: "24時間営業表示あり（要確認）",
      closed: "",
      mapUrl: mapSearch("資さんうどん 中津店"),
      officialUrl: "https://www.sukesanudon.com/",
      sourceMemo: "中津市内の実在店舗として追加。営業時間は変更される場合があるため来店前に要確認",
      tags: ["うどん", "丼", "ぼた餅", "安いご飯", "24時間", "深夜", "早朝", "一人飯", "夜ご飯"],
      memo: "24時間営業表示がある場合でも、臨時休業・時短営業の可能性があります。行く前にGoogleマップか公式情報で確認してください。",
      verified: false
    },
    {
      name: "すき家 213号中津店",
      category: "安いご飯",
      description: "牛丼・カレー・定食系を手早く食べたい時の候補。一人飯・深夜ご飯にも使いやすいチェーン店。",
      address: "",
      phone: "",
      hours: "24時間営業表示あり（要確認）",
      closed: "",
      mapUrl: mapSearch("すき家 213号中津店"),
      officialUrl: "https://www.sukiya.jp/",
      sourceMemo: "中津市内の実在店舗として追加。営業時間は公式店舗検索またはGoogleマップで要確認",
      tags: ["牛丼", "カレー", "定食", "安いご飯", "24時間", "深夜", "早朝", "一人飯", "夜ご飯"],
      memo: "24時間営業表示がある場合でも、店舗事情で変わることがあります。行く前に確認してください。",
      verified: false
    },
    {
      name: "吉野家 213号線中津店",
      category: "安いご飯",
      description: "牛丼・定食を手早く食べたい時の候補。昼ご飯・夜ご飯・一人飯に使いやすいチェーン店。",
      address: "",
      phone: "",
      hours: "営業時間は要確認",
      closed: "",
      mapUrl: mapSearch("吉野家 213号線中津店"),
      officialUrl: "https://www.yoshinoya.com/",
      sourceMemo: "中津市内の実在店舗として追加。営業時間は公式店舗検索またはGoogleマップで要確認",
      tags: ["牛丼", "定食", "安いご飯", "一人飯", "夜ご飯", "深夜"],
      memo: "営業時間・メニューは変わる場合があります。行く前に確認してください。",
      verified: false
    },
    {
      name: "マクドナルド 中津店",
      category: "安いご飯",
      description: "ハンバーガー・ポテト・軽食を食べたい時の候補。昼ご飯・夜ご飯・ドライブ中にも使いやすい店舗。",
      address: "",
      phone: "",
      hours: "営業時間は要確認",
      closed: "",
      mapUrl: mapSearch("マクドナルド 中津店"),
      officialUrl: "https://www.mcdonalds.co.jp/",
      sourceMemo: "中津市内の実在店舗として追加。営業時間は公式店舗検索またはGoogleマップで要確認",
      tags: ["ハンバーガー", "ポテト", "安いご飯", "ランチ", "夜ご飯", "ドライブ", "モバイルオーダー"],
      memo: "営業時間・モバイルオーダー対応は店舗情報で確認してください。",
      verified: false
    },
    {
      name: "モスバーガー 中津店",
      category: "安いご飯",
      description: "ハンバーガー・軽食を食べたい時の候補。ランチ・テイクアウトにも使いやすい店舗。",
      address: "",
      phone: "",
      hours: "営業時間は要確認",
      closed: "",
      mapUrl: mapSearch("モスバーガー 中津店"),
      officialUrl: "https://www.mos.jp/",
      sourceMemo: "中津市内の実在店舗として追加。営業時間は公式店舗検索またはGoogleマップで要確認",
      tags: ["ハンバーガー", "ランチ", "テイクアウト", "軽食", "夜ご飯"],
      memo: "営業時間・ネット注文対応は店舗情報で確認してください。",
      verified: false
    },
    {
      name: "ジョイフル 中津店",
      category: "定食・ランチ",
      description: "ファミレス系のご飯候補。ランチ・夜ご飯・家族利用・一人飯にも使いやすい店舗。",
      address: "",
      phone: "",
      hours: "営業時間は要確認",
      closed: "",
      mapUrl: mapSearch("ジョイフル 中津店"),
      officialUrl: "https://www.joyfull.co.jp/",
      sourceMemo: "中津市内の実在店舗として追加。営業時間は公式店舗検索またはGoogleマップで要確認",
      tags: ["ファミレス", "ランチ", "定食", "家族向き", "一人飯", "夜ご飯"],
      memo: "営業時間・モーニング・ランチ時間は店舗ごとに確認してください。",
      verified: false
    },
    {
      name: "ガスト 中津店",
      category: "定食・ランチ",
      description: "ファミレス系のランチ・夜ご飯候補。家族利用、作業、軽めの食事にも使いやすい店舗。",
      address: "",
      phone: "",
      hours: "営業時間は要確認",
      closed: "",
      mapUrl: mapSearch("ガスト 中津店"),
      officialUrl: "https://www.skylark.co.jp/gusto/",
      sourceMemo: "中津市内の実在店舗として追加。営業時間は公式店舗検索またはGoogleマップで要確認",
      tags: ["ファミレス", "ランチ", "家族向き", "一人飯", "駐車場", "夜ご飯"],
      memo: "営業時間・宅配・テイクアウト対応は公式情報で確認してください。",
      verified: false
    },
    {
      name: "丸亀製麺 中津店",
      category: "安いご飯",
      description: "うどんを安く早く食べたい時の候補。ランチ・一人飯・家族利用にも使いやすい店舗。",
      address: "",
      phone: "",
      hours: "営業時間は要確認",
      closed: "",
      mapUrl: mapSearch("丸亀製麺 中津店"),
      officialUrl: "https://www.marugame-seimen.com/",
      sourceMemo: "中津市内の実在店舗として追加。営業時間は公式店舗検索またはGoogleマップで要確認",
      tags: ["うどん", "安いご飯", "ランチ", "一人飯", "家族向き"],
      memo: "混雑時間や限定メニューは店舗情報で確認してください。",
      verified: false
    },
    {
      name: "CoCo壱番屋 中津店",
      category: "安いご飯",
      description: "カレーを食べたい時の候補。ランチ・夜ご飯・一人飯にも使いやすいチェーン店。",
      address: "",
      phone: "",
      hours: "営業時間は要確認",
      closed: "",
      mapUrl: mapSearch("CoCo壱番屋 中津店"),
      officialUrl: "https://www.ichibanya.co.jp/",
      sourceMemo: "中津市内の実在店舗として追加。営業時間は公式店舗検索またはGoogleマップで要確認",
      tags: ["カレー", "ランチ", "夜ご飯", "一人飯", "テイクアウト"],
      memo: "営業時間・宅配・テイクアウト対応は店舗情報で確認してください。",
      verified: false
    },
    {
      name: "ほっともっと 中津中央町店",
      category: "弁当・惣菜",
      description: "弁当・テイクアウトご飯の候補。昼ご飯・夜ご飯を手早く済ませたい時に便利な店舗。",
      address: "",
      phone: "",
      hours: "営業時間は要確認",
      closed: "",
      mapUrl: mapSearch("ほっともっと 中津中央町店"),
      officialUrl: "https://www.hottomotto.com/",
      sourceMemo: "中津市内の実在店舗として追加。営業時間は公式店舗検索またはGoogleマップで要確認",
      tags: ["弁当", "テイクアウト", "昼ご飯", "夜ご飯", "安いご飯"],
      memo: "ネット注文・営業時間は店舗ページで確認してください。",
      verified: false
    },
    {
      name: "ほっともっと 中津沖代店",
      category: "弁当・惣菜",
      description: "弁当・テイクアウトご飯の候補。職場飯・家ご飯・夜ご飯にも使いやすい店舗。",
      address: "",
      phone: "",
      hours: "営業時間は要確認",
      closed: "",
      mapUrl: mapSearch("ほっともっと 中津沖代店"),
      officialUrl: "https://www.hottomotto.com/",
      sourceMemo: "中津市内の実在店舗として追加。営業時間は公式店舗検索またはGoogleマップで要確認",
      tags: ["弁当", "テイクアウト", "昼ご飯", "夜ご飯", "駐車場"],
      memo: "ネット注文・営業時間は店舗ページで確認してください。",
      verified: false
    }
  ];

  if (typeof facilities !== "undefined" && Array.isArray(facilities)) {
    /*
      先に怪しい店舗を削除
    */
    for (let i = facilities.length - 1; i >= 0; i--) {
      const currentName = String(facilities[i].name || "").trim();
      if (removeNames.indexOf(currentName) !== -1) {
        facilities.splice(i, 1);
      }
    }

    /*
      既に同じ名前がある場合は上書き
      なければ新規追加
    */
    let nextId = facilities.reduce(function (max, facility) {
      const id = Number(facility.id) || 0;
      return Math.max(max, id);
    }, 0) + 1;

    extraFoods002.forEach(function (facility) {
      const sameIndex = facilities.findIndex(function (f) {
        return String(f.name || "").trim() === String(facility.name || "").trim();
      });

      if (sameIndex >= 0) {
        facilities[sameIndex] = Object.assign({}, facilities[sameIndex], facility, {
          id: facilities[sameIndex].id
        });
      } else {
        facilities.push(Object.assign({ id: nextId++ }, facility));
      }
    });
  }
})();
