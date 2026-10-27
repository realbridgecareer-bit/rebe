-- =====================================================================
-- 결제(Orders) 테이블 + RLS
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
-- (사전: admin.sql, site_content.sql 실행 필요 — packages.amount_krw도 함께 추가하려면
--  packages_amount.sql도 실행하세요)
-- =====================================================================

create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  order_id      text not null unique,          -- 토스에 전달하는 고유 주문번호
  package_id    uuid references public.packages(id) on delete set null,
  package_name  text not null,
  amount        int not null,                  -- 서버가 신뢰하는 결제 금액(원). 클라이언트가 보낸 값이 아니라
                                                 -- 결제 생성 시 packages.amount_krw에서 읽어온 값을 저장한다.
  buyer_name    text not null,
  buyer_phone   text not null,
  buyer_email   text,
  status        text not null default 'pending', -- pending | paid | failed
  payment_key   text,
  approved_at   timestamptz
);

comment on table public.orders is 'REBE 패키지 결제 주문 내역';
create index if not exists orders_order_id_idx on public.orders (order_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- RLS: 개인정보(이름·연락처)가 담기므로 기본적으로 잠근다.
alter table public.orders enable row level security;

-- (a) 결제 시작 시 방문자가 '대기(pending)' 주문을 생성할 수 있어야 한다.
--     금액 위변조를 막기 위해, 결제 승인(확정)은 이 정책이 아니라 서버의
--     service_role 키로만 수행한다 (app/api/orders/confirm 참고).
drop policy if exists "anyone can create pending order" on public.orders;
create policy "anyone can create pending order"
  on public.orders for insert
  to anon, authenticated
  with check (status = 'pending' and payment_key is null and approved_at is null);

-- (b) 조회/수정/삭제 정책은 관리자만.
drop policy if exists "admins read orders" on public.orders;
create policy "admins read orders"
  on public.orders for select
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- (c) 일반 사용자는 상태를 'paid'로 바꿀 수 없다 (update 정책을 만들지 않음).
--     결제 승인 확정은 반드시 서버(/api/orders/confirm)가 service_role 키로 처리한다.
