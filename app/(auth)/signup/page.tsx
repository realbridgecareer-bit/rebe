"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "loading" | "sent" | "error";

export default function SignupPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");

  async function handleKakao() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: { redirectTo: `${window.location.origin}/callback` },
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const careerType = String(fd.get("careerType") ?? "").trim();
    const interestJob = String(fd.get("interestJob") ?? "").trim();
    const agree = fd.get("agreePrivacy") === "on";

    if (!name || !phone || !email || password.length < 6) {
      setStatus("error");
      setMsg("이름·연락처·이메일과 6자 이상의 비밀번호를 입력해 주세요.");
      return;
    }
    if (!careerType) {
      setStatus("error");
      setMsg("경력 구분을 선택해 주세요.");
      return;
    }
    if (!agree) {
      setStatus("error");
      setMsg("개인정보 수집·이용에 동의해 주세요.");
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, phone, careerType, interestJob } },
      });
      if (error) throw new Error(error.message);

      // 이메일 확인이 꺼져 있으면 즉시 세션 발급 → 바로 로그인 상태
      if (data.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }
      // 이메일 확인이 켜져 있으면 확인 메일 안내
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setMsg(err instanceof Error ? err.message : "가입에 실패했습니다.");
    }
  }

  if (status === "sent") {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-navy">메일을 확인해 주세요</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-500">
          입력하신 이메일로 인증 링크를 보냈습니다. 링크를 클릭해 가입을 완료한
          뒤 로그인해 주세요.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block font-medium text-accent hover:underline"
        >
          로그인하러 가기 →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">회원가입</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="이름"
          required
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 outline-none focus:border-accent"
        />
        <input
          name="phone"
          type="tel"
          placeholder="휴대폰 번호 (010-0000-0000)"
          required
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 outline-none focus:border-accent"
        />
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
          placeholder="비밀번호 (6자 이상)"
          required
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 outline-none focus:border-accent"
        />

        <select
          name="careerType"
          required
          defaultValue=""
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-slate-800 outline-none focus:border-accent"
        >
          <option value="" disabled>
            경력 구분 선택
          </option>
          <option value="신입">신입</option>
          <option value="중고신입">중고신입</option>
          <option value="경력">경력</option>
        </select>

        <input
          name="interestJob"
          type="text"
          placeholder="관심 직무 (예: 자산운용, 리츠, IB/PF, 개발, PM)"
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 outline-none focus:border-accent"
        />

        <label className="flex items-start gap-2 text-xs leading-relaxed text-slate-500">
          <input type="checkbox" name="agreePrivacy" className="mt-0.5 accent-navy" />
          <span>
            개인정보 수집·이용에 동의합니다. (수집 항목: 이름·연락처·이메일·경력·관심
            직무, 목적: 회원 관리 및 컨설팅 안내)
          </span>
        </label>

        {status === "error" && (
          <p className="text-sm text-rose-500">{msg}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-full bg-navy py-3 font-semibold text-white transition hover:bg-navy-600 disabled:opacity-50"
        >
          {status === "loading" ? "가입 중..." : "가입하기"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-line" />또는<span className="h-px flex-1 bg-line" />
      </div>
      <button
        type="button"
        onClick={handleKakao}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FEE500] py-3 font-semibold text-[#191600] transition hover:brightness-95"
      >
        카카오로 시작하기
      </button>

      <p className="mt-4 text-center text-sm text-slate-500">
        이미 회원이신가요?{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
