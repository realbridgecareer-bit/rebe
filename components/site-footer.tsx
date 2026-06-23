import Link from "next/link";
import { BrandWordmark } from "@/components/icons";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-navy-600 py-10 text-white/70">
      <div className="mx-auto max-w-7xl px-5 text-sm sm:px-8">
        <div className="flex items-center text-white">
          <BrandWordmark className="text-xl font-bold" />
        </div>
        <p className="mt-3 text-white/55">
          부동산·금융업에 특화된 취업컨설팅 플랫폼
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-white/60">
          <Link href="/" className="hover:text-white">
            홈
          </Link>
          <Link href="/contact" className="hover:text-white">
            상담신청
          </Link>
          <Link href="/privacy" className="hover:text-white">
            개인정보처리방침
          </Link>
          <Link href="/terms" className="hover:text-white">
            이용약관
          </Link>
        </div>

        <div className="mt-4 text-xs leading-relaxed text-white/40">
          <p>상호: 부프로 · 대표: 엄은혜 · 사업자등록번호: 537-59-00849</p>
          <p className="mt-1">
            서울시 송파구 중대로 135, 11층 송파ICT청년창업지원센터(가락동, 아이티벤처타워)
          </p>
          <p className="mt-1">
            전화: 02-541-8248 · 이메일: boopro.official@gmail.com · 호스팅: (주)아임웹
          </p>
          <p className="mt-3 text-white/35">
            © 2026 Real Bridge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
