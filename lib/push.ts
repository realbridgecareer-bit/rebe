// Web Push 공용 값. VAPID '공개키'는 노출돼도 안전하므로 코드에 둔다.
// (개인키는 서버 환경변수 VAPID_PRIVATE_KEY 로만 사용 — 저장소에 넣지 않음)
export const VAPID_PUBLIC_KEY =
  "BBlKjWnhjjH1_ufkF-o2AmyRtLZaGOl1Z2Q79cy4TqdayazdQ9FT0UkvmHgcTJxu-RsEBls84CoIXPXFPzQQISE";

// base64url VAPID 공개키 → Uint8Array (pushManager.subscribe에 필요)
export function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}
