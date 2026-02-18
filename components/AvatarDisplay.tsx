"use client";

import { RefObject } from "react";
import { SessionState } from "@/hooks/useCeoAvatar";

interface AvatarDisplayProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  sessionState: SessionState;
  isAvatarTalking: boolean;
}

export function AvatarDisplay({
  videoRef,
  sessionState,
  isAvatarTalking,
}: AvatarDisplayProps) {
  const isConnected = sessionState === "connected";
  const isConnecting = sessionState === "connecting";

  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
      {/* ステータスバッジ */}
      {isConnected && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-black/50 text-white text-sm px-3 py-1.5 rounded-full">
          <span
            className={`w-2 h-2 rounded-full ${
              isAvatarTalking ? "bg-green-400 animate-pulse" : "bg-green-400"
            }`}
          />
          <span>{isAvatarTalking ? "発話中" : "接続中"}</span>
        </div>
      )}

      {/* ビデオ要素 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-contain ${
          isConnected ? "opacity-100" : "opacity-0"
        }`}
      >
        <track kind="captions" />
      </video>

      {/* ローディング状態 */}
      {isConnecting && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-white text-sm">接続中...</span>
          </div>
        </div>
      )}

      {/* 未接続状態 */}
      {sessionState === "inactive" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-sm">セッションを開始してください</p>
          </div>
        </div>
      )}
    </div>
  );
}
