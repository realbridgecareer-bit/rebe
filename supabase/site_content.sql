-- =====================================================================
-- 서비스 패키지 / 컨설팅 후기 / 할인 설정 테이블 + RLS + 시드
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
-- (사전: admin.sql 실행 + 관리자 등록 필요)
-- =====================================================================

-- 1) 서비스 패키지 ----------------------------------------------------
create table if not exists public.packages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  sort_order  int not null default 0,
  published   boolean not null default true,
  name        text not null,
  sub         text default '',
  detail      text default '',
  price       text default '',      -- 정가 (예: "68만원")
  sale_price  text,                 -- 할인가 (예: "48만원"); null이면 할인 없음
  features    text[] not null default '{}',
  featured    boolean not null default false
);
create index if not exists packages_order_idx on public.packages (sort_order asc);

-- 2) 컨설팅 후기 ------------------------------------------------------
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  sort_order  int not null default 0,
  published   boolean not null default true,
  name        text not null,
  service     text not null default 'Real Connect',
  persona     text default '',
  "text"      text not null
);
create index if not exists reviews_order_idx on public.reviews (sort_order asc);

-- 3) 사이트 설정(할인 프로모션) — 단일 행 ----------------------------
create table if not exists public.site_settings (
  id            int primary key default 1,
  promo_enabled boolean not null default true,
  promo_label   text not null default '30% 할인',
  promo_banner  text not null default '전 서비스 30% 할인',
  updated_at    timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

-- 4) RLS --------------------------------------------------------------
alter table public.packages enable row level security;
alter table public.reviews enable row level security;
alter table public.site_settings enable row level security;

-- 공개 읽기 (published) + 관리자 전체/쓰기 : packages
drop policy if exists "public read packages" on public.packages;
create policy "public read packages" on public.packages for select to anon, authenticated using (published = true);
drop policy if exists "admins all packages" on public.packages;
create policy "admins all packages" on public.packages for all to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- 공개 읽기 (published) + 관리자 전체/쓰기 : reviews
drop policy if exists "public read reviews" on public.reviews;
create policy "public read reviews" on public.reviews for select to anon, authenticated using (published = true);
drop policy if exists "admins all reviews" on public.reviews;
create policy "admins all reviews" on public.reviews for all to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- 공개 읽기(전체) + 관리자 수정 : site_settings
drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings for select to anon, authenticated using (true);
drop policy if exists "admins update settings" on public.site_settings;
create policy "admins update settings" on public.site_settings for update to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));
drop policy if exists "admins insert settings" on public.site_settings;
create policy "admins insert settings" on public.site_settings for insert to authenticated
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- 5) 시드 (한 번만; 이미 있으면 건너뜀) ------------------------------
insert into public.site_settings (id, promo_enabled, promo_label, promo_banner)
values (1, true, '30% 할인', '전 서비스 30% 할인')
on conflict (id) do nothing;

insert into public.packages (sort_order, name, sub, detail, price, sale_price, featured, features)
select * from (values
  (1, 'Real Connect', '대면 컨설팅', '90분 1회', '68만원', '48만원', false,
   array['입사지원서 컨설팅 or 면접 준비 컨설팅(택1)','지원 직무·업계 현직자 관점의 컨설팅','필요 부분 수정, 방향성 제시, 어필 포인트 제시','채용공고에 드러나지 않는 핵심 역량·준비 방향 안내','업계 연봉 수준·복지 등 현직자 관점의 정보 안내']),
  (2, 'Real Bridge', '대면 컨설팅', '90분 2회', '126만원', '88만원', false,
   array['입사지원서·면접·커리어 단계적 컨설팅','지원 직무·업계 현직자 관점의 컨설팅','직무별 마스터 자소서 및 면접 예상 질문 제공','현직자 경험을 바탕으로 한 직무·업계 동향 제공','채용 동향 및 추천 직무 안내','직무 역량 개발을 위한 학습 자료 제공']),
  (3, 'Real Success', '대면 컨설팅 3회', '시간 제한 없음', '164만원', '115만원', true,
   array['Real Bridge의 모든 혜택 포함','타 지원자와 Grouping으로 객관적 위치 파악','합격 사례 및 정보 제공(자소서·면접)','대규모 네트워킹 모임 참여 기회','현직자 네트워킹을 통한 직무·업계 정보 제공','직무에 필요한 Skill-up 자료 제공'])
) as v where not exists (select 1 from public.packages);

insert into public.reviews (sort_order, name, service, persona, "text")
select * from (values
  (1, '김ㅇㅇ 님', 'Real Connect', '신입 · 면접 준비', '자소서를 기반으로 한 면접 준비 도움을 받았는데, 제가 뭐가 부족하고 뭘 보완해야 할지 명확히 알게 되어 정말 값진 시간이었습니다. 앞으로의 방향성을 설정하는 데도 큰 도움을 받았습니다. 감사합니다!'),
  (2, '이ㅇㅇ 님', 'Real Connect', '신입 · 자소서', '객관적으로 보지 못했던 제 자소서의 문제점을 일목요연하게 정리해주셨습니다. 가려웠던 부분들도 정확하게 캐치해서 답변해주시고, 제가 하고 싶었던 업무를 취준생 입장에서 듣기 편하게 설명해주셨어요. 1회를 등록했지만 꿈을 이루기 위해 추가로 더 등록하려 합니다. 함께라면 목표를 달성할 것 같은 느낌이 강하게 듭니다.'),
  (3, '최ㅇㅇ 님', 'Real Connect', '신입 · 면접 대비', '코멘트 주신 부분이 면접에서 많이 도움이 되었습니다. 멘토님께서 업계 용어(GP, LP 개념)를 알려주셔서 관심 어필을 할 수 있었어요. 촉박한 일정에도 현업에 계신 분들을 빠르게 연결해주시고 대응도 빨라서 준비 과정에 큰 도움이 됐습니다. 감사드려요!'),
  (4, '박ㅇㅇ 님', 'Real Bridge', '신입 · 진로 방향', '공채가 뜰 때마다 ''일단 무작정 다 지원하자''는 막연한 마음이었는데, 컨설팅을 통해 제게 맞는 직무와 진로 방향을 구체적으로 잡을 수 있었습니다. 특히 자기소개서를 어떻게 작성해야 할지 명확히 보이기 시작했습니다. 정말 감사드립니다!'),
  (5, '정ㅇㅇ 님', 'Real Bridge', '중고신입 · 직무 이해', '현업 중심의 내용으로 구성되어 실질적인 도움이 됐습니다. 이론적 조언에 그치지 않고 실제 실무 사례를 바탕으로 설명해주어 업무 흐름과 역할을 명확히 이해할 수 있었고, 자기소개서와 경력기술서를 구조적으로 검토해주신 점이 인상 깊었습니다. 단어를 바꾸는 수준을 넘어 전체 맥락과 메시지를 직무와 연결해 피드백해주셨어요.'),
  (6, '강ㅇㅇ 님', 'Real Bridge', '신입 · 자소서 방향', '다소 폐쇄적인 분야라 혼자 준비하며 스스로도 두루뭉술하다고 생각했는데, 1차 멘토링 피드백을 통해 제 경험·성격·관심사를 기반으로 자소서를 어떤 방향으로 써야 할지 파악할 수 있어 만족스러웠습니다. 멘토분들께서 앞으로의 계획과 현업 이야기도 해주셔서 큰 도움이 됐습니다.'),
  (7, '윤ㅇㅇ 님', 'Real Success', '타 금융업 재직 · 커리어 전환', '타 금융업계 재직자로 부동산 금융 진입을 검토하며 이용했는데, 직장인에게도 정말 값진 시간이었습니다. 멘토 B님께서 제 입장에서 진심으로 공감하며 커리어 로드맵을 프로페셔널하게 설계해주셨고, 어떤 준비를 해야 할지 구체적인 계획까지 함께 고민해주셨습니다. 현업 전문가의 깊이 있는 지식과 경험 덕분에 지름길을 찾은 듯 든든했습니다.'),
  (8, '임ㅇㅇ 님', 'Real Success', '경력 · 직종 전환', '늦은 나이에 직종을 전환하게 되어 나이 때문에 서류 탈락하지 않을까 불안했지만, 멘토님을 만나면서 처음으로 서류에 합격했습니다. 제 경험과 성격을 지원 직무에 맞게 방향을 잡아주시고 어필 포인트를 극대화해 자소서를 꼼꼼히 첨삭해주셨고, 면접 준비 때 예상 질문과 팁도 상세히 알려주셨습니다. 부담되는 금액일 수 있지만 그 이상의 가치를 하는 컨설팅입니다.'),
  (9, '한ㅇㅇ 님', 'Real Success', '신입 · 자소서·경력기술서', '부동산 취업을 준비하며 받은 컨설팅은 현업 중심이라 실질적인 도움이 됐습니다. 실제 실무 사례를 바탕으로 설명해주어 업무 흐름과 역할을 명확히 이해할 수 있었고, 특히 자기소개서와 경력기술서를 구조적으로 검토해주신 점이 인상 깊었습니다. 제 강점과 개선점을 스스로 점검하며 함께 정리해가는 과정이 좋았습니다.')
) as v where not exists (select 1 from public.reviews);
