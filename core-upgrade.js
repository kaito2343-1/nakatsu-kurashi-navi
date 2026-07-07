/* ============================================================
   中津くらしナビ 改善パッチ
   - 既存 facilities 配列を活かす
   - 目的別カテゴリで絞り込み
   - キーワード検索とカテゴリ検索を同時利用
   - mapUrlがない場合はGoogleマップ検索URLを自動生成
   - 確認済み / 要確認 / 最終更新日を表示
   ============================================================ */

(function () {
  const CATEGORY_PRESETS = [
    {
      key: "all",
      label: "すべて",
      icon: "🔎",
      test: function () { return true; }
    },
    {
      key: "飲食店",
      label: "飲食店",
      icon: "🍽️",
      words: ["飲食", "ご飯", "安いご飯", "弁当", "惣菜", "ランチ", "居酒屋", "夜ご飯", "ラーメン", "カフェ", "焼肉", "寿司", "からあげ", "食堂", "レストラン", "ファミレス", "バー", "焼き鳥", "海鮮", "テイクアウト"]
    },
    {
      key: "居酒屋",
      label: "居酒屋",
      icon: "🍺",
      words: ["居酒屋", "夜ご飯", "焼き鳥", "串", "バー", "大衆酒場", "飲み会", "海鮮", "刺身", "二軒目"]
    },
    {
      key: "ラーメン",
      label: "ラーメン",
      icon: "🍜",
      words: ["ラーメン", "中華", "麺", "しおラーメン", "豚骨"]
    },
    {
      key: "カフェ",
      label: "カフェ",
      icon: "☕",
      words: ["カフェ", "喫茶", "コーヒー", "coffee", "スイーツ"]
    },
    {
      key: "病院",
      label: "病院",
      icon: "🏥",
      words: ["病院", "歯医者", "歯科", "クリニック", "内科", "整形", "外科", "救急"]
    },
    {
      key: "薬局",
      label: "薬局",
      icon: "💊",
      words: ["薬局", "ドラッグ", "市販薬", "処方箋"]
    },
    {
      key: "駐車場",
      label: "駐車場",
      icon: "🅿️",
      words: ["駐車場", "パーキング", "コインパーキング", "駐車"]
    },
    {
      key: "スーパー",
      label: "スーパー",
      icon: "🛒",
      words: ["スーパー", "買い物", "ショッピング", "ゆめタウン", "イオン", "モール", "マーケット", "食品", "shopping"]
    },
    {
      key: "観光",
      label: "観光",
      icon: "🏯",
      words: ["観光", "中津城", "福澤", "福沢", "歴史", "資料館", "記念館", "寺", "神社", "道の駅", "温泉"]
    },
    {
      key: "生活",
      label: "生活",
      icon: "🏠",
      words: ["生活", "市役所", "手続き", "銀行", "ATM", "郵便", "コインランドリー", "相談", "福祉", "子育て", "図書館", "ホテル", "美容", "車", "修理"]
    }
  ];

  function safeText(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function normalizeText(value) {
    return String(value || "").toLowerCase();
  }

  function facilityText(facility) {
    const tags = Array.isArray(facility.tags) ? facility.tags.join(" ") : String(facility.tags || "");
    return [
      facility.name,
      facility.category,
      facility.description,
      facility.address,
      facility.memo,
      facility.sourceMemo,
      tags
    ].join(" ").toLowerCase();
  }

  function matchesPreset(facility, preset) {
    if (!preset || preset.key === "all") return true;
    if (typeof preset.test === "function") return preset.test(facility);

    const text = facilityText(facility);
    return (preset.words || []).some(function (word) {
      return text.indexOf(normalizeText(word)) !== -1;
    });
  }

  function getPresetByKey(key) {
    return CATEGORY_PRESETS.find(function (preset) {
      return preset.key === key;
    });
  }

  function isFacilityVerified(facility) {
    return facility.verified === true ||
      facility.verified === "true" ||
      facility.status === "確認済み" ||
      facility.status === "verified";
  }

  function getUpdatedAt(facility) {
    if (facility.updatedAt) return String(facility.updatedAt);
    if (facility.updated_at) return String(facility.updated_at);

    const memo = String(facility.sourceMemo || "");
    const match = memo.match(/(20\d{2})年\s*(\d{1,2})月/);
    if (match) {
      return match[1] + "/" + Number(match[2]);
    }

    return "要確認";
  }

  function normalizeFacility(facility) {
    if (!facility) return facility;

    if (!Array.isArray(facility.tags)) {
      facility.tags = facility.tags ? String(facility.tags).split(",").map(function (t) {
        return t.trim();
      }).filter(Boolean) : [];
    }

    if (!facility.updatedAt) {
      facility.updatedAt = getUpdatedAt(facility);
    }

    if (facility.status && facility.status === "確認済み") {
      facility.verified = true;
    }

    return facility;
  }

  function normalizeAllFacilities() {
    if (typeof facilities === "undefined" || !Array.isArray(facilities)) return;

    facilities.forEach(normalizeFacility);

    // 重複対策：同じ名前＋住所のカードをできるだけ減らす
    const seen = new Set();
    for (let i = facilities.length - 1; i >= 0; i--) {
      const f = facilities[i];
      const key = String(f.name || "") + "|" + String(f.address || "");
      if (!String(f.name || "").trim()) {
        facilities.splice(i, 1);
        continue;
      }
      if (seen.has(key)) {
        facilities.splice(i, 1);
      } else {
        seen.add(key);
      }
    }
  }

  function getSafeMapUrl(facility) {
    if (typeof getMapUrl === "function") {
      return getMapUrl(facility);
    }

    if (facility.mapUrl) return facility.mapUrl;

    const query = (facility.name + " " + (facility.address || "大分県中津市")).trim();
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
  }

  function getSafeInstagramUrl(facility) {
    if (typeof getInstagramUrl === "function") {
      return getInstagramUrl(facility);
    }
    return facility.instagram || facility.instagramUrl || "";
  }

  function infoValue(value) {
    return value
      ? safeText(value)
      : '<span class="value-unverified">要確認</span>';
  }

  // 既存の「営業中かも」を使わず、普通の表現に変更
  window.getOpenStatus = function (facility) {
    if (!facility || !facility.hours) {
      return { state: "unknown", label: "" };
    }

    const hours = String(facility.hours);

    if (hours.indexOf("24時間") !== -1) {
      return { state: "open", label: "24時間" };
    }

    const now = new Date();
    const weekdayKanji = ["日", "月", "火", "水", "木", "金", "土"][now.getDay()];

    if (facility.closed && String(facility.closed).indexOf(weekdayKanji) !== -1) {
      return { state: "closed", label: "本日定休日" };
    }

    const match = hours.match(/(\d{1,2}):(\d{2}).*?(\d{1,2}):(\d{2})/);
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
      ? { state: "open", label: "営業中" }
      : { state: "closed", label: "営業時間外" };
  };

  window.getFilteredFacilities = function () {
    if (typeof facilities === "undefined" || !Array.isArray(facilities)) return [];

    const preset = getPresetByKey(state.category);

    return facilities.filter(function (facility) {
      normalizeFacility(facility);

      if (state.category === "favorites") {
        if (state.favorites.indexOf(facility.id) === -1) return false;
      } else if (state.category !== "all") {
        if (preset) {
          if (!matchesPreset(facility, preset)) return false;
        } else if (facility.category !== state.category) {
          return false;
        }
      }

      if (state.keyword) {
        const text = facilityText(facility);
        if (text.indexOf(normalizeText(state.keyword)) === -1) return false;
      }

      if (state.openNowOnly) {
        const openStatus = window.getOpenStatus(facility);
        if (openStatus.state !== "open") return false;
      }

      return true;
    });
  };

  window.createCardHtml = function (facility) {
    normalizeFacility(facility);

    const isFavorite = state.favorites.indexOf(facility.id) !== -1;
    const verified = isFacilityVerified(facility);
    const openStatus = window.getOpenStatus(facility);
    const updatedAt = getUpdatedAt(facility);

    const imageUrl = typeof getFacilityImageUrl === "function" ? getFacilityImageUrl(facility) : "";
    const icon = verified ? "✅" : "⚠️";

    const iconHtml = imageUrl
      ? '<div class="card-icon card-photo"><img src="' + safeText(imageUrl) + '" alt="' + safeText(facility.name + "の写真") + '" loading="lazy"></div>'
      : '<div class="card-icon" aria-hidden="true">' + icon + '</div>';

    const verifiedBadge = verified
      ? '<span class="badge-verified is-verified">✅ 確認済み</span>'
      : '<span class="badge-verified is-unverified">⚠️ 要確認</span>';

    const statusBadge = openStatus.label
      ? '<span class="badge-status ' + (openStatus.state === "open" ? "status-open" : "status-closed") + '">' + safeText(openStatus.label) + '</span>'
      : "";

    const updatedBadge = '<span class="badge-updated">最終更新：' + safeText(updatedAt) + '</span>';

    const tagsHtml = Array.isArray(facility.tags)
      ? facility.tags.map(function (tag) {
          return '<span class="tag">#' + safeText(tag) + '</span>';
        }).join("")
      : "";

    const sourceHtml = facility.sourceMemo
      ? '<p class="card-source">情報メモ：' + safeText(facility.sourceMemo) + '</p>'
      : "";

    const memoHtml = facility.memo
      ? '<p class="card-memo">' + safeText(facility.memo) + '</p>'
      : "";

    const mapButton = '<a class="map-btn" href="' + safeText(getSafeMapUrl(facility)) + '" target="_blank" rel="noopener">地図で見る</a>';

    const officialButton = facility.officialUrl
      ? '<a class="official-btn" href="' + safeText(facility.officialUrl) + '" target="_blank" rel="noopener">公式情報</a>'
      : "";

    const instaUrl = getSafeInstagramUrl(facility);
    const instaButton = instaUrl
      ? '<a class="insta-btn" href="' + safeText(instaUrl) + '" target="_blank" rel="noopener noreferrer">Instagram</a>'
      : "";

    const telButton = facility.phone
      ? '<a class="tel-btn" href="tel:' + encodeURIComponent(facility.phone) + '">電話する</a>'
      : "";

    return (
      '<article class="card" data-id="' + safeText(facility.id) + '">' +
        '<div class="card-top">' +
          iconHtml +
          '<div class="card-top-text">' +
            '<span class="card-category">' + safeText(facility.category || "カテゴリ未設定") + '</span>' +
            '<h3 class="card-title">' + safeText(facility.name) + '</h3>' +
          '</div>' +
          '<button class="fav-btn" data-id="' + safeText(facility.id) + '" aria-label="お気に入りに追加・解除" aria-pressed="' + isFavorite + '">' +
            (isFavorite ? "★" : "☆") +
          '</button>' +
        '</div>' +

        '<div class="card-head-status">' +
          verifiedBadge +
          statusBadge +
          updatedBadge +
        '</div>' +

        '<p class="card-desc">' + safeText(facility.description || "施設情報を確認中です。") + '</p>' +

        '<dl class="card-info">' +
          '<div class="card-info-row"><dt>営業時間</dt><dd>' + infoValue(facility.hours) + '</dd></div>' +
          '<div class="card-info-row"><dt>定休日</dt><dd>' + infoValue(facility.closed) + '</dd></div>' +
          '<div class="card-info-row"><dt>住所</dt><dd>' + infoValue(facility.address) + '</dd></div>' +
          '<div class="card-info-row"><dt>電話</dt><dd>' + infoValue(facility.phone) + '</dd></div>' +
        '</dl>' +

        sourceHtml +
        '<div class="tag-list">' + tagsHtml + '</div>' +
        memoHtml +

        '<div class="card-actions">' +
          mapButton +
          officialButton +
          instaButton +
          telButton +
        '</div>' +
      '</article>'
    );
  };

  window.renderCategoryNav = function () {
    const nav = document.getElementById("categoryScroll");
    if (!nav || typeof facilities === "undefined") return;

    normalizeAllFacilities();
    let html = "";

    CATEGORY_PRESETS.forEach(function (preset) {
      const count = preset.key === "all"
        ? facilities.length
        : facilities.filter(function (facility) {
            return matchesPreset(facility, preset);
          }).length;

      const active = state.category === preset.key ? "active" : "";

      html += '<button class="cat-btn ' + active + '" type="button" data-category="' + safeText(preset.key) + '">' +
        safeText(preset.icon + " " + preset.label) +
        ' <span class="cat-count">(' + count + ')</span>' +
      '</button>';
    });

    nav.innerHTML = html;

    nav.querySelectorAll(".cat-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.category = btn.dataset.category;
        window.render();
      });
    });
  };

  window.renderFavOnlyButton = function () {
    const btn = document.getElementById("favOnlyBtn");
    if (!btn) return;

    const active = state.category === "favorites";
    btn.classList.toggle("active", active);
    btn.textContent = active ? "⭐ お気に入り表示中" : "⭐ お気に入りだけ表示";
  };

  window.render = function () {
    normalizeAllFacilities();

    const list = document.getElementById("cardList");
    const resultCount = document.getElementById("resultCount");
    const noResult = document.getElementById("noResult");

    if (!list) return;

    window.renderCategoryNav();
    window.renderFavOnlyButton();

    const filtered = window.getFilteredFacilities();

    list.innerHTML = filtered.map(window.createCardHtml).join("");

    if (resultCount) {
      const catLabel = state.category === "all"
        ? "すべて"
        : state.category === "favorites"
          ? "お気に入り"
          : state.category;

      resultCount.textContent = filtered.length + "件表示中｜カテゴリ：" + catLabel +
        (state.keyword ? "｜検索：" + state.keyword : "");
    }

    if (noResult) {
      noResult.hidden = filtered.length !== 0;
    }

    list.querySelectorAll(".fav-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = Number(btn.dataset.id);
        if (typeof toggleFavorite === "function") {
          toggleFavorite(id, btn);
        }
      });
    });
  };

  function setupEvents() {
    const searchForm = document.getElementById("searchForm");
    const keywordInput = document.getElementById("keywordInput");
    const openNowToggle = document.getElementById("openNowToggle");
    const favOnlyBtn = document.getElementById("favOnlyBtn");
    const resetBtn = document.getElementById("resetBtn");
    const postRequestBtn = document.getElementById("postRequestBtn");
    const modal = document.getElementById("requestModal");
    const modalCloseBtn = document.getElementById("modalCloseBtn");

    if (searchForm) {
      searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        state.keyword = keywordInput ? keywordInput.value.trim() : "";
        window.render();
      });
    }

    if (keywordInput) {
      keywordInput.addEventListener("input", function () {
        state.keyword = keywordInput.value.trim();
        window.render();
      });
    }

    if (openNowToggle) {
      openNowToggle.addEventListener("change", function () {
        state.openNowOnly = openNowToggle.checked;
        window.render();
      });
    }

    if (favOnlyBtn) {
      favOnlyBtn.addEventListener("click", function () {
        state.category = state.category === "favorites" ? "all" : "favorites";
        window.render();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        state.category = "all";
        state.keyword = "";
        state.openNowOnly = false;

        if (keywordInput) keywordInput.value = "";
        if (openNowToggle) openNowToggle.checked = false;

        window.render();
      });
    }

    if (postRequestBtn && modal) {
      postRequestBtn.addEventListener("click", function () {
        modal.hidden = false;
      });
    }

    if (modalCloseBtn && modal) {
      modalCloseBtn.addEventListener("click", function () {
        modal.hidden = true;
      });
    }

    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal) {
          modal.hidden = true;
        }
      });
    }
  }

  /* 後から読み込むファイル（phase1/phase2など）がカテゴリ判定を再利用できるように公開 */
  window.NAKATSU_CATEGORY_PRESETS = CATEGORY_PRESETS;
  window.NAKATSU_MATCHES_PRESET = matchesPreset;

  function initializeUpgrade() {
    try {
      if (typeof loadFavorites === "function") {
        loadFavorites();
      }

      setupEvents();
      window.render();

      // Supabaseなど非同期追加データが後から来る場合の再描画
      // ※ window.render を直接渡すと「その時点の関数」が固定されてしまい、
      //   後から読み込む改善レイヤーのrenderが無視されるため、関数で包んで呼ぶ
      setTimeout(function () { window.render(); }, 800);
      setTimeout(function () { window.render(); }, 1800);
    } catch (error) {
      console.error("中津くらしナビ改善パッチでエラー:", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeUpgrade);
  } else {
    initializeUpgrade();
  }
})();

