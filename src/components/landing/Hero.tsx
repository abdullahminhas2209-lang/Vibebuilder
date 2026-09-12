"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Cpu,
  Paperclip,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { TypewriterText } from "@/components/landing/TypewriterText";

const QUICK_ACTIONS = [
  { label: "SaaS Analytics Dashboard", prompt: "Create a modern SaaS analytics dashboard with revenue charts, active user metrics, and team management settings." },
  { label: "Restaurant & Table Booking", prompt: "Build a luxury restaurant website with seasonal menu, wood-fired kitchen story, and online table reservation flow." },
  { label: "Developer Portfolio", prompt: "Build a minimal developer portfolio with interactive project showcase, tech stack badges, and contact modal." },
  { label: "E-Commerce Store", prompt: "Design a high-converting e-commerce storefront for homeware products with product grid, cart drawer, and checkout." },
  { label: "Fitness Studio Landing", prompt: "Build a fitness studio landing page with class schedule, coach bios, membership tiers, and free trial booking." },
];

export function Hero() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event?: React.FormEvent) {
    if (event) event.preventDefault();
    const trimmed = prompt.trim();
    setIsSubmitting(true);
    const targetUrl = trimmed
      ? `/project/demo?prompt=${encodeURIComponent(trimmed)}`
      : `/project/demo?prompt=${encodeURIComponent("Build a modern SaaS product with landing page and dashboard")}`;
    router.push(targetUrl);
  }

  function handleSelectQuickAction(item: typeof QUICK_ACTIONS[0]) {
    setPrompt(item.prompt);
  }

  return (
    <section id="hero-builder" className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden"
      >
        <div className="h-[520px] w-[1100px] -translate-y-1/3 rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/15 to-blue-500/20 blur-[120px] animate-pulse-glow" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Top Header / Badge */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 dark:border-indigo-900/50 dark:bg-indigo-950/40 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <span className="flex size-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>Klyro AI · Next-Gen App Builder</span>
          </div>

          <h1 className="mt-5 max-w-5xl text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl lg:text-6xl">
            From prompt to{" "}
            <TypewriterText />
          </h1>

          <p className="mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            Describe what you want to build. Klyro turns your idea into a working, interactive product in seconds.
          </p>
        </div>

        {/* ============================================================================== */}
        {/* HERO COMMAND CENTER / PROMPT BAR                                               */}
        {/* ============================================================================== */}
        <div className="mt-10 mx-auto max-w-3xl">
          <form
            onSubmit={handleSubmit}
            className="group relative rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-3.5 shadow-[0_12px_40px_-10px_rgba(99,102,241,0.12)] backdrop-blur-xl transition-all duration-300 hover:border-indigo-400/80 hover:shadow-[0_16px_50px_-5px_rgba(99,102,241,0.22)] focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/15 focus-within:shadow-[0_20px_60px_-5px_rgba(99,102,241,0.28)]"
          >
            <div className="flex items-start gap-3 px-2 pt-1">
              <textarea
                id="hero-prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                rows={2}
                placeholder="What do you want to build? (e.g. Build a modern restaurant website with online reservation...)"
                className="w-full resize-none border-0 bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-0 leading-relaxed transition-colors"
              />
            </div>

            {/* Bottom Bar inside Prompt */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-2.5 px-2">
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 active:scale-90"
                  title="Attach screenshot or reference"
                >
                  <Paperclip className="size-4" />
                </Button>
                <div className="hidden sm:inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 transition-colors">
                  <Cpu className="size-3 text-indigo-500" />
                  <span>Gemini 3.5 Flash</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.03] hover:shadow-indigo-500/40 active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent mr-1.5" />
                    Opening Klyro...
                  </>
                ) : (
                  <>
                    <span>Build with Klyro</span>
                    <ArrowRight className="size-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Quick Action Pills */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Suggestions:</span>
            {QUICK_ACTIONS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleSelectQuickAction(item)}
                className="inline-flex items-center rounded-full border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-400 hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-md hover:scale-[1.02] active:scale-95"
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
