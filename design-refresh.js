/* ============================================================
   中津くらしナビ design-refresh.js
   UIまわりの絵文字を統一デザインのSVG線画アイコンに置き換える
   （カテゴリボタンや施設アイコンの絵文字は「内容」なので残す）
   読み込み位置：他のJSより後（</body> 直前）
   ============================================================ */

(function () {
  "use strict";

  /* --- Lucide風アイコン（24x24, stroke） --- */
  var ICONS = {
    compass:
      '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    search:
      '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    home:
      '<path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/>',
    star:
      '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    send:
      '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
    megaphone:
      '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    phone:
      '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
    mappin:
      '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    link:
      '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    camera:
      '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
    smartphone:
      '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>',
    info:
      '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    check:
      '<polyline points="20 6 9 17 4 12"/>',
    alert:
      '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    bulb:
      '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2z"/>',
    sparkles:
      '<path d="m12 3 1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3z"/>',
    bot:
      '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4"/><circle cx="12" cy="3" r="1"/><line x1="9" y1="14" x2="9.01" y2="14"/><line x1="15" y1="14" x2="15.01" y2="14"/>'
  };

  function svg(name, cls) {
    return (
      '<svg class="ic ' + (cls || "") + '" viewBox="0 0 24 24" aria-hidden="true">' +
      ICONS[name] +
      "</svg>"
    );
  }

  /* --- 絵文字 → アイコン名の対応表 --- */
  var MAP = {
    "🧭": "compass",
    "🔍": "search",
    "🔎": "search",
    "🏠": "home",
    "⭐": "star",
    "📩": "send",
    "📣": "megaphone",
    "📞": "phone",
    "📍": "mappin",
    "🔗": "link",
    "📷": "camera",
    "📱": "smartphone",
    "ℹ️": "info",
    "ℹ": "info",
    "✔": "check",
    "✅": "check",
    "⚠": "alert",
    "⚠️": "alert",
    "💡": "bulb",
    "✨": "sparkles",
    "🤖": "bot"
  };

  var EMOJI_RE = new RegExp(
    "(" +
      Object.keys(MAP)
        .sort(function (a, b) { return b.length - a.length; })
        .map(function (k) {
          return k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        })
        .join("|") +
      ")",
    "g"
  );

  /* テキストノード内の対象絵文字だけをSVGに差し替える */
  function replaceIn(root) {
    if (!root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var targets = [];
    var node;
    while ((node = walker.nextNode())) {
      if (EMOJI_RE.test(node.nodeValue)) targets.push(node);
      EMOJI_RE.lastIndex = 0;
    }
    targets.forEach(function (textNode) {
      var span = document.createElement("span");
      span.style.display = "contents";
      span.innerHTML = textNode.nodeValue.replace(EMOJI_RE, function (m) {
        return svg(MAP[m]);
      });
      textNode.parentNode.replaceChild(span, textNode);
    });
  }

  /* 対象を絞って置き換え（カテゴリボタン・施設アイコンは除外） */
  var SCOPES = [
    ".site-header",
    ".hero-search",
    ".notice-banner",
    ".free-listing-banner",
    ".home-hero-extra",
    ".home-about-extra",
    ".home-ui-panel",
    ".search-section",
    ".post-request-wrap",
    ".bottom-nav",
    ".site-footer",
    "#requestModal",
    ".card-actions",
    ".card-head-status",
    ".card-memo",
    ".card-source"
  ];

  function run() {
    SCOPES.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(replaceIn);
    });
  }

  function observeCardList() {
    var list = document.getElementById("cardList");
    if (!list || !window.MutationObserver) return;
    var scheduled = false;
    var mo = new MutationObserver(function () {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(function () {
        scheduled = false;
        list
          .querySelectorAll(".card-actions, .card-head-status, .card-memo, .card-source")
          .forEach(replaceIn);
      });
    });
    mo.observe(list, { childList: true, subtree: true });
  }

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    /* 他スクリプトがDOM生成し終わるのを1フレーム待つ */
    requestAnimationFrame(function () {
      run();
      observeCardList();
      /* 下部ナビなど遅れて生成される要素向けにもう一度 */
      setTimeout(run, 400);
    });
  });
})();
