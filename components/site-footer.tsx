import Link from "next/link";
import { BrandLockup } from "@/components/icons";

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
          <Link href="/privacy" className="hover:text-terracotta">
            개인정보처리방침
          </Link>
          <Link href="/terms" className="hover:text-terracotta">
            이용약관
          </Link>
        </div>

        <div className="mt-4 text-xs leading-relaxed text-slate-400">
          <p>상호: 부프로 · 대표: 엄은혜 · 사업자등록번호: 537-59-00849</p>
          <p className="mt-1">
            서울시 송파구 중대로 135, 11층 송파ICT청년창업지원센터(가락동, 아이티벤처타워)
          </p>
          <p className="mt-1">
            전화: 02-541-8248 · 이메일: realbridge.career@gmail.com
          </p>
          <p className="mt-3">© 2026 Real Bridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
