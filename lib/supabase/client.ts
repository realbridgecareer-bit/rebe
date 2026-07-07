import { createBrowserClient } from "@supabase/ssr";

/**
 * 브라우저(클라이언트 컴포넌트)에서 사용하는 Supabase 클라이언트.
 * 환경변수가 설정되지 않으면 호출 시점에 에러를 던집니다.
 * (NEXT_PUBLIC_* 값은 빌드 시 주입되므로, 환경변수 변경 후에는 재빌드가 필요합니다.)
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase 환경변수가 없습니다. .env.local에 NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 를 설정하세요.",
    );
  }

  return createBrowserClient(url, anonKey);
}
