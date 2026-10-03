-- =====================================================================
-- 고객이 직접 후기를 남기는 기능(사진 첨부 포함)
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
-- (사전: site_content.sql 실행 필요 — public.reviews 테이블이 있어야 함)
-- =====================================================================

-- 1) reviews 테이블에 사진/출처 컬럼 추가 -------------------------------
alter table public.reviews add column if not exists photo_url text;
alter table public.reviews add column if not exists source text not null default 'admin';
alter table public.reviews drop constraint if exists reviews_source_check;
alter table public.reviews add constraint reviews_source_check check (source in ('admin', 'customer'));

-- 2) 방문자(익명)가 후기를 직접 등록할 수 있도록 insert 허용 -----------
--    검수 없이 바로 노출되지 않도록 published=false, source='customer'를 강제한다.
--    (공개 노출은 관리자가 admin 페이지에서 승인(published=true)해야 함)
drop policy if exists "public submit reviews" on public.reviews;
create policy "public submit reviews"
  on public.reviews for insert
  to anon, authenticated
  with check (published = false and source = 'customer');

-- 3) 후기 첨부 사진 Storage 버킷 ----------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('review-photos', 'review-photos', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public read review-photos" on storage.objects;
create policy "public read review-photos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'review-photos');

-- 방문자가 후기 제출 시 사진을 직접 업로드할 수 있어야 하므로 insert는 익명 허용.
-- (수정·삭제는 허용하지 않음 — 아래 관리자 정책만 update/delete 가능)
drop policy if exists "public upload review-photos" on storage.objects;
create policy "public upload review-photos"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'review-photos');

drop policy if exists "admins manage review-photos" on storage.objects;
create policy "admins manage review-photos"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'review-photos' and exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (bucket_id = 'review-photos' and exists (select 1 from public.admins a where a.user_id = auth.uid()));
