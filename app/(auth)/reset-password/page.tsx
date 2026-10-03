"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type LinkState = "checking" | "ready" | "invalid";
type Status = "idle" | "loading" | "error";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [linkState, setLinkState] = useState<LinkState>("checking");
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");

  // 메일의 재설정 링크를 클릭해 들어오면 Supabase 클라이언트가 URL의 복구 토큰으로
  // 임시 세션을 자동 발급한다(PASSWORD_RECOVERY 이벤트). 그 세션이 있어야만 비밀번호 변경 가능.
  useEffect(() => {
    const supabase = createClient();
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setLinkState("ready");
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setLinkState("ready");
    });
    const timer = setTimeout(() => {
      setLinkState((s) => (s === "checking" ? "invalid" : s));
    }, 4000);
    return () => {
      sub.subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");

    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") ?? "");
    const confirm = String(fd.get("confirm") ?? "");

    if (password.length < 6) {
      setStatus("error");
      setMsg("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    if (password !== confirm) {
      setStatus("error");
      setMsg("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) throw new Error(error.message);

      let dest = "/dashboard";
      const uid = data.user?.id;
      if (uid) {
        const { data: adminRow } = await supabase.from("admins").select("user_id").eq("user_id", uid).maybeSingle();
        if (adminRow) dest = "/admin";
      }
      router.push(dest);
      router.refresh();
    } catch (err) {
      setStatus("error");
      setMsg(err instanceof Error ? err.message : "비밀번호 변경에 실패했습니다.");
    }
  }

  if (linkState === "checking") {
    return <p className="text-center text-slate-500">확인 중…</p>;
  }

  if (linkState === "invalid") {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-ink">유효하지 않은 링크입니다</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-500">
          링크가 만료되었거나 이미 사용되었습니다. 비밀번호 찾기를 다시 요청해 주세요.
        </p>
        <Link href="/forgot-password" className="mt-6 inline-block font-medium text-terracotta hover:underline">
          비밀번호 찾기로 돌아가기 →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">새 비밀번호 설정</h1>
      <p className="mt-2 text-sm text-slate-500">새로 사용할 비밀번호를 입력해 주세요.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="새 비밀번호 (6자 이상)"
          required
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 outline-none focus:border-sage"
        />
        <input
          name="confirm"
          type="password"
          autoComplete="new-password"
          placeholder="새 비밀번호 확인"
          required
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 outline-none focus:border-sage"
        />

        {status === "error" && <p className="text-sm text-rose-500">{msg}</p>}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-full bg-sage py-3 font-semibold text-white transition hover:bg-sage-600 disabled:opacity-50"
        >
          {status === "loading" ? "변경 중..." : "비밀번호 변경"}
        </button>
      </form>
    </div>
  );
}
