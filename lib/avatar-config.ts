import { AvatarQuality, VoiceEmotion } from "@heygen/streaming-avatar";

// アバター設定（後で差し替え可能）
export const AVATAR_CONFIG = {
  avatarName: "6faf9b31-edde-450b-a5d4-0e342eca78b7", // カスタムCEOアバター
  language: "ja", // 日本語
  voice: {
    rate: 1.0,
    emotion: VoiceEmotion.FRIENDLY,
  },
};

// HeyGen SDK用の設定
export const getAvatarConfig = () => ({
  quality: AvatarQuality.High,
  avatarName: AVATAR_CONFIG.avatarName,
  language: AVATAR_CONFIG.language,
  voice: {
    rate: AVATAR_CONFIG.voice.rate,
    emotion: AVATAR_CONFIG.voice.emotion,
  },
  activityIdleTimeout: 300, // 5分間操作がない場合にセッション終了
});
