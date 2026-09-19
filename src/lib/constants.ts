/**
 * Authoritative constants for the Klyro application.
 * All absolute URLs, model IDs, contact info, and feature flags originate here.
 */

// Site URL: Defaults to production Vercel deployment URL. No custom domain.
export const NEXT_PUBLIC_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://klyro-gamma.vercel.app";

// Primary AI Model specifications
export const AI_MODEL_DISPLAY_NAME = "Gemini 3.5 Flash";
export const AI_MODEL_ID = "gemini-3.5-flash";

// Official contact and support email
export const CONTACT_EMAIL = "abdullahminhas2209@gmail.com";

// Feature flag: Social proof section gating (default: false to avoid showing placeholder data in production)
export const SHOW_SOCIAL_PROOF =
  process.env.NEXT_PUBLIC_SHOW_SOCIAL_PROOF === "true";

// Generation definition (authoritative copy)
export const GENERATION_DEFINITION =
  "A generation is one complete app created from a prompt. Conversational edits are Pro-only and don't count toward the limit.";

// Fair use policy definition
export const PRO_FAIR_USE = "Unlimited, subject to fair use.";

// Code ownership guarantee
export const CODE_OWNERSHIP_STATEMENT =
  "You own 100% of your generated code. Export full Next.js and Tailwind project source files and deploy anywhere without vendor lock-in or commercial restrictions.";

// Pricing configuration
export const PRICING_PLANS = {
  starter: {
    name: "Starter",
    description: "For exploring Klyro and testing your first ideas.",
    priceMonthly: 0,
    priceAnnualPerMonth: 0,
    priceDisplay: "$0",
    cycleAnnual: "free forever",
    cycleMonthly: "free forever",
    ctaText: "Start free",
    ctaHref: "/signup",
    exportSummary: "Single-component export",
    features: [
      "5 app generations each month",
      "Single-component code export (React + Tailwind)",
      "Live multi-device sandbox preview",
      "Community support",
      "1 workspace seat",
    ],
  },
  pro: {
    name: "Pro",
    description: "For builders, freelancers, and indie creators shipping apps.",
    priceMonthly: 19,
    priceAnnualPerMonth: 15,
    cycleAnnual: "billed annually ($180/yr)",
    cycleMonthly: "billed monthly ($19/mo)",
    savingsPercent: 21, // (19 - 15) / 19 = 21%
    popularBadge: "Most popular",
    ctaText: "Start with Pro",
    ctaHref: "/signup?plan=pro",
    exportSummary: "Full project source export (Next.js + Tailwind)",
    features: [
      "Unlimited app generations, subject to fair use",
      "Full project source export in one click",
      "Conversational AI editing & redirecting",
      "Live multi-device sandbox preview",
      "Priority generation speed",
      "1 workspace seat",
    ],
  },
  team: {
    name: "Team",
    description: "For agencies and design teams collaborating on client builds.",
    priceMonthly: 49,
    priceAnnualPerMonth: 39,
    cycleAnnual: "billed annually ($468/yr)",
    cycleMonthly: "billed monthly ($49/mo)",
    savingsPercent: 20, // (49 - 39) / 49 = 20%
    ctaText: "Talk to us",
    ctaHref: "/contact",
    exportSummary: "Full project source export + direct Vercel deployment",
    seatsAnnualNote: "Flat $39/mo covers up to 5 seats.",
    seatsMonthlyNote: "Flat $49/mo covers up to 5 seats.",
    features: [
      "Everything in Pro included",
      "Up to 5 team workspace seats included",
      "Shared team project workspaces",
      "Export full project zip or deploy straight to Vercel",
      "Dedicated priority support",
    ],
  },
} as const;
