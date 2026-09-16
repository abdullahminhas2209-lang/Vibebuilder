"use client";

export function WhatYouCanBuildSection() {
  return (
    <section
      id="showcase"
      aria-label="Showcase"
      className="py-[72px] sm:py-[108px] bg-ink border-t border-slate-line scroll-mt-20"
    >
      <div id="what-you-can-build" className="scroll-mt-20" />
      <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
        {/* Section Heading */}
        <div className="max-w-[640px] mb-14">
          <h2 className="font-serif font-normal text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.15] tracking-[-0.01em] text-cream">
            Two prompts, two very different apps
          </h2>
          <p className="mt-3.5 text-fog text-base max-w-[52ch]">
            The same tool, pointed at different problems.
          </p>
        </div>

        {/* Staggered Browser Showcases */}
        <div className="flex flex-col gap-16">
          {/* ITEM 1: SaaS Analytics Dashboard (Browser on Left, Text on Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            {/* Browser Window Chrome */}
            <div className="rounded-md overflow-hidden border border-slate-line bg-paper shadow-[0_30px_60px_-24px_rgba(0,0,0,0.55)]">
              {/* Traffic-light dots + URL bar chrome */}
              <div className="flex items-center gap-2 px-3 py-2.5 bg-paper-line border-b border-paper-line">
                <span className="size-2 rounded-full bg-black/20" />
                <span className="size-2 rounded-full bg-black/20" />
                <span className="size-2 rounded-full bg-black/20" />
                <span className="ml-2 flex-1 font-mono text-[11px] text-[#7c8091] bg-white rounded-[3px] px-2 py-0.5 shadow-xs">
                  instacore.app/dashboard
                </span>
              </div>

              {/* Browser Body Mockup */}
              <div className="p-5 text-ink">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-serif text-base font-semibold text-[#16181f]">InstaCore</h4>
                  <span className="text-[11px] text-[#7c8091] font-mono">Good morning, Alex</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 mb-3.5">
                  <div className="border border-paper-line rounded px-2.5 py-2">
                    <b className="block text-[15px] font-serif text-[#16181f]">$24,780</b>
                    <small className="text-[10.5px] text-[#7c8091]">Revenue</small>
                  </div>
                  <div className="border border-paper-line rounded px-2.5 py-2">
                    <b className="block text-[15px] font-serif text-[#16181f]">1,248</b>
                    <small className="text-[10.5px] text-[#7c8091]">Orders</small>
                  </div>
                  <div className="border border-paper-line rounded px-2.5 py-2">
                    <b className="block text-[15px] font-serif text-[#16181f]">3.24%</b>
                    <small className="text-[10.5px] text-[#7c8091]">Conversion</small>
                  </div>
                </div>

                <div className="h-16 rounded border border-paper-line bg-gradient-to-b from-amber/20 to-amber/0 relative overflow-hidden">
                  <div
                    className="absolute inset-x-0 bottom-0 h-[38%]"
                    style={{
                      background:
                        "repeating-linear-gradient(90deg, rgba(20,22,31,0.12) 0 8px, transparent 8px 20px)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Supporting Copy */}
            <div>
              <div className="font-mono text-[12.5px] text-amber mb-3">
                Prompt: &ldquo;SaaS analytics dashboard&rdquo;
              </div>
              <h3 className="font-serif font-normal text-[26px] sm:text-[28px] text-cream leading-[1.15] mb-3.5 max-w-[14ch]">
                Turn raw numbers into a decision
              </h3>
              <p className="text-fog text-[15.5px] max-w-[42ch] mb-4 leading-relaxed">
                Klyro built the revenue chart, order table, and conversion cards from one line describing the metrics that mattered.
              </p>
              <ul className="space-y-2">
                <li className="text-[14.5px] text-fog pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-fog-dim">
                  Live-updating charts wired to sample data
                </li>
                <li className="text-[14.5px] text-fog pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-fog-dim">
                  Sortable order table with status tags
                </li>
                <li className="text-[14.5px] text-fog pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-fog-dim">
                  Auth-ready layout for a real backend
                </li>
              </ul>
            </div>
          </div>

          {/* ITEM 2: Restaurant & Table Booking (Alternating: Text on Left, Browser on Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            {/* Supporting Copy (placed first on desktop) */}
            <div className="order-2 lg:order-1">
              <div className="font-mono text-[12.5px] text-amber mb-3">
                Prompt: &ldquo;restaurant site with table booking&rdquo;
              </div>
              <h3 className="font-serif font-normal text-[26px] sm:text-[28px] text-cream leading-[1.15] mb-3.5 max-w-[14ch]">
                A menu, a story, a way to book
              </h3>
              <p className="text-fog text-[15.5px] max-w-[42ch] mb-4 leading-relaxed">
                One sentence turned into a homepage, a menu with photography placeholders, and a working reservation form.
              </p>
              <ul className="space-y-2">
                <li className="text-[14.5px] text-fog pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-fog-dim">
                  Photo-first layout for dishes and interiors
                </li>
                <li className="text-[14.5px] text-fog pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-fog-dim">
                  Booking form with date and party size
                </li>
                <li className="text-[14.5px] text-fog pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-fog-dim">
                  Mobile layout adjusted automatically
                </li>
              </ul>
            </div>

            {/* Browser Window Chrome (placed second on desktop) */}
            <div className="order-1 lg:order-2 rounded-md overflow-hidden border border-slate-line bg-paper shadow-[0_30px_60px_-24px_rgba(0,0,0,0.55)]">
              {/* Traffic-light dots + URL bar chrome */}
              <div className="flex items-center gap-2 px-3 py-2.5 bg-paper-line border-b border-paper-line">
                <span className="size-2 rounded-full bg-black/20" />
                <span className="size-2 rounded-full bg-black/20" />
                <span className="size-2 rounded-full bg-black/20" />
                <span className="ml-2 flex-1 font-mono text-[11px] text-[#7c8091] bg-white rounded-[3px] px-2 py-0.5 shadow-xs">
                  dineo.restaurant
                </span>
              </div>

              {/* Browser Body Mockup */}
              <div className="p-5 text-ink">
                <div className="h-[120px] rounded bg-[#dcd4bd] mb-3.5 relative flex items-end p-2.5">
                  <span className="font-serif text-base font-semibold text-[#2a2410]">Dineo</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-11 rounded bg-paper-line" />
                  <div className="h-11 rounded bg-paper-line" />
                  <div className="h-11 rounded bg-paper-line" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
