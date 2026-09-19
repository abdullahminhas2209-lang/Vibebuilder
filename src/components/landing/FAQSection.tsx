"use client";

import { useState } from "react";
import { FAQ_DATA, getFaqPageJsonLd } from "@/data/faq";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAQSection() {
  // Store open items by their IDs; allow multiple or single open
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    [FAQ_DATA[0].id]: true, // First FAQ open by default for immediate discoverability
  });

  function toggleItem(id: string) {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  const faqSchema = getFaqPageJsonLd();

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      className="py-16 sm:py-24 bg-ink border-t border-slate-line scroll-mt-24"
    >
      {/* Schema.org FAQPage JSON-LD for rich crawler indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
        <div className="max-w-[720px] mb-12">
          <span className="font-mono text-xs uppercase tracking-wider text-amber font-medium block mb-2">
            Answers &amp; Technical Details
          </span>
          <h2 className="font-serif font-normal text-2xl sm:text-4xl lg:text-[40px] leading-[1.15] tracking-[-0.01em] text-cream">
            Frequently Asked Questions
          </h2>
          <p className="mt-3.5 text-fog text-sm sm:text-base leading-relaxed">
            Everything you need to know about code ownership, tech stack, generation boundaries, and exports.
          </p>
        </div>

        {/* Accessible Accordion List */}
        <div className="max-w-4xl divide-y divide-slate-line border-y border-slate-line">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = Boolean(openItems[item.id]);
            const headerId = `faq-header-${item.id}`;
            const panelId = `faq-panel-${item.id}`;

            return (
              <div key={item.id} className="py-5 sm:py-6">
                <h3>
                  <button
                    type="button"
                    id={headerId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleItem(item.id)}
                    className="w-full text-left flex items-start justify-between gap-4 group cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber rounded-[2px]"
                  >
                    <span className="flex items-baseline gap-3 text-base sm:text-lg font-serif font-normal text-cream group-hover:text-amber transition-colors leading-snug">
                      <span className="font-mono text-xs text-amber/80 font-normal select-none">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span>{item.question}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-6 rounded-[3px] border border-slate-line flex items-center justify-center shrink-0 text-fog group-hover:text-cream group-hover:border-fog transition-transform duration-200 mt-0.5",
                        isOpen ? "rotate-180 bg-ink-raised" : "rotate-0"
                      )}
                    >
                      <ChevronDown className="size-4" />
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  hidden={!isOpen}
                  className={cn(
                    "pt-3.5 pl-7 sm:pl-8 pr-4 text-xs sm:text-sm text-fog leading-relaxed transition-all duration-200",
                    isOpen ? "block" : "hidden"
                  )}
                >
                  <p>{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
