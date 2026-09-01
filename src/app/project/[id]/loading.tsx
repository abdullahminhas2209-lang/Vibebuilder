export default function ProjectLoading() {
  return (
    <div className="flex h-dvh flex-col bg-background">
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-4">
        <div className="size-7 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
        <div className="ml-auto flex gap-2">
          <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
          <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="hidden w-[300px] shrink-0 border-r border-border bg-card p-4 lg:block lg:w-[320px]">
          <div className="h-4 w-12 animate-pulse rounded-md bg-muted" />
          <div className="mt-4 space-y-3">
            <div className="ml-auto h-10 w-4/5 animate-pulse rounded-lg bg-muted" />
            <div className="h-10 w-4/5 animate-pulse rounded-lg bg-muted" />
            <div className="h-10 w-3/5 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
          <div className="mt-3 h-[calc(100%-3.5rem)] animate-pulse rounded-lg border border-border bg-card" />
        </div>
        <div className="hidden w-[260px] shrink-0 border-l border-border bg-card p-4 lg:block">
          <div className="h-4 w-12 animate-pulse rounded-md bg-muted" />
          <div className="mt-4 space-y-2">
            <div className="h-3.5 w-3/4 animate-pulse rounded-md bg-muted" />
            <div className="h-3.5 w-2/3 animate-pulse rounded-md bg-muted" />
            <div className="h-3.5 w-1/2 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
