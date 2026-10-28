// 사업자 정보 단일 소스. 주소·연락처 등이 바뀌면 이 파일만 고치면
// 모든 푸터(components/site-footer.tsx, components/landing-page.tsx의 SiteFooterFull)에 반영된다.
export const BUSINESS = {
  brandName: "리얼브릿지(Real Bridge)",
  ceo: "엄은혜",
  registrationNumber: "833-58-00890",
  address: "경기도 의왕시 복지로 151, 103동 104호(내손동, 인덕원 퍼스비엘)",
  phone: "02-541-8248",
  email: "realbridge.career@gmail.com",
  hours: "평일 09:00 - 18:00",
} as const;

/**
 * 공정거래위원회 "사업자정보확인" 팝업. 통신판매업 신고 시스템에 등록된 정보를
 * 보여주는데, 간이과세자는 그 신고가 면제라 조회 결과가 비어있을 수 있다.
 * 비어있으면 BUSINESS.address를 그대로 노출하거나 신고를 검토할 것.
 */
export const FTC_VERIFY_URL = `https://www.ftc.go.kr/bizCommPop.do?wrkr_no=${BUSINESS.registrationNumber.replace(/-/g, "")}`;
