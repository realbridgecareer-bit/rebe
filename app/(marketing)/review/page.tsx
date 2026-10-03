"use client";

import { useState } from "react";
import type { ReviewSubmissionInput } from "@/types";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "submitting" | "success" | "error";

const SERVICES = ["Real Connect", "Real Bridge", "Real Success"];
const CAREER_TYPES = ["신입", "중고신입", "경력", "타 업계 재직"];
const FOCUS_TYPES = [
  "자소서 첨삭",
  "면접 준비",
  "진로·방향 설정",
  "직무 이해",
  "경력기술서 첨삭",
  "커리어 전환·이직 준비",
  "기타",
];
const MAX_PHOTO_MB = 5;
const MAX_PHOTOS = 5;

// 실명을 그대로 저장하지 않고, 성만 남기고 마스킹해 공개 표기용으로 변환한다.
// (사이트 전체 후기 표기 규칙 "김ㅇㅇ 님"과 동일한 형식)
function maskName(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return "";
  return `${trimmed[0]}ㅇㅇ 님`;
}

export default function ReviewSubmitPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [realName, setRealName] = useState("");
  const [service, setService] = useState("");
  const [career, setCareer] = useState("");
  const [focus, setFocus] = useState("");
  const [focusOther, setFocusOther] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const maskedName = maskName(realName);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    setPhotoError("");
    const accepted: File[] = [];
    let remaining = MAX_PHOTOS - photos.length;
    for (const file of files) {
      if (remaining <= 0) {
        setPhotoError(`사진은 최대 ${MAX_PHOTOS}장까지 첨부할 수 있습니다.`);
        break;
      }
      if (!file.type.startsWith("image/")) {
        setPhotoError("이미지 파일만 첨부할 수 있습니다. (아이폰에서 촬영한 HEIC 사진은 설정에서 '가장 호환되는 형식(JPEG)'으로 바꾼 뒤 다시 시도해 주세요.)");
        continue;
      }
      if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
        setPhotoError(`이미지 용량은 장당 ${MAX_PHOTO_MB}MB 이하만 가능합니다.`);
        continue;
      }
      accepted.push(file);
      remaining--;
    }
    if (accepted.length === 0) return;
    setPhotos((prev) => [...prev, ...accepted]);
    setPhotoPreviews((prev) => [...prev, ...accepted.map((f) => URL.createObjectURL(f))]);
  }

  function removePhoto(idx: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
    setPhotoPreviews((prev) => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const focusText = focus === "기타" ? focusOther.trim() : focus;
    const persona = [career, focusText].filter(Boolean).join(" · ");

    const payload: ReviewSubmissionInput = {
      name: maskedName,
      service,
      persona,
      text: String(data.get("text") ?? "").trim(),
      agreePrivacy: data.get("agreePrivacy") === "on",
    };

    // 클라이언트 1차 검증 (서버 RLS에서 published=false 강제로 재검증)
    if (!realName.trim() || !payload.text) {
      setStatus("error");
      setErrorMsg("성함과 후기 내용은 필수입니다.");
      return;
    }
    if (!payload.service) {
      setStatus("error");
      setErrorMsg("이용하신 서비스를 선택해 주세요.");
      return;
    }
    if (focus === "기타" && !focusOther.trim()) {
      setStatus("error");
      setErrorMsg("상황을 직접 입력해 주세요.");
      return;
    }
    if (!payload.agreePrivacy) {
      setStatus("error");
      setErrorMsg("개인정보 수집·이용에 동의해 주세요.");
      return;
    }

    try {
      const supabase = createClient();
      const photoUrls: string[] = [];

      for (const photo of photos) {
        const ext = photo.name.split(".").pop() || "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("review-photos").upload(path, photo);
        if (uploadError) throw new Error(uploadError.message);
        photoUrls.push(supabase.storage.from("review-photos").getPublicUrl(path).data.publicUrl);
      }

      // 브라우저에서 Supabase로 직접 저장 (RLS: published=false·source=customer로 강제, 관리자 승인 후 노출)
      // 실명은 서버로 전송하지 않고, 마스킹된 표기(payload.name)만 저장한다.
      const { error } = await supabase.from("reviews").insert({
        name: payload.name,
        service: payload.service,
        persona: payload.persona || null,
        text: payload.text,
        photo_urls: photoUrls,
        published: false,
        source: "customer",
      });
      if (error) throw new Error(error.message);

      setStatus("success");
      form.reset();
      setPhotoError("");
      setRealName("");
      setService("");
      setCareer("");
      setFocus("");
      setFocusOther("");
      setPhotos([]);
      setPhotoPreviews([]);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "제출에 실패했습니다.");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-sand text-2xl text-terracotta">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-ink">소중한 후기 감사합니다</h1>
        <p className="mt-4 text-slate-500">
          담당자 검토 후 홈페이지에 게시됩니다. 좋은 소식을 나눠주셔서 감사합니다!
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-20">
      <div className="mb-2 text-xs font-semibold tracking-[0.2em] text-terracotta uppercase">
        REVIEW
      </div>
      <h1 className="text-3xl font-bold text-ink">후기 남기기</h1>
      <p className="mt-2 text-slate-500">
        REBE와 함께한 이야기를 들려주세요. 사진도 함께 첨부할 수 있습니다.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-2xl border border-line bg-white p-8"
      >
        <div>
          <label htmlFor="realName" className="block text-sm font-medium text-slate-700">
            성함 <span className="text-terracotta">*</span>
          </label>
          <input
            id="realName"
            value={realName}
            onChange={(e) => setRealName(e.target.value)}
            required
            placeholder="예: 홍길동"
            className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 outline-none focus:border-sage"
          />
          <p className="mt-1.5 text-xs text-slate-400">
            서버에는 저장되지 않으며, 페이지에는{" "}
            <span className="font-semibold text-sage">{maskedName || "예: 홍ㅇㅇ 님"}</span> 형태로
            성만 공개됩니다.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            이용하신 서비스 <span className="text-terracotta">*</span>
          </label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {SERVICES.map((s) => {
              const active = service === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setService(active ? "" : s)}
                  className={`cursor-pointer rounded-full border px-2 py-2.5 text-[13px] font-semibold transition-colors ${
                    active
                      ? "border-sage bg-sage text-white"
                      : "border-line bg-white text-slate-600 hover:border-sage/50"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">본인 소개 (선택)</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <select
              value={career}
              onChange={(e) => setCareer(e.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-slate-800 outline-none focus:border-sage"
            >
              <option value="">경력 구분</option>
              {CAREER_TYPES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-slate-800 outline-none focus:border-sage"
            >
              <option value="">어떤 부분에 도움받으셨나요</option>
              {FOCUS_TYPES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          {focus === "기타" && (
            <input
              value={focusOther}
              onChange={(e) => setFocusOther(e.target.value)}
              placeholder="예: 포트폴리오 첨삭"
              className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 outline-none focus:border-sage"
            />
          )}
        </div>

        <div>
          <label htmlFor="text" className="block text-sm font-medium text-slate-700">
            후기 내용 <span className="text-terracotta">*</span>
          </label>
          <textarea
            id="text"
            name="text"
            rows={6}
            required
            placeholder="컨설팅을 받으며 느꼈던 점, 도움이 된 부분을 자유롭게 남겨주세요."
            className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 outline-none focus:border-sage"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            첨부 사진 (선택, 최대 {MAX_PHOTOS}장)
          </label>
          <div className="mt-1.5 flex flex-wrap gap-3">
            {photoPreviews.map((src, i) => (
              <div key={src} className="relative h-20 w-20 flex-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="첨부 사진 미리보기" className="h-20 w-20 rounded-lg border border-line object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  aria-label="사진 제거"
                  className="absolute -top-2 -right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white hover:bg-rose-600"
                >
                  ✕
                </button>
              </div>
            ))}
            {photos.length < MAX_PHOTOS && (
              <label className="flex h-20 w-20 flex-none cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line text-slate-400 hover:bg-ivory">
                <span className="text-xl leading-none">+</span>
                <span className="text-[11px]">사진 추가</span>
                <input type="file" accept="image/*" multiple onChange={handlePhotoChange} className="hidden" />
              </label>
            )}
          </div>
          {photoError ? (
            <p className="mt-1.5 text-xs text-rose-500">{photoError}</p>
          ) : (
            <p className="mt-1.5 text-xs text-slate-400">
              장당 최대 {MAX_PHOTO_MB}MB · 합격 통보 문자·메일 캡쳐 등도 좋습니다.
            </p>
          )}
        </div>

        <label className="flex items-start gap-2 text-sm text-slate-500">
          <input type="checkbox" name="agreePrivacy" className="mt-1 accent-sage" />
          <span>
            개인정보 수집·이용에 동의합니다. (수집 항목: 후기 내용·첨부 사진, 성함은 마스킹된
            형태로만 저장·공개되며 목적: 홈페이지 후기 게시, 보유기간: 게시 종료 후 1년)
          </span>
        </label>

        {status === "error" && <p className="text-sm text-rose-500">{errorMsg}</p>}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full rounded-full bg-sage py-3.5 text-[15px] font-bold text-white transition hover:bg-sage-600 disabled:opacity-50"
        >
          {status === "submitting" ? "제출 중..." : "후기 남기기"}
        </button>
        <p className="text-center text-xs text-slate-400">
          제출한 후기는 담당자 검토 후 홈페이지에 게시됩니다.
        </p>
      </form>
    </div>
  );
}
