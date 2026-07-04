/* ============================================================
   中津くらしナビ：Instagram / SNSリンク対応 一時停止版
   ファイル名：social-links-extra.js

   白画面対策のため、画面には触らない安全版。
   Instagram判定関数だけ残します。
   ============================================================ */

(function () {
  "use strict";

  function isValidInstagramUrl(url) {
    if (typeof url !== "string") return false;

    const trimmed = url.trim();

    return (
      trimmed.indexOf("https://www.instagram.com/") === 0 ||
      trimmed.indexOf("https://instagram.com/") === 0
    );
  }

  function getInstagramUrl(facility) {
    if (!facility) return "";

    if (facility.instagramUrl && isValidInstagramUrl(facility.instagramUrl)) {
      return facility.instagramUrl.trim();
    }

    if (
      facility.snsUrls &&
      facility.snsUrls.instagram &&
      isValidInstagramUrl(facility.snsUrls.instagram)
    ) {
      return facility.snsUrls.instagram.trim();
    }

    return "";
  }

  function hasOfficialUrl(facility) {
    return !!(
      facility &&
      facility.officialUrl &&
      String(facility.officialUrl).trim() !== ""
    );
  }

  window.NAKATSU_SOCIAL = {
    isValidInstagramUrl: isValidInstagramUrl,
    getInstagramUrl: getInstagramUrl,
    hasOfficialUrl: hasOfficialUrl
  };

  console.log("social-links-extra.js safe mode loaded");
})();
