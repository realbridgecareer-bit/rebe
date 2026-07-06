import Link from "next/link";

/**
 * 사이트 전역 프로모션 띠배너(전 서비스 30% 할인).
 * 루트 레이아웃 최상단에서 렌더링되어 모든 페이지 맨 위에 노출된다.
 * 프로모션 종료 시 app/layout.tsx에서 이 컴포넌트만 제거하면 된다.
 */
export default function PromoBanner() {
  return (
    <Link
      href="/#services"
      className="block bg-terracotta text-white no-underline transition-opacity hover:opacity-90"
    >
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-2.5 gap-y-1 px-4 py-2 text-center">
        <span className="text-[13px] font-extrabold tracking-[-0.01em] sm:text-[13.5px]">
          전 서비스{" "}
          <span className="text-cream">30% 할인</span>
        </span>
        <span className="hidden text-[12.5px] font-semibold text-white/80 sm:inline">
          지금 상담 신청하고 혜택을 받으세요
        </span>
        <span className="text-[12.5px] font-bold underline underline-offset-2">
          자세히 보기 →
        </span>
      </div>
    </Link>
  );
}
