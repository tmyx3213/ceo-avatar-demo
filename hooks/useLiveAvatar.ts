"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import {
  Room,
  RoomEvent,
  Track,
  RemoteTrackPublication,
  RemoteParticipant,
  DataPacket_Kind,
} from "livekit-client";

export type SessionState = "inactive" | "connecting" | "connected";

export interface ChatMessage {
  role: "user" | "avatar";
  content: string;
  timestamp: Date;
}

// "default" | "custom" でサーバー側がIDを解決
export type AvatarVariant = "default" | "custom";

export const useLiveAvatar = (variant: AvatarVariant = "default") => {
  const roomRef = useRef<Room | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const [sessionState, setSessionState] = useState<SessionState>("inactive");
  const [isAvatarTalking, setIsAvatarTalking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
        roomRef.current = null;
      }
    };
  }, []);

  // セッション開始
  const startSession = useCallback(async () => {
    if (sessionState !== "inactive") return;

    setSessionState("connecting");

    try {
      // APIからセッション情報を取得（variantでサーバー側がID解決）
      const res = await fetch("/api/liveavatar-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create session");
      }

      const { session_id, livekit_url, livekit_client_token } =
        await res.json();

      sessionIdRef.current = session_id;

      // LiveKit Roomを作成して接続
      const room = new Room();
      roomRef.current = room;

      // ビデオトラック受信ハンドラ
      room.on(
        RoomEvent.TrackSubscribed,
        (
          track: RemoteTrackPublication["track"],
          _publication: RemoteTrackPublication,
          _participant: RemoteParticipant
        ) => {
          if (!track) return;

          if (track.kind === Track.Kind.Video && videoRef.current) {
            track.attach(videoRef.current);
            setSessionState("connected");
          }

          if (track.kind === Track.Kind.Audio) {
            // 音声トラックはデフォルト出力に接続
            const audioEl = track.attach();
            audioEl.style.display = "none";
            document.body.appendChild(audioEl);
          }
        }
      );

      // 切断ハンドラ
      room.on(RoomEvent.Disconnected, () => {
        setSessionState("inactive");
        setIsAvatarTalking(false);
        roomRef.current = null;
        sessionIdRef.current = null;
      });

      // データメッセージ受信ハンドラ（アバターイベント）
      room.on(
        RoomEvent.DataReceived,
        (
          payload: Uint8Array,
          _participant?: RemoteParticipant,
          _kind?: DataPacket_Kind,
          topic?: string
        ) => {
          if (topic !== "agent-response") return;

          try {
            const message = JSON.parse(new TextDecoder().decode(payload));

            if (message.event_type === "avatar.speak_started") {
              setIsAvatarTalking(true);
            } else if (message.event_type === "avatar.speak_ended") {
              setIsAvatarTalking(false);
            }
          } catch {
            // パースエラーは無視
          }
        }
      );

      await room.connect(livekit_url, livekit_client_token);
    } catch (error) {
      console.error("Failed to start LiveAvatar session:", error);
      setSessionState("inactive");
      roomRef.current = null;
      sessionIdRef.current = null;
    }
  }, [sessionState, variant]);

  // セッション終了
  const stopSession = useCallback(async () => {
    if (!roomRef.current) return;

    try {
      roomRef.current.disconnect();
    } catch (error) {
      console.error("Failed to stop LiveAvatar session:", error);
    } finally {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setSessionState("inactive");
      setIsAvatarTalking(false);
      setMessages([]);
      roomRef.current = null;
      sessionIdRef.current = null;
    }
  }, []);

  // アバターに発話させる（FULLモード: agent-controlトピックへavatar.speak_textを送信）
  const speak = useCallback(async (text: string) => {
    if (!roomRef.current || !sessionIdRef.current) return;

    try {
      const data = new TextEncoder().encode(
        JSON.stringify({
          event_type: "avatar.speak_text",
          session_id: sessionIdRef.current,
          text,
        })
      );

      await roomRef.current.localParticipant.publishData(data, {
        topic: "agent-control",
      });
    } catch (error) {
      console.error("Failed to speak:", error);
    }
  }, []);

  // メッセージを追加
  const addMessage = useCallback(
    (role: "user" | "avatar", content: string) => {
      setMessages((prev) => [
        ...prev,
        { role, content, timestamp: new Date() },
      ]);
    },
    []
  );

  return {
    variant,
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
