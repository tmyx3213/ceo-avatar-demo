"use client";

import { useEffect, useRef } from "react";
import { ChatMessage } from "@/hooks/useCeoAvatar";

interface ChatHistoryProps {
  messages: ChatMessage[];
}

export function ChatHistory({ messages }: ChatHistoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 新しいメッセージが追加されたら自動スクロール
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-medium text-gray-700">会話履歴</h3>
      </div>
      <div
        ref={scrollRef}
        className="h-48 overflow-y-auto p-4 space-y-3 chat-history"
      >
        {messages.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">
            会話を開始すると、ここに履歴が表示されます
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "avatar" && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-xs font-bold">社長</span>
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 text-xs font-bold">あなた</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
