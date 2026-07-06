"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandMark, BrandWordmark } from "@/components/icons";
// 멘토 네트워크 로고월은 'logo/로고 정리.pptx'를 PowerPoint로 렌더한 슬라이드 이미지를 사용
// (public/logos/network-wall/, scripts/network-wall.cjs 생성).

/* ===== 인라인 아이콘 (디자인 스펙에 맞춘 색·굵기) ===== */
function Arrow({ color = "#fff", size = 17, w = 2.2 }: { color?: string; size?: number; w?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function StarG({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#E8A63C" aria-hidden="true">
      <path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z" />
    </svg>
  );
}
function Stars({ size = 13 }: { size?: number }) {
  return (
    <span className="flex" style={{ gap: size > 14 ? 2 : 1 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <StarG key={i} size={size} />
      ))}
    </span>
  );
}
function Chk({ color = "#C06A45", size = 16, w = 2.6 }: { color?: string; size?: number; w?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-none" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ===== 데이터 ===== */
const TICKER = [
  "신세계프라퍼티 기획팀 최종 합격",
  "코람코자산신탁 상장리츠팀 최종 합격",
  "코람코자산신탁 채용형 인턴 최종 합격",
  "이화자산운용 대체투자팀 최종 합격",
  "ARA Korea 리츠운용 최종 합격",
  "한국투자증권 IB부문 면접 합격",
  "NH투자증권 IB부문 서류 합격",
  "KB자산운용 서류 및 1차면접 합격",
  "군인공제회 서류 및 면접 합격",
  "한국투자신탁운용 인턴 최종 합격",
  "롯데AMC 리츠투자팀 최종 합격",
  "NAI Korea Capital Market 최종 합격",
];

const ABOUT_TAGS = ["부동산", "금융", "자산운용", "증권", "컨설팅", "시행사", "건설사", "캐피탈", "은행", "보험사"];

const POINTS = [
  { no: "01", title: "지원 회사·직무 정확히 파악", desc: "회사별(자산운용·증권·캐피탈·시행·건설·컨설팅), 직무별(IB·PF·투자·운용·개발·PM·LM·건설관리)로 세분화된 분석" },
  { no: "02", title: "100명 이상의 실무자 기반 정보", desc: "책·인터넷과는 차원이 다른 실제 현직자의 채용 꿀팁으로 서류와 면접을 정밀 타겟팅" },
  { no: "03", title: "Career Path 설계", desc: "딱딱한 컨설팅이 아닌 동종업계 선배의 조언으로 향후 진로에 대한 고민까지 함께" },
  { no: "04", title: "끝나도 지속되는 인연", desc: "예비 업계 동료인 회원분들께 리얼브릿지만의 강력한 오프라인 네트워킹 기회 제공" },
];

const MENTORS = [
  { name: "멘토 A", company: "부동산 디벨로퍼 대표", background: "전 대기업 종합건설사 부동산개발팀", expertise: "시행사, 건설사, 개발 및 PF" },
  { name: "멘토 B", company: "국내 Top-Tier 대기업 운용사", background: "전 외국계 컨설팅사 재직", expertise: "자산운용사, 펀드 및 리츠, PM, LM" },
  { name: "멘토 C", company: "국내 대기업 계열 운용사", background: "전 외국계 컨설팅사 재직", expertise: "자산운용사, 해외 펀드 투자 및 운용" },
  { name: "멘토 D", company: "국내 Top-Tier 기금운용본부", background: "전 국내 자산운용사 재직", expertise: "기관투자자, 증권사, 인프라 투자 및 운용" },
  { name: "멘토 E", company: "국내 Top-Tier 증권사", background: "국내 부동산 개발·PF·에쿼티 투자 경험", expertise: "증권사, 개발 및 PF 사업수지 분석" },
  { name: "멘토 F", company: "외국계 컨설팅사", background: "Valuation 및 컨설팅 프로젝트 다수", expertise: "재무 모델, 사업수지 분석" },
  { name: "멘토 G", company: "국내 메이저 시행사", background: "공동주택·상업시설 개발 경험 보유", expertise: "시행사, 증권사, 개발 및 PF" },
  { name: "멘토 H", company: "국내 Top-Tier 기금운용본부", background: "전 은행 기업금융팀, 전 증권사", expertise: "기관투자자, 은행, 증권사, 기업금융" },
];

const AUDIENCES = [
  {
    tag: "신입",
    title: "이제 막 취업을 준비하는 분",
    desc: "어디서부터 시작할지 막막하거나, 면접·서류 경험이 거의 없어 기초부터 합격 전략까지 함께 잡고 싶은 취업 준비생",
    icon: (
      <>
        <path d="M22 10L12 5 2 10l10 5 10-5z" stroke="#C06A45" strokeWidth="1.9" strokeLinejoin="round" />
        <path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5" stroke="#C06A45" strokeWidth="1.9" strokeLinecap="round" />
      </>
    ),
  },
  {
    tag: "중고신입",
    title: "직무·회사 이해를 더 높이고 싶은 분",
    desc: "직무는 들어봤지만 핵심은 아직 모호하고, 지원 회사의 실제 정보와 디테일한 자소서·면접 준비가 필요한 분",
    icon: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" stroke="#C06A45" strokeWidth="1.9" />
        <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="#C06A45" strokeWidth="1.9" strokeLinecap="round" />
      </>
    ),
  },
  {
    tag: "경력",
    title: "이직 전 회사를 미리 검증하고 싶은 분",
    desc: "실무 경험은 있지만, 지원 조직의 업무·분위기를 사전에 파악해 후회 없는 이직을 하고 싶은 경력자",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" stroke="#C06A45" strokeWidth="1.9" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M12 12l4-2" stroke="#C06A45" strokeWidth="1.9" strokeLinecap="round" />
      </>
    ),
  },
];

const REVIEWS = [
  { name: "김O님", service: "Real Connect", persona: "신입 · 면접 준비", text: "자소서를 기반으로 한 면접 준비 도움을 받았는데, 제가 뭐가 부족하고 뭘 보완해야 할지 명확히 알게 되어 정말 값진 시간이었습니다. 앞으로의 방향성을 설정하는 데도 큰 도움을 받았습니다. 감사합니다!" },
  { name: "이O님", service: "Real Connect", persona: "신입 · 자소서", text: "객관적으로 보지 못했던 제 자소서의 문제점을 일목요연하게 정리해주셨습니다. 가려웠던 부분들도 정확하게 캐치해서 답변해주시고, 제가 하고 싶었던 업무를 취준생 입장에서 듣기 편하게 설명해주셨어요. 1회를 등록했지만 꿈을 이루기 위해 추가로 더 등록하려 합니다. 함께라면 목표를 달성할 것 같은 느낌이 강하게 듭니다." },
  { name: "박O님", service: "Real Connect", persona: "신입 · 진로 방향", text: "공채가 뜰 때마다 '일단 무작정 다 지원하자'는 막연한 마음이었는데, 컨설팅을 통해 제게 맞는 직무와 진로 방향을 구체적으로 잡을 수 있었습니다. 특히 자기소개서를 어떻게 작성해야 할지 명확히 보이기 시작했습니다. 정말 감사드립니다!" },
  { name: "최O님", service: "Real Connect", persona: "신입 · 면접 대비", text: "코멘트 주신 부분이 면접에서 많이 도움이 되었습니다. 멘토님께서 업계 용어(GP, LP 개념)를 알려주셔서 관심 어필을 할 수 있었어요. 촉박한 일정에도 현업에 계신 분들을 빠르게 연결해주시고 대응도 빨라서 준비 과정에 큰 도움이 됐습니다. 감사드려요!" },
  { name: "정O님", service: "Real Bridge", persona: "중고신입 · 직무 이해", text: "현업 중심의 내용으로 구성되어 실질적인 도움이 됐습니다. 이론적 조언에 그치지 않고 실제 실무 사례를 바탕으로 설명해주어 업무 흐름과 역할을 명확히 이해할 수 있었고, 자기소개서와 경력기술서를 구조적으로 검토해주신 점이 인상 깊었습니다. 단어를 바꾸는 수준을 넘어 전체 맥락과 메시지를 직무와 연결해 피드백해주셨어요." },
  { name: "강O님", service: "Real Bridge", persona: "신입 · 자소서 방향", text: "다소 폐쇄적인 분야라 혼자 준비하며 스스로도 두루뭉술하다고 생각했는데, 1차 멘토링 피드백을 통해 제 경험·성격·관심사를 기반으로 자소서를 어떤 방향으로 써야 할지 파악할 수 있어 만족스러웠습니다. 멘토분들께서 앞으로의 계획과 현업 이야기도 해주셔서 큰 도움이 됐습니다." },
  { name: "윤O님", service: "Real Connect", persona: "타 금융업 재직 · 커리어 전환", text: "타 금융업계 재직자로 부동산 금융 진입을 검토하며 이용했는데, 직장인에게도 정말 값진 시간이었습니다. 멘토 B님께서 제 입장에서 진심으로 공감하며 커리어 로드맵을 프로페셔널하게 설계해주셨고, 어떤 준비를 해야 할지 구체적인 계획까지 함께 고민해주셨습니다. 현업 전문가의 깊이 있는 지식과 경험 덕분에 지름길을 찾은 듯 든든했습니다." },
  { name: "임O님", service: "Real Bridge", persona: "경력 · 직종 전환", text: "늦은 나이에 직종을 전환하게 되어 나이 때문에 서류 탈락하지 않을까 불안했지만, 멘토님을 만나면서 처음으로 서류에 합격했습니다. 제 경험과 성격을 지원 직무에 맞게 방향을 잡아주시고 어필 포인트를 극대화해 자소서를 꼼꼼히 첨삭해주셨고, 면접 준비 때 예상 질문과 팁도 상세히 알려주셨습니다. 부담되는 금액일 수 있지만 그 이상의 가치를 하는 컨설팅입니다." },
  { name: "한O님", service: "Real Bridge", persona: "신입 · 자소서·경력기술서", text: "부동산 취업을 준비하며 받은 컨설팅은 현업 중심이라 실질적인 도움이 됐습니다. 실제 실무 사례를 바탕으로 설명해주어 업무 흐름과 역할을 명확히 이해할 수 있었고, 특히 자기소개서와 경력기술서를 구조적으로 검토해주신 점이 인상 깊었습니다. 제 강점과 개선점을 스스로 점검하며 함께 정리해가는 과정이 좋았습니다." },
];

const NAV_LINKS = [
  { href: "#about", label: "브랜드 소개" },
  { href: "#consulting", label: "컨설팅 개요" },
  { href: "#mentors", label: "멘토진" },
  { href: "#services", label: "서비스" },
  { href: "#audience", label: "서비스 대상" },
  { href: "#success", label: "합격사례" },
];

const NETWORK_WALL = [
  { i: 1, label: "기관투자자 · 은행 · 캐피탈" },
  { i: 2, label: "자산운용 · 리츠 · 신탁" },
  { i: 3, label: "증권" },
  { i: 4, label: "부동산 개발 · 시행 · 건설" },
  { i: 5, label: "부동산 서비스 · 컨설팅 · 회계법인" },
  { i: 6, label: "감정평가법인" },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const N = TICKER.length;
  const PER = 3.2;
  const DUR = PER * N;

  return (
    <div className="w-full overflow-x-hidden bg-white">
      {/* ===== TOP TICKER ===== */}
      <Link
        href="/success"
        className="flex items-stretch overflow-hidden bg-sage text-white no-underline hover:bg-sage-700"
      >
        <span className="z-[2] hidden flex-none items-baseline gap-[7px] border-r border-cream/25 py-[11px] pr-[18px] pl-5 sm:inline-flex">
          <span className="text-[13px] font-extrabold tracking-[-0.01em] text-cream">Real Bridge</span>
          <span className="text-[12px] font-semibold text-white/60">컨설팅 실제 성과</span>
        </span>
        <span className="relative h-[42px] flex-1 overflow-hidden">
          {TICKER.map((t, i) => (
            <span
              key={i}
              className="rb-vroll-item"
              style={{ animation: `rbvroll ${DUR}s linear infinite`, animationDelay: `${-DUR + i * PER}s` }}
            >
              <span className="inline-flex items-center gap-[9px] text-[13.5px] font-bold whitespace-nowrap text-white">
                <span className="h-[6px] w-[6px] flex-none rounded-full bg-gold" />
                {t}
              </span>
            </span>
          ))}
        </span>
        <span className="z-[2] my-[6px] mr-[10px] ml-2 inline-flex flex-none items-center gap-[6px] rounded-full bg-cream px-4 py-2 text-[12.5px] font-extrabold text-sage shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
          <span className="hidden sm:inline">합격 사례 자세히 보기</span>
          <span className="sm:hidden">합격 사례</span>
          <Arrow color="#2F3A2E" size={14} w={2.4} />
        </span>
      </Link>

      {/* ===== NAV ===== */}
      <nav className="sticky top-0 z-[60] border-b border-line bg-white/90 backdrop-blur-[12px]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-5 px-6 py-[15px]">
          <a href="#home" className="flex items-center gap-[11px] no-underline">
            <BrandMark className="h-[30px] w-[34px]" />
            <span className="text-[19px] font-extrabold tracking-[-0.02em] text-ink">REal BridgE</span>
          </a>
          <div className="hidden items-center gap-[26px] lg:flex">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-[14.5px] font-semibold text-muted-2 no-underline hover:text-terracotta">
                {l.label}
              </a>
            ))}
            <span className="h-[15px] w-px bg-line" />
            <Link href="/login" className="text-[14.5px] font-semibold text-muted-2 no-underline hover:text-ink">
              로그인
            </Link>
            <Link href="/contact" className="rounded-full bg-sage px-5 py-[10px] text-[14.5px] font-bold text-white no-underline hover:bg-sage-600">
              문의하기
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink lg:hidden"
            aria-label="메뉴 열기"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-line bg-white px-6 py-4 lg:hidden">
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="text-[15px] font-semibold text-muted-2 no-underline">
                  {l.label}
                </a>
              ))}
              <div className="mt-2 flex gap-3">
                <Link href="/login" className="rounded-full border border-line px-5 py-[10px] text-[14px] font-bold text-muted-2 no-underline">
                  로그인
                </Link>
                <Link href="/contact" className="rounded-full bg-sage px-5 py-[10px] text-[14px] font-bold text-white no-underline">
                  문의하기
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <section id="home" className="bg-ivory px-6 pt-24 pb-[88px]">
        <div className="mx-auto grid max-w-[1200px] items-center gap-14 lg:grid-cols-2">
          <div style={{ animation: "rbup .6s ease both" }}>
            <span className="inline-flex items-center rounded-full border border-terracotta/30 bg-white px-[15px] py-[7px] text-[12.5px] font-bold tracking-[0.02em] text-terracotta">
              부동산 · 금융업 취업의 지름길
            </span>
            <h1 className="mt-[22px] text-[40px] leading-[1.16] font-extrabold tracking-[-0.03em] text-ink md:text-[52px]">
              현직자가 직접 알려주는
              <br />
              <span className="text-terracotta">취업 전략 컨설팅</span>
            </h1>
            <p className="mt-[22px] max-w-[520px] text-[18px] leading-[1.7] text-muted-2">
              REal BridgE는 <strong className="font-bold text-sage">부동산·금융업 출신 현직자</strong>가 기획한 플랫폼입니다. 단순한 스펙이 아닌 회사가 원하는 인재상과 핵심 역량을 타겟팅하여 <strong className="font-bold text-sage">합격으로 이끕니다.</strong>
            </p>
            <div className="mt-[34px] flex flex-wrap gap-3">
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-sage px-7 py-[15px] text-[16px] font-bold text-white no-underline hover:bg-sage-600">
                무료 상담 신청 <Arrow />
              </Link>
              <Link href="/success" className="inline-flex items-center gap-2 rounded-full border border-terracotta/40 bg-white px-7 py-[15px] text-[16px] font-bold text-terracotta no-underline hover:bg-sand">
                <StarG size={17} /> 합격후기 보러가기
              </Link>
            </div>
          </div>
          <div className="relative" style={{ animation: "rbup .6s ease .15s both" }}>
            <div className="rounded-[20px] border border-line bg-white p-8 shadow-[0_18px_44px_rgba(47,58,46,0.08)]">
              <div className="grid grid-cols-2 gap-[22px]">
                {[
                  ["100+", "현직 멘토"],
                  ["95%", "합격률"],
                  ["12+", "업종 커버리지"],
                  ["5.0", "만족도"],
                ].map(([v, l]) => (
                  <div key={l} className="text-center">
                    <div className="text-[38px] font-extrabold tracking-[-0.02em] text-sage">{v}</div>
                    <div className="mt-1 text-[13.5px] text-soft-2">{l}</div>
                  </div>
                ))}
              </div>
              <div className="mt-[26px] flex items-center gap-3 border-t border-line pt-[22px]">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-sand text-terracotta">
                  <Chk color="#C06A45" size={19} w={2.6} />
                </span>
                <p className="text-[14.5px] font-semibold text-[#4A4234]">100% 현직자 멘토와의 1:1 맞춤형 컨설팅</p>
              </div>
              <p className="mt-4 text-[11px] leading-[1.6] text-soft-3">※ 합격률·만족도는 자체 수강생 응답을 기준으로 집계한 수치입니다.</p>
            </div>
            <div className="absolute -right-[10px] -bottom-[18px] flex items-center gap-[9px] rounded-[14px] border border-line bg-white px-[15px] py-[11px] shadow-[0_10px_26px_rgba(47,58,46,0.1)]">
              <StarG size={19} />
              <div>
                <div className="text-[13.5px] font-extrabold text-ink">만족도 5.0/5.0</div>
                <div className="text-[11.5px] text-soft-2">실제 고객 후기 기준</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead eyebrow="ABOUT" title="REal BridgE는 무엇이 다른가요?" lead="부동산·금융업 출신 현직자가 기획한 플랫폼으로, 실제 채용 구조를 기반으로 전략적인 컨설팅을 제공합니다." />
          <div className="mx-auto mt-[52px] flex max-w-[1000px] flex-wrap overflow-hidden rounded-[20px] border border-line">
            <div className="flex flex-[1_1_340px] items-center bg-[linear-gradient(160deg,#2F3A2E,#3B4636)] px-10 py-12">
              <div>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="#E7A07C" opacity="0.5">
                  <path d="M7 7h4v4c0 3-2 5-5 5v-2c2 0 3-1 3-3H7zM15 7h4v4c0 3-2 5-5 5v-2c2 0 3-1 3-3h-2z" />
                </svg>
                <div className="mt-[14px] text-[33px] leading-[1.34] font-extrabold tracking-[-0.02em] text-white">
                  스펙이 아니라,
                  <br />
                  <span className="text-terracotta-soft">방향</span>입니다
                </div>
                <p className="mt-5 text-[15px] leading-[1.72] text-white/70">합격을 가르는 건 준비의 양이 아니라, 어디를 어떻게 겨냥하느냐입니다. 현직자가 그 방향을 함께 찾습니다.</p>
              </div>
            </div>
            <div className="flex-[2_1_460px] p-11">
              <h3 className="text-[24px] leading-[1.4] font-extrabold tracking-[-0.02em] text-ink">
                고객을 분석하여 <span className="text-terracotta">진정한 취업 동반자</span>가 되겠습니다
              </h3>
              <p className="mt-4 text-[15.5px] leading-[1.75] text-muted-2">리얼브릿지는 고객의 성향·특성·스펙·백그라운드를 분석한 뒤 지원 가능 직무를 타겟팅하고 그에 맞는 지원 전략을 제시합니다. 또한 향후 커리어를 전략적으로 설계하여, 일회성 취업이 아닌 고객의 커리어 플랜을 함께 고민하는 동반자가 되려 합니다.</p>
              <div className="mt-[22px] flex flex-wrap gap-2">
                {ABOUT_TAGS.map((t) => (
                  <span key={t} className="rounded-full bg-sand px-[13px] py-[6px] text-[13.5px] font-semibold text-terracotta">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONSULTING ===== */}
      <section id="consulting" className="bg-ivory px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead eyebrow="WHY REal BridgE" title="왜 REal BridgE인가?" lead="AI가 모든 것을 대체하는 시대, 진정한 현직자의 조언이 필요한 이유." />
          <div className="mx-auto mt-[52px] grid max-w-[1000px] gap-6 md:grid-cols-2">
            {/* 한계 */}
            <div className="rounded-[20px] border border-line bg-white p-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sand-rose">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#C4573E" strokeWidth="2.4" strokeLinecap="round" /></svg>
              </span>
              <h3 className="mt-5 text-[20px] font-extrabold text-ink">일반적인 취업컨설팅의 한계</h3>
              <ul className="mt-4 flex list-none flex-col gap-3 p-0">
                {[
                  "인사담당자 출신의 대기업 채용 프로세스 기반 단순 첨삭",
                  "지원 업계 현직자가 아니어서 일반적인 답변만 제공",
                  "AI툴로 쉽게 쓰는 이력서·암기식 면접 답변의 한계",
                  "부동산/금융업 특유의 채용 구조(소규모·비공개) 이해 부족",
                ].map((t) => (
                  <li key={t} className="flex gap-[9px] text-[14.5px] leading-[1.6] text-soft">
                    <span className="mt-[9px] h-[5px] w-[5px] flex-none rounded-full bg-[#C9BFAC]" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            {/* 차별화 */}
            <div className="rounded-[20px] border border-terracotta/[0.28] bg-sand p-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-terracotta text-white">
                <Chk color="#fff" size={19} w={2.6} />
              </span>
              <h3 className="mt-5 text-[20px] font-extrabold text-ink">REal BridgE의 차별화된 접근</h3>
              <ul className="mt-4 flex list-none flex-col gap-3 p-0">
                {[
                  "부동산/금융업 현직자 100명+의 생생한 업계 경험·노하우",
                  "채용공고에 드러나지 않는 핵심 역량·직무 인사이트 안내",
                  "지원 직무의 선호 인재상·핵심 역량 타겟팅 전략",
                  "실무에 바로 투입 가능한 역량 개발 맞춤 전략",
                ].map((t) => (
                  <li key={t} className="flex gap-[9px] text-[14.5px] leading-[1.6] font-medium text-muted">
                    <Chk color="#C06A45" size={17} w={2.6} />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-[12px] border border-line bg-white p-4">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#C06A45" opacity="0.6"><path d="M7 7h4v4c0 3-2 5-5 5v-2c2 0 3-1 3-3H7zM15 7h4v4c0 3-2 5-5 5v-2c2 0 3-1 3-3h-2z" /></svg>
                <p className="mt-2 text-[14px] leading-[1.65] text-muted-2">지원하는 부서가 강조하는 직무 역량을 갖춘, 직무 이해도가 높은 인재를 채용하려 합니다. <strong className="font-bold text-sage">스펙은 최종 합격을 가르는 핵심 요소가 아닙니다.</strong></p>
              </div>
            </div>
          </div>

          {/* 해결해주는 문제 */}
          <div className="mx-auto mt-11 max-w-[1000px] overflow-hidden rounded-[20px] border border-line bg-white">
            <div className="border-b border-line px-8 py-5">
              <h3 className="text-center text-[20px] font-extrabold text-ink">REal BridgE가 해결해주는 문제</h3>
            </div>
            <div className="grid gap-8 p-8 md:grid-cols-2">
              <div className="flex flex-col gap-[18px]">
                {[
                  { n: "1", rose: true, t: "국내오피스 실물 투자에 주력하는 자산운용사 투자팀 면접에서 데이터센터 투자 경험을 강조하면 어떨까요?" },
                  { n: "2", rose: true, t: "지방 자산에 수시로 방문해 운전이 필수인 물류센터 자산관리팀에, 운전면허가 없는 분이 지원하면 어떨까요?" },
                  { n: "3", rose: false, t: "채용공고엔 없지만 해외 투자자가 주요 고객인 팀이라면? 영어·글로벌 역량을 적극 어필하면 같은 스펙의 경쟁자보다 합격 가능성이 높아집니다." },
                ].map((p) => (
                  <div key={p.n} className="flex gap-3">
                    <span className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-[14px] font-extrabold ${p.rose ? "bg-sand-rose text-[#C4573E]" : "bg-sand text-terracotta"}`}>{p.n}</span>
                    <p className="text-[14px] leading-[1.6] text-muted-2">{p.t}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-[14px] border border-terracotta/[0.22] bg-sand p-6">
                <div className="text-[17px] font-extrabold text-terracotta">REal BridgE의 해결책</div>
                <p className="mt-3 text-[14px] leading-[1.7] text-muted-2">채용공고에는 드러나지 않지만 합격을 가르는 결정적 요소를 — 탈락 사유부터 합격을 높이는 어필 포인트까지 — 현직자의 경험을 바탕으로 미리 짚어 대비합니다. 지원 직무를 정확히 이해해 이력서·면접 준비 시간을 훨씬 효율적으로 씁니다.</p>
              </div>
            </div>
          </div>

          {/* 4 강점 */}
          <div className="mx-auto mt-[52px] grid max-w-[1100px] gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
            {POINTS.map((p) => (
              <div key={p.no} className="rounded-[16px] border border-line bg-white p-6 transition-colors hover:border-sage/30">
                <div className="text-[28px] font-extrabold text-terracotta/85">{p.no}</div>
                <h3 className="mt-[10px] text-[16px] leading-[1.4] font-extrabold text-ink">{p.title}</h3>
                <p className="mt-2 text-[13.5px] leading-[1.6] text-soft">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MENTORS ===== */}
      <section id="mentors" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead eyebrow="MENTORS" title="REal BridgE 대표 멘토진" lead="업계 대표 회사 현직자들이 여러분의 커리어 성장을 위해 아낌없이 조언합니다." />
          <div className="mx-auto mt-[52px] grid max-w-[1100px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MENTORS.map((m) => (
              <div key={m.name} className="rounded-[16px] border border-line bg-white p-6 text-center transition-colors hover:border-sage/30">
                <div className="mx-auto flex h-[60px] w-[60px] items-center justify-center rounded-full bg-sand">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#C89B7B" strokeWidth="1.8" /><path d="M4.5 20c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6" stroke="#C89B7B" strokeWidth="1.8" strokeLinecap="round" /></svg>
                </div>
                <div className="mt-3 text-[16px] font-extrabold text-ink">{m.name}</div>
                <div className="mt-[5px] text-[13.5px] font-bold text-terracotta">{m.company}</div>
                <div className="mt-2 text-[13px] leading-[1.55] text-muted-2">{m.background}</div>
                <div className="mt-[14px] border-t border-line-2 pt-[14px]">
                  <div className="text-[10.5px] font-extrabold tracking-[0.06em] text-soft-3">전문 분야</div>
                  <div className="mt-[7px] rounded-[9px] bg-sand px-[11px] py-[9px] text-[13px] leading-[1.5] font-semibold text-sage">{m.expertise}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 네트워크 로고월 */}
          <div className="mx-auto mt-[52px] max-w-[1000px] rounded-[20px] border border-line bg-ivory p-10 text-center">
            <div className="text-[40px] font-extrabold tracking-[-0.02em] text-sage">100+</div>
            <h3 className="mt-[6px] text-[21px] font-extrabold text-ink">업계 전문가 네트워크</h3>
            <p className="mx-auto mt-3 max-w-[620px] text-[14.5px] leading-[1.7] text-muted-2">기관투자자·자산운용사·증권사·시행사·건설사·국내외 컨설팅사 등 부동산/금융업의 내로라하는 회사에 재직 중인 100명 이상의 멘토진이 상시 대기하고 있습니다.</p>
            <div className="mt-7 flex flex-col gap-[14px]">
              {NETWORK_WALL.map((w) => (
                <div key={w.i} className="rounded-[14px] border border-line bg-white px-5 py-7 md:px-8 md:py-11">
                  <div className="text-center">
                    <span className="inline-block rounded-full bg-sand px-[13px] py-[5px] text-[12px] font-bold tracking-[0.02em] text-terracotta">{w.label}</span>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/logos/network-wall/slide${w.i}.png`}
                    alt={`${w.label} 기업 로고`}
                    className="mx-auto mt-6 block h-auto w-full max-w-[820px] md:mt-8"
                  />
                </div>
              ))}
            </div>
            <p className="mt-5 text-left text-[11.5px] leading-[1.6] text-soft-3">※ 상기 기업은 리얼브릿지가 네트워킹을 통해 확보한 멘토들의 전·현직 소속 기준이며, 해당 기업과의 제휴·후원 관계를 의미하지 않습니다.</p>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="services" className="bg-ivory px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead eyebrow="SERVICES" title="REal BridgE 서비스" lead="상황에 맞는 최적의 컨설팅 패키지를 선택하세요. (모든 금액 VAT 포함)" />
          <div className="mx-auto mt-14 grid max-w-[1080px] items-start gap-5 lg:grid-cols-3">
            <PriceCard
              name="Real Connect"
              sub="대면 컨설팅 60분 1회"
              price="40만원"
              items={[
                "입사지원서 컨설팅 or 면접 준비 컨설팅(택1)",
                "지원 직무·업계 현직자 관점의 컨설팅",
                "필요 부분 수정, 방향성 제시, 어필 포인트 제시",
                "채용공고에 드러나지 않는 핵심 역량·준비 방향 안내",
                "업계 연봉 수준·복지 등 현직자 관점의 정보 안내",
              ]}
            />
            <PriceCard
              featured
              name="Real Bridge"
              sub="대면 컨설팅 90분 3회"
              price="95만원"
              items={[
                "입사지원서·면접·커리어 단계적 컨설팅",
                "지원 직무·업계 현직자 관점의 컨설팅",
                "직무별 마스터 자소서 및 면접 예상 질문 제공",
                "현직자 경험을 바탕으로 한 직무·업계 동향 제공",
                "채용 동향 및 추천 직무 안내",
                "직무 역량 개발을 위한 학습 자료 제공",
              ]}
            />
            <PriceCard
              name="Real Success"
              sub="대면 컨설팅 90분 5회"
              price="145만원"
              items={[
                "Real Bridge의 모든 혜택 포함",
                "타 지원자와 Grouping으로 객관적 위치 파악",
                "합격 사례 및 정보 제공(자소서·면접)",
                "대규모 네트워킹 모임 참여 기회",
                "현직자 네트워킹을 통한 직무·업계 정보 제공",
                "직무에 필요한 Skill-up 자료 제공",
              ]}
            />
          </div>
          <div className="mx-auto mt-11 max-w-[680px] rounded-[18px] border border-terracotta/25 bg-sand p-7 text-center">
            <p className="text-[17px] leading-[1.6] text-[#4A4234]">서비스 금액은 취업 성공 시 받게 되는 <strong className="font-extrabold text-sage">첫 월급의 일부 수준</strong>입니다.</p>
            <p className="mt-1.5 text-[17px] leading-[1.6]"><strong className="font-extrabold text-terracotta">평생의 커리어를 위한 투자</strong>를 시작하세요.</p>
          </div>
        </div>
      </section>

      {/* ===== AUDIENCE ===== */}
      <section id="audience" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead eyebrow="FOR YOU" title="어떤 서비스가 나에게 적합할까요?" lead="신입 · 중고신입 · 경력, 단계별로 꼭 맞는 컨설팅을 제안해드립니다." />
          <div className="mx-auto mt-[52px] grid max-w-[1080px] gap-5 md:grid-cols-3">
            {AUDIENCES.map((a) => (
              <div key={a.tag} className="flex flex-col items-center rounded-[20px] border border-line bg-white p-8 text-center transition-colors hover:border-sage/30">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sand">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">{a.icon}</svg>
                </span>
                <span className="mt-[18px] rounded-full bg-sage px-[14px] py-[5px] text-[12px] font-extrabold text-white">{a.tag}</span>
                <h3 className="mt-3 text-[17px] leading-[1.4] font-extrabold text-ink">{a.title}</h3>
                <p className="mt-2 text-[14px] leading-[1.65] text-soft">{a.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-11 text-center">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-sage px-[30px] py-[15px] text-[16px] font-bold text-white no-underline hover:bg-sage-600">
              나에게 맞는 서비스 상담받기 <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section id="success" className="bg-ivory px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHead eyebrow="REVIEWS" title="REal BridgE 컨설팅 후기" lead="합격 후기부터 상담 후기까지, 실제 고객님들이 남겨주신 생생한 이야기입니다." />

          <div className="mx-auto mt-9 flex max-w-[560px] flex-wrap items-center justify-center gap-[22px] rounded-[18px] border border-line bg-white px-[30px] py-[22px]">
            <div className="flex items-center gap-3">
              <span className="text-[44px] leading-none font-extrabold tracking-[-0.02em] text-ink">5.0</span>
              <div>
                <Stars size={18} />
                <div className="mt-[5px] text-[13px] text-soft">전체 리뷰 평점</div>
              </div>
            </div>
            <span className="h-11 w-px bg-line-2" />
            <div className="text-center">
              <div className="text-[26px] font-extrabold text-sage">100%</div>
              <div className="mt-0.5 text-[13px] text-soft">추천 만족도</div>
            </div>
          </div>

          <div className="rb-review-wall mx-auto mt-[34px] max-w-[1120px]">
            {REVIEWS.map((r, i) => (
              <div key={i} className="mb-[18px] break-inside-avoid rounded-[16px] border border-line bg-white p-6">
                <div className="flex items-center gap-[11px]">
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-extrabold text-ink">{r.name}</div>
                    <div className="mt-[3px]">
                      <Stars size={13} />
                    </div>
                  </div>
                  <span className="flex-none self-start rounded-full bg-sand px-[10px] py-[3px] text-[11px] font-bold text-terracotta">{r.service}</span>
                </div>
                <p className="mt-[15px] text-[14px] leading-[1.75] text-muted">{r.text}</p>
                <div className="mt-[14px] text-[12px] text-soft-3">{r.persona}</div>
              </div>
            ))}
          </div>

          <div className="mt-3 text-center">
            <Link href="/success" className="inline-flex items-center gap-[9px] rounded-full bg-sage px-8 py-[15px] text-[16px] font-bold text-white no-underline hover:bg-sage-600">
              합격 후기 자세히 보기 <Arrow />
            </Link>
          </div>

          <div className="mx-auto mt-[52px] max-w-[720px] text-center">
            <div className="text-[40px] font-extrabold tracking-[-0.02em] text-sage">12+</div>
            <h3 className="mt-[6px] text-[21px] font-extrabold text-ink">다양한 부동산·금융 기관 합격 사례</h3>
            <p className="mx-auto mt-3 max-w-[600px] text-[14px] leading-[1.7] text-soft">신세계프라퍼티, NAI Korea, 한국투자신탁운용, 코람코자산신탁, 롯데AMC, ARA Korea, MDM, 이화자산운용, IFC Seoul, MG새마을금고자산관리 외 다수</p>
            <Link href="/contact" className="mt-[22px] inline-flex items-center gap-[7px] text-[15px] font-bold text-sage no-underline hover:text-terracotta">
              나의 합격 스토리 만들기 <Arrow color="currentColor" size={16} />
            </Link>
            <p className="mx-auto mt-[26px] max-w-[620px] text-[11.5px] leading-[1.6] text-soft-3">※ 합격 사례는 실제 수강생의 합격 결과를 바탕으로 하며, 언급된 기업명은 사실 적시를 위한 것으로 해당 기업과의 제휴·후원·보증 관계를 의미하지 않습니다.</p>
          </div>
        </div>
      </section>

      {/* ===== CONTACT CTA ===== */}
      <section id="contact" className="bg-sage px-6 py-24">
        <div className="mx-auto max-w-[760px] text-center">
          <h2 className="text-[40px] leading-[1.25] font-extrabold tracking-[-0.03em] text-white">지금 바로 시작하세요</h2>
          <p className="mx-auto mt-[18px] max-w-[560px] text-[18px] leading-[1.7] text-white/75">부동산·금융업 취업의 지름길. 현직자와의 1:1 맞춤형 컨설팅으로 합격으로 가는 교두보를 만들어 드립니다.</p>
          <div className="mt-[34px] flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-white px-[30px] py-[15px] text-[16px] font-bold text-sage no-underline hover:bg-sand">
              무료 상담 신청하기 <Arrow color="#2F3A2E" />
            </Link>
            <Link href="/contact" className="inline-flex items-center rounded-full border border-white/30 bg-transparent px-[30px] py-[15px] text-[16px] font-bold text-white no-underline hover:bg-white/10">
              카카오톡 채널 문의
            </Link>
          </div>
          <div className="mt-11 border-t border-white/15 pt-8">
            <div className="text-[18px] font-extrabold text-white">REal BridgE (REBE)</div>
            <p className="mt-1.5 text-[14px] text-white/60">부동산·금융업 취업 컨설팅의 새로운 표준</p>
            <p className="mt-2 text-[14px] text-white/50">boopro.official@gmail.com · 02-541-8248</p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <SiteFooterFull />
    </div>
  );
}

/* ===== 공용 서브 컴포넌트 ===== */
function SectionHead({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <div className="mx-auto max-w-[660px] text-center">
      <span className="text-[13px] font-extrabold tracking-[0.1em] text-terracotta">{eyebrow}</span>
      <h2 className="mt-3 text-[30px] leading-[1.28] font-extrabold tracking-[-0.03em] text-ink md:text-[38px]">{title}</h2>
      <p className="mt-4 text-[17px] leading-[1.65] text-muted-2">{lead}</p>
    </div>
  );
}

function PriceCard({
  name,
  sub,
  price,
  items,
  featured = false,
}: {
  name: string;
  sub: string;
  price: string;
  items: string[];
  featured?: boolean;
}) {
  if (featured) {
    return (
      <div className="relative flex flex-col rounded-[20px] bg-sage p-8 shadow-[0_22px_50px_rgba(47,58,46,0.28)]">
        <span className="absolute -top-[13px] left-1/2 -translate-x-1/2 rounded-full bg-terracotta px-4 py-1.5 text-[12px] font-extrabold whitespace-nowrap text-white">인기 패키지</span>
        <div className="text-[20px] font-extrabold text-white">{name}</div>
        <div className="mt-1 text-[13.5px] text-white/65">{sub}</div>
        <div className="mt-[18px] flex items-baseline gap-1.5">
          <span className="text-[36px] font-extrabold text-white">{price}</span>
          <span className="text-[11.5px] text-white/50">VAT 포함</span>
        </div>
        <ul className="mt-[22px] flex flex-1 list-none flex-col gap-[11px] p-0">
          {items.map((it) => (
            <li key={it} className="flex gap-2 text-[14px] leading-[1.55] text-white/[0.88]">
              <Chk color="#E7C9A6" size={16} w={2.6} />
              {it}
            </li>
          ))}
        </ul>
        <Link href="/contact" className="mt-6 inline-flex items-center justify-center gap-[7px] rounded-full bg-white py-[13px] text-[14px] font-bold text-sage no-underline hover:bg-sand">
          이 패키지로 상담받기 <Arrow color="#2F3A2E" size={15} />
        </Link>
      </div>
    );
  }
  return (
    <div className="flex flex-col rounded-[20px] border border-line bg-white p-8">
      <div className="text-[20px] font-extrabold text-ink">{name}</div>
      <div className="mt-1 text-[13.5px] text-soft-2">{sub}</div>
      <div className="mt-[18px] flex items-baseline gap-1.5">
        <span className="text-[36px] font-extrabold text-ink">{price}</span>
        <span className="text-[11.5px] text-soft-3">VAT 포함</span>
      </div>
      <ul className="mt-[22px] flex flex-1 list-none flex-col gap-[11px] p-0">
        {items.map((it) => (
          <li key={it} className="flex gap-2 text-[14px] leading-[1.55] text-muted-2">
            <Chk color="#C06A45" size={16} w={2.6} />
            {it}
          </li>
        ))}
      </ul>
      <Link href="/contact" className="mt-6 inline-flex items-center justify-center gap-[7px] rounded-full bg-sage py-[13px] text-[14px] font-bold text-white no-underline hover:bg-sage-600">
        이 패키지로 상담받기 <Arrow size={15} />
      </Link>
    </div>
  );
}

/** 홈 전용 풀 푸터 (아이보리 배경, 4열 + 사업자 정보) */
export function SiteFooterFull() {
  return (
    <footer className="border-t border-line bg-ivory px-6 pt-14 pb-10 text-muted-2">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div>
            <div className="flex items-center gap-[10px]">
              <BrandMark className="h-[26px] w-[30px]" />
              <BrandWordmark className="text-[18px] text-ink" />
            </div>
            <p className="mt-[14px] max-w-[280px] text-[13.5px] leading-[1.7] text-soft">부동산·금융업 출신 현직자가 기획한 취업 전략 컨설팅. 당신의 커리어와 현장을 잇습니다.</p>
          </div>
          <div>
            <div className="text-[14px] font-extrabold text-ink">바로가기</div>
            <div className="mt-4 flex flex-col gap-[9px]">
              <a href="/#about" className="text-[13.5px] text-soft no-underline hover:text-terracotta">브랜드 소개</a>
              <a href="/#mentors" className="text-[13.5px] text-soft no-underline hover:text-terracotta">멘토진</a>
              <a href="/#success" className="text-[13.5px] text-soft no-underline hover:text-terracotta">합격사례</a>
              <Link href="/contact" className="text-[13.5px] text-soft no-underline hover:text-terracotta">상담신청</Link>
            </div>
          </div>
          <div>
            <div className="text-[14px] font-extrabold text-ink">컨설팅 서비스</div>
            <div className="mt-4 flex flex-col gap-[9px]">
              <a href="/#services" className="text-[13.5px] text-soft no-underline hover:text-terracotta">Real Connect</a>
              <a href="/#services" className="text-[13.5px] text-soft no-underline hover:text-terracotta">Real Bridge</a>
              <a href="/#services" className="text-[13.5px] text-soft no-underline hover:text-terracotta">Real Success</a>
            </div>
          </div>
          <div>
            <div className="text-[14px] font-extrabold text-ink">문의</div>
            <div className="mt-4 flex flex-col gap-[11px] text-[13.5px] text-soft">
              <span className="flex gap-2"><svg className="mt-px flex-none" width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#A79D8B" strokeWidth="1.8" /><path d="M4 7l8 6 8-6" stroke="#A79D8B" strokeWidth="1.8" /></svg>boopro.official@gmail.com</span>
              <span className="flex gap-2"><svg className="mt-px flex-none" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L16 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" stroke="#A79D8B" strokeWidth="1.8" strokeLinejoin="round" /></svg>02-541-8248</span>
              <span className="flex gap-2"><svg className="mt-px flex-none" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11z" stroke="#A79D8B" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="12" cy="10" r="2.4" stroke="#A79D8B" strokeWidth="1.8" /></svg>서울시 송파구 중대로 135, 11층 (가락동, 아이티벤처타워)</span>
              <span className="flex gap-2"><svg className="mt-px flex-none" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#A79D8B" strokeWidth="1.8" /><path d="M12 7v5l3 2" stroke="#A79D8B" strokeWidth="1.8" strokeLinecap="round" /></svg>평일 09:00 - 18:00</span>
            </div>
          </div>
        </div>
        <div className="mt-11 border-t border-line pt-7 text-[11.5px] leading-[1.7] text-soft-3">
          <p>상호: 부프로 · 대표: 엄은혜 · 사업자등록번호: 537-59-00849</p>
          <p className="mt-[3px]">주소: 서울시 송파구 중대로 135, 11층 송파ICT청년창업지원센터(가락동, 아이티벤처타워)</p>
          <p className="mt-[3px]">전화: 02-541-8248 · 이메일: boopro.official@gmail.com</p>
          <p className="mt-4">© 2026 REal BridgE. All rights reserved. 합격 후기는 실제 고객의 경험을 바탕으로 작성되었습니다.</p>
        </div>
      </div>
    </footer>
  );
}
