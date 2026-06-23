// 컨설팅 패키지 정의. 가격은 공개 사이트에 표기하지 않고 "상담 후 안내".

export interface ConsultingPackage {
  name: string;
  tagline: string;
  features: string[];
  /** 추천 패키지 강조 여부 */
  highlighted?: boolean;
}

export const packages: ConsultingPackage[] = [
  {
    name: "STANDARD",
    tagline: "핵심만 빠르게",
    features: ["60분 대면 컨설팅 1회", "자기소개서 첨삭", "모의면접"],
  },
  {
    name: "DELUXE",
    tagline: "합격까지 밀착 관리",
    features: [
      "90분 대면 컨설팅 3회",
      "현직자 실무자료 제공",
      "비공개 채용정보 공유",
    ],
    highlighted: true,
  },
  {
    name: "PREMIUM",
    tagline: "네트워크까지 연결",
    features: [
      "90분 대면 컨설팅 5회",
      "DELUXE 전체 포함",
      "오프라인 네트워킹 모임 참여",
    ],
  },
];
