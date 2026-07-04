/* 中津くらしナビ：居酒屋おすすめランキング */
(function () {
  function createRankingSection() {
    if (document.getElementById("izakayaRanking")) return;

    const main = document.querySelector("main");
    if (!main) return;

    const style = document.createElement("style");
    style.textContent = `
      .ranking-section {
        margin: 16px 16px 0;
        padding: 16px;
        border-radius: 18px;
        background: linear-gradient(135deg, #fff7e6 0%, #fff 55%, #e8f4f2 100%);
        border: 1px solid #f0d9a8;
        box-shadow: 0 3px 12px rgba(20, 40, 36, 0.08);
      }
      .ranking-title {
        margin: 0 0 6px;
        font-size: 19px;
        font-weight: 800;
        color: #0e4f4a;
      }
      .ranking-lead {
        margin: 0 0 12px;
        font-size: 13px;
        color: #5b6663;
      }
      .ranking-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .ranking-item {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        padding: 10px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.86);
        border: 1px solid #eee4d0;
      }
      .ranking-rank {
        flex: none;
        min-width: 42px;
        padding: 4px 7px;
        border-radius: 999px;
        background: #146b64;
        color: #fff;
        font-size: 13px;
        font-weight: 800;
        text-align: center;
      }
      .ranking-name {
        font-size: 15px;
        font-weight: 800;
        color: #202826;
      }
      .ranking-desc {
        margin-top: 2px;
        font-size: 13px;
        color: #5b6663;
        line-height: 1.5;
      }
      .ranking-search-btn {
        display: inline-flex;
        margin-top: 8px;
        padding: 6px 10px;
        border-radius: 999px;
        background: #e4f2f0;
        color: #0e4f4a;
        font-size: 12px;
        font-weight: 800;
        border: none;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);

    const section = document.createElement("section");
    section.id = "izakayaRanking";
    section.className = "ranking-section";
    section.innerHTML = `
      <h2 class="ranking-title">🍻 中津駅周辺 居酒屋おすすめ</h2>
      <p class="ranking-lead">用途別に選びやすいよう、掲載店舗からピックアップしています。営業時間・空席は来店前に確認してください。</p>
      <ol class="ranking-list">
        <li class="ranking-item">
          <span class="ranking-rank">1位</span>
          <div>
            <div class="ranking-name">マルイチ</div>
            <div class="ranking-desc">焼き鳥・一人飲みにおすすめ。カウンター飲み候補。</div>
            <button class="ranking-search-btn" data-keyword="マルイチ">この店を見る</button>
          </div>
        </li>
        <li class="ranking-item">
          <span class="ranking-rank">2位</span>
          <div>
            <div class="ranking-name">on the sly.</div>
            <div class="ranking-desc">深夜・二軒目候補。バー感覚でも使いやすいグリル系。</div>
            <button class="ranking-search-btn" data-keyword="on the sly">この店を見る</button>
          </div>
        </li>
        <li class="ranking-item">
          <span class="ranking-rank">3位</span>
          <div>
            <div class="ranking-name">大衆酒場 達磨</div>
            <div class="ranking-desc">飲み放題・個室・スポーツ観戦向け。グループ利用候補。</div>
            <button class="ranking-search-btn" data-keyword="達磨">この店を見る</button>
          </div>
        </li>
        <li class="ranking-item">
          <span class="ranking-rank">4位</span>
          <div>
            <div class="ranking-name">文楽</div>
            <div class="ranking-desc">落ち着く居酒屋候補。ゆっくり飲みたい時に。</div>
            <button class="ranking-search-btn" data-keyword="文楽">この店を見る</button>
          </div>
        </li>
        <li class="ranking-item">
          <span class="ranking-rank">5位</span>
          <div>
            <div class="ranking-name">扇八</div>
            <div class="ranking-desc">コスパ・一人飲み向け。駅近で少人数にも使いやすい候補。</div>
            <button class="ranking-search-btn" data-keyword="扇八">この店を見る</button>
          </div>
        </li>
      </ol>
    `;

    main.parentNode.insertBefore(section, main);

    section.querySelectorAll(".ranking-search-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const keyword = btn.dataset.keyword || "";
        const input = document.getElementById("keywordInput");
        if (input) {
          input.value = keyword;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", createRankingSection);
})();
