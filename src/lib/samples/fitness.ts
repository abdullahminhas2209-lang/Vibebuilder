import type { ProjectFile } from "@/lib/types";
import { makeFooter, makeGlobals, makeLayout } from "@/lib/samples/shared";

/**
 * Sample source for the "Fitness Landing Page" project (Forge Athletics).
 * Phase 1 only: display data for the code panel, not a real file system.
 */
export const fitnessFiles: ProjectFile[] = [
  {
    path: "app/page.tsx",
    name: "page.tsx",
    language: "tsx",
    code: `import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Programs } from "@/components/Programs";
import { MembershipCTA } from "@/components/MembershipCTA";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Programs />
        <MembershipCTA />
      </main>
      <Footer />
    </div>
  );
}
`,
  },
  makeLayout(
    "Forge Athletics",
    "Forge Athletics — Strength club",
    "Coached strength training in the heart of the city.",
  ),
  makeGlobals("oklch(0.72 0.19 130)", "oklch(0.99 0.002 120)", "oklch(0.2 0.01 130)"),
  {
    path: "components/Navbar.tsx",
    name: "Navbar.tsx",
    language: "tsx",
    code: `const links = ["Programs", "Coaches", "Schedule", "Pricing"];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="/" className="text-lg font-bold uppercase tracking-wide">
          Forge
        </a>
        <ul className="hidden gap-8 text-sm text-zinc-600 md:flex">
          {links.map((label) => (
            <li key={label}>
              <a href="#" className="transition hover:text-zinc-900">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#join"
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          Free trial week
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
    <section className="bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-28 text-white">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-lime-300">
          Strength club · Downtown
        </p>
        <h1 className="mt-4 max-w-2xl text-5xl font-semibold leading-tight">
          Train with coaches who count every rep.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-zinc-300">
          Small-group barbell classes, individual programming, and a
          community that shows up at 6 a.m.
        </p>
        <div className="mt-10 flex gap-4">
          <a
            href="#join"
            className="rounded-full bg-lime-400 px-6 py-3 font-medium text-zinc-950"
          >
            Claim free week
          </a>
          <a href="#" className="rounded-full border border-zinc-600 px-6 py-3">
            See schedule
          </a>
        </div>
      </div>
    </section>
  );
}
`,
  },
  {
    path: "components/Programs.tsx",
    name: "Programs.tsx",
    language: "tsx",
    code: `const programs = [
  { name: "Foundations", detail: "4 weeks · 3 sessions / week", price: "$120" },
  { name: "Barbell club", detail: "Ongoing · coached", price: "$160" },
  { name: "Comp prep", detail: "12 weeks · individual", price: "$240" },
];

export function Programs() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl font-semibold">Programs</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {programs.map((program) => (
          <article
            key={program.name}
            className="rounded-2xl border border-zinc-200 p-6"
          >
            <h3 className="text-lg font-semibold">{program.name}</h3>
            <p className="mt-1 text-sm text-zinc-500">{program.detail}</p>
            <p className="mt-6 text-2xl font-semibold">
              {program.price}
              <span className="text-sm font-normal text-zinc-400"> /mo</span>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
`,
  },
  {
    path: "components/MembershipCTA.tsx",
    name: "MembershipCTA.tsx",
    language: "tsx",
    code: `export function MembershipCTA() {
  return (
    <section id="join" className="mx-auto max-w-6xl px-6 pb-24">
      <div className="rounded-3xl bg-zinc-900 px-10 py-16 text-center text-white">
        <h2 className="text-3xl font-semibold">Your first week is free</h2>
        <p className="mx-auto mt-4 max-w-md text-zinc-300">
          Three coached sessions, no card required. Meet the coaches and
          find your class.
        </p>
        <button className="mt-8 rounded-full bg-lime-400 px-8 py-3 font-medium text-zinc-950">
          Start free week
        </button>
      </div>
    </section>
  );
}
`,
  },
  makeFooter("Forge Athletics", ["Schedule", "Coaches", "Careers"], "Forge Athletics"),
];
