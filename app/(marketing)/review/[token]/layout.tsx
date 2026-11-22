import type { Metadata } from "next";

// 개별 후기 링크는 본인에게만 전달되는 비공개 주소이므로 검색엔진에 노출하지 않는다.
export const metadata: Metadata = {
  title: "후기 남기기 | REBE",
  robots: { index: false, follow: false },
};

export default function ReviewInviteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
