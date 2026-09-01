import type { ProjectFile } from "@/lib/types";
import { makeFooter, makeGlobals, makeLayout } from "@/lib/samples/shared";

/**
 * Sample source for the "Personal Portfolio" project (Atelier Noir).
 * Phase 1 only: display data for the code panel, not a real file system.
 */
export const portfolioFiles: ProjectFile[] = [
  {
    path: "app/page.tsx",
    name: "page.tsx",
    language: "tsx",
    code: `import { Navbar } from "@/components/Navbar";
import { WorkGrid } from "@/components/WorkGrid";
import { ContactCTA } from "@/components/ContactCTA";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <WorkGrid />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
}
`,
  },
  makeLayout(
    "Atelier Noir",
    "Atelier Noir — Product designer",
    "Selected product design work by Mara Ellison.",
  ),
  makeGlobals("oklch(0.55 0.14 165)", "oklch(0.99 0.003 160)", "oklch(0.2 0.02 165)"),
  {
    path: "components/Navbar.tsx",
    name: "Navbar.tsx",
    language: "tsx",
    code: `const links = ["Work", "About", "Writing", "Contact"];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <a href="/" className="text-sm font-semibold uppercase tracking-[0.2em]">
          Atelier Noir
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
          href="#contact"
          className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white"
        >
          Hire me
        </a>
      </nav>
    </header>
  );
}
`,
  },
  {
    path: "components/WorkGrid.tsx",
    name: "WorkGrid.tsx",
    language: "tsx",
    code: `const projects = [
  { title: "Ledger — fintech app", year: "2026", tone: "bg-emerald-100" },
  { title: "Cascade — design system", year: "2025", tone: "bg-stone-200" },
  { title: "Harbor — travel planner", year: "2025", tone: "bg-teal-100" },
  { title: "Signal — music player", year: "2024", tone: "bg-emerald-50" },
];

export function WorkGrid() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="max-w-xl text-4xl font-semibold tracking-tight">
        Product design work, selected with care.
      </h1>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <a key={project.title} href="#" className="group block">
            <div className={"h-48 rounded-2xl " + project.tone} />
            <div className="mt-3 flex items-baseline justify-between">
              <h2 className="font-medium group-hover:underline">
                {project.title}
              </h2>
              <span className="text-sm text-stone-500">{project.year}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
`,
  },
  {
    path: "components/ContactCTA.tsx",
    name: "ContactCTA.tsx",
    language: "tsx",
    code: `export function ContactCTA() {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 pb-24">
      <div className="rounded-3xl bg-stone-900 px-10 py-16 text-center text-white">
        <h2 className="text-3xl font-semibold">Let's work together</h2>
        <p className="mx-auto mt-4 max-w-md text-stone-300">
          I'm currently booking product design engagements for Q4 2026.
        </p>
        <button className="mt-8 rounded-full bg-emerald-500 px-8 py-3 font-medium text-stone-950">
          Start a conversation
        </button>
      </div>
    </section>
  );
}
`,
  },
  makeFooter("Atelier Noir", ["Work", "Writing", "About"], "Atelier Noir"),
];
