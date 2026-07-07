-- =====================================================================
-- 웹 푸시 구독 저장 테이블 + RLS
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
-- (사전: admin.sql 실행 + 관리자 등록 필요)
-- =====================================================================

create table if not exists public.push_subscriptions (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  endpoint     text unique not null,
  subscription jsonb not null,
  user_id      uuid references auth.users(id) on delete cascade
);

alter table public.push_subscriptions enable row level security;

-- 관리자만 자기 기기 구독을 등록/조회/삭제 (발송 API는 service_role로 전체 조회하므로 RLS 우회)
drop policy if exists "admins insert push" on public.push_subscriptions;
create policy "admins insert push" on public.push_subscriptions for insert to authenticated
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "admins select push" on public.push_subscriptions;
create policy "admins select push" on public.push_subscriptions for select to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "admins delete push" on public.push_subscriptions;
create policy "admins delete push" on public.push_subscriptions for delete to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));
