import { Code2, Eye, MessageSquareText, Wand2 } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: MessageSquareText,
    title: "Prompt to UI",
    description:
      "Describe what you want in plain language and turn the idea into an interface.",
  },
  {
    icon: Code2,
    title: "AI Code Generation",
    description:
      "Eventually generate and modify application code for every part of your project.",
  },
  {
    icon: Eye,
    title: "Live Preview",
    description:
      "Eventually see changes immediately in a running application as it evolves.",
  },
  {
    icon: Wand2,
    title: "Iterative Editing",
    description:
      "Continue refining an application through natural-language instructions.",
  },
] as const;

export function Features() {
  return (
    <section id="features" className="border-t border-border bg-card/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-pretty sm:text-3xl">
              Everything you need to go from idea to interface
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              VibeBuilder is built around a single loop: describe, generate,
              preview, refine.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 80}>
              <Card className="group gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-5 shadow-xs backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-indigo-500/50 hover:shadow-[0_15px_30px_-10px_rgba(99,102,241,0.2)] hover:bg-white dark:hover:bg-slate-900">
                <CardHeader className="p-0 pb-1">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-inner transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-blue-600 group-hover:text-white group-hover:shadow-md group-hover:rotate-3">
                    <feature.icon className="size-5 transition-transform duration-300" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 mt-2">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
