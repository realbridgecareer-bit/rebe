"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Check,
  X,
  Star,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  GraduationCap,
  Briefcase,
  Compass,
  Quote,
  Menu,
  Close,
  Play,
  UserRound,
  BrandWordmark,
  BrandLockup,
} from "@/components/icons";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  // 합격 후기 영상(YouTube) 모달에 띄울 영상 ID. null이면 닫힘.
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  // 후기 전문 모달
  const [activeReview, setActiveReview] = useState<null | {
    company: string;
    position: string;
    background: string;
    service: string;
    review: string;
    videoId?: string;
  }>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsMenuOpen(false);
      setScrolled(window.scrollY > 10);

      const sections = [
        "home",
        "about",
        "consulting",
        "mentors",
        "services",
        "audience",
        "success",
        "contact",
      ];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom > 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 36 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const stagger = {
    animate: { transition: { staggerChildren: 0.08 } },
  };

  // 합격 사례. videoId에 YouTube 영상 ID를 넣으면 '합격 영상' 버튼이 자동 노출됩니다.
  const successStories: {
    id: number;
    company: string;
    position: string;
    background: string;
    service: string;
    review: string;
    videoId?: string;
    logo?: string; // 예: "/logos/shinsegae.png" (투명 PNG, public/logos/에 배치)
  }[] = [
    {
      id: 1,
      company: "신세계프라퍼티",
      position: "기획팀",
      background: "20대 · 비관련 전공(미대 출신) 경력 이직",
      service: "Real Success",
      review:
        "잘 모르는 업계인데다가 회사 정보가 많이 노출되어 있지 않아 어려움이 컸는데, 컨설팅을 통해 업계 정보와 관련해 많은 도움을 받을 수 있었습니다. 자소서와 포트폴리오, 경력기술서를 작성하면서 제가 어필할 수 있을 만한 포인트들을 짚어주시고, 부족한 부분들은 커버할 수 있도록 세세하게 문장들을 컨펌해주셨던 게 프로페셔널하게 느껴졌습니다.",
    },
    {
      id: 2,
      company: "NAI Korea",
      position: "Capital Market",
      background: "20대 · 비관련 전공(미대 출신) 신입 취업",
      service: "Real Success",
      review:
        "취준생 입장에서 적지 않은 금액일 수 있으나 그만큼 가치 있는 컨설팅이었습니다. 특히 세 가지 부분에서 꼼꼼하게 챙겨주셔서 만족스러웠습니다 — 스펙 진단 및 자소서 첨삭, 직무 및 기업 공고 추천, 네트워크 기반 정보 제공에서 큰 도움을 받았습니다.",
    },
    {
      id: 3,
      company: "한국투자신탁운용",
      position: "경영지원팀",
      background: "20대 · 비관련 전공(공대 출신) 인턴 취업",
      service: "Real Connect",
      review:
        "대학교 3학년 재학생이라 방향성 컨설팅 위주로 진행했는데, 시간도 넉넉하게 자유로운 분위기 속에서 진행하는 점이 좋았습니다! 유관학과가 아니어서 정보가 없어 고민이 많았는데, 포트폴리오와 모의 자소서를 검토하며 현재 어떤 스펙과 경험이 추가되면 좋은지 구체적으로 짚어주셨습니다.",
    },
    {
      id: 4,
      company: "코람코자산신탁",
      position: "상장리츠팀",
      background: "30대 · 중고 신입 이직",
      service: "Real Bridge",
      review:
        "리츠 쪽에 관심이 많아 인턴도 몇 번 해봤지만 상장리츠팀으로 취업하는 길은 쉽지 않았습니다. 하지만 멘토님들의 네트워킹을 통해 상장리츠 업무의 실제 직무 프로세스를 알게 되고, 이를 타겟팅하여 스터디한 끝에 공채로 합격할 수 있었습니다.",
    },
    {
      id: 5,
      company: "롯데AMC",
      position: "리츠투자팀",
      background: "30대 · 경력 이직",
      service: "Real Connect",
      review:
        "기존 자산운용사에서 펀드 운용을 하며 출퇴근이 너무 먼 회사에서 매일 야근하다 보니 체력적으로 너무 힘들어하던 시기에 멘토분들을 만났습니다. 제가 사는 곳과 가까운 회사를 추천해주시고 현직자를 바로 연결해주셔서, 어려운 경력 이직을 직주근접이라는 큰 메리트까지 가지고 성공할 수 있었습니다.",
    },
    {
      id: 6,
      company: "ARA Korea",
      position: "리츠운용",
      background: "30대 · 경력 이직",
      service: "Real Connect",
      review:
        "PM사에서 5년간 근무하며 자산운용사로 가고 싶은 마음이 굴뚝같았지만, 채용시장이 활발하지 않아 몇 차례 시도에도 쉽게 이직하기 어려웠습니다. 수많은 자산운용사의 장단점을 바로 파악해주시고 지원 회사 현직자를 연결해주셔서, 채용 과정이 이전과는 너무 다르게 수월하게 진행되어 이직에 성공했습니다.",
    },
  ];

  const mentors = [
    {
      id: 1,
      name: "멘토 A",
      company: "부동산 디벨로퍼 대표",
      background: "전 대기업 종합건설사 부동산개발팀",
      expertise: "시행사, 건설사, 개발 및 PF",
    },
    {
      id: 2,
      name: "멘토 B",
      company: "국내 Top-Tier 대기업 운용사",
      background: "전 외국계 컨설팅사 재직",
      expertise: "자산운용사, 펀드 및 리츠, PM, LM",
    },
    {
      id: 3,
      name: "멘토 C",
      company: "국내 대기업 계열 운용사",
      background: "전 외국계 컨설팅사 재직",
      expertise: "자산운용사, 해외 펀드 투자 및 운용",
    },
    {
      id: 4,
      name: "멘토 D",
      company: "국내 Top-Tier 기금운용본부",
      background: "전 국내 자산운용사 재직",
      expertise: "기관투자자, 증권사, 인프라 투자 및 운용",
    },
    {
      id: 5,
      name: "멘토 E",
      company: "국내 Top-Tier 증권사",
      background: "국내 부동산 개발·PF·에쿼티 투자 경험",
      expertise: "증권사, 개발 및 PF 사업수지 분석",
    },
    {
      id: 6,
      name: "멘토 F",
      company: "외국계 컨설팅사",
      background: "Valuation 및 컨설팅 프로젝트 다수",
      expertise: "재무 모델, 사업수지 분석",
    },
    {
      id: 7,
      name: "멘토 G",
      company: "국내 메이저 시행사",
      background: "공동주택·상업시설 개발 경험 보유",
      expertise: "시행사, 증권사, 개발 및 PF",
    },
    {
      id: 8,
      name: "멘토 H",
      company: "국내 Top-Tier 기금운용본부",
      background: "전 은행 기업금융팀, 전 증권사",
      expertise: "기관투자자, 은행, 증권사, 기업금융",
    },
  ];

  const services = [
    {
      id: 1,
      name: "Real Connect",
      sessions: "대면 컨설팅 60분 1회",
      price: "40만원",
      features: [
        "입사지원서 컨설팅 or 면접 준비 컨설팅(택1)",
        "지원 직무·업계 현직자 관점의 컨설팅",
        "필요 부분 수정, 방향성 제시, 어필 포인트 제시",
        "채용공고에 드러나지 않는 핵심 역량·준비 방향 안내",
        "업계 연봉 수준·복지 등 현직자 관점의 정보 안내",
      ],
    },
    {
      id: 2,
      name: "Real Bridge",
      sessions: "대면 컨설팅 90분 3회",
      price: "95만원",
      features: [
        "입사지원서·면접·커리어 단계적 컨설팅",
        "지원 직무·업계 현직자 관점의 컨설팅",
        "직무별 마스터 자소서 및 면접 예상 질문 제공",
        "현직자 경험을 바탕으로 한 직무·업계 동향 제공",
        "채용 동향 및 추천 직무 안내",
        "직무 역량 개발을 위한 학습 자료 제공",
      ],
    },
    {
      id: 3,
      name: "Real Success",
      sessions: "대면 컨설팅 90분 5회",
      price: "145만원",
      features: [
        "Real Bridge의 모든 혜택 포함",
        "타 지원자와 Grouping으로 객관적 위치 파악",
        "합격 사례 및 정보 제공(자소서·면접)",
        "대규모 네트워킹 모임 참여 기회",
        "현직자 네트워킹을 통한 직무·업계 정보 제공",
        "직무에 필요한 Skill-up 자료 제공",
      ],
    },
  ];

  const targetAudiences = [
    {
      id: 1,
      tag: "신입",
      title: "이제 막 취업을 준비하는 분",
      description:
        "어디서부터 시작할지 막막하거나, 면접·서류 경험이 거의 없어 기초부터 합격 전략까지 함께 잡고 싶은 취업 준비생",
      Icon: GraduationCap,
    },
    {
      id: 2,
      tag: "중고신입",
      title: "직무·회사 이해를 더 높이고 싶은 분",
      description:
        "직무는 들어봤지만 핵심은 아직 모호하고, 지원 회사의 실제 정보와 디테일한 자소서·면접 준비가 필요한 분",
      Icon: Briefcase,
    },
    {
      id: 3,
      tag: "경력",
      title: "이직 전 회사를 미리 검증하고 싶은 분",
      description:
        "실무 경험은 있지만, 지원 조직의 업무·분위기를 사전에 파악해 후회 없는 이직을 하고 싶은 경력자",
      Icon: Compass,
    },
  ];

  const consultingPoints = [
    {
      id: 1,
      title: "지원 회사·직무 정확히 파악",
      description:
        "회사별(자산운용·증권·캐피탈·시행·건설·컨설팅), 직무별(IB·PF·투자·운용·개발·PM·LM·건설관리)로 세분화된 분석",
    },
    {
      id: 2,
      title: "100명 이상의 실무자 기반 정보",
      description:
        "책·인터넷과는 차원이 다른 실제 현직자의 채용 꿀팁으로 서류와 면접을 정밀 타겟팅",
    },
    {
      id: 3,
      title: "Career Path 설계",
      description:
        "딱딱한 컨설팅이 아닌 동종업계 선배의 조언으로 향후 진로에 대한 고민까지 함께",
    },
    {
      id: 4,
      title: "끝나도 지속되는 인연",
      description:
        "예비 업계 동료인 회원분들께 리얼브릿지만의 강력한 오프라인 네트워킹 기회 제공",
    },
  ];

  const stats = [
    { value: "100+", label: "현직 멘토" },
    { value: "95%", label: "합격률" },
    { value: "12+", label: "업종 커버리지" },
    { value: "5.0", label: "만족도" },
  ];

  const navSections = [
    "about",
    "consulting",
    "mentors",
    "services",
    "audience",
    "success",
  ];
  const navLabels: Record<string, string> = {
    about: "브랜드 소개",
    consulting: "컨설팅 개요",
    mentors: "멘토진",
    services: "서비스",
    audience: "서비스 대상",
    success: "합격사례",
  };

  return (
    <div className="bg-white text-slate-700">
      {/* ===== Navigation ===== */}
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-line bg-white/95 py-3 backdrop-blur"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
          <button onClick={() => scrollToSection("home")} className="flex">
            <BrandLockup />
          </button>

          <div className="hidden items-center gap-8 md:flex">
            {navSections.map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`text-sm font-medium transition-colors ${
                  activeSection === section
                    ? "text-accent"
                    : "text-slate-600 hover:text-navy"
                }`}
              >
                {navLabels[section]}
              </button>
            ))}
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-navy"
            >
              로그인
            </Link>
            <button
              onClick={() => scrollToSection("contact")}
              className="rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-600"
            >
              문의하기
            </button>
          </div>

          <button
            onClick={toggleMenu}
            className="text-navy md:hidden"
            aria-label="메뉴"
          >
            {isMenuOpen ? (
              <Close className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="border-t border-line bg-white md:hidden"
          >
            <div className="space-y-1 px-5 py-4">
              {navSections.map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="block w-full py-2 text-left font-medium text-slate-600 hover:text-accent"
                >
                  {navLabels[section]}
                </button>
              ))}
              <Link
                href="/login"
                className="block w-full py-2 text-left font-medium text-slate-600 hover:text-accent"
              >
                로그인
              </Link>
              <button
                onClick={() => scrollToSection("contact")}
                className="mt-2 block w-full rounded-full bg-navy px-5 py-3 text-center font-semibold text-white"
              >
                문의하기
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ===== Hero ===== */}
      <section id="home" className="bg-surface pt-40 pb-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 md:grid-cols-2">
          <motion.div {...fadeInUp}>
            <div className="mb-6 inline-flex items-center rounded-full border border-accent/30 bg-white px-4 py-1.5 text-xs font-semibold tracking-wide whitespace-nowrap text-accent">
              부동산 · 금융업 취업의 지름길
            </div>
            <h1 className="text-4xl leading-tight font-bold tracking-tight text-navy sm:text-5xl">
              현직자가 직접 알려주는
              <br />
              <span className="text-accent">취업 전략 컨설팅</span>
            </h1>
            <p
              className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600"
              style={{ textWrap: "pretty" }}
            >
              Real Bridge는{" "}
              <strong className="font-semibold text-navy">
                부동산·금융업 출신 현직자
              </strong>
              가 기획한 플랫폼입니다. 단순한 스펙이 아닌 회사가 원하는 인재상과
              핵심 역량을 타겟팅하여{" "}
              <strong className="font-semibold text-navy">합격으로 이끕니다.</strong>
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => scrollToSection("services")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-8 py-4 font-semibold text-white transition-colors hover:bg-navy-600"
              >
                서비스 알아보기
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-navy/20 px-8 py-4 font-semibold text-navy transition-colors hover:bg-white"
              >
                무료 상담 신청
              </Link>
            </div>
          </motion.div>

          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="rounded-2xl border border-line bg-white p-8">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-4xl font-bold text-navy">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex items-center gap-3 border-t border-line pt-6">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Check className="h-5 w-5" />
                </span>
                <p className="text-sm font-medium text-slate-700">
                  100% 현직자 멘토와의 1:1 맞춤형 컨설팅
                </p>
              </div>
              <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
                ※ 합격률·만족도는 자체 수강생 응답을 기준으로 집계한 수치입니다.
              </p>
            </div>
            <div className="absolute -right-3 -bottom-5 hidden items-center gap-2 rounded-xl border border-line bg-white px-4 py-3 md:flex">
              <Star className="h-5 w-5 text-amber-400" />
              <div>
                <div className="text-sm font-bold text-navy">만족도 5.0/5.0</div>
                <div className="text-xs text-slate-400">실제 고객 후기 기준</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Brand Introduction ===== */}
      <section id="about" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="ABOUT"
            title="Real Bridge는 무엇이 다른가요?"
            desc="부동산·금융업 출신 현직자가 기획한 플랫폼으로, 실제 채용 구조를 기반으로 전략적인 컨설팅을 제공합니다."
          />

          <motion.div
            {...fadeInUp}
            className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-2xl border border-line bg-white"
          >
            <div className="flex flex-col md:flex-row">
              <div className="flex items-center justify-center border-b border-line bg-surface p-10 md:w-2/5 md:border-r md:border-b-0">
                <div className="text-center text-navy">
                  <BrandWordmark className="mb-5 block text-3xl font-bold text-navy" />
                  <p className="text-lg leading-relaxed font-semibold">
                    Real Estate &amp;
                    <br />
                    Banking / Finance
                    <br />
                    Employment Bridge
                  </p>
                </div>
              </div>
              <div className="p-10 md:w-3/5">
                <h3 className="text-2xl font-bold text-navy">
                  고객을 분석하여{" "}
                  <span className="text-accent">진정한 취업 동반자</span>가
                  되겠습니다
                </h3>
                <p className="mt-4 leading-relaxed text-slate-600">
                  리얼브릿지는 고객의 성향·특성·스펙·백그라운드를 분석한 뒤 지원
                  가능 직무를 타겟팅하고 그에 맞는 지원 전략을 제시합니다. 또한
                  향후 커리어를 전략적으로 설계하여, 일회성 취업이 아닌 고객의
                  커리어 플랜을 함께 고민하는 동반자가 되려 합니다.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "부동산",
                    "금융",
                    "자산운용",
                    "증권",
                    "컨설팅",
                    "시행사",
                    "건설사",
                    "캐피탈",
                    "은행",
                    "보험사",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Consulting Overview ===== */}
      <section id="consulting" className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="WHY REAL BRIDGE"
            title="왜 Real Bridge인가?"
            desc="AI가 모든 것을 대체하는 시대, 진정한 현직자의 조언이 필요한 이유."
          />

          <div className="mx-auto mt-14 grid max-w-5xl gap-8 md:grid-cols-2">
            <motion.div
              {...fadeInUp}
              className="rounded-2xl border border-line bg-white p-8"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                <X className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-xl font-bold text-navy">
                일반적인 취업컨설팅의 한계
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-500">
                {[
                  "인사담당자 출신의 대기업 채용 프로세스 기반 단순 첨삭",
                  "지원 업계 현직자가 아니어서 일반적인 답변만 제공",
                  "AI툴로 쉽게 쓰는 이력서·암기식 면접 답변의 한계",
                  "부동산/금융업 특유의 채용 구조(소규모·비공개) 이해 부족",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-slate-300" />
                    {t}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-2xl border border-accent/25 bg-accent-soft/50 p-8"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white">
                <Check className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-xl font-bold text-navy">
                Real Bridge의 차별화된 접근
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {[
                  "부동산/금융업 현직자 100명+의 생생한 업계 경험·노하우",
                  "채용공고에 드러나지 않는 핵심 역량·직무 인사이트 안내",
                  "지원 직무의 선호 인재상·핵심 역량 타겟팅 전략",
                  "실무에 바로 투입 가능한 역량 개발 맞춤 전략",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-lg border border-line bg-white p-4">
                <Quote className="h-5 w-5 text-accent/60" />
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  지원하는 부서가 강조하는 직무 역량을 갖춘, 직무 이해도가 높은
                  인재를 채용하려 합니다.{" "}
                  <strong className="font-semibold text-navy">
                    스펙은 최종 합격을 가르는 핵심 요소가 아닙니다.
                  </strong>
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            {...fadeInUp}
            className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-2xl border border-line bg-white"
          >
            <div className="border-b border-line px-8 py-5">
              <h3 className="text-center text-xl font-bold text-navy">
                Real Bridge가 해결해주는 문제
              </h3>
            </div>
            <div className="grid gap-8 p-8 md:grid-cols-2">
              <div className="space-y-5">
                {[
                  {
                    tone: "warn",
                    text: "국내오피스 실물 투자에 주력하는 자산운용사 투자팀 면접에서 데이터센터 투자 경험을 강조하면 어떨까요?",
                  },
                  {
                    tone: "warn",
                    text: "지방 자산에 수시로 방문해 운전이 필수인 물류센터 자산관리팀에, 운전면허가 없는 분이 지원하면 어떨까요?",
                  },
                  {
                    tone: "tip",
                    text: "채용공고엔 없지만 해외 투자자가 주요 고객인 팀이라면? 영어·글로벌 역량을 적극 어필하면 같은 스펙의 경쟁자보다 합격 가능성이 높아집니다.",
                  },
                ].map((c, i) => (
                  <div key={i} className="flex gap-3">
                    <span
                      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        c.tone === "tip"
                          ? "bg-accent-soft text-accent"
                          : "bg-rose-50 text-rose-500"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <p
                      className="text-sm leading-relaxed text-slate-600"
                      style={{ textWrap: "pretty" }}
                    >
                      {c.text}
                    </p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-accent/20 bg-accent-soft/50 p-6">
                <div className="text-lg font-bold text-accent">
                  Real Bridge의 해결책
                </div>
                <p
                  className="mt-3 text-sm leading-relaxed text-slate-600"
                  style={{ textWrap: "pretty" }}
                >
                  채용공고에는 드러나지 않지만 합격을 가르는 결정적 요소를 —
                  탈락 사유부터 합격을 높이는 어필 포인트까지 — 현직자의 경험을
                  바탕으로 미리 짚어 대비합니다. 지원 직무를 정확히 이해해
                  이력서·면접 준비 시간을 훨씬 효율적으로 씁니다.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {consultingPoints.map((point, i) => (
              <motion.div
                key={point.id}
                variants={fadeInUp}
                className="rounded-xl border border-line bg-white p-6 transition-colors hover:border-navy/25"
              >
                <div className="text-3xl font-bold text-accent/80">0{i + 1}</div>
                <h3
                  className="mt-3 font-bold text-navy"
                  style={{ textWrap: "balance" }}
                >
                  {point.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed text-slate-500"
                  style={{ textWrap: "pretty" }}
                >
                  {point.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== Mentors ===== */}
      <section id="mentors" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="MENTORS"
            title="Real Bridge 대표 멘토진"
            desc="업계 대표 회사 현직자들이 여러분의 커리어 성장을 위해 아낌없이 조언합니다."
          />

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mx-auto mt-14 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {mentors.map((mentor) => (
              <motion.div
                key={mentor.id}
                variants={fadeInUp}
                className="rounded-xl border border-line bg-white p-6 text-center transition-colors hover:border-navy/25"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft">
                  <UserRound className="h-10 w-10 text-accent/55" />
                </div>
                <div className="mt-3 font-bold text-navy">{mentor.name}</div>
                <div className="mt-1 text-sm font-medium text-accent">
                  {mentor.company}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  {mentor.background}
                </div>
                <div className="mt-3 border-t border-line pt-3 text-xs text-slate-500">
                  {mentor.expertise}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="mx-auto mt-14 max-w-4xl rounded-2xl border border-line bg-surface p-8 text-center"
          >
            <div className="text-4xl font-bold text-navy">100+</div>
            <h3 className="mt-2 text-xl font-bold text-navy">
              업계 전문가 네트워크
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
              기관투자자·자산운용사·증권사·시행사·건설사·국내외 컨설팅사 등
              부동산/금융업의 내로라하는 회사에 재직 중인 100명 이상의 멘토진이
              상시 대기하고 있습니다.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {[
                "국내 대형 기금운용본부",
                "국내외 자산운용사",
                "글로벌 부동산 투자사",
                "대형 증권사",
                "종합건설사",
                "시행·디벨로퍼",
                "외국계 컨설팅사",
              ].map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-line bg-white px-3 py-1 text-xs text-slate-500"
                >
                  {c}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Services ===== */}
      <section id="services" className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="SERVICES"
            title="Real Bridge 서비스"
            desc="상황에 맞는 최적의 컨설팅 패키지를 선택하세요. (모든 금액 VAT 포함)"
          />

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mx-auto mt-14 grid max-w-6xl items-start gap-6 md:grid-cols-3"
          >
            {services.map((service, index) => {
              const featured = index === 1;
              return (
                <motion.div
                  key={service.id}
                  variants={fadeInUp}
                  className={`relative flex flex-col rounded-2xl p-8 ${
                    featured
                      ? "bg-navy text-white"
                      : "border border-line bg-white"
                  }`}
                >
                  {featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold whitespace-nowrap text-white">
                      인기 패키지
                    </div>
                  )}
                  <div
                    className={`text-xl font-bold ${featured ? "text-white" : "text-navy"}`}
                  >
                    {service.name}
                  </div>
                  <div
                    className={`mt-1 text-sm ${featured ? "text-white/70" : "text-slate-500"}`}
                  >
                    {service.sessions}
                  </div>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span
                      className={`text-4xl font-bold ${featured ? "text-white" : "text-navy"}`}
                    >
                      {service.price}
                    </span>
                    <span
                      className={`text-xs ${featured ? "text-white/50" : "text-slate-400"}`}
                    >
                      VAT 포함
                    </span>
                  </div>
                  <ul
                    className={`mt-6 flex-1 space-y-3 text-sm ${featured ? "text-white/85" : "text-slate-600"}`}
                  >
                    {service.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check
                          className={`mt-0.5 h-4 w-4 flex-shrink-0 ${featured ? "text-white" : "text-accent"}`}
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`mt-7 inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-colors ${
                      featured
                        ? "bg-white text-navy hover:bg-slate-100"
                        : "bg-navy text-white hover:bg-navy-600"
                    }`}
                  >
                    이 패키지로 상담받기
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="mx-auto mt-12 max-w-3xl rounded-2xl border border-accent/25 bg-accent-soft/50 px-8 py-7 text-center"
          >
            <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
              서비스 금액은 취업 성공 시 받게 되는{" "}
              <strong className="font-bold text-navy">첫 월급의 일부 수준</strong>
              입니다.
            </p>
            <p className="mt-1 text-base leading-relaxed sm:text-lg">
              <strong className="font-bold text-accent">
                평생의 커리어를 위한 투자
              </strong>
              를 시작하세요.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== Target Audience ===== */}
      <section id="audience" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="FOR YOU"
            title="어떤 서비스가 나에게 적합할까요?"
            desc="신입 · 중고신입 · 경력, 단계별로 꼭 맞는 컨설팅을 제안해드립니다."
          />

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mx-auto mt-14 grid max-w-6xl items-stretch gap-6 md:grid-cols-3"
          >
            {targetAudiences.map(({ id, tag, title, description, Icon }) => (
              <motion.div
                key={id}
                variants={fadeInUp}
                className="flex h-full flex-col items-center rounded-2xl border border-line bg-white p-8 text-center transition-colors hover:border-navy/25"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="mt-5 rounded-full bg-navy px-3 py-1 text-xs font-bold text-white">
                  {tag}
                </span>
                <h3
                  className="mt-3 flex min-h-[3rem] items-center justify-center text-lg font-bold text-navy"
                  style={{ textWrap: "balance" }}
                >
                  {title}
                </h3>
                <p
                  className="mt-1 flex-1 text-sm leading-relaxed text-slate-500"
                  style={{ textWrap: "pretty" }}
                >
                  {description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-12 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-8 py-4 font-semibold text-white transition-colors hover:bg-navy-600"
            >
              나에게 맞는 서비스 상담받기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Success Stories ===== */}
      <section id="success" className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="SUCCESS"
            title="Real Bridge 합격 후기"
            desc="모두 5점 만점에 전부 5점. 실제 고객님들이 남겨주신 생생한 후기입니다."
          />

          <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {successStories.map((story) => (
              <div
                key={story.id}
                className="flex flex-col rounded-xl border border-line bg-white p-6 transition-colors hover:border-navy/25"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4" />
                    ))}
                  </div>
                  <span className="rounded bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                    {story.service}
                  </span>
                </div>
                {story.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={story.logo}
                    alt={story.company}
                    className="mt-4 h-7 w-auto object-contain"
                  />
                ) : (
                  <div className="mt-4 text-xl font-bold text-navy">
                    {story.company}
                  </div>
                )}
                <div className="mt-0.5 text-xs text-slate-400">
                  {story.position} · {story.background}
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                  “
                  {story.review.length > 90
                    ? story.review.slice(0, 90) + "…"
                    : story.review}
                  ”
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <button
                    onClick={() => setActiveReview(story)}
                    className="text-sm font-semibold text-accent hover:underline"
                  >
                    후기 전문 보기 →
                  </button>
                  {story.videoId && (
                    <button
                      onClick={() => setActiveVideo(story.videoId ?? null)}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:underline"
                    >
                      <Play className="h-3.5 w-3.5" />
                      합격 영상
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <motion.div {...fadeInUp} className="mt-14 text-center">
            <div className="text-4xl font-bold text-navy">12+</div>
            <h3 className="mt-2 text-xl font-bold text-navy">
              다양한 부동산·금융 기관 합격 사례
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500">
              신세계프라퍼티, NAI Korea, 한국투자신탁운용, 코람코자산신탁, 롯데AMC,
              ARA Korea, MDM, 이화자산운용, IFC Seoul, MG새마을금고자산관리 외 다수
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center justify-center gap-1.5 font-semibold text-navy transition-colors hover:text-accent"
            >
              나의 합격 스토리 만들기
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mx-auto mt-8 max-w-2xl text-xs leading-relaxed text-slate-400">
              ※ 합격 사례는 실제 수강생의 합격 결과를 바탕으로 하며, 언급된 기업명은
              사실 적시를 위한 것으로 해당 기업과의 제휴·후원·보증 관계를 의미하지
              않습니다.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA / Contact ===== */}
      <section id="contact" className="bg-navy py-24">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              지금 바로 시작하세요
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
              부동산·금융업 취업의 지름길. 현직자와의 1:1 맞춤형 컨설팅으로
              합격으로 가는 교두보를 만들어 드립니다.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-navy transition-colors hover:bg-slate-100"
              >
                무료 상담 신청하기
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-4 font-semibold text-white transition-colors hover:bg-white/10"
              >
                카카오톡 채널 문의
              </a>
            </div>
            <div className="mt-12 border-t border-white/15 pt-8">
              <div className="text-lg font-bold text-white">
                Real Bridge (REBE)
              </div>
              <p className="mt-1 text-sm text-white/60">
                부동산·금융업 취업 컨설팅의 새로운 표준
              </p>
              <p className="mt-2 text-sm text-white/50">
                boopro.official@gmail.com · 02-541-8248
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-line bg-white py-14 text-slate-600">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <BrandLockup />
            </div>

            <div>
              <h3 className="font-bold text-navy">바로가기</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-500">
                <li>
                  <Link href="/#about" className="hover:text-accent">
                    브랜드 소개
                  </Link>
                </li>
                <li>
                  <Link href="/#mentors" className="hover:text-accent">
                    멘토진
                  </Link>
                </li>
                <li>
                  <Link href="/#success" className="hover:text-accent">
                    합격사례
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-accent">
                    취업정보
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-accent">
                    상담신청
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-navy">컨설팅 서비스</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-500">
                <li>
                  <Link href="/#services" className="hover:text-accent">
                    Real Connect · 40만원
                  </Link>
                </li>
                <li>
                  <Link href="/#services" className="hover:text-accent">
                    Real Bridge · 95만원
                  </Link>
                </li>
                <li>
                  <Link href="/#services" className="hover:text-accent">
                    Real Success · 145만원
                  </Link>
                </li>
                <li className="pt-1 text-xs text-slate-400">
                  모든 금액 VAT 포함 · 1:1 현직자 컨설팅
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-navy">문의</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-500">
                <li className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                  boopro.official@gmail.com
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                  02-541-8248
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                  서울시 송파구 중대로 135, 11층 (가락동, 아이티벤처타워)
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                  평일 09:00 - 18:00
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-line pt-8 text-xs leading-relaxed text-slate-400">
            <p>
              상호: 부프로 &nbsp;·&nbsp; 대표: 엄은혜 &nbsp;·&nbsp; 사업자등록번호:
              537-59-00849
            </p>
            <p className="mt-1">
              주소: 서울시 송파구 중대로 135, 11층 송파ICT청년창업지원센터(가락동,
              아이티벤처타워)
            </p>
            <p className="mt-1">
              전화: 02-541-8248 &nbsp;·&nbsp; 이메일: boopro.official@gmail.com
            </p>
            <p className="mt-4">
              © 2026 Real Bridge. All rights reserved. ※ 모든 금액은 VAT 포함입니다.
              합격 후기는 실제 고객의 경험을 바탕으로 작성되었습니다.
            </p>
          </div>
        </div>
      </footer>

      {/* ===== 후기 전문 모달 ===== */}
      {activeReview && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setActiveReview(null)}
        >
          <div
            className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveReview(null)}
              className="absolute top-4 right-4 text-slate-400 transition-colors hover:text-slate-700"
              aria-label="닫기"
            >
              <Close className="h-5 w-5" />
            </button>
            <div className="flex gap-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4" />
              ))}
            </div>
            <div className="mt-3 text-xl font-bold text-navy">
              {activeReview.company}
            </div>
            <div className="mt-0.5 text-xs text-slate-400">
              {activeReview.position} · {activeReview.background}
            </div>
            <span className="mt-3 inline-block rounded bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
              {activeReview.service} 합격
            </span>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              “{activeReview.review}”
            </p>
            {activeReview.videoId && (
              <button
                onClick={() => {
                  const v = activeReview.videoId ?? null;
                  setActiveReview(null);
                  setActiveVideo(v);
                }}
                className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-600"
              >
                <Play className="h-4 w-4" />
                합격 영상 보기
              </button>
            )}
          </div>
        </div>
      )}

      {/* ===== 합격 후기 영상 모달 (YouTube) ===== */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative aspect-video w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-9 right-0 text-sm text-white/80 transition-colors hover:text-white"
              aria-label="닫기"
            >
              닫기 ✕
            </button>
            <iframe
              className="h-full w-full rounded-lg"
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
              title="Real Bridge 합격 사례 영상"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-3xl text-center"
    >
      <div className="mb-3 text-xs font-semibold tracking-[0.2em] text-accent uppercase">
        {eyebrow}
      </div>
      <h2
        className="text-3xl font-bold tracking-tight text-navy sm:text-4xl"
        style={{ textWrap: "balance" }}
      >
        {title}
      </h2>
      <div className="mx-auto mt-4 h-px w-16 bg-accent/50" />
      <p
        className="mt-5 leading-relaxed text-slate-600"
        style={{ textWrap: "pretty" }}
      >
        {desc}
      </p>
    </motion.div>
  );
}
