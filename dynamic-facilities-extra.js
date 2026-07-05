/* ============================================================
   中津くらしナビ：Supabase施設データ読み込み
   ファイル名：dynamic-facilities-extra.js

   目的：
   - Supabaseの facilities テーブルから施設データを取得
   - 既存の facilities 配列に追加
   - 既存の検索・カテゴリ・カード表示を壊さず再描画
   - 読み込み失敗時は静的データだけで続行
   ============================================================ */

(function () {
  const STATUS_ID = "dynamicFacilitiesStatus";

  function getConfig() {
    return window.NAKATSU_SUPABASE_CONFIG || {};
  }

  function isReady(config) {
    return Boolean(
      config &&
      config.enabled === true &&
      config.url &&
      config.publicKey &&
      config.table
    );
  }

  function cleanBaseUrl(url) {
    return String(url || "").replace(/\/+$/, "");
  }

  function isJwtLike(value) {
    return String(value || "").startsWith("eyJ");
  }

function getHeaders(config) {
  return {
    "apikey": config.publicKey,
    "Authorization": "Bearer " + config.publicKey,
    "Accept": "application/json",
    "Content-Type": "application/json"
  };
}

    // legacy anon key の場合だけ Authorization を付ける
    if (isJwtLike(config.publicKey)) {
      headers.Authorization = "Bearer " + config.publicKey;
    }

    return headers;
  }

  function buildUrl(config) {
    const base = cleanBaseUrl(config.url);
    const table = encodeURIComponent(config.table);
    const params = new URLSearchParams();

    params.set("select", config.selectColumns || "*");

    if (config.onlyPublished !== false) {
      params.set("is_published", "eq.true");
    }

    params.set("order", "sort_order.asc.nullslast");

    return base + "/rest/v1/" + table + "?" + params.toString();
  }

  function normalizeTags(tags) {
    if (Array.isArray(tags)) {
      return tags.filter(Boolean).map(String);
    }

    if (typeof tags === "string") {
      return tags
        .split(",")
        .map(function (item) { return item.trim(); })
        .filter(Boolean);
    }

    return [];
  }

  function makeDynamicId(row, config) {
    const base = Number(config.dynamicIdBase || 900000);
    const rawId = Number(row.id);

    if (Number.isFinite(rawId)) {
      return base + rawId;
    }

    const text = String(row.id || row.name || Date.now());
    let hash = 0;

    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }

    return base + Math.abs(hash % 90000);
  }

  function normalizeFacility(row, config) {
    const name = String(row.name || "").trim();

    if (!name) {
      return null;
    }

    return {
      id: makeDynamicId(row, config),
      supabaseId: row.id,
      dynamicSource: "supabase",
      name: name,
      category: String(row.category || "安いご飯").trim(),
      description: String(row.description || "").trim(),
      address: String(row.address || "").trim(),
      phone: String(row.phone || "").trim(),
      hours: String(row.hours || "").trim(),
      closed: String(row.closed || "").trim(),
      mapUrl: String(row.map_url || "").trim(),
      officialUrl: String(row.official_url || "").trim(),
      instagram: String(row.instagram || "").trim(),
      sourceMemo: String(row.source_memo || "Supabaseから取得").trim(),
      tags: normalizeTags(row.tags),
      memo: String(row.memo || "").trim(),
      verified: Boolean(row.verified)
    };
  }

  function addStatus(message, type) {
    let status = document.getElementById(STATUS_ID);

    if (!status) {
      status = document.createElement("p");
      status.id = STATUS_ID;
      status.className = "dynamic-facilities-status";

      const resultCount = document.getElementById("resultCount");
      if (resultCount && resultCount.parentNode) {
        resultCount.parentNode.insertBefore(status, resultCount.nextSibling);
      }
    }

    if (!status) return;

    status.textContent = message;
    status.dataset.type = type || "info";
  }

  function addStatusStyle() {
    if (document.getElementById("dynamicFacilitiesStyle")) return;

    const style = document.createElement("style");
    style.id = "dynamicFacilitiesStyle";
    style.textContent = `
      .dynamic-facilities-status {
        margin: 6px 16px 10px;
        padding: 9px 11px;
        border-radius: 999px;
        background: #f8fafc;
        color: #475569;
        font-size: 12px;
        font-weight: 700;
        text-align: center;
      }

      .dynamic-facilities-status[data-type="success"] {
        background: #ecfdf5;
        color: #047857;
      }

      .dynamic-facilities-status[data-type="error"] {
        background: #fff7ed;
        color: #c2410c;
      }
    `;
    document.head.appendChild(style);
  }

  function appendFacilities(rows, config) {
    if (typeof facilities === "undefined" || !Array.isArray(facilities)) {
      console.warn("facilities配列が見つかりません。");
      return 0;
    }

    const normalized = rows
      .map(function (row) { return normalizeFacility(row, config); })
      .filter(Boolean);

    let added = 0;

    normalized.forEach(function (item) {
      const alreadyExists = facilities.some(function (facility) {
        return (
          facility.dynamicSource === "supabase" &&
          String(facility.supabaseId) === String(item.supabaseId)
        );
      });

      if (!alreadyExists) {
        facilities.push(item);
        added++;
      }
    });

    window.NAKATSU_DYNAMIC_FACILITIES = normalized;

    return added;
  }

  async function loadDynamicFacilities() {
    const config = getConfig();

    addStatusStyle();

    if (!isReady(config)) {
      console.info("Supabase設定が未入力のため、静的データのみで表示します。");
      return;
    }

    try {
      addStatus("追加データを読み込み中...", "info");

      const response = await fetch(buildUrl(config), {
        method: "GET",
        headers: getHeaders(config)
      });

      if (!response.ok) {
        throw new Error("Supabase読み込み失敗: HTTP " + response.status);
      }

      const rows = await response.json();

      if (!Array.isArray(rows)) {
        throw new Error("Supabaseのレスポンス形式が不正です。");
      }

      const added = appendFacilities(rows, config);

      if (typeof renderCategoryNav === "function") {
        renderCategoryNav();
      }

      if (typeof render === "function") {
        render();
      }

      document.dispatchEvent(new CustomEvent("nakatsu:facilities-updated", {
        detail: {
          added: added,
          totalDynamic: rows.length
        }
      }));

      addStatus("Supabaseから " + added + "件の施設を追加しました", "success");
    } catch (error) {
      console.error(error);
      addStatus("追加データの読み込みに失敗しました。静的データだけで表示中です。", "error");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(loadDynamicFacilities, 200);
  });
})();
