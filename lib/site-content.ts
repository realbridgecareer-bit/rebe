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
  stat_companies: string;    // 합격 기관 지표 "13+"
  stat_rating: string;       // 평균 평점 "5.0"
  stat_satisfaction: string; // 추천 만족도 "100%"
  companies_text: string;    // 합격 기관 목록 문구
};

export type Mentor = {
  id?: string;
  sort_order: number;
  name: string;
  company: string;
  background: string;
  expertise: string;
  published: boolean;
};

export function rowToMentor(r: Record<string, unknown>): Mentor {
  return {
    id: r.id as string,
    sort_order: (r.sort_order as number) ?? 0,
    name: (r.name as string) ?? "",
    company: (r.company as string) ?? "",
    background: (r.background as string) ?? "",
    expertise: (r.expertise as string) ?? "",
    published: r.published === undefined ? true : Boolean(r.published),
  };
}

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
  stat_companies: "13+",
  stat_rating: "5.0",
  stat_satisfaction: "100%",
  companies_text: "신세계프라퍼티, NAI Korea, 한국투자신탁운용, 코람코자산신탁, 롯데AMC, ARA Korea, MDM, 이화자산운용, IFC Seoul, MG새마을금고자산관리 외 다수",
};

export const FALLBACK_MENTORS: Mentor[] = [
  { sort_order: 1, name: "멘토 A", company: "부동산 디벨로퍼 대표", background: "전 대기업 종합건설사 부동산개발팀", expertise: "시행사, 건설사, 개발 및 PF", published: true },
  { sort_order: 2, name: "멘토 B", company: "국내 Top-Tier 대기업 운용사", background: "전 외국계 컨설팅사 재직", expertise: "자산운용사, 펀드 및 리츠, PM, LM", published: true },
  { sort_order: 3, name: "멘토 C", company: "국내 대기업 계열 운용사", background: "전 외국계 컨설팅사 재직", expertise: "자산운용사, 해외 펀드 투자 및 운용", published: true },
  { sort_order: 4, name: "멘토 D", company: "국내 Top-Tier 기금운용본부", background: "전 국내 자산운용사 재직", expertise: "기관투자자, 증권사, 인프라 투자 및 운용", published: true },
  { sort_order: 5, name: "멘토 E", company: "국내 Top-Tier 증권사", background: "국내 부동산 개발·PF·에쿼티 투자 경험", expertise: "증권사, 개발 및 PF 사업수지 분석", published: true },
  { sort_order: 6, name: "멘토 F", company: "외국계 컨설팅사", background: "Valuation 및 컨설팅 프로젝트 다수", expertise: "재무 모델, 사업수지 분석", published: true },
  { sort_order: 7, name: "멘토 G", company: "국내 메이저 시행사", background: "공동주택·상업시설 개발 경험 보유", expertise: "시행사, 증권사, 개발 및 PF", published: true },
  { sort_order: 8, name: "멘토 H", company: "국내 Top-Tier 기금운용본부", background: "전 은행 기업금융팀, 전 증권사", expertise: "기관투자자, 은행, 증권사, 기업금융", published: true },
];

export const FALLBACK_TICKERS: string[] = [
  "신세계프라퍼티 기획팀 최종 합격",
  "코람코자산신탁 상장리츠팀 최종 합격",
  "코람코자산신탁 채용형 인턴 최종 합격",
  "이화자산운용 대체투자팀 최종 합격",
  "ARA Korea 리츠운용 최종 합격",
  "한국투자증권 IB부문 면접 합격",
  "NH투자증권 IB부문 서류 합격",
  "KB자산운용 부동산운용본부 서류 및 1차면접 합격",
  "군인공제회 서류 및 면접 합격",
  "한국투자신탁운용 인턴 최종 합격",
  "롯데AMC 리츠투자팀 최종 합격",
  "NAI Korea Capital Market 최종 합격",
];

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
