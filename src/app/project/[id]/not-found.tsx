import Link from "next/link";
import { FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ProjectNotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-card">
        <FileQuestion className="size-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <h1 className="mt-4 text-lg font-semibold">Project not found</h1>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        This project doesn&apos;t exist or may have been removed. It might
        also be a placeholder from the prototype.
      </p>
      <div className="mt-6 flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
        <Button asChild>
          <Link href="/project/demo">Open demo workspace</Link>
        </Button>
      </div>
    </main>
  );
}
