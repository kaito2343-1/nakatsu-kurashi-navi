/* ============================================================
   中津くらしナビ：公式Instagram確認済み店舗 追加版 002
   ファイル名：instagram-extra-002.js

   使い方：
   ・次に追加する店舗は instagramShops に追加する
   ・店舗専用、または中津店専用のInstagramだけ入れる
   ・推測URLは禁止
   ============================================================ */

(function () {
  if (typeof facilities === "undefined" || !Array.isArray(facilities)) {
    console.warn("facilities 配列が見つかりません。instagram-extra-002.js を script.js の後に読み込んでください。");
    return;
  }

  const BASE_ID = 91001;

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
    // 次回ここに追加
  ];

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

      if (!Array.isArray(existing.tags)) {
        existing.tags = [];
      }

      (item.tags || []).forEach(function (tag) {
        if (!existing.tags.includes(tag)) {
          existing.tags.push(tag);
        }
      });

      return;
    }

    facilities.push(createFacility(item, nextId));
    nextId += 1;
  });
})();
