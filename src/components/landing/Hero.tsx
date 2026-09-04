"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Code2,
  Cpu,
  ExternalLink,
  Eye,
  Globe,
  Layers,
  Lock,
  Monitor,
  Paperclip,
  RotateCw,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Tablet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MockSite } from "@/components/workspace/MockSite";
import { previewConfigs } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

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
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [activeTemplateKey, setActiveTemplateKey] = useState<string>("restaurant-booking");

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
    if (item.label.includes("Restaurant")) setActiveTemplateKey("restaurant-booking");
    else if (item.label.includes("SaaS")) setActiveTemplateKey("saas-analytics");
    else if (item.label.includes("Portfolio")) setActiveTemplateKey("personal-portfolio");
    else if (item.label.includes("E-Commerce")) setActiveTemplateKey("ecommerce-store");
    else if (item.label.includes("Fitness")) setActiveTemplateKey("fitness-landing");
  }

  const activeConfig = (previewConfigs as any)[activeTemplateKey] || (previewConfigs as any)["restaurant-booking"];

  return (
    <section id="hero-builder" className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden"
      >
        <div className="h-[520px] w-[1100px] -translate-y-1/3 rounded-full bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-blue-500/15 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Top Header / Badge */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 dark:border-indigo-900/50 dark:bg-indigo-950/40 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm backdrop-blur-md">
            <span className="flex size-2 rounded-full bg-indigo-500 animate-pulse" />
            <Sparkles className="size-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <span>Klyro AI · Next-Gen App Builder</span>
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
            From prompt to{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              product.
            </span>
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
            className="group relative rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-3.5 shadow-[0_12px_40px_-10px_rgba(99,102,241,0.12)] backdrop-blur-xl transition-all duration-300 hover:border-indigo-400/80 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/15"
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
                className="w-full resize-none border-0 bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-0 leading-relaxed"
              />
            </div>

            {/* Bottom Bar inside Prompt */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-2.5 px-2">
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Attach screenshot or reference"
                >
                  <Paperclip className="size-4" />
                </Button>
                <div className="hidden sm:inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  <Cpu className="size-3 text-indigo-500" />
                  <span>Gemini 3.5 Flash</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.02] hover:shadow-indigo-500/40"
              >
                {isSubmitting ? (
                  <>
                    <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent mr-1.5" />
                    Opening Klyro...
                  </>
                ) : (
                  <>
                    <span>Build with Klyro</span>
                    <ArrowRight className="size-4 ml-1.5" />
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
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-xs backdrop-blur-md transition-all hover:border-indigo-400 hover:bg-white hover:text-indigo-600 hover:scale-[1.02]"
              >
                <Sparkles className="size-3 text-indigo-500" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ============================================================================== */}
        {/* DASHBOARD PREVIEW CANVAS                                                       */}
        {/* ============================================================================== */}
        <div className="mt-12 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/70 p-2 sm:p-3 shadow-2xl backdrop-blur-xl">
          {/* Browser Window Header */}
          <div className="flex h-12 items-center justify-between gap-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 px-4 border border-slate-200/80 dark:border-slate-800 shadow-xs mb-2">
            {/* Traffic Light Dots */}
            <div className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-rose-400/90" />
              <span className="size-3 rounded-full bg-amber-400/90" />
              <span className="size-3 rounded-full bg-emerald-400/90" />
            </div>

            {/* Address bar */}
            <div className="hidden sm:flex h-7 min-w-0 max-w-sm flex-1 items-center gap-2 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 px-3 text-xs text-slate-500">
              <Lock className="size-3 text-emerald-500 shrink-0" />
              <span className="truncate font-mono text-[11px]">https://klyro.app/preview/{activeTemplateKey}</span>
            </div>

            {/* Viewport & Tabs Switcher */}
            <div className="flex items-center gap-2">
              {/* Tab Switcher: Preview | Code */}
              <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200/60 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all",
                    activeTab === "preview"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                  )}
                >
                  <Eye className="size-3.5" />
                  <span>Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("code")}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all",
                    activeTab === "code"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                  )}
                >
                  <Code2 className="size-3.5" />
                  <span>Code</span>
                </button>
              </div>

              {/* Viewport switcher */}
              <div className="hidden md:flex items-center gap-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewport("desktop")}
                  className={cn(
                    "rounded-md p-1 transition-colors",
                    viewport === "desktop" ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-xs" : "text-slate-400 hover:text-slate-700"
                  )}
                  title="Desktop (100%)"
                >
                  <Monitor className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport("tablet")}
                  className={cn(
                    "rounded-md p-1 transition-colors",
                    viewport === "tablet" ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-xs" : "text-slate-400 hover:text-slate-700"
                  )}
                  title="Tablet (768px)"
                >
                  <Tablet className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport("mobile")}
                  className={cn(
                    "rounded-md p-1 transition-colors",
                    viewport === "mobile" ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-xs" : "text-slate-400 hover:text-slate-700"
                  )}
                  title="Mobile (375px)"
                >
                  <Smartphone className="size-3.5" />
                </button>
              </div>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleSubmit()}
                className="rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Open in full builder workspace"
              >
                <ExternalLink className="size-4" />
              </Button>
            </div>
          </div>

          {/* Canvas Viewport Frame */}
          <div className="relative min-h-[480px] max-h-[580px] overflow-y-auto rounded-2xl bg-white dark:bg-slate-950 p-1 flex justify-center border border-slate-200/70 dark:border-slate-800/80 shadow-inner scrollbar-panel">
            <div
              className={cn(
                "w-full transition-all duration-300 rounded-xl overflow-hidden",
                viewport === "desktop" && "w-full",
                viewport === "tablet" && "max-w-[768px] border border-slate-300 dark:border-slate-700 my-2 shadow-lg",
                viewport === "mobile" && "max-w-[375px] border border-slate-300 dark:border-slate-700 my-2 shadow-xl rounded-2xl"
              )}
            >
              {activeTab === "preview" ? (
                <MockSite config={activeConfig} />
              ) : (
                <div className="bg-slate-950 text-slate-200 p-6 font-mono text-xs leading-relaxed overflow-x-auto h-full">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 text-slate-400">
                    <span>app/page.tsx</span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-indigo-400">TypeScript React</span>
                  </div>
                  <pre>{`import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { MenuSection } from "@/components/MenuSection";
import { ReservationSection } from "@/components/ReservationSection";
import { Footer } from "@/components/Footer";

export default function Page() {
  return (
    <main className="min-h-screen bg-stone-950 text-stone-100">
      <Navbar brand="${activeConfig.brand}" />
      <Hero 
        headline="${activeConfig.headline || "Next Generation AI Experiences"}"
        subtext="${activeConfig.subtext || "Generated in realtime by Klyro AI."}"
      />
      <MenuSection />
      <ReservationSection />
      <Footer />
    </main>
  );
}`}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
