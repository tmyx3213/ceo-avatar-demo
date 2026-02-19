const DIFY_API_KEY = process.env.DIFY_API_KEY;
const DIFY_BASE_URL = process.env.DIFY_BASE_URL;

export async function POST(request: Request) {
  try {
    if (!DIFY_API_KEY || !DIFY_BASE_URL) {
      throw new Error("Dify API configuration is missing from .env");
    }

    const { query, conversation_id } = await request.json();

    if (!query || typeof query !== "string") {
      return new Response(
        JSON.stringify({ error: "query is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const body: Record<string, unknown> = {
      inputs: {},
      query,
      response_mode: "blocking",
      user: "ceo-avatar-user",
    };

    if (conversation_id) {
      body.conversation_id = conversation_id;
    }

    const res = await fetch(`${DIFY_BASE_URL}/chat-messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DIFY_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Dify API error:", res.status, errorText);
      throw new Error(`Dify API returned ${res.status}`);
    }

    const data = await res.json();

    return new Response(
      JSON.stringify({
        answer: data.answer,
        conversation_id: data.conversation_id,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error calling Dify API:", error);

    return new Response(
      JSON.stringify({ error: "Failed to get AI response" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
