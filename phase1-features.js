/* ============================================================
   中津くらしナビ phase1-features.js（機能強化 第1弾）

   このファイルでやっていること（既存ファイルは書き換えず、上から機能を足す方式）：
   1. ふりがな・カタカナ・地名でも見つかる検索（かな正規化＋読みがな辞書）
   2. 大カテゴリ→小カテゴリの2段階カテゴリ
   3. 地名（中津駅周辺・宮島町など）での絞り込み
   4. 位置情報（許可した人だけ）＋「近い順」並び替え＋距離表示
   5. 並び替え：標準／近い順／新着順
   6. 新着コーナー（最新5件）
   7. 中津名物PRコーナー（からあげ・鱧・中津城・城下町・耶馬渓）
   8. 観光モデルコース4本
   9. 条件別ピックアップ（新着・いま営業中・夜・観光・ファミリー）
      ※実際の閲覧数データはないため「人気No.1」等の表現は使いません
   10. 右上ハンバーガーメニュー
   11. ログイン画面の仮UI（将来のSupabase/Firebase認証用の入り口）
   12. ホーム上部から掲載依頼ボタンを退避（メニュー・下部へ）

   読み込み位置：全スクリプトの最後（design-refresh.jsの後）
   ============================================================ */

(function () {
  "use strict";

  /* =========================================================
     0. 便利関数
  ========================================================= */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* かな正規化：カタカナ→ひらがな、全角英数→半角、小文字化 */
  function foldKana(input) {
    return String(input == null ? "" : input)
      .replace(/[\u30a1-\u30f6]/g, function (ch) {
        return String.fromCharCode(ch.charCodeAt(0) - 0x60);
      })
      .replace(/[\uff01-\uff5e]/g, function (ch) {
        return String.fromCharCode(ch.charCodeAt(0) - 0xfee0);
      })
      .replace(/\u3000/g, " ")
      .toLowerCase();
  }

  /* 読みがな辞書：ひらがなで検索された時に、対応する漢字でも探す
     （例：「なかつえき」→「中津駅」も検索対象にする） */
  var READING_ALIASES = {
    "なかつえき": ["中津駅"],
    "なかつじょう": ["中津城"],
    "やばけい": ["耶馬渓", "耶馬溪"],
    "ほんやばけい": ["本耶馬渓"],
    "やまくに": ["山国"],
    "さんこう": ["三光"],
    "おきだい": ["沖代"],
    "おおさだ": ["大貞"],
    "みやじままち": ["宮島町"],
    "しんてんじんまち": ["新天神町"],
    "ひのでまち": ["日ノ出町"],
    "ちゅうおうまち": ["中央町"],
    "びょういん": ["病院"],
    "やっきょく": ["薬局"],
    "ちゅうしゃじょう": ["駐車場"],
    "いざかや": ["居酒屋"],
    "いんしょくてん": ["飲食店"],
    "かんこう": ["観光"],
    "からあげ": ["唐揚げ", "から揚げ"],
    "はも": ["鱧"],
    "おんせん": ["温泉"],
    "こうえん": ["公園"],
    "ぎんこう": ["銀行"],
    "ゆうびんきょく": ["郵便局"],
    "やきにく": ["焼肉", "焼き肉"],
    "べんとう": ["弁当"],
    "しゅうり": ["修理"],
    "やくしょ": ["役所", "市役所"]
  };

  /* 施設1件ぶんの「検索対象テキスト」を作る（かな正規化済み）
     furigana / kana フィールドがあるデータにも対応 */
  function buildSearchText(facility) {
    return foldKana([
      facility.name,
      facility.furigana || facility.kana || "",
      facility.category,
      facility.address || "",
      facility.description || "",
      (facility.areaTags || []).join(" "),
      (facility.tags || []).join(" "),
      facility.memo || ""
    ].join(" "));
  }

  /* キーワード1語が施設にヒットするか（かな＋読みがな辞書） */
  function tokenMatches(token, searchText) {
    if (!token) return true;
    if (searchText.indexOf(token) !== -1) return true;

    var aliases = READING_ALIASES[token];
    if (aliases) {
      for (var i = 0; i < aliases.length; i++) {
        if (searchText.indexOf(foldKana(aliases[i])) !== -1) return true;
      }
    }
    return false;
  }

  /* 2点間の距離（km）を計算する（ハーバサイン式） */
  function distanceKm(lat1, lng1, lat2, lng2) {
    var R = 6371;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLng = (lng2 - lng1) * Math.PI / 180;
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function getLatLng(facility) {
    var lat = Number(facility.lat);
    var lng = Number(facility.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat: lat, lng: lng };
    return null;
  }

  /* キーワード検索欄に文字を入れて検索を実行する */
  function setKeywordAndSearch(keyword) {
    var input = document.getElementById("keywordInput");
    if (!input) return;
    input.value = keyword;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function scrollToEl(el) {
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* Googleマップの検索URL（APIキー不要の公式リンク形式） */
  function mapsSearchUrl(query) {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query + " 中津市");
  }

  /* =========================================================
     1. 追加の状態（既存の state とは別に管理）
  ========================================================= */
  var extra = {
    bigCategory: null,   // 選択中の大カテゴリkey（null=未選択）
    area: null,          // 選択中の地名（null=未選択）
    sortMode: "default", // "default" | "near" | "new"
    location: null,      // { lat, lng } 位置情報を許可した時だけ入る
    locating: false
  };

  /* =========================================================
     2. 大カテゴリ（2段階カテゴリ）の定義
     match: その大カテゴリに含める条件
     subs : 小カテゴリのボタン（category=既存カテゴリに切替 / keyword=検索語）
  ========================================================= */
  var BIG_CATEGORIES = [
    {
      key: "eat", label: "食べる", icon: "🍽️",
      categories: ["飲食店", "ラーメン", "カフェ", "居酒屋"],
      tagWords: ["ランチ", "弁当", "焼肉", "レストラン"],
      subs: [
        { label: "カフェ", category: "カフェ" },
        { label: "居酒屋", category: "居酒屋" },
        { label: "ラーメン", category: "ラーメン" },
        { label: "焼肉", keyword: "焼肉" },
        { label: "ランチ", keyword: "ランチ" },
        { label: "弁当", keyword: "弁当" }
      ]
    },
    {
      key: "drink", label: "飲む", icon: "🍶",
      categories: ["居酒屋"],
      tagWords: ["バー", "スナック", "ラウンジ", "お酒"],
      subs: [
        { label: "居酒屋", category: "居酒屋" },
        { label: "バー", keyword: "バー" },
        { label: "スナック", keyword: "スナック" },
        { label: "ラウンジ", keyword: "ラウンジ" }
      ]
    },
    {
      key: "live", label: "暮らす", icon: "🏠",
      categories: ["スーパー", "薬局", "病院", "駐車場", "生活"],
      tagWords: ["銀行", "ATM", "郵便局"],
      subs: [
        { label: "スーパー", category: "スーパー" },
        { label: "薬局", category: "薬局" },
        { label: "病院", category: "病院" },
        { label: "駐車場", category: "駐車場" },
        { label: "銀行", keyword: "銀行" },
        { label: "郵便局", keyword: "郵便局" }
      ]
    },
    {
      key: "play", label: "遊ぶ", icon: "🎤",
      categories: [],
      tagWords: ["カラオケ", "公園", "温泉", "娯楽", "レジャー"],
      subs: [
        { label: "カラオケ", keyword: "カラオケ" },
        { label: "公園", keyword: "公園" },
        { label: "温泉", keyword: "温泉" }
      ]
    },
    {
      key: "tour", label: "観光", icon: "🏯",
      categories: ["観光"],
      tagWords: ["観光", "からあげ", "名物", "中津城", "耶馬渓"],
      subs: [
        { label: "中津城", keyword: "中津城" },
        { label: "耶馬渓", keyword: "耶馬渓" },
        { label: "からあげ", keyword: "からあげ" },
        { label: "モデルコース", scrollTo: "#modelCourseSection" }
      ]
    },
    {
      key: "help", label: "困った時", icon: "🆘",
      categories: ["病院", "薬局", "駐車場"],
      tagWords: ["修理", "役所", "トイレ", "救急"],
      subs: [
        { label: "病院", category: "病院" },
        { label: "薬局", category: "薬局" },
        { label: "駐車場", category: "駐車場" },
        { label: "修理", keyword: "修理" },
        { label: "役所", keyword: "役所" }
      ]
    },
    {
      key: "family", label: "ファミリー", icon: "👨‍👩‍👧",
      categories: [],
      tagWords: ["子連れ", "座敷", "キッズ", "ベビーカー", "ファミリー"],
      subs: [
        { label: "子連れOK", keyword: "子連れ" },
        { label: "座敷あり", keyword: "座敷" },
        { label: "キッズメニュー", keyword: "キッズ" }
      ]
    },
    {
      key: "night", label: "夜", icon: "🌙",
      categories: ["居酒屋"],
      tagWords: ["深夜", "バー", "スナック", "夜"],
      lateNight: true,
      subs: [
        { label: "居酒屋", category: "居酒屋" },
        { label: "バー", keyword: "バー" },
        { label: "スナック", keyword: "スナック" },
        { label: "深夜営業", keyword: "深夜" }
      ]
    }
  ];

  /* 施設が「22時以降もやっている」かどうか（夜カテゴリ用の目安判定） */
  function isLateNight(facility) {
    if (!facility.hours) return false;
    if (facility.hours.indexOf("24時間") !== -1) return true;
    var m = facility.hours.match(/(\d{1,2}):(\d{2}).*?(\d{1,2}):(\d{2})/);
    if (!m) return false;
    var start = Number(m[1]) * 60 + Number(m[2]);
    var end = Number(m[3]) * 60 + Number(m[4]);
    // 終了が開始より早い＝日をまたぐ営業、または22時以降まで営業
    return end <= start || end >= 22 * 60;
  }

  function matchesBigCategory(facility, big) {
    if (big.categories.indexOf(facility.category) !== -1) return true;

    var text = foldKana(
      (facility.tags || []).join(" ") + " " + (facility.description || "") + " " + facility.name
    );
    for (var i = 0; i < big.tagWords.length; i++) {
      if (text.indexOf(foldKana(big.tagWords[i])) !== -1) return true;
    }
    if (big.lateNight && isLateNight(facility)) return true;
    return false;
  }

  /* =========================================================
     3. 地名リスト
  ========================================================= */
  var AREAS = [
    "中津駅周辺", "宮島町", "新天神町", "日ノ出町", "中央町",
    "沖代", "大貞", "三光", "耶馬渓", "本耶馬渓", "山国"
  ];

  function matchesArea(facility, areaName) {
    // 「中津駅周辺」は「中津駅」でも一致させる
    var words = areaName === "中津駅周辺" ? ["中津駅周辺", "中津駅"] : [areaName];
    var text = foldKana([
      facility.address || "",
      facility.name,
      (facility.areaTags || []).join(" "),
      (facility.tags || []).join(" "),
      facility.description || ""
    ].join(" "));

    return words.some(function (w) { return text.indexOf(foldKana(w)) !== -1; });
  }

  /* =========================================================
     4. 検索・絞り込みの拡張
        既存の getFilteredFacilities を置き換える
        （元のロジック＋かな検索＋大カテゴリ＋地名＋並び替え）
  ========================================================= */
  function extendedGetFiltered() {
    var list = facilities.filter(function (facility) {

      /* --- 既存と同じ：カテゴリ／お気に入り --- */
      if (state.category === "favorites") {
        if (state.favorites.indexOf(facility.id) === -1) return false;
      } else if (state.category !== "all") {
        if (facility.category !== state.category) return false;
      }

      /* --- 強化版キーワード検索（かな対応・複数語対応・住所も対象） --- */
      if (state.keyword) {
        var searchText = buildSearchText(facility);
        var tokens = foldKana(state.keyword).split(/\s+/).filter(Boolean);
        for (var i = 0; i < tokens.length; i++) {
          if (!tokenMatches(tokens[i], searchText)) return false;
        }
      }

      /* --- 既存と同じ：営業中のみ --- */
      if (state.openNowOnly) {
        var status = getOpenStatus(facility);
        if (status.state !== "open") return false;
      }

      /* --- 追加：大カテゴリ --- */
      if (extra.bigCategory) {
        var big = BIG_CATEGORIES.find(function (b) { return b.key === extra.bigCategory; });
        if (big && !matchesBigCategory(facility, big)) return false;
      }

      /* --- 追加：地名 --- */
      if (extra.area && !matchesArea(facility, extra.area)) return false;

      return true;
    });

    /* --- 並び替え --- */
    if (extra.sortMode === "near" && extra.location) {
      list.sort(function (a, b) {
        var pa = getLatLng(a);
        var pb = getLatLng(b);
        if (!pa && !pb) return 0;
        if (!pa) return 1;  // 位置未登録の施設は後ろへ
        if (!pb) return -1;
        var da = distanceKm(extra.location.lat, extra.location.lng, pa.lat, pa.lng);
        var db = distanceKm(extra.location.lat, extra.location.lng, pb.lat, pb.lng);
        return da - db;
      });
    } else if (extra.sortMode === "new") {
      list.sort(function (a, b) {
        var ca = Date.parse(a.createdAt || "") || 0;
        var cb = Date.parse(b.createdAt || "") || 0;
        if (ca !== cb) return cb - ca;
        return (Number(b.id) || 0) - (Number(a.id) || 0); // createdAtが無い施設は掲載順(id)で代用
      });
    }

    return list;
  }

  /* =========================================================
     5. カードへの距離表示（renderの後処理）
  ========================================================= */
  function annotateDistances() {
    if (!extra.location) return;
    var cardList = document.getElementById("cardList");
    if (!cardList) return;

    $all(".card", cardList).forEach(function (card) {
      if (card.querySelector(".badge-distance")) return;
      var id = Number(card.dataset.id);
      var facility = facilities.find(function (f) { return f.id === id; });
      if (!facility) return;
      var p = getLatLng(facility);
      if (!p) return;

      var km = distanceKm(extra.location.lat, extra.location.lng, p.lat, p.lng);
      var label = km < 1
        ? "約" + Math.round(km * 1000) + "m"
        : "約" + (Math.round(km * 10) / 10) + "km";

      var statusRow = card.querySelector(".card-head-status");
      if (statusRow) {
        var badge = document.createElement("span");
        badge.className = "badge-distance";
        badge.textContent = "📍 " + label + "（目安）";
        statusRow.appendChild(badge);
      }
    });
  }

  /* =========================================================
     6. 位置情報（許可した人だけ）
  ========================================================= */
  function requestLocation(onSuccess) {
    if (extra.location) { onSuccess(); return; }
    if (!("geolocation" in navigator)) {
      showToast("この端末では位置情報を利用できません");
      return;
    }
    if (extra.locating) return;
    extra.locating = true;
    showToast("現在地を取得しています…");

    navigator.geolocation.getCurrentPosition(
      function (pos) {
        extra.locating = false;
        extra.location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        onSuccess();
      },
      function () {
        extra.locating = false;
        showToast("位置情報が取得できませんでした（許可しなくてもサイトは使えます）");
        syncSortButtons();
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }

  /* =========================================================
     7. ランドマークのおおよその座標
        ※店舗の座標は事実確認できないため付けません。
          誰でも場所が明確な公共ランドマークのみ、目安として登録。
  ========================================================= */
  var LANDMARK_COORDS = [
    { match: "中津城", lat: 33.6087, lng: 131.1861 },
    { match: "福澤諭吉旧居", lat: 33.6047, lng: 131.1917 },
    { match: "青の洞門", lat: 33.4880, lng: 131.1386 },
    { match: "中津駅", lat: 33.5980, lng: 131.1885 }
  ];

  function attachLandmarkCoords() {
    if (typeof facilities === "undefined") return;
    facilities.forEach(function (f) {
      if (getLatLng(f)) return;
      LANDMARK_COORDS.forEach(function (lm) {
        if (String(f.name || "").indexOf(lm.match) !== -1) {
          f.lat = lm.lat;
          f.lng = lm.lng;
          f.coordsApprox = true;
        }
      });
    });
  }

  /* =========================================================
     8. 検索エリアへのUI追加（大カテゴリ・地名・並び替え）
  ========================================================= */
  function buildSearchExtensions() {
    var hero = $(".hero-search");
    var categoryTitle = $(".category-block-title");
    if (!hero || !categoryTitle) return;

    var wrap = document.createElement("div");
    wrap.className = "p1-search-ext";
    wrap.innerHTML =
      '<p class="p1-block-title">まず目的から選ぶ</p>' +
      '<div class="p1-bigcat-row" id="p1BigCatRow"></div>' +
      '<div class="p1-subcat-row" id="p1SubCatRow" hidden></div>' +
      '<p class="p1-block-title">地名から探す</p>' +
      '<div class="p1-area-row" id="p1AreaRow"></div>' +
      '<div class="p1-sort-row" id="p1SortRow">' +
        '<span class="p1-sort-label">並び替え：</span>' +
        '<button type="button" class="p1-sort-btn is-active" data-sort="default">標準</button>' +
        '<button type="button" class="p1-sort-btn" data-sort="near">📍 近い順</button>' +
        '<button type="button" class="p1-sort-btn" data-sort="new">🆕 新着順</button>' +
      '</div>';

    hero.insertBefore(wrap, categoryTitle);

    renderBigCats();
    renderAreas();

    $all(".p1-sort-btn", wrap).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var mode = btn.dataset.sort;
        if (mode === "near") {
          requestLocation(function () {
            extra.sortMode = "near";
            syncSortButtons();
            render();
            showToast("現在地から近い順に並び替えました（位置が登録済みの施設が先頭になります）");
          });
          return;
        }
        extra.sortMode = mode;
        syncSortButtons();
        render();
      });
    });
  }

  function syncSortButtons() {
    $all(".p1-sort-btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.dataset.sort === extra.sortMode);
    });
  }

  function renderBigCats() {
    var row = document.getElementById("p1BigCatRow");
    if (!row) return;
    row.innerHTML = BIG_CATEGORIES.map(function (big) {
      var active = extra.bigCategory === big.key ? " is-active" : "";
      return '<button type="button" class="p1-bigcat-btn' + active + '" data-big="' + big.key + '">' +
        big.icon + " " + big.label + "</button>";
    }).join("");

    $all(".p1-bigcat-btn", row).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.dataset.big;
        extra.bigCategory = extra.bigCategory === key ? null : key;
        renderBigCats();
        renderSubCats();
        render();
      });
    });
  }

  function renderSubCats() {
    var row = document.getElementById("p1SubCatRow");
    if (!row) return;

    var big = BIG_CATEGORIES.find(function (b) { return b.key === extra.bigCategory; });
    if (!big) {
      row.hidden = true;
      row.innerHTML = "";
      return;
    }

    row.hidden = false;
    row.innerHTML =
      '<span class="p1-subcat-label">' + big.label + "の中から：</span>" +
      big.subs.map(function (sub, i) {
        return '<button type="button" class="p1-subcat-btn" data-i="' + i + '">' + escapeHtml(sub.label) + "</button>";
      }).join("");

    $all(".p1-subcat-btn", row).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var sub = big.subs[Number(btn.dataset.i)];
        if (!sub) return;

        if (sub.scrollTo) {
          scrollToEl($(sub.scrollTo));
          return;
        }
        if (sub.category) {
          state.category = sub.category;
          state.keyword = "";
          var input = document.getElementById("keywordInput");
          if (input) input.value = "";
          renderCategoryNav();
          render();
          scrollToEl($("main"));
          return;
        }
        if (sub.keyword) {
          state.category = "all";
          renderCategoryNav();
          setKeywordAndSearch(sub.keyword);
          scrollToEl($("main"));
        }
      });
    });
  }

  function renderAreas() {
    var row = document.getElementById("p1AreaRow");
    if (!row) return;
    row.innerHTML = AREAS.map(function (area) {
      var active = extra.area === area ? " is-active" : "";
      return '<button type="button" class="p1-area-btn' + active + '" data-area="' + escapeHtml(area) + '">' + escapeHtml(area) + "</button>";
    }).join("");

    $all(".p1-area-btn", row).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var area = btn.dataset.area;
        extra.area = extra.area === area ? null : area;
        renderAreas();
        render();
      });
    });
  }

  /* リセットボタンで追加分もリセットする */
  function hookResetButton() {
    var resetBtn = document.getElementById("resetBtn");
    if (!resetBtn) return;
    resetBtn.addEventListener("click", function () {
      extra.bigCategory = null;
      extra.area = null;
      extra.sortMode = "default";
      renderBigCats();
      renderSubCats();
      renderAreas();
      syncSortButtons();
    });
  }

  /* =========================================================
     9. 新着コーナー（最新5件）
        createdAt がある施設は日付順、無い施設は掲載順(id)で代用。
        実データが無いのに「人気」とは表示しません。
  ========================================================= */
  function buildNewArrivals() {
    var main = $("main");
    if (!main || typeof facilities === "undefined") return;

    var latest = facilities.slice().sort(function (a, b) {
      var ca = Date.parse(a.createdAt || "") || 0;
      var cb = Date.parse(b.createdAt || "") || 0;
      if (ca !== cb) return cb - ca;
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    }).slice(0, 5);

    if (!latest.length) return;

    var section = document.createElement("section");
    section.id = "newArrivalsSection";
    section.className = "p1-section";
    section.innerHTML =
      '<h2 class="p1-section-title">🆕 新着のお店・施設</h2>' +
      '<p class="p1-section-lead">最近このサイトに追加された施設です（掲載順）。</p>' +
      '<div class="p1-chip-list">' +
      latest.map(function (f) {
        return '<button type="button" class="p1-facility-chip" data-name="' + escapeHtml(f.name) + '">' +
          '<span class="p1-chip-cat">' + escapeHtml(f.category) + "</span>" +
          escapeHtml(f.name) +
        "</button>";
      }).join("") +
      "</div>";

    main.parentNode.insertBefore(section, main.nextSibling);

    $all(".p1-facility-chip", section).forEach(function (btn) {
      btn.addEventListener("click", function () {
        setKeywordAndSearch(btn.dataset.name);
        scrollToEl($("main"));
      });
    });
  }

  /* =========================================================
     10. 中津名物PRコーナー
  ========================================================= */
  var MEIBUTSU = [
    {
      title: "中津からあげ",
      icon: "🍗",
      text: "「からあげの聖地」と呼ばれる中津。専門店ごとに味付けが違うので食べ比べが楽しい。",
      keyword: "からあげ",
      map: "中津 からあげ"
    },
    {
      title: "鱧（はも）料理",
      icon: "🐟",
      text: "豊前海の鱧は中津の夏の名物。湯引きや鱧しゃぶを出すお店があります。",
      keyword: "鱧",
      map: "中津 鱧料理"
    },
    {
      title: "中津城",
      icon: "🏯",
      text: "黒田官兵衛が築城した日本三大水城のひとつ。天守閣からは市街と周防灘を一望。",
      keyword: "中津城",
      map: "中津城"
    },
    {
      title: "城下町さんぽ",
      icon: "⛩️",
      text: "寺町の赤壁・合元寺や福澤諭吉旧居など、歩いて回れる歴史スポットが点在。",
      keyword: "城下町",
      map: "中津 寺町"
    },
    {
      title: "耶馬渓",
      icon: "🍁",
      text: "青の洞門や一目八景で知られる景勝地。紅葉シーズンは特に人気。",
      keyword: "耶馬渓",
      map: "耶馬渓"
    }
  ];

  function buildMeibutsu() {
    var anchor = document.getElementById("newArrivalsSection") || $("main");
    if (!anchor) return;

    var section = document.createElement("section");
    section.id = "meibutsuSection";
    section.className = "p1-section";
    section.innerHTML =
      '<h2 class="p1-section-title">🏯 中津の名物・見どころ</h2>' +
      '<p class="p1-section-lead">観光で来た人にまず知ってほしい、中津の定番はこちら。</p>' +
      '<div class="p1-meibutsu-grid">' +
      MEIBUTSU.map(function (m, i) {
        return '<article class="p1-meibutsu-card">' +
          '<div class="p1-meibutsu-icon">' + m.icon + "</div>" +
          '<h3 class="p1-meibutsu-title">' + escapeHtml(m.title) + "</h3>" +
          '<p class="p1-meibutsu-text">' + escapeHtml(m.text) + "</p>" +
          '<div class="p1-meibutsu-actions">' +
            '<button type="button" class="p1-mini-btn" data-keyword="' + escapeHtml(m.keyword) + '">🔍 関連施設を探す</button>' +
            '<a class="p1-mini-btn p1-mini-link" href="' + mapsSearchUrl(m.map) + '" target="_blank" rel="noopener">📍 地図</a>' +
          "</div>" +
        "</article>";
      }).join("") +
      "</div>";

    anchor.parentNode.insertBefore(section, anchor.nextSibling);

    $all(".p1-mini-btn[data-keyword]", section).forEach(function (btn) {
      btn.addEventListener("click", function () {
        setKeywordAndSearch(btn.dataset.keyword);
        scrollToEl($("main"));
      });
    });
  }

  /* =========================================================
     11. 観光モデルコース
  ========================================================= */
  var COURSES = [
    {
      title: "中津駅周辺 ぶらり半日コース",
      icon: "🚉",
      lead: "電車で来た人向け。駅から歩ける範囲でランチと商店街を楽しむコース。",
      stops: [
        { time: "11:30", name: "中津駅 到着", note: "駅の観光案内で地図をもらうのがおすすめ", map: "中津駅" },
        { time: "12:00", name: "駅周辺でからあげランチ", note: "からあげ専門店の食べ比べも◎", keyword: "からあげ", map: "中津駅 からあげ" },
        { time: "13:30", name: "日ノ出町商店街を散策", note: "レトロな商店街をのんびり歩く", keyword: "日ノ出町", map: "中津 日ノ出町商店街" },
        { time: "14:30", name: "カフェでひと休み", note: "気になるカフェを検索して一服", keyword: "カフェ", map: "中津駅 カフェ" }
      ]
    },
    {
      title: "中津城・城下町 歴史さんぽコース",
      icon: "🏯",
      lead: "黒田官兵衛と福澤諭吉ゆかりの地をめぐる王道コース。徒歩で回れます。",
      stops: [
        { time: "10:00", name: "中津城（奥平家歴史資料館）", note: "天守閣からの眺めは必見", keyword: "中津城", map: "中津城" },
        { time: "11:00", name: "寺町・赤壁 合元寺", note: "赤い壁が印象的な寺町エリア", keyword: "寺町", map: "中津 合元寺" },
        { time: "12:00", name: "城下町エリアでランチ", note: "近くの飲食店を検索", keyword: "飲食店", map: "中津城 周辺 ランチ" },
        { time: "13:30", name: "福澤諭吉旧居・記念館", note: "一万円札でおなじみ福澤諭吉の旧居", keyword: "福澤諭吉", map: "福澤諭吉旧居" }
      ]
    },
    {
      title: "中津からあげ 食べ歩きコース",
      icon: "🍗",
      lead: "からあげの聖地を満喫する食いしん坊コース。テイクアウト中心で気軽に。",
      stops: [
        { time: "11:00", name: "1軒目：専門店で定番もも肉", note: "まずは王道の味から", keyword: "からあげ", map: "中津 からあげ専門店" },
        { time: "12:00", name: "2軒目：骨付き・砂ずりに挑戦", note: "お店ごとの味の違いを楽しむ", keyword: "からあげ", map: "中津 からあげ" },
        { time: "13:00", name: "公園でからあげピクニック", note: "買ったからあげを公園でのんびり", keyword: "公園", map: "中津 公園" }
      ]
    },
    {
      title: "ファミリー向け 半日コース",
      icon: "👨‍👩‍👧",
      lead: "子ども連れでも回りやすい、乗り物と自然が中心のコース。",
      stops: [
        { time: "10:00", name: "汽車ぽっぽ食堂・公園エリア", note: "子どもが喜ぶスポットを検索", keyword: "公園", map: "中津 公園" },
        { time: "12:00", name: "座敷ありのお店でランチ", note: "座敷・子連れOKのお店を探す", keyword: "座敷", map: "中津 座敷 ランチ" },
        { time: "14:00", name: "耶馬渓方面へドライブ", note: "車なら青の洞門まで約30分", keyword: "耶馬渓", map: "青の洞門" }
      ]
    }
  ];

  function buildCourses() {
    var anchor = document.getElementById("meibutsuSection") || $("main");
    if (!anchor) return;

    var section = document.createElement("section");
    section.id = "modelCourseSection";
    section.className = "p1-section";
    section.innerHTML =
      '<h2 class="p1-section-title">🗺️ 観光モデルコース</h2>' +
      '<p class="p1-section-lead">初めての中津でも迷わない、目的別のおすすめルートです。所要時間は目安です。</p>' +
      COURSES.map(function (course, ci) {
        return '<details class="p1-course">' +
          '<summary class="p1-course-summary">' + course.icon + " " + escapeHtml(course.title) + "</summary>" +
          '<p class="p1-course-lead">' + escapeHtml(course.lead) + "</p>" +
          '<ol class="p1-course-stops">' +
          course.stops.map(function (stop) {
            return "<li>" +
              '<span class="p1-stop-time">' + escapeHtml(stop.time) + "</span>" +
              '<div class="p1-stop-body">' +
                '<strong>' + escapeHtml(stop.name) + "</strong>" +
                '<p>' + escapeHtml(stop.note) + "</p>" +
                '<div class="p1-stop-actions">' +
                  (stop.keyword
                    ? '<button type="button" class="p1-mini-btn" data-keyword="' + escapeHtml(stop.keyword) + '">🔍 探す</button>'
                    : "") +
                  '<a class="p1-mini-btn p1-mini-link" href="' + mapsSearchUrl(stop.map) + '" target="_blank" rel="noopener">📍 地図</a>' +
                "</div>" +
              "</div>" +
            "</li>";
          }).join("") +
          "</ol>" +
        "</details>";
      }).join("");

    anchor.parentNode.insertBefore(section, anchor.nextSibling);

    $all(".p1-mini-btn[data-keyword]", section).forEach(function (btn) {
      btn.addEventListener("click", function () {
        setKeywordAndSearch(btn.dataset.keyword);
        scrollToEl($("main"));
      });
    });
  }

  /* =========================================================
     12. 条件別ピックアップ
         実際の閲覧数・予約数データはないため、
         「人気No.1」ではなく客観的な条件別リストとして表示します。
  ========================================================= */
  var PICKUP_TABS = [
    {
      key: "new", label: "🆕 新着",
      note: "最近追加された施設（掲載順）",
      pick: function () {
        return facilities.slice().sort(function (a, b) {
          var ca = Date.parse(a.createdAt || "") || 0;
          var cb = Date.parse(b.createdAt || "") || 0;
          if (ca !== cb) return cb - ca;
          return (Number(b.id) || 0) - (Number(a.id) || 0);
        });
      }
    },
    {
      key: "open", label: "🟢 いま営業中",
      note: "営業時間が確認できていて、現在営業中と判定できた施設",
      pick: function () {
        return facilities.filter(function (f) {
          return getOpenStatus(f).state === "open";
        });
      }
    },
    {
      key: "night", label: "🌙 夜に使える",
      note: "22時以降も営業している（または深夜営業タグのある）施設",
      pick: function () {
        return facilities.filter(function (f) {
          return isLateNight(f) || foldKana((f.tags || []).join(" ")).indexOf("深夜") !== -1;
        });
      }
    },
    {
      key: "tour", label: "🏯 観光向け",
      note: "観光カテゴリ・観光タグのある施設",
      pick: function () {
        return facilities.filter(function (f) {
          return f.category === "観光" ||
            foldKana((f.tags || []).join(" ")).indexOf(foldKana("観光")) !== -1;
        });
      }
    },
    {
      key: "family", label: "👨‍👩‍👧 ファミリー",
      note: "座敷・子連れなどのタグが確認できた施設",
      pick: function () {
        var words = ["子連れ", "座敷", "キッズ", "ベビーカー", "ファミリー"];
        return facilities.filter(function (f) {
          var text = foldKana((f.tags || []).join(" ") + " " + (f.description || ""));
          return words.some(function (w) { return text.indexOf(foldKana(w)) !== -1; });
        });
      }
    }
  ];

  function buildPickup() {
    var anchor = document.getElementById("modelCourseSection") || $("main");
    if (!anchor || typeof facilities === "undefined") return;

    var section = document.createElement("section");
    section.id = "pickupSection";
    section.className = "p1-section";
    section.innerHTML =
      '<h2 class="p1-section-title">📋 条件別ピックアップ</h2>' +
      '<p class="p1-section-lead">閲覧数などの実データはまだ無いため、順位ではなく「条件に合う施設」を紹介しています。</p>' +
      '<div class="p1-pickup-tabs">' +
      PICKUP_TABS.map(function (tab, i) {
        return '<button type="button" class="p1-pickup-tab' + (i === 0 ? " is-active" : "") + '" data-tab="' + tab.key + '">' + tab.label + "</button>";
      }).join("") +
      "</div>" +
      '<p class="p1-pickup-note" id="p1PickupNote"></p>' +
      '<div class="p1-chip-list" id="p1PickupList"></div>';

    anchor.parentNode.insertBefore(section, anchor.nextSibling);

    function renderPickup(key) {
      var tab = PICKUP_TABS.find(function (t) { return t.key === key; }) || PICKUP_TABS[0];
      var note = document.getElementById("p1PickupNote");
      var listEl = document.getElementById("p1PickupList");
      if (!note || !listEl) return;

      note.textContent = tab.note;
      var items = tab.pick().slice(0, 5);

      if (!items.length) {
        listEl.innerHTML = '<p class="p1-empty">この条件で確認できた施設はまだありません。</p>';
        return;
      }

      listEl.innerHTML = items.map(function (f) {
        return '<button type="button" class="p1-facility-chip" data-name="' + escapeHtml(f.name) + '">' +
          '<span class="p1-chip-cat">' + escapeHtml(f.category) + "</span>" +
          escapeHtml(f.name) +
        "</button>";
      }).join("");

      $all(".p1-facility-chip", listEl).forEach(function (btn) {
        btn.addEventListener("click", function () {
          setKeywordAndSearch(btn.dataset.name);
          scrollToEl($("main"));
        });
      });
    }

    $all(".p1-pickup-tab", section).forEach(function (btn) {
      btn.addEventListener("click", function () {
        $all(".p1-pickup-tab", section).forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });
        renderPickup(btn.dataset.tab);
      });
    });

    renderPickup("new");
  }

  /* =========================================================
     13. 右上ハンバーガーメニュー
  ========================================================= */
  function buildMenu() {
    var header = $(".site-header");
    if (!header || document.getElementById("p1MenuBtn")) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "p1MenuBtn";
    btn.className = "p1-menu-btn";
    btn.setAttribute("aria-label", "メニューを開く");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = '<span></span><span></span><span></span>';
    header.appendChild(btn);

    var overlay = document.createElement("div");
    overlay.id = "p1MenuOverlay";
    overlay.className = "p1-menu-overlay";
    overlay.hidden = true;
    overlay.innerHTML =
      '<nav class="p1-menu-drawer" aria-label="サイトメニュー">' +
        '<p class="p1-menu-title">メニュー</p>' +
        '<button type="button" class="p1-menu-item" data-action="shops">🏪 店舗一覧</button>' +
        '<button type="button" class="p1-menu-item" data-action="new">🆕 新着</button>' +
        '<button type="button" class="p1-menu-item" data-action="meibutsu">🏯 名物・見どころ</button>' +
        '<button type="button" class="p1-menu-item" data-action="course">🗺️ 観光モデルコース</button>' +
        '<button type="button" class="p1-menu-item" data-action="pickup">📋 条件別ピックアップ</button>' +
        '<button type="button" class="p1-menu-item" data-action="favorites">⭐ お気に入り</button>' +
        '<hr class="p1-menu-hr">' +
        '<button type="button" class="p1-menu-item" data-action="listing">📣 店舗向け掲載案内（無料）</button>' +
        '<button type="button" class="p1-menu-item" data-action="contact">✉️ お問い合わせ</button>' +
        '<button type="button" class="p1-menu-item" data-action="login">👤 ログイン（準備中）</button>' +
        '<button type="button" class="p1-menu-close">閉じる</button>' +
      "</nav>";
    document.body.appendChild(overlay);

    function openMenu() {
      overlay.hidden = false;
      btn.setAttribute("aria-expanded", "true");
    }
    function closeMenu() {
      overlay.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }

    btn.addEventListener("click", function () {
      overlay.hidden ? openMenu() : closeMenu();
    });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeMenu();
    });
    $(".p1-menu-close", overlay).addEventListener("click", closeMenu);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    $all(".p1-menu-item", overlay).forEach(function (item) {
      item.addEventListener("click", function () {
        var action = item.dataset.action;
        closeMenu();

        if (action === "shops") scrollToEl($("main"));
        if (action === "new") scrollToEl($("#newArrivalsSection"));
        if (action === "meibutsu") scrollToEl($("#meibutsuSection"));
        if (action === "course") scrollToEl($("#modelCourseSection"));
        if (action === "pickup") scrollToEl($("#pickupSection"));
        if (action === "favorites") {
          var favBtn = document.getElementById("favOnlyBtn");
          if (favBtn && state.category !== "favorites") favBtn.click();
          scrollToEl($("main"));
        }
        if (action === "listing") scrollToEl($(".free-listing-banner"));
        if (action === "contact") {
          if (typeof openRequestModal === "function") openRequestModal();
        }
        if (action === "login") openLoginModal();
      });
    });
  }

  /* =========================================================
     14. ログイン仮UI（将来のアカウント機能の入り口）

     ★将来ここに認証処理を入れます★
     - Supabase の場合：supabase.auth.signInWithPassword({ email, password })
     - Firebase の場合：signInWithEmailAndPassword(auth, email, password)
     - 実装時は supabase-config.js に auth 用の設定を追加し、
       ログイン成功後に「お気に入りのクラウド同期」を有効化する予定。
     - データ構造案は ACCOUNT-DESIGN.md を参照。
  ========================================================= */
  function buildLoginModal() {
    if (document.getElementById("p1LoginModal")) return;

    var modal = document.createElement("div");
    modal.id = "p1LoginModal";
    modal.className = "modal-overlay";
    modal.hidden = true;
    modal.innerHTML =
      '<div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="p1LoginTitle">' +
        '<h2 class="modal-title" id="p1LoginTitle">ログイン（準備中）</h2>' +
        '<p class="modal-text">アカウント機能は現在準備中です。将来、お気に入りの端末間同期や、店舗さま向けの情報編集機能を予定しています。</p>' +
        '<div class="p1-login-form">' +
          '<label>メールアドレス<input type="email" placeholder="example@email.com" disabled></label>' +
          '<label>パスワード<input type="password" placeholder="********" disabled></label>' +
          '<button type="button" class="modal-form-btn p1-login-submit" disabled>ログイン（準備中）</button>' +
        "</div>" +
        '<p class="modal-text modal-text-sub">現在もお気に入り機能はこの端末内（localStorage）で利用できます。</p>' +
        '<button type="button" class="modal-close-btn" id="p1LoginClose">閉じる</button>' +
      "</div>";
    document.body.appendChild(modal);

    $("#p1LoginClose", modal).addEventListener("click", function () { modal.hidden = true; });
    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.hidden = true;
    });
  }

  function openLoginModal() {
    var modal = document.getElementById("p1LoginModal");
    if (modal) modal.hidden = false;
  }

  /* =========================================================
     15. ホーム上部の掲載依頼ボタンを控えめに
         （home-page-extra.js のヒーロー内の「無料掲載する」ボタンを非表示。
           掲載案内は メニュー／一覧下のバナー／下部ナビ から引き続き利用可能）
  ========================================================= */

  /* =========================================================
     16. スタイル
  ========================================================= */
  function addStyle() {
    if (document.getElementById("p1Style")) return;
    var style = document.createElement("style");
    style.id = "p1Style";
    style.textContent = [
      /* --- ヒーロー内の掲載CTAを控えめに（メニュー・下部に移動済み） --- */
      "body .home-secondary-btn { display: none !important; }",

      /* --- 検索拡張 --- */
      ".p1-block-title { margin: 14px 0 8px; font-size: 11px; font-weight: 700; letter-spacing: .14em; color: var(--kaki, #e05a2b); text-transform: uppercase; }",
      ".p1-bigcat-row, .p1-area-row { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; -webkit-overflow-scrolling: touch; }",
      ".p1-bigcat-btn, .p1-area-btn { flex: none; border: 1px solid var(--hairline, #e3e2da); background: var(--surface, #fff); color: var(--ink, #1b2422); border-radius: 999px; padding: 8px 13px; font-size: 12.5px; font-weight: 700; font-family: inherit; cursor: pointer; }",
      ".p1-bigcat-btn.is-active, .p1-area-btn.is-active { background: var(--pine, #0e5148); border-color: var(--pine, #0e5148); color: #fff; }",
      ".p1-subcat-row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 8px; padding: 10px; background: var(--pine-soft, #e3efec); border-radius: 12px; }",
      ".p1-subcat-label { font-size: 11.5px; font-weight: 700; color: var(--pine, #0e5148); }",
      ".p1-subcat-btn { border: none; background: var(--surface, #fff); color: var(--ink, #1b2422); border-radius: 999px; padding: 7px 12px; font-size: 12px; font-weight: 700; font-family: inherit; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,.06); }",
      ".p1-sort-row { display: flex; align-items: center; gap: 6px; margin-top: 12px; flex-wrap: wrap; }",
      ".p1-sort-label { font-size: 12px; color: var(--ink-sub, #5c6a66); font-weight: 700; }",
      ".p1-sort-btn { border: 1px solid var(--hairline, #e3e2da); background: var(--surface, #fff); color: var(--ink, #1b2422); border-radius: 999px; padding: 7px 12px; font-size: 12px; font-weight: 700; font-family: inherit; cursor: pointer; }",
      ".p1-sort-btn.is-active { background: var(--kaki, #e05a2b); border-color: var(--kaki, #e05a2b); color: #fff; }",

      /* --- 距離バッジ --- */
      ".badge-distance { border-radius: 999px; padding: 3px 9px; font-size: 10.5px; font-weight: 700; background: var(--pine-soft, #e3efec); color: var(--pine, #0e5148); }",

      /* --- 追加セクション共通 --- */
      ".p1-section { margin: 16px 16px 0; padding: 16px; background: var(--surface, #fff); border: 1px solid var(--hairline, #e3e2da); border-radius: var(--r-l, 20px); box-shadow: 0 1px 2px rgba(27,36,34,.05), 0 4px 12px rgba(27,36,34,.06); }",
      ".p1-section-title { margin: 0 0 4px; font-size: 17px; font-weight: 900; color: var(--ink, #1b2422); }",
      ".p1-section-lead { margin: 0 0 12px; font-size: 12.5px; color: var(--ink-sub, #5c6a66); }",
      ".p1-chip-list { display: flex; flex-direction: column; gap: 8px; }",
      ".p1-facility-chip { display: flex; align-items: center; gap: 8px; width: 100%; text-align: left; border: 1px solid var(--hairline, #e3e2da); background: var(--paper, #f2f1ec); color: var(--ink, #1b2422); border-radius: 12px; padding: 11px 12px; font-size: 13.5px; font-weight: 700; font-family: inherit; cursor: pointer; }",
      ".p1-chip-cat { flex: none; font-size: 10.5px; font-weight: 700; color: var(--pine, #0e5148); background: var(--pine-soft, #e3efec); border-radius: 999px; padding: 3px 8px; }",
      ".p1-empty { margin: 0; font-size: 12.5px; color: var(--ink-sub, #5c6a66); }",
      ".p1-mini-btn { border: none; background: var(--pine, #0e5148); color: #fff; border-radius: 9px; padding: 8px 11px; font-size: 11.5px; font-weight: 700; font-family: inherit; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; }",
      ".p1-mini-link { background: var(--kaki, #e05a2b); }",

      /* --- 名物 --- */
      ".p1-meibutsu-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }",
      "@media (min-width: 560px) { .p1-meibutsu-grid { grid-template-columns: 1fr 1fr; } }",
      ".p1-meibutsu-card { border: 1px solid var(--hairline, #e3e2da); background: var(--paper, #f2f1ec); border-radius: 14px; padding: 13px; }",
      ".p1-meibutsu-icon { font-size: 26px; }",
      ".p1-meibutsu-title { margin: 4px 0 4px; font-size: 15px; font-weight: 900; color: var(--ink, #1b2422); }",
      ".p1-meibutsu-text { margin: 0 0 10px; font-size: 12.5px; line-height: 1.6; color: var(--ink-sub, #5c6a66); }",
      ".p1-meibutsu-actions { display: flex; gap: 6px; }",

      /* --- モデルコース --- */
      ".p1-course { border: 1px solid var(--hairline, #e3e2da); border-radius: 14px; background: var(--paper, #f2f1ec); margin-bottom: 8px; overflow: hidden; }",
      ".p1-course-summary { padding: 13px 14px; font-size: 14px; font-weight: 800; color: var(--ink, #1b2422); cursor: pointer; list-style: none; }",
      ".p1-course-summary::-webkit-details-marker { display: none; }",
      ".p1-course[open] .p1-course-summary { border-bottom: 1px solid var(--hairline, #e3e2da); background: var(--surface, #fff); }",
      ".p1-course-lead { margin: 10px 14px; font-size: 12.5px; color: var(--ink-sub, #5c6a66); }",
      ".p1-course-stops { list-style: none; margin: 0; padding: 0 14px 14px; display: flex; flex-direction: column; gap: 10px; }",
      ".p1-course-stops li { display: flex; gap: 10px; }",
      ".p1-stop-time { flex: none; font-size: 11.5px; font-weight: 800; color: #fff; background: var(--pine, #0e5148); border-radius: 999px; padding: 4px 9px; height: fit-content; }",
      ".p1-stop-body strong { font-size: 13.5px; color: var(--ink, #1b2422); }",
      ".p1-stop-body p { margin: 3px 0 7px; font-size: 12px; color: var(--ink-sub, #5c6a66); }",
      ".p1-stop-actions { display: flex; gap: 6px; }",

      /* --- 条件別ピックアップ --- */
      ".p1-pickup-tabs { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 8px; -webkit-overflow-scrolling: touch; }",
      ".p1-pickup-tab { flex: none; border: 1px solid var(--hairline, #e3e2da); background: var(--surface, #fff); color: var(--ink, #1b2422); border-radius: 999px; padding: 8px 13px; font-size: 12px; font-weight: 700; font-family: inherit; cursor: pointer; }",
      ".p1-pickup-tab.is-active { background: var(--pine, #0e5148); border-color: var(--pine, #0e5148); color: #fff; }",
      ".p1-pickup-note { margin: 0 0 10px; font-size: 11.5px; color: var(--ink-sub, #5c6a66); }",

      /* --- ハンバーガーメニュー --- */
      ".site-header { position: relative; }",
      ".p1-menu-btn { position: absolute; top: 16px; right: 16px; z-index: 5; width: 42px; height: 42px; border-radius: 12px; border: 1px solid rgba(255,255,255,.3); background: rgba(255,255,255,.14); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; cursor: pointer; }",
      ".p1-menu-btn span { display: block; width: 18px; height: 2px; border-radius: 2px; background: #fff; }",
      ".p1-menu-overlay { position: fixed; inset: 0; z-index: 1000; background: rgba(9,58,52,.45); backdrop-filter: blur(2px); display: flex; justify-content: flex-end; }",
      ".p1-menu-overlay[hidden] { display: none; }",
      ".p1-menu-drawer { width: min(300px, 84vw); height: 100%; background: var(--surface, #fff); padding: 20px 16px calc(20px + env(safe-area-inset-bottom)); overflow-y: auto; display: flex; flex-direction: column; gap: 6px; box-shadow: -8px 0 30px rgba(0,0,0,.15); }",
      ".p1-menu-title { margin: 0 0 8px; font-size: 15px; font-weight: 900; color: var(--ink, #1b2422); }",
      ".p1-menu-item { border: none; background: transparent; text-align: left; padding: 12px 10px; border-radius: 10px; font-size: 14px; font-weight: 700; color: var(--ink, #1b2422); font-family: inherit; cursor: pointer; }",
      ".p1-menu-item:active { background: var(--pine-soft, #e3efec); }",
      ".p1-menu-hr { border: none; border-top: 1px solid var(--hairline, #e3e2da); margin: 6px 0; }",
      ".p1-menu-close { margin-top: auto; border: 1px solid var(--hairline, #e3e2da); background: var(--paper, #f2f1ec); border-radius: 12px; padding: 12px; font-size: 13px; font-weight: 700; font-family: inherit; color: var(--ink, #1b2422); cursor: pointer; }",

      /* --- ログイン仮フォーム --- */
      ".p1-login-form { display: flex; flex-direction: column; gap: 10px; margin: 12px 0; }",
      ".p1-login-form label { display: flex; flex-direction: column; gap: 4px; font-size: 12px; font-weight: 700; color: var(--ink-sub, #5c6a66); }",
      ".p1-login-form input { border: 1.5px solid var(--hairline, #e3e2da); border-radius: 10px; padding: 11px 12px; font-size: 14px; font-family: inherit; background: var(--paper, #f2f1ec); }",
      ".p1-login-submit[disabled] { opacity: .55; cursor: not-allowed; }"
    ].join("\n");
    document.head.appendChild(style);
  }

  /* =========================================================
     17. 初期化
  ========================================================= */
  function init() {
    if (typeof facilities === "undefined" || typeof state === "undefined") {
      console.warn("phase1-features.js: script.js が先に読み込まれている必要があります。");
      return;
    }

    addStyle();
    attachLandmarkCoords();

    /* 既存の絞り込み関数を強化版に差し替え */
    window.getFilteredFacilities = extendedGetFiltered;

    /* render の後に距離バッジを付ける */
    var originalRender = window.render;
    window.render = function () {
      originalRender();
      annotateDistances();
    };

    buildSearchExtensions();
    hookResetButton();
    buildNewArrivals();
    buildMeibutsu();
    buildCourses();
    buildPickup();
    buildMenu();
    buildLoginModal();

    /* 追加データ（Supabase等）が後から入った時にセクションを更新 */
    document.addEventListener("nakatsu:facilities-updated", function () {
      attachLandmarkCoords();
    });

    /* 強化版の検索条件で初回描画し直す */
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      /* 他のextra系スクリプトのDOM構築が終わってから動かす */
      setTimeout(init, 50);
    });
  } else {
    setTimeout(init, 50);
  }
})();
