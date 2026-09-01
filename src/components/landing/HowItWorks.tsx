import { Eye, MessageSquare, RefreshCw, Sparkles } from "lucide-react";

import { Reveal } from "@/components/Reveal";

const steps = [
  {
    icon: MessageSquare,
    title: "Prompt",
    description: "Describe the application you want to build.",
  },
  {
    icon: Sparkles,
    title: "Generate",
    description: "The agent plans the interface and creates the code.",
  },
  {
    icon: Eye,
    title: "Preview",
    description: "See the running result immediately in the workspace.",
  },
  {
    icon: RefreshCw,
    title: "Refine",
    description: "Ask for changes in natural language and iterate.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-pretty sm:text-3xl">
              How it works
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Four steps, one continuous loop — from a sentence to a working
              interface.
            </p>
          </div>
        </Reveal>

        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => (
            <li key={step.title} className="relative">
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-5 left-14 hidden h-px w-[calc(100%-3.5rem)] bg-border lg:block"
                />
              )}
              <Reveal delay={index * 80}>
                <div className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-primary shadow-sm">
                  <step.icon className="size-4.5" aria-hidden="true" />
                </div>
                <p className="mt-4 text-xs font-medium text-primary uppercase">
                  Step {index + 1}
                </p>
                <h3 className="mt-1 text-base font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
