/* ============================================================
   中津くらしナビ：トップ数字表示修正
   ファイル名：home-stats-fix-extra.js

   目的：
   ・トップの「公式確認済み」を「公式URLあり」に変更
   ・トップの「要確認」を「URL未確認」に変更
   ・数字も officialUrl が入っている件数で数える
   ============================================================ */

(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function updateStats() {
    if (typeof facilities === "undefined" || !Array.isArray(facilities)) return;

    const section = document.getElementById("mergedHomeSection");
    if (!section) return;

    const stats = section.querySelectorAll(".merged-stat");
    if (!stats || stats.length < 3) return;

    const total = facilities.length;

    const officialUrlCount = facilities.filter(function (facility) {
      return facility.officialUrl && String(facility.officialUrl).trim() !== "";
    }).length;

    const noOfficialUrlCount = Math.max(0, total - officialUrlCount);

    const firstStrong = stats[0].querySelector("strong");
    const firstSpan = stats[0].querySelector("span");

    const secondStrong = stats[1].querySelector("strong");
    const secondSpan = stats[1].querySelector("span");

    const thirdStrong = stats[2].querySelector("strong");
    const thirdSpan = stats[2].querySelector("span");

    if (firstStrong) firstStrong.textContent = total;
    if (firstSpan) firstSpan.textContent = "掲載候補";

    if (secondStrong) secondStrong.textContent = officialUrlCount;
    if (secondSpan) secondSpan.textContent = "公式URLあり";

    if (thirdStrong) thirdStrong.textContent = noOfficialUrlCount;
    if (thirdSpan) thirdSpan.textContent = "URL未確認";

    window.NAKATSU_HOME_STATS_FIX_RESULT = {
      total: total,
      officialUrlCount: officialUrlCount,
      noOfficialUrlCount: noOfficialUrlCount
    };

    console.log("home-stats-fix-extra result:", window.NAKATSU_HOME_STATS_FIX_RESULT);
  }

  ready(function () {
    updateStats();

    [300, 800, 1500, 2500, 4000].forEach(function (ms) {
      setTimeout(updateStats, ms);
    });

    const observer = new MutationObserver(function () {
      updateStats();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
})();
