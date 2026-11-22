"use client";

import { use, useEffect, useState } from "react";
import type { InviteSubmissionPayload } from "@/types";
import { createClient } from "@/lib/supabase/client";

type InviteInfo = { displayName: string; service: string };
type Phase = "loading" | "ready" | "invalid" | "used" | "expired" | "submitting" | "done";

const SERVICES = ["Real Connect", "Real Bridge", "Real Success"];
const RESULTS: { value: InviteSubmissionPayload["status"]; label: string }[] = [
  { value: "hired", label: "최종 합격" },
  { value: "progress", label: "서류·면접 진행 중" },
  { value: "direction", label: "진로·직무 방향 정리" },
  { value: "other", label: "기타" },
];
const CAREER_TYPES = ["신입", "중고신입", "경력", "타 업계 재직"];
const FOCUS_TYPES = [
  "현직자 연결",
  "자소서 첨삭",
  "모의면접",
  "직무·업계 인사이트",
  "커리어 방향 설정",
  "경력기술서 첨삭",
];
const MAX_FOCUS = 3;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const inputCls =
  "mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 outline-none focus:border-sage";

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "유효하지 않은 링크입니다.",
  used: "이미 제출이 완료된 링크입니다.",
  expired: "링크 사용 기간이 지났습니다. 담당자에게 문의해 주세요.",
  consent: "필수 동의 항목에 모두 동의해 주세요.",
  rating: "만족도(별점)를 선택해 주세요.",
  service: "이용하신 서비스를 선택해 주세요.",
  length: "입력 길이가 너무 깁니다. 내용을 줄여 주세요.",
  text: "후기 내용을 입력해 주세요.",
  story_fields: "합격 후기는 지원 전 상태와 합격 결과를 모두 입력해 주세요.",
};

export default function ReviewInvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);

  // 형식이 올바르지 않은 토큰은 서버에 묻지 않고 바로 무효 처리한다.
  const [phase, setPhase] = useState<Phase>(UUID_RE.test(token) ? "loading" : "invalid");
  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [service, setService] = useState("");
  const [result, setResult] = useState<InviteSubmissionPayload["status"] | "">("");
  const [company, setCompany] = useState("");
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");
  const [career, setCareer] = useState("");
  const [focus, setFocus] = useState<string[]>([]);
  const [concern, setConcern] = useState("");
  const [changed, setChanged] = useState("");
  const [recommend, setRecommend] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreePublish, setAgreePublish] = useState(false);
  const [agreeTruth, setAgreeTruth] = useState(false);

  // 링크 유효성 확인 (브라우저에서 Supabase RPC 직접 호출)
  useEffect(() => {
    if (!UUID_RE.test(token)) return;
    let cancelled = false;
    createClient()
      .rpc("get_review_invite", { p_token: token })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          setPhase("invalid");
          return;
        }
        const info = data as { status: string; display_name?: string; service?: string };
        if (info.status === "ok" && info.display_name) {
          setInvite({ displayName: info.display_name, service: info.service ?? "" });
          setService(info.service ?? "");
          setPhase("ready");
        } else if (info.status === "used" || info.status === "expired") {
          setPhase(info.status);
        } else {
          setPhase("invalid");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  function toggleFocus(f: string) {
    setFocus((prev) => {
      if (prev.includes(f)) return prev.filter((x) => x !== f);
      return prev.length >= MAX_FOCUS ? prev : [...prev, f];
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    if (!service) return setErrorMsg("이용하신 서비스를 선택해 주세요.");
    if (!result) return setErrorMsg("현재 상황을 선택해 주세요.");
    const hired = result === "hired";
    if (hired && (!company.trim() || !before.trim() || !after.trim())) {
      return setErrorMsg("합격 회사명, 지원 전 상태, 합격 결과를 모두 입력해 주세요.");
    }
    if (!concern.trim() || !changed.trim() || !quote.trim()) {
      return setErrorMsg("컨설팅 전 고민, 달라진 점, 한 줄 후기는 필수입니다.");
    }
    if (rating < 1) return setErrorMsg("만족도(별점)를 선택해 주세요.");
    if (!agreePrivacy || !agreePublish || !agreeTruth) {
      return setErrorMsg("필수 동의 항목에 모두 동의해 주세요.");
    }

    const paragraphs = [
      concern.trim(),
      changed.trim(),
      recommend.trim() ? `이런 분께 추천합니다: ${recommend.trim()}` : "",
    ].filter(Boolean);

    const payload: InviteSubmissionPayload = {
      status: result,
      service,
      persona: [career, ...focus.slice(0, 2)].filter(Boolean).join(" · "),
      company: hired ? company.trim() : "",
      before: hired ? before.trim() : "",
      after: hired ? after.trim() : "",
      quote: quote.trim(),
      paragraphs,
      tags: focus,
      rating,
      feedback: feedback.trim(),
      agree_privacy: agreePrivacy,
      agree_publish: agreePublish,
      agree_truth: agreeTruth,
    };

    setPhase("submitting");
    const { data, error } = await createClient().rpc("submit_review_by_token", {
      p_token: token,
      p_payload: payload,
    });
    const res = data as { ok?: boolean; error?: string } | null;
    if (error || !res?.ok) {
      const code = res?.error ?? "";
      if (code === "used" || code === "expired" || code === "invalid") {
        setPhase(code);
        return;
      }
      setErrorMsg(ERROR_MESSAGES[code] ?? "제출에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      setPhase("ready");
      return;
    }
    setPhase("done");
  }

  if (phase === "loading") {
    return <div className="mx-auto max-w-xl px-6 py-32 text-center text-slate-400">확인 중...</div>;
  }

  if (phase === "invalid" || phase === "used" || phase === "expired") {
    const title =
      phase === "used" ? "이미 제출이 완료되었습니다" : phase === "expired" ? "링크 사용 기간이 지났습니다" : "유효하지 않은 링크입니다";
    const desc =
      phase === "used"
        ? "후기를 남겨주셔서 감사합니다. 담당자 검토 후 게시됩니다."
        : "링크를 다시 확인하시거나 realbridge.career@gmail.com으로 문의해 주세요.";
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-4 text-slate-500">{desc}</p>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-sand text-2xl text-terracotta">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-ink">소중한 후기 감사합니다</h1>
        <p className="mt-4 text-slate-500">
          담당자 검토 후 홈페이지에 게시됩니다. 게시를 원치 않으시면 언제든
          realbridge.career@gmail.com으로 알려 주세요.
        </p>
      </div>
    );
  }

  const hired = result === "hired";

  return (
    <div className="mx-auto max-w-xl px-6 py-20">
      <div className="mb-2 text-xs font-semibold tracking-[0.2em] text-terracotta uppercase">REVIEW</div>
      <h1 className="text-3xl font-bold text-ink">
        {invite?.displayName}, 후기를 들려주세요
      </h1>
      <p className="mt-2 text-slate-500">
        리얼브릿지 컨설팅에 함께해 주셔서 감사합니다. 남겨주신 후기는 다음 취업 준비생에게 큰 도움이
        됩니다. 홈페이지에는 이름이{" "}
        <span className="font-semibold text-sage">{invite?.displayName}</span> 형태로만 표시되고, 대표
        검수 후에만 게시됩니다. (약 3분)
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-2xl border border-line bg-white p-8">
        {/* 이용 서비스 */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            이용하신 서비스 <span className="text-terracotta">*</span>
          </label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {SERVICES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setService(s)}
                className={`cursor-pointer rounded-full border px-2 py-2.5 text-[13px] font-semibold transition-colors ${
                  service === s ? "border-sage bg-sage text-white" : "border-line bg-white text-slate-600 hover:border-sage/50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 현재 상황 */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            현재 상황 <span className="text-terracotta">*</span>
          </label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {RESULTS.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setResult(r.value)}
                className={`cursor-pointer rounded-full border px-3 py-2.5 text-[13px] font-semibold transition-colors ${
                  result === r.value ? "border-sage bg-sage text-white" : "border-line bg-white text-slate-600 hover:border-sage/50"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* 합격 정보 */}
        {hired && (
          <div className="space-y-4 rounded-xl bg-ivory p-4">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-slate-700">
                합격하신 회사명 <span className="text-terracotta">*</span>
              </label>
              <input id="company" value={company} onChange={(e) => setCompany(e.target.value)} maxLength={100} placeholder="예: 코람코자산신탁" className={inputCls} />
              <p className="mt-1.5 text-xs text-slate-400">입력하신 회사명은 홈페이지에 그대로 표시됩니다.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="before" className="block text-sm font-medium text-slate-700">
                  지원 전 상태 <span className="text-terracotta">*</span>
                </label>
                <input id="before" value={before} onChange={(e) => setBefore(e.target.value)} maxLength={200} placeholder="예: 부동산 비전공 대학생" className={inputCls} />
              </div>
              <div>
                <label htmlFor="after" className="block text-sm font-medium text-slate-700">
                  합격 결과 <span className="text-terracotta">*</span>
                </label>
                <input id="after" value={after} onChange={(e) => setAfter(e.target.value)} maxLength={200} placeholder="예: 채용형 인턴 합격" className={inputCls} />
              </div>
            </div>
          </div>
        )}

        {/* 본인 소개 / 도움받은 부분 */}
        <div>
          <label className="block text-sm font-medium text-slate-700">신분 (선택)</label>
          <select value={career} onChange={(e) => setCareer(e.target.value)} className={inputCls}>
            <option value="">선택해 주세요</option>
            {CAREER_TYPES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            가장 도움이 된 부분 (선택, 최대 {MAX_FOCUS}개)
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {FOCUS_TYPES.map((f) => {
              const active = focus.includes(f);
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFocus(f)}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                    active ? "border-sage bg-sage text-white" : "border-line bg-white text-slate-600 hover:border-sage/50"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* 후기 본문 */}
        <div>
          <label htmlFor="concern" className="block text-sm font-medium text-slate-700">
            컨설팅을 받기 전 가장 큰 고민은 무엇이었나요? <span className="text-terracotta">*</span>
          </label>
          <textarea id="concern" value={concern} onChange={(e) => setConcern(e.target.value)} rows={4} maxLength={1500} className={inputCls} />
        </div>

        <div>
          <label htmlFor="changed" className="block text-sm font-medium text-slate-700">
            컨설팅 후 달라진 점을 알려주세요 <span className="text-terracotta">*</span>
          </label>
          <textarea
            id="changed"
            value={changed}
            onChange={(e) => setChanged(e.target.value)}
            rows={5}
            maxLength={2000}
            placeholder="예: 회사 분석이 막연했는데, 팩트 중심으로 정리하는 방법을 알게 되었어요."
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="recommend" className="block text-sm font-medium text-slate-700">
            이런 분께 추천해요 (선택)
          </label>
          <input id="recommend" value={recommend} onChange={(e) => setRecommend(e.target.value)} maxLength={200} className={inputCls} />
        </div>

        <div>
          <label htmlFor="quote" className="block text-sm font-medium text-slate-700">
            한 줄 후기 (80자 이내) <span className="text-terracotta">*</span>
          </label>
          <input
            id="quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            maxLength={80}
            placeholder="예: 혼자 준비할 땐 막막했는데, 현직자의 시선을 알게 되어 달라졌습니다"
            className={inputCls}
          />
          <p className="mt-1 text-right text-xs text-slate-400">{quote.length}/80</p>
        </div>

        {/* 만족도 */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            만족도 <span className="text-terracotta">*</span>
          </label>
          <div className="mt-1.5 flex gap-1" role="radiogroup" aria-label="만족도">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n}점`}
                onClick={() => setRating(n)}
                className={`cursor-pointer text-3xl leading-none transition-colors ${n <= rating ? "text-gold" : "text-slate-300 hover:text-gold/60"}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="feedback" className="block text-sm font-medium text-slate-700">
            아쉬웠던 점·개선 의견 (선택)
          </label>
          <textarea id="feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={3} maxLength={3000} className={inputCls} />
          <p className="mt-1.5 text-xs text-slate-400">이 항목은 홈페이지에 공개되지 않고 서비스 개선에만 사용됩니다.</p>
        </div>

        {/* 동의 */}
        <div className="space-y-3 border-t border-line pt-5">
          <label className="flex items-start gap-2 text-sm text-slate-500">
            <input type="checkbox" checked={agreePrivacy} onChange={(e) => setAgreePrivacy(e.target.checked)} className="mt-1 accent-sage" />
            <span>
              <b className="text-slate-700">[필수] 개인정보 수집·이용 동의</b> — 수집 항목: 이용 서비스, 결과(합격
              여부·회사명), 후기 내용. 이용 목적: 후기 접수·검수 및 게시, 서비스 개선. 보유 기간: 후기 게시
              종료 시 또는 동의 철회 시까지(철회 시 지체 없이 파기). 동의를 거부할 수 있으나 거부 시 후기를
              제출할 수 없습니다.
            </span>
          </label>
          <label className="flex items-start gap-2 text-sm text-slate-500">
            <input type="checkbox" checked={agreePublish} onChange={(e) => setAgreePublish(e.target.checked)} className="mt-1 accent-sage" />
            <span>
              <b className="text-slate-700">[필수] 후기 공개·이용 동의</b> — 제출한 후기가 리얼브릿지 홈페이지, 블로그,
              홍보 자료에 게시되는 것에 동의합니다. 이름은 &quot;{invite?.displayName}&quot;처럼 가려서
              표시하며, 합격 회사명과 직무는 입력하신 대로 표시됩니다. 개선 의견은 공개하지 않습니다.
              표현이 과장되었거나 개인을 알아볼 수 있는 내용은 일부 수정할 수 있으며, 수정 시 사전에
              알려드립니다. 언제든 realbridge.career@gmail.com으로 게시 중단을 요청할 수 있고, 요청 시
              지체 없이 내리겠습니다.
            </span>
          </label>
          <label className="flex items-start gap-2 text-sm text-slate-500">
            <input type="checkbox" checked={agreeTruth} onChange={(e) => setAgreeTruth(e.target.checked)} className="mt-1 accent-sage" />
            <span>
              <b className="text-slate-700">[필수] 후기 내용 확인</b> — 작성한 내용은 실제 경험과 사실에 기반합니다.
            </span>
          </label>
        </div>

        {errorMsg && <p className="text-sm text-rose-500">{errorMsg}</p>}

        <button
          type="submit"
          disabled={phase === "submitting"}
          className="w-full rounded-full bg-sage py-3.5 text-[15px] font-bold text-white transition hover:bg-sage-600 disabled:opacity-50"
        >
          {phase === "submitting" ? "제출 중..." : "후기 제출하기"}
        </button>
        <p className="text-center text-xs text-slate-400">제출한 후기는 담당자 검토 후 게시됩니다.</p>
      </form>
    </div>
  );
}
