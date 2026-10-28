import { createClient } from "@supabase/supabase-js";
import webpush, { type PushSubscription } from "web-push";
import { VAPID_PUBLIC_KEY } from "@/lib/push";
import { BUSINESS } from "@/lib/business";

// web-push·Buffer 사용 때문에 Node 런타임 필요(Edge 불가)
export const runtime = "nodejs";

const clean = (v?: string) => (v ?? "").replace(/\s/g, "");
const SUPA_URL = clean(process.env.NEXT_PUBLIC_SUPABASE_URL) || "https://rmtzimoozxnrmmfeoroj.supabase.co";

type SubRow = { endpoint: string; subscription: PushSubscription };

/**
 * 토스페이먼츠 결제 승인. 클라이언트가 보낸 금액을 그대로 신뢰하지 않고,
 * 결제 생성 시 서버(이 라우트가 아니라 결제 시작 시점)가 DB에 저장해 둔
 * orders.amount와 반드시 대조한 뒤에만 승인 API를 호출한다.
 */
export async function POST(req: Request) {
  let body: { paymentKey?: string; orderId?: string; amount?: number };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }
  const { paymentKey, orderId, amount } = body;
  if (!paymentKey || !orderId || typeof amount !== "number") {
    return Response.json({ error: "필수 값이 누락되었습니다." }, { status: 400 });
  }

  const serviceKey = clean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const secretKey = clean(process.env.TOSS_SECRET_KEY);
  if (!serviceKey || !secretKey) {
    return Response.json({ error: "서버 결제 설정이 완료되지 않았습니다. 관리자에게 문의해 주세요." }, { status: 500 });
  }

  const supabase = createClient(SUPA_URL, serviceKey);

  const { data: order, error: findErr } = await supabase
    .from("orders")
    .select("*")
    .eq("order_id", orderId)
    .maybeSingle();
  if (findErr || !order) {
    return Response.json({ error: "주문을 찾을 수 없습니다." }, { status: 404 });
  }
  if (order.status === "paid") {
    // 새로고침 등으로 같은 요청이 중복 호출된 경우 — 이미 처리된 결제로 응답
    return Response.json({ ok: true });
  }
  if (order.amount !== amount) {
    await supabase.from("orders").update({ status: "failed" }).eq("order_id", orderId);
    return Response.json({ error: "결제 금액이 일치하지 않습니다." }, { status: 400 });
  }

  const basicAuth = Buffer.from(`${secretKey}:`).toString("base64");
  const tossRes = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${basicAuth}` },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });
  const tossData = await tossRes.json().catch(() => ({}));

  if (!tossRes.ok) {
    await supabase.from("orders").update({ status: "failed" }).eq("order_id", orderId);
    return Response.json({ error: tossData.message || "결제 승인에 실패했습니다." }, { status: 400 });
  }

  await supabase
    .from("orders")
    .update({ status: "paid", payment_key: paymentKey, approved_at: new Date().toISOString() })
    .eq("order_id", orderId);

  // 관리자 푸시 알림 (구독이 없거나 키가 없으면 조용히 건너뜀 — 알림 실패가 결제 성공에 영향을 주면 안 됨)
  try {
    const vapidPrivate = clean(process.env.VAPID_PRIVATE_KEY);
    if (vapidPrivate) {
      webpush.setVapidDetails(`mailto:${BUSINESS.email}`, VAPID_PUBLIC_KEY, vapidPrivate);
      const { data: subs } = await supabase.from("push_subscriptions").select("endpoint, subscription");
      const payload = JSON.stringify({
        title: "결제 완료",
        body: `${order.buyer_name}님 · ${order.package_name} · ${amount.toLocaleString()}원`,
        url: "/admin",
      });
      await Promise.all(
        ((subs as SubRow[] | null) ?? []).map((s) => webpush.sendNotification(s.subscription, payload).catch(() => {})),
      );
    }
  } catch {
    /* 알림 실패는 결제 처리 결과에 영향을 주지 않는다 */
  }

  return Response.json({ ok: true });
}
