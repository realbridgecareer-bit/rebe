import type { Metadata, Viewport } from "next";
import "./globals.css";
import ChannelTalk from "@/components/channel-talk";
import PromoBanner from "@/components/promo-banner";
import SwRegister from "@/components/sw-register";

const SITE_URL = "https://rebe-xi.vercel.app";
const SITE_TITLE = "Real Bridge (REBE) | 부동산·금융 취업컨설팅";
const SITE_DESC =
  "부동산·금융업 현직자 네트워크 기반 취업컨설팅. 현직자가 직접 알려주는 합격 전략, Real Bridge(REBE).";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Real Bridge",
  },
  description: SITE_DESC,
  appleWebApp: { capable: true, title: "REBE 관리자", statusBarStyle: "default" },
  icons: { apple: "/icons/apple-touch-icon.png" },
  openGraph: {
    type: "website",
    siteName: "Real Bridge (REBE)",
    title: SITE_TITLE,
    description: SITE_DESC,
    url: SITE_URL,
    locale: "ko_KR",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Real Bridge (REBE) — 부동산·금융 취업컨설팅" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#2F3A2E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <PromoBanner />
        {children}
        <ChannelTalk />
        <SwRegister />
      </body>
    </html>
  );
}
