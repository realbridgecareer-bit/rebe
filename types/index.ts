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

/** 블로그 / 취업정보 게시글 */
export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string; // ISO 날짜 문자열
  content?: string;
}
