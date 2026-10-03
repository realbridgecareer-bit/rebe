-- =====================================================================
-- 후기(reviews)·합격 후기(success_stories) 자가 등록을 "로그인 회원만" 허용.
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
-- (사전: review_submissions.sql, success_story_submissions.sql 실행 필요)
-- =====================================================================

-- 1) reviews: 익명(anon) 제출 차단, 로그인 회원만 허용 ------------------
drop policy if exists "public submit reviews" on public.reviews;
create policy "authenticated submit reviews"
  on public.reviews for insert
  to authenticated
  with check (published = false and source = 'customer');

-- 2) success_stories: 익명(anon) 제출 차단, 로그인 회원만 허용 ----------
drop policy if exists "public submit success_stories" on public.success_stories;
create policy "authenticated submit success_stories"
  on public.success_stories for insert
  to authenticated
  with check (published = false and source = 'customer');

-- 3) 첨부 사진 업로드도 로그인 회원만 허용 -------------------------------
drop policy if exists "public upload review-photos" on storage.objects;
create policy "authenticated upload review-photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'review-photos');
