(function(){
"use strict";
function $(s,r){return (r||document).querySelector(s)}
function esc(v){return String(v==null?"":v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}
function toast(msg){var el=$("#toast");el.textContent=msg;el.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(function(){el.classList.remove("show")},1800)}
function timeAgo(iso){var t=Date.parse(iso);if(!t)return"未更新";var m=Math.round((Date.now()-t)/60000);if(m<1)return"たった今";if(m<60)return m+"分前";var h=Math.round(m/60);if(h<24)return h+"時間前";return Math.round(h/24)+"日前"}
var auth=window.NAKATSU_AUTH;
var client=null;
var STATUS=["空きあり","やや混雑","満席"];

async function init(){
 client=auth&&auth.client;
 if(!client){showLogin("接続設定を確認してください。");return}
 var session=await auth.getSession();
 if(!session||!session.user){showLogin();return}
 showPortal(session);
}
function showLogin(message){
 $("#loginView").hidden=false;$("#portalView").hidden=true;$("#logoutBtn").hidden=true;
 if(message)$("#loginMessage").textContent=message;
}
async function showPortal(session){
 $("#loginView").hidden=true;$("#portalView").hidden=false;$("#logoutBtn").hidden=false;
 $("#userEmail").textContent=session.user.email+" でログイン中";
 await loadShops(session.user.id);
}
$("#loginForm").addEventListener("submit",async function(e){
 e.preventDefault();var btn=$("#loginSubmit"),msg=$("#loginMessage");
 btn.disabled=true;msg.textContent="ログイン中…";
 var res=await auth.signIn($("#loginEmail").value.trim(),$("#loginPassword").value);
 btn.disabled=false;
 if(res.error){msg.textContent="ログインできませんでした："+res.error.message;return}
 var session=await auth.getSession();if(session)showPortal(session);
});
$("#logoutBtn").addEventListener("click",async function(){await auth.signOut();showLogin();toast("ログアウトしました")});

async function loadShops(userId){
 $("#portalLoading").hidden=false;$("#portalEmpty").hidden=true;$("#shopList").innerHTML="";
 var own=await client.from("shop_owners").select("*").eq("user_id",userId);
 $("#portalLoading").hidden=true;
 if(own.error){$("#portalEmpty").hidden=false;$("#portalEmpty").innerHTML="<strong>読み込みに失敗しました</strong><p>"+esc(own.error.message)+"</p>";return}
 var rows=own.data||[];
 if(!rows.length){$("#portalEmpty").hidden=false;return}
 var approvedIds=rows.filter(function(r){return r.approved}).map(function(r){return r.facility_id});
 var statusMap={},photoMap={},profileMap={};
 if(approvedIds.length){
  var results=await Promise.all([
   client.from("shop_status").select("*").in("facility_id",approvedIds),
   client.from("shop_photos").select("*").in("facility_id",approvedIds),
   client.from("shop_profiles").select("*").in("facility_id",approvedIds)
  ]);
  (results[0].data||[]).forEach(function(r){statusMap[String(r.facility_id)]=r});
  (results[1].data||[]).forEach(function(r){photoMap[String(r.facility_id)]=r});
  (results[2].data||[]).forEach(function(r){profileMap[String(r.facility_id)]=r});
 }
 $("#shopList").innerHTML=rows.map(function(row){
  if(!row.approved)return '<article class="shop-card pending-card"><h2>'+esc(row.facility_name||"店舗")+'</h2><p>⏳ 現在、運営側の承認待ちです。</p></article>';
  var id=String(row.facility_id),st=statusMap[id],photo=photoMap[id],profile=profileMap[id]||{};
  var current=st&&st.status?st.status:"未設定",updated=st&&st.updated_at?timeAgo(st.updated_at)+"に更新":"まだ更新されていません";
  return '<article class="shop-card" data-id="'+esc(id)+'" data-name="'+esc(row.facility_name||"")+'">'+
   '<header class="shop-card-head"><div class="shop-title"><div class="shop-avatar">'+(photo?'<img src="'+esc(photo.photo_url)+'" alt="">':'🏪')+'</div><div><h2>'+esc(row.facility_name||("施設ID:"+id))+'</h2><p>店舗情報を管理できます</p></div></div><span class="approved-badge">承認済み</span></header>'+
   '<div class="shop-dashboard-grid">'+
    '<section class="panel"><p class="panel-label">LIVE STATUS</p><h3>現在の状況</h3><div class="current-status" data-status="'+esc(current)+'"><div><strong>'+esc(current)+'</strong><small>'+esc(updated)+'</small></div><span class="status-dot"></span></div><div class="status-buttons">'+STATUS.map(function(s){return'<button class="status-btn '+(s===current?"active":"")+'" type="button" data-status="'+s+'">'+s+'</button>'}).join("")+'</div><p class="save-message status-message"></p></section>'+
    '<section class="panel"><p class="panel-label">TODAY</p><h3>本日のおすすめ</h3><div class="profile-grid"><label class="full">おすすめ内容<textarea class="recommendation" rows="5" placeholder="例：本日限定ランチ、数量限定商品など">'+esc(profile.recommendation||"")+'</textarea></label></div><button class="primary-btn save-profile-btn" type="button">おすすめを更新</button><p class="save-message profile-message"></p></section>'+
    '<section class="panel"><p class="panel-label">PHOTO</p><h3>店舗写真</h3><div class="photo-preview">'+(photo?'<img src="'+esc(photo.photo_url)+'" alt="店舗写真">':'<span>店舗写真は未設定です</span>')+'</div><div class="photo-actions"><label class="file-label">写真を選ぶ<input class="photo-input" type="file" accept="image/jpeg,image/png,image/webp" hidden></label><button class="danger-btn remove-photo" type="button">削除</button></div><p class="save-message photo-message"></p></section>'+
    '<section class="panel"><p class="panel-label">BUSINESS HOURS</p><h3>営業時間・定休日</h3><div class="profile-grid"><label>営業時間<input class="hours-input" value="'+esc(profile.hours||"")+'" placeholder="11:00〜21:00"></label><label>定休日<input class="closed-input" value="'+esc(profile.closed||"")+'" placeholder="火曜日"></label><label class="full">臨時のお知らせ<textarea class="notice-input" rows="3" placeholder="臨時休業、営業時間変更など">'+esc(profile.notice||"")+'</textarea></label></div><button class="primary-btn save-business-btn" type="button">営業情報を更新</button><p class="save-message business-message"></p></section>'+
   '</div></article>';
 }).join("");
 bindCards(userId);
}
function bindCards(userId){
 document.querySelectorAll(".shop-card[data-id]").forEach(function(card){
  card.querySelectorAll(".status-btn").forEach(function(btn){btn.onclick=function(){updateStatus(card,btn.dataset.status,userId)}});
  $(".save-profile-btn",card).onclick=function(){saveProfile(card,userId,"recommendation")};
  $(".save-business-btn",card).onclick=function(){saveProfile(card,userId,"business")};
  $(".photo-input",card).onchange=function(){if(this.files&&this.files[0])uploadPhoto(card,this.files[0],userId)};
  $(".remove-photo",card).onclick=function(){removePhoto(card)};
 });
}
async function updateStatus(card,status,userId){
 var msg=$(".status-message",card);msg.textContent="更新中…";
 var res=await client.from("shop_status").upsert({facility_id:Number(card.dataset.id),facility_name:card.dataset.name,status:status,updated_at:new Date().toISOString(),updated_by:userId},{onConflict:"facility_id"});
 if(res.error){msg.textContent="更新失敗："+res.error.message;return}
 var box=$(".current-status",card);box.dataset.status=status;$("strong",box).textContent=status;$("small",box).textContent="たった今更新";
 card.querySelectorAll(".status-btn").forEach(function(b){b.classList.toggle("active",b.dataset.status===status)});
 msg.textContent="更新しました";toast("空き状況を更新しました");
}
async function saveProfile(card,userId,mode){
 var msg=mode==="recommendation"?$(".profile-message",card):$(".business-message",card);msg.textContent="保存中…";
 var payload={facility_id:Number(card.dataset.id),facility_name:card.dataset.name,recommendation:$(".recommendation",card).value.trim(),hours:$(".hours-input",card).value.trim(),closed:$(".closed-input",card).value.trim(),notice:$(".notice-input",card).value.trim(),updated_at:new Date().toISOString(),updated_by:userId};
 var res=await client.from("shop_profiles").upsert(payload,{onConflict:"facility_id"});
 if(res.error){msg.textContent="保存失敗："+res.error.message;return}
 msg.textContent="更新しました";toast("店舗情報を更新しました");
}
function resize(file){
 return new Promise(function(resolve,reject){var img=new Image(),reader=new FileReader();reader.onload=function(e){img.src=e.target.result};reader.onerror=function(){reject(new Error("読み込み失敗"))};img.onload=function(){var max=1600,scale=Math.min(1,max/img.width),c=document.createElement("canvas");c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);c.getContext("2d").drawImage(img,0,0,c.width,c.height);c.toBlob(function(b){b?resolve(b):reject(new Error("画像変換失敗"))},"image/jpeg",.84)};img.onerror=function(){reject(new Error("画像を読み込めません"))};reader.readAsDataURL(file)})
}
async function uploadPhoto(card,file,userId){
 var msg=$(".photo-message",card);if(!file.type.startsWith("image/")){msg.textContent="画像を選んでください";return}if(file.size>15*1024*1024){msg.textContent="15MB以下にしてください";return}
 msg.textContent="アップロード中…";
 try{var blob=await resize(file),id=Number(card.dataset.id),path=id+"/"+Date.now()+".jpg";var up=await client.storage.from("shop-photos").upload(path,blob,{contentType:"image/jpeg",upsert:false});if(up.error)throw up.error;var url=client.storage.from("shop-photos").getPublicUrl(path).data.publicUrl;var db=await client.from("shop_photos").upsert({facility_id:id,photo_url:url,updated_at:new Date().toISOString(),updated_by:userId},{onConflict:"facility_id"});if(db.error)throw db.error;$(".photo-preview",card).innerHTML='<img src="'+esc(url)+'" alt="店舗写真">';$(".shop-avatar",card).innerHTML='<img src="'+esc(url)+'" alt="">';msg.textContent="写真を更新しました";toast("店舗写真を更新しました")}catch(e){msg.textContent="失敗："+(e.message||"不明なエラー")}
}
async function removePhoto(card){
 if(!confirm("店舗写真を削除しますか？"))return;var msg=$(".photo-message",card),id=Number(card.dataset.id);msg.textContent="削除中…";var res=await client.from("shop_photos").delete().eq("facility_id",id);if(res.error){msg.textContent="削除失敗："+res.error.message;return}$(".photo-preview",card).innerHTML="<span>店舗写真は未設定です</span>";$(".shop-avatar",card).textContent="🏪";msg.textContent="削除しました";toast("店舗写真を削除しました")
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
})();
