"use client";

import { cn } from "@/lib/utils";

interface StepItem {
  number: string;
  title: string;
  description: string;
  meta: string;
  active?: boolean;
}

const TIMELINE_STEPS: StepItem[] = [
  {
    number: "01",
    title: "You describe it",
    description:
      "Write what you want in plain English, or paste a screenshot of a design you like. No need to mention frameworks or components.",
    meta: "input: text, image, or URL",
    active: true,
  },
  {
    number: "02",
    title: "Klyro plans the structure",
    description:
      "It works out what pages, data, and states your idea needs before writing a single line, so the result holds together instead of feeling bolted on.",
    meta: "output: page map + data model",
    active: false,
  },
  {
    number: "03",
    title: "The app gets written",
    description:
      "Klyro generates real, readable Next.js and Tailwind code across multiple files — the kind you could hand to another developer.",
    meta: "stack: Next.js 15 · Tailwind CSS",
    active: false,
  },
  {
    number: "04",
    title: "You try it live",
    description:
      "A running sandbox opens next to the code, on desktop and mobile sizes, so you can click through it the way a visitor would.",
    meta: "preview: desktop · tablet · mobile",
    active: true,
  },
  {
    number: "05",
    title: "You ship it",
    description:
      "Export the full source as a zip, or deploy straight to Vercel and your own domain when it's ready.",
    meta: "export: zip · Vercel · custom domain",
    active: false,
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      aria-label="How it works"
      className="py-[72px] sm:py-[108px] bg-ink border-t border-slate-line scroll-mt-20"
    >
      <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
        {/* Section Heading — clean, no repeated pill badges */}
        <div className="max-w-[640px] mb-14">
          <h2 className="font-serif font-normal text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.15] tracking-[-0.01em] text-cream">
            Five steps between a sentence and a live app
          </h2>
          <p className="mt-3.5 text-fog text-base max-w-[52ch]">
            Each step happens automatically, but you can jump in and redirect at any point.
          </p>
        </div>

        {/* Connected Vertical Timeline */}
        <div className="relative before:content-[''] before:absolute before:left-[21px] sm:before:left-[27px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-line">
          {TIMELINE_STEPS.map((step) => (
            <div
              key={step.number}
              className="grid grid-cols-[42px_1fr] sm:grid-cols-[56px_1fr] gap-4 sm:gap-7 relative pb-10 sm:pb-[52px] last:pb-0"
            >
              {/* Timeline Node */}
              <div
                className={cn(
                  "w-[42px] h-[42px] sm:w-[56px] sm:h-[56px] rounded-full flex items-center justify-center font-serif text-base sm:text-[22px] z-10 select-none transition-colors",
                  step.active
                    ? "bg-amber text-[#14161f] shadow-sm font-medium"
                    : "bg-fog text-[#14161f]"
                )}
              >
                {step.number}
              </div>

              {/* Timeline Content */}
              <div className="pt-1">
                <h3 className="font-serif font-semibold text-lg sm:text-xl text-cream mb-2">
                  {step.title}
                </h3>
                <p className="text-fog text-[15px] max-w-[56ch] leading-[1.65]">
                  {step.description}
                </p>
                <div className="mt-2.5 font-mono text-xs text-fog-dim">
                  {step.meta}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
