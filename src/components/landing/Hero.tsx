"use client";

import { useState, useEffect, memo } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Cpu, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/motion-primitives/text-effect";

const DEFAULT_WORDS = [
  "landing page.",
  "web app.",
  "SaaS platform.",
  "e-commerce store.",
  "dashboard.",
  "interactive product.",
];

const TypewriterText = memo(function TypewriterText({
  words = DEFAULT_WORDS,
  typingSpeed = 70,
  deletingSpeed = 35,
  pauseDuration = 2000,
  emptyPauseDuration = 280,
  started = false,
}: {
  words?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  emptyPauseDuration?: number;
  started?: boolean;
}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!started) return;

    let timer: NodeJS.Timeout;
    const currentWord = words[wordIndex] || "";

    if (isDeleting) {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length - 1));
        }, deletingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }, emptyPauseDuration);
      }
    } else {
      if (displayText.length < currentWord.length) {
        timer = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration, emptyPauseDuration, started]);

  return (
    <span className="inline-flex items-baseline whitespace-nowrap will-change-contents">
      <span className="text-amber font-serif font-normal">{displayText}</span>
      <span
        aria-hidden="true"
        className="inline-block w-[3px] sm:w-[4px] h-[0.82em] ml-1 sm:ml-1.5 rounded-full bg-amber align-baseline animate-pulse shadow-[0_0_8px_rgba(242,169,59,0.6)]"
      />
    </span>
  );
});

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
    label: "E-Commerce Store",
    prompt:
      "Design a high-converting e-commerce storefront for homeware products with product grid, cart drawer, and checkout.",
  },
  {
    label: "Fitness Studio Landing",
    prompt:
      "Build a fitness studio landing page with class schedule, coach bios, membership tiers, and free trial booking.",
  },
];

export function Hero() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [firstEffectFinished, setFirstEffectFinished] = useState(false);
  const [typewriterStarted, setTypewriterStarted] = useState(false);

  useEffect(() => {
    if (firstEffectFinished) {
      // Pause for a second after the first effect finishes, then start typewriter
      const timer = setTimeout(() => {
        setTypewriterStarted(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [firstEffectFinished]);

  // Fallback timer to ensure typewriter begins even if onAnimationComplete is skipped
  useEffect(() => {
    const fallback = setTimeout(() => {
      setFirstEffectFinished(true);
    }, 1400);
    return () => clearTimeout(fallback);
  }, []);

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

  async function handleSubmit(event?: React.FormEvent) {
    if (event) event.preventDefault();
    const effectivePrompt =
      prompt.trim() || placeholderText || "Build a modern SaaS product with landing page and dashboard";
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
              speedReveal={0.7}
              className="inline"
              onAnimationComplete={() => setFirstEffectFinished(true)}
            >
              From prompt to
            </TextEffect>{" "}
            <TypewriterText started={typewriterStarted} />
          </h1>

          <TextEffect
            per="word"
            as="p"
            preset="fade-in-blur"
            delay={0.35}
            className="mt-4 max-w-2xl font-sans text-base sm:text-lg text-fog leading-[1.6]"
          >
            Describe what you want to build. Klyro turns your idea into a working, interactive product in seconds.
          </TextEffect>
        </div>

        {/* ============================================================================== */}
        {/* HERO COMMAND CENTER / CHAT BOT IN THE FRONT                                    */}
        {/* ============================================================================== */}
        <div className="mt-10 mx-auto max-w-3xl">
          <form
            onSubmit={handleSubmit}
            className="group relative rounded-md border border-slate-line bg-ink-raised p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-200 hover:border-slate-line/80 focus-within:border-amber focus-within:ring-1 focus-within:ring-amber/30"
          >
            <div className="flex items-start gap-3 px-1 pt-1">
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
