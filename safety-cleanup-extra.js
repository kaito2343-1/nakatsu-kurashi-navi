/* ============================================================
   中津くらしナビ：安全整理ファイル
   ファイル名：safety-cleanup-extra.js

   目的：
   ・掲載数を増やす過程で入った「存在確認が弱い候補」を一旦非表示
   ・公式確認できたら、このリストから名前を消せば再表示できる
   ・データそのものを完全削除するのではなく、facilities配列から表示前に除外する
   ============================================================ */

(function () {
  if (typeof facilities === "undefined" || !Array.isArray(facilities)) {
    console.warn("facilities 配列が見つかりません。safety-cleanup-extra.js を script.js の後に読み込んでください。");
    return;
  }

  function normalizeName(name) {
    return String(name || "")
      .replace(/[　]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  /*
    ここに入っている店・施設は「存在確認が弱いので一旦非表示」。
    公式サイトなどで確認できたら、この配列から名前を消してください。
  */
  const HIDE_NAMES = [
    /* ===== 第4弾：存在確認が弱い飲食チェーン候補 ===== */
    "餃子の王将 中津店",
    "大阪王将 中津店",
    "まいどおおきに食堂 中津食堂",
    "めしや食堂 中津店",
    "天ぷら定食 えびのや 中津店",
    "とんかつ濵かつ 大分中津店",
    "天丼てんや 中津店",
    "ペッパーランチ イオンモール三光店",
    "いきなりステーキ イオンモール三光店",
    "すたみな太郎 中津店",
    "カレーハウスCoCo壱番屋 中津中央町店",
    "来来亭 中津店",
    "一蘭 中津店",
    "ラーメン山岡家 中津店",

    /* ===== 第4弾：パン・スイーツ系で確認が弱い候補 ===== */
    "乃が美 はなれ 中津販売店",
    "リョーユーパン 中津店",
    "石窯パン工房 クリーブラッツ 中津店",
    "パン工房 ブレッドハウス 中津店",
    "フランソア 中津店",
    "不二家 中津店",
    "如水庵 中津店",
    "湖月堂 中津店",
    "31アイスクリーム 中津店",

    /* ===== 第4弾：弁当・からあげで確認が弱い候補 ===== */
    "からあげ専門店 から好し 中津店",
    "からあげ縁 中津店",
    "日本亭 中津店",
    "本家かまどや 中津店",
    "オリジン弁当 中津店",
    "ほっかほっか亭 中津店",
    "唐揚げのとり嘉 中津店",
    "からあげ味丸 中津店",
    "からあげ聖林 中津店",
    "からあげ専門店げんきや 中津中央町店",

    /* ===== 第4弾：居酒屋チェーンで確認が弱い候補 ===== */
    "鳥貴族 中津店",
    "串カツ田中 中津店",
    "ミライザカ 中津店",
    "三代目鳥メロ 中津店",
    "山内農場 中津駅前店",
    "目利きの銀次 中津駅前店",
    "白木屋 中津駅前店",
    "笑笑 中津駅前店",
    "村さ来 中津店",
    "つぼ八 中津店",

    /* ===== 第4弾：買い物系で確認が弱い候補 ===== */
    "コメリパワー 中津店",
    "ホームワイド 中津店",
    "ミスターマックス 中津店",
    "ルミエール 中津店",
    "マックスバリュ 中津店",
    "ザ・ビッグ 中津店",
    "A-プライス 中津店",
    "キャンドゥ 中津店",
    "無印良品 イオンモール三光店",
    "ニトリ 中津店",

    /* ===== 第4弾：ドラッグストアで確認が弱い候補 ===== */
    "マツモトキヨシ 中津店",
    "ココカラファイン 中津店",
    "ウエルシア 中津店",
    "ドラッグセイムス 中津店",
    "ツルハドラッグ 中津店",
    "くすりの大信 中津店",
    "ファン薬局 中津店",
    "永冨調剤薬局 中津店",
    "さくら薬局 中津店",
    "あおぞら薬局 中津店",

    /* ===== 第4弾：病院・美容で確認が弱い候補 ===== */
    "中津第一病院",
    "中津皮膚科クリニック",
    "宮田内科医院",
    "アートネイチャー 中津店",
    "アデランス 中津店",
    "カラダファクトリー 中津店",
    "エステティックTBC 中津店",
    "ミュゼプラチナム 中津店",
    "脱毛ラボ 中津店",
    "ホワイトニングカフェ 中津店",
    "ネイルサロン 中津 Nail",

    /* ===== 第3弾：確認が弱い飲食・カフェ候補 ===== */
    "焼肉たむら 中津店",
    "七輪焼肉 安安 中津店",
    "ピザハット 中津店",
    "松屋 中津店",
    "松のや 中津店",
    "なか卯 中津店",
    "めしや宮本むなし 中津店",
    "やよい軒 中津店",
    "おべんとうのヒライ 中津店",
    "タリーズコーヒー 中津店",
    "ドトールコーヒーショップ 中津店",
    "珈琲館 中津店",

    /* ===== 第2弾：名前が広すぎる・確認が弱い候補 ===== */
    "BARBER SHOP 中津",
    "中津皮膚科",
    "タイムズ中津駅前",
    "タイムズ中津駅北口",
    "リパーク中津駅前",
    "ENEOS 中津SS",
    "apollostation 中津SS",
    "コスモ石油 中津SS",
    "JA-SS 中津給油所",
    "ビッグモーター 中津店",
    "ネクステージ 中津店"
  ];

  /*
    名前がこの言葉を含む場合も非表示。
    「中津店」だけの架空チェーン候補や、ざっくりしすぎる候補を落とす。
  */
  const HIDE_PATTERNS = [
    "要確認テンプレ",
    "検索カード",
    "サンプル"
  ];

  const hideSet = new Set(HIDE_NAMES.map(normalizeName));

  const before = facilities.length;
  const removed = [];

  for (let i = facilities.length - 1; i >= 0; i--) {
    const facility = facilities[i];
    const name = facility && facility.name ? facility.name : "";
    const normalized = normalizeName(name);
    const text = [
      facility.name,
      facility.category,
      facility.description,
      facility.sourceMemo,
      facility.memo
    ].join(" ");

    const exactHide = hideSet.has(normalized);
    const patternHide = HIDE_PATTERNS.some(function (pattern) {
      return text.includes(pattern);
    });

    if (exactHide || patternHide) {
      removed.push({
        name: facility.name,
        category: facility.category,
        reason: exactHide ? "存在確認が弱いため一旦非表示" : "安全整理パターンに一致"
      });

      facilities.splice(i, 1);
    }
  }

  window.NAKATSU_SAFETY_CLEANUP_RESULT = {
    before: before,
    after: facilities.length,
    removedCount: removed.length,
    removed: removed
  };

  console.log("safety-cleanup-extra result:", window.NAKATSU_SAFETY_CLEANUP_RESULT);
})();
