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
    <span className="font-medium text-slate-200">
      {displayed}
      <span className="inline-block w-1 h-3.5 ml-1 align-middle bg-indigo-400 animate-cursor-blink" />
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
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[10px] font-bold text-white shadow-xs"
        >
          {mockUser.initials}
        </span>

        <div className="flex max-w-[85%] min-w-0 flex-col gap-1 items-end">
          <div className="rounded-2xl rounded-br-sm bg-gradient-to-r from-indigo-600 to-blue-600 px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed text-white shadow-md font-normal hover:shadow-indigo-500/20 transition-all duration-200">
            {message.content}
          </div>
          <p className="px-1 text-[11px] text-slate-500 font-medium text-right">
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
          <LogoMark className="size-7 shrink-0 rounded-full" />
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[#0B0F19]",
              isThinking ? "bg-amber-400 animate-ping" : "bg-indigo-400 animate-pulse"
            )}
          />
        </div>

        <div className="flex max-w-[90%] min-w-0 flex-col gap-1.5 flex-1">
          {isThinking ? (
            // Phase 1: Thinking... state with typewriter effect
            <div className="relative overflow-hidden rounded-2xl rounded-bl-sm border border-slate-800 bg-slate-900/90 p-3.5 text-xs text-slate-200 shadow-sm transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400">
                  <Cpu className="size-3 animate-pulse text-amber-400" />
                  Thinking...
                </span>
                <span className="flex gap-1" aria-hidden="true">
                  <span className="size-1 animate-bounce rounded-full bg-amber-400 [animation-delay:0ms]" />
                  <span className="size-1 animate-bounce rounded-full bg-amber-400 [animation-delay:150ms]" />
                  <span className="size-1 animate-bounce rounded-full bg-amber-400 [animation-delay:300ms]" />
                </span>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed font-mono">
                <TypewriterText text="Analyzing project requirements & planning component architecture..." />
              </div>
            </div>
          ) : (
            // Phase 2: Generating... state with typewriter effect & prominent SHIMMER effect
            <div className="relative overflow-hidden rounded-2xl rounded-bl-sm border border-indigo-500/40 bg-slate-900/95 p-3.5 text-xs text-slate-200 shadow-lg shadow-indigo-500/10 transition-all duration-300">
              {/* Shimmer Light Beam Effect */}
              <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer-slide bg-gradient-to-r from-transparent via-indigo-500/15 to-transparent" />
              
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
                    <Sparkles className="size-3 text-indigo-400 animate-spin" />
                    Generating...
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Compiling preview
                  </span>
                </div>

                <div className="text-xs text-slate-200 font-mono leading-relaxed">
                  <TypewriterText text="Writing component structure, styling layout & building live sandbox..." />
                </div>

                {/* Shimmering Skeleton Component Bars */}
                <div className="space-y-1.5 pt-1">
                  <div className="h-2 w-3/4 rounded-full bg-slate-800 animate-shimmer overflow-hidden" />
                  <div className="h-2 w-full rounded-full bg-slate-800 animate-shimmer overflow-hidden" />
                  <div className="h-2 w-4/5 rounded-full bg-slate-800 animate-shimmer overflow-hidden" />
                </div>
              </div>
            </div>
          )}

          <p className="px-1 text-[11px] text-slate-500 font-medium">
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
        <LogoMark className="size-7 shrink-0 rounded-full mt-1" />

        <div className="flex max-w-[95%] sm:max-w-[88%] min-w-0 flex-col gap-1">
          <div className="rounded-2xl rounded-bl-sm border border-slate-800/90 bg-[#0E1322] p-4 text-xs sm:text-sm text-slate-200 shadow-md hover:border-slate-700 transition-all duration-200">
            {/* Header Badge */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="size-3.5" />
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {summary.title}
                </h3>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                Ready
              </span>
            </div>

            {/* Clean Description */}
            <p className="text-xs text-slate-300 leading-relaxed mb-3.5">
              {summary.description}
            </p>

            {/* Features List */}
            {summary.features && summary.features.length > 0 && (
              <div className="mb-3.5 space-y-1.5 rounded-xl bg-slate-900/60 p-3 border border-slate-800/60">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Zap className="size-3 text-amber-400" />
                  Key Features Built:
                </p>
                <div className="space-y-1 pt-1">
                  {summary.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5">
                        <Check className="size-2.5" />
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
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileCode2 className="size-3 text-indigo-400" />
                  Generated Files ({summary.files.length}):
                </p>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {summary.files.map((file, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-md bg-slate-900 border border-slate-800 px-2 py-1 text-[11px] font-mono text-indigo-300 hover:border-slate-700 transition-colors"
                    >
                      <FileCode2 className="size-3 text-slate-500" />
                      {file}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Live Preview Active Notice */}
            <div className="rounded-lg bg-indigo-950/30 border border-indigo-500/20 px-3 py-2 text-[11px] text-indigo-300 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                Live Preview ready in Preview tab
              </span>
              <span className="text-slate-400">Full source in &lt;/&gt; Code</span>
            </div>
          </div>

          <p className="px-1 text-[11px] text-slate-500 font-medium">
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
      <LogoMark className="size-7 shrink-0 rounded-full" />

      <div className="flex max-w-[85%] min-w-0 flex-col gap-1">
        <div className="rounded-2xl rounded-bl-sm bg-slate-900/90 border border-slate-800 px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed text-slate-200 shadow-xs hover:border-slate-700 hover:bg-slate-900 transition-all duration-200">
          {cleanContent}
        </div>
        <p className="px-1 text-[11px] text-slate-500 font-medium">
          Klyro AI · {message.createdAt}
        </p>
      </div>
    </div>
  );
}
