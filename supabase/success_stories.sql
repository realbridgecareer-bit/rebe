-- =====================================================================
-- 합격 사례(Success Stories) 테이블 + RLS + Storage + 시드
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
-- (사전: admin.sql 실행 + 관리자 계정 등록이 되어 있어야 편집이 가능합니다)
-- =====================================================================

-- 1) 테이블 -----------------------------------------------------------
create table if not exists public.success_stories (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  sort_order  int not null default 0,        -- 노출 순서(오름차순)
  published   boolean not null default true, -- 공개 여부
  company     text not null,
  logo_url    text,                          -- 로고 이미지 경로/URL
  logo_h      int,
  logo_w      int,
  name        text not null,
  persona     text,
  service     text not null default 'Real Connect', -- Real Connect | Real Bridge | Real Success
  before_text text,
  after_text  text,
  quote       text,
  paragraphs  text[] not null default '{}',
  tags        text[] not null default '{}'
);

comment on table public.success_stories is 'REBE 합격 사례(합격후기)';
create index if not exists success_stories_order_idx
  on public.success_stories (sort_order asc, created_at desc);

-- 2) RLS --------------------------------------------------------------
alter table public.success_stories enable row level security;

-- (a) 공개: 방문자는 published=true 인 사례만 조회
drop policy if exists "public read published stories" on public.success_stories;
create policy "public read published stories"
  on public.success_stories for select
  to anon, authenticated
  using (published = true);

-- (b) 관리자: 전체 조회 + 추가/수정/삭제
drop policy if exists "admins read all stories" on public.success_stories;
create policy "admins read all stories"
  on public.success_stories for select
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "admins insert stories" on public.success_stories;
create policy "admins insert stories"
  on public.success_stories for insert
  to authenticated
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "admins update stories" on public.success_stories;
create policy "admins update stories"
  on public.success_stories for update
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "admins delete stories" on public.success_stories;
create policy "admins delete stories"
  on public.success_stories for delete
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- 3) Storage 버킷(로고 이미지) ---------------------------------------
insert into storage.buckets (id, name, public)
values ('story-logos', 'story-logos', true)
on conflict (id) do nothing;

drop policy if exists "public read story-logos" on storage.objects;
create policy "public read story-logos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'story-logos');

drop policy if exists "admins write story-logos" on storage.objects;
create policy "admins write story-logos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'story-logos' and exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "admins update story-logos" on storage.objects;
create policy "admins update story-logos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'story-logos' and exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "admins delete story-logos" on storage.objects;
create policy "admins delete story-logos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'story-logos' and exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- 4) 기존 8건 시드 (한 번만 실행; 이미 있으면 건너뜀) -----------------
insert into public.success_stories
  (sort_order, company, logo_url, logo_h, logo_w, name, persona, service, before_text, after_text, quote, paragraphs, tags)
select * from (values
  (1, '코람코자산신탁', '/logos/story/koramco.png', null::int, null::int, '박ㅇㅇ 님', '대학생 · 채용형 인턴 합격', 'Real Success',
   '부동산 비전공 대학생 (인턴 1회)', '코람코자산신탁 채용형 인턴',
   '혼자 쓴 곳은 다 떨어졌지만, 멘토님과 함께 준비한 곳은 모두 합격했습니다',
   array['처음 컨설팅을 받을 때는 부동산에 대해 아는 것이 거의 없어 걱정이 많았습니다. 무엇을 어떻게 공부해야 하고 어떤 부분을 보강해야 하는지 객관적으로 짚어주신 덕분에 준비의 방향을 제대로 잡을 수 있었습니다.','서류 전형에서 여러 기업에 지원했는데, 제가 혼자 준비한 곳은 모두 떨어졌던 반면 멘토님이 함께 봐주신 곳에서는 좋은 결과를 얻을 수 있었습니다.','인턴부터 공채까지 함께 달려주신 덕분에 가장 가고 싶었던 코람코자산신탁 채용형 인턴에 합격했습니다. 진심으로 감사드립니다.'],
   array['부동산 입문 컨설팅','서류 전형 첨삭','인턴·공채 동행']),
  (2, '신세계프라퍼티', '/logos/story/shinsegae.png', null, null, '김ㅇㅇ 님', '미대 전공 · 경력 이직', 'Real Success',
   '타 업계 디자인 경력 3년', '신세계프라퍼티 기획팀',
   '비전공에 정보도 없던 제가, 방향을 잡으니 합격까지 왔습니다',
   array['부동산은 잘 모르는 업계인데다 회사 정보도 많이 공개돼 있지 않아 처음엔 정말 막막했습니다. 어디서부터 준비해야 할지 감이 없었는데, 첫 상담에서 제 디자인 경력 중 어떤 부분이 기획 직무와 연결되는지 짚어주셔서 방향이 잡혔습니다.','자소서와 포트폴리오, 경력기술서를 함께 다듬으면서 제가 어필할 수 있는 포인트를 구체적으로 찾아주셨고, 어색한 문장은 하나하나 컨펌해 주셨습니다. 혼자 썼다면 절대 보지 못했을 관점이었어요.','현직자만 아는 팀 분위기와 실제 업무 이야기를 들으며 면접도 자신 있게 준비할 수 있었고, 결과적으로 원하던 기획팀에 합격했습니다.'],
   array['자소서 방향성','포트폴리오 첨삭','직무 연결 전략']),
  (3, 'NAI Korea', '/logos/story/nai-korea.png', null, null, '이ㅇㅇ 님', '미대 전공 · 신입 취업', 'Real Success',
   '비전공 취업 준비생', 'NAI Korea Capital Market',
   '혼자였다면 절대 몰랐을 정보들이 합격을 만들었습니다',
   array['취준생 입장에서 적지 않은 금액이라 고민이 많았지만, 결과적으로 그만한 가치가 충분했습니다. 스펙 진단부터 자소서 첨삭, 직무·기업 공고 추천, 네트워크 기반 정보까지 세 영역 모두 꼼꼼했습니다.','비전공자라 불리하다고만 생각했는데, 오히려 제 배경을 어떻게 강점으로 풀어낼지 함께 설계해 주셨습니다. 자신감이 완전히 달라졌어요.','지원 회사의 실제 분위기와 업무 강도까지 현직자 관점에서 들을 수 있어, 면접에서 진심이 담긴 답변을 할 수 있었습니다.'],
   array['스펙 진단','기업 공고 추천','현직자 정보']),
  (4, '이화자산운용', '/logos/story/ewha-am.jpg', 76, 196, '서ㅇㅇ 님', '대학생 · 신입 취업', 'Real Bridge',
   '취업 준비 대학생', '이화자산운용 대체투자팀',
   '회사가 원하는 ''진짜'' 직무 역량이 무엇인지 파악할 수 있었습니다',
   array['취준생으로서 막연하고 불안하던 시기에, 이 멘토링을 통해 방향성을 잡을 수 있었고 회사에서 원하는 ''진짜'' 직무 역량이 무엇인지 파악할 수 있었습니다. 그 결과 멘토링 이후 지원한 4개의 AM사와 PM사에서 모두 최종면접까지 진행했으며, 목표로 했던 부동산 자산운용사에 최종합격할 수 있었습니다. 금전적인 부담이 될 수 있지만, 돌아보면 그 이상의 값어치가 있는 멘토링이라고 생각합니다.','멘토님의 넓은 네트워킹 능력을 바탕으로 실제 지원하는 회사의 실무자분들과 연결될 수 있었고, 현장의 생생한 정보와 조언을 들을 수 있었습니다. 네이버 카페나 금융투자협회에 올라오는 채용공고의 두루뭉술한 내용을 구체화해 이해함으로써, 해당 직무에 핏한 역량이 무엇인지 정확하게 구분하여 정리할 수 있었습니다.','자소서 작성과 면접 준비에서도 제가 가진 경험과 배경을 바탕으로 어떤 강점을 어필해야 할지 꼼꼼하게 피드백해주셔서 큰 도움을 받았습니다. 진심으로 감사합니다!'],
   array['직무 역량 파악','현직자 연결','자소서·면접 피드백']),
  (5, '한국투자신탁운용', '/logos/story/kitc.png', null, null, '김ㅇㅇ 님', '재학생 · 신입 준비', 'Real Connect',
   '대학교 3학년 재학생', '한국투자신탁운용 인턴',
   '지금 무엇을 더 쌓아야 하는지 명확해졌습니다',
   array['재학생이라 방향성 위주로 상담을 받았는데, 시간에 쫓기지 않고 자유로운 분위기에서 진행돼 편하게 많은 걸 여쭤볼 수 있었습니다.','관련 정보가 부족했는데, 모의 자소서와 포트폴리오를 함께 보며 지금 어떤 경험과 스펙을 더하면 좋을지 구체적으로 짚어주셨습니다.','덕분에 남은 학기 동안 무엇에 집중해야 할지 계획이 섰고, 목표하던 회사의 인턴으로 먼저 발을 들일 수 있었습니다.'],
   array['방향성 진단','모의 자소서','스펙 로드맵']),
  (6, '코람코자산신탁', '/logos/story/koramco.png', null, null, '정ㅇㅇ 님', '중고신입 이직', 'Real Bridge',
   '리츠 인턴 경험 반복', '코람코자산신탁 상장리츠팀 공채',
   '실제 직무 프로세스를 알고 나니 준비의 초점이 달라졌습니다',
   array['리츠에 관심이 많아 인턴도 여러 번 했지만, 정작 상장리츠팀으로 취업하는 길은 쉽지 않았습니다. 무엇이 부족한지조차 알기 어려웠어요.','멘토님들의 네트워킹을 통해 상장리츠 업무의 실제 프로세스와 팀이 원하는 역량을 알게 됐고, 이를 타겟팅해 집중적으로 준비했습니다.','막연히 넓게 준비하던 이전과 달리 초점이 분명해졌고, 결국 공채로 합격할 수 있었습니다. 방향을 잡아주신 게 결정적이었습니다.'],
   array['직무 프로세스 이해','역량 타겟팅','현직자 네트워킹']),
  (7, '롯데AMC', '/logos/story/lotte-amc.svg', null, null, '오ㅇㅇ 님', '경력 이직', 'Real Connect',
   '원거리 자산운용사 재직 (잦은 야근)', '롯데AMC 리츠투자팀',
   '커리어와 삶의 질을 동시에 잡은 이직이었습니다',
   array['기존 운용사에서 펀드 운용을 했지만 출퇴근이 너무 멀고 야근이 잦아 체력적으로 지쳐 있던 시기에 멘토님을 만났습니다.','제 상황을 듣고 집과 가까우면서도 커리어에 도움이 되는 회사를 추천해 주시고, 현직자를 바로 연결해 주셨습니다.','덕분에 어렵다는 경력 이직을 직주근접이라는 큰 메리트까지 얻으며 성공할 수 있었습니다.'],
   array['맞춤 기업 추천','현직자 연결','경력 이직 전략']),
  (8, 'ARA Korea', '/logos/story/ara.png', null, null, '김ㅇㅇ 님', 'PM사 5년차 · 경력 이직', 'Real Connect',
   'PM사 5년차', 'ARA Korea 리츠운용',
   '몇 번을 도전해도 안 되던 이직이 한 번에 풀렸습니다',
   array['PM사에서 5년간 일하며 자산운용사로 가고 싶었지만, 채용 시장이 활발하지 않아 여러 번 시도에도 번번이 막혔습니다.','멘토님이 수많은 자산운용사의 장단점을 바로 정리해 주시고, 지원 회사의 현직자를 직접 연결해 주셨습니다.','채용 과정이 이전과는 비교할 수 없이 수월하게 진행됐고, 마침내 원하던 운용사로 이직에 성공했습니다.'],
   array['운용사 비교 분석','현직자 연결','이직 성공'])
) as v
where not exists (select 1 from public.success_stories);
