-- =====================================================================
-- 실제 후기 원본(카톡 캡쳐) 갤러리 테이블 + RLS + 시드
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
-- (사전: admin.sql, success_stories.sql[story-logos 버킷] 실행 필요)
-- =====================================================================

create table if not exists public.review_shots (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sort_order int not null default 0,
  published  boolean not null default true,
  image_url  text not null,
  label      text default ''
);
create index if not exists review_shots_order_idx on public.review_shots (sort_order asc);

alter table public.review_shots enable row level security;

drop policy if exists "public read review_shots" on public.review_shots;
create policy "public read review_shots" on public.review_shots for select to anon, authenticated using (published = true);

drop policy if exists "admins all review_shots" on public.review_shots;
create policy "admins all review_shots" on public.review_shots for all to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- 기존 2건 시드 (한 번만)
insert into public.review_shots (sort_order, image_url, label)
select * from (values
  (1, '/reviews/koramco.jpg', '코람코자산신탁 채용형 인턴 · Real Success'),
  (2, '/reviews/nai-korea-v4.jpg', 'NAI Korea · Real Success')
) as v where not exists (select 1 from public.review_shots);
