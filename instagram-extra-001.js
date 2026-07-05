/* ============================================================
   中津くらしナビ：公式Instagram確認済み店舗 追加版 001
   ファイル名：instagram-extra-001.js

   方針：
   ・既存掲載店舗には instagram を追加
   ・未掲載の実店舗は facilities に新規追加
   ・団体・観光協会など店舗ではないアカウントは今回は追加しない
   ・推測URLは禁止。確認済みURLだけ追加
   ============================================================ */

(function () {
  if (typeof facilities === "undefined" || !Array.isArray(facilities)) {
    console.warn("facilities 配列が見つかりません。instagram-extra-001.js を script.js の後に読み込んでください。");
    return;
  }

  const BASE_ID = 90001;

  function normalizeName(name) {
    return String(name || "")
      .replace(/\s+/g, " ")
      .replace(/[　]/g, " ")
      .replace(/[（）]/g, "")
      .trim()
      .toLowerCase();
  }

  function makeMapUrl(name) {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(name + " 中津市");
  }

  function createFacility(item, id) {
    return {
      id: id,
      name: item.name,
      category: item.category,
      description: item.description || "中津市周辺で利用候補になる実店舗です。詳細は公式情報で確認してください。",
      address: item.address || "大分県中津市周辺",
      phone: item.phone || "",
      hours: item.hours || "",
      closed: item.closed || "",
      mapUrl: item.mapUrl || makeMapUrl(item.name),
      officialUrl: item.officialUrl || "",
      instagram: item.instagram || "",
      sourceMemo: item.sourceMemo || "公式Instagram確認済み。住所・営業時間・電話番号は公式情報で要確認。",
      tags: Array.isArray(item.tags) ? item.tags : [],
      memo: item.memo || "行く前に営業時間・定休日・予約可否を公式InstagramやGoogleマップ等で確認してください。",
      verified: false
    };
  }

  const instagramShops = [
    {
      name: "焼き鳥 えにし",
      aliases: ["えにし"],
      category: "居酒屋・夜ご飯",
      description: "焼き鳥・居酒屋系の夜ご飯候補。",
      instagram: "https://www.instagram.com/yakitori.enishi/",
      tags: ["焼き鳥", "居酒屋", "夜ご飯", "飲み会", "Instagram確認済み"]
    },
    {
      name: "とり天専門店 あやとり",
      aliases: ["あやとり"],
      category: "定食・ランチ",
      description: "とり天・ランチ・テイクアウト利用の候補。",
      instagram: "https://www.instagram.com/ayatori_nakatsu/",
      tags: ["とり天", "ランチ", "テイクアウト", "中津グルメ", "Instagram確認済み"]
    },
    {
      name: "エルティカフェ 大分中津店",
      aliases: ["エルティカフェ", "LT CAFE"],
      category: "カフェ・喫茶店",
      description: "カフェ・軽食・休憩に使える候補。",
      instagram: "https://www.instagram.com/lt_cafe202109/",
      tags: ["カフェ", "休憩", "軽食", "スイーツ", "Instagram確認済み"]
    },
    {
      name: "道の駅なかつレストラン",
      aliases: ["道の駅なかつ レストラン"],
      category: "定食・ランチ",
      description: "道の駅なかつ内で食事・休憩に使える候補。",
      instagram: "https://www.instagram.com/michinoeki_nakatu_restaurant/",
      tags: ["道の駅", "ランチ", "休憩", "観光", "Instagram確認済み"]
    },
    {
      name: "からあげの鳥しん",
      aliases: ["鳥しん", "中津からあげ 鳥しん"],
      category: "定食・ランチ",
      description: "中津からあげ・テイクアウト・ランチ利用の候補。",
      instagram: "https://www.instagram.com/karaage.torishin/",
      tags: ["中津からあげ", "からあげ", "テイクアウト", "ランチ", "Instagram確認済み"]
    },
    {
      name: "中津からあげ もり山 万田本店",
      aliases: ["もり山", "からあげ もり山", "中津からあげ もり山"],
      category: "定食・ランチ",
      description: "中津からあげ・テイクアウト利用の候補。",
      instagram: "https://www.instagram.com/karaage.moriyama.mandahonten/",
      tags: ["中津からあげ", "からあげ", "テイクアウト", "ランチ", "Instagram確認済み"]
    },
    {
      name: "中津 彩鶏々",
      aliases: ["彩鶏々", "イロトリドリ", "中津 彩鶏々（イロトリドリ）"],
      category: "定食・ランチ",
      description: "中津からあげ・鶏料理・テイクアウト利用の候補。",
      instagram: "https://www.instagram.com/nakatsu_irotoridori/",
      tags: ["中津からあげ", "鶏料理", "テイクアウト", "ランチ", "Instagram確認済み"]
    },
    {
      name: "宝来軒 バイパス店",
      aliases: ["宝来軒バイパス店"],
      category: "ラーメン",
      description: "中津市でラーメンを食べたい時の候補。",
      instagram: "https://www.instagram.com/horaiken.official/",
      tags: ["ラーメン", "ランチ", "夜ご飯", "一人OK", "Instagram確認済み"]
    },
    {
      name: "宝来軒 中央町店",
      aliases: ["宝来軒中央町店"],
      category: "ラーメン",
      description: "中津市中央町方面のラーメン候補。",
      instagram: "https://www.instagram.com/houraiken.chuoumachi/",
      tags: ["ラーメン", "ランチ", "夜ご飯", "一人OK", "Instagram確認済み"]
    },
    {
      name: "一期一会 或",
      aliases: ["一期一会", "或"],
      category: "居酒屋・夜ご飯",
      description: "居酒屋・創作料理系の夜ご飯候補。",
      instagram: "https://www.instagram.com/aru__original/",
      tags: ["居酒屋", "夜ご飯", "飲み会", "創作料理", "Instagram確認済み"]
    },
    {
      name: "夢太麺 満祭",
      aliases: ["満祭", "夢太麺"],
      category: "ラーメン",
      description: "ラーメン・麺料理を食べたい時の候補。",
      instagram: "https://www.instagram.com/ramen_mansai/",
      tags: ["ラーメン", "ランチ", "夜ご飯", "一人OK", "Instagram確認済み"]
    },
    {
      name: "地魚屋台 ぜんちゃん",
      aliases: ["ぜんちゃん"],
      category: "居酒屋・夜ご飯",
      description: "地魚・居酒屋系の夜ご飯候補。",
      instagram: "https://www.instagram.com/zenchan.localfish/",
      tags: ["居酒屋", "地魚", "夜ご飯", "飲み会", "Instagram確認済み"]
    },
    {
      name: "笑顔のたね",
      aliases: [],
      category: "居酒屋・夜ご飯",
      description: "夜ご飯・飲み会利用の候補。",
      instagram: "https://www.instagram.com/egaonotane9526/",
      tags: ["夜ご飯", "居酒屋", "飲み会", "Instagram確認済み"]
    },
    {
      name: "和風味処 鬼太郎",
      aliases: ["鬼太郎"],
      category: "定食・ランチ",
      description: "和食・定食・ランチ利用の候補。",
      instagram: "https://www.instagram.com/kitalo.nakatsu/",
      tags: ["和食", "定食", "ランチ", "夜ご飯", "Instagram確認済み"]
    },
    {
      name: "HINODE TERRACE",
      aliases: ["ヒノデテラス", "HINODE TERRACE（ヒノデテラス）"],
      category: "カフェ・喫茶店",
      description: "カフェ・休憩・軽食に使える候補。",
      instagram: "https://www.instagram.com/hinodeterrace.nakatsu/",
      tags: ["カフェ", "休憩", "軽食", "ランチ", "Instagram確認済み"]
    },
    {
      name: "グランエスタード 大分中津店",
      aliases: ["グランエスタード"],
      category: "カフェ・喫茶店",
      description: "カフェ・軽食・休憩に使える候補。",
      instagram: "https://www.instagram.com/gran_estado/",
      tags: ["カフェ", "休憩", "軽食", "スイーツ", "Instagram確認済み"]
    },
    {
      name: "道カフェ 余菓の日",
      aliases: ["余菓の日"],
      category: "カフェ・喫茶店",
      description: "お菓子・カフェ利用に向いた候補。",
      instagram: "https://www.instagram.com/michi.cafe.yokanohi/",
      tags: ["カフェ", "スイーツ", "休憩", "お菓子", "Instagram確認済み"]
    },
    {
      name: "古民家カフェ花水木",
      aliases: ["花水木"],
      category: "カフェ・喫茶店",
      description: "古民家カフェ系で落ち着いて過ごしたい時の候補。",
      instagram: "https://www.instagram.com/hana.mizuki2024/",
      tags: ["カフェ", "古民家カフェ", "休憩", "ランチ", "Instagram確認済み"]
    },
    {
      name: "ふくとん",
      aliases: ["錦雲豚専門店 ふくとん", "ふくとん（錦雲豚専門店）"],
      category: "定食・ランチ",
      description: "錦雲豚を使った食事・ランチ利用の候補。",
      instagram: "https://www.instagram.com/fukuton1/",
      tags: ["ランチ", "定食", "豚肉", "夜ご飯", "Instagram確認済み"]
    },
    {
      name: "道の駅なかつ",
      aliases: [],
      category: "雨の日に行ける場所",
      description: "買い物・食事・休憩に使える観光施設候補。",
      instagram: "https://www.instagram.com/michinoeki_nakatsu/",
      tags: ["道の駅", "観光", "買い物", "休憩", "Instagram確認済み"]
    },
    {
      name: "八面山金色温泉",
      aliases: ["お宿こがね山荘", "八面山金色温泉（お宿こがね山荘）"],
      category: "雨の日に行ける場所",
      description: "温泉・宿泊・休憩の候補。",
      instagram: "https://www.instagram.com/kanairokogane555/",
      tags: ["温泉", "宿泊", "観光", "休憩", "Instagram確認済み"]
    }
  ];

  const updated = [];
  const added = [];
  let nextId = BASE_ID;

  function findExistingFacility(item) {
    const names = [item.name].concat(item.aliases || []).map(normalizeName);

    return facilities.find(function (facility) {
      const facilityName = normalizeName(facility.name);
      return names.some(function (name) {
        return facilityName === name || facilityName.includes(name) || name.includes(facilityName);
      });
    });
  }

  instagramShops.forEach(function (item) {
    const existing = findExistingFacility(item);

    if (existing) {
      existing.instagram = item.instagram;

      if (!existing.sourceMemo) {
        existing.sourceMemo = "公式Instagram確認済み。住所・営業時間・電話番号は公式情報で要確認。";
      }

      if (!Array.isArray(existing.tags)) {
        existing.tags = [];
      }

      item.tags.forEach(function (tag) {
        if (!existing.tags.includes(tag)) {
          existing.tags.push(tag);
        }
      });

      updated.push(existing.name);
      return;
    }

    facilities.push(createFacility(item, nextId));
    added.push(item.name);
    nextId += 1;
  });

  window.NAKATSU_INSTAGRAM_EXTRA_001_RESULT = {
    targetCount: instagramShops.length,
    updatedCount: updated.length,
    addedCount: added.length,
    updated: updated,
    added: added
  };

  console.log("instagram-extra-001 result:", window.NAKATSU_INSTAGRAM_EXTRA_001_RESULT);
})();
