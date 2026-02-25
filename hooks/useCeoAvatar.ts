"use client";

import { useLiveAvatar } from "./useLiveAvatar";

export type { SessionState, ChatMessage } from "./useLiveAvatar";

// デフォルトアバターでLiveAvatarを使用
export const useCeoAvatar = () => useLiveAvatar("default");
