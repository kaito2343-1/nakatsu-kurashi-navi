/* ============================================================
   中津くらしナビ：地域密着型アプリUI補助
   ============================================================ */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function greetingText() {
    var hour = new Date().getHours();

    if (hour < 11) {
      return "おはようございます！";
    }

    if (hour < 18) {
      return "こんにちは！";
    }

    return "こんばんは！";
  }

  function addGreeting() {
    if (
      (window.NAKATSU_PAGE || document.body.dataset.page) !== "home"
    ) {
      return;
    }

    if (document.querySelector(".local-greeting")) {
      return;
    }

    var copy = document.querySelector(".nk-hero-copy");

    if (!copy) {
      return;
    }

    var greeting = document.createElement("div");

    greeting.className = "local-greeting";

    greeting.setAttribute(
      "aria-label",
      greetingText() + " 中津で素敵な一日を"
    );

    greeting.innerHTML =
      '<span aria-hidden="true">☺</span>' +
      "<div>" +
      "<strong>" +
      greetingText() +
      "</strong>" +
      "<small>中津で素敵な一日を♪</small>" +
      "</div>";

    copy.insertBefore(greeting, copy.firstChild);
  }

  function tuneBottomNav() {
    var nav = document.getElementById("bottomNav");

    if (!nav) {
      return false;
    }

    var labels = {
      home: "ホーム",
      search: "探す",
      fav: "お気に入り",
      request: "掲載案内"
    };

    nav
      .querySelectorAll(".bottom-nav-btn")
      .forEach(function (button) {
        var action = button.getAttribute("data-nav");
        var label = button.querySelector(".bottom-nav-label");

        if (label && labels[action]) {
          label.textContent = labels[action];
        }
      });

    return true;
  }

  function updateThemeColor() {
    var meta = document.querySelector(
      'meta[name="theme-color"]'
    );

    if (meta) {
      meta.setAttribute("content", "#4c9f52");
    }
  }

  function init() {
    updateThemeColor();
    addGreeting();

    if (!tuneBottomNav()) {
      var attempts = 0;

      var timer = window.setInterval(function () {
        attempts += 1;

        if (tuneBottomNav() || attempts > 20) {
          window.clearInterval(timer);
        }
      }, 150);
    }
  }

  ready(init);

  document.addEventListener(
    "nakatsu:app-ready",
    init,
    { once: true }
  );
})();
