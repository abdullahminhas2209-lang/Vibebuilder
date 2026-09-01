import type { ProjectFile } from "@/lib/types";

/**
 * Sample source for the "Restaurant Booking" project (Ember & Oak).
 * Phase 1 only: display data for the code panel, not a real file system.
 */
export const restaurantFiles: ProjectFile[] = [
  {
    path: "app/page.tsx",
    name: "page.tsx",
    language: "tsx",
    code: `import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeaturedDishes } from "@/components/FeaturedDishes";
import { ReservationCTA } from "@/components/ReservationCTA";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <FeaturedDishes />
        <ReservationCTA />
      </main>
      <Footer />
    </div>
  );
}
`,
  },
  {
    path: "app/layout.tsx",
    name: "layout.tsx",
    language: "tsx",
    code: `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ember & Oak — Seasonal cooking",
  description: "Modern restaurant with online reservations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
`,
  },
  {
    path: "app/globals.css",
    name: "globals.css",
    language: "css",
    code: `@import "tailwindcss";

:root {
  --brand: oklch(0.51 0.13 45);
  --surface: oklch(0.99 0.004 85);
  --ink: oklch(0.22 0.02 60);
}

body {
  background: var(--surface);
  color: var(--ink);
}
`,
  },
  {
    path: "components/Navbar.tsx",
    name: "Navbar.tsx",
    language: "tsx",
    code: `"use client";

const links = ["Menu", "Our story", "Private dining", "Contact"];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="/" className="text-lg font-semibold tracking-tight">
          Ember &amp; Oak
        </a>
        <ul className="hidden gap-8 text-sm text-stone-600 md:flex">
          {links.map((label) => (
            <li key={label}>
              <a href="#" className="transition hover:text-stone-900">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#reservations"
          className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white"
        >
          Reserve a table
        </a>
      </nav>
    </header>
  );
}
`,
  },
  {
    path: "components/Hero.tsx",
    name: "Hero.tsx",
    language: "tsx",
    code: `export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-stone-950">
      <div className="mx-auto max-w-6xl px-6 py-28 text-white">
        <p className="text-sm uppercase tracking-[0.2em] text-amber-200">
          Wood-fired kitchen
        </p>
        <h1 className="mt-4 max-w-2xl text-5xl font-semibold leading-tight">
          Seasonal cooking, warm hospitality.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-stone-300">
          A neighborhood restaurant serving live-fire dishes made from
          locally grown produce.
        </p>
        <div className="mt-10 flex gap-4">
          <a
            href="#reservations"
            className="rounded-full bg-amber-500 px-6 py-3 font-medium text-stone-950"
          >
            Book a table
          </a>
          <a
            href="#menu"
            className="rounded-full border border-stone-600 px-6 py-3"
          >
            View the menu
          </a>
        </div>
      </div>
    </section>
  );
}
`,
  },
  {
    path: "components/FeaturedDishes.tsx",
    name: "FeaturedDishes.tsx",
    language: "tsx",
    code: `const dishes = [
  { name: "Charred octopus", price: "$24", note: "Nduja, lemon, herbs" },
  { name: "Dry-aged ribeye", price: "$58", note: "Bone marrow butter" },
  { name: "Wood-oven flatbread", price: "$18", note: "Ricotta, hot honey" },
];

export function FeaturedDishes() {
  return (
    <section id="menu" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl font-semibold">Featured dishes</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {dishes.map((dish) => (
          <article
            key={dish.name}
            className="rounded-2xl border border-stone-200 p-6"
          >
            <div className="flex items-baseline justify-between">
              <h3 className="font-medium">{dish.name}</h3>
              <span>{dish.price}</span>
            </div>
            <p className="mt-2 text-sm text-stone-500">{dish.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
`,
  },
  {
    path: "components/ReservationCTA.tsx",
    name: "ReservationCTA.tsx",
    language: "tsx",
    code: `export function ReservationCTA() {
  return (
    <section id="reservations" className="mx-auto max-w-6xl px-6 pb-24">
      <div className="rounded-3xl bg-stone-900 px-10 py-16 text-center text-white">
        <h2 className="text-3xl font-semibold">Reserve your evening</h2>
        <p className="mx-auto mt-4 max-w-md text-stone-300">
          Tables are released 30 days in advance. Walk-ins welcome at the
          bar.
        </p>
        <button className="mt-8 rounded-full bg-amber-500 px-8 py-3 font-medium text-stone-950">
          Check availability
        </button>
      </div>
    </section>
  );
}
`,
  },
  {
    path: "components/Footer.tsx",
    name: "Footer.tsx",
    language: "tsx",
    code: `export function Footer() {
  return (
    <footer className="border-t border-stone-200 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold">Ember &amp; Oak</p>
        <nav className="flex gap-6 text-sm text-stone-500">
          <a href="#">Instagram</a>
          <a href="#">Private events</a>
          <a href="#">Careers</a>
        </nav>
        <p className="text-sm text-stone-400">
          &copy; 2026 Ember &amp; Oak
        </p>
      </div>
    </footer>
  );
}
`,
  },
];
