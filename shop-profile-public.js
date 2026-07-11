/* 店舗管理ポータルの更新内容を公開サイトへ反映 */
((function () {
  "use strict";

  var photoMap = {};
  

  function normalize(value) {
    return String(value || "")
      .replace(/\s+/g, "")
      .toLowerCase();
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function findFacility(row) {
    if (
      typeof facilities === "undefined" ||
      !Array.isArray(facilities)
    ) {
      return null;
    }

    var savedName = normalize(row.facility_name);

    return facilities.find(function (facility) {
      var sameId =
        String(facility.id) ===
        String(row.facility_id);

      var siteName = normalize(
        facility.name ||
        facility.title
      );

      return (
        sameId ||
        (
          savedName &&
          siteName === savedName
        )
      );
    }) || null;
  }

  function applyToFacility(row) {
    var facility = findFacility(row);

    if (!facility) {
      return;
    }

    if (row.hours) {
      facility.hours = row.hours;
      facility.customHours = row.hours;
    }

    if (row.closed) {
      facility.closed = row.closed;
      facility.customClosed = row.closed;
    }

    if (row.recommendation) {
      facility.todayRecommendation =
        row.recommendation;

      facility.today_note =
        row.recommendation;

      facility.recommendation =
        row.recommendation;
    }

    if (row.notice) {
      facility.shopNotice =
        row.notice;

      facility.notice =
        row.notice;
    }
  }

  function findCard(row) {
    var cards = Array.prototype.slice.call(
      document.querySelectorAll(
        "#cardList .card, .card[data-id], [data-facility-id]"
      )
    );

    var savedName = normalize(
      row.facility_name
    );

    return cards.find(function (card) {
      var cardId =
        card.dataset.id ||
        card.dataset.facilityId ||
        "";

      if (
        String(cardId) ===
        String(row.facility_id)
      ) {
        return true;
      }

      var title = card.querySelector(
        ".card-title, h2, h3, [class*='title']"
      );

      return (
        title &&
        savedName &&
        normalize(title.textContent) ===
          savedName
      );
    }) || null;
  }

  function setRow(card, label, value) {
    if (!value) {
      return;
    }

    var nodes = Array.prototype.slice.call(
      card.querySelectorAll(
        "p, li, tr, .info-row, .card-info > div"
      )
    );

    var target = nodes.find(function (node) {
      return (
        normalize(node.textContent)
          .indexOf(normalize(label)) === 0
      );
    });

    if (!target) {
      return;
    }

    var valueElement = target.querySelector(
      "span, dd, td:last-child"
    );

    if (valueElement) {
      valueElement.textContent = value;
      return;
    }

    var strong = target.querySelector(
      "strong, dt, th"
    );

    if (strong) {
      target.innerHTML =
        strong.outerHTML +
        "<span>" +
        escapeHtml(value) +
        "</span>";
    }
  }

  function patchCard(row) {
  var card = findCard(row);

  if (!card) {
    return;
  }
    var photoUrl = photoMap[String(row.facility_id)];

if (photoUrl) {
  var image =
    card.querySelector(".p6-shop-photo") ||
    card.querySelector(".shop-profile-photo");

  if (!image) {
    image = document.createElement("img");
    image.className = "shop-profile-photo";

    var title = card.querySelector(
      ".card-title, h2, h3"
    );

    if (title) {
      title.insertAdjacentElement(
        "afterend",
        image
      );
    } else {
      card.insertBefore(
        image,
        card.firstChild
      );
    }
  }

  image.src =
    photoUrl +
    "?v=" +
    Date.now();

  image.alt =
    row.facility_name || "店舗写真";

  image.style.width = "100%";
  image.style.maxHeight = "300px";
  image.style.objectFit = "cover";
  image.style.borderRadius = "18px";
  image.style.margin = "12px 0";
}
    

    setRow(
      card,
      "営業時間",
      row.hours
    );

    setRow(
      card,
      "定休日",
      row.closed
    );

    var oldBox = card.querySelector(
      ".shop-profile-public-box"
    );

    if (oldBox) {
      oldBox.remove();
    }

    if (
      !row.recommendation &&
      !row.notice
    ) {
      return;
    }

    var box =
      document.createElement("div");

    box.className =
      "shop-profile-public-box";

    var html = "";

    if (row.recommendation) {
      html +=
        "<p>" +
          "<strong>📣 本日のおすすめ</strong>" +
          "<span>" +
            escapeHtml(
              row.recommendation
            ) +
          "</span>" +
        "</p>";
    }

    if (row.notice) {
      html +=
        "<p>" +
          "<strong>店舗からのお知らせ</strong>" +
          "<span>" +
            escapeHtml(
              row.notice
            ) +
          "</span>" +
        "</p>";
    }

    box.innerHTML = html;

    var mapButton =
      Array.prototype.slice
        .call(
          card.querySelectorAll(
            "a, button"
          )
        )
        .find(function (element) {
          return (
            normalize(
              element.textContent
            ).indexOf(
              normalize("地図で見る")
            ) !== -1
          );
        });

    if (
      mapButton &&
      mapButton.parentNode
    ) {
      mapButton.parentNode.insertBefore(
        box,
        mapButton
      );
    } else {
      card.appendChild(box);
    }
  }

  function addStyle() {
    if (
      document.getElementById(
        "shopProfilePublicStyle"
      )
    ) {
      return;
    }

    var style =
      document.createElement("style");

    style.id =
      "shopProfilePublicStyle";

    style.textContent =
      ".shop-profile-public-box{" +
        "margin:14px 0;" +
        "padding:14px 16px;" +
        "border-radius:16px;" +
        "background:#eef7f4;" +
        "border:1px solid #cde4dd;" +
      "}" +

      ".shop-profile-public-box p{" +
        "margin:0;" +
        "display:grid;" +
        "gap:5px;" +
      "}" +

      ".shop-profile-public-box p+p{" +
        "margin-top:12px;" +
        "padding-top:12px;" +
        "border-top:1px solid #d7e8e2;" +
      "}" +

      ".shop-profile-public-box strong{" +
        "font-size:13px;" +
        "color:#0e5148;" +
      "}" +

      ".shop-profile-public-box span{" +
        "font-size:14px;" +
        "line-height:1.7;" +
        "color:#233b36;" +
      "}";

    document.head.appendChild(style);
  }

  async function applyShopProfiles() {
    if (
      typeof facilities === "undefined" ||
      !window.NAKATSU_AUTH ||
      !window.NAKATSU_AUTH.client
    ) {
      return;
    }

    try {
   var results = await Promise.all([
  window.NAKATSU_AUTH.client
    .from("shop_profiles")
    .select(
      "facility_id," +
      "facility_name," +
      "recommendation," +
      "hours," +
      "closed," +
      "notice"
    ),

  window.NAKATSU_AUTH.client
    .from("shop_photos")
    .select("facility_id,photo_url")
]);

var result = results[0];
var photoResult = results[1];

if (result.error) {
  throw result.error;
}

if (photoResult.error) {
  throw photoResult.error;
}

var photoMap = {};

(photoResult.data || []).forEach(function (photo) {
  photoMap[String(photo.facility_id)] = photo.photo_url;
});

      if (result.error) {
        throw result.error;
      }

      var rows = result.data || [];

      addStyle();

      rows.forEach(
        applyToFacility
      );

      if (
        typeof render === "function"
      ) {
        render();
      }

      [
        300,
        900,
        1800,
        3000
      ].forEach(function (delay) {
        setTimeout(function () {
          rows.forEach(
            patchCard
          );
        }, delay);
      });

    } catch (error) {
      console.warn(
        "[shop-profile-public] 読み込み失敗",
        error
      );
    }
  }

  function start() {
    setTimeout(
      applyShopProfiles,
      500
    );
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      start,
      {
        once: true
      }
    );
  } else {
    start();
  }

  document.addEventListener(
    "nakatsu:app-ready",
    start,
    {
      once: true
    }
  );
})();
