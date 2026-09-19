"use client";

import { useState } from "react";
import { EXAMPLES_DATA, ExampleItem } from "@/data/examples";
import { Sparkles, ArrowUpRight, Terminal, Layers, Database, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function WhatYouCanBuildSection() {
  const [activeId, setActiveId] = useState<string>(EXAMPLES_DATA[0].id);

  const activeExample =
    EXAMPLES_DATA.find((item) => item.id === activeId) || EXAMPLES_DATA[0];

  function handleTryPrompt(promptText: string) {
    const hero = document.getElementById("hero-builder");
    if (hero) {
      hero.scrollIntoView({ behavior: "smooth" });
    }
    const input = document.getElementById(
      "hero-prompt-input"
    ) as HTMLTextAreaElement | null;
    if (input) {
      input.value = promptText;
      // Trigger input and change events so React state updates
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(promptText.length, promptText.length);
      }, 300);
    }
  }

  return (
    <section
      id="what-you-can-build"
      aria-label="Examples of what you can build"
      className="py-16 sm:py-24 bg-ink border-t border-slate-line scroll-mt-24"
    >
      <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="max-w-[720px] mb-10 sm:mb-12">
          <span className="font-mono text-xs uppercase tracking-wider text-amber font-medium block mb-2">
            Real Prompt Outputs
          </span>
          <h2 className="font-serif font-normal text-2xl sm:text-4xl lg:text-[40px] leading-[1.15] tracking-[-0.01em] text-cream">
            Prompt to working interface, six different ways
          </h2>
          <p className="mt-3.5 text-fog text-sm sm:text-base leading-relaxed max-w-[56ch]">
            Every project begins with a natural sentence. Klyro structures the pages, layouts, and interactive state in clean Next.js code.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-8 sm:mb-10 no-scrollbar border-b border-slate-line/60">
          {EXAMPLES_DATA.map((example) => {
            const isActive = example.id === activeId;
            return (
              <button
                key={example.id}
                type="button"
                onClick={() => setActiveId(example.id)}
                className={cn(
                  "px-3.5 py-2 rounded-[3px] text-xs sm:text-sm font-sans font-medium whitespace-nowrap transition-all duration-150 cursor-pointer select-none",
                  isActive
                    ? "bg-amber text-[#201404] shadow-xs"
                    : "text-fog hover:text-cream hover:bg-ink-raised"
                )}
              >
                {example.tabLabel}
              </button>
            );
          })}
        </div>

        {/* Active Example Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-ink-raised/40 border border-slate-line rounded-lg p-5 sm:p-8 lg:p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]">
          {/* Left Column: Browser Mockup */}
          <div className="lg:col-span-7">
            <div className="rounded-md overflow-hidden border border-slate-line bg-[#0f1118] shadow-2xl">
              {/* Browser Window Chrome */}
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-ink border-b border-slate-line">
                <span className="size-2 rounded-full bg-slate-line" />
                <span className="size-2 rounded-full bg-slate-line" />
                <span className="size-2 rounded-full bg-slate-line" />
                <span className="ml-2 flex-1 font-mono text-[11px] text-fog-dim bg-ink-raised rounded-[3px] px-2 py-0.5 border border-slate-line/50 truncate">
                  https://{activeExample.mockup.browserUrl}
                </span>
              </div>

              {/* Dynamic Browser Mockup Content */}
              <div className="p-5 sm:p-6 text-cream min-h-[290px] sm:min-h-[320px] flex flex-col justify-between">
                {activeExample.mockup.type === "analytics" && (
                  <div>
                    <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-line/50">
                      <div>
                        <span className="font-serif font-semibold text-cream text-base sm:text-lg">
                          {activeExample.mockup.appName}
                        </span>
                        <p className="text-[11px] text-fog-dim font-mono">Q3 Performance Snapshot</p>
                      </div>
                      <span className="text-[11px] font-mono text-amber bg-amber/10 border border-amber/25 px-2 py-0.5 rounded-[3px]">
                        Live sample data
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-5">
                      <div className="border border-slate-line bg-ink/70 rounded-[3px] p-2.5 sm:p-3">
                        <span className="block text-xs text-fog-dim">Net Revenue</span>
                        <b className="block text-base sm:text-lg font-serif text-cream mt-0.5">$38,420</b>
                        <span className="text-[10px] text-emerald-400 font-mono">+12.4% vs last mo</span>
                      </div>
                      <div className="border border-slate-line bg-ink/70 rounded-[3px] p-2.5 sm:p-3">
                        <span className="block text-xs text-fog-dim">Paid Users</span>
                        <b className="block text-base sm:text-lg font-serif text-cream mt-0.5">1,842</b>
                        <span className="text-[10px] text-emerald-400 font-mono">+8.1% vs last mo</span>
                      </div>
                      <div className="border border-slate-line bg-ink/70 rounded-[3px] p-2.5 sm:p-3">
                        <span className="block text-xs text-fog-dim">Churn</span>
                        <b className="block text-base sm:text-lg font-serif text-cream mt-0.5">1.9%</b>
                        <span className="text-[10px] text-fog-dim font-mono">-0.4% healthy</span>
                      </div>
                    </div>

                    <div className="h-20 rounded-[3px] border border-slate-line bg-ink/50 relative overflow-hidden flex items-end p-2">
                      <div className="w-full flex items-end gap-1.5 h-14">
                        {[40, 65, 45, 80, 55, 90, 75, 100, 85, 92, 78, 96].map((val, i) => (
                          <div
                            key={i}
                            style={{ height: `${val}%` }}
                            className="flex-1 bg-amber/30 rounded-t-xs hover:bg-amber transition-colors"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeExample.mockup.type === "restaurant" && (
                  <div>
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-line/50">
                      <span className="font-serif font-semibold text-lg text-cream">
                        {activeExample.mockup.appName}
                      </span>
                      <span className="font-mono text-[11px] text-fog">Dinner · 5:00 PM – 10:30 PM</span>
                    </div>
                    <div className="rounded-[3px] bg-ink/80 border border-slate-line p-3 mb-4">
                      <p className="font-serif text-sm text-cream mb-1">Wood-fired Hearth &amp; Seasonal Heritage Grain</p>
                      <p className="text-xs text-fog-dim">Reserve a table for your evening gathering</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                      <div className="rounded-[3px] border border-slate-line p-2 bg-ink/50">
                        <span className="text-fog-dim block text-[10px]">Tasting Menu</span>
                        <span className="text-amber">7 Courses · $95</span>
                      </div>
                      <div className="rounded-[3px] border border-slate-line p-2 bg-ink/50">
                        <span className="text-fog-dim block text-[10px]">Wine Pairing</span>
                        <span className="text-cream">Low-intervention · $55</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeExample.mockup.type === "store" && (
                  <div>
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-line/50">
                      <span className="font-serif font-semibold text-lg text-cream">
                        {activeExample.mockup.appName}
                      </span>
                      <span className="font-mono text-[11px] text-amber">Cart (2) · $142</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="rounded-[3px] border border-slate-line bg-ink/60 p-2 text-center">
                        <div className="h-16 rounded bg-slate-line/40 mb-2 flex items-center justify-center font-mono text-[10px] text-fog-dim">
                          Ceramic Vase
                        </div>
                        <span className="block text-xs font-medium text-cream">$48</span>
                      </div>
                      <div className="rounded-[3px] border border-slate-line bg-ink/60 p-2 text-center">
                        <div className="h-16 rounded bg-slate-line/40 mb-2 flex items-center justify-center font-mono text-[10px] text-fog-dim">
                          Linen Throw
                        </div>
                        <span className="block text-xs font-medium text-cream">$64</span>
                      </div>
                      <div className="rounded-[3px] border border-slate-line bg-ink/60 p-2 text-center">
                        <div className="h-16 rounded bg-slate-line/40 mb-2 flex items-center justify-center font-mono text-[10px] text-fog-dim">
                          Brass Carafe
                        </div>
                        <span className="block text-xs font-medium text-cream">$30</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeExample.mockup.type === "blog" && (
                  <div>
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-line/50">
                      <span className="font-serif font-semibold text-lg text-cream">
                        {activeExample.mockup.appName}
                      </span>
                      <span className="font-mono text-[11px] text-fog-dim">Issue #42 · Weekly</span>
                    </div>
                    <div className="space-y-2.5">
                      <div className="p-2.5 rounded-[3px] bg-ink/70 border border-slate-line">
                        <span className="font-mono text-[10px] text-amber uppercase tracking-wider">Architecture</span>
                        <p className="font-serif text-sm text-cream mt-0.5 font-medium">Why server components simplify state boundaries</p>
                        <span className="font-mono text-[10px] text-fog-dim mt-1 block">6 min read</span>
                      </div>
                      <div className="p-2.5 rounded-[3px] bg-ink/70 border border-slate-line">
                        <span className="font-mono text-[10px] text-amber uppercase tracking-wider">Design Systems</span>
                        <p className="font-serif text-sm text-cream mt-0.5 font-medium">Typography scale for technical documentation</p>
                        <span className="font-mono text-[10px] text-fog-dim mt-1 block">4 min read</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeExample.mockup.type === "ops" && (
                  <div>
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-line/50">
                      <span className="font-serif font-semibold text-lg text-cream">
                        {activeExample.mockup.appName}
                      </span>
                      <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-[3px]">
                        All systems operational
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      <div className="p-2.5 rounded-[3px] bg-ink/70 border border-slate-line">
                        <span className="font-mono text-fog-dim text-[10px] block">Active Workspaces</span>
                        <b className="font-serif text-base text-cream mt-1 block">24 projects</b>
                      </div>
                      <div className="p-2.5 rounded-[3px] bg-ink/70 border border-slate-line">
                        <span className="font-mono text-fog-dim text-[10px] block">Pending Reviews</span>
                        <b className="font-serif text-base text-cream mt-1 block">3 requests</b>
                      </div>
                    </div>
                  </div>
                )}

                {activeExample.mockup.type === "fitness" && (
                  <div>
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-line/50">
                      <span className="font-serif font-semibold text-lg text-cream">
                        {activeExample.mockup.appName}
                      </span>
                      <span className="font-mono text-[11px] text-amber">Today · 4 Classes</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-[3px] bg-ink/70 border border-slate-line">
                        <div>
                          <span className="font-serif font-medium text-cream block">07:00 AM · Sunrise Reformer</span>
                          <span className="font-mono text-[10px] text-fog-dim">Studio A · Coach Mara</span>
                        </div>
                        <span className="font-mono text-[10px] text-emerald-400">3 spots left</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-[3px] bg-ink/70 border border-slate-line">
                        <div>
                          <span className="font-serif font-medium text-cream block">12:30 PM · High-Tempo Conditioning</span>
                          <span className="font-mono text-[10px] text-fog-dim">Studio B · Coach Sean</span>
                        </div>
                        <span className="font-mono text-[10px] text-fog-dim">Waitlist</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-line/40 flex items-center justify-between text-[11px] font-mono text-fog-dim">
                  <span>Stack: Next.js + Tailwind CSS</span>
                  <span>Component export ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Prompt, Copy, Feature Bullets, and "Try this prompt" CTA */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Prompt box */}
              <div className="rounded-[3px] border border-slate-line bg-ink p-3 mb-4">
                <span className="font-mono text-[11px] text-amber uppercase tracking-wider block mb-1">
                  Prompt used
                </span>
                <p className="font-mono text-xs sm:text-sm text-cream select-all">
                  &ldquo;{activeExample.prompt}&rdquo;
                </p>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-normal text-cream leading-snug mb-3">
                {activeExample.headline}
              </h3>
              <p className="text-fog text-xs sm:text-sm leading-relaxed mb-5">
                {activeExample.description}
              </p>

              {/* Feature Bullets (clean dashes, no AI checkmark tell) */}
              <ul className="space-y-2.5 mb-6 text-xs sm:text-sm text-cream/90">
                {activeExample.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-amber select-none font-mono text-xs mt-0.5">—</span>
                    <span className="text-fog">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Try This Prompt Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleTryPrompt(activeExample.prompt)}
                className="inline-flex items-center justify-center gap-2 rounded-[3px] bg-amber hover:bg-amber-deep text-[#201404] px-4 py-2.5 font-sans font-medium text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
              >
                <span>Try this prompt</span>
                <ArrowUpRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Compact "Good to know: What Klyro generates (and what it doesn't)" module */}
        <div className="mt-12 rounded-lg border border-slate-line bg-ink-raised/30 p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-4">
            <ShieldCheck className="size-5 text-amber" />
            <h3 className="font-serif text-lg sm:text-xl font-normal text-cream">
              Good to know: What Klyro generates (and what you connect yourself)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-fog leading-relaxed mb-6 max-w-[70ch]">
            We believe in complete transparency about current platform scope. Klyro generates real, readable front-end code so you skip weeks of UI scaffolding:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 text-xs sm:text-sm">
            {/* What Klyro generates */}
            <div className="rounded-[3px] border border-slate-line bg-ink p-4">
              <div className="flex items-center gap-2 font-mono text-xs text-amber font-semibold uppercase tracking-wider mb-3">
                <Layers className="size-4 text-amber" />
                <span>What Klyro generates</span>
              </div>
              <ul className="space-y-2 text-fog">
                <li className="flex items-start gap-2">
                  <span className="text-amber font-mono text-xs select-none">—</span>
                  <span>Clean Next.js + Tailwind React components and page structures.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber font-mono text-xs select-none">—</span>
                  <span>Client-side interactive states (modals, tabs, filters, forms).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber font-mono text-xs select-none">—</span>
                  <span>Realistic sample mock datasets wired into components.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber font-mono text-xs select-none">—</span>
                  <span>Clean multi-file project source ready to export as a zip or commit.</span>
                </li>
              </ul>
            </div>

            {/* What you connect yourself */}
            <div className="rounded-[3px] border border-slate-line bg-ink p-4">
              <div className="flex items-center gap-2 font-mono text-xs text-fog font-semibold uppercase tracking-wider mb-3">
                <Database className="size-4 text-fog" />
                <span>What you connect yourself</span>
              </div>
              <ul className="space-y-2 text-fog">
                <li className="flex items-start gap-2">
                  <span className="text-fog-dim font-mono text-xs select-none">—</span>
                  <span>Production database instances (e.g. Supabase, PostgreSQL, PlanetScale).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fog-dim font-mono text-xs select-none">—</span>
                  <span>Live authentication providers (e.g. NextAuth, Clerk, Supabase Auth).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fog-dim font-mono text-xs select-none">—</span>
                  <span>Payment gateways and merchant accounts (e.g. Stripe, Lemon Squeezy).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fog-dim font-mono text-xs select-none">—</span>
                  <span>Third-party transactional email services (e.g. Resend, SendGrid).</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
