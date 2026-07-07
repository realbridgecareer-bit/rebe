// REBE 최소 서비스워커 — PWA 설치 가능 목적.
// 캐시로 인한 오래된 화면(stale) 문제를 막기 위해 '네트워크 우선'만 사용한다.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(
      () =>
        new Response("오프라인 상태입니다. 네트워크 연결을 확인해 주세요.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        }),
    ),
  );
});
