"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export function Hero() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/project/demo");
  }

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_55%_60%_at_50%_0%,oklch(0.94_0.03_277),transparent_70%)]"
      />

      <div className="mx-auto w-full max-w-6xl px-4 pt-16 pb-12 sm:px-6 sm:pt-24">
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className="animate-fade-up gap-1.5 rounded-full border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            <Sparkles className="size-3 text-primary" aria-hidden="true" />
            Early access prototype
          </Badge>
        </div>

        <h1
          className="animate-fade-up mx-auto mt-6 max-w-3xl text-center text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          style={{ animationDelay: "90ms" }}
        >
          Build websites by describing what you want.
        </h1>

        <p
          className="animate-fade-up mx-auto mt-5 max-w-2xl text-center text-base text-pretty text-muted-foreground sm:text-lg"
          style={{ animationDelay: "170ms" }}
        >
          Describe your idea in plain language. VibeBuilder will eventually
          turn it into a working interface you can preview, edit, and refine.
        </p>

        <form
          onSubmit={handleSubmit}
          className="animate-fade-up mx-auto mt-10 max-w-2xl"
          style={{ animationDelay: "250ms" }}
          aria-label="Start a new project from a description"
        >
          <div className="rounded-xl border border-border bg-card p-2 shadow-sm transition-shadow focus-within:ring-[3px] focus-within:ring-ring/25">
            <label htmlFor="hero-prompt" className="sr-only">
              Describe the website or app you want to build
            </label>
            <Textarea
              id="hero-prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Describe the website or app you want to build..."
              className="min-h-20 resize-none border-0 shadow-none focus-visible:ring-0"
            />
            <div className="flex items-center justify-between gap-3 px-2 pb-1">
              <p className="text-xs text-muted-foreground">
                Prototype — responses are simulated.
              </p>
              <Button type="submit" size="sm">
                Start Building
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </form>

        <div
          className="animate-fade-up mt-6 flex justify-center"
          style={{ animationDelay: "330ms" }}
        >
          <Button variant="outline" size="lg" asChild>
            <a href="#how-it-works">See How It Works</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
