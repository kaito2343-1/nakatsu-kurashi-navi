(function () {
  "use strict";

  if (window.__NAKATSU_SEARCH_UX__) return;
  window.__NAKATSU_SEARCH_UX__ = true;

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function injectStyles() {
    if ($("#searchUxUpgradeStyle")) return;

    var style = document.createElement("style");
    style.id = "searchUxUpgradeStyle";
    style.textContent = [
      ".active-filter-summary{display:flex;align-items:center;justify-content:space-between;gap:14px;margin:0 0 18px;padding:14px 16px;border:1px solid rgba(13,47,85,.12);border-radius:16px;background:#fff;box-shadow:0 7px 20px rgba(13,47,85,.06)}",
      ".active-filter-summary__content{min-width:0;display:grid;gap:7px}",
      ".active-filter-summary__label{margin:0;color:#667587;font-size:11px;font-weight:800;letter-spacing:.06em}",
      ".active-filter-summary__chips{display:flex;flex-wrap:wrap;gap:7px}",
      ".active-filter-chip{display:inline-flex;align-items:center;min-height:30px;padding:5px 10px;border-radius:999px;color:#0d2f55;background:#e7f0f6;font-size:12px;font-weight:800}",
      ".active-filter-chip.is-open{color:#287453;background:#e9f5ef}",
      ".active-filter-chip.is-favorite{color:#9c650e;background:#fff2d9}",
      ".active-filter-clear{flex:none;min-height:38px;padding:8px 12px;border:1px solid rgba(13,47,85,.18);border-radius:11px;color:#0d2f55;background:#fff;font:inherit;font-size:12px;font-weight:800;cursor:pointer}",
      ".search-highlight{padding:0 .12em;border-radius:.22em;color:inherit;background:#ffe49a;font-weight:900}",
      ".share-btn{min-height:42px;display:inline-flex;align-items:center;justify-content:center;gap:5px;padding:9px 12px;border:1px solid rgba(13,47,85,.18);border-radius:11px;color:#0d2f55;background:#fff;font:inherit;font-size:12px;font-weight:800;cursor:pointer}",
      ".no-result-upgrade{display:grid;justify-items:center;gap:12px;padding:28px 18px;border:1px dashed rgba(13,47,85,.24);border-radius:18px;background:#fff;text-align:center}",
      ".no-result-upgrade__icon{width:52px;height:52px;display:grid;place-items:center;border-radius:50%;background:#fff2d9;font-size:25px}",
      ".no-result-upgrade h3{margin:0;color:#10243d;font-size:18px}",
      ".no-result-upgrade p{max-width:520px;margin:0;color:#667587;font-size:13px;line-height:1.8}",
      ".no-result-upgrade__actions{display:flex;flex-wrap:wrap;justify-content:center;gap:9px}",
      ".no-result-upgrade__actions button{min-height:40px;padding:8px 13px;border-radius:11px;font:inherit;font-size:12px;font-weight:800;cursor:pointer}",
      ".no-result-reduce{border:1px solid rgba(13,47,85,.18);color:#0d2f55;background:#fff}",
      ".no-result-reset{border:1px solid #0d2f55;color:#fff;background:#0d2f55}",
      "#shopsMain,.shops-main,#resultCount{scroll-margin-top:96px}",
      "@media(max-width:640px){.active-filter-summary{align-items:stretch;flex-direction:column}.active-filter-clear{width:100%}.card-actions .share-btn{width:100%}}"
    ].join("");
    document.head.appendChild(style);
  }

  function cleanText(text) {
    return String(text || "")
      .replace(/\(\s*\d+\s*\)/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getConditions() {
    var conditions = [];
    var input = $("#keywordInput");
    var keyword = input ? input.value.trim() : "";

    if (keyword) conditions.push({ text: "検索：" + keyword, type: "keyword" });

    var category = $("#categoryScroll .cat-btn.active, #categoryScroll .cat-btn.is-active");
    if (category && category.getAttribute("data-category") !== "all") {
      conditions.push({ text: cleanText(category.textContent), type: "category" });
    }

    $all("[data-area].active,[data-area].is-active,.area-chip.active,.area-chip.is-active,[data-region].active,[data-region].is-active,[data-payment].active,[data-payment].is-active")
      .forEach(function (el) {
        var text = cleanText(el.textContent);
        if (text && !conditions.some(function (item) { return item.text === text; })) {
          conditions.push({ text: text, type: "extra" });
        }
      });

    var openNow = $("#openNowToggle");
    if (openNow && openNow.checked) conditions.push({ text: "営業中", type: "open" });

    var fav = $("#favOnlyBtn");
    if (fav && (fav.classList.contains("active") || fav.classList.contains("is-active"))) {
      conditions.push({ text: "お気に入り", type: "favorite" });
    }

    return conditions;
  }

  function ensureSummary() {
    var main = $("#shopsMain");
    if (!main) return null;

    var summary = $("#activeFilterSummary");
    if (summary) return summary;

    summary = document.createElement("section");
    summary.id = "activeFilterSummary";
    summary.className = "active-filter-summary";
    summary.setAttribute("aria-label", "現在の検索条件");

    var head = $(".shops-results-head", main);
    if (head) head.insertAdjacentElement("afterend", summary);
    else main.insertBefore(summary, main.firstChild);

    return summary;
  }

  function renderSummary() {
    var summary = ensureSummary();
    if (!summary) return;

    var conditions = getConditions();
    var chips = conditions.length
      ? conditions.map(function (item) {
          var className = "active-filter-chip";
          if (item.type === "open") className += " is-open";
          if (item.type === "favorite") className += " is-favorite";
          return '<span class="' + className + '">' + escapeHtml(item.text) + "</span>";
        }).join("")
      : '<span class="active-filter-chip">すべての施設</span>';

    summary.innerHTML =
      '<div class="active-filter-summary__content">' +
        '<p class="active-filter-summary__label">現在の検索条件</p>' +
        '<div class="active-filter-summary__chips">' + chips + "</div>" +
      "</div>" +
      '<button type="button" class="active-filter-clear">条件を全部解除</button>';

    $(".active-filter-clear", summary).addEventListener("click", resetAll);
  }

  function resetAll() {
    var reset = $("#resetBtn");
    if (reset) {
      reset.click();
    } else {
      var input = $("#keywordInput");
      if (input) {
        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }

      var openNow = $("#openNowToggle");
      if (openNow && openNow.checked) {
        openNow.checked = false;
        openNow.dispatchEvent(new Event("change", { bubbles: true }));
      }

      var all = $('#categoryScroll [data-category="all"]');
      if (all) all.click();
    }

    setTimeout(enhance, 60);
  }

  function reduceOne() {
    var openNow = $("#openNowToggle");
    if (openNow && openNow.checked) {
      openNow.checked = false;
      openNow.dispatchEvent(new Event("change", { bubbles: true }));
      return;
    }

    var category = $("#categoryScroll .cat-btn.active, #categoryScroll .cat-btn.is-active");
    if (category && category.getAttribute("data-category") !== "all") {
      var all = $('#categoryScroll [data-category="all"]');
      if (all) all.click();
      return;
    }

    var input = $("#keywordInput");
    if (input && input.value.trim()) {
      input.value = "";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }

    var fav = $("#favOnlyBtn");
    if (fav && (fav.classList.contains("active") || fav.classList.contains("is-active"))) {
      fav.click();
      return;
    }

    resetAll();
  }

  function enhanceNoResult() {
    var noResult = $("#noResult");
    if (!noResult || noResult.hidden || $(".no-result-upgrade", noResult)) return;

    noResult.innerHTML =
      '<div class="no-result-upgrade">' +
        '<span class="no-result-upgrade__icon" aria-hidden="true">🔍</span>' +
        "<h3>条件に合う施設が見つかりませんでした</h3>" +
        "<p>検索キーワードを短くするか、カテゴリ・営業中などの条件を1つ減らして、もう一度お試しください。</p>" +
        '<div class="no-result-upgrade__actions">' +
          '<button type="button" class="no-result-reduce">条件を1つ減らす</button>' +
          '<button type="button" class="no-result-reset">すべて表示する</button>' +
        "</div>" +
      "</div>";

    $(".no-result-reduce", noResult).addEventListener("click", reduceOne);
    $(".no-result-reset", noResult).addEventListener("click", resetAll);
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function highlight(root, tokens) {
    if (!root || !tokens.length) return;

    var pattern = new RegExp("(" + tokens.map(escapeRegExp).join("|") + ")", "gi");
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var parent = node.parentElement;
        if (!parent || parent.closest("mark,script,style,button,a")) return NodeFilter.FILTER_REJECT;
        pattern.lastIndex = 0;
        return pattern.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });

    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(function (node) {
      var fragment = document.createDocumentFragment();
      var text = node.nodeValue;
      var last = 0;
      var match;
      pattern.lastIndex = 0;

      while ((match = pattern.exec(text)) !== null) {
        if (match.index > last) {
          fragment.appendChild(document.createTextNode(text.slice(last, match.index)));
        }

        var mark = document.createElement("mark");
        mark.className = "search-highlight";
        mark.textContent = match[0];
        fragment.appendChild(mark);
        last = match.index + match[0].length;
      }

      if (last < text.length) fragment.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(fragment, node);
    });
  }

  function applyHighlights() {
    var input = $("#keywordInput");
    if (!input) return;

    var tokens = input.value.trim().split(/[\s　]+/).filter(Boolean).sort(function (a, b) {
      return b.length - a.length;
    });
    if (!tokens.length) return;

    $all("#cardList .card").forEach(function (card) {
      $all(".card-title,.card-desc,.card-category,.tag,.card-info dd", card).forEach(function (el) {
        highlight(el, tokens);
      });
    });
  }

  function copyUrl(url) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).catch(function () {
        window.prompt("このリンクをコピーしてください", url);
      });
    } else {
      window.prompt("このリンクをコピーしてください", url);
    }
  }

  function addShareButtons() {
    $all("#cardList .card").forEach(function (card) {
      if ($(".share-btn", card)) return;

      var id = card.getAttribute("data-id");
      if (id) card.id = "facility-" + id;

      var actions = $(".card-actions", card);
      var titleEl = $(".card-title", card);
      if (!actions || !titleEl) return;

      var title = titleEl.textContent.trim();
      var button = document.createElement("button");
      button.type = "button";
      button.className = "share-btn";
      button.textContent = "↗ 共有";

      button.addEventListener("click", function () {
        var url = new URL(window.location.href);
        url.searchParams.set("q", title);
        if (id) url.hash = "facility-" + id;

        var data = {
          title: title + "｜中津くらしナビ",
          text: title + "を中津くらしナビで見る",
          url: url.toString()
        };

        if (navigator.share) {
          navigator.share(data).catch(function (error) {
            if (!error || error.name !== "AbortError") copyUrl(data.url);
          });
        } else {
          copyUrl(data.url);
        }
      });

      actions.appendChild(button);
    });
  }

  function scrollToResults() {
    var target = $("#shopsMain") || $("#resultCount") || $("#cardList");
    if (!target) return;

    setTimeout(function () {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  var scheduled = false;
  function enhance() {
    if (scheduled) return;
    scheduled = true;

    setTimeout(function () {
      scheduled = false;
      renderSummary();
      enhanceNoResult();
      addShareButtons();
      applyHighlights();
    }, 25);
  }

  function bind() {
    var form = $("#searchForm");
    var category = $("#categoryScroll");
    var input = $("#keywordInput");
    var openNow = $("#openNowToggle");
    var fav = $("#favOnlyBtn");
    var reset = $("#resetBtn");

    if (form) {
      form.addEventListener("submit", function () {
        enhance();
        scrollToResults();
      });
    }

    if (category) {
      category.addEventListener("click", function (event) {
        if (event.target.closest("[data-category]")) {
          enhance();
          scrollToResults();
        }
      });
    }

    if (input) input.addEventListener("input", enhance);
    if (openNow) openNow.addEventListener("change", enhance);
    if (fav) fav.addEventListener("click", enhance);
    if (reset) reset.addEventListener("click", enhance);

    document.addEventListener("click", function (event) {
      if (event.target.closest("[data-quick-search]")) {
        enhance();
        scrollToResults();
      }
    });

    var cardList = $("#cardList");
    if (cardList && "MutationObserver" in window) {
      new MutationObserver(enhance).observe(cardList, { childList: true, subtree: true });
    }

    var noResult = $("#noResult");
    if (noResult && "MutationObserver" in window) {
      new MutationObserver(enhance).observe(noResult, {
        childList: true,
        attributes: true,
        attributeFilter: ["hidden"]
      });
    }
  }

  function applySharedSearch() {
    var input = $("#keywordInput");
    if (!input) return;

    var query = new URLSearchParams(window.location.search).get("q");
    if (query && !input.value.trim()) {
      input.value = query;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  function init() {
    if (!$("#cardList")) return;
    injectStyles();
    bind();
    applySharedSearch();
    enhance();
  }

  document.addEventListener("nakatsu:app-ready", init, { once: true });

  if (document.readyState !== "loading") {
    setTimeout(init, 1500);
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(init, 1500);
    }, { once: true });
  }
})();
