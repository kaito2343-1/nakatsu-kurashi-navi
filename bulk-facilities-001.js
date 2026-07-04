/* ============================================================
   中津くらしナビ：掲載数増加 第1弾
   ファイル名：bulk-facilities-001.js

   目的：
   ・実店舗・実在施設の候補を追加
   ・Googleマップ等からの無断スクレイピングはしない
   ・住所、電話、営業時間は公式確認できるまで空欄
   ・すべて verified:false で追加
   ============================================================ */

(function () {
  if (typeof facilities === "undefined" || !Array.isArray(facilities)) {
    console.warn("facilities 配列が見つかりません。bulk-facilities-001.js を script.js の後に読み込んでください。");
    return;
  }

  const BASE_ID = 2001;

  function normalizeName(name) {
    return String(name || "")
      .replace(/\s+/g, " ")
      .replace(/[　]/g, " ")
      .trim()
      .toLowerCase();
  }

  function makeMapUrl(name) {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(name + " 中津市");
  }

  function baseItem(item, id) {
    return {
      id: id,
      name: item.name,
      category: item.category,
      description: item.description || "中津市周辺で利用候補になる実店舗・実在施設です。詳細は公式情報で確認してください。",
      address: item.address || "",
      phone: item.phone || "",
      hours: item.hours || "",
      closed: item.closed || "",
      mapUrl: item.mapUrl || makeMapUrl(item.name),
      officialUrl: item.officialUrl || "",
      sourceMemo: item.sourceMemo || "公式情報で要確認。住所・営業時間・電話番号は未確認のため空欄。",
      tags: Array.isArray(item.tags) ? item.tags : [],
      memo: item.memo || "行く前に公式情報や現地情報を確認してください。",
      verified: false
    };
  }

  const candidates = [
    /* ================= ランチ・定食 ================= */
    {
      name: "井手ちゃんぽん 中津店",
      category: "定食・ランチ",
      description: "ちゃんぽん・定食系の食事候補。",
      tags: ["ランチ", "ちゃんぽん", "一人OK"]
    },
    {
      name: "リンガーハット 大分中津店",
      category: "定食・ランチ",
      description: "ちゃんぽん・皿うどんを食べたい時の候補。",
      tags: ["ランチ", "ちゃんぽん", "一人OK"]
    },
    {
      name: "ジョイフル 中津店",
      category: "定食・ランチ",
      description: "ファミレス系の食事候補。ランチ・夜ご飯にも使いやすい店舗。",
      tags: ["ファミレス", "ランチ", "一人OK", "子連れ"]
    },
    {
      name: "ジョイフル 北中津店",
      category: "定食・ランチ",
      description: "ファミレス系の食事候補。家族利用や一人飯にも使いやすい店舗。",
      tags: ["ファミレス", "ランチ", "一人OK", "子連れ"]
    },
    {
      name: "ジョイフル 南中津店",
      category: "定食・ランチ",
      description: "ファミレス系の食事候補。ランチ・夜ご飯に使いやすい店舗。",
      tags: ["ファミレス", "ランチ", "一人OK", "子連れ"]
    },
    {
      name: "ガスト 中津店",
      category: "定食・ランチ",
      description: "ファミレス系の食事候補。ランチや家族利用に使いやすい店舗。",
      tags: ["ファミレス", "ランチ", "子連れ", "一人OK"]
    },
    {
      name: "すき家 213号中津店",
      category: "定食・ランチ",
      description: "牛丼・定食を手早く食べたい時の候補。",
      tags: ["牛丼", "安い", "一人OK", "ランチ"]
    },
    {
      name: "吉野家 213号線中津店",
      category: "定食・ランチ",
      description: "牛丼・定食を手早く食べたい時の候補。",
      tags: ["牛丼", "安い", "一人OK", "ランチ"]
    },
    {
      name: "かつや 大分中津店",
      category: "定食・ランチ",
      description: "カツ丼・とんかつ系を食べたい時の候補。",
      tags: ["とんかつ", "カツ丼", "ランチ", "一人OK"]
    },
    {
      name: "資さんうどん 中津店",
      category: "定食・ランチ",
      description: "うどん・丼ものを食べたい時の候補。",
      tags: ["うどん", "ランチ", "一人OK", "安い"]
    },
    {
      name: "丸亀製麺 中津店",
      category: "定食・ランチ",
      description: "うどんを手軽に食べたい時の候補。",
      tags: ["うどん", "ランチ", "一人OK", "安い"]
    },
    {
      name: "ウエスト 中津店",
      category: "定食・ランチ",
      description: "うどん・そば・定食系の食事候補。",
      tags: ["うどん", "そば", "ランチ", "一人OK"]
    },
    {
      name: "CoCo壱番屋 大分中津店",
      category: "定食・ランチ",
      description: "カレーを食べたい時の候補。",
      tags: ["カレー", "ランチ", "一人OK"]
    },
    {
      name: "どんどん亭 中津店",
      category: "定食・ランチ",
      description: "お好み焼き・鉄板焼き系を食べたい時の候補。",
      tags: ["お好み焼き", "ランチ", "夜ご飯", "子連れ"]
    },
    {
      name: "ほっともっと 中津中央町店",
      category: "弁当・惣菜",
      description: "弁当・テイクアウトを利用したい時の候補。",
      tags: ["弁当", "テイクアウト", "安い"]
    },
    {
      name: "ほっともっと 中津下池永店",
      category: "弁当・惣菜",
      description: "弁当・テイクアウトを利用したい時の候補。",
      tags: ["弁当", "テイクアウト", "安い"]
    },

    /* ================= 居酒屋・夜ご飯 ================= */
    {
      name: "魚民 中津北口駅前店",
      category: "居酒屋・夜ご飯",
      description: "駅周辺で居酒屋を探す時の候補。",
      tags: ["居酒屋", "飲み会", "夜ご飯", "駅近"]
    },
    {
      name: "牛角 中津店",
      category: "居酒屋・夜ご飯",
      description: "焼肉を食べたい時の候補。",
      tags: ["焼肉", "夜ご飯", "子連れ", "飲み会"]
    },
    {
      name: "焼肉きんぐ 中津店",
      category: "居酒屋・夜ご飯",
      description: "焼肉食べ放題系を探す時の候補。",
      tags: ["焼肉", "食べ放題", "夜ご飯", "子連れ"]
    },
    {
      name: "焼肉ウエスト 中津店",
      category: "居酒屋・夜ご飯",
      description: "焼肉・夜ご飯の候補。",
      tags: ["焼肉", "夜ご飯", "子連れ"]
    },
    {
      name: "しゃぶしゃぶ温野菜 大分中津店",
      category: "居酒屋・夜ご飯",
      description: "しゃぶしゃぶを食べたい時の候補。",
      tags: ["しゃぶしゃぶ", "夜ご飯", "子連れ", "飲み会"]
    },
    {
      name: "博多一番どり 居食家あらい 中津店",
      category: "居酒屋・夜ご飯",
      description: "焼き鳥・居酒屋系の夜ご飯候補。",
      tags: ["居酒屋", "焼き鳥", "夜ご飯", "飲み会"]
    },
    {
      name: "やきとり大吉 中津店",
      category: "居酒屋・夜ご飯",
      description: "焼き鳥・居酒屋系の候補。",
      tags: ["焼き鳥", "居酒屋", "夜ご飯"]
    },

    /* ================= ラーメン ================= */
    {
      name: "筑豊ラーメン山小屋 メルクス中津店",
      category: "ラーメン",
      description: "豚骨ラーメン系の候補。",
      tags: ["ラーメン", "一人OK", "ランチ", "夜ご飯"]
    },
    {
      name: "井手ちゃんぽん 中津店",
      category: "ラーメン",
      description: "ちゃんぽん・麺系を食べたい時の候補。",
      tags: ["ちゃんぽん", "ラーメン", "ランチ", "一人OK"]
    },
    {
      name: "リンガーハット 大分中津店",
      category: "ラーメン",
      description: "ちゃんぽん・皿うどんを食べたい時の候補。",
      tags: ["ちゃんぽん", "ラーメン", "ランチ", "一人OK"]
    },

    /* ================= カフェ・軽食 ================= */
    {
      name: "マクドナルド 中津店",
      category: "カフェ・喫茶店",
      description: "軽食・休憩・テイクアウトの候補。",
      tags: ["軽食", "休憩", "テイクアウト", "子連れ"]
    },
    {
      name: "マクドナルド イオンモール三光店",
      category: "カフェ・喫茶店",
      description: "イオンモール三光内で軽食・休憩に使える候補。",
      tags: ["軽食", "休憩", "テイクアウト", "子連れ"]
    },
    {
      name: "モスバーガー 中津如水店",
      category: "カフェ・喫茶店",
      description: "ハンバーガー・軽食の候補。",
      tags: ["軽食", "休憩", "テイクアウト"]
    },
    {
      name: "ケンタッキーフライドチキン ゆめタウン中津店",
      category: "カフェ・喫茶店",
      description: "ゆめタウン中津内で軽食を探す時の候補。",
      tags: ["軽食", "テイクアウト", "子連れ"]
    },
    {
      name: "ミスタードーナツ ゆめタウン中津ショップ",
      category: "カフェ・喫茶店",
      description: "ドーナツ・休憩の候補。",
      tags: ["カフェ", "休憩", "テイクアウト"]
    },
    {
      name: "サーティワンアイスクリーム ゆめタウン中津店",
      category: "カフェ・喫茶店",
      description: "アイスクリーム・休憩の候補。",
      tags: ["スイーツ", "休憩", "子連れ"]
    },

    /* ================= スーパー・コンビニ・買い物 ================= */
    {
      name: "スーパーセンタートライアル 中津店",
      category: "スーパー・コンビニ",
      description: "食品・日用品の買い物候補。",
      tags: ["スーパー", "日用品", "駐車場あり", "買い物"]
    },
    {
      name: "ダイレックス 中津店",
      category: "スーパー・コンビニ",
      description: "日用品・食品・生活用品の買い物候補。",
      tags: ["ディスカウント", "日用品", "買い物", "駐車場あり"]
    },
    {
      name: "ダイレックス 中津中殿店",
      category: "スーパー・コンビニ",
      description: "日用品・食品・生活用品の買い物候補。",
      tags: ["ディスカウント", "日用品", "買い物", "駐車場あり"]
    },
    {
      name: "サンリブ 中津",
      category: "スーパー・コンビニ",
      description: "食品・生活用品の買い物候補。",
      tags: ["スーパー", "買い物", "日用品"]
    },
    {
      name: "マルショク 一ツ松店",
      category: "スーパー・コンビニ",
      description: "食品スーパーの買い物候補。",
      tags: ["スーパー", "食品", "買い物"]
    },
    {
      name: "マルショク 東中津店",
      category: "スーパー・コンビニ",
      description: "食品スーパーの買い物候補。",
      tags: ["スーパー", "食品", "買い物"]
    },
    {
      name: "ホームプラザナフコ 中津店",
      category: "スーパー・コンビニ",
      description: "家具・日用品・ホームセンター系の買い物候補。",
      tags: ["ホームセンター", "日用品", "家具", "駐車場あり"]
    },
    {
      name: "グッデイ 中津店",
      category: "スーパー・コンビニ",
      description: "DIY用品・日用品を探す時の候補。",
      tags: ["ホームセンター", "DIY", "日用品", "駐車場あり"]
    },
    {
      name: "ヤマダデンキ テックランド中津店",
      category: "スーパー・コンビニ",
      description: "家電を探す時の候補。",
      tags: ["家電", "買い物", "駐車場あり"]
    },
    {
      name: "ケーズデンキ 中津店",
      category: "スーパー・コンビニ",
      description: "家電を探す時の候補。",
      tags: ["家電", "買い物", "駐車場あり"]
    },
    {
      name: "エディオン 中津店",
      category: "スーパー・コンビニ",
      description: "家電を探す時の候補。",
      tags: ["家電", "買い物", "駐車場あり"]
    },
    {
      name: "ダイソー ゆめタウン中津店",
      category: "スーパー・コンビニ",
      description: "100円ショップ・日用品の買い物候補。",
      tags: ["100円ショップ", "日用品", "買い物"]
    },
    {
      name: "ダイソー イオンモール三光店",
      category: "スーパー・コンビニ",
      description: "100円ショップ・日用品の買い物候補。",
      tags: ["100円ショップ", "日用品", "買い物"]
    },
    {
      name: "セリア イオンモール三光店",
      category: "スーパー・コンビニ",
      description: "100円ショップ・雑貨の買い物候補。",
      tags: ["100円ショップ", "雑貨", "買い物"]
    },
    {
      name: "しまむら 中津店",
      category: "スーパー・コンビニ",
      description: "衣料品を探す時の候補。",
      tags: ["衣料品", "買い物", "駐車場あり"]
    },
    {
      name: "アベイル 中津店",
      category: "スーパー・コンビニ",
      description: "衣料品を探す時の候補。",
      tags: ["衣料品", "買い物", "駐車場あり"]
    },
    {
      name: "ユニクロ フレスポ中津北店",
      category: "スーパー・コンビニ",
      description: "衣料品を探す時の候補。",
      tags: ["衣料品", "買い物", "駐車場あり"]
    },
    {
      name: "西松屋 フレスポ中津北店",
      category: "スーパー・コンビニ",
      description: "ベビー用品・子ども用品を探す時の候補。",
      tags: ["子ども用品", "ベビー用品", "買い物", "駐車場あり"]
    },
    {
      name: "ワークマン 中津店",
      category: "スーパー・コンビニ",
      description: "作業服・アウトドア系衣料を探す時の候補。",
      tags: ["作業服", "衣料品", "買い物"]
    },

    /* ================= 病院・歯医者 ================= */
    {
      name: "中津胃腸病院",
      category: "病院・歯医者",
      description: "中津市内の病院候補。診療科・受付時間は公式情報で確認してください。",
      tags: ["病院", "医療", "要確認"]
    },
    {
      name: "梶原病院",
      category: "病院・歯医者",
      description: "中津市内の病院候補。診療科・受付時間は公式情報で確認してください。",
      tags: ["病院", "医療", "要確認"]
    },
    {
      name: "酒井病院",
      category: "病院・歯医者",
      description: "中津市内の病院候補。診療科・受付時間は公式情報で確認してください。",
      tags: ["病院", "医療", "要確認"]
    },
    {
      name: "中津脳神経外科病院",
      category: "病院・歯医者",
      description: "中津市内の病院候補。診療科・受付時間は公式情報で確認してください。",
      tags: ["病院", "脳神経外科", "要確認"]
    },
    {
      name: "久持クリニック",
      category: "病院・歯医者",
      description: "中津市内のクリニック候補。診療科・受付時間は公式情報で確認してください。",
      tags: ["クリニック", "医療", "要確認"]
    },
    {
      name: "里見医院",
      category: "病院・歯医者",
      description: "中津市内の医院候補。診療科・受付時間は公式情報で確認してください。",
      tags: ["医院", "医療", "要確認"]
    },
    {
      name: "まつざきクリニック",
      category: "病院・歯医者",
      description: "中津市内のクリニック候補。診療科・受付時間は公式情報で確認してください。",
      tags: ["クリニック", "医療", "要確認"]
    },
    {
      name: "田中医院",
      category: "病院・歯医者",
      description: "中津市内の医院候補。診療科・受付時間は公式情報で確認してください。",
      tags: ["医院", "医療", "要確認"]
    },

    /* ================= 車・ガソリン ================= */
    {
      name: "オートバックス 中津店",
      category: "車・ガソリン",
      description: "カー用品・メンテナンスの候補。",
      tags: ["カー用品", "車", "メンテナンス", "駐車場あり"]
    },
    {
      name: "イエローハット 中津店",
      category: "車・ガソリン",
      description: "カー用品・メンテナンスの候補。",
      tags: ["カー用品", "車", "メンテナンス", "駐車場あり"]
    },
    {
      name: "タイヤ館 中津",
      category: "車・ガソリン",
      description: "タイヤ交換・車のメンテナンス候補。",
      tags: ["タイヤ", "車", "メンテナンス"]
    },
    {
      name: "トヨタレンタカー 中津駅南口店",
      category: "車・ガソリン",
      description: "レンタカー利用の候補。",
      tags: ["レンタカー", "駅近", "車"]
    },
    {
      name: "オリックスレンタカー 中津駅前店",
      category: "車・ガソリン",
      description: "レンタカー利用の候補。",
      tags: ["レンタカー", "駅近", "車"]
    },
    {
      name: "ニッポンレンタカー 中津駅前営業所",
      category: "車・ガソリン",
      description: "レンタカー利用の候補。",
      tags: ["レンタカー", "駅近", "車"]
    },
    {
      name: "ネッツトヨタ大分 中津店",
      category: "車・ガソリン",
      description: "自動車販売・点検整備の候補。",
      tags: ["車", "ディーラー", "点検"]
    },
    {
      name: "トヨタカローラ大分 中津店",
      category: "車・ガソリン",
      description: "自動車販売・点検整備の候補。",
      tags: ["車", "ディーラー", "点検"]
    },
    {
      name: "大分ダイハツ販売 中津店",
      category: "車・ガソリン",
      description: "自動車販売・点検整備の候補。",
      tags: ["車", "ディーラー", "点検"]
    },
    {
      name: "Honda Cars 大分 中津下池永店",
      category: "車・ガソリン",
      description: "自動車販売・点検整備の候補。",
      tags: ["車", "ディーラー", "点検"]
    },

    /* ================= ホテル・ネットカフェ ================= */
    {
      name: "HOTEL AZ 大分中津店",
      category: "ホテル・ネットカフェ",
      description: "中津市内の宿泊候補。",
      tags: ["ホテル", "宿泊", "出張", "駐車場あり"]
    },
    {
      name: "中津サンライズホテル",
      category: "ホテル・ネットカフェ",
      description: "中津駅周辺の宿泊候補。",
      tags: ["ホテル", "宿泊", "出張"]
    },
    {
      name: "ホテルパブリック21",
      category: "ホテル・ネットカフェ",
      description: "中津市内の宿泊候補。",
      tags: ["ホテル", "宿泊", "出張"]
    },
    {
      name: "耶馬溪温泉 鹿鳴館",
      category: "ホテル・ネットカフェ",
      description: "耶馬溪方面の宿泊・温泉候補。",
      tags: ["宿泊", "温泉", "観光"]
    },

    /* ================= 公共施設・観光・雨の日 ================= */
    {
      name: "中津市歴史博物館",
      category: "雨の日に行ける場所",
      description: "中津の歴史を知ることができる博物館候補。",
      tags: ["観光", "歴史", "屋内", "雨の日OK"]
    },
    {
      name: "中津市木村記念美術館",
      category: "雨の日に行ける場所",
      description: "中津市内の美術館候補。",
      tags: ["美術館", "屋内", "雨の日OK", "観光"]
    },
    {
      name: "村上医家史料館",
      category: "雨の日に行ける場所",
      description: "歴史資料を見学できる施設候補。",
      tags: ["歴史", "屋内", "観光", "雨の日OK"]
    },
    {
      name: "大江医家史料館",
      category: "雨の日に行ける場所",
      description: "歴史資料を見学できる施設候補。",
      tags: ["歴史", "屋内", "観光", "雨の日OK"]
    },
    {
      name: "自性寺大雅堂",
      category: "雨の日に行ける場所",
      description: "中津市内の歴史・文化スポット候補。",
      tags: ["歴史", "文化", "観光"]
    },
    {
      name: "合元寺",
      category: "雨の日に行ける場所",
      description: "中津市内の寺院・歴史スポット候補。",
      tags: ["寺院", "歴史", "観光"]
    },
    {
      name: "中津神社",
      category: "雨の日に行ける場所",
      description: "中津市内の神社・観光スポット候補。",
      tags: ["神社", "歴史", "観光"]
    },
    {
      name: "城井神社",
      category: "雨の日に行ける場所",
      description: "中津城周辺の歴史スポット候補。",
      tags: ["神社", "歴史", "観光"]
    },
    {
      name: "大貞公園",
      category: "雨の日に行ける場所",
      description: "公園・散歩・子連れ利用の候補。",
      tags: ["公園", "子連れ", "散歩", "屋外"]
    },
    {
      name: "ダイハツ九州アリーナ",
      category: "雨の日に行ける場所",
      description: "スポーツ・イベント利用の候補。",
      tags: ["体育館", "スポーツ", "屋内", "雨の日OK"]
    },
    {
      name: "ダイハツ九州スタジアム",
      category: "雨の日に行ける場所",
      description: "スポーツ観戦・イベント利用の候補。",
      tags: ["スポーツ", "野球", "イベント"]
    },
    {
      name: "中津文化会館",
      category: "雨の日に行ける場所",
      description: "ホール・イベント利用の候補。",
      tags: ["文化施設", "イベント", "屋内", "雨の日OK"]
    },
    {
      name: "道の駅なかつ",
      category: "雨の日に行ける場所",
      description: "買い物・食事・休憩に使える観光施設候補。",
      tags: ["道の駅", "観光", "買い物", "駐車場あり"]
    },
    {
      name: "八面山金色温泉",
      category: "雨の日に行ける場所",
      description: "温泉・休憩の候補。",
      tags: ["温泉", "観光", "休憩"]
    },
    {
      name: "八面山平和公園",
      category: "雨の日に行ける場所",
      description: "景色・散歩・ドライブの候補。",
      tags: ["公園", "観光", "ドライブ", "屋外"]
    },
    {
      name: "青の洞門",
      category: "雨の日に行ける場所",
      description: "耶馬溪方面の観光スポット候補。",
      tags: ["観光", "歴史", "ドライブ"]
    },
    {
      name: "羅漢寺",
      category: "雨の日に行ける場所",
      description: "耶馬溪方面の寺院・観光スポット候補。",
      tags: ["寺院", "観光", "歴史"]
    },
    {
      name: "耶馬溪橋",
      category: "雨の日に行ける場所",
      description: "耶馬溪方面の観光スポット候補。",
      tags: ["観光", "橋", "ドライブ"]
    },
    {
      name: "深耶馬溪 一目八景",
      category: "雨の日に行ける場所",
      description: "紅葉・景色・ドライブの観光候補。",
      tags: ["観光", "景色", "紅葉", "ドライブ"]
    },
    {
      name: "耶馬溪ダム記念公園 溪石園",
      category: "雨の日に行ける場所",
      description: "耶馬溪方面の庭園・観光スポット候補。",
      tags: ["観光", "庭園", "紅葉", "散歩"]
    }
  ];

  const existingNames = new Set(
    facilities.map(function (facility) {
      return normalizeName(facility.name);
    })
  );

  let nextId = BASE_ID;
  const added = [];
  const skipped = [];

  candidates.forEach(function (item) {
    const key = normalizeName(item.name);

    if (existingNames.has(key)) {
      skipped.push(item.name);
      return;
    }

    facilities.push(baseItem(item, nextId));
    existingNames.add(key);
    added.push(item.name);
    nextId += 1;
  });

  window.NAKATSU_BULK_001_RESULT = {
    candidateCount: candidates.length,
    addedCount: added.length,
    skippedCount: skipped.length,
    added: added,
    skipped: skipped
  };

  console.log("bulk-facilities-001 result:", window.NAKATSU_BULK_001_RESULT);
})();
