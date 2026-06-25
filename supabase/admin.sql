-- =====================================================================
-- 관리자(Admin) 기능 — Supabase SQL Editor에서 실행
-- =====================================================================

-- 1) 관리자 테이블 -----------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- 로그인한 사용자가 "자신이 관리자인지" 확인할 수 있도록 자기 행 조회 허용
drop policy if exists "read own admin row" on public.admins;
create policy "read own admin row"
  on public.admins for select
  to authenticated
  using (auth.uid() = user_id);

-- 2) 상담 신청 내역: 관리자만 조회 가능 -------------------------------
-- (insert 정책은 schema.sql에서 이미 익명 허용 — 조회만 관리자에게 추가)
drop policy if exists "admins can read consultations" on public.consultations;
create policy "admins can read consultations"
  on public.consultations for select
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- 관리자가 상태(처리됨 등)를 바꿀 수 있도록 update 허용
drop policy if exists "admins can update consultations" on public.consultations;
create policy "admins can update consultations"
  on public.consultations for update
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- 3) 나를 관리자로 지정 -----------------------------------------------
-- 아래 'YOUR_ADMIN_EMAIL'을 회원가입한 관리자 계정 이메일로 바꿔 실행하세요.
-- (먼저 그 이메일로 사이트에서 회원가입을 해두어야 auth.users에 존재합니다.)
--
-- insert into public.admins (user_id)
-- select id from auth.users where email = 'YOUR_ADMIN_EMAIL'
-- on conflict do nothing;
