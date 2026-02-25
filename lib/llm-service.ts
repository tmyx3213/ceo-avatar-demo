export interface LLMResponse {
  answer: string;
  conversationId: string;
}

/**
 * LLM応答を取得する（Dify API経由）
 * variant で使用するDifyアプリを切り替え
 */
export async function getLLMResponse(
  message: string,
  conversationId?: string,
  variant: "default" | "custom" = "default"
): Promise<LLMResponse> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: message,
      conversation_id: conversationId,
      variant,
    }),
  });

  if (!res.ok) {
    throw new Error(`Chat API returned ${res.status}`);
  }

  const data = await res.json();

  return {
    answer: data.answer,
    conversationId: data.conversation_id,
  };
}

/**
 * 初回挨拶メッセージ
 */
export function getGreetingMessage(): string {
  return "こんにちは。本日はお越しいただきありがとうございます。何でもお気軽にご質問ください。";
}
