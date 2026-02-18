"use client";

import { useState, FormEvent, KeyboardEvent } from "react";

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  isProcessing: boolean;
}

export function MessageInput({
  onSend,
  disabled,
  isProcessing,
}: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isProcessing) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled
              ? "セッションを開始してください"
              : "質問を入力してください..."
          }
          disabled={disabled}
          rows={1}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
          }`}
        />
      </div>
      <button
        type="submit"
        disabled={disabled || !message.trim() || isProcessing}
        className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
          disabled || !message.trim() || isProcessing
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
        }`}
      >
        {isProcessing ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            処理中
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            送信
          </>
        )}
      </button>
    </form>
  );
}
