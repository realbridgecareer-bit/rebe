import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "Real Bridge(REBE) 개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-bold text-navy">개인정보처리방침</h1>

      <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
        ※ 본 문서는 <b>초안</b>입니다. 실제 시행 전 변호사 등 전문가의 검토를 받아
        회사 운영 실태에 맞게 수정하시기 바랍니다.
      </div>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-600">
        <p>
          부프로(이하 “회사”)는 정보주체의 자유와 권리 보호를 위해
          「개인정보 보호법」 및 관계 법령을 준수하며, 다음과 같이
          개인정보처리방침을 수립·공개합니다. 본 방침은 회사가 운영하는
          취업컨설팅 서비스 ‘Real Bridge(REBE)’에 적용됩니다.
        </p>

        <Section title="1. 수집하는 개인정보 항목 및 방법">
          <ul className="list-disc space-y-1 pl-5">
            <li>상담 신청: 이름, 연락처(휴대전화), 이메일, 상담 내용</li>
            <li>
              회원가입: 이름, 연락처, 이메일, 비밀번호, 경력 구분, 관심 직무
            </li>
            <li>채팅 상담(채널톡): 상담 대화 내용, 연락처</li>
            <li>
              자동 수집: 서비스 이용 기록, 접속 로그, 쿠키(서비스 운영·통계 목적)
            </li>
          </ul>
        </Section>

        <Section title="2. 개인정보의 수집·이용 목적">
          <ul className="list-disc space-y-1 pl-5">
            <li>취업컨설팅 상담 신청 접수 및 진행</li>
            <li>회원 식별·관리 및 회원 전용 서비스 제공</li>
            <li>컨설팅 서비스 제공, 관련 정보·공지 안내</li>
            <li>문의 응대 및 민원 처리</li>
          </ul>
        </Section>

        <Section title="3. 보유 및 이용 기간">
          <p>
            원칙적으로 수집·이용 목적이 달성되면 지체 없이 파기합니다. 다만 상담
            내역은 상담 종료 후 1년간 보관 후 파기하며, 회원 정보는 회원 탈퇴 시
            지체 없이 파기합니다. 관계 법령에 따라 보존이 필요한 경우 해당 기간
            동안 보관합니다(예: 전자상거래법에 따른 거래·결제 기록 등).
          </p>
        </Section>

        <Section title="4. 개인정보 처리의 위탁">
          <p>회사는 서비스 운영을 위해 아래와 같이 처리를 위탁합니다.</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Supabase, Inc. — 데이터베이스 저장·관리(호스팅)</li>
            <li>Vercel, Inc. — 웹사이트 호스팅</li>
            <li>주식회사 채널코퍼레이션(채널톡) — 채팅 상담 운영</li>
          </ul>
        </Section>

        <Section title="5. 개인정보의 제3자 제공">
          <p>
            회사는 정보주체의 동의가 있거나 법령에 근거가 있는 경우를 제외하고는
            개인정보를 제3자에게 제공하지 않습니다.
          </p>
        </Section>

        <Section title="6. 정보주체의 권리·의무 및 행사 방법">
          <p>
            정보주체는 언제든지 자신의 개인정보에 대한 열람·정정·삭제·처리정지를
            요구할 수 있으며, 회사는 관계 법령에 따라 지체 없이 조치합니다. 요청은
            아래 개인정보 보호책임자에게 하실 수 있습니다.
          </p>
        </Section>

        <Section title="7. 개인정보의 파기">
          <p>
            보유 기간이 경과하거나 처리 목적이 달성된 개인정보는 재생이 불가능한
            방법으로 파기합니다(전자적 파일은 복구 불가능한 방식으로 삭제).
          </p>
        </Section>

        <Section title="8. 개인정보 보호책임자">
          <ul className="list-disc space-y-1 pl-5">
            <li>책임자: 부프로 대표 엄은혜</li>
            <li>이메일: boopro.official@gmail.com</li>
            <li>전화: 02-541-8248</li>
          </ul>
        </Section>

        <Section title="9. 쿠키의 운영">
          <p>
            회사는 이용자 편의와 통계 분석을 위해 쿠키를 사용할 수 있습니다.
            이용자는 브라우저 설정에서 쿠키 저장을 거부할 수 있습니다.
          </p>
        </Section>

        <Section title="10. 방침의 변경">
          <p>
            본 개인정보처리방침은 시행일로부터 적용되며, 내용 추가·삭제·수정이
            있을 경우 시행 7일 전부터 공지합니다.
          </p>
          <p className="mt-2 text-slate-400">시행일: 2026년 0월 0일</p>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-bold text-navy">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
