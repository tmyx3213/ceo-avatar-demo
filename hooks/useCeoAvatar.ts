"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import StreamingAvatar, {
  StreamingEvents,
  TaskType,
  TaskMode,
} from "@heygen/streaming-avatar";
import { getAvatarConfig } from "@/lib/avatar-config";

export type SessionState = "inactive" | "connecting" | "connected";

export interface ChatMessage {
  role: "user" | "avatar";
  content: string;
  timestamp: Date;
}

export const useCeoAvatar = () => {
  const avatarRef = useRef<StreamingAvatar | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [sessionState, setSessionState] = useState<SessionState>("inactive");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isAvatarTalking, setIsAvatarTalking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // ストリームをビデオ要素にバインド
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // アクセストークンを取得
  const fetchAccessToken = async (): Promise<string> => {
    const response = await fetch("/api/get-access-token", {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch access token");
    }
    return response.text();
  };

  // ストリーム準備完了ハンドラ
  const handleStreamReady = useCallback(
    ({ detail }: { detail: MediaStream }) => {
      setStream(detail);
      setSessionState("connected");
    },
    []
  );

  // 切断ハンドラ
  const handleDisconnected = useCallback(() => {
    setStream(null);
    setSessionState("inactive");
    setIsAvatarTalking(false);
    avatarRef.current = null;
  }, []);

  // セッション開始
  const startSession = useCallback(async () => {
    if (sessionState !== "inactive") {
      return;
    }

    setSessionState("connecting");

    try {
      const token = await fetchAccessToken();

      avatarRef.current = new StreamingAvatar({
        token,
        basePath: process.env.NEXT_PUBLIC_BASE_API_URL,
      });

      // イベントリスナー登録
      avatarRef.current.on(StreamingEvents.STREAM_READY, handleStreamReady);
      avatarRef.current.on(
        StreamingEvents.STREAM_DISCONNECTED,
        handleDisconnected
      );
      avatarRef.current.on(StreamingEvents.AVATAR_START_TALKING, () => {
        setIsAvatarTalking(true);
      });
      avatarRef.current.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
        setIsAvatarTalking(false);
      });

      // アバター設定
      const config = getAvatarConfig();
      await avatarRef.current.createStartAvatar(config);
    } catch (error) {
      console.error("Failed to start session:", error);
      setSessionState("inactive");
    }
  }, [sessionState, handleStreamReady, handleDisconnected]);

  // セッション終了
  const stopSession = useCallback(async () => {
    if (!avatarRef.current) return;

    try {
      avatarRef.current.off(StreamingEvents.STREAM_READY, handleStreamReady);
      avatarRef.current.off(
        StreamingEvents.STREAM_DISCONNECTED,
        handleDisconnected
      );
      await avatarRef.current.stopAvatar();
    } catch (error) {
      console.error("Failed to stop session:", error);
    } finally {
      setStream(null);
      setSessionState("inactive");
      setIsAvatarTalking(false);
      setMessages([]);
      avatarRef.current = null;
    }
  }, [handleStreamReady, handleDisconnected]);

  // アバターに発話させる（REPEATモード：渡されたテキストをそのまま読み上げる）
  const speak = useCallback(async (text: string) => {
    if (!avatarRef.current) return;

    try {
      await avatarRef.current.speak({
        text,
        taskType: TaskType.REPEAT,  // REPEAT = 渡されたテキストを読み上げる（自前LLM用）
        taskMode: TaskMode.SYNC,
      });
    } catch (error) {
      console.error("Failed to speak:", error);
    }
  }, []);

  // メッセージを追加
  const addMessage = useCallback(
    (role: "user" | "avatar", content: string) => {
      setMessages((prev) => [...prev, { role, content, timestamp: new Date() }]);
    },
    []
  );

  return {
    videoRef,
    sessionState,
    isAvatarTalking,
    messages,
    startSession,
    stopSession,
    speak,
    addMessage,
  };
};
