import Link from "next/link";
import { FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ProjectNotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 text-center bg-ink text-cream font-sans">
      <div className="flex size-14 items-center justify-center rounded-md border border-slate-line bg-ink-raised shadow-inner">
        <FileQuestion className="size-6 text-amber" aria-hidden="true" />
      </div>
      <h1 className="mt-4 font-serif text-xl font-semibold text-cream">Project not found</h1>
      <p className="mt-1.5 max-w-sm text-xs text-fog leading-relaxed font-sans">
        This workspace doesn&apos;t exist or may have been removed. You can return to the
        dashboard or launch a fresh interactive demo workspace.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button
          variant="outline"
          className="rounded-sm border-slate-line bg-ink-raised text-cream hover:bg-ink-raised/80 hover:text-cream text-xs font-medium"
          asChild
        >
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
        <Button
          className="rounded-sm bg-amber text-[#14161f] hover:bg-amber-deep text-xs font-semibold shadow-xs"
          asChild
        >
          <Link href="/project/demo">Open demo workspace</Link>
        </Button>
      </div>
    </main>
  );
}
