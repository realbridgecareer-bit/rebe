"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { rowToPkg, pkgPayableAmount, type Pkg, type SiteSettings } from "@/lib/site-content";
import { generateOrderId } from "@/lib/orders";

type Status = "loading" | "ready" | "not-found" | "submitting" | "error";

export default function CheckoutPage() {
  const { pkgId } = useParams<{ pkgId: string }>();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [pkg, setPkg] = useState<Pkg | null>(null);
  const [promoEnabled, setPromoEnabled] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const [{ data: pkgRow }, { data: settingsRow }] = await Promise.all([
        supabase.from("packages").select("*").eq("id", pkgId).eq("published", true).maybeSingle(),
        supabase.from("site_settings").select("promo_enabled").eq("id", 1).maybeSingle(),
      ]);
      if (!pkgRow) { setStatus("not-found"); return; }
      setPkg(rowToPkg(pkgRow));
      setPromoEnabled(Boolean((settingsRow as SiteSettings | null)?.promo_enabled ?? true));
      setStatus("ready");
    })();
  }, [pkgId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!pkg) return;
    const amount = pkgPayableAmount(pkg, promoEnabled);
    if (amount == null) {
      setStatus("error");
      setErrorMsg("이 패키지는 아직 온라인 결제 준비 중입니다. 상담 신청을 이용해 주세요.");
      return;
    }

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const phoneRaw = String(fd.get("phone") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const agree = fd.get("agreePrivacy") === "on";
    const phone = phoneRaw.replace(/\D/g, "");

    if (!name || !phone) {
      setStatus("error");
      setErrorMsg("이름과 연락처는 필수입니다.");
      return;
    }
    if (phone.length < 8 || phone.length > 15) {
      setStatus("error");
      setErrorMsg("연락처 형식을 확인해 주세요.");
      return;
    }
    if (!agree) {
      setStatus("error");
      setErrorMsg("개인정보 수집·이용에 동의해 주세요.");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      const supabase = createClient();
      const orderId = generateOrderId();
      const { error: insertErr } = await supabase.from("orders").insert({
        order_id: orderId,
        package_id: pkg.id ?? null,
        package_name: pkg.name,
        amount,
        buyer_name: name,
        buyer_phone: phoneRaw,
        buyer_email: email || null,
        status: "pending",
      });
      if (insertErr) throw new Error(insertErr.message);

      const clean = (v?: string) => (v ?? "").replace(/\s/g, "");
      const clientKey = clean(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY);
      if (!clientKey) throw new Error("결제 설정이 완료되지 않았습니다. 관리자에게 문의해 주세요.");

      const { loadTossPayments, ANONYMOUS } = await import("@tosspayments/tosspayments-sdk");
      const tossPayments = await loadTossPayments(clientKey);
      const payment = tossPayments.payment({ customerKey: ANONYMOUS });
      const origin = window.location.origin;
      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: amount },
        orderId,
        orderName: pkg.name,
        customerName: name,
        customerEmail: email || undefined,
        customerMobilePhone: phone,
        successUrl: `${origin}/checkout/success`,
        failUrl: `${origin}/checkout/fail`,
      });
      // 성공/실패 시 토스가 successUrl/failUrl로 리다이렉트하므로 이후 코드는 보통 실행되지 않는다.
    } catch (err) {
      setStatus("error");
      const m = err instanceof Error ? err.message : "";
      setErrorMsg(/cancel|취소/i.test(m) ? "결제가 취소되었습니다." : m || "결제 요청에 실패했습니다.");
    }
  }

  if (status === "loading") {
    return <div className="mx-auto max-w-xl px-6 py-32 text-center text-slate-400">불러오는 중…</div>;
  }
  if (status === "not-found") {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="text-2xl font-bold text-ink">패키지를 찾을 수 없습니다</h1>
        <p className="mt-4 text-slate-500">
          <button onClick={() => router.push("/#services")} className="cursor-pointer text-terracotta hover:underline">서비스 목록으로 돌아가기</button>
        </p>
      </div>
    );
  }

  const amount = pkg ? pkgPayableAmount(pkg, promoEnabled) : null;

  return (
    <div className="mx-auto max-w-xl px-6 py-20">
      <div className="mb-2 text-xs font-semibold tracking-[0.2em] text-terracotta uppercase">CHECKOUT</div>
      <h1 className="text-3xl font-bold text-ink">결제하기</h1>

      {pkg && (
        <div className="mt-6 rounded-2xl border border-line bg-white p-6">
          <div className="flex items-baseline justify-between">
            <span className="font-bold text-ink">{pkg.name}</span>
            <span className="text-sm text-slate-500">{pkg.sub} {pkg.detail}</span>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-ink">
            {amount != null ? `${amount.toLocaleString()}원` : "준비 중"}
            <span className="ml-1.5 text-[12px] font-normal text-slate-400">VAT 포함</span>
          </div>
        </div>
      )}

      {amount == null ? (
        <p className="mt-6 rounded-lg bg-sand px-4 py-3 text-sm text-terracotta">
          이 패키지는 아직 온라인 결제 준비 중입니다. <a href="/contact" className="font-semibold underline">상담 신청</a>을 이용해 주세요.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-2xl border border-line bg-white p-8">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">이름 <span className="text-terracotta">*</span></label>
            <input id="name" name="name" required className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2 text-slate-800 outline-none focus:border-sage" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700">연락처 <span className="text-terracotta">*</span></label>
            <input id="phone" name="phone" type="tel" required placeholder="010-0000-0000" className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 outline-none focus:border-sage" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">이메일</label>
            <input id="email" name="email" type="email" placeholder="example@email.com" className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 outline-none focus:border-sage" />
          </div>
          <label className="flex items-start gap-2 text-sm text-slate-500">
            <input type="checkbox" name="agreePrivacy" className="mt-1 accent-sage" />
            <span>개인정보 수집·이용에 동의합니다. (수집 항목: 이름·연락처·이메일, 목적: 결제·상담 진행, 보유기간: 서비스 종료 후 1년)</span>
          </label>

          {status === "error" && <p className="text-sm text-rose-500">{errorMsg}</p>}

          <button type="submit" disabled={status === "submitting"} className="w-full rounded-full bg-sage py-3.5 text-[15px] font-bold text-white transition hover:bg-sage-600 disabled:opacity-50">
            {status === "submitting" ? "결제 요청 중..." : `${amount.toLocaleString()}원 결제하기`}
          </button>
          <p className="text-center text-xs text-slate-400">결제 전 상담이 필요하신가요? <a href="/contact" className="underline hover:text-terracotta">문의하기</a></p>
        </form>
      )}
    </div>
  );
}
