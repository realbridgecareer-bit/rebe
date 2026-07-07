-- =====================================================================
-- 새 상담(consultations INSERT) → 푸시 발송 API 호출 트리거
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
-- (Webhooks UI를 못 찾을 때 이 SQL로 동일 효과)
-- =====================================================================

-- pg_net 확장(외부 HTTP 호출용) 활성화
create extension if not exists pg_net;

-- 새 상담이 들어오면 Vercel 발송 API로 POST
create or replace function public.notify_new_consultation()
returns trigger
language plpgsql
security definer
as $$
begin
  perform net.http_post(
    url := 'https://rebe-xi.vercel.app/api/notify-consultation',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-notify-secret', '<NOTIFY_SECRET 값으로 교체>'
    ),
    body := jsonb_build_object('record', to_jsonb(NEW))
  );
  return NEW;
end;
$$;

drop trigger if exists trg_notify_consultation on public.consultations;
create trigger trg_notify_consultation
  after insert on public.consultations
  for each row execute function public.notify_new_consultation();
