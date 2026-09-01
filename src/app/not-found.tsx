import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-card">
        <Compass className="size-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <h1 className="mt-4 text-lg font-semibold">Page not found</h1>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        The page or project you&apos;re looking for doesn&apos;t exist or may
        have been removed.
      </p>
      <div className="mt-6 flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard">Open dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
