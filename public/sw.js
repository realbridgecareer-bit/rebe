// REBE 최소 서비스워커 — PWA 설치 목적.
// 외부 요청(Supabase 등)과 POST는 절대 가로채지 않는다(헤더 손상·인증 오류 방지).
// 같은 출처(내 사이트)의 GET만 네트워크 우선으로 처리한다.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

// 푸시 알림 수신 → 알림 표시
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {};
  }
  const title = data.title || "새 상담 신청";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || "새로운 상담 신청이 접수되었습니다.",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: data.url || "/admin" },
    }),
  );
});

// 알림 클릭 → 관리자 페이지 열기(이미 열려 있으면 포커스)
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/admin";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url.includes("/admin") && "focus" in c) return c.focus();
      }
      return self.clients.openWindow(url);
    }),
  );
});
self.addEventListener("fetch", (event) => {
  const req = event.request;
  let url;
  try {
    url = new URL(req.url);
  } catch {
    return;
  }
  // 외부 도메인(Supabase 등) 또는 GET이 아닌 요청은 개입하지 않음 → 브라우저가 그대로 처리
  if (req.method !== "GET" || url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(req).catch(
      () =>
        new Response("오프라인 상태입니다. 네트워크 연결을 확인해 주세요.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        }),
    ),
  );
});
