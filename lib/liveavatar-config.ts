// アバターのバリアント種別
export type AvatarVariant = "default" | "custom";

export const LIVEAVATAR_MODE = "FULL";

// サーバー側専用: バリアントに応じたアバター設定を返す
export function getAvatarConfigByVariant(variant: AvatarVariant) {
  if (variant === "custom") {
    return {
      avatarId: process.env.CUSTOM_AVATAR_ID!,
      voiceId: process.env.CUSTOM_VOICE_ID!,
    };
  }
  return {
    avatarId: process.env.DEFAULT_AVATAR_ID!,
    voiceId: process.env.DEFAULT_VOICE_ID!,
  };
}

// サーバー側専用: バリアントに応じたDify設定を返す
export function getDifyConfigByVariant(variant: AvatarVariant) {
  if (variant === "custom") {
    return {
      apiKey: process.env.CUSTOM_DIFY_API_KEY!,
      baseUrl: process.env.CUSTOM_DIFY_BASE_URL!,
    };
  }
  return {
    apiKey: process.env.DEFAULT_DIFY_API_KEY!,
    baseUrl: process.env.DEFAULT_DIFY_BASE_URL!,
  };
}
