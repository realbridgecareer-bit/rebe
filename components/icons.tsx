// 외부 의존성 없는 경량 라인 아이콘 세트 (이모지 대체).
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const Check = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const X = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const Star = (p: IconProps) => (
  <svg {...base} {...p} fill="currentColor" stroke="none">
    <path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.7L12 17.3 5.8 20.8l1.6-6.7L2.2 9.5l6.9-.6z" />
  </svg>
);

export const ArrowRight = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const Mail = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 6 10-6" />
  </svg>
);

export const Phone = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  </svg>
);

export const MapPin = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const Clock = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const GraduationCap = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M22 10 12 5 2 10l10 5 10-5z" />
    <path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" />
  </svg>
);

export const Briefcase = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M2 13h20" />
  </svg>
);

export const Compass = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5z" />
  </svg>
);

export const Quote = (p: IconProps) => (
  <svg {...base} {...p} fill="currentColor" stroke="none">
    <path d="M7 7H4a3 3 0 0 0-3 3v3a3 3 0 0 0 3 3h2v-3H4v-2h3zM18 7h-3a3 3 0 0 0-3 3v3a3 3 0 0 0 3 3h2v-3h-2v-2h3z" />
  </svg>
);

export const Menu = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

export const Close = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const Play = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5z" />
  </svg>
);

// 익명 멘토용 인물 실루엣
export const UserRound = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 12.6a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
    <path d="M3.2 21.4a8.8 8.8 0 0 1 17.6 0 .6.6 0 0 1-.6.6H3.8a.6.6 0 0 1-.6-.6z" />
  </svg>
);

/**
 * 브랜드 워드마크. "REal BridgE"에서 REBE(R·E·B·E)만 강조색(accent)으로 표시.
 * 나머지 글자는 부모의 글자색(navy/white)을 상속한다. className으로 크기/굵기 지정.
 */
export const BrandWordmark = ({ className }: { className?: string }) => (
  <span className={`font-serif ${className ?? ""}`}>
    <span className="text-brand-orange">RE</span>al{" "}
    <span className="text-brand-orange">B</span>ridg<span className="text-brand-orange">E</span>
  </span>
);

/**
 * REBE 브랜드 로고 마크.
 * 컨셉: 현수교(suspension bridge) — 구직자와 현직자를 잇는 '다리'.
 * currentColor를 사용하므로 배경에 따라 navy/white 등으로 자연스럽게 적용된다.
 * className으로 크기를 지정한다. (예: h-9 w-9)
 */
export const BrandMark = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 40 40"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* 상판(도로) */}
    <path d="M4 14.5h32" strokeWidth="2.2" />
    {/* 교각 */}
    <path d="M7 14.5V27M20 14.5V27M33 14.5V27" strokeWidth="2.2" />
    {/* 아치 2개 */}
    <path d="M7 27q6.5-11 13 0" strokeWidth="2.2" />
    <path d="M20 27q6.5-11 13 0" strokeWidth="2.2" />
    {/* 수면 */}
    <path d="M5 31h30" strokeWidth="1.4" />
  </svg>
);
