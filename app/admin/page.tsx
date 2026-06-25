"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Consultation = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  program: string | null;
  message: string;
  status: string;
};

type State = "loading" | "denied" | "ready";

export default function AdminPage() {
  const router = useRouter();
  const [state, setState] = useState<State>("loading");
  const [rows, setRows] = useState<Consultation[]>([]);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.replace("/login");
        return;
      }
      // 관리자 여부 확인 (admins 테이블에 본인 행이 있는지)
      const uid = sessionData.session.user.id;
      const { data: adminRow } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", uid)
        .maybeSingle();

      if (!adminRow) {
        setState("denied");
        return;
      }

      const { data, error } = await supabase
        .from("consultations")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setRows(data as Consultation[]);
      setState("ready");
    })();
  }, [router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
  }

  if (state === "loading") {
    return (
      <Shell>
        <p className="text-slate-500">불러오는 중…</p>
      </Shell>
    );
  }

  if (state === "denied") {
    return (
      <Shell>
        <h1 className="text-2xl font-bold text-navy">접근 권한이 없습니다</h1>
        <p className="mt-3 text-slate-500">
          관리자 계정으로 로그인해야 이 페이지를 볼 수 있습니다.
        </p>
        <Link href="/" className="mt-6 inline-block font-medium text-accent">
          ← 홈으로
        </Link>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">상담 신청 내역</h1>
          <p className="mt-1 text-sm text-slate-500">총 {rows.length}건</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-surface"
        >
          로그아웃
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="mt-8 text-slate-500">아직 접수된 상담이 없습니다.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">접수일</th>
                <th className="px-4 py-3 font-semibold">이름</th>
                <th className="px-4 py-3 font-semibold">연락처</th>
                <th className="px-4 py-3 font-semibold">이메일</th>
                <th className="px-4 py-3 font-semibold">관심 패키지</th>
                <th className="px-4 py-3 font-semibold">상담 내용</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.id} className="align-top">
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                    {new Date(r.created_at).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-4 py-3 font-medium text-navy">{r.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-700">
                    {r.phone}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{r.email ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {r.program ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{r.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-bold text-navy">
            Real Bridge 관리자
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
