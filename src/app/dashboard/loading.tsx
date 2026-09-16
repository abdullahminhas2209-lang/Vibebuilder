import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="h-8 w-44 animate-pulse rounded-sm bg-ink-raised" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded-sm bg-ink-raised/60" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className="overflow-hidden rounded-md border border-slate-line bg-ink-raised"
            >
              <div className="h-28 animate-pulse bg-ink border-b border-slate-line" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-2/3 animate-pulse rounded-sm bg-ink" />
                <div className="h-3 w-full animate-pulse rounded-sm bg-ink/70" />
                <div className="h-3 w-1/2 animate-pulse rounded-sm bg-ink/50" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </DashboardShell>
  );
}
