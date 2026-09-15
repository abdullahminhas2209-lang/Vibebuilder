"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";
import { cn } from "@/lib/utils";

const SHOWCASE_ITEMS = [
  {
    id: "saas-analytics",
    title: "SaaS Analytics Dashboard",
    category: "SaaS Analytics",
    image: "/showcase/saas.png",
    aspect: "2/1",
    alt: "Klyro SaaS Analytics Dashboard preview displaying revenue charts, active metrics, conversion rates, and traffic sources",
    prompt: "Create a modern SaaS analytics dashboard with revenue charts, active user metrics, and team management settings.",
  },
  {
    id: "restaurant-booking",
    title: "Restaurant & Table Booking",
    category: "Restaurant Booking",
    image: "/showcase/restaurant.jpg",
    aspect: "16/9",
    alt: "Klyro Restaurant and Table Booking website preview featuring fine dining hero, table reservation widget, and menu specialties",
    prompt: "Build a luxury restaurant website with seasonal menu, wood-fired kitchen story, and online table reservation flow.",
  },
  {
    id: "developer-portfolio",
    title: "Developer Portfolio",
    category: "Developer Portfolio",
    image: "/showcase/developer.png",
    aspect: "16/9",
    alt: "Klyro Developer Portfolio preview showcasing project cards, developer skills breakdown, and client contact integration",
    prompt: "Build a minimal developer portfolio with interactive project showcase, tech stack badges, and contact modal.",
  },
  {
    id: "ecommerce-store",
    title: "E-Commerce Store",
    category: "E-Commerce",
    image: "/showcase/ecommerce.png",
    aspect: "2/1",
    alt: "Klyro Modern E-Commerce Store preview with trending lifestyle catalog, category navigation, and shopping bag integration",
    prompt: "Design a high-converting e-commerce storefront for homeware products with product grid, cart drawer, and checkout.",
  },
  {
    id: "fitness-studio",
    title: "Fitness Studio Landing",
    category: "Fitness Studio",
    image: "/showcase/fitness.png",
    aspect: "16/9",
    alt: "Klyro Fitness Studio Landing Page preview with class schedules, trainer highlights, membership tiers, and mobile app preview",
    prompt: "Build a fitness studio landing page with class schedule, coach bios, membership tiers, and free trial booking.",
  },
];

export function WhatYouCanBuildSection() {
  function handleCardClick(promptText: string) {
    const hero = document.getElementById("hero-builder");
    if (hero) {
      hero.scrollIntoView({ behavior: "smooth" });
      const input = document.getElementById("hero-prompt-input") as HTMLTextAreaElement | HTMLInputElement | null;
      if (input) {
        input.value = promptText;
        input.focus();
        // Trigger React change event if needed
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
  }

  return (
    <section
      id="what-you-can-build"
      aria-label="What You Can Build"
      className="relative scroll-mt-20 border-t border-slate-800/80 bg-[#0B0F19] py-20 text-slate-100 lg:py-28 overflow-hidden"
    >
      {/* Subtle purple & blue ambient background glows matching Klyro aesthetic */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-blue-600/10 blur-[130px]"
      />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            {/* Header pill badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400 mb-3.5 shadow-xs">
              <span>Showcase</span>
            </div>

            {/* Main Section Heading */}
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              What You Can Build
            </h2>

            {/* Supporting Copy */}
            <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mx-auto">
              Turn your ideas into beautiful, production-ready websites with Klyro.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Showcase Slider Container with Subtle Edge Fades */}
      <div className="relative mt-12 sm:mt-16 w-full">
        {/* Subtle Left Edge Fade Mask */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 sm:w-24 md:w-36 lg:w-48 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-transparent"
        />

        {/* Subtle Right Edge Fade Mask */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 sm:w-24 md:w-36 lg:w-48 bg-gradient-to-l from-[#0B0F19] via-[#0B0F19]/80 to-transparent"
        />

        {/* Motion Primitives Infinite Slider */}
        <InfiniteSlider
          speed={70}
          speedOnHover={15}
          gap={24}
          className="py-4"
        >
          {SHOWCASE_ITEMS.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick(item.prompt)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick(item.prompt);
                }
              }}
              aria-label={`Build ${item.title} with Klyro`}
              className="group relative flex flex-col shrink-0 w-[84vw] sm:w-[480px] md:w-[560px] lg:w-[660px] xl:w-[720px] 2xl:w-[760px] rounded-[22px] border border-slate-800/80 bg-[#0F172A]/90 backdrop-blur-md shadow-2xl shadow-black/80 overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-indigo-500/50 hover:shadow-[0_12px_45px_-10px_rgba(99,102,241,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
            >
              {/* Large Desktop Website Preview */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#070B16]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 85vw, (max-width: 1024px) 560px, 760px"
                  className={cn(
                    "transition-transform duration-500 ease-out group-hover:scale-[1.015]",
                    item.aspect === "2/1" ? "object-contain" : "object-cover object-top"
                  )}
                  priority={item.id === "saas-analytics"}
                />
              </div>

              {/* Subtle Category Label Bar */}
              <div className="flex items-center justify-between px-5 py-3 bg-[#0B0F19]/90 border-t border-slate-800/70 transition-colors duration-200 group-hover:bg-[#0D1426]">
                <span className="text-xs sm:text-sm font-medium text-slate-300 transition-colors duration-200 group-hover:text-white">
                  {item.category}
                </span>
                <span className="text-[11px] font-medium text-slate-500 transition-colors duration-200 group-hover:text-indigo-400 flex items-center gap-1">
                  <span>Build This</span>
                  <ArrowUpRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}
