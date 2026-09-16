export default function ProjectLoading() {
  return (
    <div className="flex h-dvh flex-col bg-ink text-cream">
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-line bg-ink px-4">
        <div className="size-7 animate-pulse rounded-sm bg-ink-raised border border-slate-line" />
        <div className="h-4 w-32 animate-pulse rounded-sm bg-ink-raised" />
        <div className="ml-auto flex gap-2">
          <div className="h-8 w-20 animate-pulse rounded-sm bg-ink-raised border border-slate-line" />
          <div className="h-8 w-24 animate-pulse rounded-sm bg-amber/30" />
        </div>
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="hidden w-[330px] shrink-0 border-r border-slate-line bg-ink p-4 lg:block lg:w-[360px]">
          <div className="h-4 w-16 animate-pulse rounded-sm bg-ink-raised" />
          <div className="mt-6 space-y-4">
            <div className="ml-auto h-12 w-4/5 animate-pulse rounded-md bg-amber/15 border border-amber/20" />
            <div className="h-16 w-4/5 animate-pulse rounded-md bg-ink-raised border border-slate-line" />
            <div className="ml-auto h-10 w-3/5 animate-pulse rounded-md bg-amber/15 border border-amber/20" />
          </div>
        </div>
        <div className="flex-1 p-4 bg-ink">
          <div className="h-8 w-40 animate-pulse rounded-sm bg-ink-raised border border-slate-line" />
          <div className="mt-3 h-[calc(100%-3.5rem)] animate-pulse rounded-md border border-slate-line bg-ink-raised" />
        </div>
        <div className="hidden w-[260px] shrink-0 border-l border-slate-line bg-ink p-4 lg:block">
          <div className="h-4 w-12 animate-pulse rounded-sm bg-ink-raised" />
          <div className="mt-4 space-y-2">
            <div className="h-3.5 w-3/4 animate-pulse rounded-sm bg-ink-raised" />
            <div className="h-3.5 w-2/3 animate-pulse rounded-sm bg-ink-raised" />
            <div className="h-3.5 w-1/2 animate-pulse rounded-sm bg-ink-raised" />
          </div>
        </div>
      </div>
    </div>
  );
}
