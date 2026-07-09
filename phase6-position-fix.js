/* ============================================================
   中津くらしナビ phase6-position-fix.js
   店舗写真のすぐ下に「店舗更新の営業時間・定休日」を強制移動する
   ============================================================ */

(function () {
  "use strict";

  function moveExtraInfoUnderPhoto() {
    var cards = document.querySelectorAll(".card");

    cards.forEach(function (card) {
      var photo = card.querySelector(".p6-shop-photo");
      var info = card.querySelector(".p6-shop-extra-info");

      if (!photo || !info) return;

      if (photo.nextElementSibling !== info) {
        photo.insertAdjacentElement("afterend", info);
      }
    });
  }

  function startFix() {
    moveExtraInfoUnderPhoto();

    setTimeout(moveExtraInfoUnderPhoto, 500);
    setTimeout(moveExtraInfoUnderPhoto, 1200);
    setTimeout(moveExtraInfoUnderPhoto, 2500);
    setTimeout(moveExtraInfoUnderPhoto, 4000);

    document.addEventListener("nakatsu:rendered", function () {
      setTimeout(moveExtraInfoUnderPhoto, 100);
      setTimeout(moveExtraInfoUnderPhoto, 800);
    });

    var observer = new MutationObserver(function () {
      moveExtraInfoUnderPhoto();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startFix);
  } else {
    startFix();
  }
})();
