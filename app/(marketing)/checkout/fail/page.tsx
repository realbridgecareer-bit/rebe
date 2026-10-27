"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CheckoutFailInner() {
  const router = useRouter();
  const params = useSearchParams();
  const message = params.get("message") || "결제가 취소되었거나 실패했습니다.";

  return (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      <h1 className="text-2xl font-bold text-ink">결제를 완료하지 못했습니다</h1>
      <p className="mt-4 text-slate-500">{message}</p>
      <p className="mt-8 flex justify-center gap-4 text-sm font-semibold">
        <button type="button" onClick={() => router.back()} className="cursor-pointer text-terracotta hover:underline">다시 시도하기</button>
        <a href="/contact" className="text-slate-500 hover:underline">상담 문의하기</a>
      </p>
    </div>
  );
}

export default function CheckoutFailPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-xl px-6 py-32 text-center text-slate-400">불러오는 중…</div>}>
      <CheckoutFailInner />
    </Suspense>
  );
}
