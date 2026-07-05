/* ============================================================
   中津くらしナビ：ご飯系追加データまとめ読み込み
   station-food-extra-001/002/003 を index.html から1本化するための整理用ファイル
   ============================================================ */

(function () {
  const files = [
    "station-food-extra-001.js?v=3",
    "station-food-extra-002.js?v=2",
    "station-food-extra-003.js?v=1"
  ];

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.onload = resolve;
      script.onerror = function () {
        reject(new Error("読み込み失敗: " + src));
      };
      document.head.appendChild(script);
    });
  }

  files.reduce(function (promise, file) {
    return promise.then(function () {
      return loadScript(file);
    });
  }, Promise.resolve()).catch(function (error) {
    console.error("food-extra-all.js:", error);
  });
})();
