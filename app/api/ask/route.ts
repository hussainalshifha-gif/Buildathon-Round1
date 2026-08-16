import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body.message;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await client.responses.create({
      model: "gpt-5.6",
      input: `You are EduPlus AI, a helpful educational assistant for students.

Answer the student's question clearly and simply.
Use examples when helpful.
Keep the answer educational and easy to understand.
If the student is confused, explain step-by-step.

Student question:
${message.trim()}`,
    });

    return NextResponse.json({
      reply: response.output_text,
    });
  } catch (error) {
    console.error("OPENAI ERROR DETAILS:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}