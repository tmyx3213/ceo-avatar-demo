// ダミー応答（フェーズ1）
const DUMMY_RESPONSES = [
  "ご質問ありがとうございます。弊社は創業以来、お客様第一主義を貫いてまいりました。今後もその姿勢を大切にしながら、新しい価値を提供してまいります。",
  "それは非常に重要なポイントですね。私たちは常に革新を追求しており、業界のリーダーとして責任を持って取り組んでおります。",
  "おっしゃる通りです。弊社の強みは、優秀な人材と確かな技術力にあります。これからも社会に貢献できるよう努力してまいります。",
  "素晴らしいご質問ですね。私どもは持続可能な成長を目指し、環境への配慮も忘れずに事業を展開しております。",
  "その点については、私も日頃から考えております。デジタル変革の時代において、私たちは常に最新技術を取り入れながら、お客様のニーズにお応えしてまいります。",
];

let responseIndex = 0;

/**
 * LLM応答を取得する
 * フェーズ1: ダミー応答を返す
 * フェーズ2: Dify APIを呼び出す
 */
export async function getLLMResponse(message: string): Promise<string> {
  // フェーズ2: Dify API連携（コメントアウト）
  // const difyApiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY;
  // const difyApiUrl = process.env.NEXT_PUBLIC_DIFY_API_URL;
  //
  // if (difyApiKey && difyApiUrl) {
  //   const response = await fetch(`${difyApiUrl}/v1/chat-messages`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${difyApiKey}`,
  //     },
  //     body: JSON.stringify({
  //       inputs: {},
  //       query: message,
  //       response_mode: "blocking",
  //       user: "ceo-avatar-user",
  //     }),
  //   });
  //
  //   const data = await response.json();
  //   return data.answer;
  // }

  // フェーズ1: ダミー応答
  // 少し遅延を入れてリアル感を出す
  await new Promise((resolve) => setTimeout(resolve, 500));

  const response = DUMMY_RESPONSES[responseIndex];
  responseIndex = (responseIndex + 1) % DUMMY_RESPONSES.length;

  return response;
}

/**
 * 初回挨拶メッセージ
 */
export function getGreetingMessage(): string {
  return "こんにちは。本日はお越しいただきありがとうございます。何でもお気軽にご質問ください。";
}
