/* 店舗管理ポータルで更新した情報を公開サイトへ反映 */
(function(){
"use strict";
async function applyShopProfiles(){
 if(typeof facilities==="undefined"||!window.NAKATSU_AUTH||!window.NAKATSU_AUTH.client)return;
 var client=window.NAKATSU_AUTH.client;
 try{
  var res=await client.from("shop_profiles").select("facility_id,recommendation,hours,closed,notice");
  if(res.error)throw res.error;
  (res.data||[]).forEach(function(row){
   var f=facilities.find(function(x){return String(x.id)===String(row.facility_id)});
   if(!f)return;
   if(row.hours)f.hours=row.hours;
   if(row.closed)f.closed=row.closed;
   if(row.recommendation)f.todayRecommendation=row.recommendation;
   if(row.notice)f.shopNotice=row.notice;
  });
  if(typeof render==="function")render();
 }catch(e){console.warn("[shop-profile-public] 読み込み失敗",e)}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){setTimeout(applyShopProfiles,900)},{once:true});else setTimeout(applyShopProfiles,900);
})();
