/* ============================================================
   中津くらしナビ：公式URL補完ファイル 第3弾
   ファイル名：official-url-extra-003.js

   目的：
   ・公共施設、行政、銀行、郵便局、チェーン店の公式URLを追加
   ・公式店舗検索URLも「公式URLあり」として扱う
   ・施設単体を公式ページで確認できるものだけ verified:true
   ・チェーンの店舗検索URLだけの場合は verified:false
   ・トップの表示を「公式確認済み」ではなく「公式URLあり」に近づける
   ============================================================ */

(function () {
  if (typeof facilities === "undefined" || !Array.isArray(facilities)) {
    console.warn("facilities 配列が見つかりません。official-url-extra-003.js を script.js の後に読み込んでください。");
    return;
  }

  const BASE_ID = 9401;

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

  function hasOfficialUrl(facility) {
    return facility.officialUrl && String(facility.officialUrl).trim() !== "";
  }

  function matchEntry(facility, entry) {
    const name = facility.name || "";
    const normalized = normalizeName(name);

    if (entry.names && entry.names.some(function (n) {
      return normalizeName(n) === normalized;
    })) {
      return true;
    }

    if (entry.includes && entry.includes.some(function (word) {
      return name.includes(word);
    })) {
      return true;
    }

    return false;
  }

  function updateFacility(facility, entry) {
    // すでに公式URLがある場合は、基本的に上書きしない
    // ただし exact:true のものだけは施設単体URLとして上書きOK
    if (!hasOfficialUrl(facility) || entry.exact === true) {
      facility.officialUrl = entry.officialUrl;
    }

    if (!facility.mapUrl) {
      facility.mapUrl = makeMapUrl(facility.name);
    }

    addTag(facility, "公式URLあり");

    if (entry.exact === true && entry.verified === true) {
      facility.verified = true;
      addTag(facility, "公式確認済み");
      facility.sourceMemo = "公式ホームページで確認済み。";
    } else {
      if (facility.verified !== true) {
        facility.verified = false;
      }
      addTag(facility, "公式店舗検索");
      facility.sourceMemo = "公式ホームページまたは公式店舗検索URLを追加。営業時間・住所は公式側で確認してください。";
    }

    facility.memo = "行く前に公式情報を確認してください。";
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
      sourceMemo: entry.exact && entry.verified ? "公式ホームページで確認済み。" : "公式ホームページまたは公式店舗検索URLを追加。",
      tags: entry.exact && entry.verified ? ["公式URLあり", "公式確認済み"] : ["公式URLあり", "公式店舗検索"],
      memo: "行く前に公式情報を確認してください。",
      verified: entry.exact === true && entry.verified === true
    };
  }

  const entries = [
    /* ================= 公共・行政：施設単体 or 公式系 ================= */
    {
      names: ["中津市役所"],
      category: "市役所・手続き",
      description: "中津市の公式ホームページ。",
      officialUrl: "https://www.city-nakatsu.jp/",
      exact: true,
      verified: true,
      revive: true
    },
    {
      names: ["中津市消防本部", "中津消防署"],
      category: "市役所・手続き",
      description: "中津市消防本部の公式ページ。",
      officialUrl: "https://www.city-nakatsu.jp/",
      exact: false,
      verified: false,
      revive: true
    },
    {
      names: ["中津市上下水道部"],
      category: "市役所・手続き",
      description: "中津市上下水道部の公式情報。",
      officialUrl: "https://www.city-nakatsu.jp/",
      exact: false,
      verified: false,
      revive: true
    },
    {
      names: ["中津市教育委員会"],
      category: "市役所・手続き",
      description: "中津市教育委員会の公式情報。",
      officialUrl: "https://www.city-nakatsu.jp/",
      exact: false,
      verified: false,
      revive: true
    },
    {
      names: ["中津市保健センター"],
      category: "市役所・手続き",
      description: "健康・保健関連の公共施設候補。",
      officialUrl: "https://www.city-nakatsu.jp/",
      exact: false,
      verified: false,
      revive: true
    },
    {
      names: ["中津警察署"],
      category: "市役所・手続き",
      description: "警察署・各種手続きの候補。緊急時は110番へ。",
      officialUrl: "https://www.pref.oita.jp/site/keisatu/",
      exact: false,
      verified: false,
      revive: true
    },
    {
      names: ["ハローワーク中津"],
      category: "市役所・手続き",
      description: "仕事探し・雇用保険手続きの候補。",
      officialUrl: "https://www.hellowork.mhlw.go.jp/",
      exact: false,
      verified: false,
      revive: true
    },
    {
      names: ["中津税務署"],
      category: "市役所・手続き",
      description: "税金・確定申告関連の手続き候補。",
      officialUrl: "https://www.nta.go.jp/about/organization/kumamoto/location/oita/nakatsu/index.htm",
      exact: true,
      verified: true,
      revive: true
    },
    {
      names: ["中津年金事務所"],
      category: "市役所・手続き",
      description: "年金関連の手続き候補。",
      officialUrl: "https://www.nenkin.go.jp/section/soudan/oita/",
      exact: false,
      verified: false,
      revive: true
    },
    {
      names: ["大分地方法務局 中津支局"],
      category: "市役所・手続き",
      description: "登記・証明などの手続き候補。",
      officialUrl: "https://houmukyoku.moj.go.jp/oita/",
      exact: false,
      verified: false,
      revive: true
    },
    {
      names: ["中津労働基準監督署"],
      category: "市役所・手続き",
      description: "労働相談・労災関連の手続き候補。",
      officialUrl: "https://jsite.mhlw.go.jp/oita-roudoukyoku/",
      exact: false,
      verified: false,
      revive: true
    },
    {
      names: ["中津簡易裁判所", "大分地方裁判所 中津支部"],
      category: "市役所・手続き",
      description: "裁判所関連の公共施設候補。",
      officialUrl: "https://www.courts.go.jp/oita/",
      exact: false,
      verified: false,
      revive: true
    },

    /* ================= 公共・相談先 ================= */
    {
      names: ["中津市社会福祉協議会"],
      category: "困った時の相談先",
      description: "福祉・生活相談の候補。",
      officialUrl: "https://www.nakatsu-shakyo.jp/",
      exact: false,
      verified: false,
      revive: true
    },
    {
      names: ["中津市消費生活センター"],
      category: "困った時の相談先",
      description: "消費トラブル相談の候補。",
      officialUrl: "https://www.city-nakatsu.jp/",
      exact: false,
      verified: false,
      revive: true
    },
    {
      names: ["中津市子育て支援センター"],
      category: "困った時の相談先",
      description: "子育て相談・支援の候補。",
      officialUrl: "https://www.city-nakatsu.jp/",
      exact: false,
      verified: false,
      revive: true
    },
    {
      names: ["中津市地域包括支援センター"],
      category: "困った時の相談先",
      description: "高齢者・介護相談の候補。",
      officialUrl: "https://www.city-nakatsu.jp/",
      exact: false,
      verified: false,
      revive: true
    },

    /* ================= 観光・文化：公式系 ================= */
    {
      names: ["中津市歴史博物館"],
      category: "雨の日に行ける場所",
      description: "中津市歴史博物館の公式ホームページ。",
      officialUrl: "https://nakahaku.jp/",
      exact: true,
      verified: true,
      revive: true
    },
    {
      names: ["福澤諭吉旧居・福澤記念館"],
      category: "雨の日に行ける場所",
      description: "福澤諭吉旧居・福澤記念館の公式ホームページ。",
      officialUrl: "https://fukuzawakyukyo.com/",
      exact: true,
      verified: true,
      revive: true
    },
    {
      names: ["道の駅なかつ"],
      category: "雨の日に行ける場所",
      description: "道の駅なかつの公式ホームページ。",
      officialUrl: "https://michinoeki-nakatsu.com/",
      exact: true,
      verified: true,
      revive: true
    },
    {
      names: ["中津耶馬渓観光協会", "青の洞門", "羅漢寺", "深耶馬溪 一目八景", "耶馬溪橋", "耶馬トピア", "耶馬溪サイクリングターミナル"],
      category: "雨の日に行ける場所",
      description: "中津・耶馬渓エリアの観光公式情報。",
      officialUrl: "https://nakatsuyaba.com/",
      exact: false,
      verified: false,
      revive: false
    },
    {
      names: ["日本遺産 やばけい遊覧", "競秀峰", "猿飛千壺峡", "魔林峡"],
      category: "雨の日に行ける場所",
      description: "日本遺産やばけい遊覧の公式サイト。",
      officialUrl: "https://yabakei-yuran.jp/",
      exact: false,
      verified: false,
      revive: false
    },

    /* ================= コンビニ ================= */
    {
      includes: ["セブン-イレブン"],
      officialUrl: "https://www.sej.co.jp/shop/",
      exact: false,
      verified: false
    },
    {
      includes: ["ローソン"],
      officialUrl: "https://www.e-map.ne.jp/p/lawson/",
      exact: false,
      verified: false
    },
    {
      includes: ["ファミリーマート"],
      officialUrl: "https://as.chizumaru.com/famima/",
      exact: false,
      verified: false
    },

    /* ================= 飲食チェーン ================= */
    {
      includes: ["ジョイフル"],
      officialUrl: "https://www.joyfull.co.jp/shop/",
      exact: false,
      verified: false
    },
    {
      includes: ["ガスト"],
      officialUrl: "https://store-info.skylark.co.jp/gusto/",
      exact: false,
      verified: false
    },
    {
      includes: ["井手ちゃんぽん"],
      officialUrl: "https://www.ide-chanpon.co.jp/",
      exact: false,
      verified: false
    },
    {
      includes: ["ウエスト"],
      officialUrl: "https://www.shop-west.jp/",
      exact: false,
      verified: false
    },
    {
      includes: ["どんどん亭"],
      officialUrl: "https://www.dondontei.com/",
      exact: false,
      verified: false
    },
    {
      includes: ["ほっともっと"],
      officialUrl: "https://shop.hottomotto.com/",
      exact: false,
      verified: false
    },
    {
      includes: ["ピザ・カリフォルニア"],
      officialUrl: "https://www.pizza-cali.net/",
      exact: false,
      verified: false
    },
    {
      includes: ["ドミノ・ピザ"],
      officialUrl: "https://www.dominos.jp/store-finder",
      exact: false,
      verified: false
    },
    {
      includes: ["魚民", "山内農場", "目利きの銀次", "白木屋", "笑笑"],
      officialUrl: "https://www.monteroza.co.jp/shop/",
      exact: false,
      verified: false
    },
    {
      includes: ["博多一番どり"],
      officialUrl: "https://www.ichibandori.com/",
      exact: false,
      verified: false
    },
    {
      includes: ["しゃぶしゃぶ温野菜"],
      officialUrl: "https://www.onyasai.com/",
      exact: false,
      verified: false
    },
    {
      includes: ["焼肉ウエスト"],
      officialUrl: "https://www.shop-west.jp/",
      exact: false,
      verified: false
    },
    {
      includes: ["焼肉なべしま"],
      officialUrl: "https://www.nabeshima-jp.com/",
      exact: false,
      verified: false
    },
    {
      includes: ["焼肉韓国苑"],
      officialUrl: "https://kankokuen.co.jp/",
      exact: false,
      verified: false
    },

    /* ================= カフェ・スイーツ ================= */
    {
      includes: ["シャトレーゼ"],
      officialUrl: "https://www.chateraise.co.jp/shop/",
      exact: false,
      verified: false
    },
    {
      includes: ["お菓子の菊家"],
      officialUrl: "https://www.kikuya-oita.net/",
      exact: false,
      verified: false
    },
    {
      includes: ["もち吉"],
      officialUrl: "https://www.mochikichi.co.jp/shop/",
      exact: false,
      verified: false
    },
    {
      includes: ["サーティワン", "31アイスクリーム"],
      officialUrl: "https://store.31ice.co.jp/",
      exact: false,
      verified: false
    },
    {
      includes: ["果汁工房果琳"],
      officialUrl: "https://k-karin.jp/shop/",
      exact: false,
      verified: false
    },

    /* ================= 買い物・生活用品 ================= */
    {
      includes: ["業務スーパー"],
      officialUrl: "https://www.gyomusuper.jp/shop/",
      exact: false,
      verified: false
    },
    {
      includes: ["トキハインダストリー"],
      officialUrl: "https://www.tokiwa-industry.co.jp/",
      exact: false,
      verified: false
    },
    {
      includes: ["明屋書店"],
      officialUrl: "https://www.haruya.co.jp/shop/",
      exact: false,
      verified: false
    },
    {
      includes: ["TSUTAYA"],
      officialUrl: "https://store-tsutaya.tsite.jp/storelocator.html",
      exact: false,
      verified: false
    },
    {
      includes: ["ゲオ"],
      officialUrl: "https://geo-online.co.jp/store/",
      exact: false,
      verified: false
    },
    {
      includes: ["ブックオフ"],
      officialUrl: "https://www.bookoff.co.jp/shop/",
      exact: false,
      verified: false
    },
    {
      includes: ["ハードオフ", "オフハウス"],
      officialUrl: "https://www.hardoff.co.jp/shop/",
      exact: false,
      verified: false
    },
    {
      includes: ["スポーツデポ"],
      officialUrl: "https://store.alpen-group.jp/",
      exact: false,
      verified: false
    },
    {
      includes: ["コメリ"],
      officialUrl: "https://www.komeri.com/shop/",
      exact: false,
      verified: false
    },
    {
      includes: ["ニトリ"],
      officialUrl: "https://shop.nitori-net.jp/nitori/",
      exact: false,
      verified: false
    },

    /* ================= 美容・床屋・リラク ================= */
    {
      includes: ["QBハウス"],
      officialUrl: "https://www.qbhouse.co.jp/search/",
      exact: false,
      verified: false
    },
    {
      includes: ["IWASAKI", "ヘアースタジオ IWASAKI", "HAIR SALON IWASAKI"],
      officialUrl: "https://hkbn.co.jp/",
      exact: false,
      verified: false
    },
    {
      includes: ["美容プラージュ", "理容プラージュ"],
      officialUrl: "https://www.plage-bb.co.jp/",
      exact: false,
      verified: false
    },
    {
      includes: ["Agu hair"],
      officialUrl: "https://agu-hair.com/",
      exact: false,
      verified: false
    },
    {
      includes: ["RAY Field"],
      officialUrl: "https://rayfield.jp/",
      exact: false,
      verified: false
    },
    {
      includes: ["カットコムズ"],
      officialUrl: "https://www.cutcomz.jp/",
      exact: false,
      verified: false
    },
    {
      includes: ["fufu"],
      officialUrl: "https://fufucolor.com/",
      exact: false,
      verified: false
    },
    {
      includes: ["ラフィネ"],
      officialUrl: "https://www.bodywork.co.jp/search/",
      exact: false,
      verified: false
    },
    {
      includes: ["りらくる"],
      officialUrl: "https://relxle.com/usr/shop/",
      exact: false,
      verified: false
    },

    /* ================= 銀行・郵便局 ================= */
    {
      includes: ["郵便局"],
      officialUrl: "https://map.japanpost.jp/",
      exact: false,
      verified: false
    },
    {
      includes: ["JAおおいた"],
      officialUrl: "https://www.jaoita.net/",
      exact: false,
      verified: false
    },
    {
      includes: ["九州労働金庫"],
      officialUrl: "https://kyusyu-rokin.com/",
      exact: false,
      verified: false
    },
    {
      includes: ["大分県信用組合"],
      officialUrl: "https://www.oita-kenshin.co.jp/",
      exact: false,
      verified: false
    },

    /* ================= 駅・交通 ================= */
    {
      names: ["JR中津駅", "JR東中津駅", "JR今津駅"],
      category: "雨の日に行ける場所",
      description: "JR九州の駅情報。",
      officialUrl: "https://www.jrkyushu.co.jp/railway/station/",
      exact: false,
      verified: false,
      revive: false
    },

    /* ================= ホテル・温泉 ================= */
    {
      includes: ["グランプラザ中津ホテル"],
      officialUrl: "https://www.grand-plaza.jp/",
      exact: false,
      verified: false
    },
    {
      includes: ["中津サンライズホテル"],
      officialUrl: "https://www.nakatsu-sunrise.com/",
      exact: false,
      verified: false
    },
    {
      includes: ["八面山金色温泉"],
      officialUrl: "https://kanairo.co.jp/",
      exact: false,
      verified: false
    }
  ];

  let nextId = BASE_ID;
  const updated = [];
  const revived = [];
  const skipped = [];

  entries.forEach(function (entry) {
    let matched = false;

    facilities.forEach(function (facility) {
      if (matchEntry(facility, entry)) {
        updateFacility(facility, entry);
        updated.push(facility.name);
        matched = true;
      }
    });

    if (!matched && entry.revive && entry.names && entry.names.length > 0) {
      const mainName = entry.names[0];
      const exists = facilities.some(function (facility) {
        return normalizeName(facility.name) === normalizeName(mainName);
      });

      if (exists) {
        skipped.push(mainName);
        return;
      }

      const newFacility = createFacility(entry, nextId);
      facilities.push(newFacility);
      revived.push(newFacility.name);
      nextId += 1;
    }
  });

  function updateHomeStatsToOfficialUrl() {
    const stats = document.querySelectorAll("#mergedHomeSection .merged-stat");
    if (!stats || stats.length < 3) return;

    const total = facilities.length;
    const officialUrlCount = facilities.filter(function (facility) {
      return facility.officialUrl && String(facility.officialUrl).trim() !== "";
    }).length;

    const noOfficialUrlCount = Math.max(0, total - officialUrlCount);

    const secondStrong = stats[1].querySelector("strong");
    const secondSpan = stats[1].querySelector("span");
    const thirdStrong = stats[2].querySelector("strong");
    const thirdSpan = stats[2].querySelector("span");

    if (secondStrong) secondStrong.textContent = officialUrlCount;
    if (secondSpan) secondSpan.textContent = "公式URLあり";

    if (thirdStrong) thirdStrong.textContent = noOfficialUrlCount;
    if (thirdSpan) thirdSpan.textContent = "URL未確認";
  }

  window.NAKATSU_OFFICIAL_URL_003_RESULT = {
    updatedCount: updated.length,
    revivedCount: revived.length,
    skippedCount: skipped.length,
    updated: updated,
    revived: revived,
    skipped: skipped
  };

  console.log("official-url-extra-003 result:", window.NAKATSU_OFFICIAL_URL_003_RESULT);

  setTimeout(updateHomeStatsToOfficialUrl, 800);
  setTimeout(updateHomeStatsToOfficialUrl, 1500);
  setTimeout(updateHomeStatsToOfficialUrl, 2500);
})();
