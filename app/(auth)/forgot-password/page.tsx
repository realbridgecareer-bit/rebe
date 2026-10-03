"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "loading" | "sent" | "error";

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim().toLowerCase();

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw new Error(error.message);
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      const m = err instanceof Error ? err.message : "";
      setMsg(/load failed|fetch|network/i.test(m) ? "네트워크 오류로 요청하지 못했습니다. 잠시 후 다시 시도해 주세요." : "요청에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  if (status === "sent") {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-ink">메일을 확인해 주세요</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-500">
          입력하신 이메일로 가입된 계정이 있다면, 비밀번호 재설정 링크를
          보내드렸습니다. 메일의 링크를 클릭해 새 비밀번호를 설정해 주세요.
        </p>
        <p className="mt-3 rounded-lg bg-sand px-4 py-3 text-xs leading-relaxed text-terracotta">
          메일이 안 보이면 <strong>스팸(정크) 메일함</strong>을 꼭 확인해 주세요. 몇 분 정도 늦게
          도착할 수도 있습니다.
        </p>
        <Link href="/login" className="mt-6 inline-block font-medium text-terracotta hover:underline">
          로그인으로 돌아가기 →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">비밀번호 찾기</h1>
      <p className="mt-2 text-sm text-slate-500">
        가입하신 이메일을 입력하시면 비밀번호 재설정 링크를 보내드립니다.
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          autoComplete="email"
          placeholder="이메일"
          required
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 outline-none focus:border-sage"
        />

        {status === "error" && <p className="text-sm text-rose-500">{msg}</p>}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-full bg-sage py-3 font-semibold text-white transition hover:bg-sage-600 disabled:opacity-50"
        >
          {status === "loading" ? "전송 중..." : "재설정 링크 보내기"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        <Link href="/login" className="font-medium text-terracotta hover:underline">
          ← 로그인으로 돌아가기
        </Link>
      </p>
    </div>
  );
}
