-- =====================================================================
-- 관리자 확장: 성과 티커 / 멘토진 / 홈 지표·문구 / 상담 삭제 정책
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
-- (사전: admin.sql, site_content.sql 실행 필요)
-- =====================================================================

-- 1) 상담 신청: 관리자 삭제 허용 (status 수정 정책은 admin.sql에 이미 있음) --
drop policy if exists "admins can delete consultations" on public.consultations;
create policy "admins can delete consultations"
  on public.consultations for delete
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- 2) 성과 티커 -------------------------------------------------------
create table if not exists public.tickers (
  id         uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  published  boolean not null default true,
  "text"     text not null
);
alter table public.tickers enable row level security;
drop policy if exists "public read tickers" on public.tickers;
create policy "public read tickers" on public.tickers for select to anon, authenticated using (published = true);
drop policy if exists "admins all tickers" on public.tickers;
create policy "admins all tickers" on public.tickers for all to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- 3) 멘토진 ----------------------------------------------------------
create table if not exists public.mentors (
  id         uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  published  boolean not null default true,
  name       text not null,
  company    text default '',
  background text default '',
  expertise  text default ''
);
alter table public.mentors enable row level security;
drop policy if exists "public read mentors" on public.mentors;
create policy "public read mentors" on public.mentors for select to anon, authenticated using (published = true);
drop policy if exists "admins all mentors" on public.mentors;
create policy "admins all mentors" on public.mentors for all to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- 4) 홈 지표·문구: site_settings 컬럼 추가 ---------------------------
alter table public.site_settings add column if not exists stat_companies text not null default '13+';
alter table public.site_settings add column if not exists stat_rating text not null default '5.0';
alter table public.site_settings add column if not exists stat_satisfaction text not null default '100%';
alter table public.site_settings add column if not exists companies_text text not null default '신세계프라퍼티, NAI Korea, 한국투자신탁운용, 코람코자산신탁, 롯데AMC, ARA Korea, MDM, 이화자산운용, IFC Seoul, MG새마을금고자산관리 외 다수';

-- 5) 시드 (한 번만) --------------------------------------------------
insert into public.tickers (sort_order, "text")
select * from (values
  (1,'신세계프라퍼티 기획팀 최종 합격'),
  (2,'코람코자산신탁 상장리츠팀 최종 합격'),
  (3,'코람코자산신탁 채용형 인턴 최종 합격'),
  (4,'이화자산운용 대체투자팀 최종 합격'),
  (5,'ARA Korea 리츠운용 최종 합격'),
  (6,'한국투자증권 IB부문 면접 합격'),
  (7,'NH투자증권 IB부문 서류 합격'),
  (8,'KB자산운용 부동산운용본부 서류 및 1차면접 합격'),
  (9,'군인공제회 서류 및 면접 합격'),
  (10,'한국투자신탁운용 인턴 최종 합격'),
  (11,'롯데AMC 리츠투자팀 최종 합격'),
  (12,'NAI Korea Capital Market 최종 합격')
) as v where not exists (select 1 from public.tickers);

insert into public.mentors (sort_order, name, company, background, expertise)
select * from (values
  (1,'멘토 A','부동산 디벨로퍼 대표','전 대기업 종합건설사 부동산개발팀','시행사, 건설사, 개발 및 PF'),
  (2,'멘토 B','국내 Top-Tier 대기업 운용사','전 외국계 컨설팅사 재직','자산운용사, 펀드 및 리츠, PM, LM'),
  (3,'멘토 C','국내 대기업 계열 운용사','전 외국계 컨설팅사 재직','자산운용사, 해외 펀드 투자 및 운용'),
  (4,'멘토 D','국내 Top-Tier 기금운용본부','전 국내 자산운용사 재직','기관투자자, 증권사, 인프라 투자 및 운용'),
  (5,'멘토 E','국내 Top-Tier 증권사','국내 부동산 개발·PF·에쿼티 투자 경험','증권사, 개발 및 PF 사업수지 분석'),
  (6,'멘토 F','외국계 컨설팅사','Valuation 및 컨설팅 프로젝트 다수','재무 모델, 사업수지 분석'),
  (7,'멘토 G','국내 메이저 시행사','공동주택·상업시설 개발 경험 보유','시행사, 증권사, 개발 및 PF'),
  (8,'멘토 H','국내 Top-Tier 기금운용본부','전 은행 기업금융팀, 전 증권사','기관투자자, 은행, 증권사, 기업금융')
) as v where not exists (select 1 from public.mentors);
