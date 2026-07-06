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

/** 브랜드 워드마크 겸 로고. "REal BridgE"에서 대문자 R·E·B·E만 메인 컬러(terracotta)로
   강조하고 나머지는 상속색. className으로 크기/기본색 지정. */
export const BrandWordmark = ({ className }: { className?: string }) => (
  <span className={`font-sans font-extrabold tracking-tight ${className ?? ""}`}>
    <span className="text-terracotta">RE</span>al{" "}
    <span className="text-terracotta">B</span>ridg<span className="text-terracotta">E</span>
  </span>
);

/** 워드마크 로고(심볼 마크 없음). 헤더·푸터 공용. */
export const BrandLockup = ({ className }: { className?: string }) => (
  <span className={`inline-flex items-center ${className ?? ""}`}>
    <BrandWordmark className="text-lg text-ink" />
  </span>
);

/**
 * REBE 브랜드 로고 마크.
 * 컨셉: 상승 막대그래프 — 성장·도약. 세로 라운드 막대 3개(세이지, 높이 점증) +
 * 우상향 아크·점(테라코타). 색이 고정된 컬러 마크. className으로 크기 지정.
 */
export const BrandMark = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 32 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="1.5" y="15" width="4.4" height="11" rx="2.2" fill="#2F3A2E" />
    <rect x="8" y="10" width="4.4" height="16" rx="2.2" fill="#2F3A2E" />
    <rect x="14.5" y="5" width="4.4" height="21" rx="2.2" fill="#2F3A2E" />
    <path
      d="M16.7 6 Q23.5 1 29 5"
      stroke="#C06A45"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <circle cx="29" cy="5" r="2.4" fill="#C06A45" />
  </svg>
);
