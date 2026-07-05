/* ============================================================
   中津くらしナビ：掲載について・運営者情報
   ファイル名：about-extra.js
   サイトの信頼感を上げる説明エリアを追加
   ============================================================ */

(function () {
  const FORM_URL = "https://forms.gle/d6akodKsBw2TDmw68";

  function createAboutHtml() {
    return `
      <section class="about-extra-section" aria-label="中津くらしナビについて">
        <div class="about-extra-head">
          <p class="about-extra-kicker">ABOUT</p>
          <h2>中津くらしナビについて</h2>
          <p>
            中津市周辺のお店・施設・生活情報を、スマホで探しやすくまとめる地域情報サイトです。
          </p>
        </div>

        <div class="about-extra-grid">
          <div class="about-extra-card">
            <span class="about-extra-icon">🧭</span>
            <strong>このサイトの目的</strong>
            <p>
              中津でご飯屋さん、カフェ、居酒屋、病院、薬局、駐車場などを探す時に、
              すぐ確認できる地域ナビを目指しています。
            </p>
          </div>

          <div class="about-extra-card">
            <span class="about-extra-icon">📣</span>
            <strong>掲載は無料受付中</strong>
            <p>
              中津市周辺のお店・施設は、無料で掲載依頼できます。
              公式Instagram、公式サイト、住所など確認できる情報をもとに掲載します。
            </p>
          </div>

          <div class="about-extra-card">
            <span class="about-extra-icon">✅</span>
            <strong>情報確認について</strong>
            <p>
              掲載情報は、公式サイト・公式SNS・Googleマップなどで確認できる範囲をもとにしています。
              最新情報は必ず公式情報をご確認ください。
            </p>
          </div>

          <div class="about-extra-card">
            <span class="about-extra-icon">🤝</span>
            <strong>修正依頼について</strong>
            <p>
              営業時間、住所、電話番号、Instagramリンクなどに変更がある場合は、
              フォームから修正依頼を送れます。
            </p>
          </div>
        </div>

        <div class="about-extra-notice">
          <h3>免責事項</h3>
          <p>
            掲載情報は正確性を保つよう努めていますが、営業時間・定休日・料金・サービス内容などは
            変更される場合があります。お出かけ前・利用前に、各店舗・施設の公式情報をご確認ください。
          </p>
          <p>
            本サイトの掲載情報を利用したことによって発生した損害等について、当サイトは責任を負いかねます。
          </p>
        </div>

        <div class="about-extra-owner">
          <h3>運営者情報</h3>
          <p>
            運営：中津くらしナビ運営
          </p>
          <p>
            掲載依頼・修正依頼・お問い合わせは、下のフォームからお願いします。
          </p>
          <a href="${FORM_URL}" target="_blank" rel="noopener" class="about-extra-form-btn">
            📩 掲載依頼・修正依頼フォームを開く
          </a>
        </div>
      </section>
    `;
  }

  function addAboutStyle() {
    if (document.getElementById("about-extra-style")) return;

    const style = document.createElement("style");
    style.id = "about-extra-style";
    style.textContent = `
      .about-extra-section {
        margin: 18px 16px 0;
        padding: 18px 16px;
        border-radius: 24px;
        background:
          radial-gradient(circle at 100% 0%, rgba(249,115,22,0.12), transparent 30%),
          linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.09);
        border: 1px solid rgba(226, 232, 240, 0.9);
      }

      .about-extra-head {
        margin-bottom: 14px;
      }

      .about-extra-kicker {
        margin: 0 0 6px;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.14em;
        color: #ea580c;
      }

      .about-extra-head h2 {
        margin: 0 0 8px;
        font-size: 20px;
        color: #111827;
      }

      .about-extra-head p {
        margin: 0;
        font-size: 13px;
        line-height: 1.7;
        color: #475569;
        font-weight: 600;
      }

      .about-extra-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .about-extra-card {
        padding: 13px;
        border-radius: 18px;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        box-shadow: 0 6px 14px rgba(15, 23, 42, 0.04);
      }

      .about-extra-icon {
        display: inline-flex;
        margin-bottom: 7px;
        font-size: 23px;
      }

      .about-extra-card strong {
        display: block;
        margin-bottom: 5px;
        font-size: 14px;
        color: #111827;
      }

      .about-extra-card p {
        margin: 0;
        font-size: 12px;
        line-height: 1.65;
        color: #64748b;
      }

      .about-extra-notice,
      .about-extra-owner {
        margin-top: 12px;
        padding: 14px;
        border-radius: 18px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
      }

      .about-extra-notice h3,
      .about-extra-owner h3 {
        margin: 0 0 8px;
        font-size: 15px;
        color: #111827;
      }

      .about-extra-notice p,
      .about-extra-owner p {
        margin: 0 0 8px;
        font-size: 12px;
        line-height: 1.7;
        color: #475569;
      }

      .about-extra-form-btn {
        display: block;
        margin-top: 10px;
        padding: 13px 12px;
        border-radius: 16px;
        color: #fff;
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
        text-align: center;
        text-decoration: none;
        font-size: 14px;
        font-weight: 900;
        box-shadow: 0 6px 16px rgba(234, 88, 12, 0.25);
      }

      .about-extra-form-btn:active {
        transform: scale(0.98);
      }

      @media (max-width: 380px) {
        .about-extra-grid {
          grid-template-columns: 1fr;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function init() {
    if (document.querySelector(".about-extra-section")) return;

    const footer = document.querySelector(".site-footer");
    if (!footer) return;

    footer.insertAdjacentHTML("beforebegin", createAboutHtml());
    addAboutStyle();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
