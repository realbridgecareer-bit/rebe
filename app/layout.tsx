import type { Metadata, Viewport } from "next";
import "./globals.css";
import ChannelTalk from "@/components/channel-talk";
import PromoBanner from "@/components/promo-banner";
import SwRegister from "@/components/sw-register";

export const metadata: Metadata = {
  title: {
    default: "Real Bridge (REBE) | 부동산·금융 취업컨설팅",
    template: "%s | Real Bridge",
  },
  description:
    "부동산·금융업 현직자 100명+ 네트워크 기반 취업컨설팅. 현직자가 직접 알려주는 합격 전략, Real Bridge.",
  appleWebApp: { capable: true, title: "REBE 관리자", statusBarStyle: "default" },
  icons: { apple: "/icons/apple-touch-icon.png" },
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
