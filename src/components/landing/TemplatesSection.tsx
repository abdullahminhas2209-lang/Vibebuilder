"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Dumbbell,
  ExternalLink,
  ShoppingCart,
  Sparkles,
  UserRound,
  UtensilsCrossed,
} from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const TEMPLATE_CARDS = [
  {
    id: "restaurant-booking",
    title: "Ember & Oak Restaurant",
    category: "Hospitality & Dining",
    description: "Full-scale restaurant website with seasonal menu, wood-fired culinary story, and online table reservations.",
    icon: UtensilsCrossed,
    gradient: "from-amber-500 to-orange-600",
    tags: ["Reservations", "Menu Filter", "Responsive"],
  },
  {
    id: "saas-analytics",
    title: "Pulseboard Analytics",
    category: "SaaS & Dashboard",
    description: "Subscription analytics with revenue metrics, retention charts, team invite modals, and dark/light themes.",
    icon: BarChart3,
    gradient: "from-sky-500 to-indigo-600",
    tags: ["MRR Metrics", "SSO Settings", "Charts"],
  },
  {
    id: "personal-portfolio",
    title: "Jordan Lee Portfolio",
    category: "Personal & Creative",
    description: "Minimal developer portfolio showcasing open-source tools, writing articles, interactive experience timeline.",
    icon: UserRound,
    gradient: "from-violet-500 to-purple-600",
    tags: ["Project Grid", "Case Studies", "Contact"],
  },
  {
    id: "ecommerce-store",
    title: "Northwind Goods Store",
    category: "E-Commerce",
    description: "Modern homeware storefront with product catalog, cart drawer, instant checkout simulation, and responsive layout.",
    icon: ShoppingCart,
    gradient: "from-emerald-500 to-teal-600",
    tags: ["Cart Drawer", "Product Grid", "Checkout"],
  },
  {
    id: "fitness-landing",
    title: "Forge Fitness Coaching",
    category: "Fitness & Lifestyle",
    description: "High-conversion fitness studio landing page with coaching programs, movement assessment, and trial signup.",
    icon: Dumbbell,
    gradient: "from-rose-500 to-red-600",
    tags: ["Program Booking", "Trial CTA", "Reviews"],
  },
];

export function TemplatesSection() {
  return (
    <section id="templates" className="py-20 lg:py-28 border-t border-slate-800/80 bg-[#0B0F19] text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400 mb-3 shadow-xs">
                <Sparkles className="size-3.5 text-indigo-400" />
                <span>Starter Templates</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Ready-to-use Template Library
              </h2>
              <p className="mt-2 max-w-xl text-xs sm:text-sm text-slate-400 leading-relaxed">
                Kickstart your project with pre-built production architecture. Customize every detail with Klyro AI.
              </p>
            </div>

            {/* Gradient 'View All Templates' Button matching 'Build with Klyro' */}
            <Button
              asChild
              className="rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-xs sm:text-sm font-semibold text-white px-5 py-2.5 shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-blue-500 hover:scale-[1.02] transition-all"
            >
              <Link href="/dashboard" className="gap-2 flex items-center">
                <span>View All Templates</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </Reveal>

        {/* Template Cards Grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATE_CARDS.map((template, index) => (
            <Reveal key={template.id} delay={index * 50}>
              <Card className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0F172A]/90 text-slate-100 p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-indigo-500/50">
                <Link
                  href={`/project/${template.id}`}
                  className="absolute inset-0 z-0 focus-visible:ring-[3px] focus-visible:ring-indigo-500/50 focus-visible:outline-none"
                  aria-label={`Open template: ${template.title}`}
                />

                {/* Banner Gradient */}
                <div className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${template.gradient}`}>
                  <template.icon className="size-10 text-white/90 transition-transform duration-300 group-hover:scale-110 drop-shadow-md" />
                  <Badge className="absolute top-3 left-3 bg-black/40 text-white border-0 backdrop-blur-md text-[10px] font-semibold">
                    {template.category}
                  </Badge>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-base text-white group-hover:text-indigo-400 transition-colors">
                      {template.title}
                    </h3>
                    <ExternalLink className="size-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                  </div>

                  <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/80">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg bg-slate-950 border border-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
