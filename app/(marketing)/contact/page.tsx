"use client";

import { useState } from "react";
import type { ConsultationInput } from "@/types";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload: ConsultationInput = {
      name: String(data.get("name") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      program: String(data.get("program") ?? "").trim() || undefined,
      message: String(data.get("message") ?? "").trim(),
      agreePrivacy: data.get("agreePrivacy") === "on",
    };

    // 클라이언트 1차 검증 (서버에서 다시 검증)
    if (!payload.name || !payload.phone || !payload.message) {
      setStatus("error");
      setErrorMsg("이름, 연락처, 상담 내용은 필수입니다.");
      return;
    }
    if (!payload.agreePrivacy) {
      setStatus("error");
      setErrorMsg("개인정보 수집·이용에 동의해 주세요.");
      return;
    }

    try {
      // 브라우저에서 Supabase로 직접 저장 (RLS: 익명 insert 허용, 조회 불가)
      const supabase = createClient();
      const { error } = await supabase.from("consultations").insert({
        name: payload.name,
        phone: payload.phone,
        email: payload.email || null,
        program: payload.program || null,
        message: payload.message,
      });
      if (error) throw new Error(error.message);
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "전송에 실패했습니다.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-2xl text-accent">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-navy">
          상담 신청이 접수되었습니다
        </h1>
        <p className="mt-4 text-slate-500">
          빠른 시일 내에 담당 컨설턴트가 연락드리겠습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-20">
      <div className="mb-2 text-xs font-semibold tracking-[0.2em] text-accent uppercase">
        CONTACT
      </div>
      <h1 className="text-3xl font-bold text-navy">상담 신청</h1>
      <p className="mt-2 text-slate-500">
        아래 정보를 남겨주시면 무료 상담을 도와드립니다.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-2xl border border-line bg-white p-8"
      >
        <Field label="이름" name="name" required />
        <Field
          label="연락처"
          name="phone"
          type="tel"
          required
          placeholder="010-0000-0000"
        />
        <Field
          label="이메일"
          name="email"
          type="email"
          placeholder="example@email.com"
        />
        <Field
          label="관심 패키지"
          name="program"
          placeholder="예: Real Connect / Real Bridge / Real Success"
        />

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700">
            상담 내용 <span className="text-accent">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 outline-none focus:border-accent"
          />
        </div>

        <label className="flex items-start gap-2 text-sm text-slate-500">
          <input
            type="checkbox"
            name="agreePrivacy"
            className="mt-1 accent-navy"
          />
          <span>
            개인정보 수집·이용에 동의합니다. (수집 항목: 이름·연락처·이메일,
            목적: 상담 진행, 보유기간: 상담 종료 후 1년)
          </span>
        </label>

        {status === "error" && (
          <p className="text-sm text-rose-500">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full rounded-full bg-navy py-3 font-semibold text-white transition hover:bg-navy-600 disabled:opacity-50"
        >
          {status === "submitting" ? "전송 중..." : "상담 신청하기"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 outline-none focus:border-accent"
      />
    </div>
  );
}
