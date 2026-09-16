"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface PromptExample {
  label: string;
  prompt: string;
  intent: string;
  files: { path: string; status: string }[];
  previewTitle: string;
  previewDesc: string;
}

const PROMPT_EXAMPLES: PromptExample[] = [
  {
    label: "table booking system",
    prompt: "Build a table booking page for a small restaurant, warm and simple",
    intent: "Reading intent… 3 pages, 1 form, 1 confirmation state",
    files: [
      { path: "/pages/book.tsx", status: "created" },
      { path: "/components/DateGrid.tsx", status: "created" },
      { path: "/lib/availability.ts", status: "created" },
    ],
    previewTitle: "Book a table",
    previewDesc: "Choose a date, party size, and time",
  },
  {
    label: "e-commerce storefront",
    prompt: "Design an e-commerce storefront for minimalist homeware products",
    intent: "Reading intent… 4 pages, catalog grid, cart drawer",
    files: [
      { path: "/pages/shop.tsx", status: "created" },
      { path: "/components/ProductGrid.tsx", status: "created" },
      { path: "/lib/cart.ts", status: "created" },
    ],
    previewTitle: "Northwind Goods",
    previewDesc: "Curated homeware for intentional living",
  },
  {
    label: "analytics dashboard",
    prompt: "Create a SaaS analytics dashboard with revenue charts and metrics",
    intent: "Reading intent… 5 metrics, 2 chart views, activity feed",
    files: [
      { path: "/pages/dashboard.tsx", status: "created" },
      { path: "/components/MetricCards.tsx", status: "created" },
      { path: "/lib/analytics.ts", status: "created" },
    ],
    previewTitle: "InstaCore Overview",
    previewDesc: "Real-time metrics and monthly growth",
  },
];

export function Hero() {
  const router = useRouter();
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeExample = PROMPT_EXAMPLES[selectedExampleIndex];

  async function handleSubmit(event?: React.FormEvent, promptOverride?: string) {
    if (event) event.preventDefault();
    const effectivePrompt =
      promptOverride || activeExample.prompt || "Build a table booking page for a small restaurant, warm and simple";
    setIsSubmitting(true);

    try {
      const uniqueId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

      const words = effectivePrompt
        .replace(/^(build|create|design|make)\s+(a|an|the)?\s*/i, "")
        .split(/\s+/)
        .slice(0, 4)
        .join(" ");
      const derivedName = words ? words.charAt(0).toUpperCase() + words.slice(1) : "New Klyro Project";

      const { createProject } = await import("@/lib/supabase/db");
      const newProject = await createProject({
        id: uniqueId,
        name: derivedName,
        description: effectivePrompt,
        type: "Web Application",
        status: "active",
      });

      router.push(`/project/${newProject.id}?prompt=${encodeURIComponent(effectivePrompt)}`);
    } catch (err) {
      console.error("Failed to create project:", err);
      const fallbackId = `proj_${Date.now()}`;
      router.push(`/project/${fallbackId}?prompt=${encodeURIComponent(effectivePrompt)}`);
    }
  }

  return (
    <section id="hero-builder" className="pt-[92px] pb-[100px] bg-ink">
      <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          {/* LEFT COLUMN: Headline & CTA */}
          <div>
            {/* Eyebrow line */}
            <div className="fade-in d1 flex items-center gap-2.5 font-mono text-[13px] text-fog-dim mb-[22px]">
              <span className="size-1.5 rounded-full bg-amber shrink-0" />
              <span>Built on Gemini 3.5 Flash</span>
            </div>

            {/* Headline - single visual weight throughout */}
            <h1 className="hero-title fade-in d2 font-serif font-normal text-[38px] sm:text-[48px] lg:text-[58px] leading-[1.07] tracking-[-0.01em] text-cream max-w-[13ch]">
              Describe it.
              <br />
              Klyro builds it.
            </h1>

            {/* Supporting Copy */}
            <p className="fade-in d3 mt-[26px] max-w-[46ch] text-[17.5px] text-fog leading-[1.6]">
              Type what you need in plain language. Klyro writes the code, wires up the pages, and hands you a working
              app you can click through in under a minute.
            </p>

            {/* CTA Group */}
            <div className="fade-in d3 mt-[36px] flex items-center gap-[26px] flex-wrap">
              <button
                type="button"
                onClick={() => handleSubmit(undefined, activeExample.prompt)}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 font-sans font-medium text-[14.5px] px-5 py-2.5 rounded-sm bg-amber text-[#201404] hover:bg-amber-deep transition-colors cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? "Starting Klyro..." : "Start building"}
              </button>
              <a
                href="#how"
                className="text-[14.5px] text-fog border-b border-slate-line pb-0.5 hover:text-cream hover:border-fog-dim transition-colors"
              >
                See how it works
              </a>
            </div>

            {/* Example Prompts row */}
            <div className="fade-in d3 mt-[44px] pt-[24px] border-t border-slate-line flex gap-3 sm:gap-7 flex-wrap items-center">
              <span className="font-mono text-[12.5px] text-fog-dim">Try a prompt:</span>
              {PROMPT_EXAMPLES.map((example, index) => (
                <button
                  key={example.label}
                  type="button"
                  onClick={() => setSelectedExampleIndex(index)}
                  className={cn(
                    "font-mono text-[12.5px] border rounded-sm px-2.5 py-1 transition-all cursor-pointer",
                    selectedExampleIndex === index
                      ? "border-amber text-amber bg-amber/5"
                      : "border-slate-line text-fog hover:text-cream hover:border-fog-dim"
                  )}
                >
                  {example.label}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Terminal & Preview Mockup */}
          <div className="fade-in d3 bg-[#0e0f16] border border-slate-line rounded-md overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">
            {/* Terminal Top Bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-line">
              <span className="size-[9px] rounded-full bg-[#3a3f4b]" />
              <span className="size-[9px] rounded-full bg-[#3a3f4b]" />
              <span className="size-[9px] rounded-full bg-[#3a3f4b]" />
              <span className="ml-2 font-mono text-xs text-fog-dim">klyro — prompt.md</span>
            </div>

            {/* Terminal Body */}
            <div className="p-5 pb-1 font-mono text-[13px] leading-[1.75]">
              <div className="text-fog flex items-start gap-2">
                <span className="text-amber shrink-0 select-none">›</span>
                <span className="text-cream">{activeExample.prompt}</span>
              </div>
              <div className="text-fog-dim mt-1.5">{activeExample.intent}</div>
              {activeExample.files.map((file) => (
                <div key={file.path} className="text-fog-dim mt-1.5">
                  <span className="text-[#7fb3a3]">{file.path}</span>{" "}
                  <span className="text-amber">{file.status}</span>
                </div>
              ))}
            </div>

            {/* In-Terminal Preview Window */}
            <div className="m-4 sm:m-5 border border-slate-line rounded-sm overflow-hidden bg-paper">
              <div className="flex gap-2 px-3 py-2 bg-paper-line">
                <span className="size-[7px] rounded-full bg-black/15" />
                <span className="size-[7px] rounded-full bg-black/15" />
                <span className="size-[7px] rounded-full bg-black/15" />
              </div>
              <div className="p-4 sm:p-5 text-ink">
                <h4 className="font-serif font-semibold text-base mb-1 text-[#16181f]">
                  {activeExample.previewTitle}
                </h4>
                <p className="text-xs text-[#5b5f6b] mb-2.5">{activeExample.previewDesc}</p>
                <div className="flex gap-2">
                  <div className="h-7 flex-1 rounded-sm bg-[#14161f]/[0.08]" />
                  <div className="h-7 flex-1 rounded-sm bg-[#14161f]/[0.08]" />
                  <div className="h-7 w-[70px] shrink-0 rounded-sm bg-amber" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
