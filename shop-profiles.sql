-- 店舗管理ポータル追加テーブル
create table if not exists public.shop_profiles (
  facility_id bigint primary key,
  facility_name text default '',
  recommendation text default '',
  hours text default '',
  closed text default '',
  notice text default '',
  updated_at timestamptz default now(),
  updated_by uuid references auth.users(id)
);

alter table public.shop_profiles enable row level security;

-- 公開サイトは内容を読める
create policy "Public can read shop profiles"
on public.shop_profiles for select
to anon, authenticated
using (true);

-- 承認済み店舗オーナーだけ自店舗を追加
create policy "Approved owner can insert shop profile"
on public.shop_profiles for insert
to authenticated
with check (
  exists (
    select 1 from public.shop_owners o
    where o.user_id = auth.uid()
      and o.facility_id = shop_profiles.facility_id
      and o.approved = true
  )
);

-- 承認済み店舗オーナーだけ自店舗を更新
create policy "Approved owner can update shop profile"
on public.shop_profiles for update
to authenticated
using (
  exists (
    select 1 from public.shop_owners o
    where o.user_id = auth.uid()
      and o.facility_id = shop_profiles.facility_id
      and o.approved = true
  )
)
with check (
  exists (
    select 1 from public.shop_owners o
    where o.user_id = auth.uid()
      and o.facility_id = shop_profiles.facility_id
      and o.approved = true
  )
);