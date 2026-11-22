// 공용 타입 정의

/** 상담 신청 폼 데이터 */
export interface ConsultationInput {
  name: string;
  phone: string;
  email: string;
  /** 관심 프로그램 (선택) */
  program?: string;
  /** 상담 내용 */
  message: string;
  /** 개인정보 수집·이용 동의 */
  agreePrivacy: boolean;
}

/** 고객이 직접 남기는 후기 제출 폼 데이터 */
export interface ReviewSubmissionInput {
  name: string;
  service: string;
  /** 본인 소개 (선택) */
  persona?: string;
  text: string;
  /** 개인정보 수집·이용 동의 */
  agreePrivacy: boolean;
}

/** 고객이 직접 남기는 합격 후기(성공 스토리) 제출 폼 데이터 */
export interface StorySubmissionInput {
  name: string;
  service: string;
  /** 본인 소개 (선택) */
  persona?: string;
  company: string;
  before: string;
  after: string;
  /** 한 줄 인용구 (선택) */
  quote?: string;
  /** 상세 후기 본문 (빈 줄로 문단 구분) */
  story: string;
  /** 태그 (쉼표로 구분, 선택) */
  tags?: string;
  /** 개인정보 수집·이용 동의 */
  agreePrivacy: boolean;
}

/** 개별 링크 후기 설문 제출 데이터 (RPC submit_review_by_token 에 전달) */
export interface InviteSubmissionPayload {
  /** 현재 상황: 최종 합격 / 진행 중 / 방향 정리 / 기타 */
  status: "hired" | "progress" | "direction" | "other";
  service: string;
  persona: string;
  /** 합격(hired)일 때만 채움 */
  company: string;
  before: string;
  after: string;
  /** 한 줄 후기 */
  quote: string;
  /** 본문 문단 */
  paragraphs: string[];
  /** 도움받은 부분 태그 */
  tags: string[];
  rating: number;
  /** 개선 의견 (비공개) */
  feedback: string;
  agree_privacy: boolean;
  agree_publish: boolean;
  agree_truth: boolean;
}

/** 블로그 / 취업정보 게시글 */
export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string; // ISO 날짜 문자열
  content?: string;
}
