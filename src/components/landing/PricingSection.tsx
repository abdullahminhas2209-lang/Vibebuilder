"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    name: "Starter",
    id: "tier-starter",
    priceMonthly: "$0",
    priceAnnually: "$0",
    description: "Ideal for exploring Klyro and creating your first prompt-to-product apps.",
    features: [
      "5 AI web app generations / month",
      "Interactive multi-device live sandbox",
      "Next.js 15 & Tailwind CSS code viewer",
      "Export single-page components",
      "Community support",
    ],
    cta: "Start Free",
    popular: false,
    href: "/#hero-builder",
  },
  {
    name: "Pro",
    id: "tier-pro",
    priceMonthly: "$19",
    priceAnnually: "$15",
    description: "For creators and indie developers who want unlimited speed and custom exports.",
    features: [
      "Unlimited AI generations & revisions",
      "Multi-turn conversational code editing",
      "One-click full project ZIP export",
      "Direct Vercel & Supabase integration",
      "High-speed Gemini AI reasoning model",
      "Priority response support",
    ],
    cta: "Get Started with Pro",
    popular: true,
    href: "/#hero-builder",
  },
  {
    name: "Team",
    id: "tier-team",
    priceMonthly: "$49",
    priceAnnually: "$39",
    description: "For agencies and startups building client websites with shared workspaces.",
    features: [
      "Everything in Pro, plus:",
      "Up to 5 team collaborator seats",
      "Shared prompt templates & brand presets",
      "Custom domain linking & analytics",
      "Dedicated Supabase production schema",
      "Priority 24/7 developer assistance",
    ],
    cta: "Scale with Team",
    popular: false,
    href: "/#hero-builder",
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(true);

  function handleActionClick(href: string) {
    if (href.startsWith("/#") || href.startsWith("#")) {
      const hero = document.getElementById("hero-builder");
      if (hero) {
        hero.scrollIntoView({ behavior: "smooth" });
        const input = document.getElementById("hero-prompt-input");
        if (input) input.focus();
      }
    }
  }

  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className="relative scroll-mt-20 border-t border-slate-800/80 bg-[#0B0F19] py-20 text-slate-100 lg:py-28 overflow-hidden"
    >
      {/* Background ambient gradient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] rounded-full bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-blue-600/10 blur-[130px]"
      />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 relative z-10">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            {/* Header pill badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400 mb-3.5 shadow-xs">
              <Sparkles className="size-3.5 text-indigo-400" />
              <span>Simple, Transparent Pricing</span>
            </div>

            {/* Main Section Heading */}
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Build More, Spend Less
            </h2>

            {/* Supporting Copy */}
            <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mx-auto">
              Start building for free. Upgrade when you need unlimited generations, full code ZIP exports, and team collaboration.
            </p>

            {/* Billing cycle toggle */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-slate-800 bg-[#0F172A]/80 p-1.5 shadow-inner">
              <button
                type="button"
                onClick={() => setAnnual(false)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200",
                  !annual
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                )}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setAnnual(true)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200",
                  annual
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                )}
              >
                <span>Annual</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </Reveal>

        {/* Pricing Cards Grid */}
        <div className="mt-14 grid gap-8 lg:grid-cols-3 items-stretch">
          {TIERS.map((tier, index) => (
            <Reveal key={tier.id} delay={index * 100}>
              <div
                className={cn(
                  "relative flex h-full flex-col justify-between rounded-[22px] border p-7 transition-all duration-300 backdrop-blur-md",
                  tier.popular
                    ? "border-indigo-500/60 bg-[#10182E]/90 shadow-2xl shadow-indigo-500/15 hover:border-indigo-400/80 hover:shadow-indigo-500/25 -translate-y-1 lg:-translate-y-2"
                    : "border-slate-800/80 bg-[#0F172A]/80 shadow-xl shadow-black/50 hover:border-slate-700 hover:bg-[#121B33]/80"
                )}
              >
                {tier.popular && (
                  <Badge className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full border-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 px-3.5 py-1 text-[11px] font-bold text-white shadow-md shadow-indigo-500/30">
                    Most Popular
                  </Badge>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                  </div>

                  <p className="mt-2 text-xs text-slate-400 leading-relaxed min-h-[36px]">
                    {tier.description}
                  </p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight text-white">
                      {annual ? tier.priceAnnually : tier.priceMonthly}
                    </span>
                    <span className="text-xs font-medium text-slate-400">/ month</span>
                    {annual && tier.priceAnnually !== "$0" && (
                      <span className="ml-2 text-[11px] text-slate-500 font-mono">
                        billed annually
                      </span>
                    )}
                  </div>

                  <div className="mt-7 border-t border-slate-800/80 pt-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                      What&apos;s included
                    </p>
                    <ul className="space-y-3 text-xs text-slate-300">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <Check className="size-4 shrink-0 text-indigo-400 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800/60">
                  <Button
                    asChild
                    className={cn(
                      "w-full rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 gap-1.5 shadow-md",
                      tier.popular
                        ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white hover:from-indigo-500 hover:to-blue-500 shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02]"
                        : "bg-slate-800/80 text-white hover:bg-slate-700 hover:text-white border border-slate-700/80 hover:border-slate-600"
                    )}
                  >
                    <Link
                      href={tier.href}
                      onClick={() => handleActionClick(tier.href)}
                      className="flex items-center justify-center"
                    >
                      <span>{tier.cta}</span>
                      <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
