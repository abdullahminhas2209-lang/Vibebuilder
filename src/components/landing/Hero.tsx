"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Cpu, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { BorderTrail } from "@/components/motion-primitives/border-trail";
import { useAuth } from "@/context/AuthContext";

const TYPEWRITER_PLACEHOLDERS = [
  "Build a modern SaaS analytics dashboard with metrics...",
  "Build a luxury restaurant website with seasonal menu & booking...",
  "Build a developer portfolio with dark mode and projects...",
  "Build a high-converting e-commerce storefront for homeware...",
  "Build a fitness studio landing page with class schedules...",
  "Build an AI chatbot platform with live sandbox previews...",
];

const QUICK_ACTIONS = [
  {
    label: "SaaS Analytics Dashboard",
    prompt:
      "Create a modern SaaS analytics dashboard with revenue charts, active user metrics, and team management settings.",
  },
  {
    label: "Restaurant & Table Booking",
    prompt:
      "Build a luxury restaurant website with seasonal menu, wood-fired kitchen story, and online table reservation flow.",
  },
  {
    label: "Developer Portfolio",
    prompt:
      "Build a minimal developer portfolio with interactive project showcase, tech stack badges, and contact modal.",
  },
  {
    label: "Fitness Studio Landing",
    prompt:
      "Build a fitness studio landing page with class schedule, coach bios, membership tiers, and free trial booking.",
  },
];

export function Hero() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isShiftPressedRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Typewriter effect for prompt placeholder
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderText, setPlaceholderText] = useState(TYPEWRITER_PLACEHOLDERS[0]);
  const [isDeletingPlaceholder, setIsDeletingPlaceholder] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentPrompt = TYPEWRITER_PLACEHOLDERS[placeholderIndex];

    if (isDeletingPlaceholder) {
      if (placeholderText.length > 6) {
        timer = setTimeout(() => {
          setPlaceholderText(currentPrompt.slice(0, placeholderText.length - 1));
        }, 18);
      } else {
        timer = setTimeout(() => {
          setIsDeletingPlaceholder(false);
          setPlaceholderIndex((prev) => (prev + 1) % TYPEWRITER_PLACEHOLDERS.length);
        }, 250);
      }
    } else {
      if (placeholderText.length < currentPrompt.length) {
        timer = setTimeout(() => {
          setPlaceholderText(currentPrompt.slice(0, placeholderText.length + 1));
        }, 40);
      } else {
        timer = setTimeout(() => {
          setIsDeletingPlaceholder(true);
        }, 2600);
      }
    }

    return () => clearTimeout(timer);
  }, [placeholderText, isDeletingPlaceholder, placeholderIndex]);

  async function handleSubmit(event?: React.FormEvent, overridePrompt?: string) {
    if (event) event.preventDefault();
    if (isSubmitting) return;

    const rawPrompt = overridePrompt !== undefined ? overridePrompt : prompt;
    const effectivePrompt =
      rawPrompt.trim() || placeholderText || "Build a modern SaaS product with landing page and dashboard";

    const isAuthenticated = Boolean(user || profile);
    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("klyro_pending_prompt", effectivePrompt);
        localStorage.setItem("klyro_pending_prompt", effectivePrompt);
      }
      router.push(`/auth?prompt=${encodeURIComponent(effectivePrompt)}&redirect=project`);
      return;
    }

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
      setIsSubmitting(false);
      const fallbackId = `proj_${Date.now()}`;
      router.push(`/project/${fallbackId}?prompt=${encodeURIComponent(effectivePrompt)}`);
    }
  }

  function handleSelectQuickAction(item: (typeof QUICK_ACTIONS)[0]) {
    setPrompt(item.prompt);
    const textarea = document.getElementById("hero-prompt-input");
    if (textarea) textarea.focus();
  }

  return (
    <section id="hero-builder" className="relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28 bg-ink">
      {/* Subtle warm ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden"
      >
        <div className="h-[420px] w-[900px] -translate-y-1/3 rounded-full bg-amber/5 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        {/* Top Header / Eyebrow Badge */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-line bg-ink-raised px-3.5 py-1.5 font-mono text-xs text-fog shadow-xs backdrop-blur-md">
            <span className="flex size-1.5 rounded-full bg-amber animate-pulse" />
            <TextEffect per="char" as="span" preset="fade" delay={0.05}>
              Built on Gemini 3.5 Flash
            </TextEffect>
          </div>

          <h1 className="mt-6 max-w-4xl font-serif font-normal text-3xl sm:text-5xl lg:text-6xl text-cream tracking-[-0.01em] leading-[1.1] pb-1">
            <TextEffect
              per="word"
              as="span"
              preset="fade-in-blur"
              delay={0.15}
              className="inline"
            >
              From Prompt to
            </TextEffect>{" "}
            <TextEffect
              per="word"
              as="span"
              preset="fade-in-blur"
              delay={0.3}
              className="inline text-amber"
            >
              Product
            </TextEffect>
          </h1>
        </div>

        {/* ============================================================================== */}
        {/* HERO COMMAND CENTER / CHAT BOT IN THE FRONT                                    */}
        {/* ============================================================================== */}
        <div className="mt-10 mx-auto max-w-3xl">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="group relative rounded-md border border-slate-line bg-ink-raised p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-200 hover:border-slate-line/80 focus-within:border-amber focus-within:ring-1 focus-within:ring-amber/30"
          >
            <BorderTrail
              size={100}
              borderRadius={6}
              className="bg-gradient-to-l from-amber via-amber-deep to-transparent"
              transition={{
                repeat: Infinity,
                duration: 6,
                ease: "linear",
              }}
            />
            <div className="flex items-start gap-3 px-1 pt-1">
              <textarea
                id="hero-prompt-input"
                value={prompt}
                enterKeyHint="go"
                onChange={(e) => {
                  const val = e.target.value;
                  // If Enter was tapped on virtual/mobile keyboard (which inserts \n)
                  if (!isShiftPressedRef.current && (val.includes("\n") || val.includes("\r"))) {
                    const cleaned = val.replace(/[\r\n]+/g, " ").trim();
                    setPrompt(cleaned);
                    handleSubmit(undefined, cleaned);
                    return;
                  }
                  setPrompt(val);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Shift" || e.shiftKey) {
                    isShiftPressedRef.current = true;
                  }

                  const isEnter =
                    e.key === "Enter" ||
                    e.code === "Enter" ||
                    e.code === "NumpadEnter" ||
                    e.keyCode === 13 ||
                    e.which === 13;

                  if (isEnter && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(undefined, e.currentTarget.value);
                  }
                }}
                onKeyUp={(e) => {
                  if (e.key === "Shift" || !e.shiftKey) {
                    isShiftPressedRef.current = false;
                  }
                }}
                rows={2}
                placeholder={placeholderText}
                className="w-full resize-none border-0 bg-transparent text-sm sm:text-base font-mono text-cream placeholder:text-fog-dim focus:outline-none focus:ring-0 leading-relaxed transition-colors"
              />
            </div>

            {/* Bottom Bar inside Prompt Box */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-line pt-3 px-1">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-xs text-fog-dim hover:text-cream hover:bg-ink transition-colors cursor-pointer"
                  title="Attach screenshot or reference"
                >
                  <Paperclip className="size-4" />
                </Button>
                <div className="hidden sm:inline-flex items-center gap-1.5 rounded-[3px] bg-ink border border-slate-line px-2.5 py-1 text-[11px] font-mono text-fog">
                  <Cpu className="size-3 text-amber" />
                  <span>Gemini 3.5 Flash</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-[3px] bg-amber hover:bg-amber-deep text-[#201404] px-5 py-2.5 text-xs sm:text-sm font-sans font-medium transition-colors cursor-pointer shadow-xs disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="size-3.5 animate-spin rounded-full border-2 border-[#201404] border-t-transparent mr-1.5" />
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

          {/* Quick Action Suggestion Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="font-mono text-xs text-fog-dim mr-1">Suggestions:</span>
            {QUICK_ACTIONS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleSelectQuickAction(item)}
                className="inline-flex items-center rounded-[3px] border border-slate-line bg-ink-raised/60 px-3 py-1.5 font-mono text-xs text-fog hover:text-cream hover:border-amber hover:bg-amber/5 transition-all cursor-pointer shadow-xs"
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
