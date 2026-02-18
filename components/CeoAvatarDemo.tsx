"use client";

import { useState, useCallback, useEffect } from "react";
import { useCeoAvatar } from "@/hooks/useCeoAvatar";
import { getLLMResponse, getGreetingMessage } from "@/lib/llm-service";
import { AvatarDisplay } from "./AvatarDisplay";
import { SessionControls } from "./SessionControls";
import { ChatHistory } from "./ChatHistory";
import { MessageInput } from "./MessageInput";

export function CeoAvatarDemo() {
  const {
    videoRef,
    sessionState,
    isAvatarTalking,
    messages,
    startSession,
    stopSession,
    speak,
    addMessage,
  } = useCeoAvatar();

  const [isProcessing, setIsProcessing] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);

  // セッション開始後に挨拶
  useEffect(() => {
    if (sessionState === "connected" && !hasGreeted) {
      const greeting = getGreetingMessage();
      addMessage("avatar", greeting);
      speak(greeting);
      setHasGreeted(true);
    }
    if (sessionState === "inactive") {
      setHasGreeted(false);
    }
  }, [sessionState, hasGreeted, addMessage, speak]);

  // メッセージ送信
  const handleSendMessage = useCallback(
    async (message: string) => {
      if (sessionState !== "connected" || isProcessing) return;

      setIsProcessing(true);
      addMessage("user", message);

      try {
        const response = await getLLMResponse(message);
        addMessage("avatar", response);
        await speak(response);
      } catch (error) {
        console.error("Failed to get response:", error);
        addMessage("avatar", "申し訳ございません。エラーが発生しました。");
      } finally {
        setIsProcessing(false);
      }
    },
    [sessionState, isProcessing, addMessage, speak]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                社長AI アバターデモ
              </h1>
              <p className="text-sm text-gray-500">
                AIアバターとリアルタイムで対話できます
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* アバター表示エリア */}
        <section>
          <AvatarDisplay
            videoRef={videoRef}
            sessionState={sessionState}
            isAvatarTalking={isAvatarTalking}
          />
        </section>

        {/* コントロールボタン */}
        <section>
          <SessionControls
            sessionState={sessionState}
            onStart={startSession}
            onStop={stopSession}
          />
        </section>

        {/* 会話履歴 */}
        <section>
          <ChatHistory messages={messages} />
        </section>

        {/* メッセージ入力 */}
        <section>
          <MessageInput
            onSend={handleSendMessage}
            disabled={sessionState !== "connected"}
            isProcessing={isProcessing || isAvatarTalking}
          />
        </section>
      </main>

      {/* フッター */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          Powered by HeyGen Interactive Avatar
        </div>
      </footer>
    </div>
  );
}
