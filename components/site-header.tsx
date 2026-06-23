import Link from "next/link";
import { BrandWordmark } from "@/components/icons";

const navItems = [
  { href: "/#about", label: "브랜드 소개" },
  { href: "/#mentors", label: "멘토진" },
  { href: "/#services", label: "서비스" },
  { href: "/blog", label: "취업정보" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex flex-col items-start leading-none">
          <BrandWordmark className="text-xl font-bold tracking-tight" />
          <span className="mt-1 text-[10px] tracking-tight text-slate-400">
            부동산 금융업 취업의 지름길
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden font-medium text-slate-600 transition hover:text-accent sm:block"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="font-medium text-slate-600 transition hover:text-navy"
          >
            로그인
          </Link>
          <Link
            href="/contact"
            className="rounded-full bg-navy px-4 py-2 font-semibold text-white transition hover:bg-navy-600"
          >
            상담신청
          </Link>
        </nav>
      </div>
    </header>
  );
}
