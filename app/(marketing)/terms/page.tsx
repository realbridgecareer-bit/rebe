import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관",
  description: "Real Bridge(REBE) 서비스 이용약관",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-bold text-navy">이용약관</h1>

      <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
        ※ 본 약관은 <b>초안</b>입니다. 특히 <b>환불 규정</b>과 <b>면책 조항</b>은
        실제 운영 정책에 맞게 정하고, 시행 전 변호사 검토를 받으시기 바랍니다.
      </div>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-600">
        <Section title="제1조 (목적)">
          <p>
            본 약관은 부프로(이하 “회사”)가 운영하는 취업컨설팅 서비스 ‘Real
            Bridge(REBE)’(이하 “서비스”)의 이용과 관련하여 회사와 이용자의 권리·
            의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </Section>

        <Section title="제2조 (정의)">
          <ul className="list-disc space-y-1 pl-5">
            <li>“서비스”란 회사가 제공하는 취업컨설팅, 정보 제공, 상담 등을 말합니다.</li>
            <li>“회원”이란 본 약관에 동의하고 가입한 자를 말합니다.</li>
            <li>“멘토”란 회사가 연결하는 해당 업계 현직자·전문가를 말합니다.</li>
          </ul>
        </Section>

        <Section title="제3조 (약관의 효력 및 변경)">
          <p>
            본 약관은 서비스 화면에 게시함으로써 효력이 발생합니다. 회사는 관계
            법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 적용일
            및 사유를 명시하여 사전 공지합니다.
          </p>
        </Section>

        <Section title="제4조 (회원가입 및 관리)">
          <p>
            이용자는 회사가 정한 절차에 따라 회원가입을 신청하며, 회사는 이를
            승낙함으로써 회원으로 등록합니다. 회원은 가입 정보에 변경이 있을 경우
            정확히 갱신하여야 하며, 본인의 계정 정보를 안전하게 관리할 책임이
            있습니다.
          </p>
        </Section>

        <Section title="제5조 (서비스의 내용)">
          <p>회사는 다음의 서비스를 제공합니다.</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>현직자 기반 취업컨설팅(자기소개서·면접·커리어 방향성 등)</li>
            <li>업계·직무 관련 정보 제공 및 콘텐츠</li>
            <li>상담(채팅·대면·비대면) 및 패키지형 컨설팅</li>
          </ul>
        </Section>

        <Section title="제6조 (이용요금 및 결제)">
          <p>
            서비스 이용요금, 결제 방법, 제공 회차 등은 각 패키지에 명시된 바에
            따릅니다. 결제 수단·절차는 회사가 정한 방식(카드 결제, 계좌이체 등)에
            따릅니다.
          </p>
        </Section>

        <Section title="제7조 (청약철회 및 환불)">
          <p>
            이용자는 관계 법령(전자상거래법 등)에 따라 청약철회를 할 수 있습니다.
            컨설팅 서비스의 특성상, <b>이미 제공된 회차·자료에 대해서는 환불이
            제한</b>될 수 있으며, 구체적 환불 기준(예: 진행 전 전액 환불, 일부
            진행 시 잔여 회차 기준 환불 등)은 별도 환불 정책에 따릅니다.
          </p>
          <p className="mt-2 text-amber-700">
            ※ 실제 환불 기준(회차별 비율 등)을 확정해 이 조항에 반영하세요.
          </p>
        </Section>

        <Section title="제8조 (회원의 의무)">
          <p>
            회원은 타인의 정보를 도용하거나, 서비스 운영을 방해하거나, 제공받은
            자료를 무단으로 복제·배포해서는 안 됩니다.
          </p>
        </Section>

        <Section title="제9조 (회사의 의무)">
          <p>
            회사는 관계 법령과 본 약관을 준수하며, 안정적인 서비스 제공을 위해
            노력합니다. 이용자의 개인정보를 개인정보처리방침에 따라 보호합니다.
          </p>
        </Section>

        <Section title="제10조 (콘텐츠의 저작권)">
          <p>
            회사가 제공하는 자료·콘텐츠의 저작권은 회사 또는 정당한 권리자에게
            있으며, 이용자는 사전 동의 없이 이를 영리 목적으로 이용하거나
            제3자에게 제공할 수 없습니다.
          </p>
        </Section>

        <Section title="제11조 (면책)">
          <p>
            회사는 취업컨설팅 서비스를 성실히 제공하나, <b>특정 기업의 합격·채용
            결과를 보장하지 않습니다.</b> 합격 여부는 이용자의 역량·준비·기업의
            채용 사정 등 다양한 요인에 따라 달라질 수 있습니다. 회사는 천재지변,
            이용자의 귀책 등 회사의 통제를 벗어난 사유로 인한 손해에 대해 책임을
            지지 않습니다.
          </p>
        </Section>

        <Section title="제12조 (분쟁 해결 및 준거법)">
          <p>
            본 약관은 대한민국 법령에 따라 해석되며, 서비스 이용과 관련한 분쟁에
            대해서는 관계 법령 및 상관례에 따릅니다. 분쟁 발생 시 관할 법원은
            민사소송법에 따른 법원으로 합니다.
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
