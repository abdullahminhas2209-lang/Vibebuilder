"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GENERATION_DEFINITION,
  PRO_FAIR_USE,
  CODE_OWNERSHIP_STATEMENT,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { HelpCircle, Check, Info } from "lucide-react";

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");

  const isAnnual = billingCycle === "annual";

  return (
    <section
      id="pricing"
      aria-label="Pricing plans"
      className="py-16 sm:py-24 bg-ink border-t border-slate-line scroll-mt-24"
    >
      <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
        {/* Section Heading & Definition */}
        <div className="max-w-[720px] mb-8 sm:mb-10">
          <span className="font-mono text-xs uppercase tracking-wider text-amber font-medium block mb-2">
            Transparent Pricing
          </span>
          <h2 className="font-serif font-normal text-2xl sm:text-4xl lg:text-[40px] leading-[1.15] tracking-[-0.01em] text-cream">
            Pricing that scales with how much you build
          </h2>
          <p className="mt-3.5 text-fog text-sm sm:text-base leading-relaxed">
            Start free. Move up when you need unlimited generations, full source export, or team collaboration.
          </p>

          {/* Authoritative Generation Definition Callout */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-[3px] border border-slate-line bg-ink-raised/60 px-3.5 py-2 text-xs sm:text-sm font-sans text-cream/90">
            <Info className="size-4 text-amber shrink-0" />
            <span>{GENERATION_DEFINITION}</span>
          </div>
        </div>

        {/* Billing Cycle Toggle (Annual vs Monthly, Default Annual) */}
        <div className="flex items-center justify-start sm:justify-start mb-10">
          <div className="inline-flex items-center rounded-[3px] border border-slate-line bg-ink-raised p-1 text-xs font-sans">
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={cn(
                "px-4 py-1.5 rounded-[2px] font-medium transition-all cursor-pointer flex items-center gap-2",
                isAnnual
                  ? "bg-amber text-[#201404] shadow-xs font-semibold"
                  : "text-fog hover:text-cream"
              )}
            >
              <span>Annual Billing</span>
              <span
                className={cn(
                  "font-mono text-[11px] px-1.5 py-0.5 rounded-[2px]",
                  isAnnual
                    ? "bg-[#201404]/15 text-[#201404]"
                    : "bg-amber/15 text-amber"
                )}
              >
                Save up to 21%
              </span>
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "px-4 py-1.5 rounded-[2px] font-medium transition-all cursor-pointer",
                !isAnnual
                  ? "bg-amber text-[#201404] shadow-xs font-semibold"
                  : "text-fog hover:text-cream"
              )}
            >
              Monthly Billing
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="border border-slate-line rounded-lg grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-line bg-ink overflow-hidden shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]">
          {/* TIER 1: STARTER */}
          <div className="p-6 sm:p-8 flex flex-col justify-between bg-ink">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="font-serif text-2xl text-cream font-normal">
                  Starter
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-fog-dim mb-6 min-h-[38px] leading-relaxed">
                For exploring Klyro and testing your first ideas.
              </p>

              <div className="mb-1 flex items-baseline gap-1">
                <span className="font-serif text-4xl sm:text-5xl text-cream font-normal">
                  $0
                </span>
                <span className="text-xs font-mono text-fog">forever</span>
              </div>
              <p className="text-xs text-fog-dim font-mono mb-6">
                No credit card required
              </p>

              {/* Export Scope Distinction */}
              <div className="mb-6 rounded-[3px] border border-slate-line bg-ink-raised/50 px-3 py-2 text-xs font-mono text-fog">
                <span className="text-cream font-semibold block mb-0.5">Export Scope:</span>
                Single-component export (.tsx)
              </div>

              {/* Features List */}
              <ul className="space-y-3 border-t border-slate-line/80 pt-6 text-xs sm:text-sm text-fog leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-amber font-mono text-xs select-none mt-0.5">—</span>
                  <span>5 app generations each month</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber font-mono text-xs select-none mt-0.5">—</span>
                  <span>Live multi-device sandbox preview</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber font-mono text-xs select-none mt-0.5">—</span>
                  <span>Single-component code export</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber font-mono text-xs select-none mt-0.5">—</span>
                  <span>Community support</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber font-mono text-xs select-none mt-0.5">—</span>
                  <span>1 workspace seat</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <Link
                href="/signup"
                className="w-full h-11 inline-flex items-center justify-center rounded-[3px] border border-slate-line text-cream hover:border-fog-dim bg-transparent hover:bg-ink-raised font-sans font-medium text-sm transition-colors cursor-pointer"
              >
                Start free
              </Link>
            </div>
          </div>

          {/* TIER 2: PRO (HIGHLIGHTED) */}
          <div className="p-6 sm:p-8 flex flex-col justify-between bg-amber/[0.04] relative">
            {/* Most Popular Badge (No AI-pill tell: crisp rectangular badge) */}
            <div className="absolute top-0 right-0">
              <span className="inline-block rounded-bl-[4px] border-b border-l border-amber/40 bg-amber text-[#201404] px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider shadow-xs">
                Most popular
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="font-serif text-2xl text-cream font-normal">
                  Pro
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-fog-dim mb-6 min-h-[38px] leading-relaxed">
                For builders, freelancers, and indie creators shipping real apps.
              </p>

              <div className="mb-1 flex items-baseline gap-1">
                <span className="font-serif text-4xl sm:text-5xl text-cream font-normal">
                  ${isAnnual ? "15" : "19"}
                </span>
                <span className="text-sm font-sans text-fog font-normal">
                  /mo
                </span>
                {isAnnual && (
                  <span className="ml-2 font-mono text-xs text-amber font-medium">
                    Save 21%
                  </span>
                )}
              </div>
              <p className="text-xs text-fog-dim font-mono mb-6">
                {isAnnual ? "billed annually ($180/yr)" : "billed monthly"}
              </p>

              {/* Export Scope Distinction */}
              <div className="mb-6 rounded-[3px] border border-amber/30 bg-amber/10 px-3 py-2 text-xs font-mono text-cream">
                <span className="text-amber font-semibold block mb-0.5">Export Scope:</span>
                Full project source export (Next.js + Tailwind)
              </div>

              {/* Features List */}
              <ul className="space-y-3 border-t border-slate-line/80 pt-6 text-xs sm:text-sm text-fog leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-amber font-mono text-xs select-none mt-0.5">—</span>
                  <div>
                    <span className="text-cream font-medium">Unlimited app generations</span>
                    <span className="block text-[11px] text-amber font-mono mt-0.5">
                      {PRO_FAIR_USE}
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber font-mono text-xs select-none mt-0.5">—</span>
                  <span className="text-cream">Full project source export in one click</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber font-mono text-xs select-none mt-0.5">—</span>
                  <span>Conversational AI editing &amp; redirecting</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber font-mono text-xs select-none mt-0.5">—</span>
                  <span>Live multi-device sandbox preview</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber font-mono text-xs select-none mt-0.5">—</span>
                  <span>Priority generation speed</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber font-mono text-xs select-none mt-0.5">—</span>
                  <span>1 workspace seat</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <Link
                href="/signup?plan=pro"
                className="w-full h-11 inline-flex items-center justify-center rounded-[3px] bg-amber text-[#201404] hover:bg-amber-deep font-sans font-semibold text-sm transition-colors cursor-pointer shadow-xs"
              >
                Start with Pro
              </Link>
            </div>
          </div>

          {/* TIER 3: TEAM */}
          <div className="p-6 sm:p-8 flex flex-col justify-between bg-ink">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="font-serif text-2xl text-cream font-normal">
                  Team
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-fog-dim mb-6 min-h-[38px] leading-relaxed">
                For agencies and product teams collaborating on client builds.
              </p>

              <div className="mb-1 flex items-baseline gap-1">
                <span className="font-serif text-4xl sm:text-5xl text-cream font-normal">
                  ${isAnnual ? "39" : "49"}
                </span>
                <span className="text-sm font-sans text-fog font-normal">
                  /mo
                </span>
                {isAnnual && (
                  <span className="ml-2 font-mono text-xs text-amber font-medium">
                    Save 20%
                  </span>
                )}
              </div>
              <p className="text-xs text-fog-dim font-mono mb-6">
                {isAnnual ? "billed annually ($468/yr)" : "billed monthly"}
              </p>

              {/* Team Seats Callout Note */}
              <div className="mb-6 rounded-[3px] border border-slate-line bg-ink-raised/50 px-3 py-2 text-xs font-mono text-fog">
                <span className="text-cream font-semibold block mb-0.5">Team Coverage:</span>
                {isAnnual
                  ? "Flat $39/mo covers up to 5 seats."
                  : "Flat $49/mo covers up to 5 seats."}
              </div>

              {/* Features List */}
              <ul className="space-y-3 border-t border-slate-line/80 pt-6 text-xs sm:text-sm text-fog leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-amber font-mono text-xs select-none mt-0.5">—</span>
                  <span className="text-cream font-medium">Everything in Pro included</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber font-mono text-xs select-none mt-0.5">—</span>
                  <span>Up to 5 team workspace seats included</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber font-mono text-xs select-none mt-0.5">—</span>
                  <span>Shared team project workspaces</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber font-mono text-xs select-none mt-0.5">—</span>
                  <span>Export full project zip or deploy straight to Vercel</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber font-mono text-xs select-none mt-0.5">—</span>
                  <span>Dedicated priority support</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <Link
                href="/contact"
                className="w-full h-11 inline-flex items-center justify-center rounded-[3px] border border-slate-line text-cream hover:border-fog-dim bg-transparent hover:bg-ink-raised font-sans font-medium text-sm transition-colors cursor-pointer"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </div>

        {/* Pricing Footnote & Code Ownership */}
        <div className="mt-8 pt-6 border-t border-slate-line/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-fog-dim font-mono">
          <p>
            All prices in USD. Applicable taxes may apply. Cancel anytime.
          </p>
          <p className="text-fog">
            <span className="text-amber font-semibold">You own your code: </span>
            {CODE_OWNERSHIP_STATEMENT}
          </p>
        </div>
      </div>
    </section>
  );
}
