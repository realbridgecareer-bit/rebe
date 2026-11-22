-- =====================================================================
-- 개별 링크 후기 설문 (로그인 없이, 컨설팅 받은 분께 1회용 링크로 후기 수집)
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
-- (사전: admin.sql, site_content.sql, success_stories.sql 실행 필요
--  — admins, reviews, success_stories 테이블이 있어야 함. multi_photo.sql도 적용돼 있어야 함)
--
-- 흐름
--   1) 관리자가 /admin '후기 링크' 탭에서 이름 입력 → 링크 발급(review_invites 행 생성)
--   2) 고객이 /review/<토큰> 접속 → get_review_invite()로 링크 유효성·표시 이름 확인
--   3) 고객이 설문 제출 → submit_review_by_token()이 reviews 또는 success_stories에
--      published=false 로 저장(관리자 승인 후에만 홈페이지 노출) + 링크를 사용 처리
--   테이블은 관리자만 접근. 비로그인 고객은 아래 두 함수(RPC)로만 접근한다.
-- =====================================================================

-- 1) 테이블 -----------------------------------------------------------
create table if not exists public.review_invites (
  id                uuid primary key default gen_random_uuid(),
  token             uuid not null unique default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  customer_name     text not null,                    -- 관리자 확인용 실명(비공개, 관리자만 조회)
  display_name      text not null,                    -- 홈페이지 표기용 마스킹 이름(예: 김ㅇㅇ 님)
  service           text not null default 'Real Connect',
  expires_at        timestamptz not null default (now() + interval '60 days'),
  submitted_at      timestamptz,                      -- 제출되면 채워짐(= 사용 완료)
  result_kind       text check (result_kind in ('story', 'review')),
  result_id         uuid,                             -- 생성된 success_stories / reviews 행 id
  rating            int check (rating between 1 and 5),
  internal_feedback text,                             -- 개선 의견(홈페이지에 공개하지 않음)
  response          jsonb                             -- 제출 원본(내부 참고용)
);
create index if not exists review_invites_created_idx on public.review_invites (created_at desc);

comment on table public.review_invites is '후기 개별 링크 초대(관리자 전용). 고객은 RPC로만 접근';

-- 2) RLS: 관리자만 직접 접근 ------------------------------------------
alter table public.review_invites enable row level security;

drop policy if exists "admins all review_invites" on public.review_invites;
create policy "admins all review_invites" on public.review_invites for all to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- 3) 링크 유효성 확인 RPC (비로그인 허용) ------------------------------
--    토큰이 맞을 때만 표시 이름·서비스·상태를 돌려준다. 실명(customer_name)은 절대 반환하지 않는다.
create or replace function public.get_review_invite(p_token uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  inv public.review_invites%rowtype;
begin
  select * into inv from public.review_invites where token = p_token;
  if not found then
    return jsonb_build_object('status', 'invalid');
  end if;
  if inv.submitted_at is not null then
    return jsonb_build_object('status', 'used');
  end if;
  if inv.expires_at < now() then
    return jsonb_build_object('status', 'expired');
  end if;
  return jsonb_build_object('status', 'ok', 'display_name', inv.display_name, 'service', inv.service);
end;
$$;

-- 4) 설문 제출 RPC (비로그인 허용) -------------------------------------
--    · 링크가 유효(존재·미사용·미만료)할 때만 동작, 한 번 제출하면 사용 처리
--    · 합격(hired) + 회사명이 있으면 success_stories, 아니면 reviews 에 저장
--    · 항상 published=false, source='customer' → 관리자 승인 후에만 공개
create or replace function public.submit_review_by_token(p_token uuid, p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  inv        public.review_invites%rowtype;
  v_status   text := coalesce(p_payload->>'status', '');
  v_service  text := coalesce(nullif(trim(p_payload->>'service'), ''), '');
  v_persona  text := nullif(trim(coalesce(p_payload->>'persona', '')), '');
  v_company  text := trim(coalesce(p_payload->>'company', ''));
  v_before   text := trim(coalesce(p_payload->>'before', ''));
  v_after    text := trim(coalesce(p_payload->>'after', ''));
  v_quote    text := trim(coalesce(p_payload->>'quote', ''));
  v_feedback text := nullif(trim(coalesce(p_payload->>'feedback', '')), '');
  v_rating   int;
  v_paras    text[];
  v_tags     text[];
  v_new_id   uuid;
  v_kind     text;
begin
  select * into inv from public.review_invites where token = p_token for update;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'invalid');
  end if;
  if inv.submitted_at is not null then
    return jsonb_build_object('ok', false, 'error', 'used');
  end if;
  if inv.expires_at < now() then
    return jsonb_build_object('ok', false, 'error', 'expired');
  end if;

  -- 동의 3종은 모두 필수
  if coalesce((p_payload->>'agree_privacy')::boolean, false) is not true
     or coalesce((p_payload->>'agree_publish')::boolean, false) is not true
     or coalesce((p_payload->>'agree_truth')::boolean, false) is not true then
    return jsonb_build_object('ok', false, 'error', 'consent');
  end if;

  -- 별점
  begin
    v_rating := (p_payload->>'rating')::int;
  exception when others then
    v_rating := null;
  end;
  if v_rating is null or v_rating < 1 or v_rating > 5 then
    return jsonb_build_object('ok', false, 'error', 'rating');
  end if;

  -- 서비스 값 검증(미선택이면 링크에 지정된 서비스 사용)
  if v_service = '' then v_service := inv.service; end if;
  if v_service not in ('Real Connect', 'Real Bridge', 'Real Success') then
    return jsonb_build_object('ok', false, 'error', 'service');
  end if;

  -- 길이 제한(과도한 입력 방지)
  if char_length(v_quote) < 1 or char_length(v_quote) > 200
     or char_length(v_company) > 100 or char_length(v_before) > 200 or char_length(v_after) > 200
     or char_length(coalesce(v_persona, '')) > 100 or char_length(coalesce(v_feedback, '')) > 3000 then
    return jsonb_build_object('ok', false, 'error', 'length');
  end if;

  -- 본문 문단 배열(최대 6문단, 각 3000자)
  select coalesce(array_agg(left(trim(t), 3000)) filter (where trim(t) <> ''), '{}')
    into v_paras
    from (select jsonb_array_elements_text(coalesce(p_payload->'paragraphs', '[]'::jsonb)) as t limit 6) s;
  if coalesce(array_length(v_paras, 1), 0) = 0 then
    return jsonb_build_object('ok', false, 'error', 'text');
  end if;

  -- 태그(도움받은 부분, 최대 8개)
  select coalesce(array_agg(left(trim(t), 40)) filter (where trim(t) <> ''), '{}')
    into v_tags
    from (select jsonb_array_elements_text(coalesce(p_payload->'tags', '[]'::jsonb)) as t limit 8) s;

  if v_status = 'hired' and v_company <> '' then
    if v_before = '' or v_after = '' then
      return jsonb_build_object('ok', false, 'error', 'story_fields');
    end if;
    v_kind := 'story';
    insert into public.success_stories
      (company, name, persona, service, before_text, after_text, quote, paragraphs, tags, published, source)
    values
      (v_company, inv.display_name, v_persona, v_service, v_before, v_after, v_quote, v_paras, v_tags, false, 'customer')
    returning id into v_new_id;
  else
    v_kind := 'review';
    insert into public.reviews (name, service, persona, "text", published, source)
    values (inv.display_name, v_service, v_persona,
            v_quote || E'\n\n' || array_to_string(v_paras, E'\n\n'), false, 'customer')
    returning id into v_new_id;
  end if;

  update public.review_invites
     set submitted_at = now(),
         result_kind = v_kind,
         result_id = v_new_id,
         rating = v_rating,
         internal_feedback = v_feedback,
         response = p_payload - 'feedback'
   where id = inv.id;

  return jsonb_build_object('ok', true, 'kind', v_kind);
end;
$$;

-- 5) 실행 권한: 함수만 익명/로그인 사용자에게 열고, 테이블은 열지 않는다 ---
revoke all on function public.get_review_invite(uuid) from public;
revoke all on function public.submit_review_by_token(uuid, jsonb) from public;
grant execute on function public.get_review_invite(uuid) to anon, authenticated;
grant execute on function public.submit_review_by_token(uuid, jsonb) to anon, authenticated;
