/* ============================================================
   中津くらしナビ：公式URL補完ファイル
   ファイル名：official-url-extra.js

   目的：
   ・既存施設に公式ホームページURLを追加
   ・公式確認できた公共施設・観光施設は verified:true にする
   ・チェーン店は公式店舗検索ページを付ける
   ・safety-cleanup-extra.js で消えた公式確認済み施設は一部復活
   ============================================================ */

(function () {
  if (typeof facilities === "undefined" || !Array.isArray(facilities)) {
    console.warn("facilities 配列が見つかりません。official-url-extra.js を script.js の後に読み込んでください。");
    return;
  }

  const BASE_ID = 9001;

  function normalizeName(name) {
    return String(name || "")
      .replace(/[　]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function makeMapUrl(name) {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(name + " 中津市");
  }

  function addTag(facility, tag) {
    if (!facility.tags || !Array.isArray(facility.tags)) {
      facility.tags = [];
    }
    if (!facility.tags.includes(tag)) {
      facility.tags.push(tag);
    }
  }

  function matchesEntry(facility, entry) {
    const name = normalizeName(facility.name);

    if (entry.names && entry.names.some(function (n) {
      return normalizeName(n) === name;
    })) {
      return true;
    }

    if (entry.includes && entry.includes.some(function (word) {
      return facility.name && facility.name.includes(word);
    })) {
      return true;
    }

    return false;
  }

  function updateFacility(facility, entry) {
    facility.officialUrl = entry.officialUrl;

    if (entry.verified === true) {
      facility.verified = true;
      facility.sourceMemo = "公式ホームページで確認済み。";
      addTag(facility, "公式確認済み");
    } else {
      facility.sourceMemo = "公式ホームページURLを追加。店舗詳細・営業時間は公式側で確認してください。";
    }

    addTag(facility, "公式URLあり");

    if (!facility.mapUrl) {
      facility.mapUrl = makeMapUrl(facility.name);
    }

    if (!facility.memo) {
      facility.memo = "行く前に公式情報を確認してください。";
    }
  }

  function createFacility(entry, id) {
    const name = entry.names[0];

    return {
      id: id,
      name: name,
      category: entry.category || "雨の日に行ける場所",
      description: entry.description || "公式ホームページを確認できる施設です。",
      address: "",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: makeMapUrl(name),
      officialUrl: entry.officialUrl,
      sourceMemo: entry.verified ? "公式ホームページで確認済み。" : "公式ホームページURLを追加。詳細は公式側で確認してください。",
      tags: entry.verified ? ["公式URLあり", "公式確認済み"] : ["公式URLあり"],
      memo: "行く前に公式情報を確認してください。",
      verified: entry.verified === true
    };
  }

  const officialEntries = [
    /* ================= 公共・市役所系 ================= */
    {
      names: ["中津市役所"],
      category: "市役所・手続き",
      description: "中津市の公式ホームページ。",
      officialUrl: "https://www.city-nakatsu.jp/",
      verified: true,
      revive: true
    },
    {
      names: ["中津市消防本部", "中津消防署"],
      category: "市役所・手続き",
      description: "中津市消防本部の公式ページ。",
      officialUrl: "https://www.city-nakatsu.jp/soshiki/shobo_dept/",
      verified: true,
      revive: true
    },
    {
      names: ["中津市上下水道部"],
      category: "市役所・手続き",
      description: "中津市上下水道部の公式ページ。",
      officialUrl: "https://www.city-nakatsu.jp/soshiki/jogesuido_bu/",
      verified: true,
      revive: true
    },
    {
      names: ["中津市教育委員会"],
      category: "市役所・手続き",
      description: "中津市教育委員会の公式ページ。",
      officialUrl: "https://www.city-nakatsu.jp/doc/2024092500031/",
      verified: true,
      revive: true
    },
    {
      names: ["中津市民病院", "中津市民病院 救急外来", "中津市民病院 健康管理センター"],
      category: "病院・歯医者",
      description: "中津市民病院の公式ホームページ。",
      officialUrl: "https://www.nakatsu-hosp.jp/",
      verified: true,
      revive: true
    },
    {
      names: ["小幡記念図書館", "中津市立図書館", "中津市民図書館 三光分館", "中津市民図書館 本耶馬渓分館"],
      category: "雨の日に行ける場所",
      description: "中津市立図書館の公式ページ。",
      officialUrl: "https://libwebsv.city-nakatsu.jp/",
      verified: true,
      revive: true
    },

    /* ================= 観光・公共施設 ================= */
    {
      names: ["中津市歴史博物館"],
      category: "雨の日に行ける場所",
      description: "中津市歴史博物館の公式ホームページ。",
      officialUrl: "https://nakahaku.jp/",
      verified: true,
      revive: true
    },
    {
      names: ["福澤諭吉旧居・福澤記念館"],
      category: "雨の日に行ける場所",
      description: "福澤諭吉旧居・福澤記念館の公式ホームページ。",
      officialUrl: "https://fukuzawakyukyo.com/",
      verified: true,
      revive: true
    },
    {
      names: ["道の駅なかつ"],
      category: "雨の日に行ける場所",
      description: "道の駅なかつの公式ホームページ。",
      officialUrl: "https://michinoeki-nakatsu.com/",
      verified: true,
      revive: true
    },
    {
      names: ["中津耶馬渓観光協会", "青の洞門", "羅漢寺", "深耶馬溪 一目八景", "耶馬溪橋", "耶馬溪サイクリングターミナル", "耶馬トピア"],
      category: "雨の日に行ける場所",
      description: "中津・耶馬渓エリアの観光情報公式サイト。",
      officialUrl: "https://nakatsuyaba.com/",
      verified: false,
      revive: false
    },
    {
      names: ["日本遺産 やばけい遊覧", "競秀峰", "猿飛千壺峡", "魔林峡"],
      category: "雨の日に行ける場所",
      description: "日本遺産やばけい遊覧の公式サイト。",
      officialUrl: "https://yabakei-yuran.jp/",
      verified: false,
      revive: false
    },

    /* ================= 大型商業施設 ================= */
    {
      names: ["ゆめタウン中津", "ゆめタウン中津 駐車場"],
      category: "スーパー・コンビニ",
      description: "ゆめタウン中津の公式店舗ページ。",
      officialUrl: "https://www.izumi.jp/tenpo/nakatsu",
      verified: true,
      revive: true
    },
    {
      names: ["イオンモール三光", "イオンモール三光 駐車場"],
      category: "スーパー・コンビニ",
      description: "イオンモール三光の公式ホームページ。",
      officialUrl: "https://sanko-aeonmall.com/",
      verified: true,
      revive: true
    },

    /* ================= 飲食チェーン・公式店舗検索 ================= */
    {
      includes: ["マクドナルド"],
      officialUrl: "https://map.mcdonalds.co.jp/",
      verified: false
    },
    {
      includes: ["モスバーガー"],
      officialUrl: "https://www.mos.jp/shop/",
      verified: false
    },
    {
      includes: ["ケンタッキーフライドチキン"],
      officialUrl: "https://search.kfc.co.jp/",
      verified: false
    },
    {
      includes: ["ミスタードーナツ"],
      officialUrl: "https://www.misterdonut.jp/shop_data/",
      verified: false
    },
    {
      includes: ["コメダ珈琲店"],
      officialUrl: "https://www.komeda.co.jp/shop/",
      verified: false
    },
    {
      includes: ["スターバックス"],
      officialUrl: "https://store.starbucks.co.jp/",
      verified: false
    },
    {
      includes: ["リンガーハット"],
      officialUrl: "https://shop.ringerhut.jp/",
      verified: false
    },
    {
      includes: ["吉野家"],
      officialUrl: "https://stores.yoshinoya.com/",
      verified: false
    },
    {
      includes: ["すき家"],
      officialUrl: "https://maps.sukiya.jp/",
      verified: false
    },
    {
      includes: ["かつや"],
      officialUrl: "https://shop.arclandservice.co.jp/ae-shop/spot/list?category=01",
      verified: false
    },
    {
      includes: ["丸亀製麺"],
      officialUrl: "https://stores.marugame.com/",
      verified: false
    },
    {
      includes: ["資さんうどん"],
      officialUrl: "https://www.sukesanudon.com/shop/",
      verified: false
    },
    {
      includes: ["CoCo壱番屋"],
      officialUrl: "https://tenpo.ichibanya.co.jp/",
      verified: false
    },
    {
      includes: ["牛角"],
      officialUrl: "https://www.gyukaku.ne.jp/shop/",
      verified: false
    },
    {
      includes: ["焼肉きんぐ"],
      officialUrl: "https://www.yakiniku-king.jp/shop/",
      verified: false
    },
    {
      includes: ["くら寿司"],
      officialUrl: "https://shop.kurasushi.co.jp/",
      verified: false
    },
    {
      includes: ["スシロー"],
      officialUrl: "https://www.akindo-sushiro.co.jp/shop/",
      verified: false
    },
    {
      includes: ["はま寿司"],
      officialUrl: "https://maps.hama-sushi.co.jp/",
      verified: false
    },
    {
      includes: ["シャトレーゼ"],
      officialUrl: "https://www.chateraise.co.jp/shop/",
      verified: false
    },

    /* ================= スーパー・買い物・家電 ================= */
    {
      includes: ["スーパーセンタートライアル", "トライアル"],
      officialUrl: "https://www.trial-net.co.jp/shops/",
      verified: false
    },
    {
      includes: ["ダイレックス"],
      officialUrl: "https://www.ds-direx.co.jp/list/",
      verified: false
    },
    {
      includes: ["サンリブ", "マルショク"],
      officialUrl: "https://www.sunlive.co.jp/shop/",
      verified: false
    },
    {
      includes: ["ホームプラザナフコ", "ナフコ"],
      officialUrl: "https://www.nafco.life/hc/store/",
      verified: false
    },
    {
      includes: ["グッデイ"],
      officialUrl: "https://gooday.co.jp/shop/",
      verified: false
    },
    {
      includes: ["ヤマダデンキ"],
      officialUrl: "https://www.yamada-denki.jp/store/",
      verified: false
    },
    {
      includes: ["ケーズデンキ"],
      officialUrl: "https://www.ksdenki.com/shop/",
      verified: false
    },
    {
      includes: ["エディオン"],
      officialUrl: "https://search.edion.co.jp/e_store/",
      verified: false
    },
    {
      includes: ["ダイソー"],
      officialUrl: "https://www.daiso-sangyo.co.jp/shop",
      verified: false
    },
    {
      includes: ["セリア"],
      officialUrl: "https://www.seria-group.com/shop/",
      verified: false
    },
    {
      includes: ["しまむら"],
      officialUrl: "https://www.shimamura.gr.jp/shop/",
      verified: false
    },
    {
      includes: ["アベイル"],
      officialUrl: "https://www.shimamura.gr.jp/shop/avail/",
      verified: false
    },
    {
      includes: ["ユニクロ"],
      officialUrl: "https://www.uniqlo.com/jp/ja/shop",
      verified: false
    },
    {
      includes: ["西松屋"],
      officialUrl: "https://www.24028.jp/tenpo/",
      verified: false
    },
    {
      includes: ["ワークマン"],
      officialUrl: "https://www.workman.co.jp/store",
      verified: false
    },

    /* ================= 薬局・ドラッグストア ================= */
    {
      includes: ["ディスカウントドラッグコスモス", "コスモス"],
      officialUrl: "https://www.cosmospc.co.jp/shop/",
      verified: false
    },
    {
      includes: ["ドラッグストアモリ"],
      officialUrl: "https://www.doramori.co.jp/store/",
      verified: false
    },
    {
      includes: ["サンドラッグ"],
      officialUrl: "https://www.sundrug.co.jp/store",
      verified: false
    },
    {
      includes: ["ドラッグイレブン"],
      officialUrl: "https://www.drugeleven.com/shops/",
      verified: false
    },

    /* ================= 車・レンタカー ================= */
    {
      includes: ["オートバックス"],
      officialUrl: "https://www.autobacs.com/store",
      verified: false
    },
    {
      includes: ["イエローハット"],
      officialUrl: "https://www.yellowhat.jp/yellowhat/store/",
      verified: false
    },
    {
      includes: ["タイヤ館"],
      officialUrl: "https://www.taiyakan.co.jp/shop/",
      verified: false
    },
    {
      includes: ["トヨタレンタカー"],
      officialUrl: "https://rent.toyota.co.jp/",
      verified: false
    },
    {
      includes: ["オリックスレンタカー"],
      officialUrl: "https://car.orix.co.jp/",
      verified: false
    },
    {
      includes: ["ニッポンレンタカー"],
      officialUrl: "https://www.nipponrentacar.co.jp/",
      verified: false
    },
    {
      includes: ["大分ダイハツ販売"],
      officialUrl: "https://oita.daihatsu-dealer.jp/",
      verified: false
    },
    {
      includes: ["Honda Cars 大分"],
      officialUrl: "https://www.hondacars-oita.co.jp/",
      verified: false
    },
    {
      includes: ["ネッツトヨタ大分"],
      officialUrl: "https://www.netz-oita.co.jp/",
      verified: false
    },
    {
      includes: ["トヨタカローラ大分"],
      officialUrl: "https://www.toyota-corolla-oita.co.jp/",
      verified: false
    },

    /* ================= ホテル・ネットカフェ ================= */
    {
      includes: ["東横INN"],
      officialUrl: "https://www.toyoko-inn.com/",
      verified: false
    },
    {
      includes: ["ホテルルートイン"],
      officialUrl: "https://www.route-inn.co.jp/",
      verified: false
    },
    {
      includes: ["スーパーホテル"],
      officialUrl: "https://www.superhotel.co.jp/",
      verified: false
    },
    {
      includes: ["HOTEL AZ"],
      officialUrl: "https://www.az-hotel.com/",
      verified: false
    },
    {
      includes: ["快活CLUB"],
      officialUrl: "https://www.kaikatsu.jp/shop/",
      verified: false
    },

    /* ================= 銀行・郵便局 ================= */
    {
      includes: ["郵便局"],
      officialUrl: "https://map.japanpost.jp/",
      verified: false
    },
    {
      includes: ["大分銀行"],
      officialUrl: "https://www.oitabank.co.jp/branch/",
      verified: false
    },
    {
      includes: ["福岡銀行"],
      officialUrl: "https://www.fukuokabank.co.jp/atmsearch/",
      verified: false
    },
    {
      includes: ["西日本シティ銀行"],
      officialUrl: "https://www.ncbank.co.jp/atm/",
      verified: false
    },
    {
      includes: ["北九州銀行"],
      officialUrl: "https://www.kitakyushubank.co.jp/outline/tenpo/",
      verified: false
    },
    {
      includes: ["大分みらい信用金庫"],
      officialUrl: "https://www.oitamirai.co.jp/tenpo/",
      verified: false
    }
  ];

  let nextId = BASE_ID;
  const updated = [];
  const revived = [];
  const skippedRevive = [];

  officialEntries.forEach(function (entry) {
    let matched = false;

    facilities.forEach(function (facility) {
      if (matchesEntry(facility, entry)) {
        updateFacility(facility, entry);
        updated.push(facility.name);
        matched = true;
      }
    });

    if (!matched && entry.revive && entry.names && entry.names.length > 0) {
      const exists = facilities.some(function (facility) {
        return normalizeName(facility.name) === normalizeName(entry.names[0]);
      });

      if (exists) {
        skippedRevive.push(entry.names[0]);
        return;
      }

      const newFacility = createFacility(entry, nextId);
      facilities.push(newFacility);
      revived.push(newFacility.name);
      nextId += 1;
    }
  });

  window.NAKATSU_OFFICIAL_URL_RESULT = {
    updatedCount: updated.length,
    revivedCount: revived.length,
    skippedReviveCount: skippedRevive.length,
    updated: updated,
    revived: revived,
    skippedRevive: skippedRevive
  };

  console.log("official-url-extra result:", window.NAKATSU_OFFICIAL_URL_RESULT);
})();
