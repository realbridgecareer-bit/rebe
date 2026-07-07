"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "loading" | "error";

export default function LoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");

  // 카카오 로그인: 코드는 준비됨. 비즈니스 앱 전환(account_email·profile_image 동의항목
  // 활성화) 후 아래 버튼과 이 핸들러를 복구해 재활성화할 것. (callback 페이지·Supabase 설정 유지)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim().toLowerCase();
    const password = String(fd.get("password") ?? "");

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
      // 관리자면 /admin, 아니면 /dashboard 로 이동
      let dest = "/dashboard";
      const uid = data.user?.id;
      if (uid) {
        const { data: adminRow } = await supabase
          .from("admins")
          .select("user_id")
          .eq("user_id", uid)
          .maybeSingle();
        if (adminRow) dest = "/admin";
      }
      router.push(dest);
      router.refresh();
    } catch (err) {
      setStatus("error");
      const m = err instanceof Error ? err.message : "";
      // 네트워크 오류와 자격 오류를 구분해 안내
      if (/load failed|fetch|network/i.test(m)) {
        setMsg("네트워크 오류로 로그인하지 못했습니다. 연결(와이파이/데이터·차단 프로그램)을 확인해 주세요.");
      } else if (/invalid login|credentials/i.test(m)) {
        setMsg("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else if (/confirm/i.test(m)) {
        setMsg("이메일 인증이 완료되지 않았습니다. 메일의 인증 링크를 확인하거나 관리자 계정을 인증 상태로 만들어 주세요.");
      } else {
        setMsg(m || "로그인에 실패했습니다.");
      }
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">로그인</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          autoComplete="username"
          placeholder="이메일"
          required
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 outline-none focus:border-sage"
        />
        <input
          name="password"
          type="password"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          autoComplete="current-password"
          placeholder="비밀번호"
          required
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 outline-none focus:border-sage"
        />

        {status === "error" && (
          <p className="text-sm text-rose-500">{msg}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-full bg-sage py-3 font-semibold text-white transition hover:bg-sage-600 disabled:opacity-50"
        >
          {status === "loading" ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        아직 회원이 아니신가요?{" "}
        <Link href="/signup" className="font-medium text-terracotta hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}
