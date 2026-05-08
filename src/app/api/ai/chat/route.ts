import { NextRequest, NextResponse } from "next/server";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[HireAI] Missing GEMINI_API_KEY");
      return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
    }

    const body = await req.json();

    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[HireAI] Gemini API error:", JSON.stringify(data));
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[HireAI] Unexpected server error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}