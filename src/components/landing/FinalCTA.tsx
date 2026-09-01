import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            Your next website starts with a prompt.
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Open the workspace and see what the VibeBuilder experience feels
            like.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/dashboard">
              Start Building
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
