"use client";

import { ArrowRight, Code2, Eye, MessageSquare, Rocket, Sparkles } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    step: "01",
    title: "Prompt",
    icon: MessageSquare,
    badge: "Input",
    description: "Describe what you want to build in plain English or paste any design reference.",
    color: "from-blue-500/20 to-indigo-500/20 text-indigo-600",
  },
  {
    step: "02",
    title: "Understand",
    icon: Sparkles,
    badge: "AI Reasoning",
    description: "Klyro analyzes your requirements, architecture, layouts, state, and component hierarchy.",
    color: "from-indigo-500/20 to-purple-500/20 text-purple-600",
  },
  {
    step: "03",
    title: "Build",
    icon: Code2,
    badge: "Code Generation",
    description: "Generates clean, multi-file Next.js 15, React, and Tailwind CSS code in seconds.",
    color: "from-purple-500/20 to-pink-500/20 text-pink-600",
  },
  {
    step: "04",
    title: "Preview",
    icon: Eye,
    badge: "Live Sandbox",
    description: "Test your running interactive application in real-time across Desktop, Tablet, and Mobile.",
    color: "from-pink-500/20 to-rose-500/20 text-rose-600",
  },
  {
    step: "05",
    title: "Launch",
    icon: Rocket,
    badge: "Production Ready",
    description: "One-click export full source code ZIP or deploy directly to Vercel and your custom domain.",
    color: "from-rose-500/20 to-emerald-500/20 text-emerald-600",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 lg:py-28 border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/80 dark:border-indigo-900/50 dark:bg-indigo-950/40 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-3 shadow-xs">
              <span>Workflow</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              How Klyro Works
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
              Five continuous steps from a natural language sentence to a production-ready application.
            </p>
          </div>
        </Reveal>

        {/* Workflow Steps Grid */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((item, index) => (
            <Reveal key={item.title} delay={index * 60}>
              <div className="group relative flex flex-col justify-between h-full rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/80 hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-600">
                      {item.step}
                    </span>
                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                      {item.badge}
                    </span>
                  </div>

                  <div className={cn("flex size-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-inner mb-4", item.color)}>
                    <item.icon className="size-5" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {index < STEPS.length - 1 && (
                  <div className="hidden lg:flex items-center justify-end pt-3 text-slate-300 dark:text-slate-700">
                    <ArrowRight className="size-4" />
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
