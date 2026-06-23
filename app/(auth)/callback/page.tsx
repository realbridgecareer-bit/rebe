"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// 소셜 로그인(카카오 등) 후 돌아오는 처리 페이지.
// 브라우저 클라이언트가 URL의 인증 코드를 세션으로 교환하면 마이페이지로 이동.
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.replace("/dashboard");
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/dashboard");
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);

  return <p className="text-center text-slate-500">로그인 처리 중…</p>;
}
