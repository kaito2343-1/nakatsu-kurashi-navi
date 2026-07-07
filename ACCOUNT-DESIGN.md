# アカウント機能 設計メモ（将来実装用）

作成日：2026-07-07
対象：中津くらしナビ
方針：Supabase（推奨・既に supabase-config.js がある）または Firebase で実装できる形にしておく。

---

## 1. 今できていること

- ログイン仮UI：右上メニュー →「ログイン（準備中）」で表示（phase1-features.js 内 `buildLoginModal`）
- お気に入りは localStorage（キー：`nakatsu_kurashi_navi_favorites`）で端末内保存
- Supabase接続の土台：`supabase-config.js` ＋ `dynamic-facilities-extra.js`（施設データ読み込み用）

## 2. データ構造案

### users（利用者）
| カラム | 型 | 説明 |
|---|---|---|
| id | uuid (PK) | Supabase Authのuser idと同じ値 |
| display_name | text | 表示名（任意） |
| role | text | "user" / "shop_owner" / "admin" |
| created_at | timestamptz | 登録日時 |

### shops（店舗アカウント）
| カラム | 型 | 説明 |
|---|---|---|
| id | uuid (PK) | |
| owner_user_id | uuid (FK→users.id) | この店舗を編集できるユーザー |
| facility_id | bigint | 既存facilities配列のidと対応 |
| approved | boolean | 運営が本人確認したらtrue（勝手に他人の店を名乗れないように） |
| created_at | timestamptz | |

### favorites（お気に入りのクラウド同期）
| カラム | 型 | 説明 |
|---|---|---|
| user_id | uuid (FK→users.id) | |
| facility_id | bigint | |
| created_at | timestamptz | |
| (PK) | (user_id, facility_id) | 重複防止 |

### reservations（将来の予約機能・仮）
| カラム | 型 | 説明 |
|---|---|---|
| id | uuid (PK) | |
| user_id | uuid (FK) | 予約した人 |
| facility_id | bigint | 対象店舗 |
| reserved_at | timestamptz | 予約日時 |
| party_size | int | 人数 |
| status | text | "pending" / "confirmed" / "cancelled" |
| note | text | 要望メモ |

※予約は店舗側の承認フローが必須になるため、shopsのapproved店舗のみ有効化する。

## 3. 認証処理を入れる場所

1. **supabase-config.js**：`auth: { enabled: true }` のような設定を追加（APIキーはanonキーのみ。service_roleキーは絶対にフロントに置かない）
2. **phase1-features.js の `buildLoginModal` 内**：
   - `ログイン`ボタンの disabled を外し、`supabase.auth.signInWithPassword({ email, password })` を呼ぶ
   - 新規登録は `signUp`、ログアウトはメニューに「ログアウト」を追加して `signOut`
3. **script.js の `toggleFavorite` の直後**：ログイン済みなら favorites テーブルにも upsert/delete（未ログイン時は今のlocalStorageのまま）
4. **初期化時（`loadFavorites`）**：ログイン済みならクラウドのfavoritesを取得し、localStorage分とマージ
5. **RLS（Row Level Security）**：
   - favorites：`user_id = auth.uid()` の行だけ読み書き可
   - shops：ownerのみ更新可、参照は全員可
   - facilities：更新はshop owner（approved）と admin のみ

## 4. 店舗アカウントの運用メモ

- 店舗の自己申告だけで編集権を渡さない（なりすまし防止）。掲載依頼フォdomと同様に、公式サイト・公式SNS・電話などで本人確認してから approved を true にする
- 店舗が編集できる項目は最初は限定する：営業時間・定休日・電話・公式URL・ひとことメモ
- 変更履歴を残す（facility_edits テーブル：facility_id / editor_user_id / before / after / created_at）
