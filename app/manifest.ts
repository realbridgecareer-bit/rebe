import type { MetadataRoute } from "next";

// PWA(설치형 웹앱) 매니페스트. 설치 시 /admin으로 바로 열리는 관리자 앱.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "REBE 관리자",
    short_name: "REBE 관리자",
    description: "Real Bridge(REBE) 관리자 — 상담·합격사례·서비스·후기·할인 관리",
    start_url: "/admin",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FAF6EE",
    theme_color: "#2F3A2E",
    lang: "ko",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
