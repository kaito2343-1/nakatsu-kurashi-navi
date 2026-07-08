/* ============================================================
   中津くらしナビ supabase-auth.js

   役割：
   - Supabase Authのクライアントを1つだけ作って、他のファイルから使えるようにする
   - ログイン／新規登録／ログアウト／セッション確認の共通関数を提供

   前提：
   - supabase-config.js が先に読み込まれていること（url / publicKey を使う）
   - Supabase JS SDK（CDN）が先に読み込まれていること
     → app-shell.js が <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
       を読み込んでから、このファイルを読み込みます

   他のファイルからの使い方：
     const { data, error } = await window.NAKATSU_AUTH.signIn(email, password);
     const { data, error } = await window.NAKATSU_AUTH.signUp(email, password);
     await window.NAKATSU_AUTH.signOut();
     const session = await window.NAKATSU_AUTH.getSession();
     window.NAKATSU_AUTH.client  ← supabase-jsのクライアント本体（テーブル操作用）
   ============================================================ */

(function () {
  "use strict";

  function getConfig() {
    return window.NAKATSU_SUPABASE_CONFIG || {};
  }

  function isReady(config) {
    return Boolean(config && config.enabled === true && config.url && config.publicKey);
  }

  var client = null;

  function initClient() {
    if (client) return client;

    var config = getConfig();
    if (!isReady(config)) {
      console.warn("[supabase-auth] Supabase設定が未入力のため、ログイン機能は無効です。");
      return null;
    }
    if (typeof window.supabase === "undefined" || !window.supabase.createClient) {
      console.warn("[supabase-auth] Supabase JS SDKが読み込まれていません。");
      return null;
    }

    client = window.supabase.createClient(config.url, config.publicKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: "nakatsu_kurashi_navi_auth"
      }
    });
    return client;
  }

  async function signUp(email, password) {
    var c = initClient();
    if (!c) return { data: null, error: { message: "Supabase未設定です" } };
    return c.auth.signUp({ email: email, password: password });
  }

  async function signIn(email, password) {
    var c = initClient();
    if (!c) return { data: null, error: { message: "Supabase未設定です" } };
    return c.auth.signInWithPassword({ email: email, password: password });
  }

  async function signOut() {
    var c = initClient();
    if (!c) return { error: null };
    return c.auth.signOut();
  }

  async function getSession() {
    var c = initClient();
    if (!c) return null;
    var result = await c.auth.getSession();
    return (result && result.data && result.data.session) || null;
  }

  function onAuthStateChange(callback) {
    var c = initClient();
    if (!c) return;
    c.auth.onAuthStateChange(function (event, session) {
      callback(session);
    });
  }

  window.NAKATSU_AUTH = {
    get client() { return initClient(); },
    signUp: signUp,
    signIn: signIn,
    signOut: signOut,
    getSession: getSession,
    onAuthStateChange: onAuthStateChange
  };

  // ページ読み込み時に一度クライアントを準備しておく
  initClient();
})();
