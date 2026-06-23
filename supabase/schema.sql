-- =====================================================================
-- REBE (Real Bridge) Supabase 스키마
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
-- =====================================================================

-- 1) 상담 신청 테이블 -------------------------------------------------
create table if not exists public.consultations (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  phone       text not null,
  email       text,
  program     text,                 -- 관심 패키지 (Real Connect / Bridge / Success)
  message     text not null,
  status      text not null default 'new'  -- new | contacted | done
);

comment on table public.consultations is 'REBE 홈페이지 상담 신청 내역';

-- 2) RLS(행 수준 보안) 활성화 ----------------------------------------
-- 개인정보(이름·연락처)가 담기므로, 기본적으로 아무도 읽지 못하게 잠근다.
alter table public.consultations enable row level security;

-- 3) 정책 -------------------------------------------------------------
-- (a) 홈페이지 방문자(익명)도 '신청 등록(insert)'은 가능해야 한다.
drop policy if exists "anyone can submit consultation" on public.consultations;
create policy "anyone can submit consultation"
  on public.consultations
  for insert
  to anon, authenticated
  with check (true);

-- (b) 조회/수정/삭제 정책은 일부러 만들지 않는다.
--     → 익명·일반 로그인 사용자는 신청 내역을 읽을 수 없다(개인정보 보호).
--     → 관리자는 Supabase 대시보드(Table Editor) 또는 service_role 키로만 열람.

-- 4) 조회 성능용 인덱스 ----------------------------------------------
create index if not exists consultations_created_at_idx
  on public.consultations (created_at desc);
