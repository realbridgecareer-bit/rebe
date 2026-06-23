"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [careerType, setCareerType] = useState<string>("");
  const [interestJob, setInterestJob] = useState<string>("");

  useEffect(() => {
    const supabase = createClient();
    // 세션은 쿠키/스토리지에서 읽으므로 네트워크 없이 확인 가능
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/login");
        return;
      }
      const meta = data.session.user.user_metadata ?? {};
      setName((meta.name as string) ?? "");
      setEmail(data.session.user.email ?? "");
      setPhone((meta.phone as string) ?? "");
      setCareerType((meta.careerType as string) ?? "");
      setInterestJob((meta.interestJob as string) ?? "");
      setLoading(false);
    });
  }, [router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  if (loading) {
    return <p className="text-slate-500">불러오는 중…</p>;
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">
            {name ? `${name}님, 환영합니다` : "마이페이지"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white"
        >
          로그아웃
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-sm">
        <h2 className="font-bold text-navy">내 프로필</h2>
        <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <ProfileRow label="연락처" value={phone} />
          <ProfileRow label="이메일" value={email} />
          <ProfileRow label="경력 구분" value={careerType} />
          <ProfileRow label="관심 직무" value={interestJob || "-"} />
        </dl>
      </div>

      <p className="mt-6 text-slate-500">
        신청한 상담 내역, 결제 내역, 회원 전용 자료실이 이곳에 표시됩니다.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card title="상담 내역" value="0건" />
        <Card title="결제 내역" value="0건" />
        <Card title="보유 프로그램" value="0개" />
      </div>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-20 flex-shrink-0 text-slate-400">{label}</dt>
      <dd className="font-medium text-slate-700">{value}</dd>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-navy">{value}</p>
    </div>
  );
}
