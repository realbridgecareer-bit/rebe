import webpush, { type PushSubscription } from "web-push";
import { createClient } from "@supabase/supabase-js";
import { VAPID_PUBLIC_KEY } from "@/lib/push";

// web-push는 Node 런타임 필요(Edge 불가)
export const runtime = "nodejs";

const clean = (v?: string) => (v ?? "").replace(/\s/g, "");
const SUPA_URL =
  clean(process.env.NEXT_PUBLIC_SUPABASE_URL) || "https://rmtzimoozxnrmmfeoroj.supabase.co";

type SubRow = { endpoint: string; subscription: PushSubscription };

/**
 * Supabase Database Webhook(consultations INSERT)이 호출한다.
 * 헤더 x-notify-secret 로 인증 후, 저장된 모든 구독에 푸시를 보낸다.
 */
export async function POST(req: Request) {
  const secret = req.headers.get("x-notify-secret");
  if (!process.env.NOTIFY_SECRET || secret !== clean(process.env.NOTIFY_SECRET)) {
    return new Response("unauthorized", { status: 401 });
  }

  const vapidPrivate = clean(process.env.VAPID_PRIVATE_KEY);
  const serviceKey = clean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!vapidPrivate || !serviceKey) {
    return new Response("missing server env (VAPID_PRIVATE_KEY / SUPABASE_SERVICE_ROLE_KEY)", { status: 500 });
  }

  let record: Record<string, unknown> = {};
  try {
    const body = (await req.json()) as { record?: Record<string, unknown> };
    record = body.record ?? {};
  } catch {
    /* 빈 payload 허용 */
  }

  webpush.setVapidDetails("mailto:realbridge.career@gmail.com", VAPID_PUBLIC_KEY, vapidPrivate);
  const supabase = createClient(SUPA_URL, serviceKey);

  const { data: subs } = await supabase
    .from("push_subscriptions")
    .select("endpoint, subscription");

  const name = typeof record.name === "string" ? record.name : "고객";
  const phone = typeof record.phone === "string" ? record.phone : "";
  const program = typeof record.program === "string" ? record.program : "";
  const payload = JSON.stringify({
    title: "새 상담 신청",
    body: `${name}님 · ${phone}${program ? " · " + program : ""}`,
    url: "/admin",
  });

  let sent = 0;
  await Promise.all(
    ((subs as SubRow[] | null) ?? []).map(async (s) => {
      try {
        await webpush.sendNotification(s.subscription, payload);
        sent++;
      } catch (e) {
        const code = (e as { statusCode?: number }).statusCode;
        if (code === 404 || code === 410) {
          await supabase.from("push_subscriptions").delete().eq("endpoint", s.endpoint);
        }
      }
    }),
  );

  return Response.json({ ok: true, sent });
}
