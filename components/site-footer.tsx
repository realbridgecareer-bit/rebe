import Link from "next/link";
import { BrandLockup } from "@/components/icons";
import { BUSINESS } from "@/lib/business";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-ivory py-10 text-slate-600">
      <div className="mx-auto max-w-7xl px-5 text-sm sm:px-8">
        <div className="text-slate-900">
          <BrandLockup />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-slate-500">
          <Link href="/" className="hover:text-terracotta">
            홈
          </Link>
          <Link href="/contact" className="hover:text-terracotta">
            상담신청
          </Link>
          <Link href="/review" className="hover:text-terracotta">
            후기 남기기
          </Link>
          <Link href="/success/submit" className="hover:text-terracotta">
            합격 후기 남기기
          </Link>
          <Link href="/privacy" className="hover:text-terracotta">
            개인정보처리방침
          </Link>
          <Link href="/terms" className="hover:text-terracotta">
            이용약관
          </Link>
        </div>

        <div className="mt-4 text-xs leading-relaxed text-slate-400">
          <p>상호: {BUSINESS.brandName} · 대표: {BUSINESS.ceo} · 사업자등록번호: {BUSINESS.registrationNumber}</p>
          <p className="mt-1">{BUSINESS.address}</p>
          <p className="mt-1">전화: {BUSINESS.phone} · 이메일: {BUSINESS.email}</p>
          <p className="mt-3">© 2026 Real Bridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
