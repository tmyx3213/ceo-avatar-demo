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
  const [conversationId, setConversationId] = useState<string | undefined>();

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
      setConversationId(undefined);
    }
  }, [sessionState, hasGreeted, addMessage, speak]);

  // メッセージ送信
  const handleSendMessage = useCallback(
    async (message: string) => {
      if (sessionState !== "connected" || isProcessing) return;

      setIsProcessing(true);
      addMessage("user", message);

      try {
        const { answer, conversationId: newConversationId } =
          await getLLMResponse(message, conversationId);
        setConversationId(newConversationId);
        addMessage("avatar", answer);
        await speak(answer);
      } catch (error) {
        console.error("Failed to get response:", error);
        addMessage("avatar", "申し訳ございません。エラーが発生しました。");
      } finally {
        setIsProcessing(false);
      }
    },
    [sessionState, isProcessing, conversationId, addMessage, speak]
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* ヘッダー */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-4 h-full">
          {/* 左カラム: アバター + コントロール */}
          <div className="lg:w-[58%] flex flex-col gap-4">
            <section className="flex-1 min-h-0">
              <AvatarDisplay
                videoRef={videoRef}
                sessionState={sessionState}
                isAvatarTalking={isAvatarTalking}
              />
            </section>
            <section className="flex-shrink-0">
              <SessionControls
                sessionState={sessionState}
                onStart={startSession}
                onStop={stopSession}
              />
            </section>
          </div>
          {/* 右カラム: チャット + 入力 */}
          <div className="lg:w-[42%] flex flex-col gap-3 min-h-0">
            <section className="flex-1 min-h-0">
              <ChatHistory messages={messages} />
            </section>
            <section className="flex-shrink-0">
              <MessageInput
                onSend={handleSendMessage}
                disabled={sessionState !== "connected"}
                isProcessing={isProcessing || isAvatarTalking}
              />
            </section>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="flex-shrink-0 bg-white border-t border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          Powered by HeyGen Interactive Avatar
        </div>
      </footer>
    </div>
  );
}
