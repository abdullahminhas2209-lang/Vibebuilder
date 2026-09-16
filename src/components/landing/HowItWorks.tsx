"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface StepItem {
  number: string;
  title: string;
  description: string;
  meta: string;
}

const TIMELINE_STEPS: StepItem[] = [
  {
    number: "01",
    title: "You describe it",
    description:
      "Write what you want in plain English, or paste a screenshot of a design you like. No need to mention frameworks or components.",
    meta: "input: text, image, or URL",
  },
  {
    number: "02",
    title: "Klyro plans the structure",
    description:
      "It works out what pages, data, and states your idea needs before writing a single line, so the result holds together instead of feeling bolted on.",
    meta: "output: page map + data model",
  },
  {
    number: "03",
    title: "The app gets written",
    description:
      "Klyro generates real, readable Next.js and Tailwind code across multiple files — the kind you could hand to another developer.",
    meta: "stack: Next.js 15 · Tailwind CSS",
  },
  {
    number: "04",
    title: "You try it live",
    description:
      "A running sandbox opens next to the code, on desktop and mobile sizes, so you can click through it the way a visitor would.",
    meta: "preview: desktop · tablet · mobile",
  },
  {
    number: "05",
    title: "You ship it",
    description:
      "Export the full source as a zip, or deploy straight to Vercel and your own domain when it's ready.",
    meta: "export: zip · Vercel · custom domain",
  },
];

export function HowItWorks() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const renderItem = (step: StepItem, index: number) => {
    const isHovered = hoveredIndex === index;

    return (
      <div
        key={step.number}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        onFocus={() => setHoveredIndex(index)}
        onBlur={() => setHoveredIndex(null)}
        tabIndex={0}
        className="group grid grid-cols-[42px_1fr] sm:grid-cols-[56px_1fr] gap-4 sm:gap-7 items-start cursor-pointer outline-none select-none"
      >
        {/* Circular Number Badge — Gray by default, turns yellow on hover */}
        <div
          className={cn(
            "w-[42px] h-[42px] sm:w-[56px] sm:h-[56px] rounded-full flex items-center justify-center font-serif text-base sm:text-[22px] shrink-0 select-none transition-all duration-300",
            isHovered
              ? "bg-amber text-[#14161f] shadow-[0_0_20px_rgba(242,169,59,0.35)] scale-105 font-medium"
              : "bg-fog text-[#14161f] font-normal group-hover:bg-amber group-hover:text-[#14161f] group-hover:shadow-[0_0_20px_rgba(242,169,59,0.35)] group-hover:scale-105"
          )}
        >
          {step.number}
        </div>

        {/* Step Content */}
        <div className="pt-1">
          <h3 className="font-serif font-semibold text-lg sm:text-xl text-cream mb-2 transition-colors duration-200">
            {step.title}
          </h3>
          <p className="text-fog text-[15px] max-w-[54ch] leading-[1.65]">
            {step.description}
          </p>
          <div className="mt-2.5 font-mono text-xs text-fog-dim group-hover:text-fog transition-colors duration-200">
            {step.meta}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      id="how"
      aria-label="How it works"
      className="py-[72px] sm:py-[108px] bg-ink border-t border-slate-line scroll-mt-20"
    >
      <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
        {/* Section Heading */}
        <div className="max-w-[640px] mb-14 sm:mb-16">
          <h2 className="font-serif font-normal text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.15] tracking-[-0.01em] text-cream">
            Five steps between a sentence and a live app
          </h2>
          <p className="mt-3.5 text-fog text-base max-w-[52ch]">
            Each step happens automatically, but you can jump in and redirect at any point.
          </p>
        </div>

        {/* Horizontal Open Layout: Row 1 (1, 2) · Row 2 (3, 4) · Row 3 (5 Centered) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-12 sm:gap-y-14">
          {/* Row 1 */}
          {renderItem(TIMELINE_STEPS[0], 0)}
          {renderItem(TIMELINE_STEPS[1], 1)}

          {/* Row 2 */}
          {renderItem(TIMELINE_STEPS[2], 2)}
          {renderItem(TIMELINE_STEPS[3], 3)}

          {/* Row 3: Step 5 Centered Below the Four Above */}
          <div className="md:col-span-2 flex justify-center">
            <div className="w-full md:max-w-[calc(50%-1.5rem)] lg:max-w-[calc(50%-2rem)]">
              {renderItem(TIMELINE_STEPS[4], 4)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
