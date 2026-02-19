// アバター設定（後で差し替え可能）
export const AVATAR_CONFIG = {
  avatarName: "Ann_Therapist_public", // 後でカスタムIDに差し替え可能
  language: "ja", // 日本語
  voice: {
    rate: 1.0,
    emotion: "FRIENDLY" as const,
  },
};

// HeyGen SDK用の設定
export const getAvatarConfig = () => ({
  quality: "high" as const,
  avatarName: AVATAR_CONFIG.avatarName,
  language: AVATAR_CONFIG.language,
  voice: {
    rate: AVATAR_CONFIG.voice.rate,
    emotion: AVATAR_CONFIG.voice.emotion,
  },
  activityIdleTimeout: 300, // 5分間操作がない場合にセッション終了
});
