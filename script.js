/* ============================================================
   中津くらしナビ script.js（実在施設版）

   このファイルでやっていること：
   1. カテゴリの一覧（アイコン付き・色分け用の番号つき）を管理
   2. 施設データ（facilities配列）をまとめて管理
   3. キーワード検索・カテゴリ絞り込み・お気に入り絞り込み
   4. 「今営業中っぽいか」を現在時刻から簡易的に判定
      ※営業時間が未確認（空欄）の施設は判定の対象外
   5. 確認済み／要確認バッジの表示
   6. mapUrlが空の施設は、施設名＋住所からGoogleマップ検索URLを自動生成
   7. お気に入りをlocalStorageに保存＋トースト通知＋ボタンアニメ
   8. 掲載依頼・修正依頼モーダルの開閉

   ★★★ データを扱う上での大原則 ★★★
   - 架空の営業時間・電話番号は絶対に書かない
   - 確認できていない項目は空文字 "" のままにする（画面には「要確認」と表示される）
   - 公式サイト等で確認できた施設だけ verified: true にする
   - verified: true にした時は、sourceMemo に「いつ・どこで確認したか」を書く
   ============================================================ */


/* ---------------------------------------------------------
   1. カテゴリ一覧
   配列の並び順（0番目〜9番目）が、style.cssの
   .cat-0 〜 .cat-9 の色分けとそのまま対応しています。
--------------------------------------------------------- */
const CATEGORIES = [
  { key: "市役所・手続き",     icon: "🏛️" }, // .cat-0 深緑
  { key: "病院・歯医者",       icon: "🏥" },  // .cat-1 赤
  { key: "薬局",               icon: "💊" },  // .cat-2 緑
  { key: "ATM・銀行",          icon: "🏧" },  // .cat-3 青
  { key: "コインランドリー",   icon: "🧺" },  // .cat-4 水色
  { key: "安いご飯",           icon: "🍚" },  // .cat-5 オレンジ
  { key: "弁当・惣菜",         icon: "🍱" },  // .cat-6 からし色
  { key: "雨の日に行ける場所", icon: "☔" },  // .cat-7 紫
  { key: "釣り場",             icon: "🎣" },  // .cat-8 海の青
  { key: "困った時の相談先",   icon: "🆘" }   // .cat-9 朱色
];

// カテゴリ名 → アイコン・色番号 をすぐ取り出せる対応表
const CATEGORY_ICON_MAP = {};
const CATEGORY_COLOR_INDEX = {};
CATEGORIES.forEach(function (c, i) {
  CATEGORY_ICON_MAP[c.key] = c.icon;
  CATEGORY_COLOR_INDEX[c.key] = i;
});


/* ---------------------------------------------------------
   2. 施設データ（実在施設）

   各項目の意味：
   id          : 他と重複しない番号
   name        : 施設名（実在の名称）
   category    : カテゴリ（CATEGORIESのkeyと完全一致させる）
   description : 施設の簡単な説明
   address     : 住所（未確認の部分は書かない）
   phone       : 電話番号（確認できたものだけ。未確認は ""）
   hours       : 営業時間（確認できたものだけ。未確認は ""）
   closed      : 定休日（確認できたものだけ。未確認は ""）
   mapUrl      : Googleマップ用URL（"" なら名前＋住所から自動生成）
   officialUrl : 公式サイトURL（"" ならボタン非表示）
   sourceMemo  : 情報をいつ・どこで確認したかのメモ
   tags        : タグの配列
   memo        : 利用者向けのひとことメモ
   verified    : true=公式情報で確認済み / false=要確認
--------------------------------------------------------- */
const facilities = [

  /* ================= 市役所・手続き ================= */
  {
    id: 1,
    name: "中津市役所 本庁舎",
    category: "市役所・手続き",
    description: "住民票・戸籍・税金など各種行政手続きの窓口。JR中津駅から徒歩5分ほど。",
    address: "大分県中津市豊田町14-3",
    phone: "0979-22-1111",
    hours: "08:30〜17:15",
    closed: "土曜・日曜・祝日・年末年始",
    mapUrl: "",
    officialUrl: "https://www.city-nakatsu.jp/",
    sourceMemo: "2026年7月 公式サイト等で確認",
    tags: ["住民票", "戸籍", "税金"],
    memo: "一部窓口は時間延長や土日開庁の場合あり。最新情報は公式サイトで。",
    verified: true
  },
  {
    id: 2,
    name: "中津市役所 三光支所",
    category: "市役所・手続き",
    description: "三光地域の窓口。イオンモール三光の近く。一部の手続きは本庁舎のみ対応の場合があります。",
    address: "大分県中津市三光",
    phone: "",
    hours: "",
    closed: "",
    mapUrl: "",
    officialUrl: "https://www.city-nakatsu.jp/",
    sourceMemo: "詳細は市公式サイトで要確認",
    tags: ["支所", "住民票"],
    memo: "",
    verified: false
  },

  /* ================= 病院・歯医者 ================= */
  {
    id: 3,
    name: "中津市立中津市民病院",
    category: "病院・歯医者",
    description: "市立の総合病院。救急告示病院・災害拠点病院。多数の診療科があります。",
    address: "大分県中津市大字下池永173番地",
    phone: "0979-22-2480",
    hours: "08:30〜11:00",
    closed: "土曜・日曜・祝日",
    mapUrl: "",
    officialUrl: "https://nakatsu-hosp.jp/",
    sourceMemo: "2026年7月 公式サイト等で確認（外来受付時間）",
    tags: ["総合病院", "救急告示", "紹介状推奨"],
    memo: "上記は外来受付時間です。診療科により異なる場合があるため、受診前に確認を。",
    verified: true
  },
  {
    id: 4,
    name: "川嶌整形外科病院",
    category: "病院・歯医者",
    description: "中津市内にある整形外科の病院。",
    address: "大分県中津市",
    phone: "",
    hours: "",
    closed: "",
    mapUrl: "",
    officialUrl: "",
    sourceMemo: "診療時間・電話番号は公式情報で要確認",
    tags: ["整形外科"],
    memo: "",
    verified: false
  },
  {
    id: 5,
    name: "中津第一病院",
    category: "病院・歯医者",
    description: "中津市内にある病院。",
    address: "大分県中津市",
    phone: "",
    hours: "",
    closed: "",
    mapUrl: "",
    officialUrl: "",
    sourceMemo: "診療科・診療時間は公式情報で要確認",
    tags: [],
    memo: "",
    verified: false
  },

  /* ================= 薬局 ================= */
  {
    id: 6,
    name: "ドラッグストアコスモス（中津市内 各店舗）",
    category: "薬局",
    description: "九州を中心に展開するドラッグストアチェーン。中津市内に複数店舗があります。",
    address: "大分県中津市内 複数店舗",
    phone: "",
    hours: "",
    closed: "",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("中津市 コスモス ドラッグストア"),
    officialUrl: "https://www.cosmospc.co.jp/",
    sourceMemo: "各店舗の営業時間は公式サイトの店舗検索で要確認",
    tags: ["ドラッグストア", "市販薬", "日用品"],
    memo: "店舗により営業時間・処方箋受付の有無が異なります。",
    verified: false
  },
  {
    id: 7,
    name: "ドラッグストアモリ（中津市内 各店舗）",
    category: "薬局",
    description: "九州を中心に展開するドラッグストアチェーン。中津市内に複数店舗があります。",
    address: "大分県中津市内 複数店舗",
    phone: "",
    hours: "",
    closed: "",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("中津市 ドラッグストアモリ"),
    officialUrl: "https://www.drugstoremori.co.jp/",
    sourceMemo: "各店舗の営業時間は公式サイトの店舗検索で要確認",
    tags: ["ドラッグストア", "市販薬", "日用品"],
    memo: "店舗により営業時間・処方箋受付の有無が異なります。",
    verified: false
  },

  /* ================= ATM・銀行 ================= */
  {
    id: 8,
    name: "大分銀行 中津支店",
    category: "ATM・銀行",
    description: "大分県の地方銀行の中津支店。窓口・ATMがあります。",
    address: "大分県中津市",
    phone: "",
    hours: "",
    closed: "",
    mapUrl: "",
    officialUrl: "https://www.oitabank.co.jp/",
    sourceMemo: "窓口・ATMの時間は公式サイトの店舗検索で要確認",
    tags: ["銀行", "窓口", "ATM"],
    memo: "",
    verified: false
  },
  {
    id: 9,
    name: "豊和銀行 中津支店",
    category: "ATM・銀行",
    description: "大分県の第二地方銀行の中津支店。",
    address: "大分県中津市",
    phone: "",
    hours: "",
    closed: "",
    mapUrl: "",
    officialUrl: "https://www.howabank.co.jp/",
    sourceMemo: "窓口・ATMの時間は公式サイトの店舗検索で要確認",
    tags: ["銀行", "窓口", "ATM"],
    memo: "",
    verified: false
  },
  {
    id: 10,
    name: "中津郵便局（ゆうちょ銀行ATM）",
    category: "ATM・銀行",
    description: "郵便・貯金・ゆうちょ銀行ATMが利用できる中津市の中心的な郵便局。",
    address: "大分県中津市",
    phone: "",
    hours: "",
    closed: "",
    mapUrl: "",
    officialUrl: "https://map.japanpost.jp/",
    sourceMemo: "窓口・ATMの時間は日本郵便の店舗検索で要確認",
    tags: ["郵便", "ゆうちょATM"],
    memo: "ATMと窓口で利用できる時間が異なります。",
    verified: false
  },

  /* ================= コインランドリー ================= */
  {
    id: 11,
    name: "よつばランドリー（イオンモール三光 敷地内）",
    category: "コインランドリー",
    description: "イオンモール三光の敷地内にあるコインランドリー。買い物のついでに利用できます。",
    address: "大分県中津市三光佐知1032（イオンモール三光）",
    phone: "",
    hours: "07:00〜22:30",
    closed: "なし",
    mapUrl: "",
    officialUrl: "https://sankoh.aeonmall.jp/",
    sourceMemo: "2026年7月 イオンモール三光公式サイトで確認",
    tags: ["駐車場あり", "買い物ついで"],
    memo: "営業時間は変更される場合があります。モール公式サイトで確認を。",
    verified: true
  },
  {
    id: 12,
    name: "WASHハウス（中津市内 店舗）",
    category: "コインランドリー",
    description: "九州発のコインランドリーチェーン。中津市内の店舗所在は公式サイトで確認してください。",
    address: "大分県中津市内",
    phone: "",
    hours: "",
    closed: "",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("中津市 コインランドリー"),
    officialUrl: "https://www.wash-house.jp/",
    sourceMemo: "市内の店舗有無・営業時間は公式サイトの店舗検索で要確認",
    tags: ["チェーン店"],
    memo: "",
    verified: false
  },

  /* ================= 安いご飯 ================= */
  {
    id: 13,
    name: "宝来軒 本店",
    category: "安いご飯",
    description: "中津を代表する老舗ラーメン店。「中津ラーメン」の名店として知られています。",
    address: "大分県中津市",
    phone: "",
    hours: "",
    closed: "",
    mapUrl: "",
    officialUrl: "",
    sourceMemo: "営業時間・定休日は要確認",
    tags: ["ラーメン", "老舗"],
    memo: "",
    verified: false
  },
  {
    id: 14,
    name: "ジョイフル（中津市内 各店舗）",
    category: "安いご飯",
    description: "大分県発祥のファミリーレストラン。手頃な価格で定食やドリンクバーが利用できます。",
    address: "大分県中津市内 複数店舗",
    phone: "",
    hours: "",
    closed: "",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("中津市 ジョイフル"),
    officialUrl: "https://www.joyfull.co.jp/",
    sourceMemo: "各店舗の営業時間は公式サイトの店舗検索で要確認",
    tags: ["ファミレス", "大分発祥", "深夜営業店あり"],
    memo: "店舗により営業時間が異なります。",
    verified: false
  },

  /* ================= 弁当・惣菜 ================= */
  {
    id: 15,
    name: "中津からあげ もり山 万田本店",
    category: "弁当・惣菜",
    description: "中津からあげの有名店のひとつ。テイクアウト中心のからあげ専門店です。",
    address: "大分県中津市大字万田",
    phone: "",
    hours: "",
    closed: "",
    mapUrl: "",
    officialUrl: "https://www.moriyama-nakatsu.com/",
    sourceMemo: "営業時間・定休日は公式サイトで要確認",
    tags: ["からあげ", "テイクアウト", "中津名物"],
    memo: "混雑時は電話予約がスムーズです。",
    verified: false
  },
  {
    id: 16,
    name: "中津からあげ ぶんごや 本店",
    category: "弁当・惣菜",
    description: "中津からあげの人気店のひとつ。テイクアウトできます。",
    address: "大分県中津市",
    phone: "",
    hours: "",
    closed: "",
    mapUrl: "",
    officialUrl: "",
    sourceMemo: "営業時間・定休日は要確認",
    tags: ["からあげ", "テイクアウト", "中津名物"],
    memo: "",
    verified: false
  },
  {
    id: 17,
    name: "からあげの鳥しん",
    category: "弁当・惣菜",
    description: "中津からあげの人気店のひとつ。からあげグランプリ受賞歴でも知られます。",
    address: "大分県中津市",
    phone: "",
    hours: "",
    closed: "",
    mapUrl: "",
    officialUrl: "",
    sourceMemo: "営業時間・定休日は要確認",
    tags: ["からあげ", "テイクアウト", "中津名物"],
    memo: "",
    verified: false
  },
  {
    id: 18,
    name: "ほっともっと（中津市内 各店舗）",
    category: "弁当・惣菜",
    description: "持ち帰り弁当チェーン。中津市内に複数店舗があります。",
    address: "大分県中津市内 複数店舗",
    phone: "",
    hours: "",
    closed: "",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("中津市 ほっともっと"),
    officialUrl: "https://www.hottomotto.com/",
    sourceMemo: "各店舗の営業時間は公式サイトの店舗検索で要確認",
    tags: ["弁当", "テイクアウト", "チェーン店"],
    memo: "",
    verified: false
  },

  /* ================= 雨の日に行ける場所 ================= */
  {
    id: 19,
    name: "中津市立小幡記念図書館",
    category: "雨の日に行ける場所",
    description: "無料で過ごせる市立図書館の本館。建築家・槇文彦の設計で公共建築百選にも選ばれています。無料Wi-Fiあり。",
    address: "大分県中津市片端町1366番地1",
    phone: "0979-22-0679",
    hours: "09:00〜19:00",
    closed: "火曜・月末の図書整理休館日・年末年始",
    mapUrl: "",
    officialUrl: "https://libwebsv.city-nakatsu.jp/",
    sourceMemo: "2026年7月 図書館公式サイトで確認",
    tags: ["無料", "屋内", "Wi-Fiあり", "子連れOK"],
    memo: "特別整理休館期間があります。休館日カレンダーは公式サイトで確認を。",
    verified: true
  },
  {
    id: 20,
    name: "イオンモール三光",
    category: "雨の日に行ける場所",
    description: "買い物・食事・映画館（セントラルシネマ三光）まで揃う大型ショッピングモール。",
    address: "大分県中津市三光佐知1032",
    phone: "",
    hours: "10:00〜21:00",
    closed: "なし（臨時休業の場合あり）",
    mapUrl: "",
    officialUrl: "https://sankoh.aeonmall.jp/",
    sourceMemo: "2026年7月 公式サイトで確認（専門店街の時間。売場・店舗により異なる）",
    tags: ["屋内", "映画館", "駐車場あり", "子連れOK"],
    memo: "イオン直営売場は9:00開店など、売場により時間が異なります。",
    verified: true
  },
  {
    id: 21,
    name: "ゆめタウン中津",
    category: "雨の日に行ける場所",
    description: "JR中津駅から徒歩約10分の総合スーパー。食品・衣料・専門店が揃います。",
    address: "大分県中津市蛭子町3丁目99",
    phone: "0979-23-6000",
    hours: "09:30〜21:00",
    closed: "なし（臨時休業の場合あり）",
    mapUrl: "",
    officialUrl: "https://www.izumi.jp/tenpo/nakatsu/",
    sourceMemo: "2026年7月 公式情報等で確認（直営食品売場の時間。専門店は異なる）",
    tags: ["屋内", "駅から徒歩圏", "駐車場あり"],
    memo: "専門店は10:00〜20:00など、売場により時間が異なります。",
    verified: true
  },
  {
    id: 22,
    name: "中津城（奥平家歴史資料館）",
    category: "雨の日に行ける場所",
    description: "黒田官兵衛が築城した中津のシンボル。天守閣内部は資料館になっています。",
    address: "大分県中津市二ノ丁",
    phone: "",
    hours: "",
    closed: "",
    mapUrl: "",
    officialUrl: "https://nakatsujyo.jp/",
    sourceMemo: "開館時間・入場料は公式サイトで要確認",
    tags: ["観光", "歴史", "屋内あり"],
    memo: "",
    verified: false
  },
  {
    id: 23,
    name: "福澤諭吉旧居・福澤記念館",
    category: "雨の日に行ける場所",
    description: "一万円札の肖像で知られる福澤諭吉が青年期を過ごした旧居と記念館。",
    address: "大分県中津市留守居町",
    phone: "",
    hours: "",
    closed: "",
    mapUrl: "",
    officialUrl: "http://fukuzawakyukyo.com/",
    sourceMemo: "開館時間・入館料は公式サイトで要確認",
    tags: ["観光", "歴史", "屋内あり"],
    memo: "",
    verified: false
  },

  /* ================= 釣り場 ================= */
  {
    id: 24,
    name: "山国川 河口周辺",
    category: "釣り場",
    description: "大分・福岡県境を流れる山国川の河口周辺。ハゼ釣りなどで親しまれています。",
    address: "大分県中津市（山国川河口周辺）",
    phone: "",
    hours: "屋外のため特になし",
    closed: "",
    mapUrl: "",
    officialUrl: "",
    sourceMemo: "自然のスポットのため、現地の看板・ルールに従ってください",
    tags: ["ハゼ", "初心者向け", "屋外"],
    memo: "潮の時間と天候を確認し、ライフジャケットの着用をおすすめします。立入禁止区域には入らないでください。",
    verified: false
  },
  {
    id: 25,
    name: "中津港 周辺",
    category: "釣り場",
    description: "中津市の港湾部。周辺は釣りスポットとして知られていますが、立入可能な範囲は現地表示に従ってください。",
    address: "大分県中津市（中津港周辺）",
    phone: "",
    hours: "屋外のため特になし",
    closed: "",
    mapUrl: "",
    officialUrl: "",
    sourceMemo: "港湾施設のため、立入禁止区域・規制は現地表示で要確認",
    tags: ["波止", "屋外"],
    memo: "夜間は暗いためライト必携。関係者以外立入禁止の場所では釣りをしないでください。",
    verified: false
  },

  /* ================= 困った時の相談先 ================= */
  {
    id: 26,
    name: "消費者ホットライン",
    category: "困った時の相談先",
    description: "詐欺・悪質商法・契約トラブルなど、消費生活の相談窓口を案内してくれる全国共通の電話番号です。",
    address: "",
    phone: "188",
    hours: "",
    closed: "",
    mapUrl: "",
    officialUrl: "https://www.caa.go.jp/policies/policy/local_cooperation/local_consumer_administration/hotline/",
    sourceMemo: "全国共通番号（局番なし188）。つながる窓口の受付時間は地域により異なる",
    tags: ["全国共通", "詐欺相談", "契約トラブル"],
    memo: "局番なしで「188（いやや）」。最寄りの消費生活センターにつながります。",
    verified: true
  },
  {
    id: 27,
    name: "中津市消費生活センター",
    category: "困った時の相談先",
    description: "中津市の消費生活相談窓口。悪質商法や契約トラブルについて専門の相談員に相談できます。",
    address: "大分県中津市",
    phone: "",
    hours: "",
    closed: "",
    mapUrl: "",
    officialUrl: "https://www.kokusen.go.jp/map/44/center3737.html",
    sourceMemo: "窓口の場所・直通番号・受付時間は国民生活センターの案内ページで要確認",
    tags: ["詐欺相談", "契約トラブル"],
    memo: "迷ったら全国共通の「188」でもこの窓口を案内してもらえます。",
    verified: false
  },
  {
    id: 28,
    name: "児童相談所 虐待対応ダイヤル",
    category: "困った時の相談先",
    description: "子どもへの虐待かも？と思った時、子育てに悩んだ時の全国共通ダイヤル。24時間365日対応。",
    address: "",
    phone: "189",
    hours: "24時間",
    closed: "なし",
    mapUrl: "",
    officialUrl: "https://www.cfa.go.jp/policies/jidougyakutai/",
    sourceMemo: "全国共通番号（局番なし189）",
    tags: ["全国共通", "24時間", "子ども", "通話無料"],
    memo: "局番なしで「189（いちはやく）」。匿名でも相談できます。",
    verified: true
  },
  {
    id: 29,
    name: "警察相談専用電話",
    category: "困った時の相談先",
    description: "事件かどうか分からない困りごと（ストーカー・近隣トラブル・悪質商法など）を警察に相談できる全国共通番号。緊急時は110番へ。",
    address: "",
    phone: "#9110",
    hours: "",
    closed: "",
    mapUrl: "",
    officialUrl: "https://www.npa.go.jp/bureau/safetylife/soudan.html",
    sourceMemo: "全国共通番号（#9110）。受付時間は都道府県により異なる",
    tags: ["全国共通", "警察", "ストーカー", "トラブル"],
    memo: "緊急の事件・事故は迷わず110番してください。",
    verified: true
  },
  {
    id: 30,
    name: "よりそいホットライン",
    category: "困った時の相談先",
    description: "暮らしの困りごと、こころの悩みなど、どんなことでも無料で相談できる電話窓口。24時間対応。",
    address: "",
    phone: "0120-279-338",
    hours: "24時間",
    closed: "なし",
    mapUrl: "",
    officialUrl: "https://www.since2011.net/yorisoi/",
    sourceMemo: "全国共通・通話無料（一般社団法人社会的包摂サポートセンター運営）",
    tags: ["全国共通", "24時間", "通話無料", "こころの相談"],
    memo: "つながりにくい時間帯もありますが、何度でもかけられます。",
    verified: true
  },
  {
    id: 31,
    name: "中津市社会福祉協議会",
    category: "困った時の相談先",
    description: "生活のこと・福祉のことなど、暮らしの困りごとの相談先。貸付や支援制度の窓口でもあります。",
    address: "大分県中津市",
    phone: "",
    hours: "",
    closed: "",
    mapUrl: "",
    officialUrl: "",
    sourceMemo: "窓口の場所・電話番号・受付時間は公式情報で要確認",
    tags: ["生活相談", "福祉"],
    memo: "",
    verified: false
  },
  {
    id: 32,
    name: "中津市 福祉・子育ての総合相談（市役所）",
    category: "困った時の相談先",
    description: "介護・障がい・子育てなど、どこに相談すればいいか分からない時は、まず市役所の総合窓口へ。",
    address: "大分県中津市豊田町14-3（中津市役所）",
    phone: "0979-22-1111",
    hours: "08:30〜17:15",
    closed: "土曜・日曜・祝日・年末年始",
    mapUrl: "",
    officialUrl: "https://www.city-nakatsu.jp/",
    sourceMemo: "2026年7月 市代表番号・開庁時間を確認（担当課への取次ぎ）",
    tags: ["生活相談", "子育て", "介護"],
    memo: "代表番号にかけて相談内容を伝えると、担当の窓口につないでもらえます。",
    verified: true
  }
];


/* ---------------------------------------------------------
   3. アプリの状態
--------------------------------------------------------- */
const state = {
  keyword: "",
  category: "all",     // "all"=すべて / "favorites"=お気に入りのみ / それ以外はカテゴリ名
  openNowOnly: false,
  favorites: []
};

const FAVORITES_KEY = "nakatsu_kurashi_navi_favorites";


/* ---------------------------------------------------------
   4. localStorage まわり（お気に入りの保存・読み込み）
--------------------------------------------------------- */
function loadFavorites() {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    state.favorites = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(state.favorites)) {
      state.favorites = [];
    }
  } catch (e) {
    console.warn("お気に入りの読み込みに失敗しました", e);
    state.favorites = [];
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites));
  } catch (e) {
    console.warn("お気に入りの保存に失敗しました", e);
  }
}


/* ---------------------------------------------------------
   5. トースト通知（画面下にふわっと出る小さいメッセージ）
--------------------------------------------------------- */
let toastTimer = null;

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2000);
}


/* ---------------------------------------------------------
   6. お気に入りの追加・解除
--------------------------------------------------------- */
function toggleFavorite(id, btnElement) {
  const facility = facilities.find(function (f) { return f.id === id; });
  const index = state.favorites.indexOf(id);
  let added;

  if (index === -1) {
    state.favorites.push(id);
    added = true;
  } else {
    state.favorites.splice(index, 1);
    added = false;
  }
  saveFavorites();

  if (btnElement) {
    btnElement.classList.add("pop");
  }

  const name = facility ? facility.name : "施設";
  showToast(added ? "⭐ 「" + name + "」をお気に入りに追加しました" : "「" + name + "」をお気に入りから外しました");

  // アニメーションが見えるように少しだけ待ってから再描画する
  setTimeout(render, 180);
}


/* ---------------------------------------------------------
   7. 「今営業中っぽいか」を判定する処理（簡易判定）

   ★重要ルール★
   営業時間が未確認（空文字）や、"HH:MM〜HH:MM"の形で
   読み取れない施設は「判定対象外（unknown）」にします。
   「営業中っぽい施設だけ表示」がONの時、unknownの施設は
   表示されません。
--------------------------------------------------------- */
function getOpenStatus(facility) {
  // 営業時間が未確認の施設は判定しない
  if (!facility.hours) {
    return { state: "unknown", label: "" };
  }

  const now = new Date();
  const weekdayKanji = ["日", "月", "火", "水", "木", "金", "土"][now.getDay()];

  // 定休日が確認できていて、今日が定休日なら「本日定休日」
  if (facility.closed && facility.closed.includes(weekdayKanji)) {
    return { state: "closed", label: "本日定休日" };
  }

  // 「24時間」と確認できている場合は常に営業中扱い
  if (facility.hours.includes("24時間")) {
    return { state: "open", label: "24時間対応" };
  }

  // "09:00〜18:00" のような形式から開始・終了時刻を読み取る
  const match = facility.hours.match(/(\d{1,2}):(\d{2}).*?(\d{1,2}):(\d{2})/);
  if (!match) {
    // 時刻として読み取れない（「屋外のため特になし」など）→ 判定対象外
    return { state: "unknown", label: "" };
  }

  const startMinutes = Number(match[1]) * 60 + Number(match[2]);
  const endMinutes = Number(match[3]) * 60 + Number(match[4]);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  let isOpen;
  if (endMinutes <= startMinutes) {
    // 日をまたぐ営業のケース
    isOpen = nowMinutes >= startMinutes || nowMinutes < endMinutes;
  } else {
    isOpen = nowMinutes >= startMinutes && nowMinutes < endMinutes;
  }

  return isOpen
    ? { state: "open", label: "営業中かも" }
    : { state: "closed", label: "営業時間外かも" };
}


/* ---------------------------------------------------------
   8. Googleマップ用URLを取得する
   mapUrl が空の施設は、施設名＋住所から検索URLを自動生成します。
--------------------------------------------------------- */
function getMapUrl(facility) {
  if (facility.mapUrl) {
    return facility.mapUrl;
  }
  const query = (facility.name + " " + (facility.address || "大分県中津市")).trim();
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
}


/* ---------------------------------------------------------
   9. 絞り込み処理
--------------------------------------------------------- */
function getFilteredFacilities() {
  return facilities.filter(function (facility) {

    if (state.category === "favorites") {
      if (state.favorites.indexOf(facility.id) === -1) return false;
    } else if (state.category !== "all") {
      if (facility.category !== state.category) return false;
    }

    if (state.keyword) {
      const target = [
        facility.name,
        facility.description,
        facility.category,
        facility.tags.join(" ")
      ].join(" ").toLowerCase();

      if (target.indexOf(state.keyword.toLowerCase()) === -1) return false;
    }

    // 「営業中っぽい施設だけ」ON時：
    // openと判定できた施設だけ残す（unknown＝営業時間未確認は表示しない）
    if (state.openNowOnly) {
      const status = getOpenStatus(facility);
      if (status.state !== "open") return false;
    }

    return true;
  });
}


/* ---------------------------------------------------------
   10. 1件分の施設カードのHTMLを作る
--------------------------------------------------------- */
function createCardHtml(facility) {
  const isFavorite = state.favorites.indexOf(facility.id) !== -1;
  const status = getOpenStatus(facility);
  const icon = CATEGORY_ICON_MAP[facility.category] || "📍";

  // カテゴリ色分け用のクラス（.cat-0 〜 .cat-9）
  const colorIndex = CATEGORY_COLOR_INDEX[facility.category];
  const colorClass = colorIndex !== undefined ? "cat-" + colorIndex : "";

  // 確認済み／要確認バッジ
  const verifiedBadge = facility.verified
    ? '<span class="badge-verified is-verified">✔ 確認済み</span>'
    : '<span class="badge-verified is-unverified">⚠ 要確認</span>';

  // 営業状況バッジ（判定できた場合のみ）
  const statusBadge = status.label
    ? '<span class="badge-status ' +
      (status.state === "open" ? "status-open" : "status-closed") +
      '">' + status.label + "</span>"
    : "";

  const tagsHtml = facility.tags
    .map(function (tag) { return '<span class="tag">#' + tag + "</span>"; })
    .join("");

  const memoHtml = facility.memo
    ? '<p class="card-memo">💡 ' + facility.memo + "</p>"
    : "";

  // 情報源メモ（いつ・どこで確認したか）
  const sourceHtml = facility.sourceMemo
    ? '<p class="card-source">🔎 ' + facility.sourceMemo + "</p>"
    : "";

  // 未確認の項目は「要確認」とオレンジで表示する
  function infoValue(value) {
    return value
      ? value
      : '<span class="value-unverified">要確認</span>';
  }

  // --- ボタン類 ---
  // 地図で見る（mapUrlが空なら自動生成URLを使う。住所も名前もある施設のみ表示）
  const mapButton = facility.address
    ? '<a class="map-btn" href="' + getMapUrl(facility) + '" target="_blank" rel="noopener">📍 地図で見る</a>'
    : "";

  // 公式情報を見る（officialUrlがある施設のみ）
  const officialButton = facility.officialUrl
    ? '<a class="official-btn" href="' + facility.officialUrl + '" target="_blank" rel="noopener">🔗 公式情報を見る</a>'
    : "";

  // 電話する（電話番号が確認できた施設のみ。#9110のような番号も安全にリンク化）
  const telButton = facility.phone
    ? '<a class="tel-btn" href="tel:' + encodeURIComponent(facility.phone) + '">📞 電話する</a>'
    : "";

  return (
    '<article class="card ' + colorClass + '" data-id="' + facility.id + '">' +
      '<div class="card-top">' +
        '<div class="card-icon" aria-hidden="true">' + icon + "</div>" +
        '<div class="card-top-text">' +
          '<span class="card-category">' + facility.category + "</span>" +
          '<h3 class="card-title">' + facility.name + "</h3>" +
        "</div>" +
        '<button class="fav-btn" data-id="' + facility.id + '" aria-label="お気に入りに追加・解除" aria-pressed="' + isFavorite + '">' +
          (isFavorite ? "★" : "☆") +
        "</button>" +
      "</div>" +

      '<div class="card-head-status">' + verifiedBadge + statusBadge + "</div>" +

      '<p class="card-desc">' + facility.description + "</p>" +

      '<dl class="card-info">' +
        '<div class="card-info-row"><dt>営業時間</dt><dd>' + infoValue(facility.hours) + "</dd></div>" +
        '<div class="card-info-row"><dt>定休日</dt><dd>' + infoValue(facility.closed) + "</dd></div>" +
        '<div class="card-info-row"><dt>住所</dt><dd>' + infoValue(facility.address) + "</dd></div>" +
        '<div class="card-info-row"><dt>電話</dt><dd>' + infoValue(facility.phone) + "</dd></div>" +
      "</dl>" +

      sourceHtml +

      '<div class="tag-list">' + tagsHtml + "</div>" +
      memoHtml +

      '<div class="card-actions">' +
        mapButton +
        officialButton +
        telButton +
      "</div>" +
    "</article>"
  );
}


/* ---------------------------------------------------------
   11. カテゴリ横スクロールナビの描画（件数付き）
--------------------------------------------------------- */
function renderCategoryNav() {
  const nav = document.getElementById("categoryScroll");
  if (!nav) return;

  const allActive = state.category === "all" ? "active" : "";
  let html = '<button class="cat-btn ' + allActive + '" data-category="all">すべて <span class="cat-count">(' + facilities.length + ")</span></button>";

  CATEGORIES.forEach(function (c) {
    const count = facilities.filter(function (f) { return f.category === c.key; }).length;
    const active = state.category === c.key ? "active" : "";
    html += '<button class="cat-btn ' + active + '" data-category="' + c.key + '">' +
      c.icon + " " + c.key + ' <span class="cat-count">(' + count + ")</span></button>";
  });

  nav.innerHTML = html;

  const buttons = nav.querySelectorAll(".cat-btn");
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      state.category = btn.dataset.category;
      renderCategoryNav();
      renderFavOnlyButton();
      render();
    });
  });
}


/* ---------------------------------------------------------
   12. 「お気に入りだけ表示」ボタンの見た目・件数を更新
--------------------------------------------------------- */
function renderFavOnlyButton() {
  const btn = document.getElementById("favOnlyBtn");
  if (!btn) return;
  const isActive = state.category === "favorites";
  btn.classList.toggle("active", isActive);
  btn.textContent = "⭐ お気に入りだけ表示 (" + state.favorites.length + ")";
}


/* ---------------------------------------------------------
   13. 画面の再描画
--------------------------------------------------------- */
function render() {
  const cardListEl = document.getElementById("cardList");
  const noResultEl = document.getElementById("noResult");
  const resultCountEl = document.getElementById("resultCount");

  if (!cardListEl || !noResultEl || !resultCountEl) {
    console.error("必要なHTML要素が見つかりません。index.htmlのidを確認してください。");
    return;
  }

  const filtered = getFilteredFacilities();

  resultCountEl.textContent = filtered.length + "件の施設が見つかりました";

  if (filtered.length === 0) {
    cardListEl.innerHTML = "";
    noResultEl.textContent = state.openNowOnly
      ? "今の条件では、営業中と判定できる施設が見つかりませんでした。営業時間が未確認（要確認）の施設は対象外です。チェックを外してお試しください。"
      : "条件に合う施設が見つかりませんでした";
    noResultEl.hidden = false;
    renderFavOnlyButton();
    return;
  }

  noResultEl.hidden = true;
  cardListEl.innerHTML = filtered.map(createCardHtml).join("");

  const favButtons = cardListEl.querySelectorAll(".fav-btn");
  favButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      toggleFavorite(Number(btn.dataset.id), btn);
    });
  });

  renderFavOnlyButton();
}


/* ---------------------------------------------------------
   14. 掲載依頼・修正依頼モーダルの開閉
--------------------------------------------------------- */
function openRequestModal() {
  const modal = document.getElementById("requestModal");
  if (modal) modal.hidden = false;
}

function closeRequestModal() {
  const modal = document.getElementById("requestModal");
  if (modal) modal.hidden = true;
}


/* ---------------------------------------------------------
   15. 画面部品のイベント設定
--------------------------------------------------------- */
function setupEvents() {
  const searchForm = document.getElementById("searchForm");
  const keywordInput = document.getElementById("keywordInput");
  const openNowToggle = document.getElementById("openNowToggle");
  const favOnlyBtn = document.getElementById("favOnlyBtn");
  const resetBtn = document.getElementById("resetBtn");
  const postRequestBtn = document.getElementById("postRequestBtn");
  const requestModal = document.getElementById("requestModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");

  if (searchForm && keywordInput) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      state.keyword = keywordInput.value.trim();
      render();
    });

    keywordInput.addEventListener("input", function () {
      state.keyword = keywordInput.value.trim();
      render();
    });
  }

  if (openNowToggle) {
    openNowToggle.addEventListener("change", function () {
      state.openNowOnly = openNowToggle.checked;
      render();
    });
  }

  if (favOnlyBtn) {
    favOnlyBtn.addEventListener("click", function () {
      state.category = state.category === "favorites" ? "all" : "favorites";
      renderCategoryNav();
      render();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      state.keyword = "";
      state.category = "all";
      state.openNowOnly = false;

      if (keywordInput) keywordInput.value = "";
      if (openNowToggle) openNowToggle.checked = false;

      renderCategoryNav();
      render();
      showToast("表示をリセットしました");
    });
  }

  if (postRequestBtn) {
    postRequestBtn.addEventListener("click", openRequestModal);
  }
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeRequestModal);
  }
  if (requestModal) {
    requestModal.addEventListener("click", function (e) {
      if (e.target === requestModal) closeRequestModal();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeRequestModal();
  });
}


/* ---------------------------------------------------------
   16. 初期化処理
--------------------------------------------------------- */
function init() {
  loadFavorites();
  setupEvents();
  renderCategoryNav();
  render(); // 初期状態は検索条件が空なので、全施設が表示される
}

document.addEventListener("DOMContentLoaded", init);
