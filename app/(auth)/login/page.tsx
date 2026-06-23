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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
      router.push("/dashboard");
      router.refresh();
    } catch {
      setStatus("error");
      setMsg("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">로그인</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="이메일"
          required
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 outline-none focus:border-accent"
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          required
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 outline-none focus:border-accent"
        />

        {status === "error" && (
          <p className="text-sm text-rose-500">{msg}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-full bg-navy py-3 font-semibold text-white transition hover:bg-navy-600 disabled:opacity-50"
        >
          {status === "loading" ? "로그인 중..." : "로그인"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        아직 회원이 아니신가요?{" "}
        <Link href="/signup" className="font-medium text-accent hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}
