"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");

  function handleStart(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const target = prompt.trim()
      ? `/project/demo?prompt=${encodeURIComponent(prompt.trim())}`
      : "/project/demo";
    router.push(target);
  }

  return (
    <section className="relative overflow-hidden py-20 lg:py-28 border-t border-slate-200/70 dark:border-slate-800 bg-gradient-to-b from-slate-50/50 to-indigo-50/30 dark:from-slate-950 dark:to-indigo-950/20">
      {/* Subtle background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 flex justify-center"
      >
        <div className="h-[320px] w-[600px] rounded-full bg-indigo-500/10 blur-[100px]" />
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 text-center sm:px-6">
        <Reveal>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-white/80 dark:border-indigo-900/50 dark:bg-slate-900/60 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-xs mb-4 backdrop-blur-md">
            <Sparkles className="size-3.5 text-indigo-600" />
            <span>Ready to create?</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Start building with <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">Klyro</span>.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 dark:text-slate-300">
            From prompt to product in seconds. Experience frictionless AI web creation with live sandbox previews and exportable code.
          </p>

          <form onSubmit={handleStart} className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-1.5 shadow-lg backdrop-blur-md">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your website idea..."
              className="flex-1 bg-transparent px-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
            <Button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-xs font-semibold text-white px-4 py-2 shadow-md hover:from-indigo-500 hover:to-blue-500 gap-1"
            >
              <span>Build</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
