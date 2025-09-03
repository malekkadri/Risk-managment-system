import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { model, messages } = await req.json();
    console.log("/api/chat request", { model, messages });

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("GROQ_API_KEY is missing");
      return NextResponse.json({ error: "Missing GROQ_API_KEY" }, { status: 500 });
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages }),
    });

    const data = await res.json();
    console.log("Groq response", { status: res.status, data });
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error in /api/chat", error);
    return NextResponse.json(
      { error: "Failed to fetch chat response" },
      { status: 500 }
    );
  }
}
