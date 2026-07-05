/* ============================================================
   中津くらしナビ：ホームページ化パーツ
   ファイル名：home-page-extra.js
   既存の検索サイトに、ホームページらしい案内・導線を追加する
   ============================================================ */

(function () {
  const FORM_URL = "https://forms.gle/d6akodKsBw2TDmw68";

  function scrollToSearch() {
    const searchSection = document.querySelector(".search-section");
    if (!searchSection) return;

    searchSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function openForm() {
    window.open(FORM_URL, "_blank", "noopener");
  }

  function createHomeHtml() {
    return `
      <section class="home-hero-extra" aria-label="中津くらしナビの案内">
        <p class="home-kicker">NAKATSU LOCAL NAVI</p>
        <h2>中津のお店・暮らし情報を<br>スマホでかんたん検索</h2>
        <p class="home-lead">
          飲食店、カフェ、居酒屋、病院、薬局、駐車場など、
          中津市周辺の生活に役立つ情報をまとめています。
        </p>

        <div class="home-cta-row">
          <button type="button" class="home-primary-btn" id="homeSearchBtn">
            🔍 お店・施設を探す
          </button>
          <button type="button" class="home-secondary-btn" id="homeFormBtn">
            📣 無料掲載する
          </button>
        </div>
      </section>

      <section class="home-about-extra" aria-label="このサイトでできること">
        <h2>このサイトでできること</h2>

        <div class="home-feature-grid">
          <div class="home-feature-card">
            <span>🔍</span>
            <strong>すぐ探せる</strong>
            <p>カテゴリやキーワードで、中津周辺のお店・施設を探せます。</p>
          </div>

          <div class="home-feature-card">
            <span>📱</span>
            <strong>SNS確認</strong>
            <p>Instagramや公式情報があるお店は、雰囲気を見てから選べます。</p>
          </div>

          <div class="home-feature-card">
            <span>🤖</span>
            <strong>AI風コメント</strong>
            <p>サイト内データから、おすすめ理由や確認ポイントを表示します。</p>
          </div>

          <div class="home-feature-card">
            <span>📣</span>
            <strong>掲載無料</strong>
            <p>中津市周辺のお店・施設は、無料で掲載依頼できます。</p>
          </div>
        </div>
      </section>

      <section class="home-category-extra" aria-label="おすすめカテゴリ">
        <h2>よく探されるカテゴリ</h2>
        <div class="home-category-pills">
          <button type="button" data-keyword="居酒屋">🍺 居酒屋</button>
          <button type="button" data-keyword="カフェ">☕ カフェ</button>
          <button type="button" data-keyword="ラーメン">🍜 ラーメン</button>
          <button type="button" data-keyword="からあげ">🍗 からあげ</button>
          <button type="button" data-keyword="駐車場">🅿️ 駐車場</button>
          <button type="button" data-keyword="薬局">💊 薬局</button>
        </div>
      </section>
    `;
  }

  function addHomeStyle() {
    const style = document.createElement("style");
    style.textContent = `
      .home-hero-extra {
        margin: 14px 16px 0;
        padding: 20px 16px;
        border-radius: 24px;
        background:
          radial-gradient(circle at 15% 10%, rgba(255,255,255,0.35), transparent 28%),
          linear-gradient(135deg, #ffffff 0%, #ecfeff 52%, #fff7ed 100%);
        box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
        border: 1px solid rgba(255,255,255,0.8);
      }

      .home-kicker {
        margin: 0 0 8px;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.12em;
        color: #0f766e;
      }

      .home-hero-extra h2 {
        margin: 0 0 10px;
        font-size: 23px;
        line-height: 1.35;
        color: #111827;
        letter-spacing: -0.02em;
      }

      .home-lead {
        margin: 0;
        font-size: 14px;
        line-height: 1.7;
        color: #475569;
        font-weight: 600;
      }

      .home-cta-row {
        display: flex;
        gap: 8px;
        margin-top: 14px;
      }

      .home-primary-btn,
      .home-secondary-btn {
        flex: 1;
        min-width: 0;
        padding: 13px 10px;
        border: none;
        border-radius: 16px;
        font-size: 14px;
        font-weight: 900;
        cursor: pointer;
      }

      .home-primary-btn {
        color: #fff;
        background: linear-gradient(135deg, #0f766e 0%, #064e3b 100%);
        box-shadow: 0 6px 16px rgba(15, 118, 110, 0.28);
      }

      .home-secondary-btn {
        color: #fff;
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
        box-shadow: 0 6px 16px rgba(234, 88, 12, 0.26);
      }

      .home-primary-btn:active,
      .home-secondary-btn:active,
      .home-category-pills button:active {
        transform: scale(0.98);
      }

      .home-about-extra,
      .home-category-extra {
        margin: 14px 16px 0;
        padding: 16px;
        border-radius: 22px;
        background: #ffffff;
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
      }

      .home-about-extra h2,
      .home-category-extra h2 {
        margin: 0 0 12px;
        font-size: 18px;
        color: #111827;
      }

      .home-feature-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .home-feature-card {
        padding: 12px;
        border-radius: 16px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
      }

      .home-feature-card span {
        display: inline-flex;
        margin-bottom: 6px;
        font-size: 22px;
      }

      .home-feature-card strong {
        display: block;
        font-size: 14px;
        color: #111827;
        margin-bottom: 4px;
      }

      .home-feature-card p {
        margin: 0;
        font-size: 12px;
        line-height: 1.55;
        color: #64748b;
      }

      .home-category-pills {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .home-category-pills button {
        flex: 1 1 calc(50% - 8px);
        padding: 11px 10px;
        border: none;
        border-radius: 999px;
        background: #f1f5f9;
        color: #0f172a;
        font-size: 13px;
        font-weight: 800;
        cursor: pointer;
      }

      @media (max-width: 360px) {
        .home-cta-row {
          flex-direction: column;
        }

        .home-feature-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function setupEvents() {
    const searchBtn = document.getElementById("homeSearchBtn");
    const formBtn = document.getElementById("homeFormBtn");

    if (searchBtn) {
      searchBtn.addEventListener("click", scrollToSearch);
    }

    if (formBtn) {
      formBtn.addEventListener("click", openForm);
    }

    document.querySelectorAll(".home-category-pills button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const keywordInput = document.getElementById("keywordInput");
        const keyword = btn.dataset.keyword || "";

        if (keywordInput) {
          keywordInput.value = keyword;
          keywordInput.dispatchEvent(new Event("input", { bubbles: true }));
        }

        scrollToSearch();
      });
    });
  }

  function init() {
    const freeListingBanner = document.querySelector(".free-listing-banner");
    if (!freeListingBanner) return;

    if (document.querySelector(".home-hero-extra")) return;

    freeListingBanner.insertAdjacentHTML("afterend", createHomeHtml());
    addHomeStyle();
    setupEvents();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
