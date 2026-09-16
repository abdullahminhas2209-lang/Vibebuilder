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

const FEATURES = [
  "Generations / month",
  "Live multi-device sandbox",
  "Full project export",
  "Conversational editing",
  "Team seats",
  "Support",
];

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
      "5 / month",
      "Yes",
      "Single component only",
      "No",
      "1",
      "Community",
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
      "Unlimited",
      "Yes",
      "Full source, one click",
      "Yes",
      "1",
      "Priority",
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
      "Unlimited",
      "Yes",
      "Full source, one click",
      "Yes",
      "Up to 5",
      "Dedicated",
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

        {/* Comparison Table */}
        <div className="border border-slate-line rounded-md grid grid-cols-1 lg:grid-cols-[1.1fr_1fr_1fr_1fr] overflow-hidden">
          {/* Feature labels column (hidden on mobile) */}
          <div className="hidden lg:flex flex-col justify-end py-7 px-6 border-slate-line">
            <div className="flex-1" />
            <div className="divide-y divide-slate-line">
              {FEATURES.map((feat) => (
                <div
                  key={feat}
                  className="h-[44px] flex items-center text-[13.5px] text-fog"
                >
                  {feat}
                </div>
              ))}
            </div>
            {/* Spacer matching CTA button height + margin */}
            <div className="mt-[22px] h-[41px] invisible" aria-hidden="true" />
          </div>

          {/* Plan Columns */}
          {PLANS.map((plan, pIdx) => (
            <div
              key={plan.name}
              className={cn(
                "py-7 px-6 flex flex-col justify-between border-t border-slate-line lg:border-t-0 lg:border-l lg:border-slate-line",
                pIdx === 0 && "border-t-0",
                plan.highlight && "bg-amber/[0.07]"
              )}
            >
              <div>
                <h3 className="font-serif text-[19px] text-cream mb-1.5 font-normal">
                  {plan.name}
                </h3>
                <p className="text-[13px] text-fog-dim mb-[18px] min-h-[48px] leading-relaxed">
                  {plan.desc}
                </p>
                <div className="font-serif text-[34px] text-cream leading-tight mb-0.5">
                  {plan.price}
                  {plan.unit && (
                    <sup className="text-sm font-sans text-fog font-normal ml-0.5">
                      {plan.unit}
                    </sup>
                  )}
                </div>
                <div className="text-xs text-fog-dim font-mono mb-[22px]">
                  {plan.cycle}
                </div>

                <ul className="divide-y divide-slate-line">
                  {plan.features.map((featVal, fIdx) => (
                    <li
                      key={fIdx}
                      className="h-[44px] flex items-center justify-between lg:justify-start text-[13.5px] text-fog"
                    >
                      <span className="lg:hidden text-fog-dim text-xs font-mono pr-3">
                        {FEATURES[fIdx]}
                      </span>
                      <span className="text-cream lg:text-fog font-medium lg:font-normal">
                        {featVal}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-[22px]">
                <Link
                  href={plan.ctaHref}
                  onClick={() => handleCtaClick(plan.ctaHref)}
                  className={cn(
                    "w-full h-[41px] inline-flex items-center justify-center rounded-[3px] font-sans font-medium text-[14.5px] transition-colors",
                    plan.ctaStyle === "amber"
                      ? "bg-amber text-[#201404] hover:bg-amber-deep"
                      : "border border-slate-line text-cream hover:border-fog-dim bg-transparent"
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
