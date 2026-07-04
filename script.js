/* ============================================================
   中津くらしナビ script.js（公開版）

   このファイルでやっていること：
   1. カテゴリの一覧（アイコン付き・色分け用の番号つき）を管理
   2. 施設データ（facilities配列）をまとめて管理（21件）
   3. キーワード検索・カテゴリ絞り込み・お気に入り絞り込み
   4. 「今営業中っぽいか」を現在時刻から簡易的に判定
   5. カテゴリごとの件数表示・色分け
   6. お気に入りをlocalStorageに保存＋トースト通知＋ボタンアニメ
   7. 掲載依頼モーダルの開閉

   ★施設データを追加・修正したい人へ★
   下の「facilities」配列に、同じ形式でオブジェクトを
   追加するだけで、新しい施設カードが表示されます。

   ★サンプルデータについて★
   isSample: true を付けた施設には、カードに「サンプル」バッジが
   自動で表示されます。実在の施設情報に差し替えたら
   isSample を false にする（または行ごと消す）と、バッジが消えます。
   ============================================================ */


/* ---------------------------------------------------------
   1. カテゴリ一覧
   配列の並び順（0番目〜9番目）が、style.cssの
   .cat-0 〜 .cat-9 の色分けとそのまま対応しています。
--------------------------------------------------------- */
const CATEGORIES = [
  { key: "病院・歯医者",       icon: "🏥" },  // .cat-0 赤
  { key: "薬局",               icon: "💊" },  // .cat-1 緑
  { key: "ATM・銀行",          icon: "🏧" },  // .cat-2 青
  { key: "コインランドリー",   icon: "🧺" },  // .cat-3 水色
  { key: "安いご飯",           icon: "🍚" },  // .cat-4 オレンジ
  { key: "弁当・惣菜",         icon: "🍱" },  // .cat-5 からし色
  { key: "雨の日に行ける場所", icon: "☔" },  // .cat-6 紫
  { key: "釣り場",             icon: "🎣" },  // .cat-7 海の青
  { key: "市役所・手続き",     icon: "🏛️" }, // .cat-8 深緑
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
   2. 施設データ（サンプル・全21件）
   実在店舗の正確な情報ではありません。
--------------------------------------------------------- */
const facilities = [

  // ---------------- 病院・歯医者 ----------------
  {
    id: 1,
    isSample: true,
    name: "なかつ中央病院",
    category: "病院・歯医者",
    description: "内科・外科に対応している総合病院。急な体調不良のときにまず相談しやすい場所です。",
    address: "大分県中津市○○町1-2-3",
    phone: "0979-00-0001",
    hours: "08:30〜17:30",
    closed: "日曜・祝日",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("大分県中津市 中央病院"),
    tags: ["内科", "外科", "急患相談可"],
    memo: "初めての受診は保険証を忘れずに。"
  },
  {
    id: 2,
    isSample: true,
    name: "やまくに歯科クリニック",
    category: "病院・歯医者",
    description: "急な歯の痛みにも対応してくれる歯科医院。",
    address: "大分県中津市△△町4-5-6",
    phone: "0979-00-0002",
    hours: "09:00〜18:00",
    closed: "木曜・日曜",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("大分県中津市 歯科クリニック"),
    tags: ["歯科", "急患対応"],
    memo: "予約優先ですが、痛みが強い場合は電話で相談を。"
  },

  // ---------------- 薬局 ----------------
  {
    id: 3,
    isSample: true,
    name: "なかつ駅前薬局",
    category: "薬局",
    description: "処方箋の受付だけでなく、市販薬の相談にも乗ってくれる薬局です。",
    address: "大分県中津市駅前通り2-1",
    phone: "0979-00-0003",
    hours: "09:00〜19:00",
    closed: "日曜",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("大分県中津市 駅前薬局"),
    tags: ["処方箋", "市販薬相談"],
    memo: "土曜も夕方まで営業。"
  },
  {
    id: 4,
    isSample: true,
    name: "みどり薬局 中津店",
    category: "薬局",
    description: "住宅街にある落ち着いた雰囲気の薬局。",
    address: "大分県中津市□□1-3-2",
    phone: "0979-00-0004",
    hours: "09:00〜18:30",
    closed: "水曜・日曜",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("大分県中津市 みどり薬局"),
    tags: ["処方箋"],
    memo: ""
  },

  // ---------------- ATM・銀行 ----------------
  {
    id: 5,
    isSample: true,
    name: "中津駅前ATMコーナー",
    category: "ATM・銀行",
    description: "駅前にある24時間利用できるATMコーナー。",
    address: "大分県中津市豊田町1-1",
    phone: "",
    hours: "24時間",
    closed: "なし",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("大分県中津市 中津駅前 ATM"),
    tags: ["24時間", "現金引き出し"],
    memo: "深夜・早朝は手数料がかかる場合があります。"
  },
  {
    id: 6,
    isSample: true,
    name: "おおいた信用金庫 中津支店",
    category: "ATM・銀行",
    description: "窓口相談もできる金融機関。ATMコーナーも併設。",
    address: "大分県中津市中央町2-2-2",
    phone: "0979-00-0006",
    hours: "09:00〜15:00",
    closed: "土曜・日曜・祝日",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("大分県中津市 信用金庫"),
    tags: ["窓口相談", "ATM併設"],
    memo: "ATMのみ夜間も利用可。"
  },

  // ---------------- コインランドリー ----------------
  {
    id: 7,
    isSample: true,
    name: "コインランドリー ぴかぴか中津店",
    category: "コインランドリー",
    description: "大型の洗濯機・乾燥機を完備。布団も洗えます。",
    address: "大分県中津市東本町3-3",
    phone: "",
    hours: "24時間",
    closed: "なし",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("大分県中津市 コインランドリー"),
    tags: ["24時間", "布団洗濯可", "無人"],
    memo: "深夜は無人になるため、貴重品の管理に注意してください。"
  },
  {
    id: 8,
    isSample: true,
    name: "コインランドリー ほしぞら店",
    category: "コインランドリー",
    description: "駐車場が広く、車で行きやすいコインランドリー。",
    address: "大分県中津市宮夫1-8",
    phone: "",
    hours: "24時間",
    closed: "なし",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("大分県中津市 コインランドリー ほしぞら"),
    tags: ["24時間", "駐車場あり"],
    memo: ""
  },

  // ---------------- 安いご飯 ----------------
  {
    id: 9,
    isSample: true,
    name: "食堂 なかつ屋",
    category: "安いご飯",
    description: "定食が500円台から食べられる昔ながらの食堂。",
    address: "大分県中津市本町1-4",
    phone: "0979-00-0009",
    hours: "11:00〜14:30",
    closed: "日曜",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("大分県中津市 食堂"),
    tags: ["定食", "500円台", "ランチ"],
    memo: "お昼どきは混みやすいので12時前後がおすすめ。"
  },
  {
    id: 10,
    isSample: true,
    name: "中津らーめん 山国",
    category: "安いご飯",
    description: "ワンコインで食べられるラーメン店。",
    address: "大分県中津市西谷1-2",
    phone: "0979-00-0010",
    hours: "11:00〜21:00",
    closed: "月曜",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("大分県中津市 ラーメン"),
    tags: ["ラーメン", "ワンコイン"],
    memo: ""
  },

  // ---------------- 弁当・惣菜 ----------------
  {
    id: 11,
    isSample: true,
    name: "お弁当のまつや",
    category: "弁当・惣菜",
    description: "できたてのお弁当・お惣菜が並ぶ人気店。",
    address: "大分県中津市南町2-9",
    phone: "0979-00-0011",
    hours: "10:00〜19:00",
    closed: "火曜",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("大分県中津市 お弁当"),
    tags: ["弁当", "惣菜", "テイクアウト"],
    memo: "夕方は売り切れることもあります。"
  },
  {
    id: 12,
    isSample: true,
    name: "スーパーよしだ 惣菜コーナー",
    category: "弁当・惣菜",
    description: "スーパー内の惣菜コーナー。夜遅くまで営業。",
    address: "大分県中津市吉田町3-1",
    phone: "0979-00-0012",
    hours: "09:00〜21:00",
    closed: "なし",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("大分県中津市 スーパー 惣菜"),
    tags: ["惣菜", "夜遅くまで営業"],
    memo: "20時以降は割引になることが多いです。"
  },

  // ---------------- 雨の日に行ける場所 ----------------
  {
    id: 13,
    isSample: true,
    name: "中津市立図書館",
    category: "雨の日に行ける場所",
    description: "無料で過ごせる図書館。子ども向けスペースもあります。",
    address: "大分県中津市二ノ丁1-1",
    phone: "0979-00-0013",
    hours: "09:30〜18:00",
    closed: "月曜",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("大分県中津市 図書館"),
    tags: ["無料", "子連れOK", "屋内"],
    memo: "自習スペースもありますが、席数に限りがあります。"
  },
  {
    id: 14,
    isSample: true,
    name: "イオンモール中津",
    category: "雨の日に行ける場所",
    description: "買い物・食事・映画までまとめて楽しめる屋内施設。",
    address: "大分県中津市三光○○",
    phone: "0979-00-0014",
    hours: "10:00〜21:00",
    closed: "なし",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("中津市 イオンモール"),
    tags: ["屋内", "子連れOK", "駐車場あり"],
    memo: ""
  },

  // ---------------- 釣り場 ----------------
  {
    id: 15,
    isSample: true,
    name: "山国川 河口付近",
    category: "釣り場",
    description: "初心者にも人気の釣りスポット。ハゼやシーバスが狙えます。",
    address: "大分県中津市大字○○（山国川河口付近）",
    phone: "",
    hours: "24時間",
    closed: "なし",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("中津市 山国川 河口"),
    tags: ["ハゼ", "シーバス", "初心者向け"],
    memo: "満潮・干潮の時間を事前に確認しておくと安全です。"
  },
  {
    id: 16,
    isSample: true,
    name: "中津港 北岸壁",
    category: "釣り場",
    description: "足場が良く、家族連れの釣りにも人気の岸壁。",
    address: "大分県中津市大字角木（中津港周辺）",
    phone: "",
    hours: "24時間",
    closed: "なし",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("中津港 北岸壁"),
    tags: ["家族向け", "足場良好"],
    memo: "夜間は暗いのでライトを忘れずに。"
  },

  // ---------------- 市役所・手続き ----------------
  {
    id: 17,
    isSample: true,
    name: "中津市役所 本庁舎",
    category: "市役所・手続き",
    description: "住民票・戸籍・税金など、各種行政手続きの窓口。",
    address: "大分県中津市三本松1-3",
    phone: "0979-00-0017",
    hours: "08:30〜17:15",
    closed: "土曜・日曜・祝日",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("中津市役所"),
    tags: ["住民票", "戸籍", "税金"],
    memo: "混雑しやすい月曜午前・月末は時間に余裕を持って。"
  },
  {
    id: 18,
    isSample: true,
    name: "中津市役所 三光支所",
    category: "市役所・手続き",
    description: "本庁舎より空いていることが多い支所窓口。",
    address: "大分県中津市三光○○",
    phone: "0979-00-0018",
    hours: "08:30〜17:15",
    closed: "土曜・日曜・祝日",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("中津市役所 三光支所"),
    tags: ["住民票", "空いていることが多い"],
    memo: "手続き内容によっては本庁舎のみ対応の場合もあります。"
  },

  // ---------------- 困った時の相談先 ----------------
  {
    id: 19,
    isSample: true,
    name: "中津市 福祉なんでも相談窓口",
    category: "困った時の相談先",
    description: "生活・介護・子育てなど、どこに相談したらいいか分からないときの総合窓口。",
    address: "大分県中津市三本松1-3（市役所内）",
    phone: "0979-00-0019",
    hours: "09:00〜17:00",
    closed: "土曜・日曜・祝日",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("中津市 福祉相談"),
    tags: ["生活相談", "介護", "子育て"],
    memo: "電話でも相談を受け付けています。まずは電話をおすすめします。"
  },
  {
    id: 20,
    isSample: true,
    name: "中津市消費生活センター",
    category: "困った時の相談先",
    description: "詐欺やトラブルなど、お金にまつわる心配ごとの相談先。",
    address: "大分県中津市三本松1-3（市役所内）",
    phone: "0979-00-0020",
    hours: "09:00〜16:00",
    closed: "土曜・日曜・祝日",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("中津市 消費生活センター"),
    tags: ["詐欺相談", "契約トラブル"],
    memo: "一人で悩まず、まずは電話してみましょう。"
  },
  {
    id: 21,
    isSample: true,
    name: "24時間子どもSOSダイヤル",
    category: "困った時の相談先",
    description: "子どものこと・家庭のことで困った時に24時間相談できる電話窓口。",
    address: "電話相談のため所在地はありません",
    phone: "0120-00-0021",
    hours: "24時間",
    closed: "なし",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("中津市 子ども 相談"),
    tags: ["子ども", "24時間", "電話相談", "無料"],
    memo: "夜間や休日でもかけられます。ひとりで抱え込まないでください。"
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

  // 前の表示タイマーが残っていたら消してから、2秒後に隠す
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2000);
}


/* ---------------------------------------------------------
   6. お気に入りの追加・解除
   ・星のポップアニメーション
   ・トーストで「追加しました／解除しました」を通知
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

  // ボタンにポップアニメーションを付ける（render前に一瞬だけ見せる）
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
--------------------------------------------------------- */
function getOpenStatus(facility) {
  const now = new Date();
  const weekdayKanji = ["日", "月", "火", "水", "木", "金", "土"][now.getDay()];

  if (facility.closed && facility.closed.includes(weekdayKanji)) {
    return { state: "closed", label: "本日定休日" };
  }

  if (facility.hours && facility.hours.includes("24時間")) {
    return { state: "open", label: "24時間対応" };
  }

  const match = facility.hours ? facility.hours.match(/(\d{1,2}):(\d{2}).*?(\d{1,2}):(\d{2})/) : null;
  if (!match) {
    return { state: "unknown", label: "" };
  }

  const startMinutes = Number(match[1]) * 60 + Number(match[2]);
  const endMinutes = Number(match[3]) * 60 + Number(match[4]);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  let isOpen;
  if (endMinutes <= startMinutes) {
    isOpen = nowMinutes >= startMinutes || nowMinutes < endMinutes;
  } else {
    isOpen = nowMinutes >= startMinutes && nowMinutes < endMinutes;
  }

  return isOpen
    ? { state: "open", label: "営業中かも" }
    : { state: "closed", label: "営業時間外かも" };
}


/* ---------------------------------------------------------
   8. 絞り込み処理
   検索条件がすべて空・オフのときは全件返す（＝初期表示は全件）
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

    if (state.openNowOnly) {
      const status = getOpenStatus(facility);
      if (status.state !== "open") return false;
    }

    return true;
  });
}


/* ---------------------------------------------------------
   9. 1件分の施設カードのHTMLを作る
--------------------------------------------------------- */
function createCardHtml(facility) {
  const isFavorite = state.favorites.indexOf(facility.id) !== -1;
  const status = getOpenStatus(facility);
  const icon = CATEGORY_ICON_MAP[facility.category] || "📍";

  // カテゴリ色分け用のクラス（.cat-0 〜 .cat-9）
  const colorIndex = CATEGORY_COLOR_INDEX[facility.category];
  const colorClass = colorIndex !== undefined ? "cat-" + colorIndex : "";

  // サンプルデータには「サンプル」バッジを付ける
  const sampleBadge = facility.isSample
    ? '<span class="sample-badge">サンプル</span>'
    : "";

  const statusHtml = status.label
    ? '<div class="card-head-status"><span class="badge-status ' +
      (status.state === "open" ? "status-open" : "status-closed") +
      '">' + status.label + "</span></div>"
    : "";

  const tagsHtml = facility.tags
    .map(function (tag) { return '<span class="tag">#' + tag + "</span>"; })
    .join("");

  const memoHtml = facility.memo
    ? '<p class="card-memo">💡 ' + facility.memo + "</p>"
    : "";

  const telHtml = facility.phone
    ? '<a class="tel-btn" href="tel:' + facility.phone + '">📞 電話する</a>'
    : "";

  return (
    '<article class="card ' + colorClass + '" data-id="' + facility.id + '">' +
      sampleBadge +
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

      statusHtml +

      '<p class="card-desc">' + facility.description + "</p>" +

      '<dl class="card-info">' +
        '<div class="card-info-row"><dt>営業時間</dt><dd>' + (facility.hours || "情報なし") + "</dd></div>" +
        '<div class="card-info-row"><dt>定休日</dt><dd>' + (facility.closed || "情報なし") + "</dd></div>" +
        '<div class="card-info-row"><dt>住所</dt><dd>' + (facility.address || "情報なし") + "</dd></div>" +
      "</dl>" +

      '<div class="tag-list">' + tagsHtml + "</div>" +
      memoHtml +

      '<div class="card-actions">' +
        '<a class="map-btn" href="' + facility.mapUrl + '" target="_blank" rel="noopener">📍 地図で見る</a>' +
        telHtml +
      "</div>" +
    "</article>"
  );
}


/* ---------------------------------------------------------
   10. カテゴリ横スクロールナビの描画（件数付き）
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
   11. 「お気に入りだけ表示」ボタンの見た目・件数を更新
--------------------------------------------------------- */
function renderFavOnlyButton() {
  const btn = document.getElementById("favOnlyBtn");
  if (!btn) return;
  const isActive = state.category === "favorites";
  btn.classList.toggle("active", isActive);
  btn.textContent = "⭐ お気に入りだけ表示 (" + state.favorites.length + ")";
}


/* ---------------------------------------------------------
   12. 画面の再描画
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
      ? "今の条件では、営業中っぽい施設が見つかりませんでした。チェックを外すか、時間をおいて試してください。"
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
   13. 掲載依頼モーダルの開閉
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
   14. 画面部品のイベント設定
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

  // 掲載依頼モーダルの開閉
  if (postRequestBtn) {
    postRequestBtn.addEventListener("click", openRequestModal);
  }
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeRequestModal);
  }
  if (requestModal) {
    // 背景（暗い部分）をタップしても閉じられるようにする
    requestModal.addEventListener("click", function (e) {
      if (e.target === requestModal) closeRequestModal();
    });
  }
  // Escキーでも閉じられるようにする
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeRequestModal();
  });
}


/* ---------------------------------------------------------
   15. 初期化処理
--------------------------------------------------------- */
function init() {
  loadFavorites();
  setupEvents();
  renderCategoryNav();
  render(); // 初期状態は検索条件が空なので、全施設が表示される
}

document.addEventListener("DOMContentLoaded", init);
