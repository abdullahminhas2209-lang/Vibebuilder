"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface Plan {
  name: string;
  desc: string;
  price: string;
  unit?: string;
  cycle: string;
  highlight?: boolean;
  ctaText: string;
  ctaHref: string;
  ctaStyle: "ghost" | "amber";
  features: string[];
}

const PLANS: Plan[] = [
  {
    name: "Starter",
    desc: "For trying Klyro on a first idea.",
    price: "$0",
    cycle: "forever",
    ctaText: "Start free",
    ctaHref: "#hero-builder",
    ctaStyle: "ghost",
    features: [
      "5 app generations each month",
      "Live multi-device sandbox preview",
      "Single-component code export",
      "Community support",
      "1 workspace seat",
    ],
  },
  {
    name: "Pro",
    desc: "For creators shipping real projects.",
    price: "$15",
    unit: "/mo",
    cycle: "billed annually",
    highlight: true,
    ctaText: "Start with Pro",
    ctaHref: "#hero-builder",
    ctaStyle: "amber",
    features: [
      "Unlimited app generations",
      "Full project source export in one click",
      "Conversational AI editing & redirecting",
      "Live multi-device sandbox preview",
      "Priority generation speed",
      "1 workspace seat",
    ],
  },
  {
    name: "Team",
    desc: "For agencies building for clients.",
    price: "$39",
    unit: "/mo",
    cycle: "billed annually",
    ctaText: "Talk to us",
    ctaHref: "#hero-builder",
    ctaStyle: "ghost",
    features: [
      "Everything in Pro included",
      "Up to 5 team workspace seats",
      "Shared project workspaces",
      "Export directly to Vercel or zip",
      "Dedicated priority support",
    ],
  },
];

export function PricingSection() {
  function handleCtaClick(href: string) {
    if (href.startsWith("#") || href.startsWith("/#")) {
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
      className="py-[72px] sm:py-[108px] bg-ink border-t border-slate-line scroll-mt-20"
    >
      <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
        {/* Section Heading */}
        <div className="max-w-[640px] mb-14">
          <h2 className="font-serif font-normal text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.15] tracking-[-0.01em] text-cream">
            Pricing that scales with how much you build
          </h2>
          <p className="mt-3.5 text-fog text-base max-w-[52ch]">
            Start free. Move up when you need more generations or a team.
          </p>
        </div>

        {/* Pricing Tiers Grid */}
        <div className="border border-slate-line rounded-md grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-line bg-ink overflow-hidden">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "py-8 px-6 sm:px-7 flex flex-col justify-between transition-colors",
                plan.highlight ? "bg-amber/[0.06]" : "bg-ink"
              )}
            >
              <div>
                <h3 className="font-serif text-xl text-cream mb-1.5 font-normal">
                  {plan.name}
                </h3>
                <p className="text-[13px] text-fog-dim mb-5 min-h-[40px] leading-relaxed">
                  {plan.desc}
                </p>

                <div className="font-serif text-[38px] text-cream leading-tight mb-0.5">
                  {plan.price}
                  {plan.unit && (
                    <sup className="text-sm font-sans text-fog font-normal ml-0.5">
                      {plan.unit}
                    </sup>
                  )}
                </div>
                <div className="text-xs text-fog-dim font-mono mb-7">
                  {plan.cycle}
                </div>

                <ul className="space-y-3 border-t border-slate-line pt-6 text-[13.5px] text-fog leading-relaxed">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <span className="text-fog-dim select-none font-mono text-xs mt-0.5">—</span>
                      <span className="text-fog">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  href={plan.ctaHref}
                  onClick={() => handleCtaClick(plan.ctaHref)}
                  className={cn(
                    "w-full h-[41px] inline-flex items-center justify-center rounded-[3px] font-sans font-medium text-[14.5px] transition-colors cursor-pointer",
                    plan.ctaStyle === "amber"
                      ? "bg-amber text-[#201404] hover:bg-amber-deep font-semibold shadow-xs"
                      : "border border-slate-line text-cream hover:border-fog-dim bg-transparent hover:bg-ink-raised"
                  )}
                >
                  {plan.ctaText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
