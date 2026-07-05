/* ============================================================
   中津くらしナビ：Supabase簡易管理画面
   ファイル名：admin.js
   ============================================================ */

(function () {
  const form = document.getElementById("facilityForm");
  const listEl = document.getElementById("facilityList");
  const connectionStatus = document.getElementById("connectionStatus");
  const saveStatus = document.getElementById("saveStatus");

  const fields = {
    dbId: document.getElementById("dbId"),
    name: document.getElementById("name"),
    category: document.getElementById("category"),
    description: document.getElementById("description"),
    address: document.getElementById("address"),
    phone: document.getElementById("phone"),
    hours: document.getElementById("hours"),
    closed: document.getElementById("closed"),
    mapUrl: document.getElementById("mapUrl"),
    officialUrl: document.getElementById("officialUrl"),
    instagram: document.getElementById("instagram"),
         imageUrl: document.getElementById("imageUrl"),
    memo: document.getElementById("memo"),
    sourceMemo: document.getElementById("sourceMemo"),
    sortOrder: document.getElementById("sortOrder"),
    verified: document.getElementById("verified"),
    isPublished: document.getElementById("isPublished")
  };

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
  function getHeaders(config, preferRepresentation) {
    const headers = {
      "apikey": config.publicKey,
   
      "Accept": "application/json",
      "Content-Type": "application/json"
    };

        if (preferRepresentation) {
      headers.Prefer = "return=minimal";
    }

    return headers;
  }

  function tableUrl(config) {

    return cleanBaseUrl(config.url) + "/rest/v1/" + encodeURIComponent(config.table);
  }

  function setStatus(el, message, type) {
    if (!el) return;

    el.textContent = message;
    el.dataset.type = type || "info";
  }

  function parseTags(value) {
    return String(value || "")
      .split(",")
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean);
  }

  function toPayload() {
    return {
      name: fields.name.value.trim(),
      category: fields.category.value.trim() || "安いご飯",
      description: fields.description.value.trim(),
      address: fields.address.value.trim(),
      phone: fields.phone.value.trim(),
      hours: fields.hours.value.trim(),
      closed: fields.closed.value.trim(),
      map_url: fields.mapUrl.value.trim(),
      official_url: fields.officialUrl.value.trim(),
      instagram: fields.instagram.value.trim(),
             image_url: fields.imageUrl.value.trim(),
      tags: parseTags(fields.tags.value),
      memo: fields.memo.value.trim(),
      source_memo: fields.sourceMemo.value.trim(),
      verified: fields.verified.checked,
      is_published: fields.isPublished.checked,
      sort_order: fields.sortOrder.value ? Number(fields.sortOrder.value) : 9999,
      updated_at: new Date().toISOString()
    };
  }

  function clearForm() {
    if (!form) return;

    form.reset();
    fields.dbId.value = "";
    fields.isPublished.checked = true;
    setStatus(saveStatus, "", "info");
  }

  function fillForm(row) {
    fields.dbId.value = row.id || "";
    fields.name.value = row.name || "";
    fields.category.value = row.category || "";
    fields.description.value = row.description || "";
    fields.address.value = row.address || "";
    fields.phone.value = row.phone || "";
    fields.hours.value = row.hours || "";
    fields.closed.value = row.closed || "";
    fields.mapUrl.value = row.map_url || "";
    fields.officialUrl.value = row.official_url || "";
    fields.instagram.value = row.instagram || "";
         fields.imageUrl.value = row.image_url || "";
    fields.tags.value = Array.isArray(row.tags) ? row.tags.join(", ") : "";
    fields.memo.value = row.memo || "";
    fields.sourceMemo.value = row.source_memo || "";
    fields.sortOrder.value = row.sort_order || "";
    fields.verified.checked = Boolean(row.verified);
    fields.isPublished.checked = row.is_published !== false;

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    setStatus(saveStatus, "編集モード：ID " + row.id + " を読み込みました", "info");
  }

  async function fetchFacilities() {
    const config = getConfig();

    if (!isReady(config)) {
      setStatus(connectionStatus, "Supabase設定が未入力です。supabase-config.js を編集してください。", "error");

      if (listEl) {
        listEl.innerHTML = "<p class='empty'>Supabase設定後に一覧が表示されます。</p>";
      }

      return [];
    }

    const params = new URLSearchParams();
    params.set("select", "*");
    params.set("order", "sort_order.asc.nullslast");

    const response = await fetch(tableUrl(config) + "?" + params.toString(), {
      method: "GET",
      headers: getHeaders(config)
    });

    if (!response.ok) {
      throw new Error("読み込み失敗: HTTP " + response.status);
    }

    return await response.json();
  }

  function renderList(rows) {
    if (!listEl) return;

    if (!rows.length) {
      listEl.innerHTML = "<p class='empty'>まだSupabase側の施設データがありません。</p>";
      return;
    }

    listEl.innerHTML = rows.map(function (row) {
      const published = row.is_published === false ? "非公開" : "公開";

      return `
        <article class="facility-item">
          <div>
            <strong>${escapeHtml(row.name || "")}</strong>
            <p>${escapeHtml(row.category || "")} / ID: ${escapeHtml(row.id)}</p>
            <small>${escapeHtml(published)}・${escapeHtml(row.address || "住所未入力")}</small>
          </div>
          <button type="button" data-id="${escapeHtml(row.id)}">編集</button>
        </article>
      `;
    }).join("");

    listEl.querySelectorAll("button[data-id]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const row = rows.find(function (item) {
          return String(item.id) === String(btn.dataset.id);
        });

        if (row) {
          fillForm(row);
        }
      });
    });
  }

  async function loadList() {
    try {
      setStatus(connectionStatus, "Supabaseに接続中...", "info");

      const rows = await fetchFacilities();

      renderList(rows);
      setStatus(connectionStatus, "接続OK：" + rows.length + "件読み込みました", "success");
    } catch (error) {
      console.error(error);

      setStatus(connectionStatus, error.message, "error");

      if (listEl) {
        listEl.innerHTML = "<p class='empty'>読み込みに失敗しました。RLS設定・URL・公開用キーを確認してください。</p>";
      }
    }
  }

  async function saveFacility(event) {
    event.preventDefault();

    const config = getConfig();

    if (!isReady(config)) {
      setStatus(saveStatus, "Supabase設定が未入力です。", "error");
      return;
    }

    const payload = toPayload();

    if (!payload.name) {
      setStatus(saveStatus, "店舗・施設名を入力してください。", "error");
      return;
    }

    const dbId = fields.dbId.value.trim();
    const isUpdate = Boolean(dbId);

    try {
      setStatus(saveStatus, "保存中...", "info");

      const url = isUpdate
        ? tableUrl(config) + "?id=eq." + encodeURIComponent(dbId)
        : tableUrl(config);

      const response = await fetch(url, {
        method: isUpdate ? "PATCH" : "POST",
        headers: getHeaders(config, true),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error("保存失敗: HTTP " + response.status + " " + text);
      }

      setStatus(saveStatus, isUpdate ? "更新しました。" : "追加しました。", "success");

      await loadList();

      if (!isUpdate) {
        clearForm();
      }
    } catch (error) {
      console.error(error);
      setStatus(saveStatus, error.message, "error");
    }
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  const testConnectionBtn = document.getElementById("testConnectionBtn");
  const reloadBtn = document.getElementById("reloadBtn");
  const clearBtn = document.getElementById("clearBtn");

  if (testConnectionBtn) {
    testConnectionBtn.addEventListener("click", loadList);
  }

  if (reloadBtn) {
    reloadBtn.addEventListener("click", loadList);
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", clearForm);
  }

  if (form) {
    form.addEventListener("submit", saveFacility);
  }

  document.addEventListener("DOMContentLoaded", loadList);
})();
