-- =====================================================================
-- 고객이 직접 합격 후기(성공 스토리)를 남기는 기능(인증 사진 첨부 포함)
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
-- (사전: success_stories.sql, review_submissions.sql 실행 필요
--  — success_stories 테이블과 review-photos 스토리지 버킷이 있어야 함)
-- =====================================================================

-- 1) success_stories 테이블에 인증사진/출처 컬럼 추가 -------------------
alter table public.success_stories add column if not exists proof_photo_url text;
alter table public.success_stories add column if not exists source text not null default 'admin';
alter table public.success_stories drop constraint if exists success_stories_source_check;
alter table public.success_stories add constraint success_stories_source_check check (source in ('admin', 'customer'));

-- 2) 방문자(익명)가 합격 후기를 직접 등록할 수 있도록 insert 허용 ------
--    검수 없이 바로 노출되지 않도록 published=false, source='customer'를 강제한다.
--    (공개 노출은 관리자가 admin 페이지에서 승인(published=true)해야 함)
drop policy if exists "public submit success_stories" on public.success_stories;
create policy "public submit success_stories"
  on public.success_stories for insert
  to anon, authenticated
  with check (published = false and source = 'customer');

-- 인증 사진은 review_submissions.sql에서 만든 review-photos 버킷을 그대로 재사용한다.
-- (이미 공개 읽기·익명 업로드 정책이 있어 별도 버킷/정책이 필요 없음)
