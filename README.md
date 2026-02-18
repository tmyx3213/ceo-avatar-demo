# 社長AI アバターデモ

HeyGen Streaming Avatar SDK を使用して、顧客企業の社長AIアバターがブラウザ上でリアルタイムに喋るデモアプリです。

## デモ画面

```
┌─────────────────────────────────────────────┐
│  [ロゴ]  社長AI アバターデモ                 │  ← ヘッダー
├─────────────────────────────────────────────┤
│     ┌─────────────────────────────────────┐ │
│     │       アバター映像エリア             │ │  ← メイン
│     └─────────────────────────────────────┘ │
│     [セッション開始]  [セッション終了]       │  ← コントロール
├─────────────────────────────────────────────┤
│  会話履歴                                   │
│  ┌─────────────────────────────────────────┐│
│  │ 社長: こんにちは...                     ││  ← 履歴エリア
│  │ あなた: 御社の強みを教えてください       ││
│  └─────────────────────────────────────────┘│
├─────────────────────────────────────────────┤
│  ┌───────────────────────────────┐ [送信]  │  ← 入力エリア
│  └───────────────────────────────┘          │
└─────────────────────────────────────────────┘
```

## 技術スタック

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- @heygen/streaming-avatar SDK

## セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/tmyx3213/ceo-avatar-demo.git
cd ceo-avatar-demo

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.local.example .env.local
# .env.local を編集してAPIキーを設定

# 開発サーバーを起動
npm run dev
```

ブラウザで http://localhost:3000 にアクセス

## 環境変数

`.env.local` に以下を設定：

```env
# HeyGen API（必須）
HEYGEN_API_KEY=your_heygen_api_key
NEXT_PUBLIC_BASE_API_URL=https://api.heygen.com

# Dify API（フェーズ2で使用）
# NEXT_PUBLIC_DIFY_API_KEY=app-xxxxx
# NEXT_PUBLIC_DIFY_API_URL=https://api.dify.ai
```

## 開発フェーズ

### フェーズ1: フロントエンド + アバター連携（現在）

- [x] HeyGen Streaming Avatar SDK 連携
- [x] セッション開始/終了
- [x] テキスト入力 → アバター発話（REPEATモード）
- [x] 会話履歴表示
- [x] ダミーLLM応答

**重要:** `TaskType.REPEAT` を使用して、渡されたテキストをそのまま読み上げます（HeyGenの内蔵LLMは使用しない）。

### フェーズ2: Dify LLM 統合（TODO）

- [ ] `lib/llm-service.ts` を Dify API 呼び出しに変更
- [ ] 会話コンテキストの管理
- [ ] エラーハンドリング強化

#### Dify連携の実装方法

`lib/llm-service.ts` のコメントアウトを解除するだけで連携可能：

```typescript
export async function getLLMResponse(message: string): Promise<string> {
  const difyApiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY;
  const difyApiUrl = process.env.NEXT_PUBLIC_DIFY_API_URL;

  const response = await fetch(`${difyApiUrl}/v1/chat-messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${difyApiKey}`,
    },
    body: JSON.stringify({
      inputs: {},
      query: message,
      response_mode: "blocking",
      user: "ceo-avatar-user",
    }),
  });

  const data = await response.json();
  return data.answer;
}
```

## アバター設定

`lib/avatar-config.ts` でアバターをカスタマイズ可能：

```typescript
export const AVATAR_CONFIG = {
  avatarName: "Ann_Therapist_public",  // アバターID
  language: "ja",                       // 言語
  voice: {
    rate: 1.0,                          // 話速（0.5〜1.5）
    emotion: "FRIENDLY",                // 感情
  },
};
```

## 既知の制限事項

- HeyGen Streaming Avatar SDK はSSMLによるポーズ制御をサポートしていない
- 文章のつなぎ目の間（ま）を細かく制御するには、文章を分割して複数回 `speak()` を呼ぶ必要がある

## ライセンス

MIT
