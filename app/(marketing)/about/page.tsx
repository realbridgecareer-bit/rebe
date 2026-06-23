import { redirect } from "next/navigation";

// 브랜드 소개는 홈("/")의 #about 섹션으로 통합됨. 중복 라우트는 리다이렉트한다.
export default function AboutPage() {
  redirect("/#about");
}
