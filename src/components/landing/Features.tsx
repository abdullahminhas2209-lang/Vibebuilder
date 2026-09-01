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
            <Reveal key={feature.title} delay={index * 70}>
              <Card className="gap-3 rounded-xl py-5 transition-shadow duration-300 hover:shadow-md">
                <CardHeader className="pb-0">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-primary">
                    <feature.icon className="size-4.5" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
