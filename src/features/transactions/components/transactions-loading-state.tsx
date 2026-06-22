export function TransactionsLoadingState() {
  const summarySkeletonKeys = ['income', 'expense', 'balance'] as const;
  const filterSkeletonKeys = [
    'type',
    'category',
    'startDate',
    'endDate',
  ] as const;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-3">
        {summarySkeletonKeys.map((key) => (
          <div
            className="rounded-3xl border border-white/80 bg-card px-5 py-5 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.22)]"
            key={key}
          >
            <div className="flex items-center gap-4">
              <div className="size-14 animate-pulse rounded-full bg-muted-surface" />
              <div className="space-y-2">
                <div className="h-4 w-20 animate-pulse rounded bg-muted-surface" />
                <div className="h-8 w-32 animate-pulse rounded bg-muted-surface" />
                <div className="h-4 w-24 animate-pulse rounded bg-muted-surface" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[1.75rem] border border-white/80 bg-card p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.22)]">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-muted-surface" />
        <div className="grid gap-4 xl:grid-cols-4">
          {filterSkeletonKeys.map((key) => (
            <div
              className="h-24 animate-pulse rounded-2xl bg-muted-surface/70"
              key={key}
            />
          ))}
        </div>
        <div className="mt-6 h-72 animate-pulse rounded-3xl bg-muted-surface/70" />
      </div>
    </div>
  );
}
