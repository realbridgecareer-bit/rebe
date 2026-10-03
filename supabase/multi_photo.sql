-- =====================================================================
-- 후기(reviews)·합격 후기(success_stories) 첨부 사진 여러 장 지원
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
-- (review_submissions.sql / success_story_submissions.sql을 먼저 실행 안 했어도
--  안전하게 실행되도록, 옛 단수형 컬럼이 없으면 자동으로 건너뜁니다)
-- =====================================================================

-- 1) reviews: 단일 photo_url → 배열 photo_urls -------------------------
alter table public.reviews add column if not exists photo_urls text[] not null default '{}';

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'reviews' and column_name = 'photo_url'
  ) then
    execute '
      update public.reviews
        set photo_urls = array[photo_url]
        where photo_url is not null and photo_url <> '''' and coalesce(array_length(photo_urls, 1), 0) = 0
    ';
  end if;
end $$;

-- 2) success_stories: 단일 proof_photo_url → 배열 proof_photo_urls -----
alter table public.success_stories add column if not exists proof_photo_urls text[] not null default '{}';

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'success_stories' and column_name = 'proof_photo_url'
  ) then
    execute '
      update public.success_stories
        set proof_photo_urls = array[proof_photo_url]
        where proof_photo_url is not null and proof_photo_url <> '''' and coalesce(array_length(proof_photo_urls, 1), 0) = 0
    ';
  end if;
end $$;

-- 기존 photo_url / proof_photo_url 컬럼은 삭제하지 않고 그대로 둔다(안전한 마이그레이션).
-- 앱 코드는 이제 photo_urls / proof_photo_urls 배열만 사용한다.
