"use client";

import { useEffect, useState } from "react";
import { Check, CheckCircle2, Cpu, FileCode2, Sparkles, Zap } from "lucide-react";

import { LogoMark } from "@/components/brand/Logo";
import { mockUser } from "@/lib/mock-data";
import { extractProse, parseSummaryFromContent } from "@/lib/parse-ai-response";
import type { ChatMessage as ChatMessageType, ChatMessageSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

function TypewriterText({
  text,
  speed = 20,
}: {
  text: string;
  speed?: number;
}) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let index = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      index++;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className="font-medium text-cream">
      {displayed}
      <span className="inline-block w-1 h-3.5 ml-1 align-middle bg-amber animate-cursor-blink" />
    </span>
  );
}

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex gap-2.5 animate-fade-up flex-row-reverse">
        <span
          aria-hidden="true"
          className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-ink-raised border border-slate-line text-[11px] font-mono font-semibold text-amber shadow-xs"
        >
          {mockUser.initials}
        </span>

        <div className="flex max-w-[85%] min-w-0 flex-col gap-1 items-end">
          <div className="rounded-md rounded-tr-none bg-amber/15 border border-amber/30 px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed text-cream shadow-sm font-sans">
            {message.content}
          </div>
          <p className="px-1 text-[11px] text-fog font-mono text-right">
            You · {message.createdAt}
          </p>
        </div>
      </div>
    );
  }

  // Assistant in Pending State (Thinking vs Generating)
  if (message.pending) {
    const isThinking = message.statusStage === "thinking" || !message.statusStage;

    return (
      <div className="flex gap-2.5 animate-fade-up">
        <div className="relative">
          <LogoMark className="size-6 shrink-0 rounded-sm" />
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 size-2 rounded-full border border-ink",
              isThinking ? "bg-amber animate-ping" : "bg-amber animate-pulse"
            )}
          />
        </div>

        <div className="flex max-w-[90%] min-w-0 flex-col gap-1.5 flex-1">
          {isThinking ? (
            // Phase 1: Thinking... state with typewriter effect
            <div className="relative overflow-hidden rounded-md border border-slate-line bg-ink-raised/60 p-3.5 text-xs text-cream shadow-sm transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1.5 rounded-sm bg-amber/15 border border-amber/30 px-2 py-0.5 text-[11px] font-mono font-semibold text-amber">
                  <Cpu className="size-3 animate-pulse text-amber" />
                  Thinking...
                </span>
                <span className="flex gap-1" aria-hidden="true">
                  <span className="size-1 animate-bounce rounded-full bg-amber [animation-delay:0ms]" />
                  <span className="size-1 animate-bounce rounded-full bg-amber [animation-delay:150ms]" />
                  <span className="size-1 animate-bounce rounded-full bg-amber [animation-delay:300ms]" />
                </span>
              </div>
              <div className="text-xs text-fog leading-relaxed font-mono">
                <TypewriterText text="Analyzing project requirements & planning component architecture..." />
              </div>
            </div>
          ) : (
            // Phase 2: Generating... state with typewriter effect & prominent SHIMMER effect
            <div className="relative overflow-hidden rounded-md border border-amber/40 bg-ink-raised p-3.5 text-xs text-cream shadow-md transition-all duration-300">
              {/* Shimmer Light Beam Effect */}
              <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer-slide bg-gradient-to-r from-transparent via-amber/10 to-transparent" />
              
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 rounded-sm bg-amber/15 border border-amber/30 px-2 py-0.5 text-[11px] font-mono font-semibold text-amber">
                    <Sparkles className="size-3 text-amber animate-spin" />
                    Generating...
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-amber font-mono">
                    <span className="size-1.5 rounded-full bg-amber animate-ping" />
                    Compiling preview
                  </span>
                </div>

                <div className="text-xs text-fog font-mono leading-relaxed">
                  <TypewriterText text="Writing component structure, styling layout & building live sandbox..." />
                </div>

                {/* Shimmering Skeleton Component Bars */}
                <div className="space-y-1.5 pt-1">
                  <div className="h-2 w-3/4 rounded-full bg-slate-line animate-shimmer overflow-hidden" />
                  <div className="h-2 w-full rounded-full bg-slate-line animate-shimmer overflow-hidden" />
                  <div className="h-2 w-4/5 rounded-full bg-slate-line animate-shimmer overflow-hidden" />
                </div>
              </div>
            </div>
          )}

          <p className="px-1 text-[11px] text-fog font-mono">
            Klyro AI · {message.createdAt}
          </p>
        </div>
      </div>
    );
  }

  // Assistant Completed State: Render Clean Summary Card or Clean Prose
  const summary: ChatMessageSummary | null =
    message.summary || parseSummaryFromContent(message.content);

  // If summary exists, render the structured Summary Card
  if (summary) {
    return (
      <div className="flex gap-2.5 animate-fade-up">
        <LogoMark className="size-6 shrink-0 rounded-sm mt-1" />

        <div className="flex max-w-[95%] sm:max-w-[88%] min-w-0 flex-col gap-1">
          <div className="rounded-md border border-slate-line bg-ink-raised p-4 text-xs sm:text-sm text-cream shadow-md transition-all duration-200">
            {/* Header Badge */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-line pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-5 items-center justify-center rounded-sm bg-amber/15 text-amber border border-amber/30">
                  <CheckCircle2 className="size-3.5" />
                </div>
                <h3 className="font-serif text-sm font-semibold text-cream tracking-tight">
                  {summary.title}
                </h3>
              </div>
              <span className="shrink-0 rounded-sm bg-amber/15 border border-amber/30 px-2 py-0.5 text-[10px] font-mono font-medium text-amber">
                Ready
              </span>
            </div>

            {/* Clean Description */}
            <p className="text-xs text-fog leading-relaxed mb-3.5 font-sans">
              {summary.description}
            </p>

            {/* Features List */}
            {summary.features && summary.features.length > 0 && (
              <div className="mb-3.5 space-y-1.5 rounded-sm bg-ink p-3 border border-slate-line">
                <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-fog-dim flex items-center gap-1.5">
                  <Zap className="size-3 text-amber" />
                  Key Features Built:
                </p>
                <div className="space-y-1 pt-1">
                  {summary.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-cream font-sans">
                      <span className="flex size-3.5 shrink-0 items-center justify-center rounded-full bg-amber/20 text-amber mt-0.5 font-mono text-[10px]">
                        ✓
                      </span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generated Files */}
            {summary.files && summary.files.length > 0 && (
              <div className="mb-3 space-y-1.5">
                <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-fog-dim flex items-center gap-1.5">
                  <FileCode2 className="size-3 text-amber" />
                  Generated Files ({summary.files.length}):
                </p>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {summary.files.map((file, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-sm bg-ink border border-slate-line px-2 py-1 text-[11px] font-mono text-fog hover:border-amber/40 hover:text-amber transition-colors"
                    >
                      <FileCode2 className="size-3 text-fog-dim" />
                      {file}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Live Preview Active Notice */}
            <div className="rounded-sm bg-amber/[0.08] border border-amber/30 px-3 py-2 text-[11px] text-amber font-mono flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-amber shadow-[0_0_6px_rgba(242,169,59,0.8)]" />
                Live Preview ready in Preview tab
              </span>
              <span className="text-fog">Full source in &lt;/&gt; Code</span>
            </div>
          </div>

          <p className="px-1 text-[11px] text-fog font-mono">
            Klyro AI · {message.createdAt}
          </p>
        </div>
      </div>
    );
  }

  // Regular Assistant Text (fallback stripped of all code blocks)
  const cleanContent = extractProse(message.content) || message.content;

  return (
    <div className="flex gap-2.5 animate-fade-up">
      <LogoMark className="size-6 shrink-0 rounded-sm mt-1" />

      <div className="flex max-w-[85%] min-w-0 flex-col gap-1">
        <div className="rounded-md bg-ink-raised border border-slate-line px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed text-cream shadow-xs transition-all duration-200 font-sans">
          {cleanContent}
        </div>
        <p className="px-1 text-[11px] text-fog font-mono">
          Klyro AI · {message.createdAt}
        </p>
      </div>
    </div>
  );
}
