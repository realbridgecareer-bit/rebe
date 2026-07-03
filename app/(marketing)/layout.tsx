"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 홈("/")·합격후기("/success")는 자체 헤더·푸터를 포함하므로 공용 크롬을 생략한다.
  if (pathname === "/" || pathname === "/success") {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-white text-slate-700">{children}</main>
      <SiteFooter />
    </>
  );
}
