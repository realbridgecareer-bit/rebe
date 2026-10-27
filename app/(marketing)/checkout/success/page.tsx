"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Status = "confirming" | "done" | "error";

function CheckoutSuccessInner() {
  const params = useSearchParams();
  const [status, setStatus] = useState<Status>("confirming");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      const paymentKey = params.get("paymentKey");
      const orderId = params.get("orderId");
      const amount = params.get("amount");

      if (!paymentKey || !orderId || !amount) {
        setStatus("error");
        setErrorMsg("결제 정보가 올바르지 않습니다.");
        return;
      }

      try {
        const res = await fetch("/api/orders/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "결제 승인에 실패했습니다.");
        setStatus("done");
      } catch (err) {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "결제 승인에 실패했습니다.");
      }
    })();
  }, [params]);

  if (status === "confirming") {
    return <div className="mx-auto max-w-xl px-6 py-32 text-center text-slate-400">결제를 확인하는 중입니다…</div>;
  }
  if (status === "error") {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="text-2xl font-bold text-ink">결제 확인에 실패했습니다</h1>
        <p className="mt-4 text-slate-500">{errorMsg}</p>
        <p className="mt-6 text-sm text-slate-400">
          결제가 이미 진행되었다면 <a href="mailto:realbridge.career@gmail.com" className="text-terracotta underline">realbridge.career@gmail.com</a>으로 문의해 주세요.
        </p>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-sand text-2xl text-terracotta">✓</div>
      <h1 className="text-2xl font-bold text-ink">결제가 완료되었습니다</h1>
      <p className="mt-4 text-slate-500">담당 매니저가 확인 후 상담 일정을 안내드립니다.</p>
      <Link href="/" className="mt-8 inline-block text-sm font-semibold text-terracotta hover:underline">홈으로 돌아가기</Link>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-xl px-6 py-32 text-center text-slate-400">불러오는 중…</div>}>
      <CheckoutSuccessInner />
    </Suspense>
  );
}
