import type { Metadata } from "next";
import "./globals.css";
import ChannelTalk from "@/components/channel-talk";

export const metadata: Metadata = {
  title: {
    default: "Real Bridge (REBE) | 부동산·금융 취업컨설팅",
    template: "%s | Real Bridge",
  },
  description:
    "부동산·금융업 현직자 100명+ 네트워크 기반 취업컨설팅. 현직자가 직접 알려주는 합격 전략, Real Bridge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <ChannelTalk />
      </body>
    </html>
  );
}
