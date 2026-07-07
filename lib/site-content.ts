// 사이트 콘텐츠(서비스 패키지 / 컨설팅 후기 / 할인 설정) 공용 타입 + DB 매핑 + 폴백.
// 랜딩페이지는 Supabase에서 읽고, 비었거나 실패하면 폴백을 사용한다.

export type Pkg = {
  id?: string;
  sort_order: number;
  name: string;      // "Real Connect"
  sub: string;       // 라벨 "대면 컨설팅"
  detail: string;    // 강조 "90분 1회" | "시간 제한 없음"
  price: string;     // 정가 "68만원"
  sale_price: string; // 할인가 "48만원" (빈 문자열이면 할인 없음)
  features: string[];
  featured: boolean;
  published: boolean;
};

export type Review = {
  id?: string;
  sort_order: number;
  name: string;
  service: "Real Connect" | "Real Bridge" | "Real Success";
  persona: string;
  text: string;
  published: boolean;
};

export type SiteSettings = {
  promo_enabled: boolean;
  promo_label: string;   // 가격카드 뱃지 "30% 할인"
  promo_banner: string;  // 상단 배너 문구 "전 서비스 30% 할인"
};

export function rowToPkg(r: Record<string, unknown>): Pkg {
  return {
    id: r.id as string,
    sort_order: (r.sort_order as number) ?? 0,
    name: (r.name as string) ?? "",
    sub: (r.sub as string) ?? "",
    detail: (r.detail as string) ?? "",
    price: (r.price as string) ?? "",
    sale_price: (r.sale_price as string) ?? "",
    features: (r.features as string[]) ?? [],
    featured: Boolean(r.featured),
    published: r.published === undefined ? true : Boolean(r.published),
  };
}
export function pkgToRow(p: Pkg) {
  return {
    sort_order: p.sort_order,
    name: p.name,
    sub: p.sub,
    detail: p.detail,
    price: p.price,
    sale_price: p.sale_price || null,
    features: p.features,
    featured: p.featured,
    published: p.published,
  };
}

export function rowToReview(r: Record<string, unknown>): Review {
  return {
    id: r.id as string,
    sort_order: (r.sort_order as number) ?? 0,
    name: (r.name as string) ?? "",
    service: (r.service as Review["service"]) ?? "Real Connect",
    persona: (r.persona as string) ?? "",
    text: (r.text as string) ?? "",
    published: r.published === undefined ? true : Boolean(r.published),
  };
}
export function reviewToRow(r: Review) {
  return {
    sort_order: r.sort_order,
    name: r.name,
    service: r.service,
    persona: r.persona,
    text: r.text,
    published: r.published,
  };
}

export const FALLBACK_SETTINGS: SiteSettings = {
  promo_enabled: true,
  promo_label: "30% 할인",
  promo_banner: "전 서비스 30% 할인",
};

export const FALLBACK_PACKAGES: Pkg[] = [
  {
    sort_order: 1, name: "Real Connect", sub: "대면 컨설팅", detail: "90분 1회",
    price: "68만원", sale_price: "48만원", featured: false, published: true,
    features: [
      "입사지원서 컨설팅 or 면접 준비 컨설팅(택1)",
      "지원 직무·업계 현직자 관점의 컨설팅",
      "필요 부분 수정, 방향성 제시, 어필 포인트 제시",
      "채용공고에 드러나지 않는 핵심 역량·준비 방향 안내",
      "업계 연봉 수준·복지 등 현직자 관점의 정보 안내",
    ],
  },
  {
    sort_order: 2, name: "Real Bridge", sub: "대면 컨설팅", detail: "90분 2회",
    price: "126만원", sale_price: "88만원", featured: false, published: true,
    features: [
      "입사지원서·면접·커리어 단계적 컨설팅",
      "지원 직무·업계 현직자 관점의 컨설팅",
      "직무별 마스터 자소서 및 면접 예상 질문 제공",
      "현직자 경험을 바탕으로 한 직무·업계 동향 제공",
      "채용 동향 및 추천 직무 안내",
      "직무 역량 개발을 위한 학습 자료 제공",
    ],
  },
  {
    sort_order: 3, name: "Real Success", sub: "대면 컨설팅 3회", detail: "시간 제한 없음",
    price: "164만원", sale_price: "115만원", featured: true, published: true,
    features: [
      "Real Bridge의 모든 혜택 포함",
      "타 지원자와 Grouping으로 객관적 위치 파악",
      "합격 사례 및 정보 제공(자소서·면접)",
      "대규모 네트워킹 모임 참여 기회",
      "현직자 네트워킹을 통한 직무·업계 정보 제공",
      "직무에 필요한 Skill-up 자료 제공",
    ],
  },
];
