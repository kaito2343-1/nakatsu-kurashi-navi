/* ============================================================
   中津くらしナビ：Supabase接続設定
   ファイル名：supabase-config.js

   Supabaseを使う時は enabled を true にして、
   url と publicKey を入力してください。

   注意：
   - このファイルは公開されます。
   - ブラウザ公開用の anon / publishable key だけを入れてください。
   - service_role / secret 系の強いキーは絶対に入れないでください。
   ============================================================ */

window.NAKATSU_SUPABASE_CONFIG = {
  // Supabaseを使う時は true に変更
   enabled: true,

url: "https://hhzqdnaaeseiaakhhttm.supabase.co",

publicKey: "sb_publishable_hLXGGFyqYRjDWC39C0BoQQ_d9kmfVtK",

  table: "facilities",

  // サイト側では公開済みの施設だけ読む
  onlyPublished: true,

  // 既存の静的データIDとSupabaseのIDが被らないようにする
  dynamicIdBase: 900000,

  selectColumns: "id,name,category,description,address,phone,hours,closed,map_url,official_url,instagram,source_memo,tags,memo,verified,is_published,sort_order,created_at,updated_at"
};
