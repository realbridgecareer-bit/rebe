"use client";

import { useEffect } from "react";
import * as ChannelService from "@channel.io/channel-web-sdk-loader";

/**
 * 채널톡 상담 채팅 위젯.
 * NEXT_PUBLIC_CHANNEL_PLUGIN_KEY 가 설정돼 있을 때만 활성화된다.
 * 키는 채널톡 > 설정 > 일반 > 플러그인(또는 웹 설치)에서 발급.
 */
export default function ChannelTalk() {
  useEffect(() => {
    const pluginKey = process.env.NEXT_PUBLIC_CHANNEL_PLUGIN_KEY;
    if (!pluginKey) return; // 키 미설정 시 위젯 비활성(에러 없음)

    ChannelService.loadScript();
    ChannelService.boot({ pluginKey });

    return () => {
      ChannelService.shutdown();
    };
  }, []);

  return null;
}
