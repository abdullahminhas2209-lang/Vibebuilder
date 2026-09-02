import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are VibeBuilder AI — an expert frontend engineer specializing in React, Next.js, and Tailwind CSS.

When a user describes a website or app they want to build, you will:
1. Briefly explain what you're building (2-3 sentences)
2. Generate the complete component code

Always wrap each file in a code block with the filename on the first line like this:

\`\`\`tsx
// app/page.tsx
<file content here>
\`\`\`

Rules:
- Use React functional components with TypeScript
- Use Tailwind CSS for all styling
- Keep components clean, modern, and production-quality
- Generate at minimum: app/page.tsx and at least 2 components
- Always use "use client" directive where needed
- Export components as named exports
- Do not import external libraries other than react and lucide-react
- Make the UI look polished and professional`;

const SUPPORTED_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-2.5-flash",
  "gemini-flash-latest",
];

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as {
      messages: { role: "user" | "assistant"; content: string }[];
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Build conversation history (all but last message)
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : ("user" as const),
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    // Try primary and fallback models in case of temporary rate limits or deprecations
    let streamResult = null;
    let lastError = null;

    for (const modelName of SUPPORTED_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_PROMPT,
        });

        const chat = model.startChat({ history });
        streamResult = await chat.sendMessageStream(lastMessage.content);
        if (streamResult) break;
      } catch (err) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying next fallback...`);
      }
    }

    if (!streamResult) {
      throw lastError || new Error("All Gemini models failed to respond.");
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamResult.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate response",
      },
      { status: 500 }
    );
  }
}
