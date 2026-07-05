/* ============================================================
   中津くらしナビ：実在店舗整理・怪しい店舗削除 001

   目的：
   ・実店舗ではない検索カードを削除
   ・中津にない可能性が高い店舗を削除
   ・閉店/未確認/名前が曖昧な店舗を削除
   ・重複店舗を整理

   使い方：
   ・閉店や存在しない店が見つかったら removeExactNames に追加する
   ・このファイルは全データ追加JSの後、ranking.js/ui-extra.jsの前に読み込む
   ============================================================ */

(function () {
  if (typeof facilities === "undefined" || !Array.isArray(facilities)) {
    console.warn("facilities が見つかりません。real-store-cleanup-001.js はデータ追加JSの後に読み込んでください。");
    return;
  }

  const removeExactNames = [
    /* ===== 前に間違って入れた・中津店が怪しいチェーン ===== */
    "やよい軒 中津店",
    "餃子の王将 中津店",
    "大阪王将 中津店",
    "おべんとうのヒライ 中津店",

    /* ===== 店舗名が曖昧・正式名に寄せたいもの ===== */
    "モスバーガー 中津店",
    "CoCo壱番屋 中津店",

    /* ===== 重複・表記違いで不要なもの ===== */
    "や台ずし 中津駅南口町（寿司）",

    /* ===== 実店舗ではない検索カード：居酒屋系 ===== */
    "中津駅周辺の居酒屋",
    "中津駅周辺の焼き鳥店",
    "中津駅周辺の海鮮居酒屋",
    "中津駅周辺の個室居酒屋",
    "中津駅周辺の安い居酒屋",
    "中津駅周辺のバー・二軒目候補",

    /* ===== 実店舗ではない検索カード：ランチ系 ===== */
    "中津市 ランチ 定食",
    "中津市 食堂",
    "中津市 からあげ ランチ",
    "中津市 とんかつ",
    "中津市 海鮮ランチ",
    "中津市 うどん",
    "中津市 カレー",
    "中津市 弁当",
    "中津市 安いランチ",

    /* ===== 実店舗ではない検索カード：焼肉・寿司系 ===== */
    "中津市 焼肉 個室",
    "中津市 焼肉 食べ放題",
    "中津市 寿司 ランチ",
    "中津市 回転寿司"
  ];

  /*
    名前にこの言葉が入っていたら削除するもの。
    検索カード系だけを狙う。
  */
  const removeNamePatterns = [
    /^中津駅周辺の/,
    /^中津市 ランチ/,
    /^中津市 食堂$/,
    /^中津市 からあげ/,
    /^中津市 とんかつ$/,
    /^中津市 海鮮ランチ$/,
    /^中津市 うどん$/,
    /^中津市 カレー$/,
    /^中津市 弁当$/,
    /^中津市 安いランチ$/,
    /^中津市 焼肉/,
    /^中津市 寿司/,
    /^中津市 回転寿司$/
  ];

  function normalizeName(name) {
    return String(name || "")
      .replace(/[　]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function shouldRemove(facility) {
    const name = normalizeName(facility.name);

    if (!name) return true;

    if (removeExactNames.indexOf(name) !== -1) {
      return true;
    }

    return removeNamePatterns.some(function (pattern) {
      return pattern.test(name);
    });
  }

  /*
    まず削除対象を消す
  */
  for (let i = facilities.length - 1; i >= 0; i--) {
    if (shouldRemove(facilities[i])) {
      facilities.splice(i, 1);
    }
  }

  /*
    重複整理：
    同じ名前が複数ある場合、情報が多い方を残す
  */
  function dataScore(facility) {
    let score = 0;

    if (facility.verified === true) score += 100;
    if (facility.officialUrl) score += 20;
    if (facility.address) score += 10;
    if (facility.phone) score += 10;
    if (facility.hours) score += 10;
    if (facility.mapUrl) score += 5;
    if (Array.isArray(facility.tags)) score += facility.tags.length;

    return score;
  }

  const seen = {};
  for (let i = facilities.length - 1; i >= 0; i--) {
    const name = normalizeName(facilities[i].name);

    if (!seen[name]) {
      seen[name] = i;
      continue;
    }

    const currentIndex = i;
    const keptIndex = seen[name];

    const currentScore = dataScore(facilities[currentIndex]);
    const keptScore = dataScore(facilities[keptIndex]);

    if (currentScore > keptScore) {
      facilities.splice(keptIndex, 1);
      seen[name] = currentIndex;
    } else {
      facilities.splice(currentIndex, 1);
    }
  }

  /*
    今後の確認用ログ
  */
  console.log("real-store-cleanup-001.js: 実店舗ではないカード・怪しい店舗・重複を整理しました。現在件数:", facilities.length);
})();
