"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandMark, BrandWordmark } from "@/components/icons";

function Arrow({ color = "#fff", size = 17, w = 2.2 }: { color?: string; size?: number; w?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function StarG({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#E8A63C" aria-hidden="true">
      <path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z" />
    </svg>
  );
}
function Stars({ size = 16 }: { size?: number }) {
  return (
    <span className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <StarG key={i} size={size} />
      ))}
    </span>
  );
}

type Story = {
  company: string;
  logo: string;
  logoH?: number;
  logoW?: number;
  name: string;
  persona: string;
  service: "Real Connect" | "Real Bridge" | "Real Success";
  before: string;
  after: string;
  quote: string;
  paragraphs: string[];
  tags: string[];
};

const STORIES: Story[] = [
  {
    company: "신세계프라퍼티", logo: "shinsegae.png", name: "김O은 님", persona: "미대 전공 · 경력 이직", service: "Real Success",
    before: "타 업계 디자인 경력 3년", after: "신세계프라퍼티 기획팀",
    quote: "비전공에 정보도 없던 제가, 방향을 잡으니 합격까지 왔습니다",
    paragraphs: [
      "부동산은 잘 모르는 업계인데다 회사 정보도 많이 공개돼 있지 않아 처음엔 정말 막막했습니다. 어디서부터 준비해야 할지 감이 없었는데, 첫 상담에서 제 디자인 경력 중 어떤 부분이 기획 직무와 연결되는지 짚어주셔서 방향이 잡혔습니다.",
      "자소서와 포트폴리오, 경력기술서를 함께 다듬으면서 제가 어필할 수 있는 포인트를 구체적으로 찾아주셨고, 어색한 문장은 하나하나 컨펌해 주셨습니다. 혼자 썼다면 절대 보지 못했을 관점이었어요.",
      "현직자만 아는 팀 분위기와 실제 업무 이야기를 들으며 면접도 자신 있게 준비할 수 있었고, 결과적으로 원하던 기획팀에 합격했습니다.",
    ],
    tags: ["자소서 방향성", "포트폴리오 첨삭", "직무 연결 전략"],
  },
  {
    company: "NAI Korea", logo: "nai-korea.png", name: "이O진 님", persona: "미대 전공 · 신입 취업", service: "Real Success",
    before: "비전공 취업 준비생", after: "NAI Korea Capital Market",
    quote: "혼자였다면 절대 몰랐을 정보들이 합격을 만들었습니다",
    paragraphs: [
      "취준생 입장에서 적지 않은 금액이라 고민이 많았지만, 결과적으로 그만한 가치가 충분했습니다. 스펙 진단부터 자소서 첨삭, 직무·기업 공고 추천, 네트워크 기반 정보까지 세 영역 모두 꼼꼼했습니다.",
      "비전공자라 불리하다고만 생각했는데, 오히려 제 배경을 어떻게 강점으로 풀어낼지 함께 설계해 주셨습니다. 자신감이 완전히 달라졌어요.",
      "지원 회사의 실제 분위기와 업무 강도까지 현직자 관점에서 들을 수 있어, 면접에서 진심이 담긴 답변을 할 수 있었습니다.",
    ],
    tags: ["스펙 진단", "기업 공고 추천", "현직자 정보"],
  },
  {
    company: "이화자산운용", logo: "ewha-am.jpg", logoH: 58, logoW: 150, name: "서O님", persona: "대학생 · 신입 취업", service: "Real Bridge",
    before: "취업 준비 대학생", after: "이화자산운용 대체투자팀",
    quote: "회사가 원하는 '진짜' 직무 역량이 무엇인지 파악할 수 있었습니다",
    paragraphs: [
      "취준생으로서 막연하고 불안하던 시기에, 이 멘토링을 통해 방향성을 잡을 수 있었고 회사에서 원하는 '진짜' 직무 역량이 무엇인지 파악할 수 있었습니다. 그 결과 멘토링 이후 지원한 4개의 AM사와 PM사에서 모두 최종면접까지 진행했으며, 목표로 했던 부동산 자산운용사에 최종합격할 수 있었습니다. 금전적인 부담이 될 수 있지만, 돌아보면 그 이상의 값어치가 있는 멘토링이라고 생각합니다.",
      "멘토님의 넓은 네트워킹 능력을 바탕으로 실제 지원하는 회사의 실무자분들과 연결될 수 있었고, 현장의 생생한 정보와 조언을 들을 수 있었습니다. 네이버 카페나 금융투자협회에 올라오는 채용공고의 두루뭉술한 내용을 구체화해 이해함으로써, 해당 직무에 핏한 역량이 무엇인지 정확하게 구분하여 정리할 수 있었습니다.",
      "자소서 작성과 면접 준비에서도 제가 가진 경험과 배경을 바탕으로 어떤 강점을 어필해야 할지 꼼꼼하게 피드백해주셔서 큰 도움을 받았습니다. 진심으로 감사합니다!",
    ],
    tags: ["직무 역량 파악", "현직자 연결", "자소서·면접 피드백"],
  },
  {
    company: "한국투자신탁운용", logo: "kitc.png", name: "박O호 님", persona: "공대 전공 · 재학생", service: "Real Connect",
    before: "대학교 3학년 재학생 (유관학과 아님)", after: "한국투자신탁운용 인턴",
    quote: "지금 무엇을 더 쌓아야 하는지 명확해졌습니다",
    paragraphs: [
      "재학생이라 방향성 위주로 상담을 받았는데, 시간에 쫓기지 않고 자유로운 분위기에서 진행돼 편하게 많은 걸 여쭤볼 수 있었습니다.",
      "유관학과가 아니어서 정보가 부족했는데, 모의 자소서와 포트폴리오를 함께 보며 지금 어떤 경험과 스펙을 더하면 좋을지 구체적으로 짚어주셨습니다.",
      "덕분에 남은 학기 동안 무엇에 집중해야 할지 계획이 섰고, 목표하던 회사의 인턴으로 먼저 발을 들일 수 있었습니다.",
    ],
    tags: ["방향성 진단", "모의 자소서", "스펙 로드맵"],
  },
  {
    company: "코람코자산신탁", logo: "koramco.png", name: "정O우 님", persona: "중고신입 이직", service: "Real Bridge",
    before: "리츠 인턴 경험 반복", after: "코람코자산신탁 상장리츠팀 공채",
    quote: "실제 직무 프로세스를 알고 나니 준비의 초점이 달라졌습니다",
    paragraphs: [
      "리츠에 관심이 많아 인턴도 여러 번 했지만, 정작 상장리츠팀으로 취업하는 길은 쉽지 않았습니다. 무엇이 부족한지조차 알기 어려웠어요.",
      "멘토님들의 네트워킹을 통해 상장리츠 업무의 실제 프로세스와 팀이 원하는 역량을 알게 됐고, 이를 타겟팅해 집중적으로 준비했습니다.",
      "막연히 넓게 준비하던 이전과 달리 초점이 분명해졌고, 결국 공채로 합격할 수 있었습니다. 방향을 잡아주신 게 결정적이었습니다.",
    ],
    tags: ["직무 프로세스 이해", "역량 타겟팅", "현직자 네트워킹"],
  },
  {
    company: "롯데AMC", logo: "lotte-amc.svg", name: "최O아 님", persona: "경력 이직", service: "Real Connect",
    before: "원거리 자산운용사 재직 (잦은 야근)", after: "롯데AMC 리츠투자팀",
    quote: "커리어와 삶의 질을 동시에 잡은 이직이었습니다",
    paragraphs: [
      "기존 운용사에서 펀드 운용을 했지만 출퇴근이 너무 멀고 야근이 잦아 체력적으로 지쳐 있던 시기에 멘토님을 만났습니다.",
      "제 상황을 듣고 집과 가까우면서도 커리어에 도움이 되는 회사를 추천해 주시고, 현직자를 바로 연결해 주셨습니다.",
      "덕분에 어렵다는 경력 이직을 직주근접이라는 큰 메리트까지 얻으며 성공할 수 있었습니다.",
    ],
    tags: ["맞춤 기업 추천", "현직자 연결", "경력 이직 전략"],
  },
  {
    company: "ARA Korea", logo: "ara.png", name: "강O석 님", persona: "PM사 5년차 · 경력 이직", service: "Real Connect",
    before: "PM사 5년차", after: "ARA Korea 리츠운용",
    quote: "몇 번을 도전해도 안 되던 이직이 한 번에 풀렸습니다",
    paragraphs: [
      "PM사에서 5년간 일하며 자산운용사로 가고 싶었지만, 채용 시장이 활발하지 않아 여러 번 시도에도 번번이 막혔습니다.",
      "멘토님이 수많은 자산운용사의 장단점을 바로 정리해 주시고, 지원 회사의 현직자를 직접 연결해 주셨습니다.",
      "채용 과정이 이전과는 비교할 수 없이 수월하게 진행됐고, 마침내 원하던 운용사로 이직에 성공했습니다.",
    ],
    tags: ["운용사 비교 분석", "현직자 연결", "이직 성공"],
  },
];

const FILTERS = ["전체", "Real Connect", "Real Bridge", "Real Success"] as const;
type Filter = (typeof FILTERS)[number];

export default function SuccessStoriesPage() {
  const [filter, setFilter] = useState<Filter>("전체");

  const counts: Record<string, number> = { 전체: STORIES.length };
  STORIES.forEach((s) => {
    counts[s.service] = (counts[s.service] || 0) + 1;
  });
  const visible = STORIES.filter((s) => filter === "전체" || s.service === filter);

  return (
    <div className="w-full overflow-x-hidden bg-white">
      {/* ===== NAV ===== */}
      <nav className="sticky top-0 z-[60] border-b border-line bg-white/90 backdrop-blur-[12px]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-5 px-6 py-[15px]">
          <Link href="/" className="flex items-center gap-[11px] no-underline">
            <BrandMark className="h-[30px] w-[34px]" />
            <span className="text-[19px] font-extrabold tracking-[-0.02em] text-ink">REal BridgE</span>
          </Link>
          <div className="flex items-center gap-[22px]">
            <Link href="/" className="inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-muted-2 no-underline hover:text-terracotta">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              홈으로
            </Link>
            <Link href="/contact" className="rounded-full bg-sage px-5 py-[10px] text-[14.5px] font-bold text-white no-underline hover:bg-sage-600">무료 상담 신청</Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="bg-ivory px-6 pt-[76px] pb-16">
        <div className="mx-auto max-w-[920px] text-center" style={{ animation: "rbup .6s ease both" }}>
          <span className="inline-flex items-center gap-[7px] rounded-full border border-terracotta/30 bg-white px-[15px] py-[7px] text-[12.5px] font-bold tracking-[0.02em] text-terracotta">
            <StarG size={14} /> REal BridgE 합격후기
          </span>
          <h1 className="mt-[22px] text-[34px] leading-[1.2] font-extrabold tracking-[-0.03em] text-ink md:text-[46px]">
            전략이 만든 <span className="text-terracotta">진짜 합격 스토리</span>
          </h1>
          <p className="mx-auto mt-[18px] max-w-[560px] text-[17.5px] leading-[1.7] text-muted-2">스펙이 아닌 방향이었습니다. 비전공·경력 전환·중고신입까지 — 현직 멘토와 함께 부동산·금융업 합격에 이른 실제 후기를 모았습니다.</p>
          <div className="mt-[38px] flex flex-wrap justify-center gap-[14px]">
            {[
              ["12+", "합격 기관", false],
              ["5.0", "평균 평점", true],
              ["100%", "추천 만족도", false],
            ].map(([v, l, star]) => (
              <div key={l as string} className="min-w-[150px] rounded-[16px] border border-line bg-white px-8 py-5">
                <div className="flex items-center justify-center gap-[5px] text-[34px] font-extrabold tracking-[-0.02em] text-sage">
                  {v}
                  {star ? <StarG size={22} /> : null}
                </div>
                <div className="mt-[3px] text-[13.5px] text-soft-2">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FILTER + REVIEWS ===== */}
      <section className="bg-white px-6 pt-14 pb-24">
        <div className="mx-auto max-w-[880px]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line-2 pb-[26px]">
            <div className="text-[15px] font-bold text-muted-2">
              총 <span className="text-terracotta">{visible.length}</span>건의 합격 후기
            </div>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => {
                const active = filter === f;
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`cursor-pointer rounded-full px-4 py-[9px] text-[13.5px] font-bold transition-colors ${
                      active ? "border border-sage bg-sage text-white" : "border border-line bg-white text-muted-2 hover:border-sage/40"
                    }`}
                  >
                    {f} {counts[f] || 0}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-[34px] flex flex-col gap-[22px]">
            {visible.map((s) => (
              <article key={s.company + s.name} className="rounded-[20px] border border-line bg-white p-8 shadow-[0_8px_24px_rgba(47,58,46,0.05)] transition-colors hover:border-sage/[0.28] md:px-9">
                {/* header */}
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div className="flex items-center gap-[15px]">
                    <span className="flex h-[54px] w-[54px] flex-none items-center justify-center rounded-full bg-sand">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.5" r="3.6" stroke="#C06A45" strokeWidth="1.9" /><path d="M5 20c0-3.4 3.1-5.6 7-5.6s7 2.2 7 5.6" stroke="#C06A45" strokeWidth="1.9" strokeLinecap="round" /></svg>
                    </span>
                    <div>
                      <div className="text-[19px] font-extrabold tracking-[-0.01em] text-ink">{s.name}</div>
                      <div className="mt-[3px] text-[13px] text-soft">{s.persona}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end gap-[7px]">
                      <Stars size={16} />
                      <span className="rounded-full bg-sand px-[11px] py-1 text-[12px] font-bold text-terracotta">{s.service}</span>
                    </div>
                    <span className="h-11 w-px flex-none bg-line-2" />
                    <div className="flex h-[46px] w-[120px] flex-none items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/logos/story/${s.logo}`} alt={s.company} style={{ maxHeight: s.logoH ?? 42, maxWidth: s.logoW ?? 120, width: "auto", objectFit: "contain" }} />
                    </div>
                  </div>
                </div>

                {/* before -> after */}
                <div className="mt-[22px] flex flex-wrap items-center gap-[14px] rounded-[14px] border border-line-2 bg-ivory px-5 py-[15px]">
                  <div>
                    <div className="text-[11px] font-bold tracking-[0.04em] text-soft-3">지원 전</div>
                    <div className="mt-[3px] text-[14.5px] font-semibold text-muted-2">{s.before}</div>
                  </div>
                  <svg className="flex-none" width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#C06A45" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <div>
                    <div className="text-[11px] font-bold tracking-[0.04em] text-terracotta">합격</div>
                    <div className="mt-[3px] text-[14.5px] font-extrabold text-ink">{s.after}</div>
                  </div>
                </div>

                {/* pull quote */}
                <p className="mt-6 text-[21px] leading-[1.5] font-extrabold tracking-[-0.01em] text-sage">“{s.quote}”</p>

                {/* paragraphs */}
                <div className="mt-[15px] flex flex-col gap-[13px]">
                  {s.paragraphs.map((p, i) => (
                    <p key={i} className="text-[15px] leading-[1.85] text-muted">{p}</p>
                  ))}
                </div>

                {/* tags */}
                <div className="mt-[22px] flex flex-wrap items-center gap-[9px] border-t border-line-3 pt-5">
                  <span className="text-[12.5px] font-bold text-soft-2">이런 점이 좋았어요</span>
                  {s.tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-sand px-[13px] py-1.5 text-[13px] font-semibold text-terracotta">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#C06A45" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <p className="mt-10 text-center text-[11.5px] leading-[1.6] text-soft-3">※ 합격 후기는 실제 수강생의 합격 결과를 바탕으로 하며, 언급된 기업명은 사실 적시를 위한 것으로 해당 기업과의 제휴·후원·보증 관계를 의미하지 않습니다.</p>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-sage px-6 py-[90px]">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="text-[32px] leading-[1.28] font-extrabold tracking-[-0.03em] text-white md:text-[38px]">
            다음 합격 스토리의 주인공은
            <br />
            당신입니다
          </h2>
          <p className="mx-auto mt-[18px] max-w-[520px] text-[17px] leading-[1.7] text-white/75">현직 멘토와의 1:1 맞춤 컨설팅으로, 지금 나에게 꼭 맞는 합격 전략을 진단받으세요.</p>
          <div className="mt-[34px] flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-white px-[30px] py-[15px] text-[16px] font-bold text-sage no-underline hover:bg-sand">
              무료 상담 신청하기 <Arrow color="#2F3A2E" />
            </Link>
            <Link href="/#services" className="inline-flex items-center rounded-full border border-white/30 bg-transparent px-[30px] py-[15px] text-[16px] font-bold text-white no-underline hover:bg-white/10">서비스 살펴보기</Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-line bg-ivory px-6 py-11 text-muted-2">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-[10px]">
            <BrandMark className="h-[25px] w-[28px]" />
            <BrandWordmark className="text-[16px] text-ink" />
          </div>
          <span className="text-[12.5px] text-soft-3">© 2026 REal BridgE (REBE). boopro.official@gmail.com · 02-541-8248</span>
        </div>
      </footer>
    </div>
  );
}
