"use client";

import { SessionState } from "@/hooks/useCeoAvatar";

interface SessionControlsProps {
  sessionState: SessionState;
  onStart: () => void;
  onStop: () => void;
}

export function SessionControls({
  sessionState,
  onStart,
  onStop,
}: SessionControlsProps) {
  const isInactive = sessionState === "inactive";
  const isConnecting = sessionState === "connecting";

  return (
    <div className="flex justify-center gap-4">
      <button
        onClick={onStart}
        disabled={!isInactive}
        className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
          isInactive
            ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {isConnecting ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            接続中...
          </span>
        ) : (
          "セッション開始"
        )}
      </button>
      <button
        onClick={onStop}
        disabled={isInactive}
        className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
          !isInactive
            ? "bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        セッション終了
      </button>
    </div>
  );
}
