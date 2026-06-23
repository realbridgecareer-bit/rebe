import { NextResponse } from "next/server";
import type { ConsultationInput } from "@/types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

/**
 * 상담 신청 접수.
 * 서버 측에서 입력을 다시 검증한 뒤 Supabase `consultations` 테이블에 저장합니다.
 * 개인정보(이름·연락처·이메일)는 로그에 남기지 않습니다.
 */
export async function POST(request: Request) {
  let body: Partial<ConsultationInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const name = body.name?.trim();
  const phone = body.phone?.trim();
  const message = body.message?.trim();

  // 서버 측 검증 (신뢰의 기준)
  if (!name || !phone || !message) {
    return NextResponse.json(
      { error: "이름, 연락처, 상담 내용은 필수입니다." },
      { status: 400 },
    );
  }
  if (body.agreePrivacy !== true) {
    return NextResponse.json(
      { error: "개인정보 수집·이용 동의가 필요합니다." },
      { status: 400 },
    );
  }

  // Supabase 미연동 시: 접수만 확인 (DB 저장은 환경변수 설정 후 동작)
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      ok: true,
      note: "백엔드(Supabase) 미연동 상태입니다. .env.local 설정 후 저장됩니다.",
    });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("consultations").insert({
    name,
    phone,
    email: body.email?.trim() || null,
    program: body.program?.trim() || null,
    message,
  });

  if (error) {
    // PII를 제외한 에러만 기록
    console.error("상담 저장 실패:", error.message);
    return NextResponse.json(
      { error: "저장 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
