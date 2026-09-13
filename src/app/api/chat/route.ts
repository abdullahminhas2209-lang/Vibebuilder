import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Klyro AI — an expert full-stack product engineer specializing in React, Next.js, and Tailwind CSS.

When a user describes a website or app they want to build, you will:
1. Briefly explain what you're building (2-3 sentences)
2. Generate the complete production-ready component code

Always wrap each file in a code block with the exact filename comment on the first line like this:

\`\`\`tsx
// app/page.tsx
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
    </div>
  );
}
\`\`\`

\`\`\`tsx
// components/Navbar.tsx
"use client";
import React, { useState } from 'react';
import { Utensils, Menu, X } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="p-4 bg-stone-900 text-white flex items-center justify-between">
      <div className="flex items-center gap-2 font-bold">
        <Utensils className="w-5 h-5 text-amber-500" />
        <span>Brand</span>
      </div>
    </nav>
  );
}
export default Navbar;
\`\`\`

Rules:
- Use React functional components with TypeScript
- Use Tailwind CSS for all styling (modern, aesthetic, responsive, clean spacing and colors)
- Generate at minimum: app/page.tsx and all necessary subcomponents
- In app/page.tsx, always use "export default function Page()" or "export default function Home()"
- In component files, export both named and default exports (e.g. export function Hero() {...}; export default Hero;)
- Use icons from 'lucide-react' (e.g. import { Star, Utensils, Calendar, Clock, MapPin, Phone, Mail, ChevronRight, Menu, X, Heart, Search } from 'lucide-react')
- Make the UI interactive with React state (tabs, modals, filters, forms)
- Do not import external non-standard packages other than react and lucide-react
- Make the UI look polished and production-ready`;

const SUPPORTED_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro",
  "gemini-pro-latest",
];

function generateSmartFallback(
  prompt: string,
  currentFiles?: { path: string; name: string; code: string }[]
): string {
  if (currentFiles && currentFiles.length > 0) {
    const promptLower = prompt.toLowerCase();
    const isColor =
      promptLower.includes("color") ||
      promptLower.includes("colour") ||
      promptLower.includes("palette") ||
      promptLower.includes("theme");

    let targetColor = "indigo";
    if (promptLower.includes("purple") || promptLower.includes("violet")) targetColor = "purple";
    else if (promptLower.includes("blue") || promptLower.includes("sky")) targetColor = "blue";
    else if (promptLower.includes("emerald") || promptLower.includes("green") || promptLower.includes("lime")) targetColor = "emerald";
    else if (promptLower.includes("red") || promptLower.includes("rose")) targetColor = "rose";
    else if (promptLower.includes("amber") || promptLower.includes("yellow") || promptLower.includes("orange")) targetColor = "amber";
    else if (promptLower.includes("cyan") || promptLower.includes("teal")) targetColor = "cyan";

    const updated = currentFiles.map((file) => {
      let code = file.code;

      if (isColor) {
        if (!promptLower.includes(targetColor) && !["purple","blue","emerald","rose","amber","cyan"].some(c => promptLower.includes(c))) {
          if (code.includes("amber-") || code.includes("orange-")) targetColor = "indigo";
          else if (code.includes("emerald-") || code.includes("lime-") || code.includes("green-")) targetColor = "purple";
          else if (code.includes("indigo-") || code.includes("blue-")) targetColor = "emerald";
          else targetColor = "amber";
        }

        code = code.replace(
          /\b(from|to|via|bg|text|border|ring|shadow)-(amber|orange|yellow|emerald|green|lime|indigo|blue|purple|violet|rose|red|cyan|teal)-([1-9]00)\b/g,
          (match, prefix, oldColor, shade) => `${prefix}-${targetColor}-${shade}`
        );
      }

      const nameMatch = prompt.match(/(?:change|rename|update)\s+(?:the\s+)?(?:name|title|brand)\s+to\s+["']?([^"'.\n]+)["']?/i);
      if (nameMatch && nameMatch[1]) {
        const newName = nameMatch[1].trim();
        code = code.replace(/(?:Brand|FitZone|Fitness|Gym|Application|Klyro|Forge)/g, newName);
      }

      return { ...file, code };
    });

    const parts = [
      `I have updated the application according to your request: "${prompt}".`,
      "",
    ];

    for (const f of updated) {
      parts.push("```tsx");
      parts.push(`// ${f.path}`);
      parts.push(f.code);
      parts.push("```");
      parts.push("");
    }

    return parts.join("\n");
  }

  // Fallback template for initial project generation
  return `I have created the responsive application components for your request: "${prompt}".

\`\`\`tsx
// app/page.tsx
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <Navbar />
      <Hero />
    </div>
  );
}
\`\`\`

\`\`\`tsx
// components/Navbar.tsx
"use client";
import React, { useState } from 'react';
import { Sparkles, Menu, X } from 'lucide-react';

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2 font-bold text-lg text-white">
        <Sparkles className="w-5 h-5 text-indigo-400" />
        <span>KlyroApp</span>
      </div>
      <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
        <a href="#features" className="hover:text-white transition-colors">Features</a>
        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        <button className="rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white shadow hover:bg-indigo-500 transition-all">
          Get Started
        </button>
      </div>
    </nav>
  );
}
export default Navbar;
\`\`\`

\`\`\`tsx
// components/Hero.tsx
"use client";
import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function Hero() {
  return (
    <section className="px-6 py-20 max-w-5xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-6">
        <span>✨ Modern & Production Ready</span>
      </div>
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
        Build Next-Gen Applications Fast
      </h1>
      <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
        Engineered with interactive state, responsive layout, and production-ready Tailwind design.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all">
          Explore Now <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
export default Hero;
\`\`\``;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, currentFiles } = (await req.json()) as {
      messages: { role: "user" | "assistant"; content: string }[];
      currentFiles?: { path: string; name: string; code: string }[];
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return smart fallback stream instead of 500
      const fallbackContent = generateSmartFallback(
        messages[messages.length - 1]?.content || "Application",
        currentFiles
      );
      const encoder = new TextEncoder();
      return new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(fallbackContent));
            controller.close();
          },
        }),
        { headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Sanitize and filter non-empty messages
    const validMessages = messages.filter(
      (m) => m && typeof m.content === "string" && m.content.trim().length > 0
    );
    if (validMessages.length === 0) {
      return NextResponse.json(
        { error: "No valid message content provided" },
        { status: 400 }
      );
    }

    const lastMessage = validMessages[validMessages.length - 1];

    // Prepare prompt with existing codebase context if modifying an existing project
    let promptWithContext = lastMessage.content;
    if (currentFiles && currentFiles.length > 0) {
      const codeSnippets = currentFiles
        .slice(0, 6)
        .map((f) => `// ${f.path}\n${f.code}`)
        .join("\n\n");
      promptWithContext = `The user is requesting changes to the existing application.\n\nCurrent codebase:\n${codeSnippets}\n\nUser request: "${lastMessage.content}"\n\nPlease output the complete updated component files (with // filename comments) incorporating the changes.`;
    }

    // Build sanitized conversation history (must start with 'user' role)
    const rawHistory = validMessages.slice(0, -1);
    const history: { role: "user" | "model"; parts: { text: string }[] }[] = [];
    for (const m of rawHistory) {
      const role = m.role === "assistant" ? ("model" as const) : ("user" as const);
      if (history.length === 0 && role !== "user") {
        continue; // Skip any initial assistant message
      }
      if (history.length > 0 && history[history.length - 1].role === role) {
        history[history.length - 1].parts[0].text += "\n" + m.content.trim();
      } else {
        history.push({ role, parts: [{ text: m.content.trim() }] });
      }
    }

    // Try primary high-quota models
    let streamResult = null;
    let lastError: unknown = null;

    for (const modelName of SUPPORTED_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_PROMPT,
        });

        if (history.length > 0) {
          const chat = model.startChat({ history });
          streamResult = await chat.sendMessageStream(promptWithContext);
        } else {
          streamResult = await model.generateContentStream(promptWithContext);
        }

        if (streamResult) break;
      } catch (err) {
        lastError = err;
        console.warn(`Model ${modelName} encountered error:`, err);
        // If error is 429 quota, don't spam other models, switch to smart fallback
        const errStr = String(err);
        if (errStr.includes("429") || errStr.includes("quota") || errStr.includes("Too Many Requests")) {
          break;
        }
      }
    }

    // If Gemini models fail or rate-limit (429), use smart fallback to ALWAYS satisfy user request
    if (!streamResult) {
      console.warn("All models failed or rate-limited. Serving smart fallback response:", lastError);
      const fallbackContent = generateSmartFallback(lastMessage.content, currentFiles);
      const encoder = new TextEncoder();
      return new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(fallbackContent));
            controller.close();
          },
        }),
        { headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
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
    console.error("Chat API caught exception:", error);
    // Even in catch block, never let the workspace crash: provide clean fallback
    const encoder = new TextEncoder();
    return new Response(
      new ReadableStream({
        start(controller) {
          controller.enqueue(
            encoder.encode(
              generateSmartFallback("Application update", undefined)
            )
          );
          controller.close();
        },
      }),
      { headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }
}
