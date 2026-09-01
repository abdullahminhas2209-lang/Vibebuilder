import { FileCode2, Folder, FolderOpen } from "lucide-react";

import { Reveal } from "@/components/Reveal";

/**
 * Static, decorative representation of the VibeBuilder workspace used on
 * the landing page. It mirrors the real workspace layout (chat, preview,
 * files) without rendering the interactive components.
 */
export function ProductPreview() {
  return (
    <section
      aria-label="VibeBuilder workspace preview"
      className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6"
    >
      <Reveal>
      <div
        aria-hidden="true"
        className="overflow-hidden rounded-xl border border-border bg-card shadow-xl shadow-black/5"
      >
        {/* Window chrome */}
        <div className="flex h-10 items-center gap-2 border-b border-border bg-muted/50 px-4">
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="mx-auto rounded-md bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground ring-1 ring-border">
            VibeBuilder — Restaurant Booking
          </span>
          <span className="hidden text-[11px] text-muted-foreground sm:block">
            Saved
          </span>
        </div>

        <div className="grid sm:grid-cols-[180px_1fr_160px] lg:grid-cols-[220px_1fr_200px]">
          {/* Chat panel */}
          <div className="hidden flex-col gap-3 border-r border-border p-3 sm:flex">
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              Chat
            </p>
            <div className="ml-auto max-w-[85%] rounded-lg rounded-br-sm bg-primary px-2.5 py-2 text-[11px] leading-snug text-primary-foreground">
              Build a modern restaurant website with online reservations.
            </div>
            <div className="max-w-[90%] rounded-lg rounded-bl-sm bg-muted px-2.5 py-2 text-[11px] leading-snug">
              I&apos;ll structure the homepage, menu section, and reservation
              flow.
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="size-1.5 animate-pulse rounded-full bg-primary" />
              Preparing the workspace...
            </div>
            <div className="mt-auto rounded-lg border border-border bg-background px-2.5 py-2 text-[10px] text-muted-foreground">
              Describe a change...
            </div>
          </div>

          {/* Preview panel */}
          <div className="border-border sm:border-r">
            <div className="flex h-8 items-center gap-2 border-b border-border px-3">
              <span className="size-2 rounded-full bg-border" />
              <span className="flex-1 truncate rounded-md bg-muted/70 px-2 py-0.5 text-[10px] text-muted-foreground">
                restaurant-booking.preview.vibebuilder.app
              </span>
              <span className="size-2 rounded-full bg-border" />
            </div>
            <div className="bg-white">
              <div className="flex items-center justify-between border-b border-stone-100 px-4 py-2.5">
                <span className="text-[11px] font-semibold text-stone-900">
                  Ember &amp; Oak
                </span>
                <span className="flex items-center gap-2">
                  <span className="hidden h-1.5 w-8 rounded-full bg-stone-200 sm:block" />
                  <span className="hidden h-1.5 w-8 rounded-full bg-stone-200 sm:block" />
                  <span className="h-4 w-14 rounded-full bg-stone-900" />
                </span>
              </div>
              <div className="bg-stone-950 px-5 py-7">
                <p className="h-1.5 w-16 rounded-full bg-amber-200/80" />
                <p className="mt-2.5 h-3 w-4/5 rounded-full bg-stone-700" />
                <p className="mt-1.5 h-3 w-3/5 rounded-full bg-stone-700" />
                <p className="mt-1.5 h-2 w-2/5 rounded-full bg-stone-600" />
                <div className="mt-4 flex gap-2">
                  <span className="h-5 w-16 rounded-full bg-amber-500" />
                  <span className="h-5 w-16 rounded-full border border-stone-600" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2.5 px-4 py-4">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-stone-200 p-2.5"
                  >
                    <div className="h-8 rounded-md bg-gradient-to-br from-amber-100 to-stone-200" />
                    <p className="mt-2 h-1.5 w-3/4 rounded-full bg-stone-300" />
                    <p className="mt-1 h-1.5 w-1/2 rounded-full bg-stone-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Files panel */}
          <div className="hidden flex-col gap-1 p-3 sm:flex">
            <p className="mb-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              Files
            </p>
            <p className="flex items-center gap-1.5 rounded-md bg-accent px-2 py-1 text-[11px] text-accent-foreground">
              <FolderOpen className="size-3" aria-hidden="true" />
              app
            </p>
            <p className="flex items-center gap-1.5 rounded-md bg-accent/60 py-1 pr-2 pl-5 text-[11px] text-accent-foreground">
              <FileCode2 className="size-3" aria-hidden="true" />
              page.tsx
            </p>
            <p className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-muted-foreground">
              <Folder className="size-3" aria-hidden="true" />
              components
            </p>
            <p className="flex items-center gap-1.5 py-1 pl-5 text-[11px] text-muted-foreground">
              <FileCode2 className="size-3" aria-hidden="true" />
              Navbar.tsx
            </p>
            <p className="flex items-center gap-1.5 py-1 pl-5 text-[11px] text-muted-foreground">
              <FileCode2 className="size-3" aria-hidden="true" />
              Hero.tsx
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        The VibeBuilder workspace — chat with the agent, preview the result,
        and edit the files it generates.
      </p>
      </Reveal>
    </section>
  );
}
