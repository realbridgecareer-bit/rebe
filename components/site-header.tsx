"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrandLockup } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/#about", label: "브랜드 소개" },
  { href: "/#mentors", label: "멘토진" },
  { href: "/#services", label: "서비스" },
];

export function SiteHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => setIsLoggedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex text-slate-900">
          <BrandLockup />
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden font-medium text-slate-600 transition hover:text-terracotta sm:block"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="font-medium text-slate-600 transition hover:text-ink"
          >
            {isLoggedIn ? "마이페이지" : "로그인"}
          </Link>
          <Link
            href="/contact"
            className="rounded-full bg-sage px-4 py-2 font-semibold text-white transition hover:bg-sage-600"
          >
            상담신청
          </Link>
        </nav>
      </div>
    </header>
  );
}
