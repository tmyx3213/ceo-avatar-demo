import { NextRequest, NextResponse } from "next/server";
import {
  LIVEAVATAR_MODE,
  getAvatarConfigByVariant,
  type AvatarVariant,
} from "@/lib/liveavatar-config";

const LIVEAVATAR_API_KEY = process.env.LIVEAVATAR_API_KEY;
const LIVEAVATAR_BASE_URL = process.env.LIVEAVATAR_BASE_URL;

export async function POST(request: NextRequest) {
  try {
    if (!LIVEAVATAR_API_KEY || !LIVEAVATAR_BASE_URL) {
      throw new Error("LiveAvatar API key or base URL is missing from .env");
    }

    const body = await request.json().catch(() => ({}));
    const variant: AvatarVariant = body.variant === "custom" ? "custom" : "default";
    const { avatarId, voiceId } = getAvatarConfigByVariant(variant);

    // Step 1: セッショントークンを取得
    const tokenRes = await fetch(`${LIVEAVATAR_BASE_URL}/v1/sessions/token`, {
      method: "POST",
      headers: {
        "X-API-KEY": LIVEAVATAR_API_KEY,
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: LIVEAVATAR_MODE,
        avatar_id: avatarId,
        avatar_persona: {
          voice_id: voiceId,
        },
      }),
    });

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      throw new Error(
        `Failed to get session token: ${tokenRes.status} ${errorText}`
      );
    }

    const tokenData = await tokenRes.json();
    const sessionToken = tokenData.data.session_token;
    const sessionId = tokenData.data.session_id;

    // Step 2: セッションを開始してLiveKit接続情報を取得
    const startRes = await fetch(`${LIVEAVATAR_BASE_URL}/v1/sessions/start`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${sessionToken}`,
        accept: "application/json",
      },
    });

    if (!startRes.ok) {
      const errorText = await startRes.text();
      throw new Error(
        `Failed to start session: ${startRes.status} ${errorText}`
      );
    }

    const startData = await startRes.json();

    return NextResponse.json({
      session_id: sessionId,
      session_token: sessionToken,
      livekit_url: startData.data.livekit_url,
      livekit_client_token: startData.data.livekit_client_token,
    });
  } catch (error) {
    console.error("Error creating LiveAvatar session:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create session",
      },
      { status: 500 }
    );
  }
}
