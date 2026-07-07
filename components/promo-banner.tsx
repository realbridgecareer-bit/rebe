"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { FALLBACK_SETTINGS, type SiteSettings } from "@/lib/site-content";

/**
 * 사이트 전역 프로모션 띠배너. site_settings.promo_enabled 로 표시 여부·문구를 관리자가 제어.
 * 루트 레이아웃 최상단에서 렌더링되어 모든 페이지 맨 위에 노출된다.
 */
export default function PromoBanner() {
  const [settings, setSettings] = useState<SiteSettings>(FALLBACK_SETTINGS);

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
        if (data) setSettings({ ...FALLBACK_SETTINGS, promo_enabled: data.promo_enabled, promo_label: data.promo_label, promo_banner: data.promo_banner });
      } catch {
        /* 폴백 유지 */
      }
    })();
  }, []);

  if (!settings.promo_enabled) return null;

  return (
    <Link
      href="/#services"
      className="block bg-terracotta text-white no-underline transition-opacity hover:opacity-90"
    >
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-2.5 gap-y-1 px-4 py-2 text-center">
        <span className="text-[13px] font-extrabold tracking-[-0.01em] text-cream sm:text-[13.5px]">
          {settings.promo_banner}
        </span>
        <span className="hidden text-[12.5px] font-semibold text-white/80 sm:inline">
          지금 상담 신청하고 혜택을 받으세요
        </span>
        <span className="text-[12.5px] font-bold underline underline-offset-2">
          자세히 보기 →
        </span>
      </div>
    </Link>
  );
}
