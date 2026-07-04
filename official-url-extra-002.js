/* ============================================================
   中津くらしナビ：公式URL補完ファイル 第2弾
   ファイル名：official-url-extra-002.js

   目的：
   ・病院、歯医者、薬局に公式系URLを追加
   ・個別公式HPが未確認のものは、厚生労働省 医療情報ネットを入れる
   ・個別公式HPが既にあるものは上書きしない
   ・verified:true にはしない
   ============================================================ */

(function () {
  if (typeof facilities === "undefined" || !Array.isArray(facilities)) {
    console.warn("facilities 配列が見つかりません。official-url-extra-002.js を script.js の後に読み込んでください。");
    return;
  }

  const MEDICAL_INFO_NET_URL = "https://www.iryou.teikyouseido.mhlw.go.jp/";

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

  function isMedicalCategory(facility) {
    return facility.category === "病院・歯医者" || facility.category === "薬局";
  }

  function shouldAddMedicalOfficialUrl(facility) {
    if (!facility || !facility.name) return false;
    if (!isMedicalCategory(facility)) return false;

    // すでに個別公式URLやチェーン公式URLが入っている場合は上書きしない
    if (facility.officialUrl && String(facility.officialUrl).trim() !== "") {
      return false;
    }

    return true;
  }

  function updateMedicalFacility(facility) {
    facility.officialUrl = MEDICAL_INFO_NET_URL;
    facility.verified = false;

    if (!facility.mapUrl) {
      facility.mapUrl = makeMapUrl(facility.name);
    }

    addTag(facility, "公式URLあり");
    addTag(facility, "医療情報ネット");
    addTag(facility, "要確認");

    facility.sourceMemo =
      "厚生労働省の医療情報ネット（ナビイ）で施設名検索して確認してください。個別公式ホームページは未確認。";

    facility.memo =
      "診療時間・休診日・受付条件は変わる場合があります。受診前に公式情報または電話で確認してください。";
  }

  /*
    safety-cleanup-extra.js で消えた可能性がある医療系候補のうち、
    公式系確認導線として復活させたいもの。
    ただし個別公式HP未確認なので verified:false。
  */
  const reviveMedicalCandidates = [
    ["中津胃腸病院", "病院・歯医者", "病院候補。診療科・受付時間は医療情報ネットまたは公式情報で確認してください。", ["病院", "医療", "医療情報ネット"]],
    ["梶原病院", "病院・歯医者", "病院候補。診療科・受付時間は医療情報ネットまたは公式情報で確認してください。", ["病院", "医療", "医療情報ネット"]],
    ["酒井病院", "病院・歯医者", "病院候補。診療科・受付時間は医療情報ネットまたは公式情報で確認してください。", ["病院", "医療", "医療情報ネット"]],
    ["中津脳神経外科病院", "病院・歯医者", "脳神経外科系の病院候補。診療時間は医療情報ネットまたは公式情報で確認してください。", ["病院", "脳神経外科", "医療情報ネット"]],
    ["川嶌整形外科病院", "病院・歯医者", "整形外科系の病院候補。診療時間は医療情報ネットまたは公式情報で確認してください。", ["病院", "整形外科", "医療情報ネット"]],
    ["村上記念病院", "病院・歯医者", "病院候補。診療科・受付時間は医療情報ネットまたは公式情報で確認してください。", ["病院", "医療", "医療情報ネット"]],
    ["松元整形外科医院", "病院・歯医者", "整形外科候補。診療時間は医療情報ネットまたは公式情報で確認してください。", ["整形外科", "病院", "医療情報ネット"]],
    ["宮田内科医院", "病院・歯医者", "内科候補。診療時間は医療情報ネットまたは公式情報で確認してください。", ["内科", "病院", "医療情報ネット"]],
    ["池田耳鼻咽喉科医院", "病院・歯医者", "耳鼻咽喉科候補。診療時間は医療情報ネットまたは公式情報で確認してください。", ["耳鼻科", "病院", "医療情報ネット"]],
    ["井上小児科医院", "病院・歯医者", "小児科候補。診療時間は医療情報ネットまたは公式情報で確認してください。", ["小児科", "病院", "医療情報ネット"]],

    ["福成歯科医院", "病院・歯医者", "歯科医院候補。診療時間は医療情報ネットまたは公式情報で確認してください。", ["歯医者", "歯科", "医療情報ネット"]],
    ["友松歯科医院", "病院・歯医者", "歯科医院候補。診療時間は医療情報ネットまたは公式情報で確認してください。", ["歯医者", "歯科", "医療情報ネット"]],
    ["Wash歯科医院", "病院・歯医者", "歯科医院候補。診療時間は医療情報ネットまたは公式情報で確認してください。", ["歯医者", "歯科", "医療情報ネット"]],
    ["ながの歯科医院", "病院・歯医者", "歯科医院候補。診療時間は医療情報ネットまたは公式情報で確認してください。", ["歯医者", "歯科", "医療情報ネット"]],
    ["細川歯科医院", "病院・歯医者", "歯科医院候補。診療時間は医療情報ネットまたは公式情報で確認してください。", ["歯医者", "歯科", "医療情報ネット"]],
    ["加来歯科医院", "病院・歯医者", "歯科医院候補。診療時間は医療情報ネットまたは公式情報で確認してください。", ["歯医者", "歯科", "医療情報ネット"]],
    ["松尾歯科医院", "病院・歯医者", "歯科医院候補。診療時間は医療情報ネットまたは公式情報で確認してください。", ["歯医者", "歯科", "医療情報ネット"]],
    ["大堀たけし歯科医院", "病院・歯医者", "歯科医院候補。診療時間は医療情報ネットまたは公式情報で確認してください。", ["歯医者", "歯科", "医療情報ネット"]],
    ["角野歯科医院", "病院・歯医者", "歯科医院候補。診療時間は医療情報ネットまたは公式情報で確認してください。", ["歯医者", "歯科", "医療情報ネット"]],
    ["前田歯科クリニック", "病院・歯医者", "歯科医院候補。診療時間は医療情報ネットまたは公式情報で確認してください。", ["歯医者", "歯科", "医療情報ネット"]],

    ["そうごう薬局 中津店", "薬局", "調剤薬局候補。営業時間は医療情報ネットまたは公式情報で確認してください。", ["調剤薬局", "薬", "医療情報ネット"]],
    ["ワタナベ薬局 中津店", "薬局", "調剤薬局候補。営業時間は医療情報ネットまたは公式情報で確認してください。", ["調剤薬局", "薬", "医療情報ネット"]],
    ["ひまわり薬局 中津店", "薬局", "調剤薬局候補。営業時間は医療情報ネットまたは公式情報で確認してください。", ["調剤薬局", "薬", "医療情報ネット"]],
    ["あさひ薬局 中津店", "薬局", "調剤薬局候補。営業時間は医療情報ネットまたは公式情報で確認してください。", ["調剤薬局", "薬", "医療情報ネット"]],
    ["くすりの大信 中津店", "薬局", "調剤薬局候補。営業時間は医療情報ネットまたは公式情報で確認してください。", ["調剤薬局", "薬", "医療情報ネット"]],
    ["ファン薬局 中津店", "薬局", "調剤薬局候補。営業時間は医療情報ネットまたは公式情報で確認してください。", ["調剤薬局", "薬", "医療情報ネット"]],
    ["永冨調剤薬局 中津店", "薬局", "調剤薬局候補。営業時間は医療情報ネットまたは公式情報で確認してください。", ["調剤薬局", "薬", "医療情報ネット"]],
    ["さくら薬局 中津店", "薬局", "調剤薬局候補。営業時間は医療情報ネットまたは公式情報で確認してください。", ["調剤薬局", "薬", "医療情報ネット"]],
    ["あおぞら薬局 中津店", "薬局", "調剤薬局候補。営業時間は医療情報ネットまたは公式情報で確認してください。", ["調剤薬局", "薬", "医療情報ネット"]]
  ];

  function createReviveItem(item, id) {
    return {
      id: id,
      name: item[0],
      category: item[1],
      description: item[2],
      address: "",
      phone: "",
      hours: "",
      closed: "",
      mapUrl: makeMapUrl(item[0]),
      officialUrl: MEDICAL_INFO_NET_URL,
      sourceMemo: "厚生労働省の医療情報ネット（ナビイ）で施設名検索して確認してください。個別公式ホームページは未確認。",
      tags: ["公式URLあり"].concat(item[3] || []),
      memo: "診療時間・休診日・受付条件は変わる場合があります。受診前に公式情報または電話で確認してください。",
      verified: false
    };
  }

  const before = facilities.length;
  const updated = [];
  const revived = [];
  const skipped = [];

  facilities.forEach(function (facility) {
    if (shouldAddMedicalOfficialUrl(facility)) {
      updateMedicalFacility(facility);
      updated.push(facility.name);
    }
  });

  let nextId = 9201;
  const existingNames = new Set(
    facilities.map(function (facility) {
      return normalizeName(facility.name);
    })
  );

  reviveMedicalCandidates.forEach(function (item) {
    const key = normalizeName(item[0]);

    if (existingNames.has(key)) {
      skipped.push(item[0]);
      return;
    }

    const newFacility = createReviveItem(item, nextId);
    facilities.push(newFacility);
    existingNames.add(key);
    revived.push(item[0]);
    nextId += 1;
  });

  window.NAKATSU_OFFICIAL_URL_002_RESULT = {
    before: before,
    after: facilities.length,
    updatedCount: updated.length,
    revivedCount: revived.length,
    skippedCount: skipped.length,
    updated: updated,
    revived: revived,
    skipped: skipped
  };

  console.log("official-url-extra-002 result:", window.NAKATSU_OFFICIAL_URL_002_RESULT);
})();
