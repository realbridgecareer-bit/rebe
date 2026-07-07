import { createBrowserClient } from "@supabase/ssr";

// 공개 프로젝트 URL/anon 키. anon 키는 브라우저에 노출되는 공개용 키이며(데이터는 RLS로 보호),
// 환경변수가 없어도 동작하도록 기본값으로 둔다. 환경변수가 있으면 그 값을 우선 사용한다.
const DEFAULT_URL = "https://rmtzimoozxnrmmfeoroj.supabase.co";
const DEFAULT_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdHppbW9venhucm1tZmVvcm9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzNjM5NTIsImV4cCI6MjA5NzkzOTk1Mn0.AZRcqpSfFP6eAqREjvkP-959UC_A4O-DW2-F_5UqQkU";

/**
 * 브라우저(클라이언트 컴포넌트)에서 사용하는 Supabase 클라이언트.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;
  return createBrowserClient(url, anonKey);
}
