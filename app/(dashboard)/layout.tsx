import Link from "next/link";
import { BrandWordmark } from "@/components/icons";

// TODO: 미들웨어 또는 이 레이아웃에서 Supabase 세션을 확인해 비로그인 시 /login 으로 리다이렉트.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-ivory text-slate-700">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center text-ink">
            <BrandWordmark className="font-bold" />
          </Link>
          <span className="text-sm text-slate-400">마이페이지</span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
