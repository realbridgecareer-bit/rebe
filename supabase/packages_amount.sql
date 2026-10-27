-- =====================================================================
-- packages 테이블에 "실제 결제 금액(원 단위 정수)" 컬럼 추가
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
--
-- 기존 price/sale_price("68만원" 같은 표시용 텍스트)는 화면 표시에만 쓰고,
-- 실제 토스페이먼츠 결제 금액은 이 숫자 컬럼을 신뢰한다(사람이 입력한 문자열을
-- 파싱해서 결제 금액을 추정하면 오타·형식 차이로 잘못된 금액이 청구될 수 있어
-- 별도 컬럼으로 분리했다).
-- =====================================================================

alter table public.packages add column if not exists amount_krw int;
alter table public.packages add column if not exists sale_amount_krw int;

comment on column public.packages.amount_krw is '실제 결제(정가) 금액, 원 단위. 비어있으면 해당 패키지는 온라인 결제 버튼이 비활성화된다.';
comment on column public.packages.sale_amount_krw is '할인 적용 시 결제 금액, 원 단위. 비어있으면 할인가 결제 불가(정가로 결제).';

-- 참고: 기존 시드 패키지(Real Connect/Bridge/Success)는 이 값을 채워야 결제가 가능합니다.
-- /admin > 서비스 비용 탭에서 "결제 금액(원)"을 입력해 주세요.
-- 아래는 기존 표시 가격(price/sale_price) 기준으로 채워 넣는 1회성 참고 쿼리입니다.
-- 실제 받으실 금액과 다르면 /admin에서 직접 수정하세요.
update public.packages set amount_krw = 680000, sale_amount_krw = 480000 where name = 'Real Connect' and amount_krw is null;
update public.packages set amount_krw = 1260000, sale_amount_krw = 880000 where name = 'Real Bridge' and amount_krw is null;
update public.packages set amount_krw = 1640000, sale_amount_krw = 1150000 where name = 'Real Success' and amount_krw is null;
